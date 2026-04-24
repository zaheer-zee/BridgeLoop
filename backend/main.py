import os
import json
import httpx
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from dotenv import load_dotenv
from playwright.async_api import async_playwright
from playwright_stealth import Stealth
from bs4 import BeautifulSoup

load_dotenv()

app = FastAPI(title="Bridgeloop Stealth Scraper API")

# Allow all origins so Next.js frontend and n8n can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
client = None
db = None

@app.on_event("startup")
async def startup_db_client():
    global client, db
    if MONGO_URI:
        client = AsyncIOMotorClient(MONGO_URI)
        # Creating a database named 'bridgeloop'
        db = client.bridgeloop
        print("Successfully connected to MongoDB!")
    else:
        print("Warning: MONGO_URI not set in .env file.")

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()

from typing import List, Optional
from datetime import datetime
import uuid

@app.get("/")
async def health_check():
    return {"status": "ok", "message": "Bridgeloop Stealth Scraper API is running"}

# --- DATABASE MODELS ---
class TrackRequest(BaseModel):
    url: str
    name: str

class TrackedItem(BaseModel):
    id: str
    url: str
    name: str
    created_at: datetime

class PriceLogRequest(BaseModel):
    tracked_item_id: str
    price: float
    sentiment: str
    summary: str

# --- MONGODB ENDPOINTS ---

@app.post("/track", response_model=TrackedItem)
async def add_tracked_item(request: TrackRequest):
    item = {
        "id": str(uuid.uuid4()),
        "url": request.url,
        "name": request.name,
        "created_at": datetime.utcnow()
    }
    await db.tracked_items.insert_one(item)
    return item

@app.get("/track", response_model=List[TrackedItem])
async def get_tracked_items():
    items = await db.tracked_items.find({}, {"_id": 0}).to_list(100)
    return items

@app.post("/history")
async def add_price_history(request: PriceLogRequest):
    log = {
        "id": str(uuid.uuid4()),
        "tracked_item_id": request.tracked_item_id,
        "price": request.price,
        "sentiment": request.sentiment,
        "summary": request.summary,
        "timestamp": datetime.utcnow()
    }
    await db.price_history.insert_one(log)
    return {"status": "success", "message": "Price history saved."}

@app.get("/history")
async def get_price_history(tracked_item_id: str = None):
    query = {}
    if tracked_item_id:
        query["tracked_item_id"] = tracked_item_id
    items = await db.price_history.find(query, {"_id": 0}).to_list(500)
    return items

@app.delete("/track/{item_id}")
async def delete_tracked_item(item_id: str):
    result = await db.tracked_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"status": "success", "message": "Item deleted."}

# --- SCRAPER ENDPOINT ---

class ScrapeRequest(BaseModel):
    url: str

@app.post("/scrape")
async def scrape_url(request: ScrapeRequest):
    try:
        async with Stealth().use_async(async_playwright()) as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context()
            page = await context.new_page()
            
            # Navigate to the URL and wait for DOM content to load
            await page.goto(request.url, wait_until="domcontentloaded", timeout=30000)
            
            # Get the full HTML
            html_content = await page.content()
            await browser.close()
            
            # Parse with BeautifulSoup to strip out all messy scripts and styles
            soup = BeautifulSoup(html_content, "html.parser")
            
            # Extract JSON-LD structured data first
            json_ld_data = []
            for script in soup.find_all("script", type="application/ld+json"):
                if script.string:
                    json_ld_data.append(script.string.strip())
            json_ld_text = "\n".join(json_ld_data)
            
            # Remove all script and style elements
            for script_or_style in soup(["script", "style", "noscript", "svg"]):
                script_or_style.decompose()
                
            # Get clean text, strip whitespace
            clean_text = soup.get_text(separator=' ', strip=True)
            
            # Limit to 15000 chars to avoid blowing up the Groq LLM context window limits
            # Prepend the JSON-LD data so the LLM has direct access to the hidden price tags
            final_text = (json_ld_text + "\n\n" + clean_text)[:15000]
            
            return {
                "status": "success", 
                "url": request.url, 
                "text": final_text
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- SMART CHAT ENDPOINT ---
# Reads all tracked items + price history from DB, builds context, calls Groq LLM.

class ChatRequest(BaseModel):
    query: str

@app.post("/chat")
async def smart_chat(request: ChatRequest):
    """Answer questions using tracked product data as context, then Groq LLM for general knowledge."""
    try:
        # 1. Pull all tracked items from DB
        items = await db.tracked_items.find({}, {"_id": 0}).to_list(100)
        history = await db.price_history.find({}, {"_id": 0}).sort("timestamp", -1).to_list(500)

        # 2. Build a rich context string from real data
        context_lines = ["=== BRIDGELOOP TRACKED PRODUCTS DATA ==="]
        for item in items:
            item_id = item["id"]
            item_history = [h for h in history if h["tracked_item_id"] == item_id]
            latest = item_history[0] if item_history else None
            context_lines.append(f"\nProduct: {item['name']}")
            context_lines.append(f"  URL: {item['url']}")
            if latest:
                context_lines.append(f"  Latest Price: ${latest['price']}")
                context_lines.append(f"  Sentiment: {latest['sentiment']}")
                context_lines.append(f"  AI Summary: {latest['summary']}")
                context_lines.append(f"  Last Scraped: {latest['timestamp']}")
                if len(item_history) > 1:
                    prices = [h["price"] for h in reversed(item_history) if h["price"] > 0]
                    if len(prices) > 1:
                        change = prices[-1] - prices[0]
                        context_lines.append(f"  Price History: {' → '.join([f'${p}' for p in prices])}")
                        context_lines.append(f"  Overall Change: {'↑' if change > 0 else '↓'} ${abs(change):.2f}")
            else:
                context_lines.append("  Price: Pending (not yet scraped)")

        context = "\n".join(context_lines)

        # 3. Call Groq LLM with context + user query
        async with httpx.AsyncClient(timeout=30.0) as http:
            r = await http.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "You are BridgeBot, an AI assistant for the BridgeLoop competitive intelligence platform. "
                                "You have access to real-time scraped product data from the user's dashboard shown below. "
                                "ALWAYS check the product data first to answer questions about prices, sentiment, or specific products. "
                                "If the answer is not in the data, use your general knowledge to help. "
                                "Be concise, friendly, and data-driven. Format prices with $ symbol.\n\n"
                                + context
                            )
                        },
                        {"role": "user", "content": request.query}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 500
                }
            )
        data = r.json()
        if "error" in data:
            return {"answer": f"Error from AI: {data['error']['message']}"}
        answer = data["choices"][0]["message"]["content"]
        return {"answer": answer}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- FULL PIPELINE ENDPOINT ---

# n8n calls this one endpoint; it scrapes every tracked item, calls Groq, and saves history.

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@app.post("/run-pipeline")
async def run_pipeline():
    """Scrape all tracked items, extract price/sentiment via Groq, and save to history."""
    results = []
    errors = []

    items = await db.tracked_items.find({}, {"_id": 0}).to_list(100)
    if not items:
        return {"status": "ok", "message": "No tracked items found.", "results": []}

    for item in items:
        item_id = item["id"]
        url = item["url"]
        name = item["name"]
        try:
            async with Stealth().use_async(async_playwright()) as p:
                browser = await p.chromium.launch(headless=True)
                context = await browser.new_context()
                page = await context.new_page()
                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                html_content = await page.content()
                await browser.close()

            soup = BeautifulSoup(html_content, "html.parser")
            
            # Extract JSON-LD structured data first
            json_ld_data = []
            for script in soup.find_all("script", type="application/ld+json"):
                if script.string:
                    json_ld_data.append(script.string.strip())
            json_ld_text = "\n".join(json_ld_data)

            for tag in soup(["script", "style", "noscript", "svg"]):
                tag.decompose()
            clean_text = soup.get_text(separator=' ', strip=True)
            
            final_text = (json_ld_text + "\n\n" + clean_text)[:3000]

            if len(final_text) < 10:
                errors.append({"item": name, "error": "Scraped text was empty"})
                continue

            groq_payload = {
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            'You are a product data extractor. Analyze the provided text from a product page. '
                            'Extract the exact price found in the text (as a float, e.g. 51.77) IN USD. If the price is in another currency, convert it to USD. '
                            'Extract the overall sentiment (positive/neutral/negative) and a 2-3 sentence AI summary. '
                            'CRITICAL: If the exact price IS found in the text, you MUST use that exact price. ONLY if the price is completely missing or 0, use your general internet knowledge to estimate a REALISTIC standard retail price for this exact product in USD. Never return 0.0 unless completely unknown. '
                            'Reply ONLY with a valid JSON object: '
                            '{"price": 51.77, "sentiment": "neutral", "summary": "Description here."}'
                        )
                    },
                    {"role": "user", "content": f"Product Name: {name}\nURL: {url}\n\nScraped Text (Includes JSON-LD):\n{final_text}"}
                ],
                "response_format": {"type": "json_object"}
            }
            await asyncio.sleep(4)
            async with httpx.AsyncClient(timeout=30.0) as http:
                r_groq = await http.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
                    json=groq_payload
                )
            groq_data = r_groq.json()
            if "error" in groq_data:
                errors.append({"item": name, "error": groq_data["error"]["message"]})
                continue

            llm_response = json.loads(groq_data["choices"][0]["message"]["content"])
            price = float(llm_response.get("price") or 0.0)
            sentiment = llm_response.get("sentiment") or "neutral"
            summary = llm_response.get("summary") or "No summary available."

            log = {
                "id": str(uuid.uuid4()),
                "tracked_item_id": item_id,
                "price": price,
                "sentiment": sentiment,
                "summary": summary,
                "timestamp": datetime.utcnow()
            }
            await db.price_history.insert_one(log)
            results.append({"item": name, "url": url, "price": price, "sentiment": sentiment})

        except Exception as e:
            errors.append({"item": name, "url": url, "error": str(e)})

    return {
        "status": "completed",
        "processed": len(results),
        "errors": len(errors),
        "results": results,
        "error_details": errors
    }


# --- ANTIGRAVITY RESEARCH CO-PILOT ENDPOINTS ---

class AntigravitySaveRequest(BaseModel):
    url: str
    key_findings: str
    propulsion_method: str
    trl: int
    sentiment: str
    summary: str

@app.get("/track_antigravity")
async def get_track_antigravity():
    return [
        {"url": "https://arxiv.org/search/?query=%22Woodward+effect%22&searchtype=all", "keyword": "Woodward effect"},
        {"url": "https://arxiv.org/search/?query=%22Alcubierre+drive%22&searchtype=all", "keyword": "Alcubierre drive"},
        {"url": "https://arxiv.org/search/?query=%22Casimir+cavity%22&searchtype=all", "keyword": "Casimir cavity"},
        {"url": "https://arxiv.org/search/?query=%22quantum+vacuum+plasma+thruster%22&searchtype=all", "keyword": "QVPT"},
        {"url": "https://arxiv.org/search/?query=%22EmDrive%22&searchtype=all", "keyword": "EmDrive"},
        {"url": "https://arxiv.org/search/?query=%22superfluid+vacuum+theory%22&searchtype=all", "keyword": "Superfluid vacuum"},
        {"url": "https://arxiv.org/search/?query=%22Lenz%27s+law+levitation%22&searchtype=all", "keyword": "Lenz's law"},
        {"url": "https://arxiv.org/search/?query=%22Mach-effect+thruster%22&searchtype=all", "keyword": "Mach-effect"},
        {"url": "https://arxiv.org/search/?query=%22Podkletnov+effect%22&searchtype=all", "keyword": "Podkletnov"},
        {"url": "https://arxiv.org/search/?query=%22Acoustic+levitation%22&searchtype=all", "keyword": "Acoustic levitation"},
    ]

@app.post("/scrape_antigravity")
async def scrape_antigravity_url(request: ScrapeRequest):
    try:
        async with Stealth().use_async(async_playwright()) as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context()
            page = await context.new_page()
            
            await page.goto(request.url, wait_until="domcontentloaded", timeout=30000)
            html_content = await page.content()
            await browser.close()
            
            soup = BeautifulSoup(html_content, "html.parser")
            for script_or_style in soup(["script", "style", "noscript", "svg"]):
                script_or_style.decompose()
                
            clean_text = soup.get_text(separator=' ', strip=True)
            truncated_text = clean_text[:5000]
            
            return {
                "status": "success", 
                "url": request.url, 
                "text": truncated_text
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save_research")
async def save_research(request: AntigravitySaveRequest):
    log = {
        "id": str(uuid.uuid4()),
        "url": request.url,
        "key_findings": request.key_findings,
        "propulsion_method": request.propulsion_method,
        "trl": request.trl,
        "sentiment": request.sentiment,
        "summary": request.summary,
        "timestamp": datetime.utcnow()
    }
    await db.antigravity_research.insert_one(log)
    return {"status": "success", "message": "Research saved."}

@app.get("/research")
async def get_research(keyword: str = None, min_trl: int = None):
    query = {}
    if keyword:
        query["$or"] = [
            {"summary": {"$regex": keyword, "$options": "i"}},
            {"key_findings": {"$regex": keyword, "$options": "i"}},
            {"propulsion_method": {"$regex": keyword, "$options": "i"}}
        ]
    if min_trl is not None:
        query["trl"] = {"$gte": min_trl}
        
    items = await db.antigravity_research.find(query, {"_id": 0}).sort("timestamp", -1).to_list(100)
    return items

class ChatRequest(BaseModel):
    query: str

@app.post("/chat_query")
async def chat_query(request: ChatRequest):
    items = await db.antigravity_research.find({}, {"_id": 0}).to_list(500)
    
    query_lower = request.query.lower()
    
    filtered_items = items
    if "woodward" in query_lower:
        filtered_items = [i for i in items if "woodward" in (i.get("propulsion_method", "") + i.get("summary", "")).lower()]
    elif "eagleworks" in query_lower or "nasa" in query_lower:
        filtered_items = [i for i in items if "eagleworks" in i.get("summary", "").lower() or ("nasa" in i.get("summary", "").lower())]
    elif "breakthrough" in query_lower:
        filtered_items = [i for i in items if "breakthrough" in i.get("summary", "").lower() or "breakthrough" in i.get("key_findings", "").lower()]
        
    chart_data = [{"name": i.get("propulsion_method", "Unknown")[0:15], "trl": i.get("trl", 0), "date": i.get("timestamp").isoformat()} for i in filtered_items if "timestamp" in i]
    
    if len(filtered_items) > 0:
        answer = f"I found {len(filtered_items)} relevant research items matching your query. Here is a brief overview: {filtered_items[0].get('summary', '')}"
    else:
        answer = "I couldn't find any specific research papers matching your query right now. Would you like me to trigger a fresh web scrape for you?"

    return {
        "status": "success",
        "answer": answer,
        "chart_data": chart_data,
        "papers": filtered_items
    }

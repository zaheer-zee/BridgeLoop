import os
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
            
            # Remove all script and style elements
            for script_or_style in soup(["script", "style", "noscript", "svg"]):
                script_or_style.decompose()
                
            # Get clean text, strip whitespace
            clean_text = soup.get_text(separator=' ', strip=True)
            
            # Limit to 5000 chars to avoid blowing up the Groq LLM context window limits
            truncated_text = clean_text[:5000]
            
            return {
                "status": "success", 
                "url": request.url, 
                "text": truncated_text
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

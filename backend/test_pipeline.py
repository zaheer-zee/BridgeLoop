import os
import httpx
import asyncio
from dotenv import load_dotenv
import json

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
BASE = "http://127.0.0.1:8001"

async def test_workflow():
    print("=" * 50)
    print("     BRIDGELOOP PIPELINE TEST")
    print("=" * 50)

    async with httpx.AsyncClient(timeout=60.0) as client:

        # ── Step 1: Add a scraping-friendly test URL ──────────────────
        print("\n[1/4] Seeding a scraping-friendly test URL...")
        seed = await client.post(f"{BASE}/track", json={
            "url": "https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html",
            "name": "Books Test Item"
        })
        item = seed.json()
        print(f"      ✓ Tracking: {item['url']}")
        item_id = item["id"]

        # ── Step 2: Scrape it ─────────────────────────────────────────
        print("\n[2/4] Running stealth scraper...")
        r_scrape = await client.post(f"{BASE}/scrape", json={"url": item["url"]})
        if r_scrape.status_code != 200:
            print(f"      ✗ Scraper error: {r_scrape.text}")
            return
        text = r_scrape.json().get("text", "")
        print(f"      ✓ Scraped {len(text)} characters of clean text.")
        print(f"      Preview: {text[:120]}...")

        if len(text) < 10:
            print("      ✗ Got empty text — aborting pipeline test.")
            return

        # ── Step 3: Groq LLM extraction ───────────────────────────────
        print("\n[3/4] Calling Groq LLM (Llama 3.1)...")
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        'You are a product data extractor. Analyze the provided text from a product page. '
                        'Extract the price (as a float, e.g. 51.77), overall sentiment of the page '
                        '(positive/neutral/negative), and a 1-sentence summary. '
                        'Reply ONLY with a valid JSON object: '
                        '{"price": 51.77, "sentiment": "neutral", "summary": "Product description here."}'
                    )
                },
                {"role": "user", "content": text[:4000]}
            ],
            "response_format": {"type": "json_object"}
        }
        r_groq = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )
        groq_data = r_groq.json()
        if "error" in groq_data:
            print(f"      ✗ Groq Error: {groq_data['error']['message']}")
            return

        raw_content = groq_data["choices"][0]["message"]["content"]
        llm_response = json.loads(raw_content)
        print(f"      ✓ LLM Extracted: {llm_response}")

        # ── Step 4: Save to MongoDB ───────────────────────────────────
        print("\n[4/4] Saving to MongoDB price_history...")
        price_raw = llm_response.get("price")
        price = float(price_raw) if price_raw is not None else 0.0

        history_payload = {
            "tracked_item_id": item_id,
            "price": price,
            "sentiment": llm_response.get("sentiment") or "neutral",
            "summary": llm_response.get("summary") or "No summary available."
        }
        r_hist = await client.post(f"{BASE}/history", json=history_payload)
        print(f"      ✓ DB Response: {r_hist.json()}")

        print("\n" + "=" * 50)
        print("  ✅ FULL PIPELINE TEST PASSED!")
        print("=" * 50)

if __name__ == "__main__":
    asyncio.run(test_workflow())

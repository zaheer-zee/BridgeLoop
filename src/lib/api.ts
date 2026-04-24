// Central API client — all backend calls go through here
// URL is set via NEXT_PUBLIC_API_URL in .env.local

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

// ngrok requires this header to bypass the browser warning page
const NGROK_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

// ── Types ──────────────────────────────────────────────

export interface TrackedItem {
  id: string;
  url: string;
  name: string;
  created_at: string;
}

export interface PriceHistory {
  id: string;
  tracked_item_id: string;
  price: number;
  sentiment: "positive" | "neutral" | "negative";
  summary: string;
  timestamp: string;
}

// ── Tracked Items ──────────────────────────────────────

export async function getTrackedItems(): Promise<TrackedItem[]> {
  const res = await fetch(`${API_URL}/track`, { headers: NGROK_HEADERS });
  if (!res.ok) throw new Error("Failed to fetch tracked items");
  return res.json();
}

export async function addTrackedItem(name: string, url: string): Promise<TrackedItem> {
  const res = await fetch(`${API_URL}/track`, {
    method: "POST",
    headers: NGROK_HEADERS,
    body: JSON.stringify({ name, url }),
  });
  if (!res.ok) throw new Error("Failed to add tracked item");
  return res.json();
}

export async function deleteTrackedItem(id: string): Promise<void> {
  await fetch(`${API_URL}/track/${id}`, {
    method: "DELETE",
    headers: NGROK_HEADERS,
  });
}

// ── Price History ──────────────────────────────────────

export async function getPriceHistory(tracked_item_id?: string): Promise<PriceHistory[]> {
  const url = tracked_item_id
    ? `${API_URL}/history?tracked_item_id=${tracked_item_id}`
    : `${API_URL}/history`;
  const res = await fetch(url, { headers: NGROK_HEADERS });
  if (!res.ok) throw new Error("Failed to fetch price history");
  return res.json();
}

// ── Scraper ────────────────────────────────────────────

export async function scrapeUrl(url: string): Promise<{ text: string }> {
  const res = await fetch(`${API_URL}/scrape`, {
    method: "POST",
    headers: NGROK_HEADERS,
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("Scraping failed");
  return res.json();
}

export async function runPipeline(): Promise<any> {
  const res = await fetch(`${API_URL}/run-pipeline`, {
    method: "POST",
    headers: NGROK_HEADERS,
  });
  if (!res.ok) throw new Error("Pipeline failed");
  return res.json();
}

"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, TrendingDown, TrendingUp, Bell, Smile, Globe, Network,
  AlertCircle, AlertTriangle, X, ArrowRight, Download, Search,
  ExternalLink, EyeOff, Building2, MapPin, Settings, ChevronDown,
  ChevronUp, Sparkles, Info, Loader2
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import { getTrackedItems, getPriceHistory, TrackedItem, PriceHistory } from "@/lib/api";

/* ─── Helpers ─── */
const GlassCard = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div className={`bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm ${className}`} onClick={onClick}>
    {children}
  </div>
);
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">{children}</h2>
);
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

/* ─── Page ─── */
export default function InsightsPage() {
  const [searchFilter, setSearchFilter] = useState("");
  
  // Live data from backend
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    Promise.all([getTrackedItems(), getPriceHistory()])
      .then(([items, history]) => { setTrackedItems(items); setPriceHistory(history); })
      .catch(() => {})
      .finally(() => setLoadingLive(false));
  }, []);

  // Build chart data from real history
  const priceTrendData = priceHistory.slice(-30).map((h) => ({
    date: new Date(h.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    price: h.price,
  }));

  // Sentiment from real data
  const total = priceHistory.length || 1;
  const sentimentCounts = priceHistory.reduce((acc, h) => { acc[h.sentiment] = (acc[h.sentiment] || 0) + 1; return acc; }, {} as Record<string, number>);
  const positiveScore = Math.round(((sentimentCounts.positive || 0) / total) * 100);

  // Real tracked items table
  const trackedTableData = trackedItems.map((item) => {
    const history = priceHistory.filter((h) => h.tracked_item_id === item.id);
    const latest = history[history.length - 1];
    return { name: item.name, url: item.url, price: latest ? `$${latest.price.toFixed(2)}` : "—", sentiment: latest?.sentiment || "—", summary: latest?.summary || "No analysis yet. Run scraper via n8n." };
  });
  const filteredTable = trackedTableData.filter((p) => p.name.toLowerCase().includes(searchFilter.toLowerCase()));

  // Build dynamic feed
  const visibleFeed = priceHistory.slice(-5).reverse().map((h, i) => {
    const item = trackedItems.find(t => t.id === h.tracked_item_id);
    return {
      id: i,
      name: item?.name || "Product",
      avatar: (item?.name || "P").charAt(0),
      time: new Date(h.timestamp).toLocaleString(),
      summary: h.summary,
      sentiment: h.sentiment === "positive" ? "Positive" : h.sentiment === "negative" ? "Negative" : "Neutral",
      oldPrice: null,
      newPrice: h.price ? `$${h.price.toFixed(2)}` : "$0.00",
      change: null
    };
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-7xl mx-auto space-y-10 pb-16">
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold mb-1">Market Insights</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Actionable competitive intelligence powered by AI analysis.</p>
      </motion.div>

      {/* KPI Bar */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Competitors Tracked</span>
            <Users className="w-5 h-5 text-[#2563EB]" />
          </div>
          <p className="text-3xl font-bold">{loadingLive ? "—" : trackedItems.length}</p>
          <p className="text-xs text-gray-500 mt-1">From your watchlist</p>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Price Snapshots</span>
            <TrendingDown className="w-5 h-5 text-[#10B981]" />
          </div>
          <p className="text-3xl font-bold text-[#10B981]">{loadingLive ? "—" : priceHistory.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total data points collected</p>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Alerts</span>
            <Bell className="w-5 h-5 text-[#F97316]" />
          </div>
          <p className="text-3xl font-bold">0</p>
          <p className="text-xs text-gray-500 mt-1">All caught up!</p>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sentiment Score</span>
            <Smile className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="flex items-end space-x-4">
            <p className="text-3xl font-bold">{loadingLive ? "—" : priceHistory.length > 0 ? `${positiveScore}%` : "—"}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">{priceHistory.length > 0 ? "Based on scraped history" : "Run n8n to collect data"}</p>
        </GlassCard>
      </motion.div>

      {/* Price Trends Chart — real data */}
      <motion.div variants={fadeUp}>
        <GlassCard className="p-6">
          <SectionTitle><TrendingUp className="w-5 h-5 text-[#2563EB]" /><span>Price History (Real Data)</span></SectionTitle>
          {loadingLive ? (
            <div className="h-72 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-cyan-400" /></div>
          ) : priceTrendData.length === 0 ? (
            <div className="h-72 flex flex-col items-center justify-center text-gray-400 space-y-2">
              <Globe className="w-10 h-10 opacity-20" />
              <p className="text-sm">No price history yet. Trigger the n8n workflow to collect data.</p>
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} interval={4} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} domain={["auto", "auto"]} />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.85)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="price" stroke="#2563EB" strokeWidth={3} dot={false} name="Price" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Tracked Competitors Table — real data */}
      <motion.div variants={fadeUp}>
        <GlassCard className="p-6">
          <SectionTitle><Network className="w-5 h-5 text-[#2563EB]" /><span>Your Tracked Competitors</span></SectionTitle>
          <div className="mb-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Filter competitors..." value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#2563EB]" />
          </div>
          {loadingLive ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-cyan-400" /></div>
          ) : filteredTable.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No competitors tracked yet. <a href="/dashboard/tracked" className="text-cyan-500 hover:underline">Add one →</a></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 text-xs uppercase tracking-wider">
                    <th className="pb-3 font-medium">Competitor</th>
                    <th className="pb-3 font-medium">Latest Price</th>
                    <th className="pb-3 font-medium">Sentiment</th>
                    <th className="pb-3 font-medium">AI Summary</th>
                    <th className="pb-3 font-medium">URL</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTable.map((p, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-3 font-semibold">{p.name}</td>
                      <td className="py-3 text-[#2563EB] font-bold">{p.price}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.sentiment === "positive" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : p.sentiment === "negative" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" : "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400"}`}>{p.sentiment}</span>
                      </td>
                      <td className="py-3 text-xs text-gray-500 max-w-xs truncate">{p.summary}</td>
                      <td className="py-3"><a href={p.url} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline flex items-center space-x-1 text-xs"><ExternalLink className="w-3 h-3" /><span>View</span></a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Competitor Feed */}
      <motion.div variants={fadeUp}>
        <GlassCard className="p-6">
          <SectionTitle><Globe className="w-5 h-5 text-[#F97316]" /><span>Recent Competitor Activity</span></SectionTitle>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {visibleFeed.map((item) => (
              <div key={item.id} className="flex space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center font-bold text-sm text-cyan-600 dark:text-cyan-400 flex-shrink-0">{item.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm truncate">{item.name}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{item.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.summary}</p>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.sentiment === "Positive" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : item.sentiment === "Negative" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" : "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400"}`}>{item.sentiment}</span>
                    {item.oldPrice && (<span className="text-xs text-gray-500"><span className="line-through">{item.oldPrice}</span> → <span className="font-bold text-green-600 dark:text-green-400">{item.newPrice}</span><span className="ml-1 text-green-600 dark:text-green-400 font-bold">({item.change})</span></span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Weekly Summary */}
      <motion.div variants={fadeUp}>
        <GlassCard className="p-6 border-[#2563EB]/20">
          <SectionTitle><Sparkles className="w-5 h-5 text-[#2563EB]" /><span>This Week&apos;s Summary</span></SectionTitle>
          <div className="bg-[#2563EB]/5 dark:bg-[#2563EB]/10 rounded-xl p-5 mb-4 border border-[#2563EB]/20">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2"><span className="text-[#2563EB] font-bold">•</span><span>You are tracking <b>{trackedItems.length}</b> competitor{trackedItems.length !== 1 ? "s" : ""} with <b>{priceHistory.length}</b> price snapshots collected.</span></li>
              <li className="flex items-start space-x-2"><span className="text-[#2563EB] font-bold">•</span><span>Positive sentiment rate: <b>{priceHistory.length > 0 ? `${positiveScore}%` : "—"}</b> across scraped data.</span></li>
              <li className="flex items-start space-x-2"><span className="text-[#2563EB] font-bold">•</span><span>Run the n8n workflow to collect today&apos;s pricing data and AI summaries.</span></li>
            </ul>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeUp} className="text-center pt-8 pb-4">
        <p className="text-xs text-gray-500 dark:text-gray-600 italic">Data updated by n8n workflow. Insights are based on publicly available information and AI analysis.</p>
        <p className="text-xs text-gray-400 mt-1">Last Updated: {new Date().toLocaleString()}</p>
      </motion.div>
    </motion.div>
  );
}

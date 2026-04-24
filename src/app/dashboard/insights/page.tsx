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

/* ─── Static UI mock data (activity feed & alerts) ─── */
const sentimentSparkline = [65, 68, 72, 70];
const competitorFeed = [
  { id: 1, name: "Urban Tech Solutions", avatar: "UT", time: "2 hours ago", summary: "Dropped ANC Headphones price from $155 to $145.", sentiment: "Negative", oldPrice: "$155.00", newPrice: "$145.00", change: "-6.5%" },
  { id: 2, name: "Green Leaf Organics", avatar: "GL", time: "5 hours ago", summary: "Launched new Organic Tea Collection. Reviews trending positive.", sentiment: "Positive", oldPrice: null, newPrice: null, change: null },
  { id: 3, name: "Apex Fitness Gear", avatar: "AF", time: "Yesterday", summary: "Running a 15% off sale on Yoga Mats.", sentiment: "Negative", oldPrice: "$52.00", newPrice: "$44.20", change: "-15.0%" },
];
const mockAlerts = [
  { id: 1, type: "urgent", icon: AlertCircle, text: "Product 'ANC Headphones' price dropped by 6.5% (Urban Tech Solutions)", time: "2 hours ago" },
  { id: 2, type: "warning", icon: AlertTriangle, text: "Negative sentiment increased by 22% for Apex Fitness Gear this week", time: "5 hours ago" },
  { id: 3, type: "info", icon: Info, text: "Green Leaf Organics launched a new product line — Organic Tea Collection", time: "Yesterday" },
];

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
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);
  const [showAllFeed, setShowAllFeed] = useState(false);
  const [alertsExpanded, setAlertsExpanded] = useState(true);

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

  const dismiss = (id: number) => setDismissedAlerts((prev) => [...prev, id]);
  const activeAlerts = mockAlerts.filter((a) => !dismissedAlerts.includes(a.id));
  const visibleFeed = showAllFeed ? competitorFeed : competitorFeed.slice(0, 3);

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
        <GlassCard className="p-5 cursor-pointer" onClick={() => document.getElementById("alerts-section")?.scrollIntoView({ behavior: "smooth" })}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Alerts</span>
            <Bell className="w-5 h-5 text-[#F97316]" />
          </div>
          <p className="text-3xl font-bold">{activeAlerts.length}</p>
          <p className="text-xs text-gray-500 mt-1">Click to review</p>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sentiment Score</span>
            <Smile className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="flex items-end space-x-4">
            <p className="text-3xl font-bold">{loadingLive ? "—" : priceHistory.length > 0 ? `${positiveScore}%` : "—"}</p>
            <div className="flex items-end space-x-1 pb-1">
              {sentimentSparkline.map((v, i) => (<div key={i} className="w-3 bg-[#10B981]/60 rounded-t-sm" style={{ height: `${v * 0.4}px` }} />))}
            </div>
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
          {!showAllFeed && competitorFeed.length > 3 && (
            <button onClick={() => setShowAllFeed(true)} className="mt-4 text-sm text-[#2563EB] hover:underline flex items-center space-x-1">
              <span>View All Activity</span><ArrowRight className="w-4 h-4" />
            </button>
          )}
        </GlassCard>
      </motion.div>

      {/* Alerts */}
      <motion.div variants={fadeUp} id="alerts-section">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setAlertsExpanded(!alertsExpanded)}>
            <SectionTitle>
              <Bell className="w-5 h-5 text-[#EF4444]" /><span>Active Alerts</span>
              <span className="ml-2 w-5 h-5 bg-[#EF4444] rounded-full text-white text-xs flex items-center justify-center font-bold">{activeAlerts.length}</span>
            </SectionTitle>
            <div className="flex items-center space-x-3">
              <button className="text-xs text-gray-500 hover:text-[#2563EB] flex items-center space-x-1"><Settings className="w-3 h-3" /><span>Settings</span></button>
              {alertsExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </div>
          </div>
          <AnimatePresence>
            {alertsExpanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-3 overflow-hidden">
                {activeAlerts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No active alerts. You&apos;re all caught up! 🎉</p>
                ) : (
                  activeAlerts.map((alert) => (
                    <div key={alert.id} className={`flex items-start space-x-3 p-4 rounded-xl border ${alert.type === "urgent" ? "border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/5" : alert.type === "warning" ? "border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/5" : "border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/5"}`}>
                      <alert.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${alert.type === "urgent" ? "text-[#EF4444]" : alert.type === "warning" ? "text-[#F97316]" : "text-[#2563EB]"}`} />
                      <div className="flex-1"><p className="text-sm font-medium">{alert.text}</p><span className="text-xs text-gray-400">{alert.time}</span></div>
                      <button onClick={() => dismiss(alert.id)} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition"><X className="w-4 h-4 text-gray-400" /></button>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
          <button className="px-5 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg font-medium text-sm flex items-center space-x-2 shadow-md hover:shadow-lg shadow-cyan-500/20 transition-all transition">
            <Download className="w-4 h-4" /><span>Download Full Report (PDF)</span>
          </button>
        </GlassCard>
      </motion.div>

      <motion.div variants={fadeUp} className="text-center pt-8 pb-4">
        <p className="text-xs text-gray-500 dark:text-gray-600 italic">Data updated by n8n workflow. Insights are based on publicly available information and AI analysis.</p>
        <p className="text-xs text-gray-400 mt-1">Last Updated: {new Date().toLocaleString()}</p>
      </motion.div>
    </motion.div>
  );
}

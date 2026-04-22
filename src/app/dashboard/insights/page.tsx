"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, TrendingDown, TrendingUp, Bell, Smile, Globe, Network,
  AlertCircle, AlertTriangle, X, ArrowRight, Download, Search,
  ExternalLink, EyeOff, Building2, MapPin, Settings, ChevronDown,
  ChevronUp, Sparkles, Info
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";

/* ─────────────── MOCK DATA ─────────────── */

// Generate 30 days of price trend data
const generatePriceTrends = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      yourPrice: +(22 + Math.random() * 6).toFixed(2),
      marketAvg: +(23 + Math.random() * 4).toFixed(2),
      networkAvg: +(21 + Math.random() * 5).toFixed(2),
    });
  }
  return data;
};
const priceTrends = generatePriceTrends();

const sentimentSparkline = [65, 68, 72, 70]; // last 4 weeks

const competitorFeed = [
  { id: 1, name: "Urban Tech Solutions", avatar: "UT", time: "2 hours ago", summary: "Dropped ANC Headphones price from $155 to $145 across their online store.", sentiment: "Negative", oldPrice: "$155.00", newPrice: "$145.00", change: "-6.5%" },
  { id: 2, name: "Green Leaf Organics", avatar: "GL", time: "5 hours ago", summary: "Launched new Organic Tea Collection. Reviews trending positive on social media.", sentiment: "Positive", oldPrice: null, newPrice: null, change: null },
  { id: 3, name: "Apex Fitness Gear", avatar: "AF", time: "Yesterday", summary: "Running a 15% off sale on Yoga Mats. Negative reviews about material quality emerging.", sentiment: "Negative", oldPrice: "$52.00", newPrice: "$44.20", change: "-15.0%" },
  { id: 4, name: "Brew Masters Co.", avatar: "BM", time: "2 days ago", summary: "Sourced premium Arabica beans from new supplier. Neutral market reaction so far.", sentiment: "Neutral", oldPrice: null, newPrice: null, change: null },
];

const comparisonProducts = [
  { name: "Artisan Dark Roast Coffee", yours: "$24.99", market: "$23.50", network: "$22.80", diff: "+6.3%", status: "Above Avg" },
  { name: "Noise-Cancelling Headphones V2", yours: "$149.00", market: "$155.00", network: "$151.00", diff: "-3.9%", status: "Competitive" },
  { name: "Organic Lavender Oil 50ml", yours: "$18.50", market: "$16.20", network: "$17.00", diff: "+14.2%", status: "Above Avg" },
  { name: "Premium Yoga Mat", yours: "$45.00", market: "$48.00", network: "$46.50", diff: "-6.3%", status: "Below Avg" },
];

const sentimentData = [
  { name: "Positive", value: 62, color: "#10B981" },
  { name: "Neutral", value: 24, color: "#6B7280" },
  { name: "Negative", value: 14, color: "#EF4444" },
];

const trackedBusinesses = [
  { id: 1, name: "Urban Tech Solutions", type: "Electronics", loc: "San Francisco, CA", avatar: "UT", lastActive: "2 hours ago" },
  { id: 2, name: "Green Leaf Organics", type: "Grocery", loc: "Portland, OR", avatar: "GL", lastActive: "5 hours ago" },
  { id: 3, name: "Apex Fitness Gear", type: "Retail", loc: "Austin, TX", avatar: "AF", lastActive: "1 day ago" },
  { id: 4, name: "Brew Masters Co.", type: "Cafe", loc: "Seattle, WA", avatar: "BM", lastActive: "3 days ago" },
];

const mockAlerts = [
  { id: 1, type: "urgent", icon: AlertCircle, text: "Product 'ANC Headphones' price dropped by 6.5% (Urban Tech Solutions)", time: "2 hours ago" },
  { id: 2, type: "warning", icon: AlertTriangle, text: "Negative sentiment increased by 22% for Apex Fitness Gear this week", time: "5 hours ago" },
  { id: 3, type: "info", icon: Info, text: "Green Leaf Organics launched a new product line — Organic Tea Collection", time: "Yesterday" },
];

/* ─────────── HELPER COMPONENTS ─────────── */

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">{children}</h2>
);

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ─────────────── PAGE ─────────────── */

export default function InsightsPage() {
  const [searchFilter, setSearchFilter] = useState("");
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);
  const [showAllFeed, setShowAllFeed] = useState(false);
  const [alertsExpanded, setAlertsExpanded] = useState(true);

  const dismiss = (id: number) => setDismissedAlerts((prev) => [...prev, id]);
  const activeAlerts = mockAlerts.filter((a) => !dismissedAlerts.includes(a.id));
  const filteredProducts = comparisonProducts.filter((p) =>
    p.name.toLowerCase().includes(searchFilter.toLowerCase())
  );
  const visibleFeed = showAllFeed ? competitorFeed : competitorFeed.slice(0, 3);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-7xl mx-auto space-y-10 pb-16">
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold mb-1">Market Insights</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Actionable competitive intelligence powered by AI analysis.</p>
      </motion.div>

      {/* ── SECTION 1: KPI Overview Bar ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Competitors Tracked</span>
            <Users className="w-5 h-5 text-[#2563EB]" />
          </div>
          <p className="text-3xl font-bold">12</p>
          <p className="text-xs text-gray-500 mt-1">+3 this month</p>
        </GlassCard>
        {/* Card 2 */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Avg Price Position</span>
            <TrendingDown className="w-5 h-5 text-[#10B981]" />
          </div>
          <p className="text-3xl font-bold text-[#10B981]">-3.2%</p>
          <p className="text-xs text-gray-500 mt-1">Below Market Avg — Competitive</p>
        </GlassCard>
        {/* Card 3 */}
        <GlassCard className="p-5 cursor-pointer" onClick={() => document.getElementById("alerts-section")?.scrollIntoView({ behavior: "smooth" })}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Alerts</span>
            <div className="relative">
              <Bell className="w-5 h-5 text-[#F97316]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#EF4444] rounded-full text-[8px] text-white flex items-center justify-center font-bold">{activeAlerts.length}</span>
            </div>
          </div>
          <p className="text-3xl font-bold">{activeAlerts.length}</p>
          <p className="text-xs text-gray-500 mt-1">Click to review</p>
        </GlassCard>
        {/* Card 4 */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sentiment Score</span>
            <Smile className="w-5 h-5 text-[#10B981]" />
          </div>
          <div className="flex items-end space-x-4">
            <p className="text-3xl font-bold">72%</p>
            <div className="flex items-end space-x-1 pb-1">
              {sentimentSparkline.map((v, i) => (
                <div key={i} className="w-3 bg-[#10B981]/60 rounded-t-sm" style={{ height: `${v * 0.4}px` }} />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Positive — 4-week trend</p>
        </GlassCard>
      </motion.div>

      {/* ── SECTION 2: Price Trends Line Chart ── */}
      <motion.div variants={fadeUp}>
        <GlassCard className="p-6">
          <SectionTitle>
            <TrendingUp className="w-5 h-5 text-[#2563EB]" />
            <span>Price Trends (Last 30 Days)</span>
          </SectionTitle>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B7280" }} interval={4} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(0,0,0,0.85)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                />
                <Line type="monotone" dataKey="yourPrice" stroke="#2563EB" strokeWidth={3} dot={false} name="Your Price" />
                <Line type="monotone" dataKey="marketAvg" stroke="#10B981" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Market Avg" />
                <Line type="monotone" dataKey="networkAvg" stroke="#6B7280" strokeWidth={2} strokeDasharray="2 2" dot={false} name="Network Avg" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">Your average price is 3.2% below market average — well positioned.</p>
        </GlassCard>
      </motion.div>

      {/* ── SECTION 3: Competitor Update Feed ── */}
      <motion.div variants={fadeUp}>
        <GlassCard className="p-6">
          <SectionTitle>
            <Globe className="w-5 h-5 text-[#F97316]" />
            <span>Recent Competitor Activity</span>
          </SectionTitle>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {visibleFeed.map((item) => (
              <div key={item.id} className="flex space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center font-bold text-sm text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                  {item.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm truncate">{item.name}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{item.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.summary}</p>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.sentiment === "Positive" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                      item.sentiment === "Negative" ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
                      "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400"
                    }`}>{item.sentiment}</span>
                    {item.oldPrice && (
                      <span className="text-xs text-gray-500">
                        <span className="line-through">{item.oldPrice}</span> → <span className="font-bold text-green-600 dark:text-green-400">{item.newPrice}</span>
                        <span className="ml-1 text-green-600 dark:text-green-400 font-bold">({item.change})</span>
                      </span>
                    )}
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

      {/* ── SECTION 4: Price Comparison Table ── */}
      <motion.div variants={fadeUp}>
        <GlassCard className="p-6">
          <SectionTitle>
            <Network className="w-5 h-5 text-[#2563EB]" />
            <span>Product Price Comparison</span>
          </SectionTitle>
          <div className="mb-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by product name..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 text-xs uppercase tracking-wider">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Your Price</th>
                  <th className="pb-3 font-medium">Market Avg</th>
                  <th className="pb-3 font-medium">Network Avg</th>
                  <th className="pb-3 font-medium">Difference</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition">
                    <td className="py-3 font-semibold">{p.name}</td>
                    <td className="py-3 text-[#2563EB] font-bold">{p.yours}</td>
                    <td className="py-3">{p.market}</td>
                    <td className="py-3">{p.network}</td>
                    <td className="py-3">
                      <span className={`font-bold ${p.diff.startsWith("-") ? "text-[#10B981]" : "text-[#EF4444]"}`}>{p.diff}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        p.status === "Competitive" ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                        p.status === "Below Avg" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
                        "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                      }`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

      {/* ── SECTION 5: Sentiment Distribution ── */}
      <motion.div variants={fadeUp}>
        <GlassCard className="p-6">
          <SectionTitle>
            <Smile className="w-5 h-5 text-[#10B981]" />
            <span>Sentiment Analysis (This Week)</span>
          </SectionTitle>
          
          {/* Stacked horizontal bar */}
          <div className="h-10 w-full rounded-full overflow-hidden flex mb-6 border border-white/10">
            {sentimentData.map((s) => (
              <div key={s.name} className="h-full flex items-center justify-center text-white text-xs font-bold" style={{ width: `${s.value}%`, backgroundColor: s.color }}>
                {s.value}%
              </div>
            ))}
          </div>

          {/* Three metric cards */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
              <p className="text-2xl font-bold text-[#10B981]">186</p>
              <p className="text-xs text-gray-500">Positive <TrendingUp className="w-3 h-3 inline text-[#10B981]" /> +8%</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-500/10 border border-gray-200 dark:border-gray-500/20">
              <p className="text-2xl font-bold text-[#6B7280]">72</p>
              <p className="text-xs text-gray-500">Neutral — stable</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <p className="text-2xl font-bold text-[#EF4444]">42</p>
              <p className="text-xs text-gray-500">Negative <TrendingDown className="w-3 h-3 inline text-[#EF4444]" /> +3%</p>
            </div>
          </div>

          {sentimentData[2].value > 13 && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">⚠️ Negative sentiment spike detected — review recent competitor updates.</p>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* ── SECTION 6: Tracked Businesses Watchlist ── */}
      <motion.div variants={fadeUp}>
        <SectionTitle>
          <EyeOff className="w-5 h-5 text-[#F97316]" />
          <span>Your Watchlist</span>
        </SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trackedBusinesses.map((b) => (
            <GlassCard key={b.id} className="p-5 hover:border-cyan-500/40 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center font-bold text-sm text-cyan-600 dark:text-cyan-400">{b.avatar}</div>
                <span className="text-[10px] text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded flex items-center space-x-1"><EyeOff className="w-3 h-3" /><span>Private</span></span>
              </div>
              <h4 className="font-bold text-sm mb-2">{b.name}</h4>
              <div className="space-y-1 text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-1"><Building2 className="w-3 h-3" /><span>{b.type}</span></div>
                <div className="flex items-center space-x-1"><MapPin className="w-3 h-3" /><span>{b.loc}</span></div>
                <p className="text-gray-400">Last active: {b.lastActive}</p>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 text-xs bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 py-1.5 rounded-lg font-medium hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition flex items-center justify-center space-x-1">
                  <span>View</span><ExternalLink className="w-3 h-3" />
                </button>
                <button className="px-3 text-xs border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 hover:text-red-500 hover:border-red-500/50 transition">Untrack</button>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* ── SECTION 7: Active Alerts ── */}
      <motion.div variants={fadeUp} id="alerts-section">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setAlertsExpanded(!alertsExpanded)}>
            <SectionTitle>
              <Bell className="w-5 h-5 text-[#EF4444]" />
              <span>Active Alerts</span>
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
                    <div key={alert.id} className={`flex items-start space-x-3 p-4 rounded-xl border ${
                      alert.type === "urgent" ? "border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/5" :
                      alert.type === "warning" ? "border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/5" :
                      "border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/5"
                    }`}>
                      <alert.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        alert.type === "urgent" ? "text-[#EF4444]" : alert.type === "warning" ? "text-[#F97316]" : "text-[#2563EB]"
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.text}</p>
                        <span className="text-xs text-gray-400">{alert.time}</span>
                      </div>
                      <button onClick={() => dismiss(alert.id)} className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition"><X className="w-4 h-4 text-gray-400" /></button>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>

      {/* ── SECTION 8: Weekly Insights Summary ── */}
      <motion.div variants={fadeUp}>
        <GlassCard className="p-6 border-[#2563EB]/20">
          <SectionTitle>
            <Sparkles className="w-5 h-5 text-[#2563EB]" />
            <span>This Week&apos;s Summary</span>
          </SectionTitle>
          <div className="bg-[#2563EB]/5 dark:bg-[#2563EB]/10 rounded-xl p-5 mb-4 border border-[#2563EB]/20">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2"><span className="text-[#2563EB] font-bold">•</span><span>Your average price is <b>3.2% below</b> the network average — well positioned.</span></li>
              <li className="flex items-start space-x-2"><span className="text-[#2563EB] font-bold">•</span><span><b>2 competitors</b> lowered prices this week (Urban Tech, Apex Fitness).</span></li>
              <li className="flex items-start space-x-2"><span className="text-[#2563EB] font-bold">•</span><span>Sentiment remains <b>72% positive</b> overall across your tracked network.</span></li>
              <li className="flex items-start space-x-2"><span className="text-[#2563EB] font-bold">•</span><span>Minor negative sentiment spike detected — mostly related to competitor product quality.</span></li>
            </ul>
          </div>
          <button className="px-5 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg font-medium text-sm flex items-center space-x-2 shadow-[0_0_10px_rgba(37,99,235,0.3)] transition">
            <Download className="w-4 h-4" /><span>Download Full Report (PDF)</span>
          </button>
        </GlassCard>
      </motion.div>

      {/* ── SECTION 9: Data Freshness Footer ── */}
      <motion.div variants={fadeUp} className="text-center pt-8 pb-4">
        <p className="text-xs text-gray-500 dark:text-gray-600 italic">
          Data updated every 6 hours. Insights are based on publicly available information and AI analysis. This is an assistive tool — always apply your own business judgment.
        </p>
        <p className="text-xs text-gray-400 mt-1">Last Updated: {new Date().toLocaleString()}</p>
      </motion.div>
    </motion.div>
  );
}

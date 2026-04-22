"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Flag, TrendingDown, Smile, AlertTriangle, ArrowRight } from 'lucide-react';

export default function DashboardOverview() {
  const defaultProducts = [
    { id: 1, name: "Artisan Dark Roast Coffee", sku: "CFF-DRK-1KG", mrp: "$24.99", current: "$24.99", variance: "+1.2%", sentiment: 88, sentText: "Positive" },
    { id: 2, name: "Noise-Cancelling Headphones V2", sku: "ELC-HP-V2", mrp: "$149.00", current: "$145.00", variance: "-4.0%", sentiment: 60, sentText: "Neutral" },
    { id: 3, name: "Organic Lavender Essential Oil", sku: "SKN-LAV-50M", mrp: "$18.50", current: "$18.50", variance: "+5.1%", sentiment: 82, sentText: "Positive" },
    { id: 4, name: "Premium Yoga Mat", sku: "FIT-YOG-01", mrp: "$45.00", current: "$45.00", variance: "-2.4%", sentiment: 68, sentText: "Neutral" }
  ];

  const [trackedProducts, setTrackedProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const rawIds = localStorage.getItem('trackedProducts');
    const catalogData = localStorage.getItem('catalogData');
    
    if (rawIds && catalogData) {
      const ids = JSON.parse(rawIds);
      const catalog = JSON.parse(catalogData);
      setTrackedProducts(catalog.filter((c: any) => ids.includes(c.id)).map((c: any) => ({
        ...c,
        mrp: c.price,
        current: c.price // For demo simulation
      })));
    } else {
      setTrackedProducts([defaultProducts[0], defaultProducts[3]]);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold mb-2">Overview</h1>
           <p className="text-gray-500 dark:text-gray-400">Your Bridgeloop Intelligence Feed & Tracked Assets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tracked Products Highlight */}
        <div className="lg:col-span-2 space-y-4">
           <h3 className="text-xl font-bold flex items-center space-x-2">
             <Flag className="text-cyan-500" />
             <span>Flagged Trackers</span>
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trackedProducts.map(prod => (
                <motion.div key={prod.id} whileHover={{ scale: 1.02 }} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
                   <div className="absolute top-4 right-4 text-cyan-500"><Flag className="w-5 h-5 fill-cyan-500/20" /></div>
                   <h4 className="font-bold text-lg pr-8">{prod.name}</h4>
                   <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 dark:bg-black/30 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                        <span className="block text-gray-500 text-xs mb-1">Current vs MRP</span>
                        <span className="font-bold text-lg">{prod.current}</span>
                        <span className="text-xs line-through text-gray-400 ml-2">{prod.mrp}</span>
                      </div>
                      <div className="bg-gray-50 dark:bg-black/30 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                        <span className="block text-gray-500 text-xs mb-1">Pricing Variance</span>
                        <span className={`font-bold text-lg flex items-center ${prod.variance.includes('-') ? 'text-green-500' : 'text-red-500'}`}>
                           <TrendingDown className="w-4 h-4 mr-1" /> {prod.variance}
                        </span>
                        <span className="text-xs text-gray-400">Industry Avg</span>
                      </div>
                   </div>
                   <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                     <span className="text-sm text-gray-500">Sentiment Index</span>
                     <div className="flex items-center space-x-2">
                        <Smile className={`w-4 h-4 ${prod.sentiment > 70 ? 'text-green-500' : 'text-yellow-500'}`} />
                        <span className="font-bold text-sm">{prod.sentiment}/100 ({prod.sentText})</span>
                     </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Intelligence Feed */}
        <div className="space-y-4">
           <h3 className="text-xl font-bold flex items-center space-x-2">
             <AlertTriangle className="text-orange-500" />
             <span>Intelligence Feed</span>
           </h3>
           <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col h-full space-y-6">
              {[
                { title: "Competitor Price Drop", desc: "Global API detected a 5% drop on specific Headphone models.", time: "2 hrs ago", tag: "Alert" },
                { title: "Sentiment Shift Detected", desc: "Negative reviews for Lavender Oil spiked across 3 major retail APIs.", time: "5 hrs ago", tag: "Warning" },
                { title: "Market Stabilization", desc: "Local competitor pricing for Coffee blends holds steady at $23.50.", time: "1 day ago", tag: "Note" },
              ].map((feed, i) => (
                <div key={i} className="flex space-x-4">
                   <div className="w-2 h-2 mt-2 bg-cyan-500 rounded-full flex-shrink-0 shadow-[0_0_5px_rgba(34,211,238,0.8)]"></div>
                   <div>
                     <div className="flex items-center space-x-2 mb-1">
                       <span className="font-bold text-sm">{feed.title}</span>
                       <span className="text-[10px] px-2 bg-white/10 rounded-full">{feed.tag}</span>
                     </div>
                     <p className="text-xs text-gray-500">{feed.desc}</p>
                     <span className="text-xs text-gray-400 mt-1 block">{feed.time}</span>
                   </div>
                </div>
              ))}
              <button className="w-full mt-auto py-2 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition flex items-center justify-center space-x-2">
                <span>View Full Feed</span> <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

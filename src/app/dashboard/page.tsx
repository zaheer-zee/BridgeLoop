"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flag, TrendingDown, TrendingUp, Smile, Activity, ArrowRight, Loader2 } from 'lucide-react';
import { getTrackedItems, getPriceHistory, TrackedItem, PriceHistory } from '@/lib/api';

export default function DashboardOverview() {
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTrackedItems(), getPriceHistory()])
      .then(([items, history]) => {
        setTrackedItems(items);
        setPriceHistory(history);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold mb-2">Overview</h1>
           <p className="text-gray-500 dark:text-gray-400">Your Bridgeloop Intelligence Feed &amp; Tracked Assets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Tracked Products Highlight */}
        <div className="lg:col-span-2 space-y-4">
           <h3 className="text-xl font-bold flex items-center space-x-2">
             <Flag className="text-cyan-500" suppressHydrationWarning />
             <span>Flagged Trackers</span>
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-2 py-12 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                </div>
              ) : trackedItems.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-gray-500">No tracked products found.</div>
              ) : (
                trackedItems.map(prod => {
                  const history = priceHistory.filter(h => h.tracked_item_id === prod.id);
                  const latest = history[history.length - 1];
                  const previous = history.length > 1 ? history[history.length - 2] : null;

                  let variance = "0.0%";
                  let isNegative = false;
                  if (latest && previous && previous.price !== 0) {
                    const diff = ((latest.price - previous.price) / previous.price) * 100;
                    variance = (diff > 0 ? "+" : "") + diff.toFixed(1) + "%";
                    isNegative = diff < 0;
                  }

                  return (
                    <motion.div key={prod.id} whileHover={{ scale: 1.02 }} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-sm relative overflow-hidden group flex flex-col">
                       <div className="absolute top-4 right-4 text-cyan-500">
                         <Flag className="w-5 h-5 fill-cyan-500/20" suppressHydrationWarning />
                       </div>
                       <h4 className="font-bold text-lg pr-8 truncate" title={prod.name}>{prod.name}</h4>

                       <div className="mt-4 grid grid-cols-2 gap-4 text-sm flex-1">
                          <div className="bg-gray-50 dark:bg-black/30 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                            <span className="block text-gray-500 text-xs mb-1">Latest Scraped</span>
                            <span className="font-bold text-lg">
                              {latest ? `$${latest.price.toFixed(2)}` : 'Pending'}
                            </span>
                          </div>
                          <div className="bg-gray-50 dark:bg-black/30 p-3 rounded-lg border border-gray-100 dark:border-white/5">
                            <span className="block text-gray-500 text-xs mb-1">Price Variance</span>
                            <span className={`font-bold text-lg flex items-center ${isNegative ? 'text-green-500' : variance !== "0.0%" ? 'text-red-500' : 'text-gray-400'}`}>
                               {isNegative ? <TrendingDown className="w-4 h-4 mr-1" suppressHydrationWarning /> : variance !== "0.0%" ? <TrendingUp className="w-4 h-4 mr-1" suppressHydrationWarning /> : null}
                               {variance}
                            </span>
                          </div>
                       </div>

                       <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                         <span className="text-sm text-gray-500">Sentiment</span>
                         <div className="flex items-center space-x-2">
                            <Smile className={`w-4 h-4 ${latest?.sentiment === 'positive' ? 'text-green-500' : latest?.sentiment === 'negative' ? 'text-red-500' : 'text-gray-400'}`} suppressHydrationWarning />
                            <span className={`font-bold text-sm capitalize ${latest?.sentiment === 'positive' ? 'text-green-500' : latest?.sentiment === 'negative' ? 'text-red-500' : 'text-gray-400'}`}>
                              {latest ? latest.sentiment : 'Pending'}
                            </span>
                         </div>
                       </div>
                    </motion.div>
                  );
                })
              )}
           </div>
        </div>

        {/* Intelligence Feed */}
        <div className="space-y-4">
           <h3 className="text-xl font-bold flex items-center space-x-2">
             <Activity className="text-cyan-500" suppressHydrationWarning />
             <span>Intelligence Feed</span>
           </h3>
           <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col h-full space-y-6">
              {priceHistory.slice(-4).reverse().map((feed, i) => {
                const item = trackedItems.find(t => t.id === feed.tracked_item_id);
                return (
                <div key={i} className="flex space-x-4">
                   <div className="w-2 h-2 mt-2 bg-cyan-500 rounded-full flex-shrink-0 shadow-md hover:shadow-lg shadow-cyan-500/20 transition-all"></div>
                   <div>
                     <div className="flex items-center space-x-2 mb-1">
                       <span className="font-bold text-sm">{item?.name || "Scraped Item"}</span>
                       <span className="text-[10px] px-2 bg-white/10 rounded-full">{feed.sentiment}</span>
                     </div>
                     <p className="text-xs text-gray-500 line-clamp-2">{feed.summary}</p>
                     <span className="text-xs text-gray-400 mt-1 block">{new Date(feed.timestamp).toLocaleString()}</span>
                   </div>
                </div>
              )})}
              {priceHistory.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-8">No intelligence data yet. Run n8n pipeline.</div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}

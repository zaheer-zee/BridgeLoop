"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowDownUp, Edit2, Trash2, Loader2, ExternalLink, Sparkles, X } from 'lucide-react';
import { getTrackedItems, getPriceHistory, TrackedItem, PriceHistory, deleteTrackedItem } from '@/lib/api';

export default function ProductCatalogue() {
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [summarizerData, setSummarizerData] = useState<PriceHistory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    Promise.all([getTrackedItems(), getPriceHistory()])
      .then(([items, history]) => {
        setTrackedItems(items);
        setPriceHistory(history);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to stop tracking this product?")) return;
    try {
      await deleteTrackedItem(id);
      setTrackedItems(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete item");
    }
  };

  const filteredItems = trackedItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold mb-2">Product Catalogue</h1>
           <p className="text-gray-500 dark:text-gray-400">Manage your tracking assets and auto-extract parameters using Vision AI.</p>
        </div>

      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between">
         <div className="flex-1 min-w-[200px] relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input
             type="text"
             placeholder="Search product name, tags, description..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-sm"
           />
         </div>
         <div className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-sm flex items-center space-x-2 hover:bg-black/5 dark:hover:bg-white/5">
              <Filter className="w-4 h-4" /> <span>Filters</span>
            </button>
            <button className="px-3 py-2 border border-gray-200 dark:border-white/10 rounded-lg text-sm flex items-center space-x-2 hover:bg-black/5 dark:hover:bg-white/5">
              <ArrowDownUp className="w-4 h-4" /> <span>Sort</span>
            </button>
         </div>
      </div>

      {/* Grid View */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          No tracked products found. Add some in the Tracked Competitors page.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((prod) => {
            const history = priceHistory.filter(h => h.tracked_item_id === prod.id);
            const latest = history[history.length - 1];

            return (
              <div key={prod.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-colors group relative flex flex-col">

                <button
                  onClick={() => handleDelete(prod.id)}
                  className="absolute top-4 left-4 z-10 p-2 rounded-full backdrop-blur-md border border-white/20 transition-colors shadow-sm bg-cyan-500 text-white hover:bg-red-500"
                  title="Remove from tracking"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                </button>

                {/* Image Placeholder */}
                <div className="h-48 bg-gray-100 dark:bg-black/40 flex flex-col items-center justify-center relative">
                   <span className="text-6xl">🌐</span>
                   <div className="absolute top-3 right-3">
                     <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/80 dark:bg-black/80 backdrop-blur rounded border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300">
                       Tracked
                     </span>
                   </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col">
                   <div>
                     <h3 className="font-bold text-lg leading-tight truncate">{prod.name}</h3>
                     <a href={prod.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-500 hover:underline flex items-center mt-1 w-full truncate">
                       <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                       <span className="truncate">{prod.url}</span>
                     </a>
                   </div>

                   <div className="flex justify-between items-end mt-auto">
                      <div>
                        <span className="block text-xs text-gray-500 mb-1">Latest Scraped Price</span>
                        <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                          {latest ? `$${latest.price.toFixed(2)}` : 'Pending'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                          latest
                            ? latest.sentiment === 'positive'
                              ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                              : latest.sentiment === 'negative'
                              ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400'
                            : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400'
                        }`}>
                          {latest ? latest.sentiment : 'No Data'}
                        </span>
                      </div>
                   </div>

                   <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                     <p className="text-xs text-gray-500 line-clamp-2">
                       <span className="font-semibold text-cyan-500">AI Extract:</span>{' '}
                       {latest ? latest.summary : 'Awaiting scrape...'}
                     </p>
                   </div>

                   {/* Actions */}
                   <div className="pt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-1">
                        {latest && <button onClick={() => setSummarizerData(latest)} className="p-2 text-cyan-400 hover:text-cyan-500 transition" title="AI Summarizer"><Sparkles className="w-4 h-4" /></button>}
                        <button className="p-2 text-gray-400 hover:text-cyan-500 transition"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(prod.id)} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Summarizer Modal */}
      {summarizerData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={(e) => e.target === e.currentTarget && setSummarizerData(null)}>
          <div className="w-full max-w-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setSummarizerData(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"><X className="w-5 h-5" /></button>
            <div className="flex items-center space-x-2 mb-4">
               <Sparkles className="w-5 h-5 text-cyan-500" />
               <h2 className="text-xl font-bold">AI Summarizer</h2>
            </div>
            <div className="bg-gray-50 dark:bg-black/30 p-4 rounded-xl border border-gray-100 dark:border-white/5 mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
               {summarizerData.summary}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
               <span>Extracted on: {new Date(summarizerData.timestamp).toLocaleString()}</span>
               <span className="capitalize">Sentiment: <strong className={summarizerData.sentiment === 'positive' ? 'text-green-500' : 'text-gray-400'}>{summarizerData.sentiment}</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

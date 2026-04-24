"use client";
import React, { useState } from 'react';
import { Search, Filter, Plus, Scan, ArrowDownUp, Edit2, Trash2, FolderMinus, Download } from 'lucide-react';

export default function ProductCatalogue() {
  const [view, setView] = useState('grid');
  
  const initialProducts = [
    { id: 1, name: "Artisan Dark Roast Coffee", sku: "CFF-DRK-1KG", price: "$24.99", cost: "$12.00", stock: "In Stock", tag: "Beverage", img: "☕", ai: "100% Arabica, Hand Roasted", variance: "+1.2%", sentiment: 88, sentText: "Positive" },
    { id: 2, name: "Noise-Cancelling Headphones V2", sku: "ELC-HP-V2", price: "$149.00", cost: "$65.00", stock: "Low Stock", tag: "Electronics", img: "🎧", ai: "Active Noise Cancelling, Bluetooth 5.0", variance: "-4.0%", sentiment: 60, sentText: "Neutral" },
    { id: 3, name: "Organic Lavender Essential Oil", sku: "SKN-LAV-50M", price: "$18.50", cost: "$5.00", stock: "Out of Stock", tag: "Skincare", img: "🌿", ai: "Pure Lavender, 50ml dropper", variance: "+5.1%", sentiment: 82, sentText: "Positive" },
    { id: 4, name: "Premium Yoga Mat", sku: "FIT-YOG-01", price: "$45.00", cost: "$15.00", stock: "In Stock", tag: "Fitness", img: "🧘‍♀️", ai: "Eco-friendly, Non-slip texture", variance: "-2.4%", sentiment: 68, sentText: "Neutral" }
  ];

  const [trackedIds, setTrackedIds] = useState<number[]>([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('trackedProducts');
    if (saved) {
      setTrackedIds(JSON.parse(saved));
    } else {
      // Setup demo data initially if empty
      localStorage.setItem('trackedProducts', JSON.stringify([1, 4]));
      setTrackedIds([1, 4]);
      localStorage.setItem('catalogData', JSON.stringify(initialProducts));
    }
  }, []);

  const toggleTrack = (id: number) => {
    const current = [...trackedIds];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setTrackedIds(current);
    localStorage.setItem('trackedProducts', JSON.stringify(current));
  };
  
  const mockProducts = typeof window !== 'undefined' && localStorage.getItem('catalogData') 
    ? JSON.parse(localStorage.getItem('catalogData') as string)
    : initialProducts;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold mb-2">Product Catalogue</h1>
           <p className="text-gray-500 dark:text-gray-400">Manage your tracking assets and auto-extract parameters using Vision AI.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg flex items-center space-x-2 hover:bg-black/5 dark:hover:bg-white/5 transition">
            <Download className="w-4 h-4" /> <span>Export CSV</span>
          </button>
          <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center space-x-2 shadow-md hover:shadow-lg shadow-cyan-500/20 transition-all transition">
            <Scan className="w-4 h-4" /> <span>AI Photo Upload</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between">
         <div className="flex-1 min-w-[200px] relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
           <input type="text" placeholder="Search product name, tags, description..." className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:border-cyan-500 text-sm" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((prod: any) => {
          const isTracked = trackedIds.includes(prod.id);
          return (
          <div key={prod.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-colors group relative">
            
            <button 
              onClick={() => toggleTrack(prod.id)}
              className={`absolute top-4 left-4 z-10 p-2 rounded-full backdrop-blur-md border border-white/20 transition-colors shadow-sm ${isTracked ? 'bg-cyan-500 text-white' : 'bg-black/20 text-gray-200 hover:bg-black/40'}`}
              title={isTracked ? "Remove from tracking" : "Track this product"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isTracked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            </button>
            {/* Mock Image Placeholder */}
            <div className="h-48 bg-gray-100 dark:bg-black/40 flex flex-col items-center justify-center relative">
               <span className="text-6xl">{prod.img}</span>
               <div className="absolute top-3 right-3">
                 <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/80 dark:bg-black/80 backdrop-blur rounded border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300">
                   {prod.tag}
                 </span>
               </div>
            </div>
            
            <div className="p-5 space-y-4">
               <div>
                 <h3 className="font-bold text-lg leading-tight truncate">{prod.name}</h3>
                 <p className="text-xs text-gray-400 font-mono mt-1">SKU: {prod.sku}</p>
               </div>
               
               <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">Selling Price</span>
                    <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{prod.price}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${prod.stock.includes('In') ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : prod.stock.includes('Low') ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                      {prod.stock}
                    </span>
                  </div>
               </div>

               <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                 <p className="text-xs text-gray-500 line-clamp-2"><span className="font-semibold text-cyan-500">AI Extract:</span> {prod.ai}</p>
               </div>

               {/* Actions */}
               <div className="pt-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-400 hover:text-cyan-500 transition"><Edit2 className="w-4 h-4" /></button>
                  <div className="flex space-x-1">
                    <button className="p-2 text-gray-400 hover:text-orange-500 transition"><FolderMinus className="w-4 h-4" /></button>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
               </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

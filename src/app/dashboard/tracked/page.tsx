"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeOff, Building2, MapPin, ExternalLink } from 'lucide-react';

export default function TrackedBusinesses() {
  // Mock State Management
  const [tracked, setTracked] = useState([
    { id: 1, name: "Urban Tech Solutions", type: "Electronics", loc: "San Francisco, CA", logo: "UT" },
    { id: 2, name: "Green Leaf Organics", type: "Grocery", loc: "Portland, OR", logo: "GL" },
    { id: 3, name: "Apex Fitness Gear", type: "Retail", loc: "Austin, TX", logo: "AF" },
  ]);

  const untrack = (id: number) => {
    setTracked(tracked.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold mb-2">Private Business Tracking</h1>
           <p className="text-gray-500 dark:text-gray-400">Monitor competitors without them knowing. <i className="text-cyan-500">Tracking is 100% private.</i></p>
        </div>
        <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold hover:opacity-90 transition">
          Discover Businesses
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracked.length === 0 ? (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
             <EyeOff className="w-12 h-12 mx-auto text-gray-400 mb-4" />
             <h3 className="text-xl font-bold mb-2">No businesses tracked yet</h3>
             <p className="text-gray-500">Your private tracker list will appear here.</p>
          </div>
        ) : (
          tracked.map(bus => (
            <motion.div key={bus.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center font-bold text-lg text-cyan-600 dark:text-cyan-400">
                  {bus.logo}
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-orange-500 bg-orange-500/10 px-2 py-1 rounded">
                  <EyeOff className="w-3 h-3" />
                  <span>Private</span>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-1">{bus.name}</h3>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6 mt-4">
                <div className="flex items-center space-x-2"><Building2 className="w-4 h-4"/> <span>{bus.type}</span></div>
                <div className="flex items-center space-x-2"><MapPin className="w-4 h-4"/> <span>{bus.loc}</span></div>
              </div>
              <div className="flex space-x-3 pt-4 border-t border-gray-100 dark:border-white/5">
                <button className="flex-1 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 py-2 rounded-lg font-medium hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition flex items-center justify-center space-x-2">
                  <span>View Details</span> <ExternalLink className="w-4 h-4" />
                </button>
                <button onClick={() => untrack(bus.id)} className="px-4 border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 hover:text-red-500 hover:border-red-500/50 transition">
                  Untrack
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

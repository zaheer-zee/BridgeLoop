"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UploadCloud, LayoutDashboard, BellRing, ChevronDown } from 'lucide-react';

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How do I track another business?", a: "Navigate to the Tracked Businesses sidebar item and click 'Discover'. Search for the business and click the Track icon. They will never be notified." },
    { q: "What's the difference between Global and Network views?", a: "Global views aggregate data from open internet APIs across thousands of sites. Network views compare your data specifically against other registered, private Bridgeloop users in your category." },
    { q: "How do price alerts work?", a: "Alerts trigger automatically when a tracked competitor's price changes by more than 5% (the default threshold). You will see this in your Overview feed and receive an email." },
    { q: "When do I get my weekly report?", a: "Weekly Canva-integrated reports are generated every Sunday night at 11:59PM based on your set account Time Zone and delivered via email." },
    { q: "Is my data private?", a: "Absolutely. Bridgeloop encrypts your connection and never publicly exposes your customer lists or private tracking habits. Overall metrics are anonymized." }
  ];

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-12 pb-12">
        
        {/* Header & Search */}
        <div className="text-center pt-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">How can we help?</h1>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search help articles..." 
              className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-full py-4 pl-12 pr-6 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] text-gray-900 dark:text-white backdrop-blur-md transition shadow-md hover:shadow-lg shadow-cyan-500/20 transition-all"
            />
          </div>
        </div>

        {/* Quick Actions Component */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
           {[
             { title: "Upload Product Guide", icon: UploadCloud },
             { title: "Understand My Dashboard", icon: LayoutDashboard },
             { title: "Change Alert Settings", icon: BellRing }
           ].map((action, i) => (
             <motion.div key={i} whileHover={{ scale: 1.02 }} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 rounded-2xl backdrop-blur-md cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 hover:border-[#2563EB]/50 transition group shadow-sm">
                <action.icon className="w-8 h-8 text-[#2563EB] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{action.title}</h3>
             </motion.div>
           ))}
        </div>

        {/* FAQs Component */}
        <div className="pt-8">
           <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
           <div className="space-y-4">
             {faqs.map((faq, i) => (
               <div key={i} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-sm">
                 <button 
                   onClick={() => setOpenFaq(openFaq === i ? null : i)}
                   className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-white/5 transition"
                 >
                   <span className="font-semibold text-gray-900 dark:text-white">{faq.q}</span>
                   <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                 </button>
                 <AnimatePresence>
                   {openFaq === i && (
                     <motion.div 
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: "auto", opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400"
                     >
                       {faq.a}
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             ))}
           </div>
        </div>

        {/* Contact Support */}
        <div className="pt-8">
           <div className="bg-[#2563EB]/10 border border-[#2563EB]/30 rounded-2xl p-8 backdrop-blur-md text-center max-w-xl mx-auto">
             <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Still need help?</h2>
             <p className="text-[#2563EB] font-bold text-lg mb-1">support@bridgeloop.ai</p>
             <p className="text-sm text-gray-600 dark:text-gray-400">We reply within 24 business hours.</p>
           </div>
        </div>

        {/* Data Transparency Footer */}
        <div className="pt-12 text-center text-xs text-gray-500 dark:text-gray-600 italic">
          <p>Bridgeloop uses publicly available data. Insights are assistive—always apply your own judgment.</p>
        </div>

      </motion.div>
    </div>
  );
}

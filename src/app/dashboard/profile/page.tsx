"use client";
import React from 'react';
import { User, Building, CreditCard, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Workspace Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your Bridgeloop profile, business details, and billing.</p>
      </div>

      {/* Account Essentials */}
      <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
           <User className="text-cyan-500" />
           <span>Account Essentials</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
             <input type="text" defaultValue="Alex Carter" className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-cyan-500" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
             <input type="email" defaultValue="alex@pro-retail.com" className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-cyan-500" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Name</label>
             <input type="text" defaultValue="Carter Retail Goods" className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-cyan-500" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Type</label>
             <select className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-black dark:text-white">
                <option>Retail</option>
                <option>Cafe</option>
                <option>Online Store</option>
             </select>
           </div>
           <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
             <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-cyan-500" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
             <button className="w-full bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white rounded-xl p-3 font-medium hover:bg-gray-200 dark:hover:bg-white/20 transition text-left">
               Update Password...
             </button>
           </div>
        </div>
      </section>

      {/* Business Profile */}
      <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
           <Building className="text-cyan-500" />
           <span>Business Profile</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Website URL</label>
             <input type="text" defaultValue="https://carter-retail.com" className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-cyan-500" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Location (City / Region)</label>
             <input type="text" defaultValue="Seattle, WA" className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-cyan-500" />
           </div>
           <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Currency Preference</label>
             <select className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-black dark:text-white">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>INR (₹)</option>
             </select>
           </div>
           <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Zone</label>
             <select className="w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-black dark:text-white">
                <option>Pacific Time (PT)</option>
                <option>Eastern Time (ET)</option>
             </select>
           </div>
        </div>
      </section>

      {/* Subscription & Compliance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
             <CreditCard className="text-cyan-500" />
             <span>Subscription & Plan</span>
          </h2>
          <div className="space-y-4 text-sm">
             <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
               <span className="text-gray-500">Account Tier</span>
               <span className="font-bold text-cyan-600 dark:text-cyan-400">Pro</span>
             </div>
             <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
               <span className="text-gray-500">Subscription Status</span>
               <span className="font-bold text-green-500">Active</span>
             </div>
             <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
               <span className="text-gray-500">Trial Start Date</span>
               <span className="font-medium">March 1st, 2026</span>
             </div>
             <div className="flex justify-between border-b border-gray-100 dark:border-white/5 pb-2">
               <span className="text-gray-500">Trial End Date</span>
               <span className="font-medium">March 31st, 2026</span>
             </div>
             <div className="pt-2">
               <button className="text-cyan-500 hover:text-cyan-400 font-medium text-sm">Manage Payment Methods</button>
             </div>
          </div>
        </section>

        <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
             <ShieldCheck className="text-cyan-500" />
             <span>Compliance & Legal</span>
          </h2>
          <div className="space-y-4 text-sm">
             <label className="flex items-start space-x-3">
               <input type="checkbox" defaultChecked disabled className="mt-1" />
               <span className="text-gray-600 dark:text-gray-400">Terms of Service Accepted</span>
             </label>
             <label className="flex items-start space-x-3">
               <input type="checkbox" defaultChecked disabled className="mt-1" />
               <span className="text-gray-600 dark:text-gray-400">Privacy Policy Accepted</span>
             </label>
             <label className="flex items-start space-x-3">
               <input type="checkbox" defaultChecked disabled className="mt-1" />
               <span className="text-gray-600 dark:text-gray-400">Data Processing Consent (GDPR)</span>
             </label>
             <label className="flex items-start space-x-3">
               <input type="checkbox" defaultChecked className="mt-1" />
               <span className="text-gray-600 dark:text-gray-400">Marketing Emails Opt-In</span>
             </label>
             <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-4 text-xs text-gray-500">
               <div>
                 <span className="block mb-1">Created</span>
                 <span className="font-mono">2026-03-01 10:23Z</span>
               </div>
               <div>
                 <span className="block mb-1">Last Login</span>
                 <span className="font-mono">2026-04-22 08:14Z</span>
               </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}

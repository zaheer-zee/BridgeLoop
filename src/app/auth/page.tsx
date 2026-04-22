"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Neon Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-2xl shadow-[0_0_50px_rgba(34,211,238,0.1)] relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)] mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold font-inter">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-2">Sign in to your Bridgeloop Workspace</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href="/dashboard"; }}>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" placeholder="you@company.com" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-cyan-500 transition-colors text-white placeholder:text-gray-600" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" placeholder="••••••••" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-cyan-500 transition-colors text-white placeholder:text-gray-600" />
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.4)] transition flex items-center justify-center space-x-2">
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account? <a href="#" className="text-cyan-400 hover:underline">Sign up</a>
        </p>
      </motion.div>
    </div>
  );
}

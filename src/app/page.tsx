"use client";
import dynamic from "next/dynamic";
import ProductStory from "@/components/ProductStory";
import { ThemeToggle } from "@/components/ThemeToggle";
import FeatureReveal from "@/components/FeatureReveal";
import BridgeloopTagline from "@/components/BridgeloopTagline";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const BackgroundParticles = dynamic(() => import("@/components/BackgroundParticles"), { ssr: false });

const FadeInView = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-gray-900 dark:text-gray-100 font-sans selection:bg-cyan-500/30 transition-colors duration-500">
      <BackgroundParticles />
      <ThemeToggle />

      {/* Hero — 3D Scroll Canvas */}
      <ProductStory />

      {/* GSAP word-by-word tagline reveal */}
      <BridgeloopTagline />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 space-y-12">
        
        {/* Core Capabilities — staggered parallax tilt cards */}
        <FeatureReveal />

        {/* Enter App Button */}
        <section className="flex flex-col items-center justify-center py-8">
          <FadeInView>
            <Link href="/auth">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-xl md:text-2xl flex items-center space-x-3 overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.5)] dark:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <span>Enter Workspace</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
          </FadeInView>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-xl py-12 relative z-10 transition-colors duration-500">
         <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
              <span className="font-bold text-black dark:text-white text-lg font-inter flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
                <span>Bridgeloop</span>
              </span>
              <span>© {new Date().getFullYear()} Bridgeloop. All rights reserved.</span>
            </div>
            <div className="flex space-x-6 mt-6 md:mt-0">
              <a href="#" className="hover:text-cyan-500 transition">About</a>
              <a href="#" className="hover:text-cyan-500 transition">Privacy</a>
              <a href="#" className="hover:text-cyan-500 transition">Terms</a>
              <a href="#" className="hover:text-cyan-500 transition">Contact</a>
            </div>
         </div>
      </footer>
    </main>
  );
}

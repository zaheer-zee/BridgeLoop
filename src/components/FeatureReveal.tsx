"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Search, Zap, MessageSquareText, BellRing, BarChart2, FileText } from "lucide-react";

// The Parallax Tilt Card Component
const TiltCard = ({ feature }: { feature: any }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring config for smooth return
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });
  
  // Transform to rotate (-5 to 5 degrees) based on mouse position
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate 0 to 1 ratios
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Card anim variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.6, ease: "easeInOut" as const } 
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative z-10 w-full"
    >
      <div 
        className="h-full p-8 rounded-2xl bg-white/10 dark:bg-black/40 border border-cyan-500/30 backdrop-blur-xl hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-colors duration-300 cursor-pointer overflow-hidden group"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
          style={{ transform: "translateZ(-10px)" }} 
        />
        
        <div style={{ transform: "translateZ(30px)" }}>
          <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold mb-3 text-black dark:text-white group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            {feature.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};


export default function FeatureReveal() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
    }
  };

  const features = [
    {
      title: "Competitor Tracking",
      desc: "Monitor competitor pricing and updates automatically using intelligent network scraping.",
      icon: <Search className="w-7 h-7" />
    },
    {
      title: "AI-Powered Summaries",
      desc: "Get concise weekly summaries from advanced LLM analysis of product movements.",
      icon: <Zap className="w-7 h-7" />
    },
    {
      title: "Sentiment Analysis",
      desc: "Process public review excerpts to classify sentiment as Positive, Neutral, or Negative.",
      icon: <MessageSquareText className="w-7 h-7" />
    },
    {
      title: "Price Change Detection",
      desc: "Instant email alerts using rule-based comparison when a significant change (>5%) occurs.",
      icon: <BellRing className="w-7 h-7" />
    },
    {
      title: "Smart Dashboard & Trends",
      desc: "Interactive charts displaying pricing changes over time and sentiment distribution trends.",
      icon: <BarChart2 className="w-7 h-7" />
    },
    {
      title: "Weekly Reports",
      desc: "Automated dynamic reports delivered to your inbox outlining network and global shifts.",
      icon: <FileText className="w-7 h-7" />
    }
  ];

  return (
    <section className="py-24 relative perspective-[1000px]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 md:px-8"
      >
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-4xl md:text-5xl font-black text-black dark:text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
          >
            Core Capabilities
          </motion.h2>
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            The intelligence of a massive data network, compressed into an intuitive real-time toolkit.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <TiltCard key={i} feature={feature} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

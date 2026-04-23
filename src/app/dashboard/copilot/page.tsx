"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Bot, User, Rocket } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
const NGROK_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

export default function CopilotPage() {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I am the Antigravity Research Co-pilot. Ask me anything about TRL progressions, latest papers on the Woodward effect, Casimir cavities, or specific breakthroughs.", chartData: null }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg, chartData: null }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat_query`, {
        method: "POST",
        headers: NGROK_HEADERS,
        body: JSON.stringify({ query: userMsg }),
      });
      
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      
      setMessages((prev) => [...prev, { 
        role: "bot", 
        content: data.answer, 
        chartData: data.chart_data && data.chart_data.length > 0 ? data.chart_data : null 
      }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I couldn't connect to the backend.", chartData: null }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[85vh] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/20 rounded-xl">
             <Rocket className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Research Co-pilot</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Antigravity & Quantum Propulsion Specialist
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar p-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "bot" && (
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center flex-shrink-0 mt-1 mr-3">
                <Bot className="w-5 h-5" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl p-4 ${msg.role === "user" ? "bg-cyan-500 text-black rounded-tr-sm" : "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm rounded-tl-sm"}`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              
              {/* Optional Chart payload */}
              {msg.chartData && (
                 <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 w-full h-64">
                   <p className="text-xs text-gray-500 mb-2 font-semibold tracking-wider">TECHNOLOGY READINESS LEVEL (TRL)</p>
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={msg.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                        <YAxis stroke="#888888" fontSize={11} domain={[0, 9]} ticks={[1,2,3,4,5,6,7,8,9]} />
                        <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                        <Bar dataKey="trl" fill="#06b6d4" radius={[4,4,0,0]} />
                      </BarChart>
                   </ResponsiveContainer>
                 </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center flex-shrink-0 mt-1 ml-3">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
            )}
          </motion.div>
        ))}
        {loading && (
          <div className="flex items-start justify-start">
             <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1 mr-3">
               <Bot className="w-5 h-5 text-cyan-500" />
             </div>
             <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex items-center space-x-2">
               <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
               <span className="text-sm text-gray-400">Synthesizing findings...</span>
             </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-2 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-2xl flex items-center shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about antigravity research, TRL levels, Woodward effect..."
          className="flex-1 bg-transparent px-4 py-3 outline-none text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition disabled:opacity-50 mx-1 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

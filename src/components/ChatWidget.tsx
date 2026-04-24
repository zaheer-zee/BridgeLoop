"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Bot, X, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";
const NGROK_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I am the Antigravity Research Co-pilot. Ask me anything about TRL progressions or latest breakthroughs.", chartData: null }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

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
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-80 md:w-[400px] h-[500px] bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-cyan-500" suppressHydrationWarning={true} />
                <span className="font-bold text-sm">Research Co-pilot</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-4 h-4" suppressHydrationWarning={true} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center flex-shrink-0 mt-1 mr-2">
                      <Bot className="w-4 h-4" suppressHydrationWarning={true} />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl p-3 text-sm ${msg.role === "user" ? "bg-cyan-500 text-black rounded-tr-sm" : "bg-gray-100 dark:bg-white/5 rounded-tl-sm w-full"}`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    {msg.chartData && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10 h-40">
                        <p className="text-[10px] text-gray-500 mb-1 font-semibold tracking-wider">TRL PROGRESSION</p>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={msg.chartData}>
                            <XAxis dataKey="name" fontSize={9} />
                            <Tooltip contentStyle={{ backgroundColor: '#111', fontSize: '10px' }} />
                            <Bar dataKey="trl" fill="#06b6d4" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-start justify-start">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1 mr-2">
                    <Bot className="w-4 h-4 text-cyan-500" suppressHydrationWarning={true} />
                  </div>
                  <div className="bg-gray-100 dark:bg-white/5 rounded-xl p-3 flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-500" suppressHydrationWarning={true} />
                    <span className="text-xs text-gray-400">Synthesizing...</span>
                  </div>
                </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 border-t border-gray-200 dark:border-white/10 flex items-center space-x-2 bg-gray-50/50 dark:bg-black/20">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-white dark:bg-[#1A1A1A] px-3 py-2 rounded-lg text-sm outline-none border border-gray-200 dark:border-white/10"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" suppressHydrationWarning={true} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-cyan-500 text-black rounded-full shadow-md hover:shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center relative z-50 text-black"
      >
        {isOpen ? <X className="w-6 h-6" suppressHydrationWarning={true} /> : <MessageSquare className="w-6 h-6" suppressHydrationWarning={true} />}
      </motion.button>
    </div>
  );
}

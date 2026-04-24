"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ExternalLink, Loader2, Globe, X, Play } from "lucide-react";
import { getTrackedItems, addTrackedItem, deleteTrackedItem, runPipeline, TrackedItem } from "@/lib/api";

export default function TrackedPage() {
  const [items, setItems] = useState<TrackedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", url: "" });
  const [submitting, setSubmitting] = useState(false);
  const [runningPipeline, setRunningPipeline] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await getTrackedItems();
      setItems(data);
    } catch {
      setError("Failed to load tracked competitors. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim()) return;
    setSubmitting(true);
    try {
      const newItem = await addTrackedItem(form.name.trim(), form.url.trim());
      setItems((prev) => [...prev, newItem]);
      setForm({ name: "", url: "" });
      setShowModal(false);
    } catch {
      setError("Failed to add competitor. Check the backend.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTrackedItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError("Failed to delete item.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Tracked Competitors</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Add competitor URLs to monitor. Our AI scrapes them daily.
          </p>
        </div>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={async () => {
              setRunningPipeline(true);
              try { 
                await runPipeline(); 
                alert("Pipeline completed! Data is now live.");
                fetchItems(); 
              } catch { 
                alert("Pipeline failed"); 
              } finally { 
                setRunningPipeline(false); 
              }
            }}
            disabled={runningPipeline}
            className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
          >
            {runningPipeline ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            <span>{runningPipeline ? "Running AI..." : "Run AI Pipeline"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-md hover:shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Competitor</span>
          </motion.button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 text-gray-400">
          <Globe className="w-16 h-16 opacity-20" />
          <p className="text-lg font-medium">No competitors tracked yet.</p>
          <p className="text-sm">Click &quot;Add Competitor&quot; to get started.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 backdrop-blur-xl flex items-start justify-between group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center text-cyan-500 font-bold text-sm flex-shrink-0">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-bold truncate">{item.name}</h3>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-500 hover:underline flex items-center space-x-1 truncate mt-1"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{item.url}</span>
                </a>
                <p className="text-xs text-gray-400 mt-2">
                  Added {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="ml-4 p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100"
              >
                {deletingId === item.id
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Trash2 className="w-4 h-4" />
                }
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Competitor Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Track a Competitor</h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                    Competitor Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apple Store"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">
                    Product / Page URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/product"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:border-cyan-500 transition"
                    required
                  />
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl flex items-center justify-center space-x-2 transition shadow-md hover:shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>{submitting ? "Adding..." : "Start Tracking"}</span>
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

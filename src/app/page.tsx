"use client";

import { motion } from "framer-motion";
import { Layout, Globe, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// TODO: Replace this URL with the actual deployed live website URL
const LIVE_URL = "https://example.com"; 
const ARCHITECTURE_URL = "https://adarshcodes.com/#project=razorpay";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showLiveDemo, setShowLiveDemo] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-900 font-sans selection:bg-blue-500/20">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50/50 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-6 py-12 md:py-24 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center max-w-3xl mb-12 flex flex-col items-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 mb-8 overflow-hidden">
            <img src="/icon.png" alt="Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900">
            Payment Orchestration Showcase
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto"
        >
          <a
            href={ARCHITECTURE_URL}
            className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-700 font-medium rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-sm border border-slate-200 hover:border-slate-300 hover:text-slate-900"
          >
            <Layout className="w-5 h-5 text-blue-500" />
            <span>View Architecture</span>
          </a>

          <button
            onClick={() => {
              setShowLiveDemo(true);
              setTimeout(() => {
                document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white font-medium rounded-xl border border-slate-800 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shadow-md"
          >
            <Globe className="w-5 h-5 text-emerald-400" />
            <span>View Live Website</span>
          </button>
        </motion.div>

        <motion.div 
          id="demo"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          className="w-full max-w-6xl rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-xl relative flex flex-col"
          style={{ height: '75vh', minHeight: '600px' }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/80 backdrop-blur-md">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            <div className="ml-4 flex items-center gap-2 text-xs text-slate-500 font-mono bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm flex-1 max-w-md mx-auto">
              <Globe className="w-3 h-3 text-slate-400" />
              <span className="truncate">{LIVE_URL}</span>
            </div>
          </div>
          
          <div className="flex-1 w-full bg-slate-50/50 relative flex flex-col items-center justify-center overflow-hidden">
            {showLiveDemo ? (
              <>
                {iframeLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                    <Loader2 className="w-8 h-8 text-slate-800 animate-spin mb-4" />
                    <span className="text-sm font-medium text-slate-600">Loading Live Environment...</span>
                  </div>
                )}
                <iframe 
                  src={LIVE_URL}
                  onLoad={() => setIframeLoading(false)}
                  className="w-full h-full border-none bg-white"
                  title="Live Demo"
                  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-60">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 rounded-full border border-dashed border-slate-300 mb-8 relative flex items-center justify-center"
                >
                  <div className="w-24 h-24 rounded-full border border-slate-200" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-slate-400" />
                  </div>
                </motion.div>
                <div className="text-slate-600 font-medium mb-2">Live Environment Standby</div>
                <div className="text-slate-400 text-sm">Click "View Live Website" to connect</div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

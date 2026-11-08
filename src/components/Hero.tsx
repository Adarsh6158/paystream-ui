"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, ShieldCheck, Activity, Terminal, ArrowUpRight } from "lucide-react";

export function Hero() {
  const scrollToWorkstation = () => {
    const el = document.getElementById("workstation-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToArchitecture = () => {
    const el = document.getElementById("architecture-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section aria-label="Overview" className="w-full pt-4 sm:pt-6 pb-2 text-center space-y-4">
      {/* Top Engineering Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-700 text-xs font-medium shadow-2xs select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="font-semibold tracking-wide uppercase text-[10px] text-neutral-800">
          DISTRIBUTED FINTECH ARCHITECTURE
        </span>
        <span className="text-neutral-300">•</span>
        <span className="text-[11px] text-neutral-600 font-sans">
          Spring WebFlux &bull; Kafka &bull; Redis
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 max-w-4xl mx-auto leading-[1.18]">
        High-Throughput Reactive Payment Gateway &amp; Settlement Engine
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-neutral-600 max-w-3xl mx-auto leading-relaxed font-normal">
        A sub-200ms idempotent settlement pipeline engineered with Spring WebFlux non-blocking reactive streams, Apache Kafka partitioned event ledgering, Redis distributed locking, and Resilience4j dual-bank failover routing.
      </p>

      {/* Benchmark Metric Badges Strip */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap pt-1 pb-2">
        <div className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200/80 text-left shadow-2xs">
          <span className="block text-[10px] font-mono uppercase text-neutral-400">p99 Settlement</span>
          <span className="text-xs sm:text-sm font-bold font-mono text-neutral-900">146ms</span>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200/80 text-left shadow-2xs">
          <span className="block text-[10px] font-mono uppercase text-neutral-400">Peak Concurrency</span>
          <span className="text-xs sm:text-sm font-bold font-mono text-neutral-900">4,800 TPS</span>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200/80 text-left shadow-2xs">
          <span className="block text-[10px] font-mono uppercase text-neutral-400">Duplicate Charges</span>
          <span className="text-xs sm:text-sm font-bold font-mono text-emerald-600">0.00%</span>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200/80 text-left shadow-2xs">
          <span className="block text-[10px] font-mono uppercase text-neutral-400">SLA Guarantee</span>
          <span className="text-xs sm:text-sm font-bold font-mono text-neutral-900">99.999%</span>
        </div>
      </div>

      {/* Action Buttons (Design System Standards) */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap pt-1">
        <button
          type="button"
          onClick={scrollToWorkstation}
          className="flex items-center justify-center gap-2 h-10 px-5 rounded-xl text-xs font-medium bg-[#171717] hover:bg-[#303030] active:bg-[#404040] text-white transition-colors duration-150 ease-in-out cursor-pointer shadow-2xs"
        >
          <span>Launch Interactive Sandbox</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={scrollToArchitecture}
          className="h-10 px-4 rounded-xl text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:border-neutral-300 transition-colors duration-150 cursor-pointer shadow-2xs flex items-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5 text-neutral-500" />
          <span>System Blueprint</span>
        </button>

        <Link
          href="/demo/paystream"
          className="h-10 px-4 rounded-xl text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:border-neutral-300 transition-colors duration-150 cursor-pointer shadow-2xs flex items-center gap-1.5"
        >
          <Terminal className="w-3.5 h-3.5 text-neutral-500" />
          <span>Full-Screen Workstation</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
        </Link>
      </div>
    </section>
  );
}

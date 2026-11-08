"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play, Layers } from "lucide-react";

export type ActiveNavTab = "simulation" | "architecture" | "specs" | "demo";

interface HeaderProps {
  activeTab?: ActiveNavTab;
  setActiveTab?: (tab: ActiveNavTab) => void;
  onOpenArchitecture?: () => void;
}

export function Header({
  activeTab = "simulation",
  setActiveTab,
  onOpenArchitecture,
}: HeaderProps) {
  return (
    <header className="shrink-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-black/[0.08]">
      <div className="max-w-[1520px] mx-auto px-4 h-12 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none"
          >
            <div className="w-6 h-6 rounded-md bg-[#111111] text-white flex items-center justify-center font-bold text-[11px] tracking-tight shadow-2xs">
              PS
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-neutral-900 tracking-tight">
                PayStream
              </span>
              <span className="text-neutral-300 select-none">/</span>
              <span className="text-neutral-500 font-normal hidden sm:inline text-[11.5px]">
                Payment Infrastructure
              </span>
            </div>
          </Link>


        </div>

        {/* Center: Quick Workstation Navigation Tabs */}
        <nav className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-black/[0.06] text-xs font-sans overflow-x-auto scrollbar-none">
          <Link
            href="/"
            className={`px-3 py-1 rounded-md text-[11px] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "simulation"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-500 hover:text-neutral-900 font-medium"
            }`}
          >
            Simulation
          </Link>

          {onOpenArchitecture ? (
            <button
              type="button"
              onClick={onOpenArchitecture}
              className="px-3 py-1 rounded-md text-[11px] transition-all cursor-pointer whitespace-nowrap text-neutral-500 hover:text-neutral-900 font-medium"
            >
              Architecture
            </button>
          ) : (
            <a
              href="https://adarshcodes.com/#project=razorpay"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-md text-[11px] transition-all cursor-pointer whitespace-nowrap text-neutral-500 hover:text-neutral-900 font-medium"
            >
              Architecture
            </a>
          )}

          <Link
            href="/demo/paystream"
            className="px-3 py-1 rounded-md text-[11px] transition-all cursor-pointer whitespace-nowrap text-neutral-500 hover:text-neutral-900 font-medium flex items-center gap-1"
          >
            <Play className="w-2.5 h-2.5 fill-current text-emerald-600" />
            <span>Live Demo</span>
          </Link>
        </nav>

        {/* Right: Portfolio & GitHub */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://adarshcodes.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors px-2.5 py-1 rounded-md border border-black/[0.08] bg-white hover:bg-neutral-50 shadow-2xs"
          >
            <span>Portfolio</span>
            <ArrowUpRight className="w-3 h-3 text-neutral-400" />
          </a>

          <a
            href="https://github.com/Adarsh6158/Distributed-Payment-Gateway-Platform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-900 transition-colors px-2.5 py-1 rounded-md border border-black/[0.08] bg-white hover:bg-neutral-50 shadow-2xs"
          >
            <Image
              src="/Github.svg"
              alt="GitHub"
              width={13}
              height={13}
              className="w-3 h-3 object-contain"
            />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}

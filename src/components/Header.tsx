"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200/80">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-8 h-13 flex items-center justify-between gap-2">
        {/* Left: Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none rounded-lg p-1 -ml-1 transition-opacity"
        >
          <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50 shadow-[0_1px_2px_rgba(0,0,0,0.04)] shrink-0 flex items-center justify-center">
            <Image
              src="/icon.png"
              alt="Adarsh Kumar Brand Mark"
              width={22}
              height={22}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs min-w-0">
            <span className="font-semibold text-neutral-900 tracking-tight shrink-0">
              Adarsh Kumar
            </span>
            <span className="text-neutral-300 font-light select-none">/</span>
            <span className="font-medium text-neutral-600 truncate">
              PayStream
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-neutral-500 bg-neutral-100 border border-neutral-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              v2.4
            </span>
          </div>
        </Link>

        {/* Center: Subtle platform descriptor */}
        <div className="hidden md:flex items-center gap-2 text-xs text-neutral-500 font-normal select-none">
          <span className="text-neutral-400">Engine</span>
          <span className="text-neutral-300">•</span>
          <span>Distributed Payment Gateway &amp; Reactive Settlement Engine</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://adarshcodes.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors px-2 sm:px-2.5 py-1.5 rounded-lg border border-neutral-200/80 hover:border-neutral-300 bg-white hover:bg-neutral-50 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
          >
            <span className="hidden sm:inline">Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <a
            href="https://github.com/Adarsh6158/Distributed-Payment-Gateway-Platform"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-neutral-800 hover:text-neutral-950 transition-colors px-2 sm:px-2.5 py-1.5 rounded-lg border border-neutral-200/80 hover:border-neutral-300 bg-white hover:bg-neutral-50 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
          >
            <Image
              src="/Github.svg"
              alt="GitHub"
              width={14}
              height={14}
              className="w-3.5 h-3.5 object-contain"
            />
            <span className="hidden sm:inline">GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90"
        >
          <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-200/80 bg-white shadow-xs shrink-0 flex items-center justify-center">
            <Image
              src="/icon.png"
              alt="Adarsh Kumar Brand Mark"
              width={24}
              height={24}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900 tracking-tight">
              Adarsh Kumar
            </span>
            <span className="text-slate-300 font-light select-none">/</span>
            <span className="text-xs font-medium text-slate-600 bg-slate-100/80 border border-slate-200/60 px-2 py-0.5 rounded-full">
              PayStream
            </span>
          </div>
        </Link>

        {/* Center: Tagline with subtle light color */}
        <div className="hidden lg:flex items-center text-xs font-normal text-slate-500 tracking-tight select-none">
          Explore the architecture, then experience the payment gateway live.
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="https://adarshcodes.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg border border-slate-200/80 hover:border-slate-300 bg-white shadow-xs focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <span>Main Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <a
            href="https://github.com/Adarsh6158/Distributed-Payment-Gateway-Platform"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors px-3 py-1.5 rounded-lg border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50 shadow-xs focus-visible:outline-2 focus-visible:outline-emerald-600"
          >
            <Image
              src="/Github.svg"
              width={14}
              height={14}
              alt="GitHub"
              className="w-3.5 h-3.5 object-contain"
            />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}

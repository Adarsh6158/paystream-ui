"use client";

import React from "react";
import Image from "next/image";
import { Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 py-2.5 sm:py-3 flex flex-col md:flex-row gap-2.5 sm:gap-4 items-center justify-between text-xs text-slate-500">
      {/* Left: Copyright & Website Name */}
      <div className="flex items-center gap-2 text-[12.5px] font-medium tracking-wide text-slate-600">
        <span className="font-semibold text-slate-800">
          &copy; 2026 ADARSH KUMAR
        </span>
        <span className="text-slate-300 font-light select-none">&bull;</span>
        <a
          href="https://adarshcodes.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
          <span>adarshcodes.com</span>
        </a>
      </div>

      {/* Center: Motto (Exact from PersonalPortfolio) */}
      <div className="font-mono text-[10.5px] font-semibold text-slate-400 uppercase tracking-[0.12em] order-3 md:order-2 select-none text-center">
        Always learning. Always building.
      </div>

      {/* Right: Exact Social Icons from PersonalPortfolio */}
      <div className="flex items-center gap-5 order-2 md:order-3">
        {/* GitHub */}
        <a
          href="https://github.com/Adarsh6158"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative hover:scale-105 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 rounded-sm flex items-center justify-center"
          aria-label="GitHub Profile"
          title="GitHub"
        >
          <Image
            src="/Github.svg"
            width={24}
            height={24}
            alt="GitHub"
            className="transition-opacity w-6 h-6 object-contain"
          />
        </a>

        {/* LinkedIn */}
        <a
          href="https://linkedin.com/in/adarshmall"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative hover:-translate-y-[2px] hover:scale-105 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 rounded-sm flex items-center justify-center"
          aria-label="LinkedIn Profile"
          title="LinkedIn"
        >
          <Image
            src="/LinkedIn.svg"
            width={24}
            height={24}
            alt="LinkedIn"
            className="transition-opacity w-6 h-6 object-contain"
          />
        </a>

        {/* LeetCode */}
        <a
          href="https://leetcode.com/u/AdarshMall/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative hover:scale-105 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 rounded-sm flex items-center justify-center"
          aria-label="LeetCode Profile"
          title="LeetCode"
        >
          <Image
            src="/Leetcode.svg"
            width={24}
            height={24}
            alt="LeetCode"
            className="transition-opacity w-6 h-6 object-contain"
          />
        </a>

        {/* Medium */}
        <a
          href="https://medium.com/@adarshkumar11"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative hover:scale-105 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 rounded-sm flex items-center justify-center"
          aria-label="Medium Profile"
          title="Medium"
        >
          <Image
            src="/Medium.png"
            width={24}
            height={24}
            alt="Medium"
            className="transition-opacity w-6 h-6 object-contain"
          />
        </a>

        {/* Gmail */}
        <a
          href="mailto:adarshk.swe@gmail.com"
          className="group relative hover:-translate-y-[2px] hover:scale-105 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 rounded-sm flex items-center justify-center"
          aria-label="Email Adarsh Kumar"
          title="Gmail"
        >
          <Image
            src="/Gmail.svg"
            width={24}
            height={24}
            alt="Gmail"
            className="transition-opacity w-6 h-6 object-contain"
          />
        </a>
      </div>
    </footer>
  );
}

"use client";

import React, { ReactNode } from "react";
import { Lock, RotateCw, ExternalLink } from "lucide-react";

interface BrowserFrameProps {
  url: string;
  title?: string;
  onReplay?: () => void;
  isReplaying?: boolean;
  children: ReactNode;
  externalLink?: string;
  className?: string;
}

export function BrowserFrame({
  url,
  title,
  onReplay,
  isReplaying = false,
  children,
  externalLink,
  className = "",
}: BrowserFrameProps) {
  return (
    <div
      className={`group/browser relative flex flex-col w-full rounded-xl overflow-hidden bg-white border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.03)] transition-all duration-300 ${className}`}
    >
      <div className="h-9 bg-slate-100/90 border-b border-slate-200/80 px-3 sm:px-4 flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 inline-block" />
        </div>

        <div className="flex items-center justify-center flex-1 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-1.5 w-full py-0.5 px-3 bg-white/95 rounded-md border border-slate-200/70 text-slate-600 shadow-2xs text-[11px] font-mono font-medium truncate">
            <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate text-slate-700">{url}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onReplay && (
            <button
              type="button"
              onClick={onReplay}
              disabled={isReplaying}
              title="Replay simulation walkthrough"
              aria-label="Replay simulation walkthrough"
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-50 cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isReplaying ? "animate-spin text-emerald-600" : ""}`} />
            </button>
          )}

          {externalLink && (
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Open live deployment in new tab"
              aria-label="Open live deployment in new tab"
              className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="relative w-full bg-[#0B0F19] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

"use client";

import React, { ReactNode, useState } from "react";
import { Lock, RotateCw, ExternalLink, Check, Copy } from "lucide-react";

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
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Ignore clipboard write failures gracefully
    }
  };

  return (
    <div
      aria-label={title || "Payment Gateway Workstation & Sandbox"}
      className={`group/browser relative flex flex-col w-full rounded-xl overflow-hidden bg-white border border-[#E2DDD2] shadow-[0_2px_12px_rgba(28,36,27,0.04),0_1px_3px_rgba(28,36,27,0.02)] transition-all ${className}`}
    >
      {/* Browser Chrome Header */}
      <div className="h-10 bg-[#F0ECE1] border-b border-[#E2DDD2] px-3 sm:px-4 flex items-center justify-between gap-3 select-none">
        {/* Left: Window Dots */}
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D8D2C4] group-hover/browser:bg-[#E8412C] transition-colors" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#D8D2C4] group-hover/browser:bg-[#D4A359] transition-colors" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#D8D2C4] group-hover/browser:bg-[#9CAF88] transition-colors" />
        </div>

        {/* Center: URL Bar with TLS & Copy */}
        <div className="flex items-center justify-center flex-1 max-w-sm sm:max-w-lg mx-auto">
          <button
            type="button"
            onClick={handleCopyUrl}
            title={copied ? "Copied URL to clipboard!" : "Click to copy URL"}
            className="group/url flex items-center justify-between gap-2 w-full py-1 px-2.5 bg-white rounded-md border border-[#E2DDD2] text-[#1C241B] shadow-[0_1px_2px_rgba(28,36,27,0.02)] hover:border-[#9CAF88] text-[11px] font-mono transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Lock className="w-3 h-3 text-[#9CAF88] shrink-0" />
              <span className="truncate text-[#1C241B] font-medium">{url}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#7C8777] group-hover/url:text-[#1C241B] shrink-0">
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[#9CAF88]" />
                  <span className="text-[#9CAF88] font-sans font-medium">Copied</span>
                </>
              ) : (
                <Copy className="w-3 h-3 opacity-0 group-hover/url:opacity-100 transition-opacity" />
              )}
            </div>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {onReplay && (
            <button
              type="button"
              onClick={onReplay}
              disabled={isReplaying}
              title="Restart settlement walkthrough"
              aria-label="Restart settlement walkthrough"
              className="p-1.5 rounded-md text-[#5E6958] hover:text-[#1C241B] hover:bg-[#EAE5DA] transition-colors focus-visible:ring-2 focus-visible:ring-[#9CAF88] focus-visible:outline-none disabled:opacity-40 cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isReplaying ? "animate-spin text-[#9CAF88]" : ""}`} />
            </button>
          )}

          {externalLink && (
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full interactive demo"
              aria-label="Open full interactive demo"
              className="p-1.5 rounded-md text-[#5E6958] hover:text-[#1C241B] hover:bg-[#EAE5DA] transition-colors focus-visible:ring-2 focus-visible:ring-[#9CAF88] focus-visible:outline-none"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Surface Canvas */}
      <div className="relative w-full bg-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PROJECTS, getProjectById, Project } from "@/data/projects";
import {
  ArrowLeft,
  RotateCw,
  ExternalLink,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

interface DemoClientProps {
  slug: string;
}

export function DemoClient({ slug }: DemoClientProps) {
  const project: Project = getProjectById(slug) || PROJECTS[0];

  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t0 = setTimeout(() => setIsLoading(true), 10);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => {
      clearTimeout(t0);
      clearTimeout(timer);
    };
  }, [project.id, iframeKey]);

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const getContainerWidth = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-[390px]";
      case "tablet":
        return "max-w-[768px]";
      case "desktop":
      default:
        return "max-w-full";
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      <header className="shrink-0 h-14 bg-white border-b border-slate-200/90 px-3 sm:px-6 flex items-center justify-between gap-3 shadow-2xs z-30">
        <div className="flex items-center gap-2 sm:gap-4 truncate">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Showcase</span>
            <span className="sm:hidden">Showcase</span>
          </Link>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100/90 rounded-md border border-slate-200/80">
            <span>{project.name}</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="flex items-center justify-between w-full px-3 py-1 bg-slate-50 rounded-lg border border-slate-200/80 text-xs font-mono text-slate-600 shadow-2xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate text-slate-800 font-medium">{project.liveUrl}</span>
            </div>
            <span className="text-[10px] text-slate-400 shrink-0 ml-2">HTTPS</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden md:flex items-center bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setViewport("desktop")}
              title="Desktop View"
              aria-label="Desktop View"
              className={`p-1.5 rounded-md transition-colors ${
                viewport === "desktop" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport("tablet")}
              title="Tablet View"
              aria-label="Tablet View"
              className={`p-1.5 rounded-md transition-colors ${
                viewport === "tablet" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              title="Mobile View"
              aria-label="Mobile View"
              className={`p-1.5 rounded-md transition-colors ${
                viewport === "mobile" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleRefresh}
            title="Reload Application Frame"
            aria-label="Reload Application Frame"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <a
            href={project.architectureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Architecture</span>
          </a>

          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <span className="hidden sm:inline">Open Live</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      <main className="flex-1 min-h-0 p-2 sm:p-4 md:p-6 flex items-center justify-center bg-slate-100/60 overflow-hidden">
        <div
          className={`relative h-full w-full ${getContainerWidth()} mx-auto transition-all duration-300 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col`}
        >
          <div className="h-8 bg-slate-50 border-b border-slate-200/80 px-3 flex items-center justify-between text-xs text-slate-500 shrink-0 select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="text-[11px] font-mono text-slate-400 ml-2">{project.name} Environment</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>TLS 1.3 Active</span>
            </div>
          </div>

          <div className="relative flex-1 w-full bg-white overflow-hidden">
            <iframe
              key={iframeKey}
              src={project.liveUrl}
              title={`${project.name} Interactive Application`}
              className="w-full h-full border-0 select-auto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {isLoading && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center gap-3.5 z-20 px-4 text-center">
                {/* SVG Logo from Personal Portfolio (Rotating AI for Code2Live, Visa Card for PayStream) */}
                <div className="relative flex items-center justify-center p-3 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-xs">
                  <img
                    src={project.id.includes("pay") ? "/Payment.svg" : "/AiAnim.svg"}
                    alt={`${project.name} Environment`}
                    className={`select-none ${
                      project.id.includes("pay")
                        ? "w-28 h-18 object-contain"
                        : "w-20 h-20 sm:w-24 sm:h-24 object-contain"
                    }`}
                  />
                </div>

                <div
                  className={`w-7 h-7 rounded-full border-2 border-slate-200 animate-spin ${
                    project.accentColor === "emerald"
                      ? "border-t-emerald-600"
                      : "border-t-blue-600"
                  }`}
                />

                <div className="text-center space-y-1">
                  <p className="text-xs font-mono font-semibold text-slate-800">
                    Connecting to {project.name}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400">
                    Loading secure iframe sandbox environment...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="shrink-0 h-8 bg-white border-t border-slate-200/80 px-4 flex items-center justify-between text-[11px] font-mono text-slate-500 select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Interactive Sandbox Session</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>Viewport: {viewport.toUpperCase()}</span>
          <span>•</span>
          <span>Security: Sandboxed</span>
        </div>
      </footer>
    </div>
  );
}

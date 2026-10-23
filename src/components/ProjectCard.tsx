"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Project } from "@/data/projects";
import { BrowserFrame } from "./BrowserFrame";
import { PayStreamPreview } from "./PayStreamPreview";
import { ArrowUpRight, ArrowRight, Layers, Play, Zap, ShieldCheck } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isReplaying, setIsReplaying] = useState(false);

  const handleReplay = () => {
    setIsReplaying(true);
  };

  const handleReplayComplete = () => {
    setIsReplaying(false);
  };

  return (
    <article
      aria-labelledby={`project-title-${project.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-neutral-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all p-3.5 sm:p-5"
    >
      {/* Card Header: Title & Architecture Tags */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <h2
            id={`project-title-${project.id}`}
            className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900"
          >
            PayStream
          </h2>
          <span className="text-xs sm:text-sm font-medium text-neutral-500">
            Distributed Payment Gateway &amp; Settlement Engine
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-50 border border-neutral-200/80">
            <Zap className="w-3 h-3 text-emerald-600" />
            <span>Reactive WebFlux</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-50 border border-neutral-200/80">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            <span>Resilience4j Failover</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Browser Workstation */}
      <div className="my-2 sm:my-3">
        <BrowserFrame
          url={project.liveUrl}
          title={project.name}
          onReplay={handleReplay}
          isReplaying={isReplaying}
          externalLink="/demo/paystream"
        >
          <PayStreamPreview
            isReplaying={isReplaying}
            onReplayComplete={handleReplayComplete}
          />
        </BrowserFrame>
      </div>

      {/* Card Footer: Primary & Secondary CTAs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4 pt-3 sm:pt-4 border-t border-neutral-100">
        {/* Secondary CTA: View Architecture */}
        <a
          href={project.architectureUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="order-2 sm:order-1 group/btn inline-flex items-center justify-center gap-2 h-11 px-5 sm:px-7 rounded-xl border border-neutral-200/90 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-800 text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none w-full sm:w-auto"
        >
          <Layers className="w-4 h-4 text-neutral-500 group-hover/btn:text-emerald-600 transition-colors" />
          <span>View Architecture</span>
          <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover/btn:text-neutral-700 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </a>

        {/* Primary CTA: Try Live Demo */}
        <Link
          href="/demo/paystream"
          className="order-1 sm:order-2 group/btn inline-flex items-center justify-center gap-2 h-11 px-6 sm:px-8 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.35)] transition-all active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none w-full sm:w-auto"
        >
          <Play className="w-4 h-4 fill-current text-white/95" />
          <span>Try Live Demo</span>
          <ArrowRight className="w-4 h-4 text-white/80 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
}

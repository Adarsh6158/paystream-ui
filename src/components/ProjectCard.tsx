"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Project } from "@/data/projects";
import { BrowserFrame } from "./BrowserFrame";
import { PayStreamPreview } from "./PayStreamPreview";
import { ArrowUpRight, ArrowRight, Layers, Play } from "lucide-react";

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
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.02)] hover:border-slate-300 hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] transition-all duration-300 p-3.5 sm:p-4"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <h2
            id={`project-title-${project.id}`}
            className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors"
          >
            PayStream
          </h2>
          <span className="text-xs sm:text-[13px] font-medium text-slate-500">
            Distributed Payment Gateway & Settlement Engine
          </span>
        </div>
      </div>

      <div className="my-2 sm:my-2.5">
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

      <div className="flex items-center justify-center gap-2.5 sm:gap-4 pt-2.5 sm:pt-3 border-t border-slate-100">
        <a
          href={project.architectureUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn inline-flex items-center justify-center gap-2 h-10 sm:h-11 px-5 sm:px-7 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <Layers className="w-3.5 h-3.5 text-slate-500 group-hover/btn:text-blue-600 transition-colors" />
          <span>View Architecture</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-slate-700 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </a>

        <Link
          href="/demo/paystream"
          className="group/btn inline-flex items-center justify-center gap-2 h-10 sm:h-11 px-6 sm:px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-[0_4px_16px_rgba(37,99,235,0.28)] hover:shadow-[0_6px_22px_rgba(37,99,235,0.40)] transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <Play className="w-3.5 h-3.5 fill-white text-white" />
          <span>Try Live Demo</span>
          <ArrowRight className="w-3.5 h-3.5 text-white transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

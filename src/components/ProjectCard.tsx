"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Project } from "@/data/projects";
import { BrowserFrame } from "./BrowserFrame";
import { PayStreamSimulation } from "./PayStreamSimulation";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { EngineeringDeepDive } from "./EngineeringDeepDive";
import {
  ArrowRight,
  Layers,
  Play,
  Zap,
  ShieldCheck,
  X,
  ExternalLink,
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  initialArchitectureOpen?: boolean;
}

export function ProjectCard({ project, initialArchitectureOpen = false }: ProjectCardProps) {
  const [isArchModalOpen, setIsArchModalOpen] = useState(initialArchitectureOpen);
  const [archTab, setArchTab] = useState<"diagram" | "specs">("diagram");

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isArchModalOpen) {
        setIsArchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isArchModalOpen]);

  return (
    <>
      <article
        id="simulation-section"
        aria-labelledby={`project-title-${project.id}`}
        className="group flex flex-col bg-white rounded-2xl border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-3.5 sm:p-5 space-y-4"
      >
        {/* Card Header: Title & Architecture Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1 border-b border-neutral-100">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h2
              id={`project-title-${project.id}`}
              className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900"
            >
              PayStream
            </h2>
            <span className="text-xs sm:text-sm font-medium text-neutral-500">
              Payment Gateway &amp; Settlement Engine
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-sans text-neutral-600">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
              <Zap className="w-3 h-3 text-emerald-600" />
              <span>Reactive Non-Blocking</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
              <ShieldCheck className="w-3 h-3 text-neutral-700" />
              <span>Dual-Bank Failover</span>
            </span>
          </div>
        </div>

        {/* Main Simulation Viewport (Plays like an automated video walkthrough) */}
        <div className="w-full">
          <BrowserFrame
            url="https://api.paystream.dev/v1/payments/charge"
            title={project.name}
            externalLink="/demo/paystream"
          >
            <PayStreamSimulation
              onOpenArchitecture={() => setIsArchModalOpen(true)}
            />
          </BrowserFrame>
        </div>

        {/* Card Footer: The two prominent options requested by the user */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-neutral-100">
          <div className="text-xs text-neutral-500 font-sans">
            <span>Engineered with Spring Boot 3.3, Project Reactor, Kafka, Redis, and Resilience4j.</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Option 1: Explore Architecture */}
            <button
              type="button"
              onClick={() => setIsArchModalOpen(true)}
              className="group/btn inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-neutral-200/90 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-700 hover:text-neutral-900 text-xs font-medium shadow-2xs transition-colors duration-150 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-neutral-500 group-hover/btn:text-neutral-800 transition-colors" />
              <span>Explore Architecture</span>
            </button>

            {/* Option 2: Try Demo (Signature Pitch-Black Tactile Button) */}
            <Link
              href="/demo/paystream"
              className="group/btn inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-[#111111] hover:bg-[#252525] active:bg-[#333333] text-white text-xs font-medium transition-colors duration-150 ease-in-out cursor-pointer shadow-2xs"
            >
              <Play className="w-3.5 h-3.5 fill-current text-white/95" />
              <span>Try Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </article>

      {/* Interactive System Architecture Modal */}
      {isArchModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="PayStream System Architecture"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsArchModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl border border-neutral-200/90 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50/80">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
                  PS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    PayStream System Architecture &amp; Deep Dive
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-sans">
                    High-throughput non-blocking payment gateway topology
                  </p>
                </div>
              </div>

              {/* Tab Selector & Close */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-neutral-200/80 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setArchTab("diagram")}
                    className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      archTab === "diagram"
                        ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    System Topology
                  </button>
                  <button
                    type="button"
                    onClick={() => setArchTab("specs")}
                    className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      archTab === "specs"
                        ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    Engineering Specs
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsArchModalOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/70 transition-colors cursor-pointer"
                  aria-label="Close Architecture Dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {archTab === "diagram" ? (
                <ArchitectureDiagram />
              ) : (
                <EngineeringDeepDive />
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
              <span className="font-mono text-[11px]">
                Spring Boot 3.3.4 &bull; Apache Kafka &bull; Redis 7.2 &bull; Resilience4j
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/demo/paystream"
                  onClick={() => setIsArchModalOpen(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] text-white text-[11px] font-medium hover:bg-neutral-800 transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Open Interactive Demo</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
        className="group flex flex-col bg-white rounded-2xl border border-[#E2DDD2] shadow-[0_2px_16px_rgba(28,36,27,0.04)] p-3.5 sm:p-5 space-y-4"
      >
        {/* Card Header: Title & Architecture Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1 border-b border-[#E2DDD2]">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h2
              id={`project-title-${project.id}`}
              className="text-lg sm:text-xl font-bold tracking-tight text-[#1C241B]"
            >
              PayStream
            </h2>
            <span className="text-xs sm:text-sm font-medium text-[#5E6958]">
              Payment Gateway &amp; Settlement Engine
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-sans">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF2E7] text-[#2C3E26] border border-[#C9D8C0]">
              <Zap className="w-3 h-3 text-[#9CAF88]" />
              <span>Reactive Non-Blocking</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F3] text-[#1C241B] border border-[#E2DDD2]">
              <ShieldCheck className="w-3 h-3 text-[#9CAF88]" />
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#E2DDD2]">
          <div className="text-xs text-[#5E6958] font-sans">
            <span>Engineered with Spring Boot 3.3, Project Reactor, Kafka, Redis, and Resilience4j.</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Option 1: Explore Architecture */}
            <button
              type="button"
              onClick={() => setIsArchModalOpen(true)}
              className="group/btn inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-[#E2DDD2] bg-[#FAF8F3] hover:bg-white hover:border-[#9CAF88] text-[#1C241B] text-xs font-medium shadow-2xs transition-colors duration-150 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#5E6958] group-hover/btn:text-[#1C241B] transition-colors" />
              <span>Explore Architecture</span>
            </button>

            {/* Option 2: Try Demo (Signature Tomato Red Tactile Button) */}
            <Link
              href="/demo/paystream"
              className="group/btn inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-[#E8412C] hover:bg-[#D33622] active:bg-[#BD2E1C] text-white text-xs font-medium transition-all duration-150 ease-in-out cursor-pointer shadow-[0_2px_12px_rgba(232,65,44,0.28)]"
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
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl border border-[#E2DDD2] shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2DDD2] bg-[#F7F5EF]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#1C241B] text-[#F7F5EF] flex items-center justify-center font-bold text-xs">
                  PS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1C241B]">
                    PayStream System Architecture &amp; Deep Dive
                  </h3>
                  <p className="text-[11px] text-[#5E6958] font-sans">
                    High-throughput non-blocking payment gateway topology
                  </p>
                </div>
              </div>

              {/* Tab Selector & Close */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#EDE7DC] p-0.5 rounded-lg border border-[#E2DDD2] text-xs">
                  <button
                    type="button"
                    onClick={() => setArchTab("diagram")}
                    className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      archTab === "diagram"
                        ? "bg-white text-[#1C241B] shadow-2xs font-semibold"
                        : "text-[#5E6958] hover:text-[#1C241B]"
                    }`}
                  >
                    System Topology
                  </button>
                  <button
                    type="button"
                    onClick={() => setArchTab("specs")}
                    className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                      archTab === "specs"
                        ? "bg-white text-[#1C241B] shadow-2xs font-semibold"
                        : "text-[#5E6958] hover:text-[#1C241B]"
                    }`}
                  >
                    Engineering Specs
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsArchModalOpen(false)}
                  className="p-1.5 rounded-lg text-[#5E6958] hover:text-[#1C241B] hover:bg-[#EAE5DA] transition-colors cursor-pointer"
                  aria-label="Close Architecture Dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF8F4]">
              {archTab === "diagram" ? (
                <ArchitectureDiagram />
              ) : (
                <EngineeringDeepDive />
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-[#E2DDD2] bg-[#F7F5EF] flex items-center justify-between text-xs text-[#5E6958]">
              <span className="font-mono text-[11px]">
                Spring Boot 3.3.4 &bull; Apache Kafka &bull; Redis 7.2 &bull; Resilience4j
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/demo/paystream"
                  onClick={() => setIsArchModalOpen(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8412C] hover:bg-[#D33622] text-white text-[11px] font-medium transition-colors shadow-2xs"
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

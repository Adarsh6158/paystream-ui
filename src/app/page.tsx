"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { Footer } from "@/components/Footer";
import { PROJECTS } from "@/data/projects";
import { Layers } from "lucide-react";

const TECH_STACK_ITEMS: { name: string; icon: string }[] = [
  { name: "Spring Boot", icon: "/icons/SpringBoot.png" },
  { name: "Apache Kafka", icon: "/icons/Kafka.png" },
  { name: "Redis", icon: "/icons/Redis.svg" },
  { name: "Kubernetes", icon: "/icons/Kubernetes.svg" },
  { name: "React 19", icon: "/icons/React.svg" },
  { name: "TypeScript", icon: "/icons/Typescript.svg" },
];

export default function Home() {
  const project = PROJECTS[0];
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#F7F5EF] text-[#1C241B] font-sans antialiased selection:bg-[#E8412C] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Subtle editorial dot pattern with organic sage highlight */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(156,175,136,0.15)_0%,rgba(247,245,239,0)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1C241B12_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* Top Application Header */}
      <Header onOpenArchitecture={() => setIsArchitectureOpen(true)} />

      {/* Main Single-Viewport Workstation */}
      <main className="flex-1 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-6 flex flex-col gap-3.5">
        {/* Automated Video-Like Payment Simulation Card with Options below */}
        <section aria-label="PayStream Simulation" className="w-full">
          <ProjectCard
            project={project}
            initialArchitectureOpen={isArchitectureOpen}
          />
        </section>

        {/* Dedicated STACK Card with Clean Logos */}
        <section
          aria-label="Technology Stack"
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E2DDD2] text-[#1C241B] flex items-center justify-between gap-3 shadow-[0_1px_3px_rgba(28,36,27,0.02)]"
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold tracking-wider text-[#2C3E26] bg-[#EBF2E7] border border-[#C9D8C0] shrink-0 uppercase">
              <Layers className="w-3.5 h-3.5 text-[#9CAF88]" />
              <span>STACK</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {TECH_STACK_ITEMS.map((tech) => (
                <span
                  key={tech.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF8F3] border border-[#E2DDD2] text-[11.5px] font-mono font-medium text-[#1C241B] shadow-[0_1px_2px_rgba(28,36,27,0.02)] hover:border-[#9CAF88] transition-colors select-none"
                >
                  <Image
                    src={tech.icon}
                    alt={`${tech.name} icon`}
                    width={14}
                    height={14}
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span>{tech.name}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-[#7C8777]">
            <span>Non-Blocking Reactive Netty</span>
            <span>&bull;</span>
            <span className="text-[#E8412C] font-semibold">Sub-200ms Target</span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

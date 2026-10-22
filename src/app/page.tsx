"use client";

import React from "react";
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

  return (
    <div className="relative min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased selection:bg-blue-500/20 selection:text-slate-900 flex flex-col justify-between overflow-x-hidden">
      {/* Ambient Engineering Background Grid & Soft Radial Glows */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Subtle engineering dot matrix pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-45 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,#000_50%,transparent_100%)]" />

        {/* Ambient center top soft glow */}
        <div className="absolute -top-[140px] left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-gradient-to-b from-blue-500/10 via-indigo-500/6 to-transparent rounded-full blur-3xl opacity-80" />

        {/* Subtle ambient left & right flank tints */}
        <div className="absolute top-[25%] -left-[160px] w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute top-[35%] -right-[160px] w-[500px] h-[500px] bg-indigo-400/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="flex-1 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-1.5 pb-3.5 flex flex-col gap-2 sm:gap-2.5">
        <section aria-label="Featured Project" className="w-full">
          <ProjectCard project={project} />
        </section>

        {/* Dedicated STACK Card with logos */}
        <section
          aria-label="Technology Stack"
          className="w-full px-4 py-2 rounded-xl bg-slate-50/90 border border-slate-200/90 text-slate-700 flex items-center gap-2.5 shadow-2xs"
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold tracking-wider text-slate-800 bg-white border border-slate-200 shadow-2xs shrink-0 uppercase">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>STACK</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {TECH_STACK_ITEMS.map((tech) => (
                <span
                  key={tech.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200/80 text-[11.5px] font-mono font-medium text-slate-700 shadow-2xs hover:border-slate-300 transition-colors select-none"
                >
                  <Image
                    src={tech.icon}
                    width={14}
                    height={14}
                    alt={tech.name}
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span>{tech.name}</span>
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

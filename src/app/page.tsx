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
    <div className="relative min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans antialiased selection:bg-emerald-600/10 selection:text-emerald-900 flex flex-col justify-between overflow-x-hidden">
      {/* Subtle, restrained engineering dot pattern without blurry colored blobs */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
      </div>

      <Header />

      <main className="flex-1 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1520px] mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-6 flex flex-col gap-3">
        <section aria-label="Featured Project" className="w-full">
          <ProjectCard project={project} />
        </section>

        {/* Dedicated STACK Card with clean logos */}
        <section
          aria-label="Technology Stack"
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-200/80 text-neutral-700 flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold tracking-wider text-neutral-800 bg-neutral-50 border border-neutral-200/80 shrink-0 uppercase">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>STACK</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {TECH_STACK_ITEMS.map((tech) => (
                <span
                  key={tech.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-neutral-200/80 text-[11.5px] font-mono font-medium text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-colors select-none"
                >
                  <Image
                    src={tech.icon}
                    alt={tech.name + ' icon'}
                    width={14}
                    height={14}
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

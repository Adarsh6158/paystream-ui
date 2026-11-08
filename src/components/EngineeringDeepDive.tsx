"use client";

import React from "react";
import {
  Zap,
  Lock,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight,
} from "lucide-react";

interface Pillar {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  icon: typeof Zap;
  keyStat: string;
  statLabel: string;
  points: string[];
  codeTag: string;
}

const PILLARS: Pillar[] = [
  {
    id: "reactive",
    badge: "CONCURRENCY MODEL",
    title: "Non-Blocking Reactive Streams",
    subtitle: "High-concurrency Netty event loops replacing thread-per-request blocking architectures.",
    icon: Zap,
    keyStat: "10x",
    statLabel: "Higher Throughput vs Tomcat",
    codeTag: "org.springframework.webflux",
    points: [
      "Zero thread blocking during external bank I/O delays",
      "Backpressure handling via Project Reactor Mono/Flux pipelines",
      "Memory footprint stays flat under high concurrency traffic spikes",
    ],
  },
  {
    id: "idempotency",
    badge: "DATA INTEGRITY",
    title: "Exactly-Once Distributed Idempotency",
    subtitle: "Atomic Redis distributed locks coupled with unique transaction key verification.",
    icon: Lock,
    keyStat: "0.0%",
    statLabel: "Duplicate Double-Debits",
    codeTag: "redis.setnx(key, 30s)",
    points: [
      "Distributed atomic SETNX lease prevents concurrent double-clicks",
      "Subsequent calls with identical key instantly return cached settlement",
      "30-second lease expiration ensures zero deadlocks if workers crash",
    ],
  },
  {
    id: "circuit-breaker",
    badge: "FAULT ISOLATION",
    title: "Resilience4j Dual-Bank Failover",
    subtitle: "Automatic circuit breaking isolating degraded banking rails without dropping transactions.",
    icon: GitBranch,
    keyStat: "99.999%",
    statLabel: "High Availability SLA",
    codeTag: "io.github.resilience4j:circuitbreaker",
    points: [
      "Sliding window monitors response latency and error rates across bank routes",
      "Auto-trips from CLOSED to OPEN when p99 latency breaches 650ms",
      "Seamlessly falls back to secondary banking rails (HDFC -> Axis)",
    ],
  },
  {
    id: "security",
    badge: "CRYPTOGRAPHY",
    title: "HMAC-SHA256 Signed Webhooks",
    subtitle: "Cryptographic signature validation and encrypted delivery for merchant notifications.",
    icon: ShieldCheck,
    keyStat: "256-bit",
    statLabel: "HMAC Signature Verification",
    codeTag: "HmacSHA256(payload, secret)",
    points: [
      "X-PayStream-Signature header protects against man-in-the-middle tampering",
      "Exponential backoff retry policy ensures 100% reliable event delivery",
      "Zero plain-text cardholder data storage compliant with PCI-DSS requirements",
    ],
  },
];

export function EngineeringDeepDive() {
  return (
    <section
      aria-label="Engineering Foundations"
      className="w-full space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
        <div>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-black/[0.06]">
            ENGINEERING FOUNDATIONS
          </span>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 mt-1">
            Built for Mission-Critical Fintech Scale
          </h2>
        </div>
        <p className="text-xs text-neutral-400 sm:max-w-md">
          How PayStream guarantees zero duplicate charges, sub-200ms settlement times, and 99.999% availability during severe downstream bank outages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <article
              key={pillar.id}
              className="p-4 rounded-xl bg-white border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                  <span className="text-[9.5px] font-mono font-semibold tracking-wider text-neutral-400 uppercase">
                    {pillar.badge}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded border border-black/[0.06]">
                    {pillar.codeTag}
                  </span>
                </div>

                <div className="flex items-start gap-3 mt-3">
                  <div className="w-7 h-7 rounded-md bg-[#111111] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Points */}
              <ul className="space-y-1.5 text-xs text-neutral-600 font-sans border-t border-black/[0.06] pt-2.5">
                {pillar.points.map((point, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* Key Stat Strip */}
              <div className="p-2.5 rounded-lg bg-neutral-50/80 border border-black/[0.06] flex items-center justify-between text-xs">
                <span className="text-neutral-400 text-[10.5px] font-medium">{pillar.statLabel}</span>
                <span className="font-mono font-bold text-neutral-900 text-sm">
                  {pillar.keyStat}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

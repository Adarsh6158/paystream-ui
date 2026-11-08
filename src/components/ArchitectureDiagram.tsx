"use client";

import React, { useState } from "react";
import {
  Server,
  Layers,
  Database,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  GitBranch,
  Lock,
  Cpu,
} from "lucide-react";

interface ArchitectureNode {
  id: string;
  title: string;
  role: string;
  icon: typeof Server;
  category: "ingestion" | "concurrency" | "storage" | "settlement" | "egress";
  metrics: string;
  details: string[];
  tech: string;
}

const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: "client",
    title: "Client & Ingestion",
    role: "Merchant Checkout & API Clients",
    icon: Lock,
    category: "ingestion",
    metrics: "TLS 1.3 • AES-256",
    tech: "HTTP/2 REST API",
    details: [
      "Transmits unique Idempotency-Key UUID header with each transaction payload",
      "Cryptographic payload validation before passing into ingress gateway",
      "Zero plain-text card data ingestion complying with PCI-DSS tokenization standards",
    ],
  },
  {
    id: "webflux",
    title: "Reactive Gateway Engine",
    role: "Spring WebFlux & Netty",
    icon: Zap,
    category: "concurrency",
    metrics: "4,800 TPS • 146ms p99",
    tech: "Spring Boot 3.3 • Netty",
    details: [
      "Non-blocking reactive event loop handles 10x concurrency compared to thread-per-request Tomcat",
      "Backpressure management prevents downstream bank saturation during traffic spikes",
      "Fully reactive Mono/Flux pipelines with strict 200ms timeout boundaries",
    ],
  },
  {
    id: "redis",
    title: "Distributed Lock Store",
    role: "Atomic Idempotency Engine",
    icon: Database,
    category: "storage",
    metrics: "0.4ms Latency • 0% Dupes",
    tech: "Redis 7.2 • Redisson",
    details: [
      "Atomic SETNX idempotency:{key} EX 30 guarantees exactly-once processing",
      "Concurrent double-clicks return cached settlement response in sub-2ms",
      "Distributed leasing avoids zombie locks on unexpected service termination",
    ],
  },
  {
    id: "kafka",
    title: "Event-Driven Ledger",
    role: "Partitioned Transaction Stream",
    icon: Layers,
    category: "storage",
    metrics: "txn.initiated • txn.settled",
    tech: "Apache Kafka 3.7",
    details: [
      "Strict in-order partition key routing by merchantId and accountId",
      "Immutable audit log guarantees zero-loss reconciliation for financial compliance",
      "Asynchronous consumer groups update analytics, ledgers, and fraud filters",
    ],
  },
  {
    id: "resilience",
    title: "Multi-Bank Circuit Breaker",
    role: "Zero-Drop Dual Bank Failover",
    icon: GitBranch,
    category: "settlement",
    metrics: "99.999% SLA • 42ms Failover",
    tech: "Resilience4j",
    details: [
      "Sliding window monitors response latency and error rates on primary bank rail (HDFC)",
      "Trips circuit breaker to OPEN when latency exceeds 650ms or errors exceed 5%",
      "Seamlessly reroutes traffic to backup bank rail (Axis) without dropping payments",
    ],
  },
  {
    id: "webhook",
    title: "Signed Webhook Dispatcher",
    role: "Asynchronous Notification Engine",
    icon: ShieldCheck,
    category: "egress",
    metrics: "HMAC-SHA256 • Exponential Backoff",
    tech: "Reactive WebClient",
    details: [
      "Every merchant webhook payload is signed with HMAC-SHA256 preventing replay attacks",
      "Asynchronous dispatch does not block the checkout settlement completion response",
      "Resilient retry engine with exponential jittered backoff across 3 attempts",
    ],
  },
];

export function ArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<ArchitectureNode>(ARCHITECTURE_NODES[1]);

  return (
    <section
      aria-label="Distributed System Architecture"
      className="w-full rounded-xl bg-white border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_-2px_rgba(0,0,0,0.03)] p-4 sm:p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-black/[0.06] pb-3">
        <div>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-black/[0.06]">
            SYSTEM DESIGN BLUEPRINT
          </span>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 mt-1">
            Distributed Reactive Data Pipeline
          </h2>
          <p className="text-xs text-neutral-400">
            Interactive node map of the sub-200ms payment processing lifecycle. Click any node to inspect engineering specifications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-50 border border-black/[0.06]">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>High-Throughput Topology</span>
          </span>
        </div>
      </div>

      {/* Nodes Map Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {ARCHITECTURE_NODES.map((node) => {
          const isSelected = activeNode.id === node.id;
          const Icon = node.icon;

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setActiveNode(node)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative flex flex-col justify-between h-28 ${
                isSelected
                  ? "bg-[#111111] border-[#111111] text-white shadow-2xs"
                  : "bg-white hover:bg-neutral-50 border-black/[0.08] text-neutral-800"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-neutral-800 text-white"
                      : "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`text-[9px] font-mono px-1 rounded ${
                    isSelected
                      ? "bg-neutral-800 text-neutral-300"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {node.tech.split(" ")[0]}
                </span>
              </div>

              <div>
                <span
                  className={`block text-[11.5px] font-semibold tracking-tight truncate ${
                    isSelected ? "text-white" : "text-neutral-900"
                  }`}
                >
                  {node.title}
                </span>
                <span
                  className={`block text-[9.5px] font-mono truncate mt-0.5 ${
                    isSelected ? "text-neutral-400" : "text-neutral-400"
                  }`}
                >
                  {node.metrics}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Node Detail Drawer */}
      <div className="p-3.5 sm:p-4 rounded-lg bg-neutral-50/80 border border-black/[0.06] space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-black/[0.06] pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#111111] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <activeNode.icon className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                  {activeNode.title}
                </h3>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-white border border-black/[0.08] text-neutral-700">
                  {activeNode.tech}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">{activeNode.role}</p>
            </div>
          </div>

          <div className="text-[11px] font-mono text-neutral-500 bg-white px-2.5 py-1 rounded-md border border-black/[0.08] shadow-2xs self-start sm:self-auto">
            Benchmark: <span className="font-semibold text-neutral-900">{activeNode.metrics}</span>
          </div>
        </div>

        {/* Bullet Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-0.5">
          {activeNode.details.map((detail, dIdx) => (
            <div
              key={dIdx}
              className="p-2.5 rounded-lg bg-white border border-black/[0.06] shadow-2xs text-[11.5px] text-neutral-700 leading-relaxed space-y-1"
            >
              <div className="text-[9.5px] font-mono text-neutral-400 font-semibold uppercase">
                SPEC 0{dIdx + 1}
              </div>
              <p>{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

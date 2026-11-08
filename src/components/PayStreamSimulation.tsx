"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Database,
  Layers,
  Send,
  Lock,
  AlertTriangle,
  Clock,
  Server,
  Building2,
  Check,
  CreditCard,
  Smartphone,
  ChevronRight,
} from "lucide-react";

interface StepConfig {
  id: number;
  label: string;
  duration: number; // seconds
  title: string;
  subtitle: string;
  statusBadge: string;
}

const STEPS: StepConfig[] = [
  {
    id: 1,
    label: "1. Checkout",
    duration: 3.5,
    title: "Customer Checkout & API Ingestion",
    subtitle: "Sarah Jenkins initiates a ₹1,499.00 payment. Gateway validates payload and assigns a unique idempotency key.",
    statusBadge: "Ingesting Request",
  },
  {
    id: 2,
    label: "2. Redis Lock",
    duration: 3.5,
    title: "Redis Distributed Idempotency Lock",
    subtitle: "Atomic SETNX acquires lock in 0.4ms with 30s TTL to prevent duplicate charges from network retries or double-clicks.",
    statusBadge: "Lock Acquired (0.4ms)",
  },
  {
    id: 3,
    label: "3. Bank Failover",
    duration: 4.0,
    title: "Resilience4j Multi-Bank Dynamic Failover",
    subtitle: "Primary HDFC bank rail exceeds 650ms timeout; circuit breaker trips and auto-routes to Axis Bank backup in 42ms.",
    statusBadge: "Auto-Failover (42ms)",
  },
  {
    id: 4,
    label: "4. Kafka Ledger",
    duration: 3.5,
    title: "Kafka Event Stream & Double-Entry Ledger",
    subtitle: "Payment captured event published to partition 2. Immutable general ledger balances debit and credit journals.",
    statusBadge: "Ledger Balanced",
  },
  {
    id: 5,
    label: "5. Settlement",
    duration: 3.5,
    title: "HMAC Webhook & Merchant Settlement",
    subtitle: "HMAC-SHA256 signature verified by merchant server (200 OK). Net settlement payout of ₹1,463.62 released on T+1.",
    statusBadge: "Settled (T+1)",
  },
];

const TOTAL_DURATION = STEPS.reduce((acc, step) => acc + step.duration, 0); // 18 seconds

interface PayStreamSimulationProps {
  onOpenLiveDemo?: () => void;
  onOpenArchitecture?: () => void;
}

export function PayStreamSimulation({
  onOpenLiveDemo,
  onOpenArchitecture,
}: PayStreamSimulationProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Determine current active step based on currentTime
  const getCurrentStepIndex = useCallback(() => {
    let accumulated = 0;
    for (let i = 0; i < STEPS.length; i++) {
      accumulated += STEPS[i].duration;
      if (currentTime < accumulated) {
        return i;
      }
    }
    return STEPS.length - 1;
  }, [currentTime]);

  const currentStepIdx = getCurrentStepIndex();
  const currentStep = STEPS[currentStepIdx];

  const getStepStartTime = (idx: number) => {
    let acc = 0;
    for (let i = 0; i < idx; i++) {
      acc += STEPS[i].duration;
    }
    return acc;
  };

  const stepProgress = Math.min(
    1,
    Math.max(
      0,
      (currentTime - getStepStartTime(currentStepIdx)) / currentStep.duration
    )
  );

  // Continuous animation loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSec = ((timestamp - lastTimestampRef.current) / 1000) * playbackSpeed;
      lastTimestampRef.current = timestamp;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;
        if (next >= TOTAL_DURATION) {
          return 0; // Seamless continuous loop
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReplay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    lastTimestampRef.current = null;
  };

  const handleJumpToStep = (idx: number) => {
    setCurrentTime(getStepStartTime(idx));
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTime(ratio * TOTAL_DURATION);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col w-full bg-[#FBFBFA] select-none text-neutral-900 font-sans">
      {/* Simulation Screen Top Bar (Product Video Status Bar) */}
      <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 bg-white border-b border-neutral-200/90 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? "bg-emerald-600 animate-pulse" : "bg-neutral-400"
              }`}
            />
            <span className="font-semibold text-[11px] tracking-wide text-neutral-800 uppercase">
              {isPlaying ? "Live Payment Lifecycle" : "Simulation Paused"}
            </span>
          </div>
          <span className="text-neutral-300 hidden sm:inline">&bull;</span>
          <span className="font-mono text-[11px] text-neutral-500 hidden sm:inline">
            Trace: <strong className="text-neutral-800 font-medium">trace_01J8A942</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 text-[11px] font-mono font-medium">
            Stage {currentStepIdx + 1} of 5
          </span>

          <button
            type="button"
            onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
            className="px-2 py-0.5 rounded text-[10.5px] font-mono font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition-colors cursor-pointer"
            title="Playback Speed"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport (Clean, Institutional Fintech UI) */}
      <div className="relative w-full h-[400px] sm:h-[430px] lg:h-[450px] bg-[#FBFBFA] p-3.5 sm:p-6 flex flex-col justify-between overflow-hidden">
        {/* Header of Stage */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10.5px] font-mono font-semibold bg-neutral-200/70 text-neutral-800">
                0{currentStepIdx + 1}
              </span>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900">
                {currentStep.title}
              </h3>
            </div>
            <p className="text-xs text-neutral-600 mt-1 max-w-2xl leading-relaxed">
              {currentStep.subtitle}
            </p>
          </div>

          <div className="shrink-0 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-neutral-200 text-[11px] font-mono text-neutral-800 shadow-2xs">
              <Clock className="w-3 h-3 text-neutral-400" />
              <span>Latency: <strong className="text-neutral-900">{currentStepIdx === 2 ? "42ms" : currentStepIdx === 1 ? "0.4ms" : "1.2ms"}</strong></span>
            </span>
          </div>
        </div>

        {/* Center Stage: High-Craft Fintech Visualization */}
        <div className="relative z-10 flex-1 my-3 flex items-center justify-center">
          {/* STAGE 1: Customer Checkout */}
          {currentStepIdx === 0 && (
            <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center animate-fadeIn">
              {/* Customer Checkout Modal Card */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#111111] text-white flex items-center justify-center font-bold text-xs">
                      PS
                    </div>
                    <span className="text-xs font-semibold text-neutral-900">
                      Cloud Pro Subscription
                    </span>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">#ORD-9842</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-neutral-500">Order Amount</span>
                    <span className="text-xl font-bold font-mono text-neutral-900">₹1,499.00</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs space-y-1">
                    <div className="flex justify-between text-neutral-600">
                      <span>Customer</span>
                      <span className="text-neutral-900 font-medium">Sarah Jenkins</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Method</span>
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Smartphone className="w-3 h-3" /> UPI (sarah@okhdfcbank)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Animated Pay Button */}
                <div
                  className={`w-full py-2.5 px-4 rounded-lg text-center text-xs font-semibold transition-all duration-300 ${
                    stepProgress > 0.4
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-[#111111] text-white hover:bg-neutral-800"
                  }`}
                >
                  {stepProgress > 0.4 ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      Payment Ingested
                    </span>
                  ) : (
                    "Pay ₹1,499.00"
                  )}
                </div>
              </div>

              {/* Gateway Ingress Card */}
              <div className="bg-white border border-neutral-200 rounded-xl p-4 text-xs font-mono space-y-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-neutral-100">
                  <span className="flex items-center gap-1.5 text-neutral-800 font-semibold font-sans">
                    <Server className="w-3.5 h-3.5 text-neutral-500" />
                    Gateway Ingress
                  </span>
                  <span className="text-neutral-400">HTTP/2 POST</span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="text-neutral-400 font-sans text-[10px]">Endpoint</div>
                  <div className="text-neutral-800 font-semibold truncate">/v1/payments/charge</div>
                  <div className="text-neutral-400 font-sans text-[10px] mt-1.5">Headers</div>
                  <div className="text-neutral-700">
                    Idempotency-Key: <strong className="text-neutral-900">idemp_8fa2c091</strong>
                  </div>
                  <div className="text-neutral-500">
                    Content-Type: application/json
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[10.5px] text-neutral-500 font-sans">
                  <span>TLS 1.3 AES-GCM</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3" /> PCI Sanitized
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: Redis Idempotency Lock */}
          {currentStepIdx === 1 && (
            <div className="w-full max-w-2xl bg-white border border-neutral-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Redis Distributed Idempotency</div>
                    <div className="text-[11px] text-neutral-500">Atomic SETNX Concurrency Lock</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> LOCK ACQUIRED (0.4ms)
                </span>
              </div>

              {/* Visual Lock Pipeline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs space-y-1">
                  <div className="text-neutral-400 font-mono text-[10px]">Command</div>
                  <div className="font-mono text-neutral-900 font-semibold text-[11px]">SETNX idemp_8fa2c091</div>
                  <div className="text-neutral-500 text-[10.5px]">TTL: 30 Seconds</div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs space-y-1">
                  <div className="text-neutral-400 font-mono text-[10px]">Duplicate Check</div>
                  <div className="text-emerald-700 font-semibold text-[11px]">0 Prior Match</div>
                  <div className="text-neutral-500 text-[10.5px]">Unique Request Verified</div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs space-y-1">
                  <div className="text-neutral-400 font-mono text-[10px]">Safety Guarantee</div>
                  <div className="text-neutral-900 font-semibold text-[11px]">Zero Double-Debit</div>
                  <div className="text-neutral-500 text-[10.5px]">Cached Replay on Retry</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>
                  Protects customer accounts from duplicate debits during network disconnects or accidental double-taps.
                </span>
              </div>
            </div>
          )}

          {/* STAGE 3: Multi-Bank Routing & Failover */}
          {currentStepIdx === 2 && (
            <div className="w-full max-w-2xl bg-white border border-neutral-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Resilience4j Dual-Bank Smart Router</div>
                    <div className="text-[11px] text-neutral-500">Autonomous Circuit Breaker Failover Rail</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ZERO-DROP RECOVERY
                </span>
              </div>

              {/* Bank Rails Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Primary Route */}
                <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200 relative space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Route A: HDFC Bank Rail</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                      TIMEOUT &gt; 650ms
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    Circuit State: <strong className="text-amber-800 font-mono">TRIPPED (OPEN)</strong>
                  </div>
                  <div className="text-[10.5px] text-neutral-500">
                    Sliding window detected latency threshold breach.
                  </div>
                </div>

                {/* Secondary Fallback Route */}
                <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200 relative space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Route B: Axis Bank Rail</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                      ACTIVE &bull; 42ms
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-700">
                    Result: <strong className="text-emerald-800 font-mono">AUTHORIZED (200 OK)</strong>
                  </div>
                  <div className="text-[10.5px] text-neutral-600 font-mono">
                    Auth Code: AUTH_901824
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
                <span>Autonomous Failover Execution Time:</span>
                <span className="font-mono text-neutral-900 font-bold">42ms Total Elapsed</span>
              </div>
            </div>
          )}

          {/* STAGE 4: Kafka Event Stream & Double-Entry Ledger */}
          {currentStepIdx === 3 && (
            <div className="w-full max-w-2xl bg-white border border-neutral-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Apache Kafka &bull; Double-Entry General Ledger</div>
                    <div className="text-[11px] font-mono text-neutral-500">Topic: paystream.payments.captured (Offset #14828)</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> BALANCED JOURNAL
                </span>
              </div>

              {/* Double-Entry Ledger Table */}
              <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden font-mono text-[11px]">
                <div className="grid grid-cols-3 px-3 py-2 bg-neutral-100 text-neutral-600 font-sans text-[10.5px] font-semibold border-b border-neutral-200 uppercase tracking-wider">
                  <div>Account Code</div>
                  <div className="text-right">Debit (₹)</div>
                  <div className="text-right">Credit (₹)</div>
                </div>
                <div className="divide-y divide-neutral-100 text-neutral-800">
                  <div className="grid grid-cols-3 px-3 py-2">
                    <span className="font-medium text-neutral-900">1010-Transit-Escrow</span>
                    <span className="text-right text-emerald-700 font-semibold">+1,499.00</span>
                    <span className="text-right text-neutral-400">—</span>
                  </div>
                  <div className="grid grid-cols-3 px-3 py-2">
                    <span className="font-medium text-neutral-900">2020-Merchant-Payable</span>
                    <span className="text-right text-neutral-400">—</span>
                    <span className="text-right text-neutral-900 font-semibold">+1,463.62</span>
                  </div>
                  <div className="grid grid-cols-3 px-3 py-2">
                    <span className="font-medium text-neutral-900">4010-Gateway-Fee (2%+GST)</span>
                    <span className="text-right text-neutral-400">—</span>
                    <span className="text-right text-neutral-900 font-semibold">+35.38</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-600 px-1">
                <span>Double-Entry Verification: Total Debits == Total Credits</span>
                <span className="font-mono text-neutral-900 font-bold">₹1,499.00 == ₹1,499.00 ✓</span>
              </div>
            </div>
          )}

          {/* STAGE 5: Webhook & Settlement */}
          {currentStepIdx === 4 && (
            <div className="w-full max-w-2xl bg-white border border-neutral-200 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-900">HMAC Webhook &bull; Merchant Payout Settlement</div>
                    <div className="text-[11px] text-neutral-500">Cryptographic Signing &amp; Payout Release</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 200 OK DELIVERED
                </span>
              </div>

              {/* Webhook Dispatch & Settlement Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 font-mono text-[11px] space-y-1.5">
                  <div className="text-neutral-500 text-[10px] font-sans font-semibold uppercase">
                    Merchant Webhook
                  </div>
                  <div className="text-neutral-900 truncate font-semibold">POST https://merchant.io/webhooks</div>
                  <div className="text-neutral-600 text-[10px]">
                    X-PayStream-Signature: <strong className="text-neutral-800">sha256=9b4c0e...</strong>
                  </div>
                  <div className="text-emerald-700 text-[10.5px] font-semibold">
                    Delivery: HTTP 200 OK (18ms)
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-[11px] space-y-1.5">
                  <div className="text-neutral-500 text-[10px] font-sans font-semibold uppercase">
                    Settlement Calculation
                  </div>
                  <div className="flex justify-between text-neutral-700">
                    <span>Gross Capture</span>
                    <span className="font-mono">₹1,499.00</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Platform Deductions (Fee + Tax)</span>
                    <span className="font-mono text-neutral-800">-₹35.38</span>
                  </div>
                  <div className="flex justify-between text-neutral-900 font-bold pt-1 border-t border-neutral-200">
                    <span>Net Merchant Payout</span>
                    <span className="font-mono text-emerald-800">₹1,463.62</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
                <span>Settlement Batch ID: <strong className="font-mono text-neutral-900">SET-2026-0812</strong></span>
                <span className="text-emerald-700 font-medium">Credited to Merchant HDFC Account</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Banner Narration with Active Timeline Scrubber */}
        <div className="relative z-10 pt-2 border-t border-neutral-200/80">
          <div className="flex items-center justify-between text-xs text-neutral-600 pb-1.5">
            <span className="font-mono text-[11px] font-medium text-neutral-800">
              {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
            </span>
            <span className="text-[11px] text-neutral-700 font-semibold truncate ml-2">
              {currentStep.title}
            </span>
          </div>

          {/* Interactive Progress Scrubber Bar */}
          <div
            onClick={handleScrubberClick}
            className="group/scrubber relative w-full h-2 bg-neutral-200 rounded-full overflow-hidden cursor-pointer hover:h-2.5 transition-all"
            title="Click anywhere to jump through the payment journey"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#111111] rounded-full transition-all duration-100"
              style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Video Control Bar & Step Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white border-t border-neutral-200/90">
        {/* Play/Pause & Replay Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#111111] hover:bg-neutral-800 text-white transition-colors cursor-pointer shadow-2xs"
            title={isPlaying ? "Pause Simulation" : "Play Simulation"}
            aria-label={isPlaying ? "Pause Simulation" : "Play Simulation"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleReplay}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer shadow-2xs"
            title="Restart Simulation"
            aria-label="Restart Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-neutral-200 mx-1 hidden sm:block" />

          <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
            Step {currentStepIdx + 1} of 5:
          </span>
        </div>

        {/* Step Jump Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {STEPS.map((step, idx) => {
            const isActive = currentStepIdx === idx;
            const isPassed = currentStepIdx > idx;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleJumpToStep(idx)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-sans font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#111111] text-white shadow-2xs font-semibold"
                    : isPassed
                    ? "bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-100"
                    : "bg-white text-neutral-500 border border-neutral-200/70 hover:text-neutral-800"
                }`}
              >
                {isPassed && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

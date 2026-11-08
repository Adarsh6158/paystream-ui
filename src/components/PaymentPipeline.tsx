"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Layers,
  Database,
  ShieldCheck,
  GitBranch,
  AlertTriangle,
  Radio,
  FileText,
  Send,
  Lock,
  ArrowRight,
  ChevronRight,
  Activity,
  Terminal,
} from "lucide-react";
import { TransactionRecord, PaymentLifecycleStatus } from "@/types/payment";

interface PaymentPipelineProps {
  transaction: TransactionRecord | null;
  status: PaymentLifecycleStatus;
  isProcessing: boolean;
  activeSubTab: "pipeline" | "kafka" | "ledger" | "webhook";
  setActiveSubTab: (tab: "pipeline" | "kafka" | "ledger" | "webhook") => void;
  isDuplicateHit: boolean;
  simulateBankFailure: boolean;
  setSimulateBankFailure: (val: boolean) => void;
}

interface TraceSpan {
  id: string;
  service: string;
  operation: string;
  durationMs: number;
  offsetPercent: number;
  widthPercent: number;
  status: "ok" | "failover" | "error" | "pending";
  metadata: Record<string, string>;
}

export function PaymentPipeline({
  transaction,
  status,
  isProcessing,
  activeSubTab,
  setActiveSubTab,
  isDuplicateHit,
  simulateBankFailure,
  setSimulateBankFailure,
}: PaymentPipelineProps) {
  const [selectedSpanId, setSelectedSpanId] = useState<string>("span-bank");

  const isFailed = status === "FAILED";
  const isCaptured =
    status === "CAPTURED" ||
    status === "SETTLED" ||
    status === "EVENT_PUBLISHED" ||
    status === "LEDGER_UPDATED" ||
    status === "WEBHOOK_DELIVERED" ||
    status === "SETTLEMENT_ELIGIBLE" ||
    status === "SETTLEMENT_PROCESSING";

  // Build real OpenTelemetry-style spans
  const spans: TraceSpan[] = [
    {
      id: "span-ingress",
      service: "ingress-gateway",
      operation: "POST /v1/payments/charge",
      durationMs: 12,
      offsetPercent: 0,
      widthPercent: 9,
      status: "ok",
      metadata: {
        "http.method": "POST",
        "http.status_code": "200",
        "tls.version": "TLS 1.3",
        "merchant.id": "mid_acme_cloud",
      },
    },
    {
      id: "span-redis",
      service: "redis-cluster",
      operation: isDuplicateHit ? "GET idempotency:cache" : "SETNX idempotency:lock",
      durationMs: isDuplicateHit ? 1.2 : 0.4,
      offsetPercent: 9,
      widthPercent: 4,
      status: isDuplicateHit ? "failover" : "ok",
      metadata: {
        "redis.key": transaction?.idempotencyKey || "idemp_8fa2c091",
        "redis.ttl": "30s",
        "lock.acquired": isDuplicateHit ? "false (cache hit)" : "true",
      },
    },
    {
      id: "span-router",
      service: "orchestration-engine",
      operation: `route.${transaction?.method || "upi"}.select`,
      durationMs: 18,
      offsetPercent: 13,
      widthPercent: 12,
      status: "ok",
      metadata: {
        "route.method": transaction?.method.toUpperCase() || "UPI",
        "route.participants": transaction?.routing.participants.length.toString() || "4",
        "circuit_breaker": transaction?.routing.circuitBreakerState || "CLOSED",
      },
    },
    {
      id: "span-bank",
      service: "core-bank-switch",
      operation: simulateBankFailure ? "failover: axis.charge.instant" : "auth: hdfc.charge.direct",
      durationMs: simulateBankFailure ? 42 : 84,
      offsetPercent: 25,
      widthPercent: simulateBankFailure ? 28 : 55,
      status: isFailed ? "error" : simulateBankFailure ? "failover" : "ok",
      metadata: {
        "bank.primary": "HDFC Core Switch",
        "bank.failover": simulateBankFailure ? "Axis Bank Backup" : "None",
        "auth.rrn": transaction?.routing.authRrn || "RRN41029482",
        "circuit_breaker": simulateBankFailure ? "OPEN (Tripped)" : "CLOSED",
      },
    },
    {
      id: "span-kafka",
      service: "kafka-cluster",
      operation: "produce paystream.payments.captured",
      durationMs: 1.8,
      offsetPercent: 82,
      widthPercent: 4,
      status: isCaptured ? "ok" : "pending",
      metadata: {
        "kafka.topic": "paystream.payments.captured",
        "kafka.partition": "2",
        "kafka.offset": "14827",
      },
    },
    {
      id: "span-ledger",
      service: "ledger-service",
      operation: "write.double_entry.balanced",
      durationMs: 2.1,
      offsetPercent: 86,
      widthPercent: 4,
      status: isCaptured ? "ok" : "pending",
      metadata: {
        "ledger.debit": `₹${transaction?.amount || 1499}.00`,
        "ledger.credit": `₹${transaction?.amount || 1499}.00`,
        "ledger.status": "BALANCED",
      },
    },
    {
      id: "span-webhook",
      service: "webhook-worker",
      operation: "dispatch.hmac_sha256",
      durationMs: 14,
      offsetPercent: 90,
      widthPercent: 10,
      status: isCaptured ? "ok" : "pending",
      metadata: {
        "http.url": "https://acme-cloud.com/api/webhooks",
        "signature.algorithm": "HMAC-SHA256",
        "delivery.status": "200 OK",
      },
    },
  ];

  const selectedSpan = spans.find((s) => s.id === selectedSpanId) || spans[0];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_-2px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Pipeline Header */}
      <div className="px-3.5 py-2.5 bg-neutral-50/80 border-b border-black/[0.06] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-neutral-800" />
          <span className="text-[11.5px] font-semibold text-neutral-900 tracking-tight">
            Distributed Telemetry &amp; Trace
          </span>
          <span className="text-[10px] font-mono text-neutral-400">
            {transaction?.id || "txn_01J8A9K"}
          </span>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-0.5 bg-neutral-100 p-0.5 rounded-lg text-xs font-sans">
          <button
            type="button"
            onClick={() => setActiveSubTab("pipeline")}
            className={`px-2 py-0.5 rounded-md text-[10.5px] font-medium transition-all cursor-pointer ${
              activeSubTab === "pipeline"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Trace Waterfall
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("kafka")}
            className={`px-2 py-0.5 rounded-md text-[10.5px] font-medium transition-all cursor-pointer ${
              activeSubTab === "kafka"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Kafka Bus
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("ledger")}
            className={`px-2 py-0.5 rounded-md text-[10.5px] font-medium transition-all cursor-pointer ${
              activeSubTab === "ledger"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Ledger
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("webhook")}
            className={`px-2 py-0.5 rounded-md text-[10.5px] font-medium transition-all cursor-pointer ${
              activeSubTab === "webhook"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Webhook
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3 flex flex-col justify-between overflow-y-auto">
        {/* SUBTAB 1: TRACE WATERFALL (OpenTelemetry / Datadog style) */}
        {activeSubTab === "pipeline" && (
          <div className="space-y-3 flex-1 flex flex-col justify-between">
            {/* Chaos Control Bar */}
            <div className="p-2 px-3 rounded-lg bg-neutral-50/90 border border-black/[0.06] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle
                  className={`w-3.5 h-3.5 ${
                    simulateBankFailure ? "text-amber-600" : "text-neutral-400"
                  }`}
                />
                <div>
                  <span className="text-[11px] font-semibold text-neutral-800 block">
                    Resilience4j Dual-Bank Failover Simulation
                  </span>
                  <span className="text-[9.5px] text-neutral-400 font-mono">
                    Trips HDFC route to OPEN &bull; Reroutes to Axis Bank in 42ms
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSimulateBankFailure(!simulateBankFailure)}
                className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  simulateBankFailure ? "bg-amber-600" : "bg-neutral-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    simulateBankFailure ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Waterfall Timeline Graph */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pb-1 border-b border-black/[0.06]">
                <span>SPAN OPERATION</span>
                <span>DURATION / TIMELINE (0ms – {transaction?.durationMs || 142}ms)</span>
              </div>

              <div className="space-y-1">
                {spans.map((span) => {
                  const isSelected = selectedSpanId === span.id;

                  return (
                    <button
                      key={span.id}
                      type="button"
                      onClick={() => setSelectedSpanId(span.id)}
                      className={`w-full p-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? "bg-neutral-100/80 border-neutral-300"
                          : "bg-white hover:bg-neutral-50 border-black/[0.04]"
                      }`}
                    >
                      <div className="truncate w-44 shrink-0">
                        <div className="text-[10.5px] font-mono font-medium text-neutral-800 truncate">
                          {span.operation}
                        </div>
                        <div className="text-[9px] text-neutral-400 font-mono truncate">
                          {span.service}
                        </div>
                      </div>

                      {/* Visual Timeline Bar */}
                      <div className="flex-1 h-3.5 bg-neutral-100 rounded-sm relative overflow-hidden">
                        <div
                          style={{
                            marginLeft: `${span.offsetPercent}%`,
                            width: `${Math.max(span.widthPercent, 4)}%`,
                          }}
                          className={`h-full rounded-sm transition-all duration-300 ${
                            span.status === "error"
                              ? "bg-rose-500"
                              : span.status === "failover"
                              ? "bg-amber-500"
                              : "bg-[#111111]"
                          }`}
                        />
                      </div>

                      <span className="text-[10px] font-mono font-medium text-neutral-700 w-12 text-right shrink-0">
                        {span.durationMs}ms
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Span Details Inspector */}
            <div className="p-2.5 rounded-lg bg-neutral-50 border border-black/[0.06] text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-semibold text-neutral-900">
                  Span: {selectedSpan.operation}
                </span>
                <span className="text-neutral-500">{selectedSpan.durationMs}ms</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-neutral-600 pt-1 border-t border-black/[0.04]">
                {Object.entries(selectedSpan.metadata).map(([k, v]) => (
                  <div key={k} className="truncate">
                    <span className="text-neutral-400">{k}: </span>
                    <span className="font-semibold text-neutral-800">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: KAFKA EVENT STREAM */}
        {activeSubTab === "kafka" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 pb-1 border-b border-black/[0.06]">
              <span>KAFKA PARTITIONED TOPIC BUS</span>
              <span>BROKER: broker-1:9092</span>
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
              {transaction?.kafkaEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2 rounded-lg bg-neutral-50 border border-black/[0.06] text-left font-mono text-[10.5px] space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {ev.topic}
                    </span>
                    <span className="text-neutral-400">{ev.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[9.5px] text-neutral-500">
                    <span>Partition: {ev.partition}</span>
                    <span>Offset: {ev.offset}</span>
                    <span className="text-emerald-700 font-semibold">{ev.consumerStatus}</span>
                  </div>
                  <div className="p-1.5 rounded bg-neutral-900 text-neutral-200 text-[10px] font-mono overflow-x-auto select-all">
                    {JSON.stringify(ev.payload)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: BALANCED DOUBLE-ENTRY LEDGER */}
        {activeSubTab === "ledger" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono pb-1 border-b border-black/[0.06]">
              <span className="text-neutral-400 uppercase">Double-Entry Accounting T-Accounts</span>
              <span className="text-emerald-700 font-semibold">Debits === Credits</span>
            </div>

            <div className="border border-black/[0.08] rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-neutral-50 border-b border-black/[0.06] text-[10px] font-mono text-neutral-500 uppercase">
                  <tr>
                    <th className="p-2">Account Title</th>
                    <th className="p-2">Type</th>
                    <th className="p-2 text-right">Debit</th>
                    <th className="p-2 text-right">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] font-mono text-[10.5px]">
                  {transaction?.ledgerEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-neutral-50/50">
                      <td className="p-2 font-sans font-medium text-neutral-900">
                        {entry.account}
                      </td>
                      <td className="p-2 text-neutral-400 text-[10px] font-sans">
                        {entry.accountType}
                      </td>
                      <td className="p-2 text-right font-semibold text-neutral-900">
                        {entry.debit > 0 ? `₹${entry.debit.toFixed(2)}` : "—"}
                      </td>
                      <td className="p-2 text-right font-semibold text-neutral-900">
                        {entry.credit > 0 ? `₹${entry.credit.toFixed(2)}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-neutral-50 font-mono font-bold text-neutral-900 border-t border-black/[0.08] text-[10.5px]">
                  <tr>
                    <td colSpan={2} className="p-2 font-sans">
                      Total Ledger Balance (INR)
                    </td>
                    <td className="p-2 text-right text-emerald-700">
                      ₹
                      {transaction?.ledgerEntries
                        .reduce((sum, e) => sum + e.debit, 0)
                        .toFixed(2)}
                    </td>
                    <td className="p-2 text-right text-emerald-700">
                      ₹
                      {transaction?.ledgerEntries
                        .reduce((sum, e) => sum + e.credit, 0)
                        .toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 4: HMAC WEBHOOK */}
        {activeSubTab === "webhook" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono pb-1 border-b border-black/[0.06]">
              <span className="text-neutral-400">MERCHANT WEBHOOK DISPATCH</span>
              <span className="text-emerald-700 font-semibold">200 OK Delivered</span>
            </div>

            <div className="p-2 rounded-lg bg-neutral-50 border border-black/[0.06] text-xs space-y-1 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-neutral-400">URL:</span>
                <span className="text-neutral-800 font-semibold">{transaction?.webhook.endpoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Signature:</span>
                <span className="text-neutral-800 truncate max-w-[200px]">{transaction?.webhook.signature}</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-neutral-900 text-neutral-200 text-[10px] font-mono overflow-x-auto select-all">
              {JSON.stringify(transaction?.webhook.payload, null, 2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

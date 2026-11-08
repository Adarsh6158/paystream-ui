"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Layers,
  Send,
  Database,
  Lock,
  ChevronDown,
  ChevronUp,
  Receipt,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import { TransactionRecord, PaymentLifecycleStatus } from "@/types/payment";

interface InteractivePaymentFlowProps {
  transaction: TransactionRecord;
  status: PaymentLifecycleStatus;
  isProcessing: boolean;
  isDuplicateHit: boolean;
  simulateBankFailure: boolean;
  onReset: () => void;
}

export function InteractivePaymentFlow({
  transaction,
  status,
  isProcessing,
  isDuplicateHit,
  simulateBankFailure,
  onReset,
}: InteractivePaymentFlowProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [technicalTab, setTechnicalTab] = useState<"kafka" | "ledger" | "webhook">("kafka");

  const isFailed = status === "FAILED";
  const isCaptured =
    status === "CAPTURED" ||
    status === "SETTLED" ||
    status === "EVENT_PUBLISHED" ||
    status === "LEDGER_UPDATED" ||
    status === "WEBHOOK_DELIVERED" ||
    status === "SETTLEMENT_ELIGIBLE" ||
    status === "SETTLEMENT_PROCESSING";

  // Step 1: Customer Pays
  // Step 2: Double-Payment Check (Redis)
  // Step 3: Bank Authorization (Resilience4j Failover)
  // Step 4: Merchant Gets Paid (Settlement & Webhook)
  const getStepState = (stepNumber: number) => {
    if (status === "IDLE") return "idle";
    if (isDuplicateHit && stepNumber > 2) return "skipped";
    if (isFailed && stepNumber === 3) return "failed";
    if (isFailed && stepNumber > 3) return "skipped";

    if (stepNumber === 1) {
      return "completed";
    }
    if (stepNumber === 2) {
      if (status === "REQUEST_RECEIVED") return "active";
      if (status === "IDEMPOTENCY_CHECK" && isProcessing) return "active";
      return "completed";
    }
    if (stepNumber === 3) {
      if (status === "IDEMPOTENCY_CHECK" || status === "ROUTING" || status === "BANK_AUTHORIZING") {
        return isProcessing ? "active" : "pending";
      }
      return isCaptured ? "completed" : "pending";
    }
    if (stepNumber === 4) {
      return isCaptured ? "completed" : "pending";
    }
    return "pending";
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_-2px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Top Flow Header */}
      <div className="px-4 py-2.5 bg-neutral-50/90 border-b border-black/[0.06] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-bold text-neutral-900 tracking-tight">
            How Money Moves: 4-Step Gateway Flow
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10.5px] font-mono text-neutral-500">
            Txn: <strong className="text-neutral-900 font-semibold">{transaction.id}</strong>
          </span>
        </div>
      </div>

      {/* Main Flow Content */}
      <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5">
        {/* 4-Step Horizontal Journey Tracker */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {[
            {
              step: 1,
              title: "1. Customer Pays",
              desc: "Enters payment",
              state: getStepState(1),
            },
            {
              step: 2,
              title: "2. Redis Protection",
              desc: isDuplicateHit ? "Duplicate blocked" : "Locks duplicate debit",
              state: getStepState(2),
            },
            {
              step: 3,
              title: "3. Bank Approves",
              desc: simulateBankFailure ? "Auto-switched bank" : "HDFC Bank approved",
              state: getStepState(3),
            },
            {
              step: 4,
              title: "4. Merchant Paid",
              desc: "Webhook & settlement",
              state: getStepState(4),
            },
          ].map((item) => (
            <div
              key={item.step}
              className={`p-2 rounded-lg border text-left transition-all ${
                item.state === "completed"
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                  : item.state === "active"
                  ? "bg-blue-50/80 border-blue-300 text-blue-950 shadow-2xs"
                  : item.state === "failed"
                  ? "bg-rose-50 border-rose-200 text-rose-950"
                  : "bg-neutral-50/60 border-black/[0.04] text-neutral-400"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="truncate">{item.title}</span>
                {item.state === "completed" && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                )}
                {item.state === "active" && (
                  <RotateCw className="w-3 h-3 text-blue-600 animate-spin shrink-0" />
                )}
              </div>
              <div className="text-[9.5px] truncate mt-0.5 opacity-80 font-sans">
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Plain-English Step Explanation Cards */}
        <div className="space-y-2">
          {/* STEP 1 */}
          <div className="p-3 rounded-lg border border-black/[0.06] bg-white flex items-start gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-md bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              1
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">
                  Customer Checkout &amp; Order Created
                </span>
                <span className="text-[10px] font-mono text-neutral-400">0ms</span>
              </div>
              <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                Customer purchases <strong>Pro Cloud Subscription</strong> for{" "}
                <strong className="text-neutral-900">₹{transaction.amount.toLocaleString()}.00</strong> using{" "}
                <strong className="uppercase">{transaction.method}</strong>. PayStream generates a secure encrypted payment session.
              </p>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="p-3 rounded-lg border border-black/[0.06] bg-white flex items-start gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-md bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              2
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>Double-Charge Protection (Redis Lock)</span>
                  {isDuplicateHit && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-800">
                      DUPLICATE BLOCKED
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">0.4ms</span>
              </div>
              <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                {isDuplicateHit ? (
                  <span className="text-amber-800 font-medium">
                    Customer or network re-sent the same payment request. Redis detected the lock and instantly returned the cached receipt in 1.2ms without charging the customer twice!
                  </span>
                ) : (
                  <span>
                    When customer clicks Pay, Gateway locks the unique <code>Idempotency-Key</code> in Redis. If the customer double-clicks or internet lags, they are guaranteed to never be charged twice.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="p-3 rounded-lg border border-black/[0.06] bg-white flex items-start gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-md bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              3
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>Bank Authorization &amp; Failover Protection</span>
                  {simulateBankFailure && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800">
                      AUTO-FAILOVER SUCCEEDED
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {simulateBankFailure ? "42ms" : "84ms"}
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                {simulateBankFailure ? (
                  <span className="text-neutral-800">
                    Primary Bank (HDFC) was slow/down (&gt;650ms). PayStream&apos;s <strong>Resilience4j Circuit Breaker</strong> automatically rerouted the payment to <strong>Axis Bank Backup</strong> in 42ms. The customer experienced zero failed payments!
                  </span>
                ) : (
                  <span>
                    Transaction routed through banking rails ({transaction.routing.primaryRoute}). Bank verified PIN/OTP and returned confirmation (RRN: {transaction.routing.authRrn}).
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="p-3 rounded-lg border border-black/[0.06] bg-white flex items-start gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-md bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              4
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">
                  Merchant Notified &amp; Settlement Ready
                </span>
                <span className="text-[10px] font-mono text-neutral-400">14ms</span>
              </div>
              <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                1. <strong>Webhook:</strong> Merchant&apos;s server instantly received secure notification with HMAC-SHA256 signature (HTTP 200 OK).<br />
                2. <strong>Settlement:</strong> Net payout of <strong className="text-emerald-700">₹{transaction.financials.netSettlementAmount.toFixed(2)}</strong> (after 2% gateway fee + tax) queued for merchant&apos;s bank account on T+1 schedule.
              </p>
            </div>
          </div>
        </div>

        {/* Live Customer & Merchant Settlement Voucher */}
        <div className="p-3 rounded-lg bg-neutral-50/80 border border-black/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            {isFailed ? (
              <>
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>PAYMENT DECLINED &bull; NO CHARGE CREATED</span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5 font-mono">
                  Bank Response: 51 Insufficient Funds &bull; Merchant Payout: ₹0.00 (Cancelled)
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>PAYMENT SUCCESSFUL &bull; SETTLEMENT QUEUED</span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5 font-mono">
                  Order Total: ₹{transaction.amount}.00 &bull; Net to Merchant:{" "}
                  <strong className="text-neutral-900">
                    ₹{transaction.financials.netSettlementAmount.toFixed(2)}
                  </strong>{" "}
                  (Fee: ₹{transaction.financials.feeAmount.toFixed(2)})
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="px-3 py-1.5 rounded-md bg-white border border-black/[0.1] hover:bg-neutral-50 text-neutral-800 text-[11px] font-medium shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5 self-end sm:self-auto shrink-0"
          >
            <span>{showTechnicalDetails ? "Hide" : "Inspect"} Under-the-Hood Specs</span>
            {showTechnicalDetails ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Collapsible Under-the-Hood Technical Specs (For engineers/recruiters) */}
        {showTechnicalDetails && (
          <div className="p-3 rounded-lg bg-neutral-900 text-neutral-200 text-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="font-mono text-[11px] font-semibold text-white">
                Under-the-Hood Engineering Details
              </span>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setTechnicalTab("kafka")}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    technicalTab === "kafka"
                      ? "bg-neutral-700 text-white font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Kafka Event
                </button>
                <button
                  type="button"
                  onClick={() => setTechnicalTab("ledger")}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    technicalTab === "ledger"
                      ? "bg-neutral-700 text-white font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Double-Entry Ledger
                </button>
                <button
                  type="button"
                  onClick={() => setTechnicalTab("webhook")}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    technicalTab === "webhook"
                      ? "bg-neutral-700 text-white font-semibold"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Webhook HMAC
                </button>
              </div>
            </div>

            {technicalTab === "kafka" && (
              <div className="space-y-1 font-mono text-[10.5px]">
                <div className="text-neutral-400">
                  Topic: <code>paystream.payments.captured</code> (Partition: 2, Offset: 14827)
                </div>
                <div className="p-2 rounded bg-black/60 text-emerald-400 overflow-x-auto select-all">
                  {JSON.stringify(transaction.kafkaEvents[2]?.payload || transaction.kafkaEvents[0]?.payload, null, 2)}
                </div>
              </div>
            )}

            {technicalTab === "ledger" && (
              <div className="space-y-1 font-mono text-[10.5px]">
                <div className="text-neutral-400 mb-1">
                  Balanced Double-Entry T-Accounts (Total Debits == Total Credits):
                </div>
                <div className="border border-neutral-800 rounded overflow-hidden">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-neutral-800 text-neutral-400">
                      <tr>
                        <th className="p-1.5">Account</th>
                        <th className="p-1.5 text-right">Debit</th>
                        <th className="p-1.5 text-right">Credit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800 text-neutral-300">
                      {transaction.ledgerEntries.map((e) => (
                        <tr key={e.id}>
                          <td className="p-1.5">{e.account}</td>
                          <td className="p-1.5 text-right">
                            {e.debit > 0 ? `₹${e.debit.toFixed(2)}` : "—"}
                          </td>
                          <td className="p-1.5 text-right">
                            {e.credit > 0 ? `₹${e.credit.toFixed(2)}` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {technicalTab === "webhook" && (
              <div className="space-y-1 font-mono text-[10.5px]">
                <div className="text-neutral-400">
                  URL: <code>{transaction.webhook.endpoint}</code> (Status: 200 OK)
                </div>
                <div className="text-neutral-400 truncate">
                  X-PayStream-Signature: <code>{transaction.webhook.signature}</code>
                </div>
                <div className="p-2 rounded bg-black/60 text-neutral-300 overflow-x-auto select-all text-[10px]">
                  {JSON.stringify(transaction.webhook.payload, null, 2)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

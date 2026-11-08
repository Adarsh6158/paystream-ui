"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Layers,
  Send,
  Database,
  Lock,
} from "lucide-react";
import { TransactionRecord } from "@/types/payment";

interface TransactionsViewProps {
  transactions: TransactionRecord[];
  onSelectTransaction: (txn: TransactionRecord) => void;
  activeTransaction: TransactionRecord | null;
}

export function TransactionsView({
  transactions,
  onSelectTransaction,
  activeTransaction,
}: TransactionsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || t.displayStatus.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_-2px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Top Controls Bar */}
      <div className="px-4 py-2.5 bg-neutral-50/80 border-b border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Transaction ID, Customer, Order..."
              className="w-full h-8 pl-8 pr-2.5 rounded-lg border border-black/[0.08] text-xs font-sans text-neutral-900 bg-white focus:outline-none focus:border-neutral-900 shadow-2xs"
            />
          </div>
        </div>

        <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-black/[0.06] text-xs font-mono">
          {["ALL", "SETTLED", "CAPTURED", "FAILED", "REFUNDED"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-[10.5px] transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-white text-neutral-900 font-semibold shadow-2xs"
                  : "text-neutral-500 hover:text-neutral-900 font-medium"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        {/* Table Column */}
        <div className="lg:col-span-7 border-r border-black/[0.06] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-neutral-50/90 backdrop-blur-sm border-b border-black/[0.06] text-[10px] font-mono text-neutral-500 uppercase">
              <tr>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Method</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] font-mono text-[11px]">
              {filtered.map((txn) => {
                const isSelected = activeTransaction?.id === txn.id;

                return (
                  <tr
                    key={txn.id}
                    onClick={() => onSelectTransaction(txn)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-neutral-100/90 text-neutral-900 font-medium"
                        : "hover:bg-neutral-50/60 text-neutral-700"
                    }`}
                  >
                    <td className="p-3 font-semibold text-neutral-900">
                      {txn.id}
                      <div className="text-[9.5px] font-normal text-neutral-400">
                        {txn.timestamp}
                      </div>
                    </td>
                    <td className="p-3 font-sans">
                      <div className="font-medium text-neutral-900">
                        {txn.customer.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">
                        {txn.customer.email}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 uppercase text-[9px] font-mono font-medium">
                        {txn.method}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-neutral-900">
                      ₹{txn.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-semibold ${
                          txn.displayStatus === "Settled"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : txn.displayStatus === "Captured"
                            ? "bg-blue-50 text-blue-800 border border-blue-200"
                            : txn.displayStatus === "Refunded"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-rose-50 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {txn.displayStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Transaction Lifecycle Drawer */}
        <div className="lg:col-span-5 bg-neutral-50/40 p-4 overflow-y-auto space-y-3 text-xs">
          {activeTransaction ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-black/[0.06]">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-mono tracking-tight">
                    {activeTransaction.id}
                  </h3>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    Order: {activeTransaction.orderId} &bull; Key: {activeTransaction.idempotencyKey}
                  </div>
                </div>
                <span
                  className={`text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded ${
                    activeTransaction.displayStatus === "Settled"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : activeTransaction.displayStatus === "Captured"
                      ? "bg-blue-50 text-blue-800 border border-blue-200"
                      : activeTransaction.displayStatus === "Refunded"
                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {activeTransaction.displayStatus.toUpperCase()}
                </span>
              </div>

              {/* Financial Summary */}
              <div className="p-3 rounded-lg bg-white border border-black/[0.06] shadow-2xs space-y-1 font-mono text-[11px]">
                <span className="text-[10px] font-sans font-semibold text-neutral-400 block mb-1 uppercase tracking-wider">
                  Settlement Breakdown
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Gross Charge:</span>
                  <span className="font-bold text-neutral-900">
                    ₹{activeTransaction.financials.grossAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Gateway MDR (2.0%):</span>
                  <span>−₹{activeTransaction.financials.feeAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>GST on Fee (18%):</span>
                  <span>−₹{activeTransaction.financials.taxAmount.toFixed(2)}</span>
                </div>
                <div className="pt-1.5 mt-1 border-t border-black/[0.06] flex items-center justify-between font-bold text-emerald-700">
                  <span className="font-sans">Net Payout:</span>
                  <span>₹{activeTransaction.financials.netSettlementAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Routing Path */}
              <div className="p-3 rounded-lg bg-white border border-black/[0.06] shadow-2xs space-y-1 text-xs">
                <span className="text-[10px] font-sans font-semibold text-neutral-400 block mb-1 uppercase tracking-wider">
                  Routing &amp; Circuit Breaker
                </span>
                <div className="text-neutral-700">
                  Primary Route: <strong>{activeTransaction.routing.primaryRoute}</strong>
                </div>
                {activeTransaction.routing.fallbackRoute && (
                  <div className="text-amber-800">
                    Fallback Route: <strong>{activeTransaction.routing.fallbackRoute}</strong>
                  </div>
                )}
                <div className="text-[10px] text-neutral-400 font-mono mt-1">
                  Breaker: {activeTransaction.routing.circuitBreakerState} &bull; RRN: {activeTransaction.routing.authRrn}
                </div>
              </div>

              {/* Kafka & Webhook Links */}
              <div className="p-3 rounded-lg bg-white border border-black/[0.06] shadow-2xs space-y-1 text-xs font-mono text-[10.5px]">
                <span className="text-[10px] font-sans font-semibold text-neutral-400 block mb-1 uppercase tracking-wider">
                  Event Bus &amp; HMAC Webhook
                </span>
                <div className="text-neutral-600 truncate">
                  Topic: paystream.payments.captured (P:2, O:14827)
                </div>
                <div className="text-neutral-600 truncate">
                  Webhook: {activeTransaction.webhook.endpoint}
                </div>
                <div className="text-emerald-700">
                  Status: 200 OK Delivered (1 attempt)
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-neutral-400 font-mono">
              Select a transaction to inspect its lifecycle
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  TrendingUp,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  FileCheck,
  Building2,
} from "lucide-react";
import { TransactionRecord } from "@/types/payment";

interface MerchantDashboardProps {
  transactions: TransactionRecord[];
  activeTransaction: TransactionRecord | null;
  onSelectTransaction: (txn: TransactionRecord) => void;
  onRefund: (txnId: string) => void;
  isProcessing: boolean;
}

export function MerchantDashboard({
  transactions,
  activeTransaction,
  onSelectTransaction,
  onRefund,
  isProcessing,
}: MerchantDashboardProps) {
  const settledTotal = transactions
    .filter((t) => t.displayStatus === "Settled" || t.displayStatus === "Captured")
    .reduce((sum, t) => sum + t.financials.netSettlementAmount, 0);

  const approvedCount = transactions.filter(
    (t) => t.displayStatus === "Settled" || t.displayStatus === "Captured"
  ).length;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_-2px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Top Header */}
      <div className="px-3.5 py-2.5 bg-neutral-50/80 border-b border-black/[0.06] flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-neutral-800" />
          <span className="text-[11.5px] font-semibold text-neutral-900 tracking-tight">
            Merchant Settlement Console
          </span>
        </div>
        <span className="text-[9.5px] font-mono text-neutral-400">
          Acme Cloud (MID: mid_94a20b)
        </span>
      </div>

      {/* Financial Settlement Voucher for Current Active Transaction */}
      <div className="p-3 border-b border-black/[0.06] bg-white space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-neutral-900 font-sans tracking-tight">
            Settlement Credit Advice
          </span>
          <span
            className={`text-[9.5px] font-mono font-semibold px-1.5 py-0.2 rounded ${
              activeTransaction?.financials.settlementStatus === "Settled"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : activeTransaction?.financials.settlementStatus === "Failed"
                ? "bg-rose-50 text-rose-800 border border-rose-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            {activeTransaction?.financials.settlementStatus.toUpperCase() || "PENDING"}
          </span>
        </div>

        {activeTransaction ? (
          <div className="p-2.5 rounded-lg bg-neutral-50/80 border border-black/[0.06] text-xs space-y-1 font-mono">
            <div className="flex items-center justify-between text-[10.5px] text-neutral-500">
              <span>Gross Customer Charge:</span>
              <span className="font-semibold text-neutral-900">
                ₹{activeTransaction.financials.grossAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span>− Gateway Fee (2.0%):</span>
              <span>₹{activeTransaction.financials.feeAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span>− 18% GST on Gateway Fee:</span>
              <span>₹{activeTransaction.financials.taxAmount.toFixed(2)}</span>
            </div>
            <div className="pt-1.5 mt-1 border-t border-black/[0.06] flex items-center justify-between font-bold text-neutral-900 text-[11.5px]">
              <span className="font-sans font-semibold">Net Merchant Credit:</span>
              <span className="text-emerald-700">
                ₹{activeTransaction.financials.netSettlementAmount.toFixed(2)}
              </span>
            </div>
            <div className="text-[9.5px] text-neutral-400 font-sans mt-1 pt-1 border-t border-black/[0.04] flex items-center justify-between">
              <span>Cycle: T+1 Payout (HDFC Nodal)</span>
              {activeTransaction.financials.settlementUtr && (
                <span className="font-mono text-[9px] text-neutral-500">
                  {activeTransaction.financials.settlementUtr}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-3 text-xs text-neutral-400 font-mono">
            Awaiting transaction dispatch...
          </div>
        )}
      </div>

      {/* Aggregate Overview Metrics */}
      <div className="px-3.5 py-2 border-b border-black/[0.06] bg-neutral-50/40 grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-lg bg-white border border-black/[0.06] shadow-2xs">
          <span className="text-[10px] text-neutral-400 block font-mono uppercase">
            Total Settled
          </span>
          <span className="text-sm font-bold font-mono text-neutral-900">
            ₹{settledTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[9.5px] text-emerald-600 block mt-0.5">
            {approvedCount} transactions
          </span>
        </div>

        <div className="p-2 rounded-lg bg-white border border-black/[0.06] shadow-2xs">
          <span className="text-[10px] text-neutral-400 block font-mono uppercase">
            SLA Uptime
          </span>
          <span className="text-sm font-bold font-mono text-neutral-900">
            99.999%
          </span>
          <span className="text-[9.5px] text-neutral-400 block mt-0.5 font-mono">
            0 dropouts
          </span>
        </div>
      </div>

      {/* Recent Transactions List with unified inspection */}
      <div className="flex-1 px-3.5 py-2.5 flex flex-col justify-between overflow-y-auto space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-900 pb-1 border-b border-black/[0.06]">
          <span>Recent Ledger Records</span>
          <span className="text-[9.5px] font-mono text-neutral-400">Click to inspect</span>
        </div>

        <div className="space-y-1.5 overflow-y-auto max-h-[175px]">
          {transactions.slice(0, 5).map((txn) => {
            const isSelected = activeTransaction?.id === txn.id;

            return (
              <button
                key={txn.id}
                type="button"
                onClick={() => onSelectTransaction(txn)}
                className={`w-full p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? "bg-[#111111] text-white border-[#111111] shadow-2xs"
                    : "bg-white hover:bg-neutral-50 border-black/[0.06] text-neutral-800"
                }`}
              >
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-mono">
                      ₹{txn.amount.toLocaleString()}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1 rounded uppercase ${
                        isSelected
                          ? "bg-neutral-800 text-neutral-300"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {txn.method}
                    </span>
                  </div>
                  <div
                    className={`text-[9.5px] font-mono truncate mt-0.5 ${
                      isSelected ? "text-neutral-400" : "text-neutral-400"
                    }`}
                  >
                    {txn.id} &bull; {txn.customer.name}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[9.5px] font-mono font-medium px-1.5 py-0.2 rounded ${
                      txn.displayStatus === "Settled"
                        ? isSelected
                          ? "bg-emerald-900/60 text-emerald-300"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : txn.displayStatus === "Captured"
                        ? isSelected
                          ? "bg-blue-900/60 text-blue-300"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                        : txn.displayStatus === "Refunded"
                        ? isSelected
                          ? "bg-amber-900/60 text-amber-300"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                        : isSelected
                        ? "bg-rose-900/60 text-rose-300"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {txn.displayStatus}
                  </span>
                  <div className="text-[9px] font-mono mt-0.5 opacity-60">
                    {txn.timestamp}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Refund Action on Captured / Settled transactions */}
        {activeTransaction &&
          (activeTransaction.displayStatus === "Captured" ||
            activeTransaction.displayStatus === "Settled") && (
            <div className="pt-2 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={() => onRefund(activeTransaction.id)}
                disabled={isProcessing}
                className="w-full h-7 px-3 rounded-md text-[11px] font-medium border border-black/[0.1] bg-white hover:bg-neutral-50 text-neutral-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <RotateCcw className="w-3 h-3 text-neutral-400" />
                <span>Issue Refund ({activeTransaction.id})</span>
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

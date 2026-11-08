"use client";

import React from "react";
import {
  FileCheck,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Banknote,
} from "lucide-react";
import { TransactionRecord } from "@/types/payment";

interface SettlementsViewProps {
  transactions: TransactionRecord[];
}

export function SettlementsView({ transactions }: SettlementsViewProps) {
  const settledTransactions = transactions.filter(
    (t) => t.displayStatus === "Settled" || t.displayStatus === "Captured"
  );

  const totalGross = settledTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalFees = settledTransactions.reduce((acc, t) => acc + t.financials.feeAmount, 0);
  const totalTaxes = settledTransactions.reduce((acc, t) => acc + t.financials.taxAmount, 0);
  const totalNet = settledTransactions.reduce(
    (acc, t) => acc + t.financials.netSettlementAmount,
    0
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_-2px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Top Banner */}
      <div className="px-4 py-3 bg-neutral-50/80 border-b border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs select-none">
        <div>
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-neutral-800" />
            <h3 className="font-bold text-neutral-900 tracking-tight">
              Merchant Settlement Engine &amp; Payout Batches
            </h3>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Automated clearing calculation via RBI-regulated Nodal/Escrow accounts (T+1 Payout Cycle).
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10.5px] font-mono text-neutral-500">
          <span className="px-2 py-0.5 rounded bg-white border border-black/[0.08] font-semibold text-neutral-900 shadow-2xs">
            Escrow: HDFC Nodal Bank
          </span>
        </div>
      </div>

      {/* Aggregate Financial Metrics */}
      <div className="p-4 border-b border-black/[0.06] grid grid-cols-2 md:grid-cols-4 gap-3 bg-neutral-50/30">
        <div className="p-3 rounded-lg bg-white border border-black/[0.06] shadow-2xs">
          <span className="text-[10px] font-mono text-neutral-400 block uppercase">
            Gross Payments
          </span>
          <span className="text-lg font-bold font-mono text-neutral-900">
            ₹{totalGross.toLocaleString()}.00
          </span>
          <span className="text-[10px] text-neutral-400 block mt-0.5">
            100% captured volume
          </span>
        </div>

        <div className="p-3 rounded-lg bg-white border border-black/[0.06] shadow-2xs">
          <span className="text-[10px] font-mono text-neutral-400 block uppercase">
            Gateway Fee (2.0%)
          </span>
          <span className="text-lg font-bold font-mono text-neutral-900">
            −₹{totalFees.toFixed(2)}
          </span>
          <span className="text-[10px] text-neutral-400 block mt-0.5">
            Platform processing
          </span>
        </div>

        <div className="p-3 rounded-lg bg-white border border-black/[0.06] shadow-2xs">
          <span className="text-[10px] font-mono text-neutral-400 block uppercase">
            GST on Fees (18%)
          </span>
          <span className="text-lg font-bold font-mono text-neutral-900">
            −₹{totalTaxes.toFixed(2)}
          </span>
          <span className="text-[10px] text-neutral-400 block mt-0.5">
            Statutory tax deposit
          </span>
        </div>

        <div className="p-3 rounded-lg bg-white border border-black/[0.06] shadow-2xs">
          <span className="text-[10px] font-mono text-neutral-400 block uppercase">
            Net Merchant Credited
          </span>
          <span className="text-lg font-bold font-mono text-emerald-700">
            ₹{totalNet.toFixed(2)}
          </span>
          <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">
            T+1 Bank Transfer
          </span>
        </div>
      </div>

      {/* Batches Table */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="border border-black/[0.08] rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-neutral-50/80 border-b border-black/[0.06] text-[10px] font-mono text-neutral-500 uppercase">
              <tr>
                <th className="p-3">Batch ID / Ref</th>
                <th className="p-3">Count</th>
                <th className="p-3 text-right">Gross Amount</th>
                <th className="p-3 text-right">Deductions</th>
                <th className="p-3 text-right">Net Settlement</th>
                <th className="p-3">Status</th>
                <th className="p-3">UTR Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] font-mono text-[11px]">
              <tr className="hover:bg-neutral-50/50">
                <td className="p-3 font-semibold text-neutral-900">
                  batch_20261108_01
                  <div className="text-[9.5px] text-neutral-400 font-normal">
                    set_01J8A8X1
                  </div>
                </td>
                <td className="p-3 font-sans">
                  {settledTransactions.length} charges
                </td>
                <td className="p-3 text-right font-semibold text-neutral-900">
                  ₹{totalGross.toFixed(2)}
                </td>
                <td className="p-3 text-right text-neutral-400">
                  −₹{(totalFees + totalTaxes).toFixed(2)}
                </td>
                <td className="p-3 text-right font-bold text-emerald-700">
                  ₹{totalNet.toFixed(2)}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[9.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    SETTLED
                  </span>
                </td>
                <td className="p-3 text-neutral-600">
                  UTR8940281042
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Building2,
  Lock,
  ShieldCheck,
  Check,
  Copy,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { PaymentMethod } from "@/types/payment";

interface CustomerCheckoutProps {
  amount: number;
  setAmount: (amt: number) => void;
  currency: "INR" | "USD" | "EUR";
  setCurrency: (curr: "INR" | "USD" | "EUR") => void;
  method: PaymentMethod;
  setMethod: (method: PaymentMethod) => void;
  idempotencyKey: string;
  setIdempotencyKey: (key: string) => void;
  onGenerateKey: () => void;
  onPay: () => void;
  onTestDuplicate: () => void;
  isProcessing: boolean;
  status: string;
  orderId: string;
  merchantName: string;
}

const TOP_BANKS = [
  { id: "hdfc", name: "HDFC Bank", code: "HDFC" },
  { id: "icici", name: "ICICI Bank", code: "ICIC" },
  { id: "axis", name: "Axis Bank", code: "UTIB" },
  { id: "sbi", name: "State Bank", code: "SBIN" },
];

export function CustomerCheckout({
  amount,
  setAmount,
  currency,
  setCurrency,
  method,
  setMethod,
  idempotencyKey,
  setIdempotencyKey,
  onGenerateKey,
  onPay,
  onTestDuplicate,
  isProcessing,
  orderId,
  merchantName,
}: CustomerCheckoutProps) {
  const [upiId, setUpiId] = useState("adarsh@okhdfcbank");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [copiedKey, setCopiedKey] = useState(false);

  const currencySymbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(idempotencyKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 1400);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_-2px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Merchant & Order Header */}
      <div className="px-3.5 py-2.5 bg-neutral-50/80 border-b border-black/[0.06] flex items-center justify-between select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-md bg-[#111111] text-white flex items-center justify-center font-bold text-[10px] tracking-tight shrink-0 shadow-2xs">
            PS
          </div>
          <div className="truncate">
            <div className="text-[11.5px] font-semibold text-neutral-900 truncate tracking-tight">
              {merchantName}
            </div>
            <div className="text-[10px] text-neutral-400 font-mono">
              Order #{orderId.replace("order_", "")}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>PCI-DSS v4.0</span>
        </div>
      </div>

      {/* Amount Display & Presets */}
      <div className="px-3.5 py-3 border-b border-black/[0.06] space-y-2 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
            Amount Due
          </span>
          {/* Currency switch */}
          <div className="flex items-center gap-0.5 bg-neutral-100 p-0.5 rounded-md text-[10px] font-mono">
            {(["INR", "USD", "EUR"] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setCurrency(curr)}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  currency === curr
                    ? "bg-white text-neutral-900 font-semibold shadow-2xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold font-mono tracking-tight text-neutral-900">
            {currencySymbol}
            {amount.toLocaleString()}
            <span className="text-xs text-neutral-400 font-sans font-normal ml-0.5">
              .00
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono">
            {[1499, 4999, 14999].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className={`px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                  amount === val
                    ? "bg-[#111111] text-white border-[#111111] font-medium shadow-2xs"
                    : "bg-white border-black/[0.08] text-neutral-600 hover:border-black/[0.16]"
                }`}
              >
                {currencySymbol}
                {val >= 1000 ? `${val / 1000}k` : val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Method Segmented Control */}
      <div className="px-3.5 pt-2.5 pb-1">
        <div className="grid grid-cols-3 bg-neutral-100/90 p-0.5 rounded-lg text-xs font-sans border border-black/[0.04] select-none">
          <button
            type="button"
            onClick={() => setMethod("upi")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
              method === "upi"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-neutral-700" />
            <span>UPI 2.0</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod("card")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
              method === "card"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-neutral-700" />
            <span>Card</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod("netbanking")}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
              method === "netbanking"
                ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-neutral-700" />
            <span>Net Banking</span>
          </button>
        </div>
      </div>

      {/* Payment Method Inputs */}
      <div className="px-3.5 py-2.5 flex-1 flex flex-col justify-between space-y-3 overflow-y-auto">
        {/* UPI VIEW */}
        {method === "upi" && (
          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                Virtual Payment Address (VPA)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@bank"
                  className="w-full h-8 px-2.5 rounded-lg border border-black/[0.1] text-xs font-mono text-neutral-900 bg-white focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                />
                <span className="absolute right-2.5 top-2 text-[10px] text-emerald-600 font-mono font-medium">
                  Active VPA
                </span>
              </div>
            </div>

            {/* Quick UPI Apps */}
            <div>
              <span className="text-[10px] text-neutral-400 block mb-1">
                Or choose instant UPI app:
              </span>
              <div className="grid grid-cols-4 gap-1 text-[10.5px] font-sans">
                {["Google Pay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                  <button
                    key={app}
                    type="button"
                    onClick={() => setUpiId(`adarsh@${app.toLowerCase().replace(" ", "")}`)}
                    className="py-1 px-1 rounded-md bg-neutral-50 hover:bg-neutral-100 border border-black/[0.06] text-neutral-700 text-center truncate cursor-pointer transition-colors"
                  >
                    {app}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CARD VIEW (Stripe Elements Grouped Box) */}
        {method === "card" && (
          <div className="space-y-2.5">
            <div>
              <div className="flex items-center justify-between text-[11px] font-medium text-neutral-700 mb-1">
                <span>Card Information</span>
                <span className="text-[10px] font-mono text-neutral-400">
                  Sandbox Visa
                </span>
              </div>

              {/* Grouped Stripe Elements Container */}
              <div className="rounded-lg border border-black/[0.1] bg-white overflow-hidden shadow-2xs divide-y divide-black/[0.08]">
                {/* Top: Card Number */}
                <div className="flex items-center px-2.5 h-8">
                  <CreditCard className="w-3.5 h-3.5 text-neutral-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    defaultValue="4242 •••• •••• 4242"
                    readOnly
                    className="w-full text-xs font-mono text-neutral-900 bg-transparent focus:outline-none"
                  />
                  <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                    VISA
                  </span>
                </div>

                {/* Bottom Row: Expiry & CVC */}
                <div className="grid grid-cols-2 divide-x divide-black/[0.08]">
                  <div className="px-2.5 h-8 flex items-center">
                    <input
                      type="text"
                      defaultValue="12 / 28"
                      readOnly
                      placeholder="MM / YY"
                      className="w-full text-xs font-mono text-neutral-900 bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="px-2.5 h-8 flex items-center justify-between">
                    <input
                      type="text"
                      defaultValue="888"
                      readOnly
                      placeholder="CVC"
                      className="w-full text-xs font-mono text-neutral-900 bg-transparent focus:outline-none"
                    />
                    <Lock className="w-3 h-3 text-neutral-400 shrink-0" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                Name on Card
              </label>
              <input
                type="text"
                defaultValue="Adarsh Kumar"
                className="w-full h-8 px-2.5 rounded-lg border border-black/[0.1] text-xs font-sans text-neutral-900 bg-white focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
              />
            </div>
          </div>
        )}

        {/* NET BANKING VIEW */}
        {method === "netbanking" && (
          <div className="space-y-2.5">
            <div>
              <span className="block text-[11px] font-medium text-neutral-700 mb-1">
                Popular Banks
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {TOP_BANKS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBank(b.name)}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedBank === b.name
                        ? "bg-[#111111] text-white border-[#111111] shadow-2xs"
                        : "bg-white hover:bg-neutral-50 border-black/[0.08] text-neutral-800"
                    }`}
                  >
                    <span className="text-[11px] font-medium">{b.name}</span>
                    <span
                      className={`text-[9.5px] font-mono px-1 rounded ${
                        selectedBank === b.name
                          ? "bg-neutral-800 text-neutral-300"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {b.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-neutral-400 mb-1">
                Or select from all banks:
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg border border-black/[0.1] text-xs font-sans text-neutral-900 bg-white focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              >
                <option value="HDFC Bank">HDFC Bank Direct API</option>
                <option value="Axis Bank">Axis Bank NetBanking</option>
                <option value="ICICI Bank">ICICI Bank Core Switch</option>
                <option value="State Bank of India">State Bank of India</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
              </select>
            </div>
          </div>
        )}

        {/* Redis Idempotency Lock Control Bar */}
        <div className="pt-2 border-t border-black/[0.06] space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span>IDEMPOTENCY KEY (REDIS)</span>
            <div className="flex items-center gap-1.5 text-neutral-600">
              <button
                type="button"
                onClick={handleCopyKey}
                className="hover:text-neutral-900 flex items-center gap-0.5 cursor-pointer"
                title="Copy Key"
              >
                {copiedKey ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copiedKey ? "Copied" : "Copy"}</span>
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={onGenerateKey}
                className="hover:text-neutral-900 flex items-center gap-0.5 cursor-pointer text-neutral-900 font-semibold"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>New</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={idempotencyKey}
              onChange={(e) => setIdempotencyKey(e.target.value)}
              className="flex-1 h-7 px-2 rounded-md border border-black/[0.08] text-[10.5px] font-mono text-neutral-800 bg-neutral-50/60 focus:outline-none focus:border-neutral-900"
            />
            <button
              type="button"
              onClick={onTestDuplicate}
              disabled={isProcessing}
              title="Test Redis lock: Submits the identical key to confirm exactly-once processing"
              className="h-7 px-2 rounded-md border border-black/[0.1] bg-white hover:bg-neutral-50 text-[10px] font-sans font-medium text-neutral-700 shadow-2xs whitespace-nowrap cursor-pointer transition-colors disabled:opacity-50"
            >
              Test Duplicate
            </button>
          </div>
        </div>

        {/* Primary CTA (Signature Pitch-Black Tactile Button) */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onPay}
            disabled={isProcessing}
            className="w-full h-10 px-4 rounded-xl text-xs font-semibold bg-[#111111] hover:bg-[#222222] active:bg-[#000000] text-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Transaction...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  Pay {currencySymbol}
                  {amount.toLocaleString()}.00
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/70 ml-0.5" />
              </>
            )}
          </button>
          <div className="text-[9.5px] text-center text-neutral-400 mt-1.5 flex items-center justify-center gap-1 select-none">
            <Lock className="w-2.5 h-2.5" />
            <span>End-to-End Encrypted via Netty WebFlux Ingress</span>
          </div>
        </div>
      </div>
    </div>
  );
}

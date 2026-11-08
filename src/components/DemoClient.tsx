"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { PROJECTS, getProjectById, Project } from "@/data/projects";
import { CustomerCheckout } from "./CustomerCheckout";
import { InteractivePaymentFlow } from "./InteractivePaymentFlow";
import { TransactionsView } from "./TransactionsView";
import { SettlementsView } from "./SettlementsView";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { INITIAL_TRANSACTIONS } from "@/data/mockTransactions";
import {
  TransactionRecord,
  PaymentLifecycleStatus,
  PaymentMethod,
  KafkaEvent,
  LedgerEntry,
} from "@/types/payment";
import {
  ArrowLeft,
  ExternalLink,
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface DemoClientProps {
  slug: string;
}

export function DemoClient({ slug }: DemoClientProps) {
  const project: Project = getProjectById(slug) || PROJECTS[0];
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"pipeline" | "transactions" | "settlements" | "architecture">("pipeline");

  // Synchronized Simulation State
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [activeTxn, setActiveTxn] = useState<TransactionRecord>(INITIAL_TRANSACTIONS[0]);
  const [status, setStatus] = useState<PaymentLifecycleStatus>("CAPTURED");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDuplicateHit, setIsDuplicateHit] = useState<boolean>(false);
  const [simulateBankFailure, setSimulateBankFailure] = useState<boolean>(false);

  // Form State
  const [amount, setAmount] = useState<number>(1499);
  const [currency, setCurrency] = useState<"INR" | "USD" | "EUR">("INR");
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [idempotencyKey, setIdempotencyKey] = useState<string>("idemp_8fa2c091");
  const [seenKeys, setSeenKeys] = useState<Set<string>>(
    new Set(["idemp_a94f1c82", "idemp_c4189e10", "idemp_91a0c842"])
  );

  const generateNewKey = () => {
    const randomHex = Math.random().toString(16).substring(2, 10);
    setIdempotencyKey(`idemp_${randomHex}`);
    setIsDuplicateHit(false);
  };

  const executePayment = useCallback(
    (forcedDuplicate = false) => {
      if (isProcessing) return;

      setIsProcessing(true);
      setIsDuplicateHit(false);

      const isDup = forcedDuplicate || seenKeys.has(idempotencyKey);
      const isChaos = simulateBankFailure;

      const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
      const txnId = `txn_01J8${randomHex}`;
      const orderId = `order_01J8${randomHex.slice(0, 4)}`;
      const paymentId = `pay_01J8${randomHex}`;

      const feeRate = 2.0;
      const feeAmount = (amount * feeRate) / 100;
      const taxAmount = (feeAmount * 18.0) / 100;
      const totalDeductions = feeAmount + taxAmount;
      const netSettlementAmount = amount - totalDeductions;

      // Stage 1: Request Ingested
      setStatus("REQUEST_RECEIVED");

      setTimeout(() => {
        // Stage 2: Idempotency Check
        setStatus("IDEMPOTENCY_CHECK");

        if (isDup) {
          setIsDuplicateHit(true);
          setTimeout(() => {
            setStatus("CAPTURED");
            setIsProcessing(false);
          }, 400);
          return;
        }

        setSeenKeys((prev) => new Set(prev).add(idempotencyKey));

        setTimeout(() => {
          // Stage 3: Bank Routing
          setStatus("BANK_AUTHORIZING");

          setTimeout(() => {
            const finalStatus: PaymentLifecycleStatus = "CAPTURED";
            setStatus(finalStatus);
            setIsProcessing(false);

            const now = new Date();
            const timeStr = now.toTimeString().split(" ")[0];

            const mockKafkaEvents: KafkaEvent[] = [
              {
                id: `ev_${Math.random().toString(36).substring(2, 7)}`,
                topic: "paystream.payments.created",
                eventType: "payment.created",
                partition: 1,
                offset: 14830,
                timestamp: timeStr,
                consumerStatus: "ACKNOWLEDGED",
                payload: { txnId, amount, status: "CREATED" },
              },
              {
                id: `ev_${Math.random().toString(36).substring(2, 7)}`,
                topic: "paystream.payments.captured",
                eventType: "payment.captured",
                partition: 2,
                offset: 14831,
                timestamp: timeStr,
                consumerStatus: "CONSUMED",
                payload: { txnId, amount, bank: isChaos ? "AXIS (Failover)" : "HDFC" },
              },
            ];

            const mockLedger: LedgerEntry[] = [
              {
                id: `led_${Math.random().toString(36).substring(2, 6)}`,
                account: "1010-Transit-Escrow",
                accountType: "Asset",
                debit: amount,
                credit: 0,
                description: `Captured escrow funds for ${txnId}`,
                timestamp: timeStr,
              },
              {
                id: `led_${Math.random().toString(36).substring(2, 6)}`,
                account: "2020-Merchant-Payable",
                accountType: "Liability",
                debit: 0,
                credit: netSettlementAmount,
                description: `Merchant payable balance for ${txnId}`,
                timestamp: timeStr,
              },
              {
                id: `led_${Math.random().toString(36).substring(2, 6)}`,
                account: "4010-Gateway-Fee",
                accountType: "Revenue",
                debit: 0,
                credit: totalDeductions,
                description: `Platform fee (2% + 18% GST) for ${txnId}`,
                timestamp: timeStr,
              },
            ];

            const newRecord: TransactionRecord = {
              id: txnId,
              orderId,
              paymentId,
              amount,
              currency,
              method,
              methodDetails: {
                upiId: method === "upi" ? "sarah@okhdfcbank" : undefined,
                cardLast4: method === "card" ? "4242" : undefined,
                cardBrand: method === "card" ? "Visa" : undefined,
                bankName: method === "netbanking" ? "HDFC Bank" : undefined,
              },
              customer: {
                name: "Sarah Jenkins",
                email: "sarah@company.io",
                phone: "+91 98765 43210",
              },
              timestamp: timeStr,
              createdAt: Date.now(),
              durationMs: isChaos ? 142 : 84,
              status: finalStatus,
              displayStatus: "Captured",
              idempotencyKey,
              routing: {
                method,
                primaryRoute: isChaos ? "Axis Bank Backup Rails" : "NPCI UPI 2.0 Rails (HDFC)",
                fallbackRoute: "Axis Bank Secondary Rail",
                circuitBreakerState: isChaos ? "OPEN" : "CLOSED",
                failoverTriggered: isChaos,
                authRrn: `RRN${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                participants: [
                  { name: "Customer App", role: "UPI Intent", status: "passed", latencyMs: 20 },
                  { name: "NPCI", role: "UPI Switch", status: "passed", latencyMs: 35 },
                  { name: isChaos ? "Axis Backup" : "HDFC Bank", role: "Acquirer", status: "passed", latencyMs: isChaos ? 42 : 29 },
                ],
              },
              kafkaEvents: mockKafkaEvents,
              ledgerEntries: mockLedger,
              webhook: {
                endpoint: "https://merchant.io/webhooks/paystream",
                eventType: "payment.captured",
                signature: `sha256=${Math.random().toString(16).substring(2, 14)}...`,
                status: "delivered",
                deliveryAttempts: 1,
                durationMs: 18,
                lastAttemptTimestamp: timeStr,
                httpStatus: 200,
                payload: {
                  event: "payment.captured",
                  transactionId: txnId,
                  amount,
                  status: "COMPLETED",
                },
              },
              financials: {
                settlementId: `set_01J8${randomHex.slice(0, 4)}`,
                batchId: "SET-2026-0812",
                grossAmount: amount,
                feeRatePercent: 2.0,
                feeAmount,
                taxRatePercent: 18.0,
                taxAmount,
                totalDeductions,
                netSettlementAmount,
                settlementStatus: "Settled",
                expectedDate: "T+1 (Tomorrow 06:00 IST)",
                settlementUtr: `UTR${Math.floor(1000000000 + Math.random() * 9000000000)}`,
              },
            };

            setTransactions((prev) => [newRecord, ...prev]);
            setActiveTxn(newRecord);
          }, 500);
        }, 400);
      }, 350);
    },
    [isProcessing, seenKeys, idempotencyKey, simulateBankFailure, amount, currency, method]
  );

  const getContainerWidth = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-[440px]";
      case "tablet":
        return "max-w-[860px]";
      case "desktop":
      default:
        return "max-w-7xl";
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-[#F8FAFC] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 shrink-0 h-14 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 px-3 sm:px-6 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-4 truncate">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus-visible:outline-2 focus-visible:outline-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Showcase</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

          <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold text-neutral-900 bg-neutral-100/90 rounded-md border border-neutral-200">
            <span>PayStream Interactive Sandbox</span>
            <span className="text-[10px] font-mono text-emerald-600 hidden md:inline">&bull; Live Gateway</span>
          </div>
        </div>

        {/* Center: TLS Endpoint Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="flex items-center justify-between w-full px-3 py-1 bg-neutral-50 rounded-lg border border-neutral-200/80 text-xs font-mono text-neutral-600 shadow-2xs">
            <div className="flex items-center gap-2 truncate">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate text-neutral-800 font-medium">https://api.paystream.dev/v1/payments/charge</span>
            </div>
            <span className="text-[10px] text-neutral-400 shrink-0 ml-2">TLS 1.3</span>
          </div>
        </div>

        {/* Right: Viewport & External Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Viewport controls */}
          <div className="hidden md:flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              title="Desktop View"
              aria-label="Desktop View"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewport === "desktop" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport("tablet")}
              title="Tablet View"
              aria-label="Tablet View"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewport === "tablet" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              title="Mobile View"
              aria-label="Mobile View"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewport === "mobile" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <a
            href={project.architectureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 shadow-2xs transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-neutral-600" />
            <span>Architecture</span>
          </a>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 shadow-2xs transition-colors"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* Main Workstation Container */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 flex flex-col items-center justify-start overflow-y-auto">
        <div className={`w-full ${getContainerWidth()} mx-auto transition-all duration-300 space-y-4`}>
          {/* Top Navigation & Controls Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-neutral-200/90 shadow-2xs">
            {/* View Selector Tabs */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200/80 text-xs overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("pipeline")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "pipeline"
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Payment Simulator
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("transactions")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "transactions"
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Transactions ({transactions.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("settlements")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "settlements"
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Settlements &amp; Payouts
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("architecture")}
                className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "architecture"
                    ? "bg-white text-neutral-900 shadow-2xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                System Topology
              </button>
            </div>

            {/* Bank Failure Simulation Toggle (Resilience4j Chaos Testing) */}
            <div className="flex items-center gap-2 text-xs">
              <label
                htmlFor="bank-failure-toggle"
                className="flex items-center gap-2 cursor-pointer select-none px-2.5 py-1 rounded-lg border border-neutral-200/90 bg-neutral-50 hover:bg-neutral-100 transition-colors"
              >
                <input
                  id="bank-failure-toggle"
                  type="checkbox"
                  checked={simulateBankFailure}
                  onChange={(e) => setSimulateBankFailure(e.target.checked)}
                  className="rounded text-neutral-900 focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px] font-medium text-neutral-700">
                  Simulate Bank Timeout (Resilience4j Failover)
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono uppercase font-bold ${
                    simulateBankFailure
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-neutral-200/70 text-neutral-600"
                  }`}
                >
                  {simulateBankFailure ? "FAILOVER ACTIVE" : "NORMAL"}
                </span>
              </label>
            </div>
          </div>

          {/* Tab View 1: Main Interactive Payment Flow */}
          {activeTab === "pipeline" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column: Customer Checkout Interface */}
              <div className="lg:col-span-5">
                <CustomerCheckout
                  amount={amount}
                  setAmount={setAmount}
                  currency={currency}
                  setCurrency={setCurrency}
                  method={method}
                  setMethod={setMethod}
                  idempotencyKey={idempotencyKey}
                  setIdempotencyKey={setIdempotencyKey}
                  onGenerateKey={generateNewKey}
                  onPay={() => executePayment(false)}
                  onTestDuplicate={() => executePayment(true)}
                  isProcessing={isProcessing}
                  status={status}
                  orderId={activeTxn.orderId}
                  merchantName="Linear Cloud Inc."
                />
              </div>

              {/* Right Column: Interactive Payment Flow & Mechanics */}
              <div className="lg:col-span-7">
                <InteractivePaymentFlow
                  transaction={activeTxn}
                  status={status}
                  isProcessing={isProcessing}
                  isDuplicateHit={isDuplicateHit}
                  simulateBankFailure={simulateBankFailure}
                  onReset={() => {
                    generateNewKey();
                    setStatus("IDLE");
                  }}
                />
              </div>
            </div>
          )}

          {/* Tab View 2: Live Transaction Ledger */}
          {activeTab === "transactions" && (
            <div className="w-full">
              <TransactionsView
                transactions={transactions}
                onSelectTransaction={(txn: TransactionRecord) => setActiveTxn(txn)}
                activeTransaction={activeTxn}
              />
            </div>
          )}

          {/* Tab View 3: Settlements & Net Payouts */}
          {activeTab === "settlements" && (
            <div className="w-full">
              <SettlementsView transactions={transactions} />
            </div>
          )}

          {/* Tab View 4: System Architecture */}
          {activeTab === "architecture" && (
            <div className="w-full bg-white p-4 rounded-xl border border-neutral-200/90 shadow-2xs">
              <ArchitectureDiagram />
            </div>
          )}
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="shrink-0 h-9 bg-white border-t border-neutral-200/80 px-4 flex items-center justify-between text-[11px] font-sans text-neutral-500 select-none">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Interactive Sandbox Session Active</span>
        </div>
        <div className="flex items-center gap-3 text-neutral-400 font-mono text-[10px]">
          <span>Security: AES-256 HMAC</span>
          <span>&bull;</span>
          <span>Zero-Drop Failover: Active</span>
        </div>
      </footer>
    </div>
  );
}

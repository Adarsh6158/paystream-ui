export type PaymentMethod = "upi" | "card" | "netbanking";

export type PaymentLifecycleStatus =
  | "IDLE"
  | "CHECKOUT_CREATED"
  | "REQUEST_RECEIVED"
  | "MERCHANT_AUTHENTICATED"
  | "REQUEST_VALIDATED"
  | "IDEMPOTENCY_CHECK"
  | "ROUTING"
  | "BANK_AUTHORIZING"
  | "AUTHORIZED"
  | "CAPTURING"
  | "CAPTURED"
  | "EVENT_PUBLISHED"
  | "LEDGER_UPDATED"
  | "WEBHOOK_DISPATCHING"
  | "WEBHOOK_DELIVERED"
  | "SETTLEMENT_ELIGIBLE"
  | "SETTLEMENT_PROCESSING"
  | "SETTLED"
  | "FAILED"
  | "REFUNDED";

export interface KafkaEvent {
  id: string;
  topic: string;
  eventType: string;
  partition: number;
  offset: number;
  timestamp: string;
  payload: Record<string, unknown>;
  consumerStatus: string;
}

export interface LedgerEntry {
  id: string;
  account: string;
  accountType: "Asset" | "Liability" | "Revenue" | "Expense";
  debit: number;
  credit: number;
  description: string;
  timestamp: string;
}

export interface WebhookDelivery {
  endpoint: string;
  eventType: string;
  payload: Record<string, unknown>;
  signature: string;
  deliveryAttempts: number;
  httpStatus: number;
  status: "pending" | "sending" | "delivered" | "failed" | "retried";
  durationMs: number;
  lastAttemptTimestamp: string;
}

export interface FinancialSettlement {
  settlementId: string;
  batchId: string;
  grossAmount: number;
  feeRatePercent: number;
  feeAmount: number;
  taxRatePercent: number; // 18% GST on fees
  taxAmount: number;
  totalDeductions: number;
  netSettlementAmount: number;
  settlementStatus: "Pending" | "Processing" | "Settled" | "Failed";
  expectedDate: string;
  settlementUtr?: string;
}

export interface RouteParticipant {
  name: string;
  role: string;
  status: "pending" | "active" | "passed" | "failed";
  latencyMs?: number;
}

export interface TransactionRecord {
  id: string; // txn_...
  orderId: string; // order_...
  paymentId: string; // pay_...
  amount: number;
  currency: "INR" | "USD" | "EUR";
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  method: PaymentMethod;
  methodDetails: {
    upiId?: string;
    cardLast4?: string;
    cardBrand?: string;
    cardholderName?: string;
    bankName?: string;
  };
  idempotencyKey: string;
  status: PaymentLifecycleStatus;
  displayStatus: "Pending" | "Authorized" | "Captured" | "Settled" | "Failed" | "Refunded";
  timestamp: string;
  createdAt: number;
  durationMs: number;
  failureReason?: string;
  
  // Routing & Resilience
  routing: {
    method: PaymentMethod;
    primaryRoute: string;
    fallbackRoute?: string;
    circuitBreakerState: "CLOSED" | "OPEN" | "HALF-OPEN";
    failoverTriggered: boolean;
    authRrn: string;
    participants: RouteParticipant[];
  };

  // Financial breakdown
  financials: FinancialSettlement;

  // Ledger
  ledgerEntries: LedgerEntry[];

  // Kafka
  kafkaEvents: KafkaEvent[];

  // Webhook
  webhook: WebhookDelivery;
}

export type SimulationScenario =
  | "SUCCESS"
  | "DUPLICATE_IDEMPOTENCY"
  | "BANK_TIMEOUT_FAILOVER"
  | "BANK_DECLINE"
  | "WEBHOOK_RETRY";


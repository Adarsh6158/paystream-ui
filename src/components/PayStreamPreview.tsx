"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  CreditCard,
  Terminal,
  FileCode,
  CheckCircle2,
  Activity,
  Cpu,
  Clock,
  Radio,
  ChevronDown,
  Search,
  Settings,
  GitBranch,
  Send,
  User,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PayStreamPreviewProps {
  isReplaying?: boolean;
  onReplayComplete?: () => void;
}

type DemoPhase =
  | "ide_view"
  | "cursor_moving"
  | "typing_mvn"
  | "booting_spring"
  | "prompt_typing"
  | "prompt_moving_up"
  | "ai_generating"
  | "live_ready";

interface CodeLine {
  num: number;
  tokens: { text: string; color: string }[];
}

interface ShowcasePaymentFlow {
  id: string;
  name: string;
  prompt: string;
  mainFile: string;
  topic: string;
  codeLines: CodeLine[];
}

const SPRING_BANNER = [
  "  .   ____          _            __ _ _",
  " /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\",
  "( ( )\\___ | '_ | '_| | '_ \\/ _` | \\ \\ \\ \\",
  " \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )",
  "  '  |____| .__|_| |_|_| |_\\__, | / / / /",
  " =========|_|==============|___/=/_/_/_/",
  " :: Spring Boot ::  (v3.3.4)",
];


const BOOT_LOGS = [
  "[INFO] Initializing PayStream High-Throughput Payment Engine",
  "[INFO] Connected to Apache Kafka Cluster (topics: txn.initiated, txn.settled)",
  "[INFO] Netty reactive server started on port 8080 (http) with context ''",
  "✓ Started PayStreamApplication in 0.74 seconds",
];

const SHOWCASE_FLOWS: ShowcasePaymentFlow[] = [
  {
    id: "razorpay_checkout",
    name: "Razorpay Checkout & Idempotency",
    prompt: "Create idempotent Razorpay checkout session with dual-bank routing & AES-256 webhook",
    mainFile: "PaymentGatewayEngine.java",
    topic: "/topic/txn-stream",
    codeLines: [
      {
        num: 1,
        tokens: [
          { text: "@RestController", color: "text-amber-400 font-semibold" },
          { text: ' @RequestMapping("/api/v1/payments")', color: "text-emerald-400 font-medium" },
        ],
      },
      {
        num: 2,
        tokens: [
          { text: "public class ", color: "text-purple-400 font-medium" },
          { text: "PaymentGatewayEngine ", color: "text-blue-300 font-bold" },
          { text: "implements ", color: "text-purple-400 font-medium" },
          { text: "PaymentSession ", color: "text-cyan-300 font-semibold" },
          { text: "{", color: "text-slate-300" },
        ],
      },
      {
        num: 3,
        tokens: [
          { text: "  @Autowired ", color: "text-amber-400 font-medium" },
          { text: "private KafkaTemplate<String, TxnEvent> kafkaTemplate;", color: "text-slate-200" },
        ],
      },
      {
        num: 4,
        tokens: [
          { text: "  @Autowired ", color: "text-amber-400 font-medium" },
          { text: "private IdempotencyStore idempotencyStore;", color: "text-slate-200" },
        ],
      },
      {
        num: 5,
        tokens: [
          { text: "  @PostMapping", color: "text-amber-400 font-semibold" },
          { text: '("/charge")', color: "text-emerald-400 font-medium" },
          { text: ' @CircuitBreaker(name = "primaryBank", fallback = "routeBackup")', color: "text-cyan-300 font-medium" },
        ],
      },
      {
        num: 6,
        tokens: [
          { text: "  public Mono<PaymentResponse> ", color: "text-purple-400 font-medium" },
          { text: "processCharge", color: "text-blue-400 font-bold" },
          { text: "(@RequestBody ChargeRequest req) {", color: "text-slate-300" },
        ],
      },
      {
        num: 7,
        tokens: [
          { text: "    idempotencyStore.validateKey(req.getIdempotencyKey());", color: "text-slate-300" },
        ],
      },
      {
        num: 8,
        tokens: [
          { text: "    TxnRecord record = TxnRecord.of(req.getAmount(), req.getCurrency());", color: "text-slate-300" },
        ],
      },
      {
        num: 9,
        tokens: [
          { text: "    kafkaTemplate.send(", color: "text-slate-300" },
          { text: '"txn.initiated"', color: "text-emerald-300" },
          { text: ", record.getId(), record);", color: "text-slate-300" },
        ],
      },
      {
        num: 10,
        tokens: [
          { text: "    return bankGateway.settle(record).timeout(Duration.ofMillis(180));", color: "text-emerald-400 font-semibold" },
        ],
      },
      {
        num: 11,
        tokens: [{ text: "  }", color: "text-slate-300" }],
      },
      {
        num: 12,
        tokens: [{ text: "}", color: "text-slate-300" }],
      },
    ],
  },
  {
    id: "circuit_breaker",
    name: "Dual-Bank Failover & Webhook Dispatch",
    prompt: "Trigger circuit breaker failover to secondary banking route upon latency spike",
    mainFile: "CircuitBreakerRoutingEngine.java",
    topic: "/topic/bank-failover",
    codeLines: [
      {
        num: 1,
        tokens: [
          { text: "@Service @Slf4j", color: "text-amber-400 font-semibold" },
        ],
      },
      {
        num: 2,
        tokens: [
          { text: "public class ", color: "text-purple-400 font-medium" },
          { text: "CircuitBreakerRoutingEngine ", color: "text-blue-300 font-bold" },
          { text: "{", color: "text-slate-300" },
        ],
      },
      {
        num: 3,
        tokens: [
          { text: "  @Autowired ", color: "text-amber-400 font-medium" },
          { text: "private WebhookDispatcher webhookDispatcher;", color: "text-slate-200" },
        ],
      },
      {
        num: 4,
        tokens: [
          { text: '  @Retry(name = "bankSettle", fallbackMethod = "routeSecondaryBank")', color: "text-cyan-300 font-medium" },
        ],
      },
      {
        num: 5,
        tokens: [
          { text: "  public Mono<Settlement> ", color: "text-purple-400 font-medium" },
          { text: "routeSecondaryBank", color: "text-blue-400 font-bold" },
          { text: "(Throwable t) {", color: "text-slate-300" },
        ],
      },
      {
        num: 6,
        tokens: [
          { text: '    log.warn("Primary gateway tripped: {}. Switching to Backup Bank", t.getMessage());', color: "text-amber-300 font-mono" },
        ],
      },
      {
        num: 7,
        tokens: [
          { text: "    return backupBankClient.chargeInstant()", color: "text-emerald-400 font-medium" },
        ],
      },
      {
        num: 8,
        tokens: [
          { text: "      .doOnSuccess(webhookDispatcher::signAndDispatch);", color: "text-slate-200" },
        ],
      },
      {
        num: 9,
        tokens: [{ text: "  }", color: "text-slate-300" }],
      },
      {
        num: 10,
        tokens: [{ text: "}", color: "text-slate-300" }],
      },
    ],
  },
];

export function PayStreamPreview({
  isReplaying = false,
  onReplayComplete,
}: PayStreamPreviewProps) {
  const [flowIndex, setFlowIndex] = useState(0);
  const currentFlow = SHOWCASE_FLOWS[flowIndex];

  const [phase, setPhase] = useState<DemoPhase>("ide_view");
  const [typedCommand, setTypedCommand] = useState("");
  const [typedPrompt, setTypedPrompt] = useState("");
  const [streamIndex, setStreamIndex] = useState(0);
  const [mobileView, setMobileView] = useState<"code" | "preview">("code");
  const [activeTab, setActiveTab] = useState<"app" | "telemetry">("app");

  // Flow 1 specific state: 4-step trace & card settlement
  const [traceStep, setTraceStep] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<"processing" | "settled">("processing");

  // Flow 2 specific state: bank routing switch
  const [bankRoutingStage, setBankRoutingStage] = useState(0);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll code stream like realistic dev tools
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [streamIndex, phase]);

  // Main Orchestration Timeline Loop
  const runSequence = useCallback(
    (flowIdx: number) => {
      const activeFlow = SHOWCASE_FLOWS[flowIdx];

      setPhase("ide_view");
      setTypedCommand("");
      setTypedPrompt("");
      setStreamIndex(0);
      setTraceStep(0);
      setPaymentStatus("processing");
      setBankRoutingStage(0);

      // Phase 1: IDE View & smooth cursor glide down into terminal
      const t1 = setTimeout(() => {
        setPhase("cursor_moving");
      }, 700);

      // Phase 2: Typing `./mvnw spring-boot:run`
      const t2 = setTimeout(() => {
        setPhase("typing_mvn");
        const commandText = "./mvnw spring-boot:run";
        let cIdx = 0;
        const typeInterval = setInterval(() => {
          cIdx++;
          setTypedCommand(commandText.slice(0, cIdx));
          if (cIdx >= commandText.length) {
            clearInterval(typeInterval);

            // Phase 3: JVM Boot Screen (Spring Boot ASCII banner & logs)
            setTimeout(() => {
              setPhase("booting_spring");

              // Phase 4: Transition to Gateway Studio & typing prompt
              setTimeout(() => {
                setPhase("prompt_typing");
                const promptText = activeFlow.prompt;
                let pIdx = 0;
                const pInterval = setInterval(() => {
                  pIdx++;
                  setTypedPrompt(promptText.slice(0, pIdx));
                  if (pIdx >= promptText.length) {
                    clearInterval(pInterval);

                    // Phase 5: Prompt sends & tucks to header strip
                    setTimeout(() => {
                      setPhase("prompt_moving_up");

                      // Phase 6: Live Code Streaming
                      setTimeout(() => {
                        setPhase("ai_generating");
                        let sIdx = 0;
                        const streamInterval = setInterval(() => {
                          sIdx++;
                          setStreamIndex(sIdx);
                          if (sIdx >= activeFlow.codeLines.length) {
                            clearInterval(streamInterval);

                            // Phase 7: Live Ready
                            setTimeout(() => {
                              setPhase("live_ready");
                              setPaymentStatus("settled");
                              setTraceStep(4);

                              // Rotate to next showcase flow after comfortable viewing duration
                              setTimeout(() => {
                                const nextIdx = (flowIdx + 1) % SHOWCASE_FLOWS.length;
                                setFlowIndex(nextIdx);
                                runSequence(nextIdx);
                              }, 6000);
                            }, 500);
                          }
                        }, 120);
                      }, 400);
                    }, 400);
                  }
                }, 22);
              }, 1600);
            }, 300);
          }
        }, 45);
      }, 1600);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    },
    []
  );

  useEffect(() => {
    const cancel = runSequence(flowIndex);
    return () => cancel();
  }, [isReplaying]); // eslint-disable-line react-hooks/exhaustive-deps

  // Step ticker for Payment Flow 1
  useEffect(() => {
    if (phase === "ai_generating") {
      const stepInterval = setInterval(() => {
        setTraceStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 350);
      return () => clearInterval(stepInterval);
    }
  }, [phase]);

  // Bank routing ticker for Flow 2
  useEffect(() => {
    if (phase === "ai_generating" && currentFlow.id === "circuit_breaker") {
      const bankInterval = setInterval(() => {
        setBankRoutingStage((prev) => (prev + 1) % 3);
      }, 1400);
      return () => clearInterval(bankInterval);
    }
  }, [phase, currentFlow.id]);

  return (
    <div className="flex flex-col h-[390px] sm:h-[415px] lg:h-[420px] w-full bg-[#0a0e17] text-slate-100 select-none overflow-hidden font-sans border-0">
      {/* Mobile View Toggle Strip (Small screens only) */}
      <div className="md:hidden flex items-center justify-between px-2.5 sm:px-3 py-1.5 bg-[#0e1320] border-b border-[#333333] text-xs gap-2">
        <div className="flex items-center gap-1 bg-[#252526] p-0.5 rounded-lg border border-[#333333]">
          <button
            type="button"
            onClick={() => setMobileView("code")}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
              mobileView === "code" ? "bg-slate-800 text-white font-medium shadow-2xs" : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="hidden sm:inline">Spring Boot </span>IDE
          </button>
          <button
            type="button"
            onClick={() => setMobileView("preview")}
            className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
              mobileView === "preview" ? "bg-blue-600 text-white font-medium shadow-2xs" : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="hidden sm:inline">Live </span>Gateway
          </button>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-medium truncate max-w-[150px] sm:max-w-none text-right">
          paystream.adarshcodes.com
        </span>
      </div>

      {/* Main Dual-Panel Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
        {/* ========================================================= */}
        {/* LEFT PANEL: Spring Boot IDE & High-Throughput Terminal    */}
        {/* ========================================================= */}
        <div
          className={`${
            mobileView === "code" ? "flex" : "hidden"
          } md:flex md:col-span-6 flex-col bg-[#1e1e1e] border-r border-[#333333]/80 min-h-0 relative overflow-hidden`}
        >

          {/* 1. IDE VIEW & MVN RUNNING STAGES */}
          {(phase === "ide_view" ||
            phase === "cursor_moving" ||
            phase === "typing_mvn" ||
            phase === "booting_spring") && (
            <div className="flex flex-col h-full w-full">
              {/* VS Code Window Header */}
              <div className="flex items-center justify-between px-2.5 bg-[#252526] border-b border-[#333333]/80 text-[10px] text-slate-400 h-8 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <span className="text-[10px] text-slate-400 font-sans ml-2">
                    paystream-gateway — VS Code
                  </span>
                </div>
                <div className="text-[9.5px] text-slate-400 pr-2">
                  <span>Spring Boot 3.3.4</span>
                </div>
              </div>

              {/* Middle Editor Area: Project Tree + Code */}
              <div className="flex-1 grid grid-cols-12 min-h-0 bg-[#1e1e1e]">
                {/* Mini Explorer Sidebar */}
                <div className="col-span-4 border-r border-[#333333]/70 p-2 text-[9.5px] font-mono text-slate-400 overflow-hidden flex flex-col justify-between select-none">
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-1.5 flex items-center gap-1">
                      <ChevronDown className="w-3 h-3" />
                      <span>EXPLORER</span>
                    </div>
                    <div className="pl-1 text-slate-300 font-medium">PAYSTREAM-GATEWAY</div>
                    <div className="pl-2 space-y-0.5">
                      <div className="text-slate-400 flex items-center gap-1">
                        <span>▾ src/main/java</span>
                      </div>
                      <div className="pl-2 text-slate-400">▾ com.paystream</div>
                      <div className="pl-4 text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">
                        <Image src="/icons/Java.svg" alt="Java" width={14} height={14} className="w-3.5 h-3.5 object-contain shrink-0" />
                        <span className="truncate">PayStreamApp.java</span>
                      </div>
                      <div className="pl-4 text-slate-400 flex items-center gap-1">
                        <Image src="/icons/Java.svg" alt="Java" width={14} height={14} className="w-3.5 h-3.5 object-contain shrink-0" />
                        <span className="truncate">PaymentCtrl.java</span>
                      </div>
                      <div className="pl-4 text-slate-400 flex items-center gap-1">
                        <Image src="/icons/Java.svg" alt="Java" width={14} height={14} className="w-3.5 h-3.5 object-contain shrink-0" />
                        <span className="truncate">KafkaConfig.java</span>
                      </div>
                      <div className="pl-2 text-slate-400 flex items-center gap-1">
                        <FileCode className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>pom.xml</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#333333]/60 text-[8.5px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <GitBranch className="w-2.5 h-2.5" />
                      <span>master*</span>
                    </div>
                  </div>
                </div>

                {/* Code Window: PayStreamApplication.java */}
                <div className="col-span-8 flex flex-col min-h-0 bg-[#0A0D15]">
                  <div className="flex items-center justify-between px-3 py-1 bg-[#0e1320] border-b border-[#333333] text-[10px] font-mono text-slate-300 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <FileCode className="w-3 h-3 text-emerald-400" />
                      <span className="font-medium">PayStreamApplication.java</span>
                    </div>
                    <span className="text-[8.5px] text-slate-400">UTF-8</span>
                  </div>

                  {/* Active VS Code Editor Lines with VS Code color accents */}
                  <div className="p-1.5 sm:p-2 text-[8.5px] sm:text-[9px] font-mono leading-snug space-y-0.5 text-slate-300 overflow-y-auto">
                    <div>
                      <span className="text-[#569cd6]">package </span>
                      <span className="text-[#9cdcfe]">com.paystream.gateway;</span>
                    </div>
                    <div className="text-slate-600">// Distributed Reactive Payment Gateway</div>
                    <div>
                      <span className="text-[#dcdcaa]">@SpringBootApplication</span>
                    </div>
                    <div>
                      <span className="text-[#dcdcaa]">@EnableKafka</span>
                    </div>
                    <div>
                      <span className="text-[#569cd6]">public class </span>
                      <span className="text-[#4ec9b0] font-semibold">PayStreamApplication </span>
                      <span className="text-[#ffd700]">&#123;</span>
                    </div>
                    <div className="pl-3">
                      <span className="text-[#569cd6]">public static void </span>
                      <span className="text-[#dcdcaa]">main</span>
                      <span className="text-[#cccccc]">(String[] args) &#123;</span>
                    </div>
                    <div className="pl-6">
                      <span className="text-[#4ec9b0]">SpringApplication</span>
                      <span className="text-[#cccccc]">.run</span>
                      <span className="text-[#cccccc]">(PayStreamApplication.</span>
                      <span className="text-[#569cd6]">class</span>
                      <span className="text-[#cccccc]">, args);</span>
                    </div>
                    <div className="pl-3"><span className="text-[#ffd700]">&#125;</span></div>
                    <div><span className="text-[#ffd700]">&#125;</span></div>
                  </div>
                </div>
              </div>

              {/* Bottom: Terminal Drawer */}
              <div className="h-[62%] sm:h-[63%] flex flex-col min-h-0 bg-[#1e1e1e]">
                {/* Terminal Tabs Row */}
                <div className="flex items-center gap-3 sm:gap-4 px-2.5 sm:px-3 py-1 bg-[#1e1e1e] border-b border-[#252526] text-[9px] sm:text-[9.5px] font-sans tracking-wider uppercase text-[#858585] shrink-0 select-none">
                  <span>PROBLEMS</span>
                  <span>OUTPUT</span>
                  <span>CONSOLE</span>
                  <span className="text-white font-semibold border-b-2 border-blue-500 pb-0.5 relative">
                    TERMINAL

                    {/* Virtual Mouse Cursor: Glides gracefully down directly onto the TERMINAL tab! */}
                    <AnimatePresence>
                      {(phase === "ide_view" || phase === "cursor_moving") && (
                        <motion.div
                          initial={{ x: -35, y: -65, opacity: 0 }}
                          animate={
                            phase === "cursor_moving"
                              ? { x: 8, y: 10, opacity: 1, scale: [1, 1, 0.88, 1] }
                              : { x: -35, y: -65, opacity: 0.9, scale: 1 }
                          }
                          exit={{ opacity: 0 }}
                          transition={
                            phase === "cursor_moving"
                              ? { duration: 0.95, ease: [0.16, 1, 0.3, 1] }
                              : { duration: 0.4 }
                          }
                          className="absolute z-50 pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                        >
                          <div className="relative">
                            <svg
                              className="w-4.5 h-4.5 text-white fill-white stroke-slate-900 stroke-[1.5]"
                              viewBox="0 0 24 24"
                            >
                              <path d="M3 3l7 18 3-7 7-3L3 3z" />
                            </svg>
                            <span className="absolute left-4.5 -top-1 px-1.5 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[8px] font-semibold shadow-md border border-blue-400/30 whitespace-nowrap">
                              Execute ./mvnw
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </span>
                  <span>PORTS</span>
                </div>

                {/* Terminal Body */}
                <div className="flex-1 px-2.5 py-1.5 overflow-y-auto text-[9.5px] sm:text-[10px] font-mono leading-relaxed space-y-1 bg-[#1e1e1e]">
                  {/* Command Prompt */}
                  <div className="flex items-center gap-1.5 text-[9.5px] font-mono whitespace-nowrap overflow-x-auto scrollbar-none text-slate-300 py-0.5">
                    <span className="text-[#519aba] font-medium shrink-0">adarsh@mac:~/paystream</span>
                    <span className="text-emerald-400 font-bold shrink-0">$</span>
                    <span className="text-white font-medium shrink-0">
                      {typedCommand}
                      {(phase === "ide_view" ||
                        phase === "cursor_moving" ||
                        phase === "typing_mvn") && (
                        <span className="inline-block w-1.5 h-3 ml-0.5 bg-white align-middle animate-pulse" />
                      )}
                    </span>
                  </div>

                  {/* Spring Boot Booting Logs, Logo & Crisp ASCII Banner */}
                  {phase === "booting_spring" && (
                    <div className="space-y-1 mt-0.5 font-mono select-none overflow-x-auto scrollbar-none">
                      {/* Official Spring Boot Hexagon Logo from project assets + Version Header */}
                      <div className="flex items-center gap-2 pb-1 border-b border-emerald-900/40">
                        <div className="w-5 h-5 rounded-md bg-[#252526] border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                          <Image
                            src="/icons/SpringBoot.png"
                            width={16}
                            height={16}
                            alt="Spring Boot"
                            className="rounded-xs shrink-0"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] font-sans">
                          <span className="font-bold text-white tracking-wide">Spring Boot</span>
                          <span className="text-emerald-400 font-mono text-[8.5px] px-1 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20 font-medium">v3.3.4</span>
                          <span className="text-slate-400 text-[8px] font-mono">• OpenJDK 21 LTS</span>
                        </div>
                      </div>

                      {/* Crisp ASCII Art Banner (Pure pre tag with official Spring green) */}
                      <div className="overflow-x-auto scrollbar-none py-0.5">
                        <pre
                          className="spring-ascii-art font-mono text-[7px] sm:text-[7.5px] leading-[1.18] text-[#6db33f] font-normal tracking-normal select-none m-0 p-0 whitespace-pre"
                          style={{
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontVariantLigatures: 'none',
                            fontFeatureSettings: '"liga" 0, "calt" 0',
                            letterSpacing: '0px',
                          }}
                        >
                          {SPRING_BANNER.join("\n")}
                        </pre>
                      </div>

                      {/* Real JVM Logs */}
                      <div className="pt-0.5 space-y-0.5 text-[8px] sm:text-[8.5px]">
                        {BOOT_LOGS.map((log) => (
                          <div
                            key={log}
                            className={`truncate ${
                              log.startsWith("✓")
                                ? "text-emerald-300 font-semibold"
                                : "text-slate-400"
                            }`}
                          >
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. PAYMENT ARCHITECT STUDIO (PROMPT & CODE STREAMING) */}
          {(phase === "prompt_typing" ||
            phase === "prompt_moving_up" ||
            phase === "ai_generating" ||
            phase === "live_ready") && (
            <div className="flex flex-col h-full w-full justify-between p-2.5 sm:p-3 min-h-0 bg-[#1e1e1e]">
              {/* Top Studio Header */}
              <div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b border-[#333333] shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-xs font-semibold text-white">PayStream Gateway Architect</div>
                    <div className="text-[9px] sm:text-[9.5px] text-slate-500 font-mono">Spring WebFlux • Kafka Ledger</div>
                  </div>
                </div>

                {/* Clean, Professional Status Typography (No glowing dot, no rounded box) */}
                <div className="text-[10px] sm:text-[11px] font-mono text-slate-400 select-none">
                  <span className="text-slate-400 font-medium">
                    {phase === "prompt_typing" && "Transaction Spec"}
                    {phase === "prompt_moving_up" && "Gateway Pipeline"}
                    {phase === "ai_generating" && "Reactive Stream"}
                    {phase === "live_ready" && "Ready"}
                  </span>
                </div>
              </div>

              {/* Scrollable Conversation Stream */}
              <div
                ref={chatScrollRef}
                className="flex-1 py-1.5 sm:py-2 overflow-y-auto space-y-2 sm:space-y-2.5 min-h-0 scrollbar-thin scrollbar-thumb-[#333333] scrollbar-track-transparent"
              >
                {/* User Prompt Bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-1.5 sm:gap-2 max-w-[95%]"
                >
                  <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-xl rounded-tl-xs bg-[#252526]/90 border border-[#333333] text-xs text-slate-200 leading-snug sm:leading-relaxed shadow-xs">
                    <p className="font-mono text-[10.5px] sm:text-[11px] text-slate-200">
                      {typedPrompt}
                      {phase === "prompt_typing" && (
                        <span className="inline-block w-1.5 h-3 sm:h-3.5 ml-1 bg-emerald-400 align-middle animate-pulse" />
                      )}
                    </p>
                  </div>
                </motion.div>

                {/* AI / Engine Generating Code Bubble */}
                {(phase === "ai_generating" || phase === "live_ready") && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-1.5 sm:gap-2 w-full"
                  >
                    <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0 rounded-xl bg-[#090D16] border border-[#333333]/90 shadow-md overflow-hidden">
                      {/* Code Block Tab Header */}
                      <div className="flex items-center justify-between px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#0e1320] border-b border-[#333333] text-[9.5px] sm:text-[10px] font-mono text-slate-400">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <FileCode className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                          <span className="font-semibold text-white">{currentFlow.mainFile}</span>
                        </div>
                        <span className="text-[8.5px] sm:text-[9px] text-slate-400">Reactive Spring WebFlux</span>
                      </div>

                      {/* Real-Time Synthesized Code Lines */}
                      <div className="p-2 sm:p-2.5 font-mono text-[9px] sm:text-[9.5px] leading-snug sm:leading-relaxed overflow-x-auto space-y-0.5 bg-[#1e1e1e]">
                        {currentFlow.codeLines.slice(0, streamIndex).map((line) => (
                          <div key={line.num} className="flex items-baseline">
                            <span className="w-4 sm:w-5 shrink-0 text-slate-600 select-none text-[8px] sm:text-[8.5px]">
                              {line.num}
                            </span>
                            <div className="flex-1 whitespace-pre">
                              {line.tokens.map((token, tIdx) => (
                                <span key={tIdx} className={token.color}>
                                  {token.text}
                                </span>
                              ))}
                              {line.num === streamIndex && phase === "ai_generating" && (
                                <span className="inline-block w-1.5 h-3 ml-1 bg-emerald-400 align-middle animate-pulse" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Code Block Footer: DevOps Execution & Deployment Telemetry - ZERO GREEN DOT */}
                      <div className="flex items-center justify-between px-2.5 sm:px-3 py-1 bg-[#0c101a] border-t border-[#333333]/80 text-[9px] sm:text-[9.5px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <Terminal className="w-3 h-3 text-emerald-400" />
                          <span>Topic: {currentFlow.topic}</span>
                        </span>
                        {streamIndex >= currentFlow.codeLines.length && (
                          <span className="text-slate-400 font-mono text-[9px] sm:text-[9.5px]">
                            Compiled in 0.74s
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Bottom Input Simulation Bar */}
              <div className="pt-1.5 sm:pt-2 border-t border-[#333333]/80 shrink-0">
                <div className="flex items-center justify-between px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#252526]/90 border border-[#333333] text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                    <span className="text-slate-500 font-mono text-[9.5px] sm:text-[10px]">Active Spec:</span>
                    <span className="text-slate-300 font-mono text-[10px] sm:text-[10.5px] truncate font-medium">
                      {currentFlow.name}
                    </span>
                  </div>
                  <div
                    className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      phase === "prompt_typing"
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : phase === "prompt_moving_up"
                        ? "bg-blue-500 text-white scale-95"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    <Send className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: Live Payment Sandbox (Clean White Theme)     */}
        {/* ========================================================= */}
        <div
          className={`${
            mobileView === "preview" ? "flex" : "hidden"
          } md:flex md:col-span-6 flex-col bg-[#F8FAFC] p-2.5 sm:p-3 text-slate-800 justify-between min-h-0`}
        >
          {/* Sandbox Header */}
          <div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b border-slate-200/80 shrink-0 gap-2">
            <span className="text-[11px] sm:text-xs font-semibold tracking-tight text-slate-900 truncate">
              <span className="hidden sm:inline">Live Gateway </span>Preview
            </span>

            {/* View Switcher Tabs */}
            <div className="flex gap-1 bg-slate-200/70 p-0.5 rounded-lg border border-slate-200 text-[9.5px] sm:text-[10px] shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("app")}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md transition-all cursor-pointer ${
                  activeTab === "app"
                    ? "bg-white text-slate-900 font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="hidden sm:inline">Gateway </span>Preview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("telemetry")}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md transition-all cursor-pointer ${
                  activeTab === "telemetry"
                    ? "bg-white text-slate-900 font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Telemetry
              </button>
            </div>
          </div>

          {/* Sandbox Content Area */}
          <div className="flex-1 py-1.5 sm:py-2 flex flex-col justify-center min-h-0 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === "app" ? (
                phase === "ide_view" ||
                phase === "cursor_moving" ||
                phase === "typing_mvn" ||
                phase === "booting_spring" ||
                phase === "prompt_typing" ||
                phase === "prompt_moving_up" ? (
                  <motion.div
                    key="pre-generation-standby"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="flex-1 rounded-xl bg-white border border-slate-200/90 shadow-2xs p-2.5 sm:p-3 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Background subtle blueprint grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                    {/* Standby Header Strip */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 sm:pb-2 relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                        </div>
                        <div>
                          <div className="text-[11px] sm:text-xs font-semibold text-slate-900">Sandbox Environment</div>
                          <div className="text-[9px] sm:text-[9.5px] text-slate-400 font-mono">Live Payment Preview Engine</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>
                          {phase === "ide_view" && "System Standby"}
                          {phase === "cursor_moving" && "Terminal Routing"}
                          {phase === "typing_mvn" && "Maven Executing"}
                          {phase === "booting_spring" && "Booting OpenJDK 21"}
                          {phase === "prompt_typing" && "Awaiting Transaction Spec"}
                          {phase === "prompt_moving_up" && "Triggering Gateway Pipeline"}
                        </span>
                      </div>
                    </div>

                    {/* Center Ambient Orchestration Animation */}
                    <div className="flex-1 flex flex-col items-center justify-center py-2 sm:py-3.5 text-center relative z-10">
                      <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-blue-500/10 blur-2xl pointer-events-none" />

                      <div className="relative mb-2 sm:mb-2.5">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/90 border border-slate-200/90 shadow-sm flex items-center justify-center">
                          {phase === "booting_spring" ? (
                            <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 animate-spin" style={{ animationDuration: "5s" }} />
                          ) : phase === "prompt_typing" || phase === "prompt_moving_up" ? (
                            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 animate-pulse" />
                          ) : (
                            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
                          )}
                        </div>
                        
                      </div>

                      <div className="text-[11.5px] sm:text-xs font-semibold text-slate-900 tracking-tight">
                        {phase === "prompt_typing" || phase === "prompt_moving_up"
                          ? "Awaiting Payment Routing Specification"
                          : phase === "booting_spring"
                          ? "Spinning Up Spring WebFlux Gateway Engine"
                          : "Gateway Standby • Ready to Process"}
                      </div>
                      <div className="text-[9.5px] sm:text-[10px] text-slate-500 font-sans max-w-[280px] mt-1 leading-relaxed">
                        {phase === "prompt_typing"
                          ? "Submit payment orchestration parameters to execute dual-bank settlement & hot-reload preview."
                          : phase === "booting_spring"
                          ? "Connecting to Apache Kafka cluster (topics: txn.initiated, txn.settled) and OpenJDK 21 LTS."
                          : "Execute ./mvnw spring-boot:run to activate high-throughput reactive payment gateway."}
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="w-44 sm:w-48 h-1.5 bg-slate-100 rounded-full mt-2 sm:mt-2.5 overflow-hidden border border-slate-200/60">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          initial={{ width: "20%" }}
                          animate={
                            phase === "prompt_typing"
                              ? { width: "70%" }
                              : phase === "prompt_moving_up"
                              ? { width: "95%" }
                              : phase === "booting_spring"
                              ? { width: "45%" }
                              : { width: "15%" }
                          }
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Bottom Telemetry Strip */}
                    <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-slate-100 text-[9px] sm:text-[9.5px] font-mono text-slate-500 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">PIPELINE:</span>
                        <span className="text-slate-700 font-medium">REACTIVE WEBFLUX</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>KAFKA: READY</span>
                        <span className="text-emerald-600 font-semibold">HOT-RELOAD</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${currentFlow.id}-live`}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-2 sm:gap-2.5 h-full justify-between"
                  >
                    {/* FLOW 1: RAZORPAY CHECKOUT & IDEMPOTENT SETTLEMENT */}
                    {currentFlow.id === "razorpay_checkout" && (
                      <div className="flex-1 rounded-xl bg-white border border-slate-200/90 shadow-2xs p-2.5 sm:p-3 flex flex-col justify-between">
                        {/* Razorpay Brand Strip */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 sm:pb-2 gap-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                              <CreditCard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11px] sm:text-xs font-semibold text-slate-900 truncate">
                                <span className="hidden sm:inline">Razorpay </span>Checkout Session
                              </div>
                              <div className="text-[9px] sm:text-[9.5px] text-slate-400 font-mono truncate">order_9f82ac • $149.00 USD</div>
                            </div>
                          </div>
                          <span className="text-[9.5px] sm:text-[10.5px] font-mono font-medium text-emerald-700 shrink-0">
                            {paymentStatus === "settled" ? "Settled (146ms)" : "Processing..."}
                          </span>
                        </div>

                        {/* Interactive Credit Card + Idempotent Badge */}
                        <div className="grid grid-cols-12 gap-2 sm:gap-2.5 py-1.5 sm:py-2 items-center">
                          <div className="col-span-7 p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-[#333333] shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between text-slate-400 text-[9.5px] sm:text-[10px] mb-1 sm:mb-2 font-mono">
                              <span className="text-emerald-400 font-semibold tracking-wider">AES-256 GCM</span>
                              <span className="text-slate-400">VISA DEBIT</span>
                            </div>
                            <div className="text-xs sm:text-sm font-mono tracking-widest text-slate-200 mb-1 sm:mb-2">
                              •••• •••• •••• 4242
                            </div>
                            <div className="flex items-center justify-between text-[8.5px] sm:text-[9px] font-mono text-slate-400">
                              <span>EXP: 12/28</span>
                              <span className="text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-500/20">
                                IDEMPOTENT
                              </span>
                            </div>
                          </div>

                          <div className="col-span-5 flex flex-col gap-1 sm:gap-1.5 text-[9px] sm:text-[9.5px] font-mono">
                            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                              <div className="text-[8px] sm:text-[8.5px] text-emerald-600 font-semibold">SETTLEMENT SLA</div>
                              <div className="text-[11px] sm:text-xs font-bold text-emerald-700">100% Guaranteed</div>
                            </div>
                            <div className="p-1.5 sm:p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                              <div className="text-[8px] sm:text-[8.5px] text-slate-400 font-semibold">IDEMPOTENCY KEY</div>
                              <div className="text-[8.5px] sm:text-[9px] truncate font-medium text-slate-700">idemp_4b9a10fc</div>
                            </div>
                          </div>
                        </div>

                        {/* 4-Step Distributed Trace Strip */}
                        <div className="grid grid-cols-4 gap-1 sm:gap-1.5 pt-1.5 sm:pt-2 border-t border-slate-100 text-[8px] sm:text-[9px] font-mono">
                          {[
                            { name: "/charges", fullName: "POST /charges", time: "0ms" },
                            { name: "Kafka Bus", fullName: "Kafka Bus", time: "38ms" },
                            { name: "Circuit", fullName: "Circuit Breaker", time: "82ms" },
                            { name: "AES-256", fullName: "AES-256 Hook", time: "146ms" },
                          ].map((step, sIdx) => {
                            const isDone = traceStep > sIdx;
                            return (
                              <div
                                key={step.name}
                                className={`p-1 rounded border text-center transition-all ${
                                  isDone
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-medium"
                                    : "bg-slate-50 border-slate-200/70 text-slate-400"
                                }`}
                              >
                                <div className="truncate font-semibold">
                                  <span className="hidden sm:inline">{step.fullName}</span>
                                  <span className="sm:hidden">{step.name}</span>
                                </div>
                                <div className="text-[7.5px] sm:text-[8px] opacity-80">{step.time}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* FLOW 2: DUAL-BANK FAILOVER & WEBHOOK DISPATCH */}
                    {currentFlow.id === "circuit_breaker" && (
                      <div className="flex-1 rounded-xl bg-white border border-slate-200/90 shadow-2xs p-2.5 sm:p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 sm:pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                            <div>
                              <div className="text-[11px] sm:text-xs font-semibold text-slate-900">Resilience4j Dual-Bank Routing</div>
                              <div className="text-[9px] sm:text-[9.5px] text-slate-400 font-mono">Zero-Drop Failover Engine</div>
                            </div>
                          </div>
                          <span className="text-[9.5px] sm:text-[10px] font-mono font-medium text-slate-500">
                            {bankRoutingStage === 0 && "Primary Bank: Latency Spike"}
                            {bankRoutingStage === 1 && "Breaker Tripped → Failover"}
                            {bankRoutingStage === 2 && "Backup Bank: Succeeded in 42ms"}
                          </span>
                        </div>

                        {/* Dual-Bank Status Monitor Cards */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 py-1.5 sm:py-2">
                          <div className={`p-2 sm:p-2.5 rounded-lg border transition-all ${
                            bankRoutingStage > 0
                              ? "bg-amber-50/60 border-amber-200 text-amber-900"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}>
                            <div className="flex items-center justify-between text-[9px] sm:text-[9.5px] font-mono mb-1">
                              <span className="font-semibold">HDFC Bank Route</span>
                              <span className="text-[8px] sm:text-[8.5px] px-1 py-0.2 rounded bg-white border">Primary</span>
                            </div>
                            <div className="text-[11px] sm:text-xs font-bold text-slate-900">
                              {bankRoutingStage > 0 ? "CIRCUIT OPEN (Tripped)" : "Latency > 650ms"}
                            </div>
                            <div className="text-[8.5px] sm:text-[9px] text-slate-500 font-mono mt-0.5 sm:mt-1">
                              Auto-isolated by Resilience4j
                            </div>
                          </div>

                          <div className="p-2 sm:p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900">
                            <div className="flex items-center justify-between text-[9px] sm:text-[9.5px] font-mono mb-1">
                              <span className="font-semibold">Axis Bank Route</span>
                              <span className="text-[8px] sm:text-[8.5px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-medium">Backup</span>
                            </div>
                            <div className="text-[11px] sm:text-xs font-bold text-emerald-700">
                              CLOSED (Active • 42ms)
                            </div>
                            <div className="text-[8.5px] sm:text-[9px] text-emerald-600 font-mono mt-0.5 sm:mt-1">
                              100% Traffic routed safely
                            </div>
                          </div>
                        </div>

                        {/* Webhook HMAC Signature Dispatch Strip */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[9.5px] sm:text-[10px] text-slate-500 font-mono">
                          <span className="truncate">HMAC-SHA256: 8a4c10ef92a... verified</span>
                          <span className="text-emerald-600 font-medium shrink-0 ml-2">Webhook 200 OK</span>
                        </div>
                      </div>
                    )}

                    {/* Real-Time Live Activity Feed Strip */}
                    <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white border border-slate-200/90 shadow-2xs text-[9.5px] sm:text-[10px] font-mono">
                      <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                        <Radio className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="text-slate-700 truncate">
                          Kafka Ledger: txn.initiated topic streaming active
                        </span>
                      </div>
                      <span className="text-emerald-700 font-semibold shrink-0">4,800 TPS</span>
                    </div>
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="telemetry"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-2 gap-2 sm:gap-2.5 h-full content-center"
                >
                  <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-[9.5px] sm:text-[10px] mb-0.5">
                      <span>Gateway Throughput</span>
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-slate-900 font-mono">
                      4,800 TPS
                    </span>
                    <span className="text-[8.5px] sm:text-[9px] text-emerald-600 font-mono block mt-0.5 font-medium">
                      0 dropped transactions
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-[9.5px] sm:text-[10px] mb-0.5">
                      <span>p99 Settle Latency</span>
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-blue-600 font-mono">146ms</span>
                    <span className="text-[8.5px] sm:text-[9px] text-slate-500 font-mono block mt-0.5">
                      WebFlux Reactive I/O
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-[9.5px] sm:text-[10px] mb-0.5">
                      <span>Circuit Breaker SLA</span>
                      <Cpu className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-slate-900 font-mono">
                      99.999%
                    </span>
                    <span className="text-[8.5px] sm:text-[9px] text-slate-500 font-mono block mt-0.5">
                      Multi-Bank Fallback Active
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-[9.5px] sm:text-[10px] mb-0.5">
                      <span>Idempotency Cache</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-emerald-600 font-mono">
                      Zero Duplicates
                    </span>
                    <span className="text-[8.5px] sm:text-[9px] text-slate-500 font-mono block mt-0.5">
                      Redis Distributed Locks
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


        </div>
      </div>
    </div>
  );
}

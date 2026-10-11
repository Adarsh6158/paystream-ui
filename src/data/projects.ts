export interface Project {
  id: string;
  aliases: string[];
  name: string;
  category: string;
  tagline: string;
  description: string;
  liveUrl: string;
  githubUrl: string;
  architectureUrl: string;
  technologies: string[];
  highlights: string[];
  accentColor: "blue" | "emerald";
}

export const PROJECTS: Project[] = [
  {
    id: "paystream",
    aliases: ["paystream-ui", "payment-gateway", "razorpay"],
    name: "PayStream",
    category: "Distributed Payment Platform",
    tagline: "High-Throughput Payment Gateway & Distributed Settlement Engine",
    description:
      "Enterprise-grade payment gateway architecture featuring reactive Spring WebFlux pipelines, Apache Kafka event-driven ledgering, Redis distributed locks, Resilience4j circuit breakers, and AES-256 encrypted webhook delivery.",
    liveUrl: "https://paystream.adarshcodes.com",
    githubUrl: "https://github.com/Adarsh6158/Distributed-Payment-Gateway-Platform",
    architectureUrl: "https://adarshcodes.com/#project=paystream",
    technologies: [
      "Spring Boot",
      "Spring WebFlux",
      "Apache Kafka",
      "Redis",
      "PostgreSQL",
      "Resilience4j",
      "React 19",
      "TypeScript",
    ],
    highlights: [
      "Sub-200ms reactive payment settlement pipeline",
      "Idempotent distributed transactions with Redis locks",
      "Dual-bank failover routing with Resilience4j circuit breakers",
      "HMAC-SHA256 signed webhook dispatching engine",
    ],
    accentColor: "emerald",
  },
];

export function getProjectById(slug: string): Project | undefined {
  const normalized = slug.toLowerCase().trim();
  return PROJECTS.find(
    (p) => p.id === normalized || p.aliases.includes(normalized)
  );
}

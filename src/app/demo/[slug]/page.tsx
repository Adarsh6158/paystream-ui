import { DemoClient } from "@/components/DemoClient";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [
    { slug: "paystream" },
    { slug: "pastestream" },
    { slug: "payment-gateway" },
  ];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "PayStream | Payment Gateway Interactive Sandbox",
    description: "Hands-on interactive sandbox testing PayStream payment gateway, dual-bank failover, Redis idempotency, and Kafka ledger.",
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  return <DemoClient slug={resolved.slug} />;
}

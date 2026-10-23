import { DemoClient } from "@/components/DemoClient";
import { PROJECTS, getProjectById } from "@/data/projects";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [
    { slug: "paystream" },
    { slug: "pastestream" },
    { slug: "payment-gateway" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectById(slug) || PROJECTS[0];
  return {
    title: {
      absolute: project.name,
    },
    description: `Experience the live interactive application for ${project.name}: ${project.tagline}.`,
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <DemoClient slug={slug} />;
}

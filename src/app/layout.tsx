import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0F172A",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

const SITE_URL = "https://paystream.adarshcodes.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PayStream | Adarsh Kumar",
    template: "%s | PayStream",
  },
  description:
    "Enterprise-grade distributed payment gateway and settlement engine featuring reactive Spring WebFlux pipelines, Apache Kafka event-driven ledgering, Redis locks, Resilience4j circuit breakers, and AES-256 encrypted webhooks.",
  applicationName: "PayStream",
  authors: [{ name: "Adarsh Kumar", url: "https://adarshcodes.com" }],
  generator: "Next.js",
  keywords: [
    "Adarsh Kumar",
    "PayStream",
    "Payment Gateway",
    "Razorpay Clone",
    "Spring Boot",
    "Spring WebFlux",
    "Apache Kafka",
    "Redis",
    "Resilience4j",
    "Distributed Systems",
    "Fintech Engineering",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Adarsh Kumar",
  publisher: "Adarsh Kumar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "PayStream | Adarsh Kumar",
    description:
      "Enterprise-grade distributed payment gateway and settlement engine featuring reactive Spring WebFlux pipelines and Kafka event ledgering.",
    siteName: "PayStream",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "PayStream",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PayStream",
    description:
      "Enterprise payment gateway architecture with Spring WebFlux, Kafka ledgering, and Resilience4j circuit breakers.",
    creator: "@adarshmall",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "finance",
  classification: "Financial Technology / Payment Gateway / Developer Platform",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "PayStream",
      description:
        "High-Throughput Payment Gateway & Distributed Settlement Engine by Adarsh Kumar",
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "PayStream",
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      description:
        "Enterprise-grade distributed payment gateway and settlement engine featuring reactive Spring WebFlux pipelines, Apache Kafka event-driven ledgering, Redis locks, and Resilience4j circuit breakers.",
      author: {
        "@type": "Person",
        name: "Adarsh Kumar",
        url: "https://adarshcodes.com",
        sameAs: [
          "https://github.com/Adarsh6158",
          "https://linkedin.com/in/adarshmall",
          "https://leetcode.com/u/AdarshMall/",
          "https://medium.com/@adarshkumar11",
        ],
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "Person",
      "@id": "https://adarshcodes.com/#person",
      name: "Adarsh Kumar",
      jobTitle: "Software Engineer",
      url: "https://adarshcodes.com",
      sameAs: [
        "https://github.com/Adarsh6158",
        "https://linkedin.com/in/adarshmall",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}

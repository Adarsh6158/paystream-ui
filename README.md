<h1 align="center">PayStream</h1>

<p align="center">
  High-Throughput Distributed Payment Gateway & Event-Driven Settlement Engine
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Distributed%20Gateway-blue" alt="Architecture" />
  <img src="https://img.shields.io/badge/Backend-Spring%20Boot%203.3-green" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Reactive-Spring%20WebFlux-007ACC" alt="Spring WebFlux" />
  <img src="https://img.shields.io/badge/Event%20Driven-Apache%20Kafka-red" alt="Kafka" />
  <img src="https://img.shields.io/badge/Cache-Redis%20Idempotency-DC382D" alt="Redis" />
  <img src="https://img.shields.io/badge/Resilience-Resilience4j%20Circuit%20Breaker-orange" alt="Resilience4j" />
  <img src="https://img.shields.io/badge/Frontend-Next.js%2016%20%7C%20React%2019-black" alt="Next.js" />
</p>

---

## Overview

**PayStream** is an enterprise-grade distributed payment gateway and settlement engine modeled after modern fintech infrastructure (Razorpay / Stripe). It features non-blocking reactive I/O, idempotent transaction settlement with distributed locks, dual-bank circuit breaker routing, and cryptographic HMAC-SHA256 webhook delivery.

## System Architecture

- **Interface**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Geist typography
- **Backend Platform**: Spring Boot 3.3.4, Spring WebFlux, Apache Kafka, Redis Cluster, PostgreSQL
- **Resilience & Security**: Resilience4j circuit breakers, AES-256 GCM card tokenization, HMAC webhook signatures
- **Telemetry**: Real-time Kafka event streaming, dual-bank failover monitor, interactive payment lifecycle trace

## 🌐 Live Environments

- **Showcase**: [paystream.adarshcodes.com](https://paystream.adarshcodes.com)
- **Architecture Specs**: [adarshcodes.com/#project=paystream](https://adarshcodes.com/#project=paystream)
- **Engine Repository**: [github.com/Adarsh6158/Distributed-Payment-Gateway-Platform](https://github.com/Adarsh6158/Distributed-Payment-Gateway-Platform)

---

<p align="center">
  &copy; 2026 Adarsh Kumar &nbsp;&bull;&nbsp; <a href="https://adarshcodes.com">adarshcodes.com</a>
</p>

---
title: "MCP is not a protocol — it is the missing infrastructure layer for AI agents"
slug: model-context-protocol-infrastructure
category: AI Systems
date: "2026-05-18"
readTime: "8 min read"
featured: true
excerpt: "The Model Context Protocol turns tool integration from a bespoke wiring problem into a standardised infrastructure layer. This changes the economics of agentic AI."
theme: "When every AI agent speaks a different language to every tool, integration becomes the bottleneck. MCP is the USB-C moment for agentic systems."
---

If you have built more than one agentic AI system, you have felt the pain: every new tool integration is a bespoke adapter. Every agent framework has its own way of describing capabilities, invoking functions, and handling context. The result is an industry that spends more engineering time on plumbing than on intelligence.

### What MCP actually solves

The Model Context Protocol, originally introduced by Anthropic and now gaining broad adoption, standardises the interface between AI models and external tools, data sources, and services. Think of it as the USB-C moment for agentic systems — a single protocol that replaces dozens of proprietary connectors.

The key insight is separation of concerns:

- **MCP Servers** expose capabilities — tools, resources, prompts — through a standard JSON-RPC interface

- **MCP Clients** (the AI agent/host) discover and invoke those capabilities without knowing implementation details

- **Transport is decoupled** — stdio for local tools, HTTP+SSE for remote services, same protocol either way

### Why this matters architecturally

Before MCP, integrating a new tool into an agent meant: writing a custom function schema, building serialisation logic, handling errors in a tool-specific way, and maintaining that adapter as both sides evolve. Multiply this by every tool in your stack and you have a combinatorial maintenance burden.

With MCP, the integration surface collapses to a single protocol. An agent that speaks MCP can discover and use any MCP server without custom code. This has three architectural consequences:

1. **Composability at scale.** Teams can publish internal services as MCP servers and any agent in the organisation can use them instantly.

2. **Trust boundaries become explicit.** MCP's capability negotiation means you can expose exactly what a given agent should access — no more, no less.

3. **The tool ecosystem becomes shared infrastructure.** Build an MCP server for your database once, and every AI tool in your stack benefits.

### The production patterns emerging

In production deployments I am seeing three patterns crystallise:

#### Pattern 1: Gateway MCP servers

A single MCP server that proxies multiple internal services, handling auth, rate limiting, and audit logging in one place. The agent sees a unified tool surface; the gateway enforces policy.

#### Pattern 2: Capability registries

Organisations running dozens of MCP servers use a registry service that agents query to discover available capabilities dynamically. This is service discovery for AI tools.

#### Pattern 3: Sandboxed execution environments

MCP servers that run tools inside containers or VMs, giving agents powerful capabilities (code execution, file system access) without risking the host environment.

### What I am building with MCP

My current work involves designing MCP-native architectures where the protocol is not an afterthought but the primary integration pattern. The shift from "agent calls function" to "agent discovers and negotiates capability" changes how you think about system boundaries, permission models, and the lifecycle of AI-powered features.

MCP is still early. The spec is evolving, tooling is maturing, and best practices are forming in real-time. But the direction is clear: agentic AI needs a standard integration layer, and MCP is the most credible candidate we have.

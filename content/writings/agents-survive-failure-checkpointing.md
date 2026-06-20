---
title: "Agents That Survive Failure"
slug: agents-survive-failure-checkpointing
category: AI Systems
tags: ["AI Systems", "Architecture"]
date: "2026-06-20"
readTime: "19 min read"
featured: true
excerpt: "Most agentic systems are stateless by accident. When they fail mid-execution — and they will — everything is lost. Checkpointing, state capsules, and resumability are the engineering disciplines that change this. Here is how to build agents that survive failure."
theme: "An agent that cannot survive failure is not a production system — it is an expensive demo. State capsules and resumability transforms agents from fragile one-shot executors into durable, fault-tolerant workers that resume from exactly where they fell."
---

Every agentic system I have seen fail in production fails the same way. Not because the LLM made a bad decision, not because a tool returned an unexpected result, but because the agent had been running for four minutes, had completed twelve of its fifteen steps, and then a network timeout killed the process. Restarting meant starting from zero. The team called it a retry. What it actually was was a confession that the system had no memory of its own work.

This is the **statefulness problem** — the most consequential and least discussed failure mode in production agentic AI. We spend enormous energy making agents smarter, faster, cheaper. We spend almost none making them durable.

The engineering disciplines that solve this — checkpointing, state capsules, and resumability — are borrowed from distributed systems and adapted for the unique challenges of LLM-driven workflows. They are not exotic. They are table stakes for any agent that runs longer than a single API call, touches more than one external system, or operates in an environment where partial failure is not a theoretical edge case.

It is not a theoretical edge case. It is Tuesday.

## Why Agents Are Stateless by Default

The root cause is architectural. Most agentic frameworks are built around a request-response model. A user sends a message. The agent produces a response. The session ends. This model is inherited from the LLM inference API itself — every call to the model is independent. State is maintained, if at all, by passing the full conversation history in the context window on each call.

This works for chat. It fails catastrophically for long-running tasks.

A long-running agent is not a chat session. It is a workflow — a sequence of decisions and actions that collectively accomplish a goal over minutes or hours. When such a workflow fails at step 12 of 15, the naive recovery strategy is to restart at step 1. This is not just inefficient. It is dangerous. Some steps are not idempotent. If step 3 was "send a confirmation email" or "charge the customer's card" or "provision the infrastructure," restarting from zero does not undo those actions. It repeats them.

<div style="margin: 2.5rem auto; max-width: 680px; font-family: monospace;">
<div style="background: rgba(10,10,14,0.98); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden;">
<div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.55rem 1rem; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.06);">
<div style="width: 10px; height: 10px; border-radius: 50%; background: #ff5f57;"></div>
<div style="width: 10px; height: 10px; border-radius: 50%; background: #febc2e;"></div>
<div style="width: 10px; height: 10px; border-radius: 50%; background: #28c840;"></div>
<div style="margin-left: 0.5rem; font-size: 0.58rem; color: rgba(255,255,255,0.3);">task_order_42817 — execution trace</div>
</div>
<div style="padding: 1.1rem 1.2rem; font-size: 0.62rem; line-height: 2; color: rgba(255,255,255,0.6);">
<div><span style="color: rgba(255,255,255,0.25);">14:28:33.104</span>  <span style="color: rgba(123,158,212,0.8);">FETCH   </span>  customer order history               <span style="color: #28c840;">✓</span>  <span style="color: rgba(255,255,255,0.25);">124ms</span></div>
<div><span style="color: rgba(255,255,255,0.25);">14:28:34.231</span>  <span style="color: rgba(123,158,212,0.8);">INFER   </span>  classify order intent (LLM)          <span style="color: #28c840;">✓</span>  <span style="color: rgba(255,255,255,0.25);">1.2s</span></div>
<div><span style="color: rgba(255,255,255,0.25);">14:28:35.444</span>  <span style="color: rgba(254,188,46,0.9);">EMIT    </span>  send confirmation email              <span style="color: #28c840;">✓</span>  <span style="color: rgba(255,255,255,0.25);">82ms</span>  <span style="color: rgba(254,188,46,0.6);">← side-effect</span></div>
<div><span style="color: rgba(255,255,255,0.25);">14:28:35.528</span>  <span style="color: rgba(123,158,212,0.8);">VERIFY  </span>  inventory check × 3 SKUs            <span style="color: #28c840;">✓</span>  <span style="color: rgba(255,255,255,0.25);">340ms</span></div>
<div><span style="color: rgba(255,255,255,0.25);">14:28:36.012  </span><span style="color: rgba(123,158,212,0.8);">WRITE   </span>  create ERP record                    <span style="color: #28c840;">✓</span>  <span style="color: rgba(255,255,255,0.25);">217ms</span>  <span style="color: rgba(254,188,46,0.6);">← side-effect</span></div>
<div style="color: rgba(255,255,255,0.2);">14:28:36–14:32:45  ···  steps 6–11 completed</div>
<div><span style="color: rgba(255,255,255,0.25);">14:32:46.003</span>  <span style="color: rgba(123,158,212,0.8);">CALL    </span>  payment processor API  <span style="color: rgba(255,255,255,0.25);">·············</span></div>
<div style="margin: 0.3rem 0; padding: 0.5rem 0.7rem; background: rgba(255,95,87,0.08); border-left: 2px solid #ff5f57;">
<span style="color: #ff5f57;">✗ ETIMEDOUT</span><span style="color: rgba(255,255,255,0.4);">  after 30.0s  ·  process killed  ·  PID 23841 exit 1</span>
</div>
<div style="margin-top: 0.8rem; padding-top: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05);">
<div style="color: rgba(255,95,87,0.7); margin-bottom: 0.3rem;">without checkpointing</div>
<div style="color: rgba(255,255,255,0.35);">  → cold restart at 14:28:33  ·  11 steps re-executed</div>
<div style="color: rgba(254,188,46,0.6);">  → confirmation email sent again  ·  ERP record duplicated</div>
<div style="margin-top: 0.5rem; color: rgba(40,200,64,0.7);">with checkpointing</div>
<div style="color: rgba(255,255,255,0.35);">  → capsule loaded in 187ms  ·  resume at step 12</div>
<div style="color: rgba(40,200,64,0.5);">  → email: skip (ledger entry found)  ·  ERP: skip (ledger entry found)</div>
</div>
</div>
</div>
</div>

The problem is not just efficiency. It is correctness. A stateless agent in a world of non-idempotent operations is a liability.

## What Agent State Actually Contains

Before designing a checkpointing system, you need to be precise about what "agent state" contains. This is not obvious. Agents are not simple state machines with a single integer counter. Their state is a composite of at least four distinct layers, each with different persistence requirements and different semantics on recovery.

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: rgba(10,10,14,0.97); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden;">
<div style="padding: 0.65rem 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.25); font-family: 'DM Sans', sans-serif;">agent state — four layers</div>
<div style="padding: 1.2rem 1.1rem; display: flex; flex-direction: column; gap: 0.5rem;">
<div style="display: grid; grid-template-columns: 24px 1fr 3fr 80px; gap: 0.75rem; align-items: baseline;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.2); font-family: monospace; text-align: right;">L1</div>
<div style="font-family: monospace; font-size: 0.6rem; font-weight: 700; color: #d4b896; letter-spacing: 0.04em;">EXECUTION</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5); line-height: 1.6; font-family: 'DM Sans', sans-serif;">current step index · plan structure · step outputs · pending queue</div>
<div style="font-size: 0.55rem; color: rgba(212,184,150,0.5); font-family: monospace; text-align: right; white-space: nowrap;">must persist</div>
</div>
<div style="height: 1px; background: rgba(255,255,255,0.04); margin: 0.1rem 0;"></div>
<div style="display: grid; grid-template-columns: 24px 1fr 3fr 80px; gap: 0.75rem; align-items: baseline;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.2); font-family: monospace; text-align: right;">L2</div>
<div style="font-family: monospace; font-size: 0.6rem; font-weight: 700; color: #7b9ed4; letter-spacing: 0.04em;">MESSAGES</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5); line-height: 1.6; font-family: 'DM Sans', sans-serif;">full message history · tool call records · model responses · token counts</div>
<div style="font-size: 0.55rem; color: rgba(123,158,212,0.5); font-family: monospace; text-align: right; white-space: nowrap;">costly to rebuild</div>
</div>
<div style="height: 1px; background: rgba(255,255,255,0.04); margin: 0.1rem 0;"></div>
<div style="display: grid; grid-template-columns: 24px 1fr 3fr 80px; gap: 0.75rem; align-items: baseline;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.2); font-family: monospace; text-align: right;">L3</div>
<div style="font-family: monospace; font-size: 0.6rem; font-weight: 700; color: #28c840; letter-spacing: 0.04em;">LEDGER</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5); line-height: 1.6; font-family: 'DM Sans', sans-serif;">every external mutation: emails sent · APIs called · records written · files created</div>
<div style="font-size: 0.55rem; color: rgba(40,200,64,0.55); font-family: monospace; text-align: right; white-space: nowrap;">safety-critical</div>
</div>
<div style="height: 1px; background: rgba(255,255,255,0.04); margin: 0.1rem 0;"></div>
<div style="display: grid; grid-template-columns: 24px 1fr 3fr 80px; gap: 0.75rem; align-items: baseline;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.2); font-family: monospace; text-align: right;">L4</div>
<div style="font-family: monospace; font-size: 0.6rem; font-weight: 700; color: #febc2e; letter-spacing: 0.04em;">CONTEXT</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5); line-height: 1.6; font-family: 'DM Sans', sans-serif;">fetched docs · resolved schemas · env vars · upstream data with TTL</div>
<div style="font-size: 0.55rem; color: rgba(254,188,46,0.5); font-family: monospace; text-align: right; white-space: nowrap;">may go stale</div>
</div>
</div>
<div style="padding: 0.6rem 1.1rem; border-top: 1px solid rgba(255,255,255,0.05); font-size: 0.57rem; color: rgba(255,255,255,0.2); font-family: 'DM Sans', sans-serif;">Most implementations persist L1+L2. The ones that skip L3 are the ones that send duplicate emails.</div>
</div>
</div>

The side effect ledger deserves special attention. Most checkpointing implementations focus on execution state and conversation history — they ignore the ledger. This is the mistake that causes duplicate emails and double-charged payments. Before any resumption logic runs, the first thing the system must check is: "What did this agent already do?" The ledger makes that question answerable.

## State Capsules

A **state capsule** is the structured artifact that captures agent state at a specific point in execution, sufficient to resume the agent from that point without re-running completed steps or repeating side effects.

The key word is *sufficient*. A state capsule is not a complete dump of everything. That is a backup. A capsule is the minimal representation that enables faithful resumption — designed to be small enough to write cheaply and frequently, but complete enough that resumption is correct.

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: rgba(15,15,20,0.95); border: 1.5px solid rgba(212,184,150,0.3); border-radius: 12px; overflow: hidden;">
<div style="padding: 0.7rem 1.2rem; background: linear-gradient(135deg, rgba(212,184,150,0.12), rgba(212,184,150,0.04)); border-bottom: 1px solid rgba(212,184,150,0.15);">
<div style="font-family: monospace; font-size: 0.65rem; font-weight: 700; color: #d4b896; letter-spacing: 0.05em;">ANATOMY OF A STATE CAPSULE</div>
</div>
<div style="padding: 1.2rem; font-family: monospace; font-size: 0.62rem; color: rgba(255,255,255,0.7); line-height: 1.8;">
<div style="color: rgba(212,184,150,0.6);">// capsule: state_capsule_v1</div>
<div>{</div>
<div style="padding-left: 1.2rem;"><span style="color: #7b9ed4;">"capsule_id"</span>: <span style="color: #28c840;">"cap_7f3a9b"</span>, <span style="color: rgba(255,255,255,0.3);">// globally unique, immutable</span></div>
<div style="padding-left: 1.2rem;"><span style="color: #7b9ed4;">"task_id"</span>: <span style="color: #28c840;">"task_order_42817"</span>,</div>
<div style="padding-left: 1.2rem;"><span style="color: #7b9ed4;">"created_at"</span>: <span style="color: #28c840;">"2026-06-20T14:33:07Z"</span>,</div>
<div style="padding-left: 1.2rem;"><span style="color: #7b9ed4;">"schema_version"</span>: <span style="color: #febc2e;">3</span>,</div>
<div style="margin-top: 0.4rem; padding-left: 1.2rem;"><span style="color: rgba(255,255,255,0.3);">// ── EXECUTION STATE ──────────────────────────────</span></div>
<div style="padding-left: 1.2rem;"><span style="color: #7b9ed4;">"plan"</span>: { <span style="color: rgba(255,255,255,0.5);">steps: [...], current_index: 11, total: 15</span> },</div>
<div style="padding-left: 1.2rem;"><span style="color: #7b9ed4;">"step_outputs"</span>: { <span style="color: rgba(255,255,255,0.5);">0: {...}, 1: {...}, ... 10: {...}</span> },</div>
<div style="margin-top: 0.4rem; padding-left: 1.2rem;"><span style="color: rgba(255,255,255,0.3);">// ── SIDE EFFECT LEDGER ───────────────────────────</span></div>
<div style="padding-left: 1.2rem;"><span style="color: #7b9ed4;">"effects"</span>: [</div>
<div style="padding-left: 2.4rem;">{ <span style="color: #febc2e;">"type"</span>: <span style="color: #28c840;">"email_sent"</span>, <span style="color: #febc2e;">"to"</span>: <span style="color: #28c840;">"customer@..."</span>, <span style="color: #febc2e;">"step"</span>: <span style="color: #febc2e;">2</span> },</div>
<div style="padding-left: 2.4rem;">{ <span style="color: #febc2e;">"type"</span>: <span style="color: #28c840;">"erp_record_created"</span>, <span style="color: #febc2e;">"id"</span>: <span style="color: #28c840;">"ERP-9921"</span>, <span style="color: #febc2e;">"step"</span>: <span style="color: #febc2e;">7</span> }</div>
<div style="padding-left: 1.2rem;">],</div>
<div style="margin-top: 0.4rem; padding-left: 1.2rem;"><span style="color: rgba(255,255,255,0.3);">// ── CONTEXT SNAPSHOT ─────────────────────────────</span></div>
<div style="padding-left: 1.2rem;"><span style="color: #7b9ed4;">"context"</span>: { <span style="color: rgba(255,255,255,0.5);">fetched_at: "...", data_hash: "sha256:...", ttl_s: 900</span> },</div>
<div style="margin-top: 0.4rem; padding-left: 1.2rem;"><span style="color: rgba(255,255,255,0.3);">// ── INTEGRITY ─────────────────────────────────────</span></div>
<div style="padding-left: 1.2rem;"><span style="color: #7b9ed4;">"checksum"</span>: <span style="color: #28c840;">"sha256:e3b0c44298..."</span></div>
<div>}</div>
</div>
</div>
</div>

Three design choices here are worth explaining explicitly.

**`schema_version`** — Capsules will outlive your code. When you deploy a new agent version, you will have capsules in storage written by the old version. The schema version field lets your resumption logic detect version mismatches and decide whether to upgrade the capsule, reject it, or restart the task. If you omit this field, you will regret it within three sprints.

**`data_hash` on context** — External data fetched at the start of a task can change. If a capsule contains a stale snapshot of a customer record that has since been updated, resuming from it may produce incorrect results. The hash lets you detect staleness on resumption and decide whether to re-fetch or proceed with the snapshot.

**`checksum` on the capsule itself** — Capsules stored in external systems can be corrupted. A checksum over the capsule body lets you detect corruption before attempting resumption, preventing the agent from operating on invalid state.

## When to Checkpoint

Knowing what to save is only half the problem. The other half is knowing when. Checkpoint granularity is a tradeoff between:

- **Recovery overhead**: coarser checkpoints mean more re-work on resumption
- **Write overhead**: finer checkpoints mean more storage I/O during execution
- **Semantic correctness**: some checkpointing boundaries are natural (after a tool call completes) while others are dangerous (inside an LLM reasoning step)

<div style="margin: 2.5rem auto; max-width: 680px; font-family: monospace;">
<div style="background: rgba(10,10,14,0.97); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden;">
<div style="padding: 0.65rem 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.25); font-family: 'DM Sans', sans-serif;">checkpoint timing — what boundaries are valid</div>
<div style="padding: 1.1rem 1.2rem; display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.6rem;">
<div style="display: grid; grid-template-columns: 18px 1fr 60px; gap: 0.75rem; align-items: baseline; padding: 0.45rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
<div style="color: #28c840; font-size: 0.65rem; text-align: center;">●</div>
<div><span style="color: rgba(255,255,255,0.75);">after every tool call</span>  <span style="color: rgba(255,255,255,0.3);">— tool calls carry side effects; record completion before proceeding</span></div>
<div style="color: #28c840; font-size: 0.55rem; white-space: nowrap; text-align: right;">always</div>
</div>
<div style="display: grid; grid-template-columns: 18px 1fr 60px; gap: 0.75rem; align-items: baseline; padding: 0.45rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
<div style="color: #28c840; font-size: 0.65rem; text-align: center;">●</div>
<div><span style="color: rgba(255,255,255,0.75);">after plan generation</span>  <span style="color: rgba(255,255,255,0.3);">— planning is expensive; a task in progress should never re-plan from scratch</span></div>
<div style="color: #28c840; font-size: 0.55rem; white-space: nowrap; text-align: right;">always</div>
</div>
<div style="display: grid; grid-template-columns: 18px 1fr 60px; gap: 0.75rem; align-items: baseline; padding: 0.45rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
<div style="color: #febc2e; font-size: 0.65rem; text-align: center;">◐</div>
<div><span style="color: rgba(255,255,255,0.75);">after LLM reasoning</span>  <span style="color: rgba(255,255,255,0.3);">— idempotent but costly; checkpoint when output exceeds ~2K tokens</span></div>
<div style="color: #febc2e; font-size: 0.55rem; white-space: nowrap; text-align: right;">if &gt; 2K tok</div>
</div>
<div style="display: grid; grid-template-columns: 18px 1fr 60px; gap: 0.75rem; align-items: baseline; padding: 0.45rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
<div style="color: #febc2e; font-size: 0.65rem; text-align: center;">◐</div>
<div><span style="color: rgba(255,255,255,0.75);">on elapsed time</span>  <span style="color: rgba(255,255,255,0.3);">— catches long-running steps that have no natural boundary</span></div>
<div style="color: #febc2e; font-size: 0.55rem; white-space: nowrap; text-align: right;">every 60s</div>
</div>
<div style="display: grid; grid-template-columns: 18px 1fr 60px; gap: 0.75rem; align-items: baseline; padding: 0.45rem 0;">
<div style="color: #ff5f57; font-size: 0.65rem; text-align: center;">○</div>
<div><span style="color: rgba(255,255,255,0.45);">inside LLM token generation</span>  <span style="color: rgba(255,255,255,0.25);">— generation is atomic; no valid partial output exists to serialize</span></div>
<div style="color: #ff5f57; font-size: 0.55rem; white-space: nowrap; text-align: right;">never</div>
</div>
</div>
</div>
</div>

The last row matters. You cannot checkpoint an LLM mid-generation. There is no valid "partially generated response" that you can resume. The unit of checkpointing must be at the boundary between agent steps — never inside one.

## The Resumption Decision

Detecting that a capsule exists is not the same as knowing what to do with it. When an agent restarts and finds a capsule, it must make a series of decisions before resuming execution.

<div style="margin: 2.5rem auto; max-width: 680px; font-family: monospace;">
<div style="background: rgba(10,10,14,0.97); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden;">
<div style="padding: 0.65rem 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.25); font-family: 'DM Sans', sans-serif;">ResumptionCoordinator — decision sequence</div>
<div style="padding: 1.2rem; display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.6rem;">
<div style="display: flex; align-items: stretch; gap: 0.75rem;">
<div style="display: flex; flex-direction: column; align-items: center; min-width: 18px;">
<div style="width: 18px; height: 18px; border-radius: 50%; background: rgba(212,184,150,0.15); border: 1px solid rgba(212,184,150,0.4); display: flex; align-items: center; justify-content: center; font-size: 0.5rem; color: #d4b896; flex-shrink: 0;">1</div>
<div style="width: 1px; flex: 1; background: rgba(255,255,255,0.06); margin: 2px 0;"></div>
</div>
<div style="padding-bottom: 0.8rem;">
<div style="color: rgba(255,255,255,0.65);">capsule found for <span style="color: #d4b896;">task_id</span></div>
<div style="margin-top: 0.2rem; color: rgba(255,255,255,0.28); font-size: 0.56rem; font-family: 'DM Sans', sans-serif;">load from store, deserialize</div>
</div>
</div>
<div style="display: flex; align-items: stretch; gap: 0.75rem;">
<div style="display: flex; flex-direction: column; align-items: center; min-width: 18px;">
<div style="width: 18px; height: 18px; border-radius: 50%; background: rgba(123,158,212,0.12); border: 1px solid rgba(123,158,212,0.35); display: flex; align-items: center; justify-content: center; font-size: 0.5rem; color: #7b9ed4; flex-shrink: 0;">2</div>
<div style="width: 1px; flex: 1; background: rgba(255,255,255,0.06); margin: 2px 0;"></div>
</div>
<div style="padding-bottom: 0.8rem; width: 100%;">
<div style="color: rgba(255,255,255,0.65);">verify <span style="color: #7b9ed4;">checksum</span></div>
<div style="margin-top: 0.35rem; display: flex; gap: 1rem;">
<div style="padding: 0.3rem 0.6rem; background: rgba(255,95,87,0.07); border: 1px solid rgba(255,95,87,0.2); border-radius: 4px; font-size: 0.56rem; color: #ff5f57;">corrupt → cold restart + alert</div>
<div style="padding: 0.3rem 0.6rem; background: rgba(40,200,64,0.06); border: 1px solid rgba(40,200,64,0.18); border-radius: 4px; font-size: 0.56rem; color: #28c840;">valid → continue</div>
</div>
</div>
</div>
<div style="display: flex; align-items: stretch; gap: 0.75rem;">
<div style="display: flex; flex-direction: column; align-items: center; min-width: 18px;">
<div style="width: 18px; height: 18px; border-radius: 50%; background: rgba(123,158,212,0.12); border: 1px solid rgba(123,158,212,0.35); display: flex; align-items: center; justify-content: center; font-size: 0.5rem; color: #7b9ed4; flex-shrink: 0;">3</div>
<div style="width: 1px; flex: 1; background: rgba(255,255,255,0.06); margin: 2px 0;"></div>
</div>
<div style="padding-bottom: 0.8rem; width: 100%;">
<div style="color: rgba(255,255,255,0.65);">check <span style="color: #7b9ed4;">schema_version</span></div>
<div style="margin-top: 0.35rem; display: flex; gap: 1rem;">
<div style="padding: 0.3rem 0.6rem; background: rgba(254,188,46,0.06); border: 1px solid rgba(254,188,46,0.2); border-radius: 4px; font-size: 0.56rem; color: #febc2e;">mismatch → migrate or cold restart</div>
<div style="padding: 0.3rem 0.6rem; background: rgba(40,200,64,0.06); border: 1px solid rgba(40,200,64,0.18); border-radius: 4px; font-size: 0.56rem; color: #28c840;">matches → continue</div>
</div>
</div>
</div>
<div style="display: flex; align-items: stretch; gap: 0.75rem;">
<div style="display: flex; flex-direction: column; align-items: center; min-width: 18px;">
<div style="width: 18px; height: 18px; border-radius: 50%; background: rgba(123,158,212,0.12); border: 1px solid rgba(123,158,212,0.35); display: flex; align-items: center; justify-content: center; font-size: 0.5rem; color: #7b9ed4; flex-shrink: 0;">4</div>
<div style="width: 1px; flex: 1; background: rgba(255,255,255,0.06); margin: 2px 0;"></div>
</div>
<div style="padding-bottom: 0.8rem; width: 100%;">
<div style="color: rgba(255,255,255,0.65);">check context <span style="color: #7b9ed4;">data_hash</span> + TTL</div>
<div style="margin-top: 0.35rem; display: flex; gap: 1rem;">
<div style="padding: 0.3rem 0.6rem; background: rgba(254,188,46,0.06); border: 1px solid rgba(254,188,46,0.2); border-radius: 4px; font-size: 0.56rem; color: #febc2e;">stale → re-fetch, update capsule</div>
<div style="padding: 0.3rem 0.6rem; background: rgba(40,200,64,0.06); border: 1px solid rgba(40,200,64,0.18); border-radius: 4px; font-size: 0.56rem; color: #28c840;">fresh → continue</div>
</div>
</div>
</div>
<div style="display: flex; align-items: stretch; gap: 0.75rem;">
<div style="display: flex; flex-direction: column; align-items: center; min-width: 18px;">
<div style="width: 18px; height: 18px; border-radius: 50%; background: rgba(40,200,64,0.12); border: 1px solid rgba(40,200,64,0.35); display: flex; align-items: center; justify-content: center; font-size: 0.5rem; color: #28c840; flex-shrink: 0;">5</div>
</div>
<div>
<div style="color: #28c840;">resume from checkpoint</div>
<div style="margin-top: 0.2rem; color: rgba(255,255,255,0.28); font-size: 0.56rem; font-family: 'DM Sans', sans-serif;">skip completed steps · skip recorded ledger effects · execute from current_index</div>
</div>
</div>
</div>
</div>
</div>

This decision tree should be implemented as a dedicated `ResumptionCoordinator` — a component separate from the agent's planning and execution logic. Mixing resumption decisions into execution logic is how teams end up with subtle correctness bugs: agents that resume from a valid capsule but then re-execute a side effect because the ledger check was in the wrong place.

## Before and After

The concrete difference checkpointing makes is best understood as a timeline comparison.

<div style="margin: 2.5rem auto; max-width: 680px; font-family: monospace;">
<div style="background: rgba(10,10,14,0.97); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden;">
<div style="padding: 0.65rem 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.25); font-family: 'DM Sans', sans-serif;">execution cost — 15-step task, failure at step 12</div>
<div style="padding: 1.2rem 1.2rem 0.8rem;">
<div style="margin-bottom: 1.1rem;">
<div style="font-size: 0.57rem; color: #ff5f57; letter-spacing: 0.06em; margin-bottom: 0.45rem;">STATELESS AGENT — two full passes</div>
<div style="position: relative; height: 26px; border-radius: 3px; overflow: hidden; display: flex; gap: 1px;">
<div style="flex: 11; background: rgba(40,200,64,0.18); border: 1px solid rgba(40,200,64,0.25); border-right: none; display: flex; align-items: center; padding: 0 0.5rem;">
<span style="font-size: 0.5rem; color: rgba(40,200,64,0.7);">steps 1–11</span>
</div>
<div style="flex: 1; background: rgba(255,95,87,0.25); border: 1px solid rgba(255,95,87,0.4); display: flex; align-items: center; justify-content: center;">
<span style="font-size: 0.48rem; color: #ff5f57;">✗</span>
</div>
<div style="flex: 11; background: rgba(40,200,64,0.07); border: 1px dashed rgba(40,200,64,0.18); border-left: none; border-right: none; display: flex; align-items: center; padding: 0 0.5rem;">
<span style="font-size: 0.5rem; color: rgba(255,255,255,0.2);">re-run 1–11 (wasted · side effects repeat)</span>
</div>
<div style="flex: 4; background: rgba(40,200,64,0.18); border: 1px solid rgba(40,200,64,0.25); border-left: none; display: flex; align-items: center; padding: 0 0.5rem;">
<span style="font-size: 0.5rem; color: rgba(40,200,64,0.7);">12–15 ✓</span>
</div>
</div>
<div style="margin-top: 0.3rem; font-size: 0.54rem; color: rgba(255,255,255,0.22); display: flex; gap: 1.5rem;">
<span>total compute: ~26 steps</span>
<span style="color: rgba(254,188,46,0.5);">2× side effects</span>
<span>restart latency: full</span>
</div>
</div>
<div>
<div style="font-size: 0.57rem; color: #28c840; letter-spacing: 0.06em; margin-bottom: 0.45rem;">CHECKPOINTED AGENT — skip completed work</div>
<div style="position: relative; height: 26px; border-radius: 3px; overflow: hidden; display: flex; gap: 1px;">
<div style="flex: 11; background: rgba(40,200,64,0.18); border: 1px solid rgba(40,200,64,0.25); border-right: none; display: flex; align-items: center; padding: 0 0.5rem;">
<span style="font-size: 0.5rem; color: rgba(40,200,64,0.7);">steps 1–11 + capsules</span>
</div>
<div style="flex: 1; background: rgba(255,95,87,0.25); border: 1px solid rgba(255,95,87,0.4); display: flex; align-items: center; justify-content: center;">
<span style="font-size: 0.48rem; color: #ff5f57;">✗</span>
</div>
<div style="flex: 1.2; background: rgba(123,158,212,0.12); border: 1px solid rgba(123,158,212,0.3); border-left: none; border-right: none; display: flex; align-items: center; justify-content: center;">
<span style="font-size: 0.46rem; color: #7b9ed4;">load</span>
</div>
<div style="flex: 4; background: rgba(40,200,64,0.22); border: 1px solid rgba(40,200,64,0.3); border-left: none; display: flex; align-items: center; padding: 0 0.5rem;">
<span style="font-size: 0.5rem; color: rgba(40,200,64,0.85);">12–15 ✓</span>
</div>
</div>
<div style="margin-top: 0.3rem; font-size: 0.54rem; color: rgba(255,255,255,0.22); display: flex; gap: 1.5rem;">
<span>total compute: ~15 steps</span>
<span style="color: rgba(40,200,64,0.5);">no duplicate effects</span>
<span>resume latency: ~200ms</span>
</div>
</div>
</div>
<div style="padding: 0.55rem 1.2rem; border-top: 1px solid rgba(255,255,255,0.05); font-size: 0.56rem; color: rgba(255,255,255,0.2); font-family: 'DM Sans', sans-serif;">at 800ms avg per step: 8.8s wasted per failure event · at scale this is measurable infrastructure cost</div>
</div>
</div>

The numbers here are not hypothetical. In a workflow with fifteen steps, each costing 800ms on average, the difference between a cold restart and a capsule resume is 8.8 seconds of wasted execution time — on every failure. At production scale, with hundreds of concurrent agent tasks, this compounds into measurable cost and latency differences.

## Implementation Patterns

### The Checkpoint Decorator

The simplest way to add checkpointing to an existing agent step function is through a decorator that handles capsule writes automatically. The step implementation stays clean; durability is a cross-cutting concern.

```python
@checkpoint(task_id=task.id, step_index=11)
async def process_payment(ctx: AgentContext) -> PaymentResult:
    result = await payment_gateway.charge(
        amount=ctx.order.total,
        customer_id=ctx.customer.id
    )
    ctx.effects.record("payment_charged", result.transaction_id)
    return result
```

The decorator writes a capsule before the function executes (recording the intent) and updates it after (recording the completion and output). If the process dies between intent and completion, the resumption logic can detect an incomplete step and decide whether to retry or flag for human review.

### The Idempotency Key

For side effects that must not be duplicated, the pattern is to generate a deterministic idempotency key derived from the capsule ID and step index, and pass it to every external API call.

```python
idempotency_key = f"{capsule.capsule_id}:step:{step_index}"

await stripe.charges.create(
    amount=order.total_cents,
    idempotency_key=idempotency_key,  # Stripe deduplicates on this
    customer=customer.stripe_id
)
```

Combined with the side effect ledger, this creates a two-layer defense: the ledger prevents the agent from re-attempting a step at all, and the idempotency key handles the case where the step was attempted but the response was not received before failure.

### The Capsule Store Interface

Capsule storage should be abstracted behind an interface to allow swapping backends without changing agent logic. The minimum interface is five operations:

```python
class CapsuleStore(Protocol):
    async def write(self, capsule: StateCapsule) -> None: ...
    async def read(self, task_id: str) -> StateCapsule | None: ...
    async def delete(self, task_id: str) -> None: ...
    async def list_incomplete(self) -> list[str]: ...
    async def gc_expired(self, max_age_hours: int) -> int: ...
```

The `list_incomplete` method is essential for operational recovery: it lets a background worker find all tasks that were interrupted (capsule exists but not marked complete) and enqueue them for resumption. Without this, interrupted tasks require manual intervention to recover.

## What Good Observability Looks Like

A checkpointing system without observability is half-built. The signals that matter:

- **Capsule write latency** — If capsule writes are slow, they add overhead to every step. Alert if p95 > 50ms.
- **Resumption rate** — What percentage of task starts are resumptions vs cold starts? A spike here indicates a systemic failure upstream.
- **Effect ledger collision rate** — How often is the ledger preventing a duplicate side effect? This should be non-zero (that means it's working) but low.
- **Stale context rate** — How often are capsules resumed with context that has expired its TTL? High rates indicate tasks are being interrupted and not retried promptly.
- **Capsule garbage collection lag** — Completed tasks should have their capsules cleaned up. Growing storage is a sign GC is not running.

## The Broader Point

The impulse in AI engineering is to solve reliability problems by making the model smarter. Use a better reasoning model, write a more precise prompt, add more validation. These are real improvements. But they do not change the fundamental fact that agents run in environments where things fail: networks time out, APIs return 503s, processes get killed, context windows overflow.

Durability is not a model capability. It is an infrastructure discipline. Checkpointing, state capsules, and resumability are the mechanism by which you transform an agent from a fragile one-shot executor — which succeeds perfectly in demos and fails silently in production — into a durable worker that can be interrupted, recovered, inspected, and resumed with confidence.

The distributed systems engineers reading this will recognize the pattern immediately. We solved this problem for queues, workflows, and distributed databases decades ago. The ideas — write-ahead logs, idempotency keys, at-least-once delivery with deduplication — are not new. What is new is applying them rigorously to the execution substrate of LLM-driven agents.

The agents that will survive production are not the smartest. They are the ones that know how to survive failure, resume from the last good state, and never do the same work twice.

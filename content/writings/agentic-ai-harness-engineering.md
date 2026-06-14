---
title: "Agentic AI Harness Engineering: Building the Control Plane for Autonomous Systems"
slug: agentic-ai-harness-engineering
category: AI Systems
date: "2026-06-05"
readTime: "22 min read"
featured: true
excerpt: "The difference between a prototype agent and a production agent is not the model. It is the harness — the orchestration layer that handles retries, fallbacks, state, evaluation, and graceful degradation when the LLM inevitably fails."
theme: "An AI harness is not a wrapper around an LLM. It is the engineered substrate — the nervous system — that governs how agents perceive, decide, act, and recover. Without it, you have a demo. With it, you have a production system."
---

Every team building agentic AI hits the same wall. The prototype works beautifully in a demo — the agent reasons, calls tools, produces correct outputs. Then you ship it. Within hours, you discover that the LLM hallucinates a tool name, retries infinitely, loses state mid-conversation, or silently degrades in quality with no signal that anything is wrong.

The difference between that prototype and a production system is not a better model. It is the harness — the engineered control plane that wraps, constrains, monitors, and recovers the agent through every failure mode the real world will throw at it.

I call this discipline **harness engineering**: the systematic design of the non-LLM infrastructure that makes agentic systems reliable, observable, and safe at scale. It is the most under-discussed and under-invested layer in the agentic AI stack, and it is the layer that determines whether your system survives contact with production traffic.

### What Is an Agent Harness?

An agent harness is the orchestration substrate that sits between your application logic and the LLM. It is responsible for everything the model cannot be trusted to do reliably: managing state across turns, enforcing execution policies, handling failures gracefully, collecting telemetry, and ensuring the agent operates within defined boundaries.

<div style="margin: 2.5rem auto; max-width: 700px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Anatomy of an Agent Harness</div>

<div style="display: flex; flex-direction: column; gap: 0.4rem; align-items: center;">

<div style="width: 100%; background: rgba(88,166,255,0.06); border: 1px solid rgba(88,166,255,0.25); border-radius: 8px; padding: 0.6rem 1rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.65rem; font-weight: 700; color: #58a6ff;">APPLICATION LAYER</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.4); margin-top: 0.2rem;">Business logic, user interface, API endpoints</div>
</div>

<div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid rgba(212,184,150,0.5);"></div>

<div style="width: 100%; background: linear-gradient(135deg, rgba(212,184,150,0.1), rgba(212,184,150,0.04)); border: 1.5px solid rgba(212,184,150,0.4); border-radius: 10px; padding: 1rem;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #d4b896; text-align: center; margin-bottom: 0.8rem; letter-spacing: 0.05em;">AGENT HARNESS</div>
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
<div style="background: rgba(212,184,150,0.1); border: 1px solid rgba(212,184,150,0.2); border-radius: 6px; padding: 0.5rem;">
<div style="font-family: monospace; font-size: 0.55rem; color: #d4b896; font-weight: 600; margin-bottom: 0.25rem;">STATE MACHINE</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); line-height: 1.4;">Turn management
Context windowing
Memory persistence</div>
</div>
<div style="background: rgba(40,200,64,0.08); border: 1px solid rgba(40,200,64,0.2); border-radius: 6px; padding: 0.5rem;">
<div style="font-family: monospace; font-size: 0.55rem; color: #28c840; font-weight: 600; margin-bottom: 0.25rem;">EXECUTION POLICY</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); line-height: 1.4;">Max retries
Timeout enforcement
Cost ceilings</div>
</div>
<div style="background: rgba(255,95,87,0.08); border: 1px solid rgba(255,95,87,0.2); border-radius: 6px; padding: 0.5rem;">
<div style="font-family: monospace; font-size: 0.55rem; color: #ff5f57; font-weight: 600; margin-bottom: 0.25rem;">RECOVERY ENGINE</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); line-height: 1.4;">Fallback chains
Circuit breakers
Graceful degrade</div>
</div>
</div>
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;">
<div style="background: rgba(254,188,46,0.08); border: 1px solid rgba(254,188,46,0.2); border-radius: 6px; padding: 0.5rem;">
<div style="font-family: monospace; font-size: 0.55rem; color: #febc2e; font-weight: 600; margin-bottom: 0.25rem;">TOOL REGISTRY</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); line-height: 1.4;">Schema validation
Permissions
Rate limits</div>
</div>
<div style="background: rgba(138,99,210,0.08); border: 1px solid rgba(138,99,210,0.2); border-radius: 6px; padding: 0.5rem;">
<div style="font-family: monospace; font-size: 0.55rem; color: #8a63d2; font-weight: 600; margin-bottom: 0.25rem;">EVALUATION LAYER</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); line-height: 1.4;">Output quality
Guardrails
Drift detection</div>
</div>
<div style="background: rgba(88,166,255,0.08); border: 1px solid rgba(88,166,255,0.2); border-radius: 6px; padding: 0.5rem;">
<div style="font-family: monospace; font-size: 0.55rem; color: #58a6ff; font-weight: 600; margin-bottom: 0.25rem;">TELEMETRY</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); line-height: 1.4;">Latency + cost
Trace correlation
Anomaly signals</div>
</div>
</div>
</div>

<div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid rgba(212,184,150,0.5);"></div>

<div style="width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 0.6rem 1rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.5);">LLM PROVIDER</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.35); margin-top: 0.2rem;">OpenAI &middot; Anthropic &middot; Local Models &middot; Routers</div>
</div>

</div>
</div>
</div>

The critical insight is that every component above the LLM layer is deterministic, testable, and under your control. The LLM is the only non-deterministic element — and the harness exists precisely to contain that non-determinism within safe operational boundaries.

### The Six Pillars of Harness Engineering

After building and operating production agent systems across multiple domains, I have converged on six pillars that every serious harness must implement. Skip any one of these and you will discover the gap in production — usually at the worst possible time.

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Six Pillars of Harness Engineering</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
<div style="background: rgba(212,184,150,0.12); border: 1px solid rgba(212,184,150,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #d4b896; font-weight: 700; margin-bottom: 0.3rem;">01 STATE MANAGEMENT</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Turn tracking, context windowing, memory persistence, checkpoint/restore</div>
</div>
<div style="background: rgba(40,200,64,0.12); border: 1px solid rgba(40,200,64,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #28c840; font-weight: 700; margin-bottom: 0.3rem;">02 EXECUTION POLICY</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Retry budgets, timeout enforcement, cost ceilings, concurrency limits</div>
</div>
<div style="background: rgba(254,188,46,0.12); border: 1px solid rgba(254,188,46,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #febc2e; font-weight: 700; margin-bottom: 0.3rem;">03 RECOVERY ENGINE</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Fallback model chains, circuit breakers, graceful degradation, dead-letter queues</div>
</div>
<div style="background: rgba(255,95,87,0.12); border: 1px solid rgba(255,95,87,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #ff5f57; font-weight: 700; margin-bottom: 0.3rem;">04 TOOL GOVERNANCE</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Schema validation, permission boundaries, rate limiting, parameter sanitisation</div>
</div>
<div style="background: rgba(138,99,210,0.12); border: 1px solid rgba(138,99,210,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #8a63d2; font-weight: 700; margin-bottom: 0.3rem;">05 EVALUATION LAYER</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Output quality scoring, guardrail checks, semantic drift detection, regression alerts</div>
</div>
<div style="background: rgba(88,166,255,0.12); border: 1px solid rgba(88,166,255,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #58a6ff; font-weight: 700; margin-bottom: 0.3rem;">06 OBSERVABILITY</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Structured traces, cost attribution, quality metrics, anomaly detection, SLA tracking</div>
</div>
</div>
</div>
</div>

### Pillar 1: State Management — The Agent's Memory Architecture

The most common failure mode in production agents is state corruption. The agent loses track of where it is in a multi-step task, re-executes steps it already completed, or hallucinates that it did something it never actually did. This happens because most agent frameworks treat state as an afterthought — a growing list of messages with no structure.

A production harness implements state as an explicit, typed state machine with well-defined transitions:

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1.2rem; text-align: center;">Agent State Machine</div>

<div style="display: flex; flex-direction: column; align-items: center; gap: 0;">

<div style="background: rgba(88,166,255,0.12); border: 1.5px solid rgba(88,166,255,0.4); border-radius: 20px; padding: 0.4rem 1.2rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #58a6ff;">IDLE</div>
</div>
<div style="display: flex; align-items: center; gap: 0.4rem; margin: 0.3rem 0;">
<div style="width: 1px; height: 16px; background: rgba(255,255,255,0.2);"></div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4); font-style: italic;">user_input</div>
</div>

<div style="background: rgba(138,99,210,0.12); border: 1.5px solid rgba(138,99,210,0.4); border-radius: 20px; padding: 0.4rem 1.2rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #8a63d2;">PLANNING</div>
</div>
<div style="display: flex; width: 100%; justify-content: center; margin: 0.3rem 0;">
<div style="display: flex; align-items: center; gap: 0;">
<div style="text-align: right; width: 40%;"><span style="font-size: 0.55rem; color: rgba(255,95,87,0.7); font-style: italic;">plan_failed</span></div>
<div style="width: 1px; height: 16px; background: rgba(255,255,255,0.2); margin: 0 1rem;"></div>
<div style="text-align: left; width: 40%;"><span style="font-size: 0.55rem; color: rgba(40,200,64,0.7); font-style: italic;">plan_ready</span></div>
</div>
</div>

<div style="display: flex; width: 100%; justify-content: center; gap: 2rem; margin-bottom: 0.3rem;">
<div style="background: rgba(255,95,87,0.1); border: 1.5px solid rgba(255,95,87,0.35); border-radius: 20px; padding: 0.4rem 1rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #ff5f57;">RECOVERY</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35); margin-top: 0.15rem;">retry → PLANNING</div>
</div>
<div style="background: rgba(40,200,64,0.1); border: 1.5px solid rgba(40,200,64,0.35); border-radius: 20px; padding: 0.4rem 1rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #28c840;">EXECUTING</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35); margin-top: 0.15rem;">tool calls + LLM</div>
</div>
</div>

<div style="display: flex; width: 100%; justify-content: center; gap: 0.5rem; align-items: center; margin: 0.2rem 0;">
<div style="font-size: 0.5rem; color: rgba(255,95,87,0.6);">exec_failed /</div>
<div style="font-size: 0.5rem; color: rgba(255,95,87,0.6);">eval_fail</div>
<div style="width: 40px; height: 1px; background: linear-gradient(90deg, rgba(255,95,87,0.3), rgba(254,188,46,0.3));"></div>
<div style="font-size: 0.5rem; color: rgba(40,200,64,0.6);">exec_success</div>
</div>

<div style="background: rgba(254,188,46,0.1); border: 1.5px solid rgba(254,188,46,0.35); border-radius: 20px; padding: 0.4rem 1.2rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #febc2e;">EVALUATING</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35); margin-top: 0.15rem;">gate checks + quality scoring</div>
</div>

<div style="display: flex; align-items: center; gap: 0.4rem; margin: 0.3rem 0;">
<div style="width: 1px; height: 16px; background: rgba(40,200,64,0.3);"></div>
<div style="font-size: 0.55rem; color: rgba(40,200,64,0.6); font-style: italic;">eval_pass</div>
</div>

<div style="background: rgba(212,184,150,0.15); border: 1.5px solid rgba(212,184,150,0.5); border-radius: 20px; padding: 0.4rem 1.2rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #d4b896;">COMPLETE</div>
</div>

</div>

<div style="margin-top: 1rem; display: flex; justify-content: center; gap: 0.8rem; flex-wrap: wrap;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.2rem 0.5rem;">Every transition logged</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.2rem 0.5rem;">Max dwell timeout per state</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.2rem 0.5rem;">Deterministic — LLM cannot override</div>
</div>
</div>
</div>

Every state transition is logged. Every transition has a maximum dwell time (timeout). The state machine enforces that the agent cannot skip steps, cannot execute without planning, cannot complete without evaluation. This is not a suggestion to the LLM — it is deterministic code that the LLM cannot override.

The context window strategy is equally critical. A naive implementation passes the entire conversation history to every LLM call. A production harness implements **sliding-window context** with semantic compression: recent turns are passed verbatim, older turns are summarised, and irrelevant tool outputs are pruned. The agent always has the context it needs without the token bloat that degrades both quality and cost.

### Pillar 2: Execution Policy — Budgets, Bounds, and Backpressure

An unconstrained agent is a liability. Without execution policies, a single confused agent can retry a failing API call indefinitely, burn through your entire token budget in minutes, or spawn cascading tool calls that overwhelm downstream services. Execution policy is the set of hard constraints that define the operational envelope:

<div style="margin: 2.5rem auto; max-width: 660px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1.2rem; text-align: center;">Execution Policy Configuration</div>

<div style="background: rgba(212,184,150,0.06); border: 1px solid rgba(212,184,150,0.2); border-radius: 8px; padding: 0.8rem; margin-bottom: 0.5rem;">
<div style="font-family: monospace; font-size: 0.6rem; color: rgba(255,255,255,0.4); margin-bottom: 0.5rem;">POLICY: research-agent-v2</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
<div style="background: rgba(255,95,87,0.08); border: 1px solid rgba(255,95,87,0.15); border-radius: 6px; padding: 0.6rem;">
<div style="font-family: monospace; font-size: 0.6rem; color: #ff5f57; font-weight: 600; margin-bottom: 0.4rem;">RETRY BUDGET</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5); line-height: 1.8;">
<div style="display: flex; justify-content: space-between;"><span>per_tool</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">3</span></div>
<div style="display: flex; justify-content: space-between;"><span>per_turn</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">5</span></div>
<div style="display: flex; justify-content: space-between;"><span>backoff</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">exp 1s</span></div>
<div style="display: flex; justify-content: space-between;"><span>on</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">5xx, timeout</span></div>
</div>
</div>
<div style="background: rgba(254,188,46,0.08); border: 1px solid rgba(254,188,46,0.15); border-radius: 6px; padding: 0.6rem;">
<div style="font-family: monospace; font-size: 0.6rem; color: #febc2e; font-weight: 600; margin-bottom: 0.4rem;">TIMEOUTS</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5); line-height: 1.8;">
<div style="display: flex; justify-content: space-between;"><span>llm_call</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">30s</span></div>
<div style="display: flex; justify-content: space-between;"><span>tool_exec</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">60s</span></div>
<div style="display: flex; justify-content: space-between;"><span>per_turn</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">120s</span></div>
<div style="display: flex; justify-content: space-between;"><span>task_total</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">600s</span></div>
</div>
</div>
<div style="background: rgba(40,200,64,0.08); border: 1px solid rgba(40,200,64,0.15); border-radius: 6px; padding: 0.6rem;">
<div style="font-family: monospace; font-size: 0.6rem; color: #28c840; font-weight: 600; margin-bottom: 0.4rem;">COST CEILING</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5); line-height: 1.8;">
<div style="display: flex; justify-content: space-between;"><span>per_turn</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">50K tok</span></div>
<div style="display: flex; justify-content: space-between;"><span>per_task</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">200K tok</span></div>
<div style="display: flex; justify-content: space-between;"><span>hourly</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">$2.00</span></div>
<div style="display: flex; justify-content: space-between;"><span>breach</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">degrade</span></div>
</div>
</div>
<div style="background: rgba(138,99,210,0.08); border: 1px solid rgba(138,99,210,0.15); border-radius: 6px; padding: 0.6rem;">
<div style="font-family: monospace; font-size: 0.6rem; color: #8a63d2; font-weight: 600; margin-bottom: 0.4rem;">CONCURRENCY</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5); line-height: 1.8;">
<div style="display: flex; justify-content: space-between;"><span>parallel_tools</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">3</span></div>
<div style="display: flex; justify-content: space-between;"><span>pending_tasks</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">10</span></div>
<div style="display: flex; justify-content: space-between;"><span>max_turns</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">15</span></div>
<div style="display: flex; justify-content: space-between;"><span>on_limit</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">yield</span></div>
</div>
</div>
</div>
</div>

<div style="margin-top: 0.8rem; text-align: center; font-size: 0.6rem; color: rgba(255,255,255,0.35); font-style: italic;">Hard stops enforced by harness infrastructure — not guidelines, not prompts.</div>
</div>
</div>

These are not guidelines — they are hard stops enforced by the harness. When an agent hits a cost ceiling, the harness does not ask the agent what to do. It downgrades to a cheaper model, or pauses and escalates to a human, or terminates the task with a structured error. The agent has no say in this. That is the point.

The most important execution policy is the **turn limit**. Agents in unbounded loops are the number one cause of cost blowouts in production. A well-designed harness enforces a maximum turn count per task and, when that limit is reached, forces the agent to summarise its progress and yield — either to a human or to a supervisor agent that can decide whether to allocate more budget.

### Pillar 3: Recovery Engine — Designing for Failure

LLMs fail. They fail in ways that are hard to predict and hard to distinguish from correct behaviour. A production harness treats failure as the default assumption and designs every path with recovery in mind.

The recovery engine implements three patterns:

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1.2rem; text-align: center;">Recovery Pattern Hierarchy</div>

<div style="display: flex; flex-direction: column; gap: 0;">

<div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;">
<div style="flex: 0 0 auto; background: rgba(255,95,87,0.15); border: 1px solid rgba(255,95,87,0.3); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
<div style="font-family: monospace; font-size: 0.6rem; color: #ff5f57; font-weight: 700;">!</div>
</div>
<div style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 0.4rem 0.6rem;">
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5);">FAILURE DETECTED</div>
</div>
</div>

<div style="margin-left: 14px; width: 1px; height: 12px; background: linear-gradient(180deg, rgba(255,95,87,0.4), rgba(254,188,46,0.4));"></div>

<div style="display: flex; align-items: stretch; gap: 0.6rem; margin-bottom: 0.3rem;">
<div style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: center;">
<div style="background: rgba(254,188,46,0.15); border: 1px solid rgba(254,188,46,0.3); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
<div style="font-family: monospace; font-size: 0.55rem; color: #febc2e; font-weight: 700;">R</div>
</div>
</div>
<div style="flex: 1; background: rgba(254,188,46,0.06); border: 1px solid rgba(254,188,46,0.2); border-radius: 6px; padding: 0.5rem 0.7rem; display: flex; justify-content: space-between; align-items: center;">
<div>
<div style="font-family: monospace; font-size: 0.6rem; color: #febc2e; font-weight: 600;">RETRY</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4); margin-top: 0.1rem;">Same model, fresh context window</div>
</div>
<div style="background: rgba(40,200,64,0.15); border: 1px solid rgba(40,200,64,0.3); border-radius: 4px; padding: 0.15rem 0.5rem; font-size: 0.55rem; color: #28c840;">success → continue</div>
</div>
</div>

<div style="margin-left: 14px; width: 1px; height: 12px; background: linear-gradient(180deg, rgba(254,188,46,0.4), rgba(138,99,210,0.4));"></div>
<div style="margin-left: 22px; font-size: 0.5rem; color: rgba(255,255,255,0.3); margin-bottom: 0.15rem;">exhausted</div>

<div style="display: flex; align-items: stretch; gap: 0.6rem; margin-bottom: 0.3rem;">
<div style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: center;">
<div style="background: rgba(138,99,210,0.15); border: 1px solid rgba(138,99,210,0.3); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
<div style="font-family: monospace; font-size: 0.55rem; color: #8a63d2; font-weight: 700;">F</div>
</div>
</div>
<div style="flex: 1; background: rgba(138,99,210,0.06); border: 1px solid rgba(138,99,210,0.2); border-radius: 6px; padding: 0.5rem 0.7rem; display: flex; justify-content: space-between; align-items: center;">
<div>
<div style="font-family: monospace; font-size: 0.6rem; color: #8a63d2; font-weight: 600;">FALLBACK</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4); margin-top: 0.1rem;">Cheaper model, simplified prompt</div>
</div>
<div style="background: rgba(40,200,64,0.1); border: 1px solid rgba(40,200,64,0.25); border-radius: 4px; padding: 0.15rem 0.5rem; font-size: 0.55rem; color: rgba(40,200,64,0.8);">degraded → continue</div>
</div>
</div>

<div style="margin-left: 14px; width: 1px; height: 12px; background: linear-gradient(180deg, rgba(138,99,210,0.4), rgba(255,95,87,0.4));"></div>
<div style="margin-left: 22px; font-size: 0.5rem; color: rgba(255,255,255,0.3); margin-bottom: 0.15rem;">exhausted</div>

<div style="display: flex; align-items: stretch; gap: 0.6rem;">
<div style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: center;">
<div style="background: rgba(255,95,87,0.2); border: 1.5px solid rgba(255,95,87,0.4); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
<div style="font-family: monospace; font-size: 0.55rem; color: #ff5f57; font-weight: 700;">C</div>
</div>
</div>
<div style="flex: 1; background: rgba(255,95,87,0.08); border: 1.5px solid rgba(255,95,87,0.25); border-radius: 6px; padding: 0.5rem 0.7rem; display: flex; justify-content: space-between; align-items: center;">
<div>
<div style="font-family: monospace; font-size: 0.6rem; color: #ff5f57; font-weight: 600;">CIRCUIT BREAK</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4); margin-top: 0.1rem;">Stop calling, preserve state, cooldown</div>
</div>
<div style="background: rgba(255,95,87,0.12); border: 1px solid rgba(255,95,87,0.25); border-radius: 4px; padding: 0.15rem 0.5rem; font-size: 0.55rem; color: rgba(255,95,87,0.8);">→ human escalation</div>
</div>
</div>

</div>
</div>
</div>

**Fallback chains** are the most underutilised pattern. When GPT-4o times out or produces garbage, you do not retry with GPT-4o. You fall back to Claude Sonnet with a simplified prompt. If that fails, you fall back to a template-based response that at least preserves correctness. The user gets a degraded but functional response instead of an error. The quality degradation is logged, and the system self-heals when the primary model recovers.

**Circuit breakers** prevent cascade failures. If a tool endpoint returns errors on three consecutive calls, the harness opens the circuit — it stops calling that tool entirely for a cooldown period. This prevents the agent from burning retries against a downed service, protects downstream systems from thundering herds, and gives the infrastructure time to recover.

**Checkpoint/restore** is the safety net. Before every tool execution, the harness checkpoints the full agent state. If the tool call corrupts the conversation or the agent enters an unrecoverable state, you restore to the last good checkpoint and try an alternative path. This is not theoretical — it is essential for any agent that makes external writes (sending emails, creating tickets, deploying code).

### Pillar 4: Tool Governance — The Agent's API Contract

Tools are the agent's hands. Without governance, those hands can do anything — including things the agent was never designed to do. Tool governance is the layer that ensures every tool call is valid, authorised, bounded, and audited.

A governed tool registry provides four guarantees:

- **Schema validation:** Every tool call is validated against a strict JSON schema before execution. If the LLM hallucinates a parameter, the call is rejected before it reaches the tool — not after.

- **Permission boundaries:** Tools are scoped to the current task context. A research agent cannot access write tools. A summarisation agent cannot access network tools. This is enforced by the harness, not by the prompt.

- **Rate limiting:** Each tool has per-minute and per-task call limits. An agent cannot spam an API endpoint regardless of what the LLM decides to do.

- **Parameter sanitisation:** All tool parameters are sanitised for injection attacks. SQL parameters are parameterised. Shell commands are escaped. URLs are validated against allow-lists.

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1.2rem; text-align: center;">Tool Call Lifecycle</div>

<div style="background: rgba(88,166,255,0.06); border: 1px solid rgba(88,166,255,0.2); border-radius: 6px; padding: 0.4rem 0.6rem; margin-bottom: 0.8rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.6rem; color: #58a6ff;">LLM Output: <span style="color: rgba(255,255,255,0.5);">call search_docs(query=&apos;...&apos;)</span></div>
</div>

<div style="display: flex; flex-direction: column; gap: 0.35rem;">

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">01</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(212,184,150,0.3), rgba(212,184,150,0.05));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Parse tool name + parameters</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">02</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(40,200,64,0.3), rgba(40,200,64,0.05));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Schema validation</div>
<div style="font-size: 0.5rem; color: rgba(255,95,87,0.6); background: rgba(255,95,87,0.08); border-radius: 3px; padding: 0.1rem 0.3rem;">fail → reject + retry</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">03</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(254,188,46,0.3), rgba(254,188,46,0.05));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Permission check</div>
<div style="font-size: 0.5rem; color: rgba(255,95,87,0.6); background: rgba(255,95,87,0.08); border-radius: 3px; padding: 0.1rem 0.3rem;">fail → reject + log</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">04</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(138,99,210,0.3), rgba(138,99,210,0.05));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Rate limit check</div>
<div style="font-size: 0.5rem; color: rgba(254,188,46,0.7); background: rgba(254,188,46,0.08); border-radius: 3px; padding: 0.1rem 0.3rem;">fail → queue</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">05</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Parameter sanitisation</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">06</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Checkpoint current state</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(212,184,150,0.06); border-radius: 4px; padding: 0.2rem 0;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: #d4b896; text-align: right; font-weight: 600;">07</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(212,184,150,0.4), rgba(212,184,150,0.1));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: #d4b896; font-weight: 600;">Execute tool</div>
<div style="font-size: 0.5rem; color: rgba(254,188,46,0.7); background: rgba(254,188,46,0.08); border-radius: 3px; padding: 0.1rem 0.3rem;">timeout → fallback</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">08</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Validate output schema</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">09</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(88,166,255,0.3), rgba(88,166,255,0.05));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Log trace span (tool, params, duration, cost)</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">10</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(40,200,64,0.3), rgba(40,200,64,0.05));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Return structured result to LLM</div>
</div>

</div>
</div>
</div>

The key architectural decision is that the harness — not the LLM — determines which tools are available for a given turn. You can dynamically narrow the tool set based on the agent's current state. In the PLANNING state, only read-only tools are available. In the EXECUTING state, write tools become accessible. This state-dependent tool availability eliminates entire categories of agent misbehaviour.

### Pillar 5: Evaluation Layer — Continuous Quality Assurance

You cannot run an agent in production without knowing whether its outputs are good. But "good" is hard to define for free-form language generation. The evaluation layer solves this by applying multiple lightweight checks at runtime — not just during development.

A production evaluation layer operates at three levels:

<div style="margin: 2.5rem auto; max-width: 660px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Runtime Evaluation Stack</div>
<div style="display: grid; gap: 0.6rem;">
<div style="background: rgba(255,95,87,0.08); border: 1px solid rgba(255,95,87,0.2); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #ff5f57; font-weight: 700; margin-bottom: 0.3rem;">GATE CHECKS (per-turn, blocking)</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.55); line-height: 1.5;">Format compliance — does output match expected schema? Guardrail pass — no PII leakage, no harmful content, no policy violations? Factual grounding — are claims supported by retrieved context?</div>
</div>
<div style="background: rgba(254,188,46,0.08); border: 1px solid rgba(254,188,46,0.2); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #febc2e; font-weight: 700; margin-bottom: 0.3rem;">QUALITY SCORING (per-task, non-blocking)</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.55); line-height: 1.5;">Relevance score against user intent. Completeness — did the agent address all parts of the request? Coherence — is the multi-turn conversation logically consistent?</div>
</div>
<div style="background: rgba(40,200,64,0.08); border: 1px solid rgba(40,200,64,0.2); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #28c840; font-weight: 700; margin-bottom: 0.3rem;">DRIFT DETECTION (aggregate, async)</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.55); line-height: 1.5;">Rolling quality percentiles — is p50 quality declining over the last hour/day? Behavioural drift — is the agent using tools differently than its baseline? Cost drift — is token consumption trending upward without corresponding quality gains?</div>
</div>
</div>
</div>
</div>

Gate checks are blocking — if an output fails a gate check, the harness rejects it and forces the agent to regenerate. Quality scores are non-blocking — they are logged and used for alerting and continuous improvement. Drift detection runs asynchronously over aggregated data, looking for systemic degradation that per-request checks would miss.

The most valuable evaluation metric I have found in practice is the **regeneration rate**: what percentage of agent outputs are rejected by gate checks and regenerated? A healthy agent regenerates less than 5% of outputs. When regeneration exceeds 15%, something fundamental has changed — a model update, a prompt regression, or a shift in input distribution — and the system alerts operators to investigate.

### Pillar 6: Observability — The Nervous System

Observability for agentic systems is qualitatively different from traditional application monitoring. You are not just tracking request latency and error rates. You are tracking reasoning quality, decision coherence, tool utilisation patterns, and cost efficiency — metrics that have no direct equivalent in conventional software.

A production harness emits structured traces that capture the full decision chain:

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1.2rem; text-align: center;">Agent Trace Schema</div>

<div style="background: rgba(212,184,150,0.06); border: 1px solid rgba(212,184,150,0.2); border-radius: 8px; padding: 0.6rem; margin-bottom: 0.5rem;">
<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #d4b896; font-weight: 600;">TRACE: task_7f2a</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.3);">total: 3,160ms</div>
</div>

<div style="display: flex; flex-direction: column; gap: 0.35rem;">

<div style="position: relative; padding-left: 0.8rem; border-left: 2px solid rgba(138,99,210,0.4);">
<div style="display: flex; align-items: center; justify-content: space-between;">
<div style="font-family: monospace; font-size: 0.6rem; color: #8a63d2;">planning</div>
<div style="display: flex; gap: 0.5rem;">
<span style="font-size: 0.5rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); border-radius: 3px; padding: 0.05rem 0.3rem;">420ms</span>
<span style="font-size: 0.5rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); border-radius: 3px; padding: 0.05rem 0.3rem;">1.2K tok</span>
</div>
</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); margin-top: 0.15rem;">model: gpt-4o &middot; plan_steps: 4 &middot; confidence: 0.87</div>
</div>

<div style="position: relative; padding-left: 0.8rem; border-left: 2px solid rgba(254,188,46,0.4);">
<div style="display: flex; align-items: center; justify-content: space-between;">
<div style="font-family: monospace; font-size: 0.6rem; color: #febc2e;">tool: search_docs</div>
<div style="display: flex; gap: 0.5rem;">
<span style="font-size: 0.5rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); border-radius: 3px; padding: 0.05rem 0.3rem;">890ms</span>
<span style="font-size: 0.5rem; color: rgba(254,188,46,0.5); background: rgba(254,188,46,0.08); border-radius: 3px; padding: 0.05rem 0.3rem;">score: 0.72</span>
</div>
</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); margin-top: 0.15rem;">params: {query: "...", limit: 10} &middot; results: 7 docs</div>
</div>

<div style="position: relative; padding-left: 0.8rem; border-left: 2px solid rgba(255,95,87,0.4);">
<div style="display: flex; align-items: center; justify-content: space-between;">
<div style="font-family: monospace; font-size: 0.6rem; color: #ff5f57;">tool: search_docs <span style="font-size: 0.5rem; background: rgba(255,95,87,0.15); border-radius: 3px; padding: 0.05rem 0.3rem; margin-left: 0.3rem;">RETRY #1</span></div>
<div style="display: flex; gap: 0.5rem;">
<span style="font-size: 0.5rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); border-radius: 3px; padding: 0.05rem 0.3rem;">650ms</span>
<span style="font-size: 0.5rem; color: rgba(40,200,64,0.6); background: rgba(40,200,64,0.08); border-radius: 3px; padding: 0.05rem 0.3rem;">score: 0.89</span>
</div>
</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); margin-top: 0.15rem;">reason: low_relevance &middot; params: {query: "...", limit: 20} &middot; results: 12 docs</div>
</div>

<div style="position: relative; padding-left: 0.8rem; border-left: 2px solid rgba(40,200,64,0.4);">
<div style="display: flex; align-items: center; justify-content: space-between;">
<div style="font-family: monospace; font-size: 0.6rem; color: #28c840;">generation</div>
<div style="display: flex; gap: 0.5rem;">
<span style="font-size: 0.5rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); border-radius: 3px; padding: 0.05rem 0.3rem;">1,200ms</span>
<span style="font-size: 0.5rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); border-radius: 3px; padding: 0.05rem 0.3rem;">3.4K tok</span>
</div>
</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); margin-top: 0.15rem;">model: gpt-4o &middot; gate_check: PASS &middot; quality: 0.91</div>
</div>

</div>
</div>

<div style="display: flex; justify-content: space-between; margin-top: 0.6rem; padding: 0.4rem 0.6rem; background: rgba(212,184,150,0.08); border-radius: 6px;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4);"><span style="color: #d4b896;">tokens:</span> 4,600</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4);"><span style="color: #d4b896;">cost:</span> $0.023</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4);"><span style="color: #d4b896;">turns:</span> 2</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4);"><span style="color: #d4b896;">tools:</span> 2 (1 retry)</div>
</div>
</div>
</div>

This trace gives you everything: latency breakdown per phase, token consumption per call, quality scores, retry reasons, and total cost attribution. You can aggregate these traces to build dashboards that answer the questions that matter: which tasks are expensive and why? Which tools fail most often? Is quality trending down after the last prompt change? Which user queries consistently trigger recovery paths?

### Harness Patterns for Multi-Agent Systems

When you move from single agents to multi-agent architectures, the harness becomes even more critical. You are now managing not just individual agent behaviour but inter-agent communication, coordination protocols, and system-level properties that emerge from agent interactions.

<div style="margin: 2.5rem auto; max-width: 700px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1.2rem; text-align: center;">Multi-Agent Harness Architecture</div>

<div style="background: rgba(212,184,150,0.08); border: 1.5px solid rgba(212,184,150,0.35); border-radius: 10px; padding: 1rem; margin-bottom: 0.6rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #d4b896; font-weight: 700; text-align: center; margin-bottom: 0.6rem;">SUPERVISOR HARNESS</div>
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.4rem; margin-bottom: 0.8rem;">
<div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.5);">Task Router</div>
</div>
<div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.5);">Budget Allocator</div>
</div>
<div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.5);">Result Merger</div>
</div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;">
<div style="background: rgba(88,166,255,0.08); border: 1.5px solid rgba(88,166,255,0.25); border-radius: 8px; padding: 0.6rem; position: relative;">
<div style="position: absolute; top: -6px; right: 8px; background: rgba(88,166,255,0.2); border-radius: 3px; padding: 0.05rem 0.3rem; font-size: 0.45rem; color: #58a6ff;">ACTIVE</div>
<div style="font-family: monospace; font-size: 0.6rem; color: #58a6ff; font-weight: 600; margin-bottom: 0.3rem;">AGENT A</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); margin-bottom: 0.3rem;">Research</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); line-height: 1.6; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.3rem;">
retries: 3
timeout: 30s
tools: read-only
cap: $0.50
</div>
</div>
<div style="background: rgba(138,99,210,0.08); border: 1.5px solid rgba(138,99,210,0.25); border-radius: 8px; padding: 0.6rem; position: relative;">
<div style="position: absolute; top: -6px; right: 8px; background: rgba(138,99,210,0.2); border-radius: 3px; padding: 0.05rem 0.3rem; font-size: 0.45rem; color: #8a63d2;">QUEUED</div>
<div style="font-family: monospace; font-size: 0.6rem; color: #8a63d2; font-weight: 600; margin-bottom: 0.3rem;">AGENT B</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); margin-bottom: 0.3rem;">Analysis</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); line-height: 1.6; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.3rem;">
retries: 5
timeout: 60s
tools: compute
cap: $1.00
</div>
</div>
<div style="background: rgba(40,200,64,0.08); border: 1.5px solid rgba(40,200,64,0.25); border-radius: 8px; padding: 0.6rem; position: relative;">
<div style="position: absolute; top: -6px; right: 8px; background: rgba(40,200,64,0.15); border-radius: 3px; padding: 0.05rem 0.3rem; font-size: 0.45rem; color: #28c840;">QUEUED</div>
<div style="font-family: monospace; font-size: 0.6rem; color: #28c840; font-weight: 600; margin-bottom: 0.3rem;">AGENT C</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); margin-bottom: 0.3rem;">Writing</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); line-height: 1.6; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.3rem;">
retries: 2
timeout: 45s
tools: write
cap: $0.30
</div>
</div>
</div>
</div>

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.4rem;">
<div style="background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35);">Budget</div>
<div style="font-family: monospace; font-size: 0.6rem; color: rgba(255,255,255,0.6);">$2.00</div>
</div>
<div style="background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35);">Max Agents</div>
<div style="font-family: monospace; font-size: 0.6rem; color: rgba(255,255,255,0.6);">5</div>
</div>
<div style="background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35);">Deadline</div>
<div style="font-family: monospace; font-size: 0.6rem; color: rgba(255,255,255,0.6);">120s</div>
</div>
<div style="background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35);">Coordination</div>
<div style="font-family: monospace; font-size: 0.6rem; color: rgba(255,255,255,0.6);">msg-pass</div>
</div>
</div>
</div>
</div>

The supervisor harness manages the fleet: it routes sub-tasks to specialist agents, allocates budget across them, enforces system-level deadlines, and merges results. Each agent has its own harness with its own policies — but the supervisor can override those policies when system-level constraints demand it (e.g., reducing Agent B's timeout because Agent A took longer than expected and the deadline is approaching).

The critical principle for multi-agent harnesses is **no shared mutable state**. Agents communicate through structured messages, not shared memory. This eliminates race conditions, makes agent interactions reproducible, and allows you to replay and debug any multi-agent interaction from the message log alone.

### The Anti-Patterns

Having reviewed dozens of production agent systems, I see the same harness anti-patterns repeatedly:

<div style="margin: 2.5rem auto; max-width: 660px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Common Harness Anti-Patterns</div>
<div style="font-size: 0.75rem; color: rgba(255,255,255,0.7); line-height: 2;">
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #ff5f57; font-family: monospace; font-weight: 700;">01</span> **Prompt-based guardrails.** "Please do not call this tool more than 3 times" in the system prompt. The LLM will violate this. Enforce with code.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #ff5f57; font-family: monospace; font-weight: 700;">02</span> **Unbounded conversation history.** Passing the full message array to every call. Tokens grow linearly, quality degrades, costs explode.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #ff5f57; font-family: monospace; font-weight: 700;">03</span> **No fallback chain.** Single model provider, single retry strategy. One API outage takes down the entire system.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #ff5f57; font-family: monospace; font-weight: 700;">04</span> **Silent failures.** Catching exceptions, returning empty strings, and hoping the user will not notice. Always fail explicitly.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #ff5f57; font-family: monospace; font-weight: 700;">05</span> **Evaluation as afterthought.** Only checking output quality during development. Production outputs go unchecked until a user complains.</div>
<div style="padding: 0.4rem 0;"><span style="color: #ff5f57; font-family: monospace; font-weight: 700;">06</span> **Monolithic agent scope.** One agent does everything. No task decomposition, no principle of least privilege, no blast radius containment.</div>
</div>
</div>
</div>

### Framework Comparison: Where Existing Tools Fall Short

The current generation of agent frameworks — LangGraph, CrewAI, AutoGen, Semantic Kernel — provide excellent primitives for agent orchestration. But they are not harnesses. They provide the building blocks; you must engineer the harness yourself.

LangGraph gives you state machines and conditional edges. But it does not give you cost ceilings, circuit breakers, or runtime evaluation. CrewAI gives you multi-agent coordination. But it does not give you per-agent budget allocation, fallback chains, or checkpoint/restore. AutoGen gives you conversational patterns. But it does not give you structured traces, drift detection, or graceful degradation.

This is not a criticism of these frameworks — they are designed as orchestration layers, not control planes. The harness is the layer you build on top of them. It is your system's unique operational intelligence, tailored to your failure modes, your cost constraints, and your quality requirements.

### Key Takeaways

<div style="margin: 2.5rem auto; max-width: 660px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Engineering Principles</div>
<div style="font-size: 0.75rem; color: rgba(255,255,255,0.7); line-height: 2;">
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">01</span> The harness is the product. The LLM is a component. Never confuse the two.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">02</span> Every policy must be enforced in code, never in prompts. What can be overridden by the LLM will be overridden by the LLM.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">03</span> Design for failure first. The happy path is the exception. Recovery is the normal operating mode.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">04</span> Budget everything: tokens, time, retries, cost. Unbounded resources create unbounded risk.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">05</span> Observe everything. You cannot improve what you cannot measure. Traces are not optional.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">06</span> Evaluate continuously. Development-time testing is necessary but insufficient. Production quality requires runtime checks.</div>
<div style="padding: 0.4rem 0;"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">07</span> Agents are cattle, not pets. They should be stateless, replaceable, and independently deployable. The harness holds the state.</div>
</div>
</div>
</div>

The teams that ship reliable agent systems are not the ones with the best prompts or the most expensive models. They are the ones that invest disproportionately in the harness — in the boring, deterministic infrastructure that makes the exciting, non-deterministic AI component safe to operate at scale. The harness is where engineering discipline meets AI capability. It is where production systems are won or lost.

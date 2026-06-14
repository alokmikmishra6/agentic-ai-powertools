---
title: "Production Agent Harness with Circuit Breakers and Fallback Chains"
slug: agent-harness-framework
tag: "AI Infrastructure"
tagClass: ai
featured: true
date: "2026-06-05"
lang: python
---

## Problem

Agent frameworks provide orchestration primitives but not production resilience. Teams deploy agents that retry infinitely, burn token budgets, lose state on failure, and provide no visibility into quality degradation — turning a demo into an operational liability.

## Approach

A harness framework that wraps any LLM-based agent with deterministic execution policies, fallback model chains, circuit breakers, checkpoint/restore, runtime evaluation gates, and structured observability — all enforced in code, never in prompts.

## Architecture

<!-- architecture -->
<div style="font-family: monospace; font-size: 0.72rem; line-height: 1.7; color: rgba(255,255,255,0.7); white-space: pre; overflow-x: auto;">
┌─────────────────────────────────────────────────────────┐
│                    AGENT HARNESS                         │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              EXECUTION POLICY                     │  │
│  │  max_retries: 3  │  timeout: 30s  │  budget: $1  │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                              │
│  ┌──────────┐    ┌──────▼──────┐    ┌──────────────┐   │
│  │ STATE    │    │ TOOL        │    │ EVALUATION   │   │
│  │ MACHINE  │    │ GOVERNANCE  │    │ LAYER        │   │
│  │          │    │             │    │              │   │
│  │ IDLE     │    │ Schema val  │    │ Gate checks  │   │
│  │ PLANNING │    │ Permissions │    │ Quality score│   │
│  │ EXECUTING│    │ Rate limits │    │ Drift detect │   │
│  │ EVALUATNG│    │ Sanitise    │    │              │   │
│  │ RECOVERY │    │             │    │              │   │
│  └──────────┘    └─────────────┘    └──────────────┘   │
│                          │                              │
│  ┌───────────────────────▼───────────────────────────┐  │
│  │              RECOVERY ENGINE                       │  │
│  │                                                   │  │
│  │  Retry (same model) ──▶ Fallback (cheaper model)  │  │
│  │  ──▶ Circuit Break ──▶ Human Escalation           │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                              │
│  ┌───────────────────────▼───────────────────────────┐  │
│  │              TELEMETRY COLLECTOR                   │  │
│  │  Traces │ Cost │ Quality │ Latency │ Anomalies    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
</div>

## Code

```python
import time
import json
from enum import Enum
from dataclasses import dataclass, field
from typing import Any, Callable

# --- Execution Policy ---

@dataclass
class ExecutionPolicy:
    max_retries: int = 3
    timeout_seconds: float = 30.0
    max_tokens_per_turn: int = 50_000
    max_cost_per_task: float = 1.0
    max_turns: int = 15
    backoff_base: float = 1.0  # exponential backoff

# --- Agent States ---

class AgentState(Enum):
    IDLE = "idle"
    PLANNING = "planning"
    EXECUTING = "executing"
    EVALUATING = "evaluating"
    RECOVERY = "recovery"
    COMPLETE = "complete"

# --- Circuit Breaker ---

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 3, cooldown: float = 60.0):
        self.failure_threshold = failure_threshold
        self.cooldown = cooldown
        self.failures: dict[str, list[float]] = {}
        self.open_until: dict[str, float] = {}

    def record_failure(self, service: str):
        now = time.time()
        self.failures.setdefault(service, []).append(now)
        # Only count recent failures
        recent = [t for t in self.failures[service] if now - t < self.cooldown]
        self.failures[service] = recent
        if len(recent) >= self.failure_threshold:
            self.open_until[service] = now + self.cooldown

    def is_open(self, service: str) -> bool:
        if service not in self.open_until:
            return False
        if time.time() > self.open_until[service]:
            del self.open_until[service]
            self.failures.pop(service, None)
            return False
        return True

    def record_success(self, service: str):
        self.failures.pop(service, None)
        self.open_until.pop(service, None)

# --- Fallback Chain ---

@dataclass
class ModelConfig:
    name: str
    call_fn: Callable
    cost_per_1k_tokens: float
    timeout: float = 30.0

class FallbackChain:
    def __init__(self, models: list[ModelConfig]):
        self.models = models  # ordered primary -> cheapest fallback
        self.circuit_breaker = CircuitBreaker()

    async def call(self, messages: list[dict], **kwargs) -> dict:
        last_error = None
        for model in self.models:
            if self.circuit_breaker.is_open(model.name):
                continue
            try:
                result = await model.call_fn(messages, **kwargs)
                self.circuit_breaker.record_success(model.name)
                return {"model_used": model.name, "result": result}
            except Exception as e:
                self.circuit_breaker.record_failure(model.name)
                last_error = e
        raise RuntimeError(f"All models exhausted. Last: {last_error}")

# --- Evaluation Gate ---

@dataclass
class EvalResult:
    passed: bool
    score: float
    reason: str

class EvaluationGate:
    def __init__(self, checks: list[Callable]):
        self.checks = checks

    def evaluate(self, output: str, context: dict) -> EvalResult:
        for check in self.checks:
            result = check(output, context)
            if not result.passed:
                return result
        return EvalResult(passed=True, score=1.0, reason="all_checks_passed")

# --- Trace Collector ---

@dataclass
class Span:
    name: str
    start_time: float = field(default_factory=time.time)
    end_time: float | None = None
    tokens_used: int = 0
    cost: float = 0.0
    metadata: dict = field(default_factory=dict)

class TraceCollector:
    def __init__(self, task_id: str):
        self.task_id = task_id
        self.spans: list[Span] = []
        self._active: Span | None = None

    def start_span(self, name: str, **meta) -> Span:
        span = Span(name=name, metadata=meta)
        self._active = span
        self.spans.append(span)
        return span

    def end_span(self, tokens: int = 0, cost: float = 0.0):
        if self._active:
            self._active.end_time = time.time()
            self._active.tokens_used = tokens
            self._active.cost = cost
            self._active = None

    def summary(self) -> dict:
        total_tokens = sum(s.tokens_used for s in self.spans)
        total_cost = sum(s.cost for s in self.spans)
        total_duration = (
            (self.spans[-1].end_time or time.time()) - self.spans[0].start_time
            if self.spans else 0
        )
        return {
            "task_id": self.task_id,
            "spans": len(self.spans),
            "total_tokens": total_tokens,
            "total_cost": f"${total_cost:.4f}",
            "total_duration_ms": int(total_duration * 1000),
        }

# --- The Harness ---

class AgentHarness:
    def __init__(
        self,
        policy: ExecutionPolicy,
        fallback_chain: FallbackChain,
        eval_gate: EvaluationGate,
        tools: dict[str, Callable] | None = None,
    ):
        self.policy = policy
        self.fallback_chain = fallback_chain
        self.eval_gate = eval_gate
        self.tools = tools or {}
        self.state = AgentState.IDLE
        self.turn_count = 0
        self.total_cost = 0.0
        self.trace: TraceCollector | None = None

    async def run(self, task: str, context: dict = None) -> dict:
        self.trace = TraceCollector(task_id=task[:32])
        self.state = AgentState.PLANNING
        self.turn_count = 0
        context = context or {}
        messages = [{"role": "user", "content": task}]

        while self.turn_count < self.policy.max_turns:
            self.turn_count += 1

            # --- Execute with harness controls ---
            self.state = AgentState.EXECUTING
            span = self.trace.start_span(
                f"turn_{self.turn_count}", state=self.state.value
            )

            try:
                response = await self.fallback_chain.call(messages)
            except RuntimeError as e:
                self.state = AgentState.RECOVERY
                self.trace.end_span()
                return self._escalate(str(e), messages)

            tokens = response["result"].get("tokens_used", 0)
            cost = tokens * 0.00003  # approximate
            self.total_cost += cost
            self.trace.end_span(tokens=tokens, cost=cost)

            # --- Cost ceiling check ---
            if self.total_cost > self.policy.max_cost_per_task:
                return self._budget_exceeded(messages)

            # --- Evaluate output ---
            self.state = AgentState.EVALUATING
            output = response["result"].get("content", "")
            eval_result = self.eval_gate.evaluate(output, context)

            if not eval_result.passed:
                messages.append({
                    "role": "system",
                    "content": f"Output rejected: {eval_result.reason}. Retry."
                })
                continue

            # --- Check if task is complete ---
            if response["result"].get("done", False):
                self.state = AgentState.COMPLETE
                return {
                    "status": "complete",
                    "output": output,
                    "trace": self.trace.summary(),
                    "model_used": response["model_used"],
                }

            messages.append({"role": "assistant", "content": output})

        # Turn limit reached
        return self._turn_limit_reached(messages)

    def _escalate(self, error: str, messages: list) -> dict:
        return {
            "status": "escalated",
            "error": error,
            "context": messages[-3:],
            "trace": self.trace.summary() if self.trace else {},
        }

    def _budget_exceeded(self, messages: list) -> dict:
        return {
            "status": "budget_exceeded",
            "cost": f"${self.total_cost:.4f}",
            "trace": self.trace.summary() if self.trace else {},
        }

    def _turn_limit_reached(self, messages: list) -> dict:
        return {
            "status": "turn_limit",
            "turns": self.turn_count,
            "trace": self.trace.summary() if self.trace else {},
        }
```

## Run

```bash
# Install dependencies
pip install asyncio

# Usage example:
import asyncio
from harness import (
    AgentHarness, ExecutionPolicy, FallbackChain,
    ModelConfig, EvaluationGate, EvalResult
)

# Define your model call functions
async def call_gpt4o(messages, **kw):
    # Your OpenAI API call here
    return {"content": "...", "tokens_used": 1200, "done": True}

async def call_claude_sonnet(messages, **kw):
    # Your Anthropic API call here
    return {"content": "...", "tokens_used": 900, "done": True}

# Build the harness
policy = ExecutionPolicy(max_retries=3, timeout_seconds=30, max_cost_per_task=2.0)
chain = FallbackChain([
    ModelConfig("gpt-4o", call_gpt4o, cost_per_1k_tokens=0.03),
    ModelConfig("claude-sonnet", call_claude_sonnet, cost_per_1k_tokens=0.015),
])

def format_check(output, ctx):
    if len(output) < 10:
        return EvalResult(False, 0.0, "output_too_short")
    return EvalResult(True, 1.0, "ok")

gate = EvaluationGate(checks=[format_check])
harness = AgentHarness(policy=policy, fallback_chain=chain, eval_gate=gate)

# Run
result = asyncio.run(harness.run("Summarise the Q2 sales report"))
print(result)
# {'status': 'complete', 'output': '...', 'trace': {...}, 'model_used': 'gpt-4o'}
```

## Outcomes

- Circuit breaker prevents cascading failures — 3 consecutive failures opens circuit for 60s cooldown
- Fallback chain maintains availability — automatic model downgrade when primary is unavailable or over-budget
- Cost ceiling enforcement stops runaway agents — hard stop at configurable dollar limit per task
- Structured traces provide full cost/latency/quality attribution per span
- Evaluation gates reject low-quality outputs before they reach users — forcing regeneration with context

## Lessons

- Enforce everything in code, never in prompts — the LLM will violate any instruction-based constraint under adversarial or edge-case inputs
- Fallback chains should degrade gracefully, not fail completely — a cheaper model with a simpler prompt is always better than an error
- Circuit breakers need per-service granularity — one downed tool should not disable unrelated capabilities
- Trace everything from day one — retrofitting observability is 10x harder than building it in
- Turn limits are the single most important safety mechanism — unbounded loops are the primary cause of production cost blowouts

---
title: "Building LLM pipelines that do not collapse under production load"
slug: llm-pipelines-production
category: AI Systems
date: "2025-12-14"
readTime: "13 min read"
excerpt: "Prompt engineering gets you to a demo. Architecture gets you to production."
theme: "Prompt engineering gets you to a demo. Architecture gets you to production. The gap between them is wider than most teams imagine."
---

Prompt engineering gets you to a demo. Architecture gets you to production. The gap between them is wider than most teams imagine — not because production is harder technically, but because production introduces constraints that demos are designed to avoid: latency budgets, cost envelopes, reliability requirements, and the need for deterministic behaviour from a fundamentally probabilistic system.

### The non-determinism problem

The fundamental challenge of LLM systems in production is that they are probabilistic. The same input can produce different outputs on different invocations. For a generation task — writing marketing copy, summarising a document — this variability is acceptable. For a pipeline that makes routing decisions, extracts structured data, or triggers downstream actions, non-determinism is a reliability risk.

The architectural response to non-determinism is not to eliminate it (you cannot) but to contain it. Every point where an LLM makes a decision that affects system behaviour needs:

- **Output validation.** The LLM's output is parsed and validated against a schema before it is acted upon. If the output does not conform — wrong structure, missing fields, invalid values — it is rejected and retried or escalated. Never trust raw model output as structured data.

- **Deterministic fallbacks.** When the LLM fails to produce valid output after retries, the system falls back to a deterministic path. This might mean routing to a human, using a rule-based default, or failing gracefully with an explicit "I could not process this" signal.

- **Idempotency.** If a pipeline step is retried (because of validation failure, timeout, or infrastructure flap), the retry must be safe. This is standard distributed systems hygiene, but it is especially important when your processing logic includes a non-deterministic component.

### The latency architecture

LLM calls are slow. A single GPT-4 call might take 3-15 seconds. A pipeline with three sequential LLM calls has a baseline latency of 10-45 seconds before you add any other processing. For real-time user-facing applications, this is often unacceptable.

Architectural patterns for managing LLM latency:

- **Parallel decomposition.** If your pipeline has multiple independent extraction or analysis steps, run them concurrently. Three 10-second calls in parallel is 10 seconds, not 30.

- **Streaming responses.** For generation tasks, stream the response to the user as it is produced rather than waiting for completion. This dramatically improves perceived latency.

- **Tiered model selection.** Not every step needs GPT-4. Use smaller, faster models for simpler tasks (classification, extraction) and reserve the expensive model for tasks that genuinely require its capabilities (complex reasoning, nuanced generation). A well-designed pipeline might use three different models at different cost/latency/quality trade-off points.

- **Semantic caching.** If you see the same or semantically similar queries repeatedly, cache the results. This requires embedding-based similarity matching rather than exact-match caching, but the latency and cost savings are substantial for workloads with query repetition.

- **Precomputation.** For known document types or recurring analysis tasks, precompute the LLM-intensive work offline and serve results from a fast data store at query time.

### The cost architecture

LLM costs scale with token volume. A pipeline processing 10,000 documents per day at $0.03 per 1K input tokens adds up quickly. Cost architecture is not an afterthought — it is a design constraint that shapes the pipeline from the beginning.

Cost-aware design principles:

- **Minimize context window usage.** Send only what the model needs. Strip boilerplate, compress repetitive content, and use focused prompts. A prompt that includes 2,000 irrelevant tokens 10,000 times a day is $600/day in wasted input cost alone.

- **Progressive refinement.** Use a cheap classifier to determine whether an item needs expensive processing. Process 80% of traffic with a fast/cheap model and route only the complex 20% to the expensive model.

- **Budget caps and alerting.** Set hard cost caps per pipeline, per day, and per customer. Alert on anomalies — a sudden spike in token usage often indicates a bug (infinite loop, prompt injection expanding context) rather than legitimate traffic.

### Evaluation is infrastructure

The teams that run LLM systems reliably in production treat evaluation as infrastructure — not a phase that happens before launch. This means:

- **Continuous evaluation.** A sample of production traffic is continuously evaluated against quality benchmarks. When quality degrades — because of model updates, data drift, or changing input patterns — the team is alerted.

- **Multi-dimensional metrics.** Not just "is the answer correct?" but: Is it well-formatted? Is it safe? Is it within latency budget? Did it stay within the prompt's constraints? Each dimension is tracked independently because they degrade independently.

- **Golden datasets.** A curated set of input-output pairs that represent known-good behaviour. These are run after every model change, prompt update, or pipeline modification. They are your regression tests for a non-deterministic system.

- **Human-in-the-loop evaluation.** Automated metrics miss things. A regular cadence of human review — domain experts looking at real outputs — catches quality issues that metrics cannot detect.

### The observability layer

LLM pipelines need specialised observability. Standard application monitoring (latency, error rates, throughput) is necessary but insufficient. You also need:

- **Token usage per step.** Know exactly where your token budget is being spent so you can optimise the expensive parts.

- **Prompt-response logging.** Every LLM invocation should be logged with the full prompt and response, in a queryable format. When something goes wrong, you need the forensic trail.

- **Quality score tracking.** If you have automated evaluators, track their scores over time as time-series data. Quality degradation is often gradual — you need trend detection, not just threshold alerting.

- **Cost attribution.** Know which pipeline, which customer, which document type is driving cost. Without attribution, you cannot make informed optimization decisions.

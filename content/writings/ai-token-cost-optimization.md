---
title: "The real cost of AI tokens — and how organisations can stop bleeding money"
slug: ai-token-cost-optimization
category: AI Systems
date: "2026-05-16"
readTime: "10 min read"
featured: true
excerpt: "Most teams treat LLM costs as a cloud bill line item. The teams that scale AI treat token economics as an architectural discipline."
theme: "Token economics is an architectural discipline. The teams that ignore it pay twice — once in dollars, once in latency."
---

Every call to a large language model has a price — measured in tokens consumed, dollars spent, and latency incurred. As organisations move from AI experiments to production systems handling millions of requests, token costs quietly become one of the largest and least-understood line items in the engineering budget.

### Why token costs spiral out of control

The root cause is almost never the model itself. It is the architecture around it. Common culprits:

- **Bloated system prompts.** Teams copy-paste instructions that grow to thousands of tokens. Every single request pays for that overhead.

- **No caching layer.** Identical or near-identical queries hit the model fresh each time. Semantic caching can eliminate 30-60% of redundant calls.

- **Wrong model for the job.** Using GPT-4o for tasks a fine-tuned GPT-4o-mini handles at 1/20th the cost.

- **Uncontrolled agent loops.** Agentic systems that reason in circles, retry without backoff, or invoke tools speculatively.

- **Retrieval bloat.** RAG pipelines that stuff 20 chunks into context when 3 would suffice — paying for context the model mostly ignores.

### A framework for token cost optimisation

I use a four-layer model when helping teams get their AI costs under control:

#### Layer 1: Measure before you optimise

You cannot optimise what you cannot see. Instrument every LLM call with: model name, input tokens, output tokens, latency, and a semantic label for the task type. Build dashboards that break cost down by feature, by user segment, and by time.

#### Layer 2: Route intelligently

Not every request needs your most capable model. Build a routing layer that classifies incoming requests and dispatches them to the cheapest model that meets the quality bar. A simple intent classifier (which can itself be a small model) can save 40-70% on token costs overnight.

<pre><code>class ModelRouter:
    """Route requests to the cheapest adequate model."""

    TIERS = [
        ("gpt-4o-mini", 0.15, TaskComplexity.SIMPLE),
        ("gpt-4o",      2.50, TaskComplexity.MODERATE),
        ("o3",         15.00, TaskComplexity.COMPLEX),
    ]

    async def route(self, request: LLMRequest) -> str:
        complexity = await self.classify(request)
        for model, cost, tier in self.TIERS:
            if tier >= complexity:
                return model
        return self.TIERS[-1][0]  # fallback to most capable</code></pre>

#### Layer 3: Cache aggressively

Semantic caching stores embeddings of previous queries and returns cached responses for sufficiently similar new queries. The key insight: you do not need exact match caching. An embedding similarity threshold of 0.95+ catches most repeated intent without sacrificing quality.

#### Layer 4: Compress and prune context

For RAG systems, this means smarter chunking, better reranking to surface only the most relevant passages, and summary-based context injection for long documents. For agent systems, it means trajectory summarisation — compressing earlier reasoning steps instead of carrying the full history.

### The organisational dimension

Token cost optimisation is not purely a technical problem. It requires:

- **Cost attribution.** Teams that own AI features must see their token spend — not buried in a shared infrastructure bill.

- **Quality-cost tradeoff agreements.** Define acceptable quality thresholds per use case. A search autocomplete does not need the same fidelity as a medical summarisation.

- **Budget guardrails.** Hard caps per user, per session, and per feature. Circuit breakers that degrade gracefully when budgets are hit.

### What I have seen work in practice

The teams that handle this well share a common trait: they treat token economics as an architectural concern from day one — not as a cost-cutting exercise after the bill arrives. They build cost observability into the platform layer, enforce model routing as infrastructure, and review token budgets in the same forum where they review system design.

AI at scale is not just an intelligence problem. It is an economics problem. The organisations that build this muscle early will outrun the ones optimising after the fact.

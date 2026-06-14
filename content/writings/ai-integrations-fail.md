---
title: "Why most AI integrations fail — and it is not the model"
slug: ai-integrations-fail
category: AI Systems
date: "2025-05-05"
readTime: "11 min read"
excerpt: "When an AI integration underperforms, the instinct is to blame the model. In most cases the problem is upstream."
theme: "When an AI integration underperforms, the instinct is to blame the model. In most cases the problem is upstream."
---

When an AI integration underperforms in production, the instinct is to blame the model. "GPT-4 is not good enough for our use case." "We need a more powerful model." "The model hallucinates too much." In eighteen months of building production AI systems, I have found that the model is rarely the root cause. The problems are almost always upstream — in the data contracts, the evaluation infrastructure, or the integration patterns.

### The three architectural failure patterns

#### 1. Weak data contracts

The model is only as good as the data it receives. This is obvious in theory and ignored in practice. I see it constantly: teams spend weeks on prompt engineering while feeding the model unstructured, inconsistent, or incomplete data.

Symptoms of weak data contracts:

- The prompt includes instructions like "if the field is empty, ignore it" — compensating for data quality issues at the prompt level rather than fixing them at the source.

- Different upstream systems send the same concept in different formats. The model must handle date formats as "2025-01-15", "Jan 15, 2025", "15/01/2025", and "yesterday" — not because the task requires it, but because nobody standardised the input.

- Critical context is missing because the data pipeline drops fields silently. The model produces poor results not because it lacks capability, but because it lacks information that exists in the source system but never reaches the prompt.

The fix is not better prompting. It is treating the data flowing into your AI system with the same rigour you would treat data flowing into a financial reporting system: schemas, validation, versioning, and monitoring for drift.

#### 2. No evaluation framework

If you cannot measure quality, you cannot improve quality. And yet the majority of AI integrations I review have no systematic evaluation framework. They have vibes. "It seems to work pretty well." "The product manager tried ten examples and they were good."

Without systematic evaluation:

- You cannot distinguish a good prompt from a slightly-better prompt. A/B testing requires statistical rigour, not anecdotes.

- You cannot detect regression. When you update the prompt, change the model version, or modify the data pipeline — how do you know you have not made things worse? Without a benchmark dataset and automated evaluation, you are flying blind.

- You cannot diagnose failure modes. "The model sometimes gets it wrong" is not actionable. "The model fails on inputs where the entity name contains special characters" is actionable. Systematic evaluation reveals patterns; anecdotes reveal instances.

The evaluation framework does not need to be sophisticated to be useful. Start with a golden dataset of 100 input-output pairs that represent your known-good behaviour. Run it after every change. Track the score over time. This alone puts you ahead of 90% of AI integrations.

#### 3. Integration patterns designed for determinism

The most subtle failure pattern: teams integrate an LLM using the same patterns they would use for a deterministic API. They expect consistent output formatting, stable response times, and predictable behaviour across all inputs. When the LLM behaves probabilistically — as it is designed to do — the surrounding system breaks.

Manifestations:

- **Brittle parsing.** The downstream system expects the LLM output to be in exact JSON format. When the model includes a preamble ("Here is the JSON:") or slightly varies the structure, the parser fails. The fix is not better prompting — it is robust parsing that handles variation.

- **No retry logic.** The system treats an LLM call like a database query — it either succeeds or fails. But LLM calls can produce invalid output that is not a technical error. You need application-level retries for "the call succeeded but the output was not usable."

- **Synchronous blocking.** The system blocks the user while waiting for an LLM response. When the model takes 12 seconds instead of the expected 3, the user sees a timeout. The architecture needs to accommodate variable latency — through streaming, async processing, or optimistic UI patterns.

- **Single-attempt extraction.** The system asks the model to extract ten fields from a document in a single call. When three of them are wrong, all ten are discarded. Better: extract independently (or in verified batches) so partial success is possible.

### The upstream diagnosis framework

When an AI integration underperforms, I work through this diagnostic sequence:

1. **Data audit.** Examine 50 real production inputs. Are they well-structured? Complete? Consistent? Do they contain the information the model needs to produce a good answer?

2. **Prompt-in-context review.** Look at the actual prompt as constructed at runtime — with the real data filled in, not the template. Is the context coherent? Is there contradictory information? Is the instruction clear given the actual data?

3. **Output analysis.** Categorise failures. What percentage are data quality issues (bad input → bad output)? What percentage are capability limitations (good input → bad output)? What percentage are parsing/integration issues (good output → lost in translation)?

4. **Model capability check.** Only after confirming that inputs are clean and integration is robust, test whether the model is actually capable of the task. Give it perfect inputs manually and evaluate the output quality.

In my experience, step 4 — the model's intrinsic capability — is the root cause less than 20% of the time. The other 80% is upstream: bad data, missing context, brittle integration, or unclear instructions.

### The organisational pattern

There is an organisational dimension to this failure pattern. AI integrations often live at the boundary between a data engineering team (who owns the input pipeline), an ML/AI team (who owns the model and prompts), and a product engineering team (who owns the integration code). When these three teams do not have shared visibility into the end-to-end pipeline, each team optimises their piece in isolation — and the failures happen at the seams.

The fix is end-to-end ownership. Someone — ideally a senior engineer who understands data, models, and systems integration — must own the pipeline from data ingestion to final output. They do not need to build every piece, but they need visibility and authority across the full chain.

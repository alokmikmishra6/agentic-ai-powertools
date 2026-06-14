---
title: "RAG is not retrieval — it is a knowledge architecture question"
slug: rag-knowledge-architecture
category: AI Systems
date: "2026-04-12"
readTime: "11 min read"
excerpt: "Most RAG discussions get stuck on chunking strategies. The important questions are about how you model knowledge."
theme: "The quality of retrieval depends entirely on how knowledge was structured when it was ingested. Chunking is downstream."
---

Most discussions of retrieval-augmented generation get stuck early. They debate chunk sizes, embedding models, similarity thresholds, and reranking strategies. These are real engineering questions, but they are downstream of a more fundamental one: how do you model knowledge in a way that makes the right information retrievable at the right level of granularity?

### The knowledge modelling problem

RAG works by finding semantically related content and injecting it into the model's context. The quality of what gets retrieved depends entirely on how knowledge was structured when it was ingested. If you chunk a 50-page technical document into 500-token fragments with no awareness of document structure, you will retrieve fragments that are semantically close to the query but contextually meaningless — a paragraph that references "the approach described above" with no access to what was described above.

This is not a retrieval problem. It is a knowledge architecture problem. The question is not "how do I find relevant text?" but "how do I represent knowledge so that relevant context is self-contained and retrievable?"

### What knowledge modelling actually involves

Before you write any RAG code, you need answers to several fundamental questions:

- **What are the natural units of knowledge in your domain?** In a legal corpus, it might be clauses. In a codebase, it might be functions with their docstrings. In medical literature, it might be findings with their evidence base. Chunk boundaries should respect these natural units.

- **How do those units relate to each other?** Knowledge rarely exists in isolation. A clinical finding has prerequisites, a code function has callers, a legal clause has exceptions. Your retrieval system needs to surface not just the matching unit, but enough surrounding context for the model to reason correctly.

- **What metadata enriches retrieval?** Semantic similarity alone is insufficient. A query about "error handling in the payments service" benefits from metadata filtering (service=payments) before semantic search (topic=error handling). This hybrid approach — structured filtering plus semantic search — dramatically improves precision.

- **What level of granularity serves the model?** Too small, and retrieved chunks lack context. Too large, and you waste context window on irrelevant material. The right answer depends on your model's context window, your latency budget, and the nature of the questions being asked.

### The three-layer retrieval architecture

The RAG systems I design in production use a three-layer retrieval architecture:

#### Layer 1: Document-level understanding

Before any chunking happens, we generate a document-level summary and extract structural metadata — sections, headings, cross-references, entities. This metadata becomes the scaffold that holds chunks together and enables document-aware retrieval.

#### Layer 2: Semantic chunking with overlap

Chunks are split along semantic boundaries — paragraph breaks, section headers, topic shifts detected via embedding similarity. Each chunk carries metadata about its position in the document hierarchy, its parent section, and its relationship to adjacent chunks. We use sliding-window overlap so that no piece of context exists only at a chunk boundary.

#### Layer 3: Multi-strategy retrieval

At query time, we do not rely on a single retrieval strategy. We run parallel searches — dense vector search for semantic similarity, sparse keyword search for exact-match requirements, metadata-filtered search for known constraints — then fuse results using reciprocal rank fusion or a learned reranker. This ensures we catch both semantic matches and lexical matches that embedding models might miss.

### The reranking imperative

Initial retrieval is recall-optimised: cast a wide net, accept false positives. Reranking is precision-optimised: from the wide net, select the truly relevant results. A cross-encoder reranker that scores query-document pairs jointly is dramatically more accurate than bi-encoder similarity for the final selection. The latency cost is acceptable because you are only reranking 20-50 candidates, not the entire corpus.

### Where most RAG pipelines fail

The failure patterns I see repeatedly in production RAG:

- **Retrieval that returns text, not answers.** The model receives five paragraphs that contain the answer somewhere, but has to synthesise across disconnected fragments. Better: retrieve at a granularity where each chunk is a self-contained unit of reasoning.

- **No freshness awareness.** The vector store contains stale information alongside current information, with no mechanism to prefer recent data. Build temporal awareness into your retrieval layer.

- **Ignoring the "I don't know" case.** When retrieval returns low-confidence results, the system should abstain rather than hallucinate an answer from marginally-relevant context. Confidence thresholds on retrieval scores are essential guardrails.

- **Single-hop retrieval for multi-hop questions.** Complex questions require chaining — retrieve context, reason partially, retrieve more context based on what was learned. Single-round retrieval is insufficient for questions that require synthesis across multiple documents.

### The evaluation gap in RAG

Most teams evaluate their RAG system end-to-end: "Did the final answer match the expected answer?" This is necessary but insufficient. You need to evaluate each stage independently: Did retrieval surface the right chunks? Did reranking order them correctly? Did the model use the context faithfully? Without stage-level evaluation, you cannot diagnose where quality is lost — and your improvements become trial and error rather than engineering.

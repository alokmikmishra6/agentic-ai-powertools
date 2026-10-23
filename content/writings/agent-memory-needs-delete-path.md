---
title: "Agent memory needs a delete path"
slug: "agent-memory-needs-delete-path"
category: "Architecture"
date: "2026-09-12"
featured: false
excerpt: "Persistent memory creates obligations around provenance, correction, expiry, and removal. Retrieval quality is only one part of the design."
theme: "Persistent memory creates obligations around provenance, correction, expiry, and removal. Retrieval quality is only one part of the design."
---

Suppose an assistant remembers that a service deploys to a particular region. The team moves the service. A month later, the assistant confidently prepares a change against the old region because the remembered fact still ranks well in retrieval.

The memory was useful when it was written. Its usefulness had a lifetime that the storage system never recorded.

Before adding a “remember this” tool, it is worth deciding how the agent will handle a fact that used to be correct.

## A memory is a claim with an owner

A durable fact should carry its source, scope, observed time, and a way to check whether it is still valid. “Deploy to region A” is incomplete without the service, environment, and source revision.

There is also a difference between a user preference and a system fact. A preference about response length can tolerate a lightweight correction path. A claim about production routing should be verified against the current deployment configuration before a write.

I would keep these types separate in the data model. Their freshness rules, access controls, and consequences are too different for one generic confidence score.

## Expiry is a retrieval decision

A time-to-live field is not enough if expired rows still enter the prompt. Apply expiry and access checks before selecting memory for context. Record why a candidate was rejected so that debugging does not require guessing which filter ran.

For some facts, age is the wrong invalidation signal. A policy revision or repository commit is more precise. The useful question is whether the source that supported the claim has changed, not simply whether seven days have passed.

Access also changes. A reader who could see a document last week may no longer be allowed to retrieve a summary of it. Rechecking permissions on the original document while serving its old summary from an unrestricted cache defeats the purpose of the check.

## Deletion has descendants

One source document can produce a summary, several extracted facts, an embedding, a cached answer, and a handoff note. Deleting the source row leaves those descendants behind unless the system knows where they came from.

Attach source identifiers to derived records. Maintain a reverse index from source to descendants. A removal request can then invalidate retrieval immediately and schedule physical cleanup of the remaining copies.

For a small system, explicit lineage fields and a background job may be enough. The important requirement is that the cleanup can be checked. “We removed it from the vector store” says nothing about a summary already copied into another collection.

Backups, audit records, and external exports need their own retention rules. Do not promise instant physical erasure from every copy unless the storage design can support it. The immediate guarantee may instead be that the material cannot be retrieved for new work.

## Test correction, not just recall

A memory test suite should contain a fact, a correction to that fact, and a task that depends on the corrected value. Add a revoked source and a deleted source. Confirm that neither appears in the next context pack.

Also test conflicting sources. The most recently observed text may be an outdated document that was re-imported yesterday. Observation time is not the same as the time a fact became true.

The earlier [living-knowledge essay](/agentic-ai-powertools/writing/ai-second-brain-living-knowledge) asks how knowledge can accumulate usefully. This is the maintenance half of that question. A system that remembers everything but cannot reliably revise or remove anything becomes harder to trust with every successful ingestion.

The [context-pack showcase](/agentic-ai-powertools/showcase/?project=context-pack-builder) makes freshness and exclusion decisions inspectable. It is a small offline example, but the same question scales: what evidence permits this memory to participate in the next decision?

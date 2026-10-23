---
title: "What should an agent leave behind when it finishes?"
slug: "what-belongs-in-work-receipt"
date: "2026-10-10"
tag: "Agent systems"
tagClass: "ai"
featured: true
status: "open"
sidebarText: "Receipts for agent work"
relatedWriting: "agents-need-stop-rules"
---

A final answer is a poor handoff when someone needs to inspect an agent’s work a week later. The useful details are usually spread across a diff, test output, a tool trace, and a conversation that contains several abandoned plans.

I would like a compact work receipt: the requested outcome, artifact versions, checks performed, approvals used, and unresolved external effects. Each claim should point to evidence. A second agent should be able to verify the receipt without accepting the first agent’s summary on trust.

There is a tension between completeness and usefulness. Keeping every intermediate thought creates noise and can retain sensitive data. Keeping only the final result makes it hard to explain a questionable decision. The receipt should capture observable actions and evidence, with deliberate retention rules, rather than expose an unfiltered conversation.

The question I have not settled is how much of this should be portable between tools. A common envelope could help with identity and artifact references. The meaning of “verified” will probably remain specific to the task. A passing code check, a delivered email, and a reconciled payment need different evidence.

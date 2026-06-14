---
title: "Why I stopped calling it technical debt and started calling it design drift"
slug: design-drift-not-technical-debt
category: Architecture
date: "2026-04-28"
readTime: "9 min read"
excerpt: "The framing of debt implies intention to repay. Most of what we call tech debt is entropy."
theme: "Debt implies intention. What we actually have is drift — a slow departure from the architecture the system was meant to be."
---

The framing of debt implies intention. You borrowed something with a plan to repay it. Most of what we label technical debt was never a deliberate borrowing — it was a series of decisions made under incomplete information that, in aggregate, pushed the system away from an architecture that would have served it better.

### Drift is a more accurate mental model

Design drift describes what actually happens. A system starts with a coherent conceptual model — a set of invariants, boundaries, and conventions that form its architectural identity. Over time, requirements change. New engineers join who were not present for the original design conversations. Shortcuts accumulate in areas where the original abstractions did not anticipate current needs. The system drifts from its original design intent.

The important distinction: debt implies a conscious trade-off. Drift implies gradual, often unnoticed divergence. The former suggests a ledger you can audit. The latter suggests a navigation problem — you need to periodically check whether you are still on course.

### The three types of drift I see most often

#### 1. Conceptual drift

The mental model of what a component "is" diverges across the team. Service A was designed as a data gateway, but over time it accumulated business logic until it became an implicit orchestrator. No single commit made this choice — it happened one expedient addition at a time. The architecture diagram still shows a gateway, but the code has drifted into something else entirely.

#### 2. Boundary drift

Service boundaries were drawn around one set of domain concepts, but the domain evolved. What was once a clean bounded context now has tentacles reaching into three other contexts. The boundaries are still enforced at the API level, but semantically they no longer match how the team thinks about the domain. This is the most expensive drift to correct because it often requires re-partitioning data.

#### 3. Convention drift

The team agreed on patterns — how errors are handled, how configuration is managed, how services communicate. Over time, new patterns emerge in newer code while older code retains the original patterns. Now you have two (or three, or four) ways of doing the same thing, and an engineer cannot predict which pattern a given service uses without reading the code.

### Why the debt metaphor is actively harmful

Calling it debt creates a false sense that it is manageable through allocation of repayment capacity — "sprint tax" or "tech debt sprints." But drift is not repaid in increments. It is corrected through realignment — a fundamentally different activity that requires understanding the desired end state, not just cleaning up what is messy.

Worse, the debt metaphor encourages a blame-free framing that removes agency. "We have debt" implies it accumulated passively. "We have drifted" implies we can navigate back — and that navigating is an active, ongoing responsibility rather than a periodic cleanup activity.

### What I do instead: Architecture alignment sessions

I run periodic architecture alignment sessions — not to audit blame, but to ask a specific set of questions:

- **What was this system designed to be?** Articulate the original intent, even if it was never written down.

- **What has it become?** Describe the current reality without judgment.

- **Is the drift intentional?** Sometimes drift reflects legitimate evolution. If so, update the design intent to match reality.

- **Where is the drift harmful?** Identify specific places where the divergence causes confusion, bugs, or velocity loss.

- **What is the correction path?** Not "refactor everything" — but specifically, what moves the system from where it is toward where it should be, given what we know now?

The output is not a backlog of tickets. It is an updated architectural narrative — a shared understanding of where we are, where we want to be, and what the next meaningful step is. This is architectural leadership, not backlog management.

### Preventing drift in the first place

The most effective drift-prevention mechanism I have found is not process, tooling, or code review rigour. It is shared mental models. When every engineer on a team can explain why the system is shaped the way it is — not just what it does — they make daily decisions that preserve architectural coherence. Documentation helps, but it is a poor substitute for genuine understanding. The investment that pays off most is spending time teaching architecture rather than just enforcing it.

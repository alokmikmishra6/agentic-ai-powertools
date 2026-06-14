---
title: "On the difference between knowing a system and understanding it"
slug: knowing-vs-understanding-system
category: Reflection
date: "2026-03-24"
readTime: "10 min read"
excerpt: "You can spend a year on a codebase and still not understand it. Understanding is about mental models, not familiarity."
theme: "Knowing a system means navigating it. Understanding means predicting its behaviour under novel conditions."
---

You can spend a year working on a codebase and still not understand it. This is one of the more uncomfortable truths in software engineering. Familiarity — knowing where things are, which files to open, which services to restart — is not the same as understanding. Understanding means you can predict how the system will behave under conditions you have never observed.

### Familiarity is not a model

Knowing a system means being able to navigate it. You know which service handles authentication. You know the deployment pipeline. You can find the bug, fix it, and ship a patch. This is valuable operational knowledge, but it is not understanding.

Understanding a system means holding a mental model of its behaviour — one accurate enough to predict outcomes in scenarios you have not yet encountered. When a new load pattern arrives, when a downstream dependency fails in an unexpected way, when two race conditions interact — understanding is what lets you predict what will happen before you look at the logs.

The distinction matters because most day-to-day engineering rewards familiarity. You can be productive on a codebase you do not truly understand. You fix bugs, ship features, and pass code reviews. The gap between familiarity and understanding only becomes apparent during incidents, design decisions, and migrations — the moments when prediction matters more than navigation.

### How understanding is built

Understanding is built through a specific kind of engagement with a system. It requires asking "why" more often than "what." Why is this service separate from that one? Why does this data flow through a queue rather than a direct call? Why is this timeout set to 30 seconds and not 5?

The answers to these questions reveal the forces that shaped the system — the constraints, trade-offs, and historical context that produced the current architecture. Without this context, you are operating on a system whose shape is arbitrary to you. With it, the shape becomes legible — and you can reason about whether it still serves its purpose.

I have found three activities that build understanding faster than anything else:

- **Drawing the system from memory.** Not copying an architecture diagram — drawing what you believe the system to be, then comparing it against reality. The gaps between your drawing and the actual system are exactly the places where your understanding is weakest.

- **Predicting before investigating.** When a bug report arrives, before looking at logs or code, write down what you think is happening and why. Then investigate. The delta between your prediction and reality calibrates your mental model.

- **Explaining to someone who will push back.** Explaining a system to a sharp colleague — one who asks uncomfortable questions — forces you to confront the parts you have glossed over. If you cannot explain why a design choice was made, you do not understand it; you have merely accepted it.

### Why this matters for architecture

Good architectural decisions require understanding, not just knowledge. When you propose splitting a monolith into services, you need to understand the coupling patterns — not just know where the code boundaries are. When you choose between eventual consistency and strong consistency, you need to understand the failure modes of each under your specific workload — not just know the theoretical trade-offs.

This is why architecture decisions made by people who are new to a system are often subtly wrong. They have knowledge — they can read the code, trace the flows, identify the bottlenecks. But they lack the understanding that comes from having seen the system behave under stress, from knowing which assumptions are load-bearing and which are incidental.

### The organisational dimension

Understanding is not evenly distributed across a team. In most organisations, deep understanding of critical systems is concentrated in one or two people. This is an organisational risk that rarely appears on risk registers. When those people leave — and they will eventually leave — the organisation does not lose knowledge (the code is still there, the documentation still exists). It loses understanding. And understanding cannot be transferred through documentation alone; it requires shared experience, pairing, and sustained engagement.

The most valuable thing a senior engineer can do is not write code — it is transfer understanding. Explain the why, not just the what. Make the forces visible. Turn implicit knowledge into shared mental models. This is invisible work, and it is the work that prevents systems from becoming opaque to the teams that maintain them.

### Understanding as a practice

Building understanding is slow and cannot be shortcut. You cannot read your way to understanding a complex system any more than you can read your way to understanding a city. You have to live in it — get lost, make wrong turns, discover why the streets are laid out the way they are. The investment is time, and the return is judgment. This is the compound interest of engineering experience: not more knowledge, but deeper understanding that lets you make better decisions faster.

---
title: "Close to two decades in software: what I wish I had understood earlier"
slug: fourteen-years-software
category: Reflection
date: "2025-09-22"
readTime: "14 min read"
excerpt: "A reflection on compounding mistakes, compounding judgment, and what it actually means to be good at this work."
theme: "Most of what I know about software I learned by getting things wrong. Compounding mistakes become compounding judgment."
---

Most of what I know about software I learned by getting things wrong. Not catastrophically — though there have been a few of those — but in the slow, accumulative way that builds judgment. Every system I built that turned out to be over-engineered, every migration I planned too optimistically, every time I optimised for the wrong constraint — these failures compound into something that looks, from the outside, like experience. From the inside, it feels more like a slowly-updating model of how things actually work.

### The compounding effect of small decisions

Early in my career I thought the consequential decisions were the architectural ones: which database to use, how to partition services, which framework to adopt. I now think the more consequential decisions are the small ones made daily by every engineer on the team. How a function is named. Whether an edge case is handled or deferred. How an error message is worded. Whether a test is written or skipped.

These decisions compound. A hundred small good decisions produce a system that is pleasant to work in — where the next change is easy because the last hundred changes were made with care. A hundred small careless decisions produce a system where every change is a negotiation with accumulated friction. The difference between these two outcomes is not visible in any single commit. It is only visible over months.

### Communication is not a soft skill

The clearest line I can draw between engineers who have a large impact and those who have a modest one is communication. Not charisma — communication. The ability to explain a technical decision in terms that non-technical stakeholders can act on. The ability to write a design document that anticipates questions and addresses them. The ability to disagree with a colleague's approach without making them defensive.

I used to think this was a nice-to-have. I now think it is the meta-skill that determines how much of your technical ability actually reaches the organisation. An engineer with brilliant technical judgment who cannot communicate it effectively has the same organisational impact as an engineer with mediocre judgment who communicates it clearly. The output — the decisions that actually get made — is a function of both judgment and communication.

### The systems you do not build matter more

The most valuable thing a senior engineer does is prevent unnecessary systems from being built. Every system that exists must be maintained, monitored, debugged, and eventually migrated or decommissioned. The cheapest system — in total cost of ownership — is the one that was never built because someone identified that the problem could be solved with existing infrastructure, or that the problem did not actually need to be solved.

This is counterintuitive in an industry that celebrates building. But after two decades, I am certain: the highest-leverage technical decision is often "we don't need this." It requires confidence and political capital to make this argument, because saying no is less visible than saying yes. But it is often the right answer.

### Judgment is calibrated pessimism

Engineering judgment is not optimism or pessimism — it is calibrated pessimism. It means knowing which things will probably go wrong, how badly, and whether the cost of prevention is justified. Early in your career, everything seems risky (because you have not seen enough to calibrate). Later, you develop an instinct for which risks are real and which are theoretical.

The dangerous middle ground is when you have enough experience to feel confident but not enough to be well-calibrated. You have seen some things work, and you over-generalise. "We used Kafka at my last company and it worked great" becomes an argument for Kafka in contexts where it is inappropriate. Genuine calibration requires a wider sample — seeing the same pattern succeed in one context and fail in another, and understanding why.

### Speed and quality are not trade-offs

One of the most persistent myths in software engineering is that you can either move fast or maintain quality. After almost two decades, I am convinced this is false. The teams I have seen that move fastest are the teams with the highest quality standards — because they spend less time debugging, less time on rework, and less time coordinating around fragile systems.

The trade-off is not speed vs. quality. It is short-term speed vs. sustained speed. You can move fast this week by cutting corners. But next month, those corners will slow you down more than the time you saved. The compounding math always wins.

### People rotate; systems persist

Over a long enough timeline, every person on the team will leave. The system remains. This means the system must be designed not for the people who built it — who understand its quirks, remember its history, and can navigate its undocumented assumptions — but for the people who will inherit it. People who have no context, no relationship with the original authors, and no patience for systems that are confusing without good reason.

Designing for future maintainers is an act of professional empathy. It means writing code that explains itself. It means documenting the "why" even when the "what" is clear. It means choosing boring, predictable patterns over clever, efficient ones. It means accepting a higher up-front cost for a lower lifetime cost.

### What it actually means to be good at this

After close to twenty years, I think being good at software engineering means three things:

- **Accurate prediction.** You can predict, before building, which approaches will work and which will create problems later. This is judgment, and it comes only from accumulated experience — both success and failure.

- **Appropriate response.** You match the weight of your response to the weight of the problem. You do not over-engineer simple things or under-engineer complex ones. You know when to be careful and when to be fast.

- **Sustainable pace.** You build systems and teams that can maintain quality and velocity indefinitely — not just for a sprint or a quarter, but for years. This means investing in people, in tooling, in maintainability, and in the boring infrastructure that keeps the interesting work possible.

None of this is glamorous. None of it makes for a good conference talk. But it is what distinguishes engineers who build things that last from engineers who build things that need to be replaced.

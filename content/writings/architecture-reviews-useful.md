---
title: "How I run architecture reviews that engineers actually find useful"
slug: architecture-reviews-useful
category: Leadership
date: "2025-02-18"
readTime: "10 min read"
excerpt: "Most architecture reviews are either rubber-stamps or interrogations. Neither produces better systems."
theme: "Most architecture reviews are either rubber-stamps or interrogations. Neither produces better systems."
---

Most architecture reviews are either rubber-stamps or interrogations. The rubber-stamp review is a formality — the design is already decided, the review is a checkbox, and the reviewers provide polite comments that change nothing. The interrogation review is a power dynamic — a senior architect cross-examines the presenter, finds flaws, and sends them back to iterate. Neither produces better systems. One produces resentment; the other produces theatre.

### The format I have settled on

After years of experimenting, I have converged on a three-phase format that consistently produces useful outcomes. The key insight: the review is not about the reviewer demonstrating expertise. It is about the team making a better decision.

#### Understanding phase (40% of the time)

Before any critique, I ask questions until I can explain the proposed design back to the presenter in my own words. This is not performative — it genuinely surfaces misunderstandings on both sides. Often, the act of explaining the design to an outsider reveals assumptions the team has not made explicit.

Questions I ask in this phase:

- "Walk me through the critical user journey end-to-end. Which components are involved, and what is the data flow?"

- "What are the top three constraints that shaped this design? What would you do differently without those constraints?"

- "What alternatives did you consider, and why did you reject them?"

- "Who are the users of this system — both human users and system consumers — and what are their performance expectations?"

This phase serves a dual purpose: it builds my understanding, and it gives the presenter an opportunity to articulate their thinking. Often, the process of explaining reveals gaps that the presenter catches themselves — before I say anything.

#### Trade-offs phase (30% of the time)

Every design is a set of trade-offs. In this phase, I ask the presenter to articulate what was given up. Not as a gotcha — but because trade-offs that are explicit and intentional are fine. Trade-offs that are accidental or invisible are risks.

The questions:

- "What does this design optimise for? What does it sacrifice?"

- "Where is the complexity in this system concentrated? Is that intentional?"

- "What would make this design the wrong choice? Under what conditions would you recommend a different approach?"

- "What is the cost of being wrong? If this turns out to be the wrong architecture, how expensive is it to change course?"

The most valuable outcome of this phase is surfacing trade-offs that the team made unconsciously. "We chose eventual consistency" is a trade-off. "We did not think about the consistency model" is a risk. The difference matters enormously.

#### Risk phase (30% of the time)

In the final phase, I ask what could go wrong. Not hypothetical edge cases or unlikely failure scenarios — but realistic risks given the team's context, timeline, and capabilities.

- "What is the most likely way this project fails? Not technically — organisationally. What could derail it?"

- "Which parts of this design are you least confident about? Where are you making bets rather than informed decisions?"

- "If you had to ship this in half the time, what would you cut? What is essential vs. desirable?"

- "Six months from now, what will you wish you had done differently?"

This phase often surfaces the real concerns that the team has been carrying privately. Giving them explicit permission to voice uncertainty — in a non-judgemental forum — often produces the most actionable insights of the entire review.

### What I never do

- **I never redesign their system in the review.** The review is not the venue for me to propose an alternative architecture. If I have fundamental concerns, the outcome is "let's schedule a working session to explore alternatives" — not a live redesign that the team has no investment in.

- **I never block on style or preference.** If the design is sound but I would have done it differently — that is not a blocking concern. Different engineers make different choices, and the goal is good outcomes, not uniformity.

- **I never ask questions I already know the answer to.** Socratic questioning as a power play is disrespectful. If I see a gap, I name it directly: "I notice the design does not address failover. Is that intentional, or is it a gap we should discuss?"

### The output

A useful architecture review produces one of three outcomes:

1. **Approval with confidence.** The design is sound, the trade-offs are intentional, and the risks are manageable. Proceed.

2. **Approval with identified risks.** The design is fundamentally sound, but there are specific risks that need mitigation plans. Proceed, but address these risks explicitly.

3. **Request for iteration.** There is a specific gap — usually a failure mode that has not been thought through, or a trade-off that is accidental rather than intentional — that needs more thinking before the team commits.

Notice: "rejected" is not an outcome. Architecture reviews that produce rejections are interrogations. If the design is fundamentally flawed, the failure happened upstream — in the problem framing, the requirement gathering, or the preliminary discussions that should have happened before a formal review. The review's job is refinement, not gatekeeping.

### Why this matters

The goal of architecture reviews is not to produce perfect designs. It is to produce teams that think architecturally — that consider failure modes, trade-offs, and operational concerns as part of their design process. A good review teaches the team to ask these questions of themselves next time. Over months, the quality of designs that come into review steadily improves, because the team has internalised the lens. That is the real measure of a useful review practice.

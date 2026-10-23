---
title: "When writing code gets faster, review becomes the work"
slug: "review-is-the-new-bottleneck"
category: "Leadership"
date: "2026-09-26"
featured: true
excerpt: "AI-assisted delivery changes where engineering time goes. Track accepted changes, review effort, and rework before celebrating output volume."
theme: "AI-assisted delivery changes where engineering time goes. Track accepted changes, review effort, and rework before celebrating output volume."
---

Imagine a team that doubles the number of pull requests it opens each week. The review queue doubles too. Changes wait longer, conflicts accumulate, and the people with the most system knowledge spend their afternoons checking generated tests.

The team has more output. Whether it has more useful delivery is a separate measurement.

One stage of the delivery system has sped up. The next stage still has the same capacity, so work accumulates between them.

## Measure the whole change

Start the clock when a task becomes ready and stop it when a reviewed change reaches its intended environment. Record active implementation time separately from time waiting for review. Include rework after review and follow-up fixes after release.

These distinctions matter because a coding assistant can save an author time while creating more work for a reviewer. It can also do the opposite: produce a careful test or explanation that makes review faster. A count of generated lines cannot distinguish those outcomes.

Choose a few comparable task types before making broad claims. A mechanical API rename and a change to a payment state machine place very different demands on reviewers.

## Be careful with the productivity headline

[METR’s February 2026 study update](https://metr.org/blog/2026-02-24-uplift-update/) explains why its later developer-productivity measurements became difficult to interpret. Participant selection, task selection, and concurrent agent use affected the experiment. The researchers did not present the results as a reliable estimate of the current overall speedup.

That is a useful warning against importing one percentage into a planning spreadsheet. It does not tell your team whether its current workflow is faster. Local measurement still needs clear task boundaries and an account of quality.

I would compare a small set of accepted changes over several weeks, including the review and rework they required. The goal is to find where assistance helps, and where its output needs a different review process.

## Make a change easier to inspect

An agent can prepare a useful review packet: the requirement it implemented, the behaviour that changed, the tests it ran, and the important things it did not verify. Each claim should point to an artifact the reviewer can inspect.

“Tests pass” is less useful than the command, result, and relevant failure case. “No behaviour change” should be supported by a narrow diff and appropriate checks, rather than a confident paragraph.

Keep the packet short enough to read. A thousand-word generated description can increase the review burden it was supposed to reduce.

## Limit work before adding reviewers

If every developer can launch several coding tasks, the team needs an explicit limit on work awaiting review. Otherwise the system turns reviewer attention into an unbounded buffer.

Finish a change before starting another one that depends on it. Split changes at meaningful behavioural boundaries. Route a high-risk change to the person who understands the failure mode, not merely the next available approver.

A second model can help find suspicious code or missing cases. Its report is another input to review. It does not establish that the original agent’s assumptions were correct, particularly when both received the same incomplete specification.

## Watch the quiet costs

Track how often a merged change needs a corrective follow-up, how long a reviewer spends reconstructing intent, and whether unfamiliar code is becoming harder to maintain. Those costs may appear weeks after the implementation time was saved.

The useful leadership question is where the saved time went. If it went into better tests, smaller queues, and more considered design, the workflow is improving. If it went into starting more work than the team can examine, output has outrun the system that makes it dependable.

---
title: "The agent said it was done. Check the state."
slug: "evaluate-the-state-not-the-story"
category: "AI Systems"
date: "2026-08-29"
featured: false
excerpt: "A convincing final answer is a weak test oracle. Grade the changes an agent actually made, including the ones it should have avoided."
theme: "A convincing final answer is a weak test oracle. Grade the changes an agent actually made, including the ones it should have avoided."
---

Suppose a scheduling agent replies, “Your appointment is confirmed for Tuesday.” The database contains a reservation for Wednesday. The final message is concise, polite, and wrong in a way that matters.

An evaluation that grades only the reply can miss this entirely. The state transition is the product. The sentence is its report.

[Anthropic’s January 2026 evaluation guide](https://www.anthropic.com/research/demystifying-evals-for-ai-agents) distinguishes an agent’s transcript from the final state of its environment. That distinction is a useful starting point for building tests that survive changes in prompting and model choice.

## Write the postcondition first

For the appointment task, define success before running the agent: exactly one active reservation, for the requested customer, at the requested time, with no unauthorized notification recipients.

Some checks are positive. The reservation must exist. Others are negative. No second reservation should have been created during a retry. Both belong in the grader.

A final-answer assertion can still be useful. It might check that the agent does not claim success when the reservation is pending. It should not replace a query against the authoritative test state.

## Give the grader independent evidence

A tool trace that says “reservation created” is evidence from the execution path being tested. If the same tool is broken, its trace and return value can agree while the database remains unchanged.

Inspect the sandbox database or a separate test endpoint after the run. Keep the grader’s credentials and expected values outside the agent’s writable workspace. Otherwise the agent can accidentally modify its own exam, even without any intention to exploit it.

For a coding task, this means preserving held-out tests or checking externally observable behaviour. A green test suite that the agent has just weakened deserves a different interpretation from an independently maintained acceptance suite.

## A clean fixture prevents a misleading pass

Reset the environment for each trial. If yesterday’s reservation remains in the fixture, today’s failed agent might receive credit for it. If a previous trial exhausted a quota, the next trial might fail for an unrelated reason.

Record the fixture revision, model configuration, tool version, and timeout policy with each result. These are part of the experiment. When one changes, the score no longer describes exactly the same system.

For nondeterministic runs, keep the per-trial results. Three successes out of five is useful information. Averaging it into a rounded “quality score” can hide the fact that two users would have had no appointment.

## Keep policy failures visible

Suppose an agent books the correct appointment but reads a different customer’s record on the way. A single success percentage has nowhere obvious to put that failure.

Use separate fields for task completion, unauthorized access, duplicate effects, and cost. A release gate can require completion above a chosen threshold and zero observed unauthorized writes in the suite. Zero observed violations is still only a statement about those cases, not a proof of safety.

The [outcome-grader showcase](/agentic-ai-powertools/showcase/?project=trace-outcome-grader) runs four synthetic order fixtures. One contains a persuasive success message without a persisted order. Another contains a duplicate. It demonstrates the grading boundary without requiring a model subscription.

## Save the failures you can explain

A failed trial is most useful when it leads to a reproducible case. Preserve a minimal fixture, the relevant trace, and the violated postcondition. Remove customer data before adding a production-derived example to the suite.

Over time, that collection becomes a record of what the system has learned to handle. Its value comes from the specificity of the failures. A dashboard full of green circles cannot tell the same story.

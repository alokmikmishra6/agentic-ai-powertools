---
title: "Before giving an agent more tools, give it a stopping rule"
slug: "agents-need-stop-rules"
category: "AI Systems"
date: "2026-10-17"
featured: true
excerpt: "Long-running agents need explicit limits for uncertainty, repeated failure, cost, and authority. A good stop produces a useful handoff."
theme: "Long-running agents need explicit limits for uncertainty, repeated failure, cost, and authority. A good stop produces a useful handoff."
---

Suppose an agent retries a failing deployment. The error changes slightly, so it edits the configuration and tries again. It then changes a dependency version. Twenty minutes later, the original deployment issue has become three separate changes that nobody asked for.

Another tool would not have resolved the uncertainty. It needed a rule that said when the available evidence no longer justified another attempt.

A stopping rule is part of the task contract. It tells the execution layer when to complete, ask for help, pause, or abandon an unsafe path. Leaving that decision entirely inside the prompt makes it difficult to enforce consistently.

## Name the reasons to stop

A useful starting set includes repeated failure without new evidence, an exhausted budget, missing authorization, conflicting requirements, and an external action whose outcome is unknown.

These reasons call for different responses. A budget limit may justify saving a checkpoint. Missing authorization requires an approval request. An uncertain payment result calls for reconciliation. Treating them all as “try again later” loses the information needed to recover safely.

For a deployment assistant, a policy might allow two attempts with the same normalized error, require a fresh diagnostic before a third, and prohibit dependency changes outside the approved diff. The numbers are illustrative. The policy should match the operational risk of the task.

## Count progress outside the model

The agent can describe what it believes it learned. The runner should also observe whether anything material changed: a test now passes, a required artifact exists, or a diagnostic eliminated a hypothesis.

A different explanation of the same failure is not necessarily progress. Neither is rewriting a plan after every retry.

Keep a structured record of attempted operations, their results, and the evidence available before each decision. Compare error categories rather than raw strings when timestamps and request IDs make identical failures look different.

This does not require a universal measure of agent progress. A narrow workflow can define a handful of concrete milestones and check them directly.

## Budgets need more than a token counter

A task can spend little on inference while creating a large review burden or leaving many external resources behind. Track the resources that matter for the workflow: elapsed time, tool calls, money, files changed, pending approvals, and unreconciled mutations.

Some limits are soft. The agent may request more time with a useful explanation. Others are hard, such as writing outside the authorized repository or exceeding an approved spending cap. Enforce hard limits in the tool layer, where a prompt cannot reinterpret them.

## Make the handoff worth reading

Stopping is useful when the next person can continue without replaying the entire conversation. Save the intended outcome, completed work, remaining uncertainty, relevant artifact versions, and any action with an unknown external result.

Include one concrete next step. “Investigate further” is vague. “Check whether deployment operation 742 completed before retrying” tells an operator where to begin.

The handoff should distinguish verified observations from the agent’s hypotheses. Both can be valuable, but presenting them in the same voice encourages the next actor to treat a guess as established state.

## Test a graceful stop

A success-only evaluation encourages a system to keep moving until it can claim completion. Add cases where the correct result is a pause: an expired approval, inconsistent source documents, a tool that times out after accepting a write, or a retry budget that has been exhausted.

Check that the agent stops before the prohibited action and leaves the required handoff. A polite refusal after the mutation is too late.

Pair this with [outcome-based evaluation](/agentic-ai-powertools/writing/evaluate-the-state-not-the-story) and [versioned approval](/agentic-ai-powertools/writing/approval-is-a-versioned-decision). Together they define what success looks like, what authority permits, and when the system must return control. That is a more useful foundation for autonomy than an ever-growing tool menu.

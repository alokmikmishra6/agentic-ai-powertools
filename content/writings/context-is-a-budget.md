---
title: "What belongs in an agent’s context?"
slug: "context-is-a-budget"
category: "AI Systems"
date: "2026-07-25"
featured: false
excerpt: "A practical way to decide what an agent should read, what it can fetch later, and what should never survive a handoff."
theme: "A practical way to decide what an agent should read, what it can fetch later, and what should never survive a handoff."
---

Consider a support agent investigating a failed export. Its context contains the customer’s last twenty conversations, the complete API reference, three old incident reports, and a freshly retrieved permissions record. The permissions record is the only item that explains the failure. It occupies six lines near the bottom.

Collecting more information has become a substitute for deciding what matters. The agent has plenty to read. Nobody has decided what deserves its attention.

[Anthropic’s context-engineering article](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) describes context as a resource that needs active management across a run. The practical question for an application team is who owns those decisions, and how they can be inspected when an answer goes wrong.

## Start with the next decision

For the export task, the next decision is whether the customer has permission to export this dataset. That calls for a current entitlement check, the dataset identifier, and the relevant policy. A discussion from six months ago about dashboard colours contributes nothing.

I would give each workflow step a small context contract. It names the decision, required evidence, freshness rules, and a fallback when evidence is missing. This can be a typed object in code. It does not need another platform.

```json
{
  "decision": "may_export",
  "required": ["dataset_id", "current_entitlements", "export_policy"],
  "freshness": {"current_entitlements": "fetch_at_decision_time"},
  "missing_evidence": "stop_and_request_access_check"
}
```

The contract also makes a useful review question possible: why is this particular document in the prompt? If the answer is merely that retrieval returned it, the selection policy needs work.

## Separate what must fit from what would be useful

A context pack needs room for instructions, evidence, conversation, tool results, and the model’s response. Spending the entire allowance on retrieved text leaves the rest of the workflow competing for space.

Reserve mandatory items first. Then choose optional material according to the current decision. Keep a manifest of included and excluded source IDs. An exclusion reason such as “superseded policy” is more useful than a silent truncation at an arbitrary character count.

Token estimates also deserve honesty. A word count can support a rough offline demonstration. It cannot enforce a model’s actual context limit. Production admission should use the tokenizer or token-counting interface for the model being called, with room for tool schemas and response generation.

## A summary can lose the exception

Suppose the original policy says that exports are allowed except for datasets under legal hold. A summary that says “exports are generally allowed” has removed the condition that matters most.

For high-consequence decisions, preserve the exact governing clause and its source revision. Summarize background explanation more aggressively. These two kinds of text should not share the same compression policy.

The handoff between agents needs similar care. Pass the selected dataset ID, checked policy revision, unresolved questions, and evidence references. A fluent paragraph about the investigation is pleasant to read, but it can hide which checks actually happened.

## Test the pack before testing the answer

A useful test fixture contains an old policy that permits an action and a newer policy that denies it. Another contains a relevant document whose access was revoked. A third omits the required entitlement record entirely.

Check which sources enter the pack before scoring the model’s reply. If the retrieval layer silently selects the old policy, changing the system prompt is an expensive way to debug a data-selection defect.

The important output of context engineering is a defensible explanation of what the model was allowed to know at that moment. A smaller prompt may be a welcome side effect. The real benefit is being able to trace a decision back to the evidence that supported it.

---
title: "What exactly did the human approve?"
slug: "approval-is-a-versioned-decision"
category: "AI Systems"
date: "2026-08-15"
featured: false
excerpt: "Approval is meaningful only when it stays attached to the exact action, target, and evidence a person reviewed."
theme: "Approval is meaningful only when it stays attached to the exact action, target, and evidence a person reviewed."
---

Suppose an agent prepares an email to a supplier. A reviewer approves the draft. Before sending, the agent refreshes its context and changes the recipient list to include an external consultant.

The workflow still has an approval flag. The action no longer matches the approved proposal.

Every individual step looks reasonable, which makes the failure easy to miss. The reviewer clicked a real button. The agent used a real tool. The missing piece is an explicit relationship between the approved content and the eventual mutation.

## Store the decision, not just the click

An approval record should identify the actor, tool, target, arguments, and expiry. It should also identify the revision of the evidence that made the proposal reasonable. For a database migration, that could include the schema revision and the inspected environment. For an email, it includes the recipient list and exact body.

Compute a digest of a deterministic representation of the proposal. Before execution, reconstruct that representation and compare it with the approved digest. A changed recipient, amount, destination, or body requires a new decision.

A digest provides equality checking. It does not prove who approved anything. The approval record still needs authenticated creation, protected storage, and an authorization check at execution time.

## Show the part that can hurt

Approval interfaces often give the most space to the agent’s explanation. The dangerous part may be a single parameter hidden beneath it.

Put the destination, scope, and irreversible effects next to the approval control. Make additions easy to distinguish from removals. If an operation affects 400 records, show the selection rule and a preview of the affected set. “Update customer records” is too vague to support a useful decision.

There is a design tradeoff here. A large preview can overwhelm a reviewer. A tiny preview can conceal the consequence. Group changes by risk and make the highest-risk fields visible without expansion.

## Recheck the world at execution time

Even unchanged arguments can become unsafe. A user’s access may have been revoked. An account may have entered a restricted state. A document revision may have changed the meaning of the proposed edit.

Bind approval to a relevant version or precondition, then fail closed when it no longer holds. For an HTTP resource, a conditional update may provide that boundary. For a database, use a transaction with a version check. Where no atomic precondition exists, document the race instead of pretending that a preflight read eliminates it.

MCP’s [security guidance](https://modelcontextprotocol.io/specification/2025-11-25/basic/security_best_practices) makes related distinctions around consent, client identity, and scope. An application still has to define the business action its own approval authorizes.

## Retries should preserve the receipt

A single-use approval record is helpful, but consuming it before sending a request creates a recovery problem. A crash can leave a consumed approval and an unknown external outcome.

Track execution separately from approval: proposed, approved, executing, completed, or uncertain. Pair the operation with a destination-supported idempotency mechanism where one exists. An uncertain result should enter reconciliation, not quietly mint another approval.

The small [approval-gate showcase](/agentic-ai-powertools/showcase/?project=approval-receipt-gate) demonstrates argument binding and replay rejection in memory. It deliberately leaves external execution out. That boundary keeps the example honest and makes the remaining production work visible.

A useful approval system lets a reviewer answer one plain question after an incident: “Did this action match what I agreed to?” If answering requires reconstructing a conversation from fragments, the approval record is too weak.

---
title: "MCP went stateless. Your workflow did not."
slug: "mcp-stateless-business-state"
category: "Architecture"
date: "2026-08-01"
featured: false
excerpt: "The July MCP revision simplifies transport state. Durable operations, retries, and ownership still belong in the application."
theme: "The July MCP revision simplifies transport state. Durable operations, retries, and ownership still belong in the application."
---

A network connection disappears just after a tool accepts a request to create a support ticket. The client reconnects. Should it send the request again?

That question survives every transport redesign. A protocol can tell the client how to communicate. Only the application can establish whether the ticket already exists.

The [MCP specification dated July 28, 2026](https://modelcontextprotocol.io/specification/2026-07-28/changelog) removes protocol-level sessions and the initialization handshake, moves protocol version and client capabilities into request metadata, and introduces server discovery. It also removes stream resumability. These are substantial changes for integration code. They do not make a business operation stateless.

## Put state where it can be recovered

A ticket-creation workflow has at least three identities: the authenticated caller, the logical operation, and the individual network attempt. Combining them into a session ID makes recovery difficult.

Give the logical operation a durable identifier before the first attempt. Bind it to the caller and a canonical description of the requested change. Each network retry can have a fresh request ID while referring to the same logical operation.

For a hypothetical ticket service, the record might contain:

```text
operation: create-ticket-742
owner: support-team-a
payload_digest: 08d1...
state: accepted | executing | completed | uncertain
result: ticket-918
```

The digest is there to reject accidental reuse of an operation ID with different arguments. It does not authenticate the caller. Authorization remains a separate check on every request.

## The uncertain state is worth keeping

A timeout is not proof that an operation failed. The ticket may exist even though its acknowledgement never reached the client.

If the downstream service supports an idempotency key, pass the logical operation identifier through according to that service’s contract. If it exposes a reliable lookup by external reference, reconcile against that reference. If it offers neither, record an uncertain outcome and escalate instead of blindly repeating the mutation.

This costs some convenience. It also avoids teaching a recovery system to create duplicate work whenever it loses contact with the thing it is controlling.

A local “sent” flag written before an external request cannot prove delivery. A flag written afterwards leaves a crash window. The destination’s semantics decide which guarantees are possible; a wrapper cannot manufacture exactly-once execution around an arbitrary API.

## Handles need owners and expiry

The revised protocol allows application state to be represented through explicit handles. A handle is useful for a long-running export, but possession of its string should not automatically grant access to another customer’s export.

Store the owner, creation time, expiry, and permitted operations with the handle. Recheck authorization when it is used. Decide what a client should see after expiration and what survives a server restart. These are application decisions that deserve tests alongside the happy path.

## Migrate with a failure matrix

Before changing a gateway, test old and new client versions against the server versions you actually support. Include discovery failure, unsupported versions, a disconnect after acceptance, and a replay with changed arguments.

The goal is to separate protocol compatibility from business correctness. A migration can pass every transport test and still duplicate a ticket on retry.

Stateless transport is attractive because it reduces connection-specific machinery. The application should use that simplification to make its remaining state more explicit: who asked, what was accepted, what changed, and how a disconnected client can find out.

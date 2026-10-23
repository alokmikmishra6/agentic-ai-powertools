---
title: "Who gets to decide what an agent forgets?"
slug: "who-owns-memory-expiry"
date: "2026-08-22"
tag: "Agent systems"
tagClass: "ai"
featured: true
status: "open"
sidebarText: "Memory and ownership"
relatedWriting: "agent-memory-needs-delete-path"
---

An agent can remember a preference after one conversation. Deciding when that preference should stop influencing its work is less obvious. Does the user own the expiry rule, does the application choose it, or does the agent infer that the preference has changed?

My current starting point is to separate preferences from operational facts. A writing preference can remain until corrected. A deployment destination needs a current source of truth. Treating both as entries in one memory store hides a useful distinction.

The unresolved part is derived memory. If a user removes a source conversation, should every summary influenced by it disappear too? Keeping everything makes correction ineffective. Deleting every descendant can discard useful facts that also have independent support. A system needs enough provenance to distinguish those cases.

I would test this with a small set of conflicting, corrected, and revoked sources before adding more retrieval features. The experiment should show which records remain eligible and why. Recall is easy to demonstrate. A reliable correction path would make a stronger case for persistent memory.

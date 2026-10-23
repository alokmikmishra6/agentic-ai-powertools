---
title: "An approval receipt that rejects changed arguments"
slug: "approval-receipt-gate"
date: "2026-08-08"
tag: "Agent permissions"
relatedWriting: "approval-is-a-versioned-decision"
tagClass: "ai"
featured: true
lang: "python"
runnable: true
---

## Problem

A reviewer approves one action, then the arguments change before execution. This offline example checks that an approval receipt still matches the proposed action, actor, and validity window.

## Approach

Represent the proposed action as an immutable record, hash its deterministic JSON representation, and issue an in-memory receipt. The gate rejects changed arguments, a different actor, expired receipts, and replay. It performs no external mutation. The receipt issuer stands in for an authenticated approval service; this is not an authentication system or a distributed transaction implementation.

## Architecture

<!-- architecture -->
<pre>Proposed action → approved digest + actor + expiry → gate checks → consume receipt → permit local handoff</pre>

## Code

```python
from dataclasses import dataclass, replace
from hashlib import sha256
import json


@dataclass(frozen=True)
class Action:
    tool: str
    target: str
    amount_cents: int

    def digest(self):
        payload = json.dumps(self.__dict__, sort_keys=True,
                             separators=(",", ":"))
        return sha256(payload.encode()).hexdigest()


class ApprovalGate:
    """Single-process demonstration; callers cannot supply trusted receipts."""
    def __init__(self):
        self.receipts = {}

    def approve(self, receipt_id, actor, action, expires_at):
        # In a real service, only an authenticated approver can reach this.
        if receipt_id in self.receipts:
            raise ValueError("receipt already exists")
        self.receipts[receipt_id] = {
            "actor": actor, "digest": action.digest(),
            "expires_at": expires_at, "used": False,
        }

    def consume(self, receipt_id, actor, action, now):
        receipt = self.receipts.get(receipt_id)
        if receipt is None:
            return False, "unknown receipt"
        if receipt["used"]:
            return False, "already consumed"
        if receipt["actor"] != actor:
            return False, "wrong actor"
        if now >= receipt["expires_at"]:
            return False, "expired"
        if receipt["digest"] != action.digest():
            return False, "arguments changed"
        receipt["used"] = True
        return True, "approved"


def demo():
    gate = ApprovalGate()
    action = Action("refund", "order-42", 2500)
    gate.approve("receipt-1", "operator-a", action, expires_at=100)
    assert gate.consume("receipt-1", "operator-b", action, 50)[1] == "wrong actor"
    changed = replace(action, amount_cents=5000)
    assert gate.consume("receipt-1", "operator-a", changed, 50)[1] == "arguments changed"
    assert gate.consume("receipt-1", "operator-a", action, 100)[1] == "expired"
    assert gate.consume("receipt-1", "operator-a", action, 50) == (True, "approved")
    assert gate.consume("receipt-1", "operator-a", action, 51)[1] == "already consumed"
    print("5 checks passed: actor, arguments, expiry, acceptance, replay")


if __name__ == "__main__":
    demo()
```

## Run

```bash
# Download code from this page; Python 3.10+ and the standard library are sufficient.
python3 approval-receipt-gate.py
```

## Outcomes

- Five synthetic checks cover wrong actor, changed amount, exact expiry, successful acceptance, and replay rejection.
- Rejected checks leave the receipt available for a valid attempt.
- The example uses only the Python standard library and makes no network requests.

## Lessons

- A digest proves that arguments match; it does not authenticate the approver. Protect receipt issuance and storage in a real service.
- Consuming a receipt and invoking an external API are separate operations. Add durable execution state and destination-supported idempotency before using this pattern for real mutations.
- An in-memory dictionary provides no concurrency or restart guarantee. Production consumption needs an atomic transaction.


---
title: "An outcome grader that catches a convincing false success"
slug: "trace-outcome-grader"
date: "2026-09-05"
tag: "Agent evaluation"
relatedWriting: "evaluate-the-state-not-the-story"
tagClass: "ai"
featured: true
lang: "python"
runnable: true
---

## Problem

An agent can report success while leaving the wrong state behind. This small evaluator separates the final message from an independent snapshot of a synthetic order store.

## Approach

Define a task contract, then grade four isolated fixtures against it. The grader checks that exactly one new order exists for the requested customer and amount, and that pre-existing orders were preserved. The messages are deliberately untrusted. This is a deterministic grading example, not a benchmark of any model.

## Architecture

<!-- architecture -->
<pre>Task contract + before snapshot + after snapshot → independent assertions → named failures → pass or fail</pre>

## Code

```python
from copy import deepcopy


def grade(before, after, customer, amount_cents):
    errors = []
    before_by_id = {row["id"]: row for row in before}
    after_by_id = {row["id"]: row for row in after}
    if len(after_by_id) != len(after):
        errors.append("duplicate order ID")
    for order_id, original in before_by_id.items():
        if after_by_id.get(order_id) != original:
            errors.append("pre-existing order changed or removed")
    new = [row for row in after if row["id"] not in before_by_id]
    if len(new) != 1:
        errors.append("expected exactly one new order")
    elif (new[0]["customer"] != customer or
          new[0]["amount_cents"] != amount_cents or
          new[0]["status"] != "confirmed"):
        errors.append("new order does not match the contract")
    return {"passed": not errors, "errors": errors}


def demo():
    before = [{"id": "old", "customer": "other", "amount_cents": 100,
               "status": "confirmed"}]
    requested = {"id": "new", "customer": "reader", "amount_cents": 2500,
                 "status": "confirmed"}
    valid = deepcopy(before) + [requested]
    duplicate = deepcopy(valid) + [{**requested, "id": "new-again"}]
    tampered = deepcopy(valid)
    tampered[0]["amount_cents"] = 999
    fixtures = [
        ("correct state", valid, True),
        ("success message only", deepcopy(before), False),
        ("duplicate side effect", duplicate, False),
        ("unrelated order changed", tampered, False),
    ]
    for name, after, expected in fixtures:
        # This identical message is deliberately excluded from the grader.
        final_message = "Your order is confirmed."
        result = grade(before, after, "reader", 2500)
        assert result["passed"] is expected, (name, result)
        print(name + ": " + ("PASS" if result["passed"] else "FAIL"))
    print("4 fixture expectations passed")


if __name__ == "__main__":
    demo()
```

## Run

```bash
# Download code from this page; Python 3.10+ and the standard library are sufficient.
python3 trace-outcome-grader.py
```

## Outcomes

- The valid fixture passes; a success message without a new order fails.
- The duplicate and unrelated-write fixtures fail for observable state violations.
- All four fixture expectations are asserted locally without invoking a model or a paid service.

## Lessons

- A real grader should read authoritative sandbox state using credentials the agent cannot modify.
- These fixtures assume a valid, typed order schema. Production ingestion must validate malformed records before grading.
- A deterministic grader is useful for explicit postconditions. Ambiguous tasks still need a rubric and, sometimes, human judgment.


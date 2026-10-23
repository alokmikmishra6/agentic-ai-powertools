---
title: "A context pack with an explanation for every exclusion"
slug: "context-pack-builder"
date: "2026-10-03"
tag: "Context engineering"
relatedWriting: "context-is-a-budget"
tagClass: "ai"
featured: true
lang: "python"
runnable: true
---

## Problem

A retrieval pipeline can return relevant text that is stale, inaccessible, or too large for the current task. This offline pack builder makes each admission and rejection visible.

## Approach

Use a deliberately simple word budget so the example runs without dependencies. Reject expired or unauthorized sources, reserve all mandatory evidence, then admit optional items by priority. If required evidence is missing or cannot fit, fail the pack instead of silently dropping it. Real model limits require actual token counting, including prompt overhead and output allowance.

## Architecture

<!-- architecture -->
<pre>Candidate evidence → access + expiry checks → mandatory reservation → optional admission → pack + exclusion manifest</pre>

## Code

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Evidence:
    key: str
    text: str
    expires_at: int
    allowed: bool = True
    required: bool = False
    priority: int = 0


def build_pack(items, budget_words, now, required_keys=()):
    if budget_words < 0:
        raise ValueError("budget must be non-negative")
    if len({item.key for item in items}) != len(items):
        raise ValueError("duplicate source key")
    required_keys = set(required_keys)
    if required_keys - {item.key for item in items}:
        raise ValueError("required source missing")
    is_required = lambda item: item.required or item.key in required_keys
    eligible, excluded = [], {}
    for item in items:
        reason = ("access denied" if not item.allowed else
                  "expired" if now >= item.expires_at else None)
        if reason:
            if is_required(item):
                raise ValueError("required evidence unavailable: " + item.key)
            excluded[item.key] = reason
        else:
            eligible.append(item)
    required = [item for item in eligible if is_required(item)]
    optional = sorted((item for item in eligible if not is_required(item)),
                      key=lambda item: (-item.priority, item.key))
    words = lambda item: len(item.text.split())
    used = sum(words(item) for item in required)
    if used > budget_words:
        raise ValueError("required evidence exceeds budget")
    selected = list(required)
    for item in optional:
        if used + words(item) <= budget_words:
            selected.append(item)
            used += words(item)
        else:
            excluded[item.key] = "word budget"
    return {"sources": [item.key for item in selected],
            "text": "\n\n".join(item.text for item in selected),
            "words": used, "excluded": excluded}


def demo():
    items = [
        Evidence("policy", "Export requires current permission", 100, required=True),
        Evidence("entitlement", "Reader may export", 100, priority=10),
        Evidence("history", "An older unrelated conversation", 100),
        Evidence("stale", "Old policy", 50),
        Evidence("private", "Restricted notes", 100, allowed=False),
    ]
    result = build_pack(items, budget_words=7, now=50, required_keys={"policy"})
    assert result["sources"] == ["policy", "entitlement"]
    assert result["words"] == 7
    assert result["excluded"] == {
        "stale": "expired", "private": "access denied", "history": "word budget"}
    for candidates, budget in [(items, 3),
                               ([Evidence("required", "x", 50, required=True)], 7)]:
        try:
            build_pack(candidates, budget, now=50)
        except ValueError:
            pass
        else:
            raise AssertionError("required evidence must not be dropped")
    try:
        build_pack([], 7, now=50, required_keys={"policy"})
    except ValueError:
        pass
    else:
        raise AssertionError("an absent required source must fail")
    print(result)
    print("Admission, exclusion, and mandatory-evidence checks passed")


if __name__ == "__main__":
    demo()
```

## Run

```bash
# Download code from this page; Python 3.10+ and the standard library are sufficient.
python3 context-pack-builder.py
```

## Outcomes

- The seven-word fixture keeps policy and entitlement evidence and explains three exclusions.
- An expired mandatory source or insufficient mandatory budget raises an error.
- No network access, model API, tokenizer package, or billing account is required.

## Lessons

- Word counts demonstrate selection policy but cannot enforce a model token limit.
- Access flags are synthetic fixtures. A real pack builder must consult a trusted authorization service.
- Source identifiers and exclusion reasons belong in operational traces, while sensitive source text should follow the application’s retention policy.


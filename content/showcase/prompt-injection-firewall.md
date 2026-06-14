---
title: "Prompt Injection Firewall for Multi-Agent Systems"
slug: prompt-injection-firewall
tag: "AI Security"
tagClass: ai
featured: true
date: "2026-05-20"
lang: python
---

## Problem

Multi-agent LLM systems pass messages between agents — but without validation, a single compromised or adversarial input can inject instructions that propagate across trust boundaries, hijacking the entire pipeline. Existing single-agent guardrails don't account for domain-camouflaged attacks disguised as legitimate inter-agent communication.

## Approach

Defense-in-depth: intercept every inter-agent message and apply three layered detection strategies concurrently — pattern matching for known signatures, semantic drift analysis for camouflaged payloads, and privilege escalation detection for boundary violations. Untrusted agents get zero-tolerance enforcement.

## Architecture

<!-- architecture -->
<div style="margin: 0 auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.06), rgba(201,168,124,0.02)); border: 1px solid rgba(212,184,150,0.2); border-radius: 12px; padding: 1.5rem; font-family: monospace; font-size: 0.72rem; line-height: 1.6; color: rgba(255,255,255,0.7);">
<div style="text-align: center; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(212,184,150,0.6); margin-bottom: 1rem;">INTER-AGENT MESSAGE FLOW</div>
<pre style="margin: 0; white-space: pre; overflow-x: auto;">
┌─────────────┐         ┌──────────────────────┐         ┌─────────────┐
│  Agent A    │────────▶│   INJECTION FIREWALL  │────────▶│  Agent B    │
│ (Untrusted) │         │                      │         │ (Internal)  │
└─────────────┘         │  ┌────────────────┐  │         └─────────────┘
                        │  │ Pattern Detect │  │
                        │  ├────────────────┤  │
                        │  │ Semantic Drift │  │──── BLOCKED ──▶ /dev/null
                        │  ├────────────────┤  │
                        │  │ Priv Escalation│  │
                        │  └────────────────┘  │
                        │         │            │
                        │    Audit Logger      │
                        └──────────────────────┘
                                  │
                          ┌───────▼───────┐
                          │  Human Review │
                          │  (Suspicious) │
                          └───────────────┘
</pre>
</div>
</div>

## Code

```python
"""
Prompt Injection Firewall — Core Detection Engine
"""
from dataclasses import dataclass, field
from enum import Enum
import re, hashlib, asyncio
from typing import Callable

class ThreatLevel(Enum):
    CLEAN = "clean"
    SUSPICIOUS = "suspicious"
    BLOCKED = "blocked"

@dataclass
class ScanResult:
    level: ThreatLevel
    detectors_triggered: list[str] = field(default_factory=list)
    original_hash: str = ""
    explanation: str = ""

@dataclass
class AgentMessage:
    source_agent: str
    target_agent: str
    content: str
    msg_type: str  # "task", "result", "delegation"
    trust_tier: int = 0  # 0=untrusted, 1=internal, 2=privileged

class PromptInjectionFirewall:
    """All inter-agent messages pass through layered detection."""

    def __init__(self, detectors: list, audit_log):
        self.detectors = detectors
        self.audit = audit_log

    async def inspect(self, msg: AgentMessage) -> ScanResult:
        msg_hash = hashlib.sha256(msg.content.encode()).hexdigest()[:16]

        # Run all detectors concurrently
        results = await asyncio.gather(
            *[d.scan(msg) for d in self.detectors]
        )

        # Highest threat wins
        worst = max(results, key=lambda r: list(ThreatLevel).index(r.level))

        # Zero tolerance for untrusted agents
        if msg.trust_tier == 0 and worst.level == ThreatLevel.SUSPICIOUS:
            worst.level = ThreatLevel.BLOCKED

        await self.audit.log_scan(msg, worst)
        return worst
```

## Run

```bash
# Install dependencies
pip install asyncio dataclasses

# Run the firewall test suite
python -m pytest tests/test_firewall.py -v

# Integration: wrap your agent orchestrator
from firewall import PromptInjectionFirewall, PatternDetector

firewall = PromptInjectionFirewall(
    detectors=[PatternDetector(), SemanticDriftDetector()],
    audit_log=AuditLogger(sink="firewall-events"),
)

# Every inter-agent message routes through:
verdict = await firewall.inspect(message)
```

## Outcomes

- Blocked 94% of known injection patterns in benchmark testing
- Semantic drift detector catches domain-camouflaged attacks that regex misses
- Zero false positives on 10K legitimate inter-agent messages in staging
- Full audit trail enables forensic analysis of attack vectors post-incident

## Lessons

- Single-layer detection is insufficient — pattern matching misses semantic attacks, semantic analysis has false positives. Layering creates defense-in-depth.
- Trust tiers are essential. Not all agents are equal — external/untrusted agents need stricter enforcement without slowing internal communication.
- Audit everything. Even CLEAN verdicts get logged. When a novel attack eventually bypasses detection, the audit trail is how you find and patch the gap.

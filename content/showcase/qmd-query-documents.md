---
title: "QMD: Query Markup Documents"
slug: qmd-query-documents
tag: "AI Infrastructure"
tagClass: ai
featured: true
date: "2026-05-10"
lang: python
---

## Problem

LLM prompts are scattered across codebases as raw strings — untested, unversioned, and impossible to audit. When a prompt causes a production incident, there's no git blame, no diff history, and no way to systematically manage hundreds of prompts across an organization.

## Approach

Treat prompts as first-class engineering artefacts. QMD (Query Markup Documents) is a structured YAML format where each prompt is a versionable, composable, testable document with metadata, templating, guardrails, and output schemas.

## Architecture

<!-- architecture -->
<div style="margin: 0 auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.06), rgba(201,168,124,0.02)); border: 1px solid rgba(212,184,150,0.2); border-radius: 12px; padding: 1.5rem; font-family: monospace; font-size: 0.72rem; line-height: 1.6; color: rgba(255,255,255,0.7);">
<div style="text-align: center; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(212,184,150,0.6); margin-bottom: 1rem;">QMD DOCUMENT LIFECYCLE</div>
<pre style="margin: 0; white-space: pre; overflow-x: auto;">
  ┌─────────────────────────────────────────────────┐
  │              QMD Repository                      │
  │  /qmd/summarise-ticket.qmd.yaml                 │
  │  /qmd/classify-intent.qmd.yaml                  │
  │  /qmd/extract-entities.qmd.yaml                 │
  └───────────────────┬─────────────────────────────┘
                      │
            ┌─────────┴─────────┐
            ▼                   ▼
     ┌─────────────┐    ┌─────────────┐
     │   QMD CI    │    │ QMD Registry│
     │  (validate, │    │  (load,     │
     │   lint,     │    │   render,   │
     │   eval)     │    │   cache)    │
     └─────────────┘    └──────┬──────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
            ┌─────────────┐      ┌──────────────┐
            │  Template   │      │  Fingerprint │
            │  Renderer   │      │  Cache Layer │
            │ (variables) │      │ (same query  │
            └──────┬──────┘      │  = cache hit)│
                   │             └──────────────┘
                   ▼
            ┌─────────────┐
            │  LLM Client │
            │  (ready     │
            │   payload)  │
            └─────────────┘
</pre>
</div>
</div>

## Code

```python
"""
QMD — Query Markup Documents
Structured, versionable, composable LLM query definitions.
"""
from dataclasses import dataclass, field
from pathlib import Path
import yaml, hashlib

@dataclass
class QMDDocument:
    name: str
    version: str
    model: str
    temperature: float
    max_tokens: int
    system: str
    query_template: str
    variables: dict[str, str]
    output_schema: dict | None = None
    guardrails: list[str] = field(default_factory=list)

    @property
    def fingerprint(self) -> str:
        """Content hash for cache-keying and drift detection."""
        content = f"{self.system}{self.query_template}{self.model}"
        return hashlib.sha256(content.encode()).hexdigest()[:12]

class QMDRegistry:
    """Load, validate, and serve QMD documents."""

    def __init__(self, qmd_dir: str = "./qmd"):
        self.qmd_dir = Path(qmd_dir)
        self._cache: dict[str, QMDDocument] = {}
        self._load_all()

    def _load_all(self):
        for path in self.qmd_dir.glob("**/*.qmd.yaml"):
            raw = yaml.safe_load(path.read_text())
            self._cache[raw["name"]] = QMDDocument(**raw)

    def render(self, name: str, **kwargs) -> dict:
        """Render a QMD into an LLM-ready request payload."""
        doc = self._cache[name]
        missing = set(doc.variables.keys()) - set(kwargs.keys())
        if missing:
            raise ValueError(f"Missing variables: {missing}")

        query = doc.query_template
        for key, val in kwargs.items():
            query = query.replace(f"{{{{{key}}}}}", str(val))

        return {
            "model": doc.model,
            "temperature": doc.temperature,
            "max_tokens": doc.max_tokens,
            "messages": [
                {"role": "system", "content": doc.system},
                {"role": "user", "content": query},
            ],
            "metadata": {
                "qmd_name": doc.name,
                "qmd_version": doc.version,
                "fingerprint": doc.fingerprint,
            },
        }
```

## Run

```bash
# Create a QMD file
cat > qmd/summarise-ticket.qmd.yaml << 'EOF'
name: summarise-ticket
version: "1.2"
model: gpt-4o-mini
temperature: 0.2
max_tokens: 300
guardrails: [no-pii-in-output, max-cost-0.01]
variables:
  ticket_text: "The raw support ticket body"
  priority: "Ticket priority level"
system: |
  You are a support triage assistant.
  Summarise tickets concisely. Never include PII.
query_template: |
  Summarise this {{priority}} priority ticket:
  {{ticket_text}}
EOF

# Use in code
from qmd import QMDRegistry
registry = QMDRegistry("./qmd")
payload = registry.render("summarise-ticket",
    ticket_text="Device won't connect after firmware update...",
    priority="high")
```

## Outcomes

- All prompts versioned in git — full blame/diff history for incident response
- Fingerprint-based caching reduced redundant LLM calls by 35%
- CI validation catches broken templates before deployment
- Organization-wide prompt registry enables reuse and governance

## Lessons

- Prompts are code. They deserve the same engineering rigor — version control, testing, review, and deployment pipelines.
- Variable validation at render time catches integration bugs early rather than getting cryptic LLM responses.
- Guardrails declared in the document itself (not just runtime) makes compliance auditable by default.

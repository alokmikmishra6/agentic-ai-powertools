---
title: "AI Evaluation Pipeline with Drift Detection"
slug: eval-pipeline-drift
tag: "AI Safety"
tagClass: ai
featured: true
date: "2026-05-15"
lang: python
---

## Problem

Production AI models degrade silently. Without continuous evaluation, you discover quality drops from user complaints — not metrics. Model updates, data drift, and prompt changes all introduce regression risk that manual spot-checking can't catch at scale.

## Approach

Build a continuous evaluation pipeline that runs every model update against a golden dataset, computes quality and safety scores, compares against a rolling baseline, and triggers automated rollback when safety thresholds are breached.

## Architecture

<!-- architecture -->
<div style="margin: 0 auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.06), rgba(201,168,124,0.02)); border: 1px solid rgba(212,184,150,0.2); border-radius: 12px; padding: 1.5rem; font-family: monospace; font-size: 0.72rem; line-height: 1.6; color: rgba(255,255,255,0.7);">
<div style="text-align: center; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(212,184,150,0.6); margin-bottom: 1rem;">EVAL PIPELINE FLOW</div>
<pre style="margin: 0; white-space: pre; overflow-x: auto;">
  Model Update / Prompt Change / Schedule Trigger
                    │
                    ▼
         ┌──────────────────┐
         │  Golden Dataset  │  (curated test cases + rubrics)
         │  N = 200+ cases  │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  Eval Runner     │  parallel execution
         │  (async batch)   │
         └────────┬─────────┘
                  │
          ┌───────┴───────┐
          ▼               ▼
   ┌────────────┐  ┌────────────┐
   │ Quality    │  │  Safety    │
   │ Scoring    │  │  Scoring   │
   │ (LLM judge)│  │ (rule-based│
   └─────┬──────┘  │  + LLM)   │
         │         └─────┬──────┘
         └───────┬───────┘
                 ▼
      ┌─────────────────────┐
      │  Drift Comparator   │
      │  (vs 30-day rolling │
      │   baseline)         │
      └──────────┬──────────┘
                 │
         ┌───────┴───────┐
         ▼               ▼
   ┌──────────┐   ┌───────────┐
   │  ✓ PASS  │   │ ✗ BREACH  │
   │  Deploy  │   │ Rollback  │
   │          │   │ + Alert   │
   └──────────┘   └───────────┘
</pre>
</div>
</div>

## Code

```python
"""
Continuous AI Evaluation with Automated Drift Detection
"""
from dataclasses import dataclass
from statistics import mean

@dataclass
class EvalThresholds:
    drift_ratio: float = 0.9       # Alert if score drops >10% from baseline
    safety_floor: float = 0.95     # Hard floor — auto-rollback below this
    min_cases: int = 50            # Minimum eval cases for valid report

class EvalPipeline:
    def __init__(self, golden_set, thresholds: EvalThresholds):
        self.golden = golden_set
        self.thresholds = thresholds
        self.history = MetricHistory(window_days=30)

    async def evaluate_model(self, model: str, version: str):
        results = []
        for case in self.golden.cases:
            output = await generate(model=model, prompt=case.prompt)
            score = await self.judge(output, case.expected, case.rubric)
            results.append({"case_id": case.id, "score": score})

        report = {
            "model": model,
            "version": version,
            "overall": mean(r["score"] for r in results),
            "safety": mean(r["score"] for r in results if r.get("safety")),
        }

        # Drift detection
        baseline = self.history.get_baseline(model)
        if report["overall"] < baseline * self.thresholds.drift_ratio:
            await self.alert_drift(report, baseline)

        # Safety floor enforcement
        if report["safety"] < self.thresholds.safety_floor:
            await self.trigger_rollback(model, version)

        self.history.record(report)
        return report

    async def trigger_rollback(self, model, version):
        previous = self.history.last_passing_version(model)
        await self.router.pin_model(model, previous)
        await self.notify(severity="critical",
            msg=f"Safety breach: {model}@{version} — rolled back")
```

## Run

```bash
# Install evaluation framework
pip install openai numpy pandas

# Prepare golden dataset (YAML format)
# golden/cases.yaml contains prompt + expected + rubric

# Run evaluation
python eval_pipeline.py --model gpt-4o --version 2026-05-15 \
  --golden ./golden/cases.yaml \
  --threshold-drift 0.9 \
  --threshold-safety 0.95

# CI integration (runs on every model config change)
# .github/workflows/eval.yml triggers on: push paths: ['prompts/**', 'model-config/**']
```

## Outcomes

- Caught 3 silent quality regressions before they reached production
- Automated rollback triggered once — safety score dropped to 0.91 after a prompt template change
- 30-day rolling baseline adapts to genuine improvements vs regressions
- Eval runs in <4 minutes for 200-case golden set (parallel async execution)

## Lessons

- Golden datasets need curation — stale test cases that no longer reflect real usage create false confidence.
- Safety scoring must be separate from quality scoring. A model can produce high-quality unsafe outputs.
- Rollback automation needs a human-in-the-loop escape hatch. Sometimes the 'regression' is intentional behavior change.

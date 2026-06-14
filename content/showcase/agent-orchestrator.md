---
title: "Multi-Agent Orchestrator with Trust Boundaries"
slug: agent-orchestrator
tag: "Agentic AI"
tagClass: ai
date: "2026-04-28"
lang: python
---

## Problem

Giving a single monolithic agent access to all tools creates an unacceptable blast radius. When an agent hallucinates a tool call or gets prompt-injected, it shouldn't be able to access payment APIs, delete databases, or escalate privileges across the entire system.

## Approach

Supervisor pattern with trust boundaries: a coordinator agent classifies intent and delegates to specialised sub-agents, each with isolated tool access, scoped memory, cost budgets, and step limits. A guardrail engine evaluates every action before execution.

## Architecture

<!-- architecture -->
<div style="margin: 0 auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.06), rgba(201,168,124,0.02)); border: 1px solid rgba(212,184,150,0.2); border-radius: 12px; padding: 1.5rem; font-family: monospace; font-size: 0.72rem; line-height: 1.6; color: rgba(255,255,255,0.7);">
<div style="text-align: center; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(212,184,150,0.6); margin-bottom: 1rem;">SUPERVISOR ORCHESTRATION PATTERN</div>
<pre style="margin: 0; white-space: pre; overflow-x: auto;">
                    User Request
                         │
                         ▼
              ┌─────────────────────┐
              │  SUPERVISOR AGENT   │
              │  (intent classify)  │
              └──────────┬──────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   ┌────────────┐ ┌────────────┐ ┌────────────┐
   │ Research   │ │   Code     │ │  Security  │
   │   Agent    │ │   Agent    │ │   Agent    │
   ├────────────┤ ├────────────┤ ├────────────┤
   │ Tools:     │ │ Tools:     │ │ Tools:     │
   │  - search  │ │  - editor  │ │  - scanner │
   │  - browse  │ │  - execute │ │  - cve_db  │
   │            │ │  - git     │ │  - secrets │
   │ Budget: $2 │ │ Budget: $5 │ │ Budget: $1 │
   │ Steps: 10  │ │ Steps: 15  │ │ Steps: 8   │
   └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
         │               │               │
         └───────────────┼───────────────┘
                         ▼
              ┌─────────────────────┐
              │   GUARDRAIL ENGINE  │
              │  (every action)     │
              │  ┌───────────────┐  │
              │  │ Cost check    │  │
              │  │ Tool scope    │  │
              │  │ Output filter │  │
              │  │ Human gate    │  │
              │  └───────────────┘  │
              └─────────────────────┘
</pre>
</div>
</div>

## Code

```python
"""
Multi-Agent Orchestrator with Isolated Trust Boundaries
"""
class SupervisorAgent:
    """Coordinates specialised agents with trust boundaries."""

    def __init__(self, agents: dict[str, "Agent"], guardrails):
        self.agents = agents
        self.guardrails = guardrails
        self.audit = AuditLogger()

    async def run(self, task) -> "AgentResult":
        # Step 1: Classify intent → select specialist
        intent = await self.classify_intent(task)
        agent = self.agents[intent.agent_key]

        # Step 2: Create isolated execution context
        ctx = AgentContext(
            tools=agent.allowed_tools,       # Only this agent's tools
            memory=ScopedMemory(task.id, agent.name),  # Isolated memory
            cost_budget=task.remaining_budget,
            max_steps=agent.step_limit,
        )

        # Step 3: Stream actions through guardrail gate
        async for action in agent.stream(task.prompt, ctx):
            verdict = self.guardrails.evaluate(action)
            self.audit.log(action, verdict)

            if verdict.requires_human_approval:
                await self.escalate(action, task)
                continue
            if verdict.blocked:
                return AgentResult.blocked(verdict.reason)

            await action.execute()

        return agent.finalise(ctx)
```

## Run

```bash
# Define agent capabilities in config
# agents.yaml
research_agent:
  tools: [web_search, document_reader]
  budget_usd: 2.00
  max_steps: 10

code_agent:
  tools: [code_editor, terminal, git]
  budget_usd: 5.00
  max_steps: 15

# Run the orchestrator
python orchestrator.py --config agents.yaml \
  --task "Research rate limiting patterns and implement one"
```

## Outcomes

- Blast radius contained: a hallucinated tool call from code-agent can't reach payment APIs
- Cost budgets prevent runaway token consumption — hard $5 cap per agent per task
- Audit trail captures every action + guardrail verdict for post-incident analysis
- Human escalation gate triggered 2x/week — caught a code deletion action that would have been harmful

## Lessons

- Start with all actions requiring human approval, then gradually relax as you build confidence in the guardrails.
- Cost budgets must be per-agent-per-task, not global. A global budget lets one expensive agent starve others.
- The supervisor agent itself is the weakest link — if its intent classification is wrong, the wrong specialist gets the task. Invest heavily in the classifier.

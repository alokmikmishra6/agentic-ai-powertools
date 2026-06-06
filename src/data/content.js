// Helper: articles with date within last 14 days get "new" badge automatically
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;
const _isNew = (dateStr) => (Date.now() - new Date(dateStr).getTime()) < TWO_WEEKS;

export const ARTICLES = [
  {
    slug: "agentic-ai-harness-engineering",
    title: "Agentic AI Harness Engineering: Building the Control Plane for Autonomous Systems",
    category: "AI Systems",
    date: "2026-06-05",
    dateDisplay: "Jun 5, 2026",
    readTime: "22 min read",
    featured: true,
    theme: "An AI harness is not a wrapper around an LLM. It is the engineered substrate — the nervous system — that governs how agents perceive, decide, act, and recover. Without it, you have a demo. With it, you have a production system.",
    excerpt: "The difference between a prototype agent and a production agent is not the model. It is the harness — the orchestration layer that handles retries, fallbacks, state, evaluation, and graceful degradation when the LLM inevitably fails.",
    body: `<p>Every team building agentic AI hits the same wall. The prototype works beautifully in a demo — the agent reasons, calls tools, produces correct outputs. Then you ship it. Within hours, you discover that the LLM hallucinates a tool name, retries infinitely, loses state mid-conversation, or silently degrades in quality with no signal that anything is wrong.</p>

<p>The difference between that prototype and a production system is not a better model. It is the harness — the engineered control plane that wraps, constrains, monitors, and recovers the agent through every failure mode the real world will throw at it.</p>

<p>I call this discipline <strong>harness engineering</strong>: the systematic design of the non-LLM infrastructure that makes agentic systems reliable, observable, and safe at scale. It is the most under-discussed and under-invested layer in the agentic AI stack, and it is the layer that determines whether your system survives contact with production traffic.</p>

<h3>What Is an Agent Harness?</h3>

<p>An agent harness is the orchestration substrate that sits between your application logic and the LLM. It is responsible for everything the model cannot be trusted to do reliably: managing state across turns, enforcing execution policies, handling failures gracefully, collecting telemetry, and ensuring the agent operates within defined boundaries.</p>

<div style="margin: 2.5rem auto; max-width: 700px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Anatomy of an Agent Harness</div>

<div style="display: flex; flex-direction: column; gap: 0.4rem; align-items: center;">

<div style="width: 100%; background: rgba(88,166,255,0.06); border: 1px solid rgba(88,166,255,0.25); border-radius: 8px; padding: 0.6rem 1rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.65rem; font-weight: 700; color: #58a6ff;">APPLICATION LAYER</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.4); margin-top: 0.2rem;">Business logic, user interface, API endpoints</div>
</div>

<div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid rgba(212,184,150,0.5);"></div>

<div style="width: 100%; background: linear-gradient(135deg, rgba(212,184,150,0.1), rgba(212,184,150,0.04)); border: 1.5px solid rgba(212,184,150,0.4); border-radius: 10px; padding: 1rem;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #d4b896; text-align: center; margin-bottom: 0.8rem; letter-spacing: 0.05em;">AGENT HARNESS</div>
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
<div style="background: rgba(212,184,150,0.1); border: 1px solid rgba(212,184,150,0.2); border-radius: 6px; padding: 0.5rem;">
<div style="font-family: monospace; font-size: 0.55rem; color: #d4b896; font-weight: 600; margin-bottom: 0.25rem;">STATE MACHINE</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); line-height: 1.4;">Turn management<br/>Context windowing<br/>Memory persistence</div>
</div>
<div style="background: rgba(40,200,64,0.08); border: 1px solid rgba(40,200,64,0.2); border-radius: 6px; padding: 0.5rem;">
<div style="font-family: monospace; font-size: 0.55rem; color: #28c840; font-weight: 600; margin-bottom: 0.25rem;">EXECUTION POLICY</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); line-height: 1.4;">Max retries<br/>Timeout enforcement<br/>Cost ceilings</div>
</div>
<div style="background: rgba(255,95,87,0.08); border: 1px solid rgba(255,95,87,0.2); border-radius: 6px; padding: 0.5rem;">
<div style="font-family: monospace; font-size: 0.55rem; color: #ff5f57; font-weight: 600; margin-bottom: 0.25rem;">RECOVERY ENGINE</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); line-height: 1.4;">Fallback chains<br/>Circuit breakers<br/>Graceful degrade</div>
</div>
</div>
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;">
<div style="background: rgba(254,188,46,0.08); border: 1px solid rgba(254,188,46,0.2); border-radius: 6px; padding: 0.5rem;">
<div style="font-family: monospace; font-size: 0.55rem; color: #febc2e; font-weight: 600; margin-bottom: 0.25rem;">TOOL REGISTRY</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); line-height: 1.4;">Schema validation<br/>Permissions<br/>Rate limits</div>
</div>
<div style="background: rgba(138,99,210,0.08); border: 1px solid rgba(138,99,210,0.2); border-radius: 6px; padding: 0.5rem;">
<div style="font-family: monospace; font-size: 0.55rem; color: #8a63d2; font-weight: 600; margin-bottom: 0.25rem;">EVALUATION LAYER</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); line-height: 1.4;">Output quality<br/>Guardrails<br/>Drift detection</div>
</div>
<div style="background: rgba(88,166,255,0.08); border: 1px solid rgba(88,166,255,0.2); border-radius: 6px; padding: 0.5rem;">
<div style="font-family: monospace; font-size: 0.55rem; color: #58a6ff; font-weight: 600; margin-bottom: 0.25rem;">TELEMETRY</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); line-height: 1.4;">Latency + cost<br/>Trace correlation<br/>Anomaly signals</div>
</div>
</div>
</div>

<div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid rgba(212,184,150,0.5);"></div>

<div style="width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 0.6rem 1rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.5);">LLM PROVIDER</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.35); margin-top: 0.2rem;">OpenAI &middot; Anthropic &middot; Local Models &middot; Routers</div>
</div>

</div>
</div>
</div>

<p>The critical insight is that every component above the LLM layer is deterministic, testable, and under your control. The LLM is the only non-deterministic element — and the harness exists precisely to contain that non-determinism within safe operational boundaries.</p>

<h3>The Six Pillars of Harness Engineering</h3>

<p>After building and operating production agent systems across multiple domains, I have converged on six pillars that every serious harness must implement. Skip any one of these and you will discover the gap in production — usually at the worst possible time.</p>

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Six Pillars of Harness Engineering</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
<div style="background: rgba(212,184,150,0.12); border: 1px solid rgba(212,184,150,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #d4b896; font-weight: 700; margin-bottom: 0.3rem;">01 STATE MANAGEMENT</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Turn tracking, context windowing, memory persistence, checkpoint/restore</div>
</div>
<div style="background: rgba(40,200,64,0.12); border: 1px solid rgba(40,200,64,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #28c840; font-weight: 700; margin-bottom: 0.3rem;">02 EXECUTION POLICY</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Retry budgets, timeout enforcement, cost ceilings, concurrency limits</div>
</div>
<div style="background: rgba(254,188,46,0.12); border: 1px solid rgba(254,188,46,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #febc2e; font-weight: 700; margin-bottom: 0.3rem;">03 RECOVERY ENGINE</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Fallback model chains, circuit breakers, graceful degradation, dead-letter queues</div>
</div>
<div style="background: rgba(255,95,87,0.12); border: 1px solid rgba(255,95,87,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #ff5f57; font-weight: 700; margin-bottom: 0.3rem;">04 TOOL GOVERNANCE</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Schema validation, permission boundaries, rate limiting, parameter sanitisation</div>
</div>
<div style="background: rgba(138,99,210,0.12); border: 1px solid rgba(138,99,210,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #8a63d2; font-weight: 700; margin-bottom: 0.3rem;">05 EVALUATION LAYER</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Output quality scoring, guardrail checks, semantic drift detection, regression alerts</div>
</div>
<div style="background: rgba(88,166,255,0.12); border: 1px solid rgba(88,166,255,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #58a6ff; font-weight: 700; margin-bottom: 0.3rem;">06 OBSERVABILITY</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Structured traces, cost attribution, quality metrics, anomaly detection, SLA tracking</div>
</div>
</div>
</div>
</div>

<h3>Pillar 1: State Management — The Agent's Memory Architecture</h3>

<p>The most common failure mode in production agents is state corruption. The agent loses track of where it is in a multi-step task, re-executes steps it already completed, or hallucinates that it did something it never actually did. This happens because most agent frameworks treat state as an afterthought — a growing list of messages with no structure.</p>

<p>A production harness implements state as an explicit, typed state machine with well-defined transitions:</p>

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1.2rem; text-align: center;">Agent State Machine</div>

<div style="display: flex; flex-direction: column; align-items: center; gap: 0;">

<div style="background: rgba(88,166,255,0.12); border: 1.5px solid rgba(88,166,255,0.4); border-radius: 20px; padding: 0.4rem 1.2rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #58a6ff;">IDLE</div>
</div>
<div style="display: flex; align-items: center; gap: 0.4rem; margin: 0.3rem 0;">
<div style="width: 1px; height: 16px; background: rgba(255,255,255,0.2);"></div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4); font-style: italic;">user_input</div>
</div>

<div style="background: rgba(138,99,210,0.12); border: 1.5px solid rgba(138,99,210,0.4); border-radius: 20px; padding: 0.4rem 1.2rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #8a63d2;">PLANNING</div>
</div>
<div style="display: flex; width: 100%; justify-content: center; margin: 0.3rem 0;">
<div style="display: flex; align-items: center; gap: 0;">
<div style="text-align: right; width: 40%;"><span style="font-size: 0.55rem; color: rgba(255,95,87,0.7); font-style: italic;">plan_failed</span></div>
<div style="width: 1px; height: 16px; background: rgba(255,255,255,0.2); margin: 0 1rem;"></div>
<div style="text-align: left; width: 40%;"><span style="font-size: 0.55rem; color: rgba(40,200,64,0.7); font-style: italic;">plan_ready</span></div>
</div>
</div>

<div style="display: flex; width: 100%; justify-content: center; gap: 2rem; margin-bottom: 0.3rem;">
<div style="background: rgba(255,95,87,0.1); border: 1.5px solid rgba(255,95,87,0.35); border-radius: 20px; padding: 0.4rem 1rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #ff5f57;">RECOVERY</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35); margin-top: 0.15rem;">retry → PLANNING</div>
</div>
<div style="background: rgba(40,200,64,0.1); border: 1.5px solid rgba(40,200,64,0.35); border-radius: 20px; padding: 0.4rem 1rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #28c840;">EXECUTING</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35); margin-top: 0.15rem;">tool calls + LLM</div>
</div>
</div>

<div style="display: flex; width: 100%; justify-content: center; gap: 0.5rem; align-items: center; margin: 0.2rem 0;">
<div style="font-size: 0.5rem; color: rgba(255,95,87,0.6);">exec_failed /</div>
<div style="font-size: 0.5rem; color: rgba(255,95,87,0.6);">eval_fail</div>
<div style="width: 40px; height: 1px; background: linear-gradient(90deg, rgba(255,95,87,0.3), rgba(254,188,46,0.3));"></div>
<div style="font-size: 0.5rem; color: rgba(40,200,64,0.6);">exec_success</div>
</div>

<div style="background: rgba(254,188,46,0.1); border: 1.5px solid rgba(254,188,46,0.35); border-radius: 20px; padding: 0.4rem 1.2rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #febc2e;">EVALUATING</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35); margin-top: 0.15rem;">gate checks + quality scoring</div>
</div>

<div style="display: flex; align-items: center; gap: 0.4rem; margin: 0.3rem 0;">
<div style="width: 1px; height: 16px; background: rgba(40,200,64,0.3);"></div>
<div style="font-size: 0.55rem; color: rgba(40,200,64,0.6); font-style: italic;">eval_pass</div>
</div>

<div style="background: rgba(212,184,150,0.15); border: 1.5px solid rgba(212,184,150,0.5); border-radius: 20px; padding: 0.4rem 1.2rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.7rem; font-weight: 700; color: #d4b896;">COMPLETE</div>
</div>

</div>

<div style="margin-top: 1rem; display: flex; justify-content: center; gap: 0.8rem; flex-wrap: wrap;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.2rem 0.5rem;">Every transition logged</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.2rem 0.5rem;">Max dwell timeout per state</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.2rem 0.5rem;">Deterministic — LLM cannot override</div>
</div>
</div>
</div>

<p>Every state transition is logged. Every transition has a maximum dwell time (timeout). The state machine enforces that the agent cannot skip steps, cannot execute without planning, cannot complete without evaluation. This is not a suggestion to the LLM — it is deterministic code that the LLM cannot override.</p>

<p>The context window strategy is equally critical. A naive implementation passes the entire conversation history to every LLM call. A production harness implements <strong>sliding-window context</strong> with semantic compression: recent turns are passed verbatim, older turns are summarised, and irrelevant tool outputs are pruned. The agent always has the context it needs without the token bloat that degrades both quality and cost.</p>

<h3>Pillar 2: Execution Policy — Budgets, Bounds, and Backpressure</h3>

<p>An unconstrained agent is a liability. Without execution policies, a single confused agent can retry a failing API call indefinitely, burn through your entire token budget in minutes, or spawn cascading tool calls that overwhelm downstream services. Execution policy is the set of hard constraints that define the operational envelope:</p>

<div style="margin: 2.5rem auto; max-width: 660px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1.2rem; text-align: center;">Execution Policy Configuration</div>

<div style="background: rgba(212,184,150,0.06); border: 1px solid rgba(212,184,150,0.2); border-radius: 8px; padding: 0.8rem; margin-bottom: 0.5rem;">
<div style="font-family: monospace; font-size: 0.6rem; color: rgba(255,255,255,0.4); margin-bottom: 0.5rem;">POLICY: research-agent-v2</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
<div style="background: rgba(255,95,87,0.08); border: 1px solid rgba(255,95,87,0.15); border-radius: 6px; padding: 0.6rem;">
<div style="font-family: monospace; font-size: 0.6rem; color: #ff5f57; font-weight: 600; margin-bottom: 0.4rem;">RETRY BUDGET</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5); line-height: 1.8;">
<div style="display: flex; justify-content: space-between;"><span>per_tool</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">3</span></div>
<div style="display: flex; justify-content: space-between;"><span>per_turn</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">5</span></div>
<div style="display: flex; justify-content: space-between;"><span>backoff</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">exp 1s</span></div>
<div style="display: flex; justify-content: space-between;"><span>on</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">5xx, timeout</span></div>
</div>
</div>
<div style="background: rgba(254,188,46,0.08); border: 1px solid rgba(254,188,46,0.15); border-radius: 6px; padding: 0.6rem;">
<div style="font-family: monospace; font-size: 0.6rem; color: #febc2e; font-weight: 600; margin-bottom: 0.4rem;">TIMEOUTS</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5); line-height: 1.8;">
<div style="display: flex; justify-content: space-between;"><span>llm_call</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">30s</span></div>
<div style="display: flex; justify-content: space-between;"><span>tool_exec</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">60s</span></div>
<div style="display: flex; justify-content: space-between;"><span>per_turn</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">120s</span></div>
<div style="display: flex; justify-content: space-between;"><span>task_total</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">600s</span></div>
</div>
</div>
<div style="background: rgba(40,200,64,0.08); border: 1px solid rgba(40,200,64,0.15); border-radius: 6px; padding: 0.6rem;">
<div style="font-family: monospace; font-size: 0.6rem; color: #28c840; font-weight: 600; margin-bottom: 0.4rem;">COST CEILING</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5); line-height: 1.8;">
<div style="display: flex; justify-content: space-between;"><span>per_turn</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">50K tok</span></div>
<div style="display: flex; justify-content: space-between;"><span>per_task</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">200K tok</span></div>
<div style="display: flex; justify-content: space-between;"><span>hourly</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">$2.00</span></div>
<div style="display: flex; justify-content: space-between;"><span>breach</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">degrade</span></div>
</div>
</div>
<div style="background: rgba(138,99,210,0.08); border: 1px solid rgba(138,99,210,0.15); border-radius: 6px; padding: 0.6rem;">
<div style="font-family: monospace; font-size: 0.6rem; color: #8a63d2; font-weight: 600; margin-bottom: 0.4rem;">CONCURRENCY</div>
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5); line-height: 1.8;">
<div style="display: flex; justify-content: space-between;"><span>parallel_tools</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">3</span></div>
<div style="display: flex; justify-content: space-between;"><span>pending_tasks</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">10</span></div>
<div style="display: flex; justify-content: space-between;"><span>max_turns</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">15</span></div>
<div style="display: flex; justify-content: space-between;"><span>on_limit</span><span style="color: rgba(255,255,255,0.7); font-family: monospace;">yield</span></div>
</div>
</div>
</div>
</div>

<div style="margin-top: 0.8rem; text-align: center; font-size: 0.6rem; color: rgba(255,255,255,0.35); font-style: italic;">Hard stops enforced by harness infrastructure — not guidelines, not prompts.</div>
</div>
</div>

<p>These are not guidelines — they are hard stops enforced by the harness. When an agent hits a cost ceiling, the harness does not ask the agent what to do. It downgrades to a cheaper model, or pauses and escalates to a human, or terminates the task with a structured error. The agent has no say in this. That is the point.</p>

<p>The most important execution policy is the <strong>turn limit</strong>. Agents in unbounded loops are the number one cause of cost blowouts in production. A well-designed harness enforces a maximum turn count per task and, when that limit is reached, forces the agent to summarise its progress and yield — either to a human or to a supervisor agent that can decide whether to allocate more budget.</p>

<h3>Pillar 3: Recovery Engine — Designing for Failure</h3>

<p>LLMs fail. They fail in ways that are hard to predict and hard to distinguish from correct behaviour. A production harness treats failure as the default assumption and designs every path with recovery in mind.</p>

<p>The recovery engine implements three patterns:</p>

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1.2rem; text-align: center;">Recovery Pattern Hierarchy</div>

<div style="display: flex; flex-direction: column; gap: 0;">

<div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;">
<div style="flex: 0 0 auto; background: rgba(255,95,87,0.15); border: 1px solid rgba(255,95,87,0.3); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
<div style="font-family: monospace; font-size: 0.6rem; color: #ff5f57; font-weight: 700;">!</div>
</div>
<div style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 0.4rem 0.6rem;">
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.5);">FAILURE DETECTED</div>
</div>
</div>

<div style="margin-left: 14px; width: 1px; height: 12px; background: linear-gradient(180deg, rgba(255,95,87,0.4), rgba(254,188,46,0.4));"></div>

<div style="display: flex; align-items: stretch; gap: 0.6rem; margin-bottom: 0.3rem;">
<div style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: center;">
<div style="background: rgba(254,188,46,0.15); border: 1px solid rgba(254,188,46,0.3); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
<div style="font-family: monospace; font-size: 0.55rem; color: #febc2e; font-weight: 700;">R</div>
</div>
</div>
<div style="flex: 1; background: rgba(254,188,46,0.06); border: 1px solid rgba(254,188,46,0.2); border-radius: 6px; padding: 0.5rem 0.7rem; display: flex; justify-content: space-between; align-items: center;">
<div>
<div style="font-family: monospace; font-size: 0.6rem; color: #febc2e; font-weight: 600;">RETRY</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4); margin-top: 0.1rem;">Same model, fresh context window</div>
</div>
<div style="background: rgba(40,200,64,0.15); border: 1px solid rgba(40,200,64,0.3); border-radius: 4px; padding: 0.15rem 0.5rem; font-size: 0.55rem; color: #28c840;">success → continue</div>
</div>
</div>

<div style="margin-left: 14px; width: 1px; height: 12px; background: linear-gradient(180deg, rgba(254,188,46,0.4), rgba(138,99,210,0.4));"></div>
<div style="margin-left: 22px; font-size: 0.5rem; color: rgba(255,255,255,0.3); margin-bottom: 0.15rem;">exhausted</div>

<div style="display: flex; align-items: stretch; gap: 0.6rem; margin-bottom: 0.3rem;">
<div style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: center;">
<div style="background: rgba(138,99,210,0.15); border: 1px solid rgba(138,99,210,0.3); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
<div style="font-family: monospace; font-size: 0.55rem; color: #8a63d2; font-weight: 700;">F</div>
</div>
</div>
<div style="flex: 1; background: rgba(138,99,210,0.06); border: 1px solid rgba(138,99,210,0.2); border-radius: 6px; padding: 0.5rem 0.7rem; display: flex; justify-content: space-between; align-items: center;">
<div>
<div style="font-family: monospace; font-size: 0.6rem; color: #8a63d2; font-weight: 600;">FALLBACK</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4); margin-top: 0.1rem;">Cheaper model, simplified prompt</div>
</div>
<div style="background: rgba(40,200,64,0.1); border: 1px solid rgba(40,200,64,0.25); border-radius: 4px; padding: 0.15rem 0.5rem; font-size: 0.55rem; color: rgba(40,200,64,0.8);">degraded → continue</div>
</div>
</div>

<div style="margin-left: 14px; width: 1px; height: 12px; background: linear-gradient(180deg, rgba(138,99,210,0.4), rgba(255,95,87,0.4));"></div>
<div style="margin-left: 22px; font-size: 0.5rem; color: rgba(255,255,255,0.3); margin-bottom: 0.15rem;">exhausted</div>

<div style="display: flex; align-items: stretch; gap: 0.6rem;">
<div style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: center;">
<div style="background: rgba(255,95,87,0.2); border: 1.5px solid rgba(255,95,87,0.4); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
<div style="font-family: monospace; font-size: 0.55rem; color: #ff5f57; font-weight: 700;">C</div>
</div>
</div>
<div style="flex: 1; background: rgba(255,95,87,0.08); border: 1.5px solid rgba(255,95,87,0.25); border-radius: 6px; padding: 0.5rem 0.7rem; display: flex; justify-content: space-between; align-items: center;">
<div>
<div style="font-family: monospace; font-size: 0.6rem; color: #ff5f57; font-weight: 600;">CIRCUIT BREAK</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4); margin-top: 0.1rem;">Stop calling, preserve state, cooldown</div>
</div>
<div style="background: rgba(255,95,87,0.12); border: 1px solid rgba(255,95,87,0.25); border-radius: 4px; padding: 0.15rem 0.5rem; font-size: 0.55rem; color: rgba(255,95,87,0.8);">→ human escalation</div>
</div>
</div>

</div>
</div>
</div>

<p><strong>Fallback chains</strong> are the most underutilised pattern. When GPT-4o times out or produces garbage, you do not retry with GPT-4o. You fall back to Claude Sonnet with a simplified prompt. If that fails, you fall back to a template-based response that at least preserves correctness. The user gets a degraded but functional response instead of an error. The quality degradation is logged, and the system self-heals when the primary model recovers.</p>

<p><strong>Circuit breakers</strong> prevent cascade failures. If a tool endpoint returns errors on three consecutive calls, the harness opens the circuit — it stops calling that tool entirely for a cooldown period. This prevents the agent from burning retries against a downed service, protects downstream systems from thundering herds, and gives the infrastructure time to recover.</p>

<p><strong>Checkpoint/restore</strong> is the safety net. Before every tool execution, the harness checkpoints the full agent state. If the tool call corrupts the conversation or the agent enters an unrecoverable state, you restore to the last good checkpoint and try an alternative path. This is not theoretical — it is essential for any agent that makes external writes (sending emails, creating tickets, deploying code).</p>

<h3>Pillar 4: Tool Governance — The Agent's API Contract</h3>

<p>Tools are the agent's hands. Without governance, those hands can do anything — including things the agent was never designed to do. Tool governance is the layer that ensures every tool call is valid, authorised, bounded, and audited.</p>

<p>A governed tool registry provides four guarantees:</p>

<ul>
<li><strong>Schema validation:</strong> Every tool call is validated against a strict JSON schema before execution. If the LLM hallucinates a parameter, the call is rejected before it reaches the tool — not after.</li>
<li><strong>Permission boundaries:</strong> Tools are scoped to the current task context. A research agent cannot access write tools. A summarisation agent cannot access network tools. This is enforced by the harness, not by the prompt.</li>
<li><strong>Rate limiting:</strong> Each tool has per-minute and per-task call limits. An agent cannot spam an API endpoint regardless of what the LLM decides to do.</li>
<li><strong>Parameter sanitisation:</strong> All tool parameters are sanitised for injection attacks. SQL parameters are parameterised. Shell commands are escaped. URLs are validated against allow-lists.</li>
</ul>

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1.2rem; text-align: center;">Tool Call Lifecycle</div>

<div style="background: rgba(88,166,255,0.06); border: 1px solid rgba(88,166,255,0.2); border-radius: 6px; padding: 0.4rem 0.6rem; margin-bottom: 0.8rem; text-align: center;">
<div style="font-family: monospace; font-size: 0.6rem; color: #58a6ff;">LLM Output: <span style="color: rgba(255,255,255,0.5);">call search_docs(query=&apos;...&apos;)</span></div>
</div>

<div style="display: flex; flex-direction: column; gap: 0.35rem;">

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">01</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(212,184,150,0.3), rgba(212,184,150,0.05));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Parse tool name + parameters</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">02</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(40,200,64,0.3), rgba(40,200,64,0.05));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Schema validation</div>
<div style="font-size: 0.5rem; color: rgba(255,95,87,0.6); background: rgba(255,95,87,0.08); border-radius: 3px; padding: 0.1rem 0.3rem;">fail → reject + retry</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">03</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(254,188,46,0.3), rgba(254,188,46,0.05));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Permission check</div>
<div style="font-size: 0.5rem; color: rgba(255,95,87,0.6); background: rgba(255,95,87,0.08); border-radius: 3px; padding: 0.1rem 0.3rem;">fail → reject + log</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">04</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(138,99,210,0.3), rgba(138,99,210,0.05));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Rate limit check</div>
<div style="font-size: 0.5rem; color: rgba(254,188,46,0.7); background: rgba(254,188,46,0.08); border-radius: 3px; padding: 0.1rem 0.3rem;">fail → queue</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">05</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Parameter sanitisation</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">06</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Checkpoint current state</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(212,184,150,0.06); border-radius: 4px; padding: 0.2rem 0;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: #d4b896; text-align: right; font-weight: 600;">07</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(212,184,150,0.4), rgba(212,184,150,0.1));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: #d4b896; font-weight: 600;">Execute tool</div>
<div style="font-size: 0.5rem; color: rgba(254,188,46,0.7); background: rgba(254,188,46,0.08); border-radius: 3px; padding: 0.1rem 0.3rem;">timeout → fallback</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">08</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.03));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Validate output schema</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">09</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(88,166,255,0.3), rgba(88,166,255,0.05));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Log trace span (tool, params, duration, cost)</div>
</div>

<div style="display: flex; align-items: center; gap: 0.5rem;">
<div style="flex: 0 0 20px; font-family: monospace; font-size: 0.55rem; color: rgba(255,255,255,0.3); text-align: right;">10</div>
<div style="flex: 1; height: 1px; background: linear-gradient(90deg, rgba(40,200,64,0.3), rgba(40,200,64,0.05));"></div>
<div style="flex: 0 0 auto; font-size: 0.6rem; color: rgba(255,255,255,0.55);">Return structured result to LLM</div>
</div>

</div>
</div>
</div>

<p>The key architectural decision is that the harness — not the LLM — determines which tools are available for a given turn. You can dynamically narrow the tool set based on the agent's current state. In the PLANNING state, only read-only tools are available. In the EXECUTING state, write tools become accessible. This state-dependent tool availability eliminates entire categories of agent misbehaviour.</p>

<h3>Pillar 5: Evaluation Layer — Continuous Quality Assurance</h3>

<p>You cannot run an agent in production without knowing whether its outputs are good. But "good" is hard to define for free-form language generation. The evaluation layer solves this by applying multiple lightweight checks at runtime — not just during development.</p>

<p>A production evaluation layer operates at three levels:</p>

<div style="margin: 2.5rem auto; max-width: 660px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Runtime Evaluation Stack</div>
<div style="display: grid; gap: 0.6rem;">
<div style="background: rgba(255,95,87,0.08); border: 1px solid rgba(255,95,87,0.2); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #ff5f57; font-weight: 700; margin-bottom: 0.3rem;">GATE CHECKS (per-turn, blocking)</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.55); line-height: 1.5;">Format compliance — does output match expected schema? Guardrail pass — no PII leakage, no harmful content, no policy violations? Factual grounding — are claims supported by retrieved context?</div>
</div>
<div style="background: rgba(254,188,46,0.08); border: 1px solid rgba(254,188,46,0.2); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #febc2e; font-weight: 700; margin-bottom: 0.3rem;">QUALITY SCORING (per-task, non-blocking)</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.55); line-height: 1.5;">Relevance score against user intent. Completeness — did the agent address all parts of the request? Coherence — is the multi-turn conversation logically consistent?</div>
</div>
<div style="background: rgba(40,200,64,0.08); border: 1px solid rgba(40,200,64,0.2); border-radius: 8px; padding: 0.8rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #28c840; font-weight: 700; margin-bottom: 0.3rem;">DRIFT DETECTION (aggregate, async)</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.55); line-height: 1.5;">Rolling quality percentiles — is p50 quality declining over the last hour/day? Behavioural drift — is the agent using tools differently than its baseline? Cost drift — is token consumption trending upward without corresponding quality gains?</div>
</div>
</div>
</div>
</div>

<p>Gate checks are blocking — if an output fails a gate check, the harness rejects it and forces the agent to regenerate. Quality scores are non-blocking — they are logged and used for alerting and continuous improvement. Drift detection runs asynchronously over aggregated data, looking for systemic degradation that per-request checks would miss.</p>

<p>The most valuable evaluation metric I have found in practice is the <strong>regeneration rate</strong>: what percentage of agent outputs are rejected by gate checks and regenerated? A healthy agent regenerates less than 5% of outputs. When regeneration exceeds 15%, something fundamental has changed — a model update, a prompt regression, or a shift in input distribution — and the system alerts operators to investigate.</p>

<h3>Pillar 6: Observability — The Nervous System</h3>

<p>Observability for agentic systems is qualitatively different from traditional application monitoring. You are not just tracking request latency and error rates. You are tracking reasoning quality, decision coherence, tool utilisation patterns, and cost efficiency — metrics that have no direct equivalent in conventional software.</p>

<p>A production harness emits structured traces that capture the full decision chain:</p>

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1.2rem; text-align: center;">Agent Trace Schema</div>

<div style="background: rgba(212,184,150,0.06); border: 1px solid rgba(212,184,150,0.2); border-radius: 8px; padding: 0.6rem; margin-bottom: 0.5rem;">
<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #d4b896; font-weight: 600;">TRACE: task_7f2a</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.3);">total: 3,160ms</div>
</div>

<div style="display: flex; flex-direction: column; gap: 0.35rem;">

<div style="position: relative; padding-left: 0.8rem; border-left: 2px solid rgba(138,99,210,0.4);">
<div style="display: flex; align-items: center; justify-content: space-between;">
<div style="font-family: monospace; font-size: 0.6rem; color: #8a63d2;">planning</div>
<div style="display: flex; gap: 0.5rem;">
<span style="font-size: 0.5rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); border-radius: 3px; padding: 0.05rem 0.3rem;">420ms</span>
<span style="font-size: 0.5rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); border-radius: 3px; padding: 0.05rem 0.3rem;">1.2K tok</span>
</div>
</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); margin-top: 0.15rem;">model: gpt-4o &middot; plan_steps: 4 &middot; confidence: 0.87</div>
</div>

<div style="position: relative; padding-left: 0.8rem; border-left: 2px solid rgba(254,188,46,0.4);">
<div style="display: flex; align-items: center; justify-content: space-between;">
<div style="font-family: monospace; font-size: 0.6rem; color: #febc2e;">tool: search_docs</div>
<div style="display: flex; gap: 0.5rem;">
<span style="font-size: 0.5rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); border-radius: 3px; padding: 0.05rem 0.3rem;">890ms</span>
<span style="font-size: 0.5rem; color: rgba(254,188,46,0.5); background: rgba(254,188,46,0.08); border-radius: 3px; padding: 0.05rem 0.3rem;">score: 0.72</span>
</div>
</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); margin-top: 0.15rem;">params: {query: &quot;...&quot;, limit: 10} &middot; results: 7 docs</div>
</div>

<div style="position: relative; padding-left: 0.8rem; border-left: 2px solid rgba(255,95,87,0.4);">
<div style="display: flex; align-items: center; justify-content: space-between;">
<div style="font-family: monospace; font-size: 0.6rem; color: #ff5f57;">tool: search_docs <span style="font-size: 0.5rem; background: rgba(255,95,87,0.15); border-radius: 3px; padding: 0.05rem 0.3rem; margin-left: 0.3rem;">RETRY #1</span></div>
<div style="display: flex; gap: 0.5rem;">
<span style="font-size: 0.5rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); border-radius: 3px; padding: 0.05rem 0.3rem;">650ms</span>
<span style="font-size: 0.5rem; color: rgba(40,200,64,0.6); background: rgba(40,200,64,0.08); border-radius: 3px; padding: 0.05rem 0.3rem;">score: 0.89</span>
</div>
</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); margin-top: 0.15rem;">reason: low_relevance &middot; params: {query: &quot;...&quot;, limit: 20} &middot; results: 12 docs</div>
</div>

<div style="position: relative; padding-left: 0.8rem; border-left: 2px solid rgba(40,200,64,0.4);">
<div style="display: flex; align-items: center; justify-content: space-between;">
<div style="font-family: monospace; font-size: 0.6rem; color: #28c840;">generation</div>
<div style="display: flex; gap: 0.5rem;">
<span style="font-size: 0.5rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); border-radius: 3px; padding: 0.05rem 0.3rem;">1,200ms</span>
<span style="font-size: 0.5rem; color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.04); border-radius: 3px; padding: 0.05rem 0.3rem;">3.4K tok</span>
</div>
</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); margin-top: 0.15rem;">model: gpt-4o &middot; gate_check: PASS &middot; quality: 0.91</div>
</div>

</div>
</div>

<div style="display: flex; justify-content: space-between; margin-top: 0.6rem; padding: 0.4rem 0.6rem; background: rgba(212,184,150,0.08); border-radius: 6px;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4);"><span style="color: #d4b896;">tokens:</span> 4,600</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4);"><span style="color: #d4b896;">cost:</span> $0.023</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4);"><span style="color: #d4b896;">turns:</span> 2</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.4);"><span style="color: #d4b896;">tools:</span> 2 (1 retry)</div>
</div>
</div>
</div>

<p>This trace gives you everything: latency breakdown per phase, token consumption per call, quality scores, retry reasons, and total cost attribution. You can aggregate these traces to build dashboards that answer the questions that matter: which tasks are expensive and why? Which tools fail most often? Is quality trending down after the last prompt change? Which user queries consistently trigger recovery paths?</p>

<h3>Harness Patterns for Multi-Agent Systems</h3>

<p>When you move from single agents to multi-agent architectures, the harness becomes even more critical. You are now managing not just individual agent behaviour but inter-agent communication, coordination protocols, and system-level properties that emerge from agent interactions.</p>

<div style="margin: 2.5rem auto; max-width: 700px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1.2rem; text-align: center;">Multi-Agent Harness Architecture</div>

<div style="background: rgba(212,184,150,0.08); border: 1.5px solid rgba(212,184,150,0.35); border-radius: 10px; padding: 1rem; margin-bottom: 0.6rem;">
<div style="font-family: monospace; font-size: 0.65rem; color: #d4b896; font-weight: 700; text-align: center; margin-bottom: 0.6rem;">SUPERVISOR HARNESS</div>
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.4rem; margin-bottom: 0.8rem;">
<div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.5);">Task Router</div>
</div>
<div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.5);">Budget Allocator</div>
</div>
<div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 5px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.5);">Result Merger</div>
</div>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;">
<div style="background: rgba(88,166,255,0.08); border: 1.5px solid rgba(88,166,255,0.25); border-radius: 8px; padding: 0.6rem; position: relative;">
<div style="position: absolute; top: -6px; right: 8px; background: rgba(88,166,255,0.2); border-radius: 3px; padding: 0.05rem 0.3rem; font-size: 0.45rem; color: #58a6ff;">ACTIVE</div>
<div style="font-family: monospace; font-size: 0.6rem; color: #58a6ff; font-weight: 600; margin-bottom: 0.3rem;">AGENT A</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); margin-bottom: 0.3rem;">Research</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); line-height: 1.6; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.3rem;">
retries: 3<br/>timeout: 30s<br/>tools: read-only<br/>cap: $0.50
</div>
</div>
<div style="background: rgba(138,99,210,0.08); border: 1.5px solid rgba(138,99,210,0.25); border-radius: 8px; padding: 0.6rem; position: relative;">
<div style="position: absolute; top: -6px; right: 8px; background: rgba(138,99,210,0.2); border-radius: 3px; padding: 0.05rem 0.3rem; font-size: 0.45rem; color: #8a63d2;">QUEUED</div>
<div style="font-family: monospace; font-size: 0.6rem; color: #8a63d2; font-weight: 600; margin-bottom: 0.3rem;">AGENT B</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); margin-bottom: 0.3rem;">Analysis</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); line-height: 1.6; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.3rem;">
retries: 5<br/>timeout: 60s<br/>tools: compute<br/>cap: $1.00
</div>
</div>
<div style="background: rgba(40,200,64,0.08); border: 1.5px solid rgba(40,200,64,0.25); border-radius: 8px; padding: 0.6rem; position: relative;">
<div style="position: absolute; top: -6px; right: 8px; background: rgba(40,200,64,0.15); border-radius: 3px; padding: 0.05rem 0.3rem; font-size: 0.45rem; color: #28c840;">QUEUED</div>
<div style="font-family: monospace; font-size: 0.6rem; color: #28c840; font-weight: 600; margin-bottom: 0.3rem;">AGENT C</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.45); margin-bottom: 0.3rem;">Writing</div>
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.3); line-height: 1.6; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.3rem;">
retries: 2<br/>timeout: 45s<br/>tools: write<br/>cap: $0.30
</div>
</div>
</div>
</div>

<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.4rem;">
<div style="background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35);">Budget</div>
<div style="font-family: monospace; font-size: 0.6rem; color: rgba(255,255,255,0.6);">$2.00</div>
</div>
<div style="background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35);">Max Agents</div>
<div style="font-family: monospace; font-size: 0.6rem; color: rgba(255,255,255,0.6);">5</div>
</div>
<div style="background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35);">Deadline</div>
<div style="font-family: monospace; font-size: 0.6rem; color: rgba(255,255,255,0.6);">120s</div>
</div>
<div style="background: rgba(255,255,255,0.03); border-radius: 4px; padding: 0.3rem; text-align: center;">
<div style="font-size: 0.5rem; color: rgba(255,255,255,0.35);">Coordination</div>
<div style="font-family: monospace; font-size: 0.6rem; color: rgba(255,255,255,0.6);">msg-pass</div>
</div>
</div>
</div>
</div>

<p>The supervisor harness manages the fleet: it routes sub-tasks to specialist agents, allocates budget across them, enforces system-level deadlines, and merges results. Each agent has its own harness with its own policies — but the supervisor can override those policies when system-level constraints demand it (e.g., reducing Agent B's timeout because Agent A took longer than expected and the deadline is approaching).</p>

<p>The critical principle for multi-agent harnesses is <strong>no shared mutable state</strong>. Agents communicate through structured messages, not shared memory. This eliminates race conditions, makes agent interactions reproducible, and allows you to replay and debug any multi-agent interaction from the message log alone.</p>

<h3>The Anti-Patterns</h3>

<p>Having reviewed dozens of production agent systems, I see the same harness anti-patterns repeatedly:</p>

<div style="margin: 2.5rem auto; max-width: 660px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Common Harness Anti-Patterns</div>
<div style="font-size: 0.75rem; color: rgba(255,255,255,0.7); line-height: 2;">
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #ff5f57; font-family: monospace; font-weight: 700;">01</span> <strong>Prompt-based guardrails.</strong> "Please do not call this tool more than 3 times" in the system prompt. The LLM will violate this. Enforce with code.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #ff5f57; font-family: monospace; font-weight: 700;">02</span> <strong>Unbounded conversation history.</strong> Passing the full message array to every call. Tokens grow linearly, quality degrades, costs explode.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #ff5f57; font-family: monospace; font-weight: 700;">03</span> <strong>No fallback chain.</strong> Single model provider, single retry strategy. One API outage takes down the entire system.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #ff5f57; font-family: monospace; font-weight: 700;">04</span> <strong>Silent failures.</strong> Catching exceptions, returning empty strings, and hoping the user will not notice. Always fail explicitly.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #ff5f57; font-family: monospace; font-weight: 700;">05</span> <strong>Evaluation as afterthought.</strong> Only checking output quality during development. Production outputs go unchecked until a user complains.</div>
<div style="padding: 0.4rem 0;"><span style="color: #ff5f57; font-family: monospace; font-weight: 700;">06</span> <strong>Monolithic agent scope.</strong> One agent does everything. No task decomposition, no principle of least privilege, no blast radius containment.</div>
</div>
</div>
</div>

<h3>Framework Comparison: Where Existing Tools Fall Short</h3>

<p>The current generation of agent frameworks — LangGraph, CrewAI, AutoGen, Semantic Kernel — provide excellent primitives for agent orchestration. But they are not harnesses. They provide the building blocks; you must engineer the harness yourself.</p>

<p>LangGraph gives you state machines and conditional edges. But it does not give you cost ceilings, circuit breakers, or runtime evaluation. CrewAI gives you multi-agent coordination. But it does not give you per-agent budget allocation, fallback chains, or checkpoint/restore. AutoGen gives you conversational patterns. But it does not give you structured traces, drift detection, or graceful degradation.</p>

<p>This is not a criticism of these frameworks — they are designed as orchestration layers, not control planes. The harness is the layer you build on top of them. It is your system's unique operational intelligence, tailored to your failure modes, your cost constraints, and your quality requirements.</p>

<h3>Key Takeaways</h3>

<div style="margin: 2.5rem auto; max-width: 660px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Engineering Principles</div>
<div style="font-size: 0.75rem; color: rgba(255,255,255,0.7); line-height: 2;">
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">01</span> The harness is the product. The LLM is a component. Never confuse the two.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">02</span> Every policy must be enforced in code, never in prompts. What can be overridden by the LLM will be overridden by the LLM.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">03</span> Design for failure first. The happy path is the exception. Recovery is the normal operating mode.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">04</span> Budget everything: tokens, time, retries, cost. Unbounded resources create unbounded risk.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">05</span> Observe everything. You cannot improve what you cannot measure. Traces are not optional.</div>
<div style="padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">06</span> Evaluate continuously. Development-time testing is necessary but insufficient. Production quality requires runtime checks.</div>
<div style="padding: 0.4rem 0;"><span style="color: #d4b896; font-family: monospace; font-weight: 700;">07</span> Agents are cattle, not pets. They should be stateless, replaceable, and independently deployable. The harness holds the state.</div>
</div>
</div>
</div>

<p>The teams that ship reliable agent systems are not the ones with the best prompts or the most expensive models. They are the ones that invest disproportionately in the harness — in the boring, deterministic infrastructure that makes the exciting, non-deterministic AI component safe to operate at scale. The harness is where engineering discipline meets AI capability. It is where production systems are won or lost.</p>`
  },
  {
    slug: "security-principles-agentic-ai",
    title: "Security Principles for Agentic AI Systems: From Trust Boundaries to Earned Autonomy",
    category: "AI Systems",
    date: "2026-05-29",
    dateDisplay: "May 29, 2026",
    readTime: "18 min read",
    featured: true,
    theme: "The security challenge of agentic AI is not that we need a new paradigm — it is that we need to extend existing security frameworks into a world where software reasons, acts autonomously, and can be manipulated through the same language interface that makes it useful.",
    excerpt: "85% of enterprises are experimenting with agentic AI. Only 5% have reached production. The gap is not capability — it is trust. Here is the architectural blueprint for closing it.",
    body: `<p>Here is the number that should reframe how you think about agentic AI deployment: according to <a href="https://blogs.cisco.com/security/the-agent-trust-gap-what-our-research-reveals-about-agentic-ai-security" target="_blank" rel="noopener">Cisco's 2026 research</a> across senior IT and security leaders, 85% of organisations are experimenting with or piloting agentic AI systems. But only 5% have pushed agents into broad production. That is not a technology gap. It is a trust gap. And trust, in engineering terms, is a security architecture problem.</p>

<p>The challenge is structural. An agentic system that can browse the web, call APIs, write and execute code, and communicate with other agents is — from a security standpoint — a new class of actor in your system. It operates at machine speed. It makes decisions probabilistically. And unlike a human operator who pauses when something feels wrong, an agent will execute a compromised instruction as confidently as a legitimate one.</p>

<p>What follows is a synthesis of the security principles I apply when designing production agentic systems, informed by <a href="https://aws.amazon.com/blogs/security/four-security-principles-for-agentic-ai-systems/" target="_blank" rel="noopener">AWS's response to the NIST CAISI Request for Information</a>, <a href="https://martinfowler.com/articles/agentic-ai-security.html" target="_blank" rel="noopener">Korny Sietsma's analysis of agentic AI security on martinfowler.com</a>, and <a href="https://blogs.cisco.com/security/the-agent-trust-gap-what-our-research-reveals-about-agentic-ai-security" target="_blank" rel="noopener">Cisco's research on the agent trust gap</a>. These are not theoretical — they are the architectural decisions that separate the 5% in production from the 85% still in pilot.</p>

<h3>The Fundamental Vulnerability: Content as Instructions</h3>

<p>Before discussing principles, you need to understand why agentic AI is fundamentally different from traditional software security. Traditional software has a clear separation between code and data. SQL injection exists because that boundary was violated — but we solved it with parameterized queries. LLMs have no such separation. They process everything — system prompts, user messages, retrieved documents, tool outputs — as a single stream of tokens. There is no architectural mechanism that distinguishes an instruction from content.</p>

<p>This means any data an agent reads is potentially an instruction it might follow. A Jira ticket. A web page. An email. A database record. If a malicious actor can write to any data source your agent reads, they can potentially inject instructions that the agent will execute.</p>

<div style="margin: 2.5rem auto; max-width: 660px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">The Instruction-Data Conflation Problem</div>
<div style="font-family: monospace; font-size: 0.72rem; line-height: 1.7; color: rgba(255,255,255,0.7); white-space: pre; overflow-x: auto;">
┌─────────────────────────────────────────────────────┐
│           LLM CONTEXT WINDOW                        │
│                                                     │
│  ┌─────────────────────────────────────────┐       │
│  │ System Prompt (instructions)            │       │
│  └─────────────────────────────────────────┘       │
│  ┌─────────────────────────────────────────┐       │
│  │ User Message (instructions)             │       │
│  └─────────────────────────────────────────┘       │
│  ┌─────────────────────────────────────────┐       │
│  │ Retrieved Document (data... or is it?)  │ ← ?   │
│  └─────────────────────────────────────────┘       │
│  ┌─────────────────────────────────────────┐       │
│  │ Tool Output (data... or instructions?)  │ ← ?   │
│  └─────────────────────────────────────────┘       │
│  ┌─────────────────────────────────────────┐       │
│  │ Agent Message from Peer (trusted?)      │ ← ?   │
│  └─────────────────────────────────────────┘       │
│                                                     │
│  The LLM treats ALL of this as one token stream.   │
│  There is NO enforcement boundary between them.    │
└─────────────────────────────────────────────────────┘
</div>
</div>
</div>

<p>This is not a bug that will be patched. It is the architecture of how language models work. Security for agentic systems must be designed around this reality, not despite it.</p>

<h3>The Lethal Trifecta</h3>

<p><a href="https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/" target="_blank" rel="noopener">Simon Willison</a> articulated the clearest framing of when agentic systems become dangerous. The risk materialises when three factors converge simultaneously:</p>

<div style="margin: 2.5rem auto; max-width: 640px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">The Lethal Trifecta for AI Agents</div>
<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem;">
<div style="background: rgba(255,95,87,0.12); border: 1px solid rgba(255,95,87,0.3); border-radius: 8px; padding: 0.8rem; text-align: center;">
<div style="font-size: 0.7rem; font-weight: 600; color: #ff5f57; margin-bottom: 0.3rem; margin-top: 0.4rem;">SENSITIVE DATA</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Credentials, PII, source code, financial records</div>
</div>
<div style="background: rgba(254,188,46,0.12); border: 1px solid rgba(254,188,46,0.3); border-radius: 8px; padding: 0.8rem; text-align: center;">
<div style="font-size: 0.7rem; font-weight: 600; color: #febc2e; margin-bottom: 0.3rem; margin-top: 0.4rem;">UNTRUSTED CONTENT</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Web pages, emails, issue trackers, user inputs</div>
</div>
<div style="background: rgba(40,200,64,0.12); border: 1px solid rgba(40,200,64,0.3); border-radius: 8px; padding: 0.8rem; text-align: center;">
<div style="font-size: 0.7rem; font-weight: 600; color: #28c840; margin-bottom: 0.3rem; margin-top: 0.4rem;">EXTERNAL COMMS</div>
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.6); line-height: 1.4;">Network access, API calls, file writes, messages</div>
</div>
</div>
<div style="text-align: center; font-size: 0.72rem; color: rgba(255,255,255,0.5); padding: 0.6rem; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">When all three are present → Attacker can inject instructions via untrusted content,<br/>access sensitive data, and exfiltrate it through external communication.</div>
</div>
</div>

<p>The attack chain is straightforward: untrusted content contains injected instructions. Those instructions direct the agent to access sensitive data. The agent then exfiltrates that data through its external communication capability — whether that is an API call, an email, a chat message, or even a carefully crafted URL in an image request.</p>

<p>Every security decision you make for an agentic system should be evaluated against this trifecta. If your architecture eliminates any one of the three factors for a given agent, the catastrophic exfiltration risk drops dramatically.</p>

<h3>Principle 1: Deterministic External Controls — The Security Box</h3>

<p>This is the most critical architectural principle, and it comes directly from <a href="https://aws.amazon.com/blogs/security/four-security-principles-for-agentic-ai-systems/" target="_blank" rel="noopener">AWS's NIST response</a>: enforce security through deterministic, infrastructure-level controls external to the agent's reasoning loop. Not through prompting. Not through alignment. Not through the agent's own judgment.</p>

<p>The logic is irrefutable. LLMs are probabilistic reasoning engines, not security enforcement mechanisms. You can instruct an LLM to refuse certain requests, but prompt injection can override those instructions. You can tell it to respect access boundaries, but it has no reliable mechanism to enforce them. Attempting to secure an agent through prompting alone is like attempting to secure a web application through client-side JavaScript validation — it provides zero guarantees against a motivated adversary.</p>

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">The Security Box Architecture</div>
<div style="font-family: monospace; font-size: 0.72rem; line-height: 1.7; color: rgba(255,255,255,0.7); white-space: pre; overflow-x: auto;">
              ┌─────────────────────────────────────────┐
              │         SECURITY BOX                     │
              │    (Deterministic, External)             │
              │                                         │
              │  ┌───────────────────────────────────┐  │
              │  │         AGENT (LLM)               │  │
              │  │   Probabilistic reasoning         │  │
              │  │   Non-deterministic outputs       │  │
              │  │   Vulnerable to injection         │  │
              │  └──────────────┬────────────────────┘  │
              │                 │                        │
              │         Every action passes through:    │
              │                 ▼                        │
              │  ┌───────────────────────────────────┐  │
              │  │       POLICY ENGINE               │  │
              │  │  • Tool allow-list (per agent)    │  │
              │  │  • Parameter-level validation     │  │
              │  │  • Data classification gates      │  │
              │  │  • Rate limits & cost caps        │  │
              │  │  • Human approval for high-risk   │  │
              │  └──────────────┬────────────────────┘  │
              │                 │                        │
              └─────────────────┼────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
             ┌────────────┐         ┌────────────┐
             │   Tools    │         │  Data      │
             │  (scoped)  │         │ (filtered) │
             └────────────┘         └────────────┘
</div>
</div>
</div>

<p>The security box is not a limitation on the agent's value. It is the precondition for achieving that value responsibly. Every interaction between the agent and the outside world — every tool call, every data access, every network request — passes through deterministic controls that the agent cannot bypass regardless of what instructions it receives.</p>

<p>In practice, this means: a centralized gateway that mediates all tool access, formally verified authorization policies (AWS uses Cedar for this), parameter-level inspection of tool calls (not just API-level), and hard enforcement that cannot be overridden by the LLM's output.</p>

<h3>Principle 2: Least Privilege with Agent-Specific Identity</h3>

<p>Traditional identity and access management was designed for humans and services with deterministic behaviour. Agents are neither. They are non-deterministic actors that inherit their invoking user's context but make autonomous decisions about how to use it. This creates a new class of privilege escalation risk.</p>

<p><a href="https://blogs.cisco.com/security/the-agent-trust-gap-what-our-research-reveals-about-agentic-ai-security" target="_blank" rel="noopener">Cisco's research</a> found that agent access control is the number one security concern among enterprise leaders. The fear is justified: an agent granted broad access "because it might need it" becomes a confused deputy the moment it processes adversarial input. The principle of least privilege — already critical in traditional systems — becomes existential in agentic contexts because agents operate at machine speed and scale.</p>

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Agent Identity & Access Architecture</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
<div style="background: rgba(255,95,87,0.08); border: 1px solid rgba(255,95,87,0.2); border-radius: 8px; padding: 0.8rem;">
<div style="font-size: 0.7rem; font-weight: 600; color: #ff5f57; margin-bottom: 0.5rem;">ANTI-PATTERN</div>
<div style="font-size: 0.68rem; color: rgba(255,255,255,0.6); line-height: 1.5;">Agent inherits user's full permissions<br/>Single identity for all agent actions<br/>Static access regardless of task<br/>No per-action audit trail</div>
</div>
<div style="background: rgba(40,200,64,0.08); border: 1px solid rgba(40,200,64,0.2); border-radius: 8px; padding: 0.8rem;">
<div style="font-size: 0.7rem; font-weight: 600; color: #28c840; margin-bottom: 0.5rem;">SECURE PATTERN</div>
<div style="font-size: 0.68rem; color: rgba(255,255,255,0.6); line-height: 1.5;">Agent has own machine identity<br/>Per-task scoped credentials<br/>Dynamic access based on intent<br/>Full action-level audit chain</div>
</div>
</div>
<div style="margin-top: 1rem; padding: 0.8rem; background: rgba(212,184,150,0.06); border-radius: 8px; border: 1px solid rgba(212,184,150,0.15);">
<div style="font-size: 0.68rem; color: rgba(255,255,255,0.6); line-height: 1.5;"><strong style="color: #d4b896;">Key Shift:</strong> Evolve from identity-based access ("who you are") to action-based access ("what you are doing right now"). Every tool call is evaluated against the specific operation and parameters, not just the agent's identity.</div>
</div>
</div>
</div>

<p>The implementation architecture requires: dedicated machine identities for agents (separate from the invoking user), per-task ephemeral credentials that expire after the operation, tool-level access scoping (agent A can read from the database but not write; agent B can write to one specific table), and traceable delegation chains that maintain attribution back to the original human actor.</p>

<h3>Principle 3: Task Decomposition as Security Architecture</h3>

<p>Remember the lethal trifecta: sensitive data + untrusted content + external communication. You cannot always eliminate these factors globally — but you can eliminate them locally by decomposing agent workflows into stages where each stage only encounters a subset of the trifecta.</p>

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Task Decomposition: Breaking the Trifecta</div>
<div style="font-family: monospace; font-size: 0.72rem; line-height: 1.7; color: rgba(255,255,255,0.7); white-space: pre; overflow-x: auto;">
MONOLITHIC AGENT (dangerous):
┌─────────────────────────────────────────────┐
│  Single Agent Context                       │
│  [S] Sensitive Data: YES                    │
│  [U] Untrusted Content: YES                 │
│  [E] External Comms: YES                    │
│  ─────────────────────────────              │
│  ALL THREE PRESENT = VULNERABLE             │
└─────────────────────────────────────────────┘

DECOMPOSED PIPELINE (secure):
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  STAGE 1:    │    │  STAGE 2:    │    │  STAGE 3:    │
│  Research    │───▶│  Analyse     │───▶│  Act         │
│              │    │              │    │              │
│  [U] Untrust │    │  [S] Sensitiv│    │  [S] Sensitiv│
│  [E] External│    │  (no untrust)│    │  [E] External│
│  (no secrets)│    │  (no external)│   │  (no untrust)│
│              │    │              │    │              │
│  Trifecta: NO│    │  Trifecta: NO│    │  Trifecta: NO│
└──────────────┘    └──────────────┘    └──────────────┘
      │                    │                    │
  Human Review         Human Review         Human Review
</div>
</div>
</div>

<p>This is not merely a security technique — it is an architectural pattern that also improves agent reliability (smaller context windows), cost efficiency (fewer tokens per stage), and debuggability (isolated failure domains). But from a security perspective, it is devastating to attackers because no single compromised stage has simultaneous access to all three elements needed for a successful exfiltration.</p>

<p>The implementation follows the principle of least privilege applied temporally: Stage 1 (Research) can access the internet but has no credentials and no access to internal systems. Stage 2 (Analysis) has access to internal data but is network-isolated — it cannot make external requests even if injected instructions tell it to. Stage 3 (Action) can write to internal systems but has no access to untrusted content. Between each stage: human review of the intermediate artefact.</p>

<h3>Principle 4: Earned Autonomy Through Continuous Evaluation</h3>

<p><a href="https://aws.amazon.com/blogs/security/four-security-principles-for-agentic-ai-systems/" target="_blank" rel="noopener">AWS's fourth principle</a> is perhaps the most pragmatic: greater autonomy should be earned through demonstrated performance, not granted by default. You start with maximum human oversight and relax it progressively as evidence accumulates.</p>

<div style="margin: 2.5rem auto; max-width: 660px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">The Autonomy Escalation Ladder</div>
<div style="display: grid; gap: 0.6rem;">
<div style="background: rgba(40,200,64,0.08); border: 1px solid rgba(40,200,64,0.2); border-radius: 8px; padding: 0.7rem 1rem; display: flex; align-items: center; gap: 0.8rem;">
<div style="font-family: monospace; font-size: 0.75rem; min-width: 24px; color: #28c840; font-weight: 700;">L4</div>
<div><div style="font-size: 0.7rem; font-weight: 600; color: #28c840;">AUTONOMOUS</div><div style="font-size: 0.65rem; color: rgba(255,255,255,0.55);">Agent acts independently for proven-safe operation classes. Continuous monitoring. Automatic rollback on anomaly.</div></div>
</div>
<div style="background: rgba(212,184,150,0.08); border: 1px solid rgba(212,184,150,0.2); border-radius: 8px; padding: 0.7rem 1rem; display: flex; align-items: center; gap: 0.8rem;">
<div style="font-family: monospace; font-size: 0.75rem; min-width: 24px; color: #d4b896; font-weight: 700;">L3</div>
<div><div style="font-size: 0.7rem; font-weight: 600; color: #d4b896;">POST-HOC REVIEW</div><div style="font-size: 0.65rem; color: rgba(255,255,255,0.55);">Agent acts first, human reviews after. Flagging for anomalous patterns. Evidence: 100+ aligned decisions logged.</div></div>
</div>
<div style="background: rgba(254,188,46,0.08); border: 1px solid rgba(254,188,46,0.2); border-radius: 8px; padding: 0.7rem 1rem; display: flex; align-items: center; gap: 0.8rem;">
<div style="font-family: monospace; font-size: 0.75rem; min-width: 24px; color: #febc2e; font-weight: 700;">L2</div>
<div><div style="font-size: 0.7rem; font-weight: 600; color: #febc2e;">SUPERVISED</div><div style="font-size: 0.65rem; color: rgba(255,255,255,0.55);">Agent proposes, human approves/rejects. Building the decision log. Evidence base accumulating.</div></div>
</div>
<div style="background: rgba(255,95,87,0.08); border: 1px solid rgba(255,95,87,0.2); border-radius: 8px; padding: 0.7rem 1rem; display: flex; align-items: center; gap: 0.8rem;">
<div style="font-family: monospace; font-size: 0.75rem; min-width: 24px; color: #ff5f57; font-weight: 700;">L1</div>
<div><div style="font-size: 0.7rem; font-weight: 600; color: #ff5f57;">LOCKED</div><div style="font-size: 0.65rem; color: rgba(255,255,255,0.55);">No autonomy. Agent is advisory only. All actions require explicit human execution. Default starting point.</div></div>
</div>
</div>
<div style="margin-top: 1rem; text-align: center; font-size: 0.65rem; color: rgba(255,255,255,0.4);">↑ Progression is per-operation-type, not global. Read-only operations may reach Level 4 while write operations stay at Level 2.</div>
</div>
</div>

<p>This progression is critically important: it happens at the operation level, not the agent level. An agent might earn full autonomy for "read and summarise internal documents" while remaining locked at supervised mode for "send emails on behalf of the user." The granularity matters because the risk profile is entirely different for different operations.</p>

<p>The evidence base for promotion is systematic: what did the agent recommend? What did the human decide? What actually happened? When this record shows sustained alignment — the agent consistently recommends what the human would have approved — you have the evidence base to relax oversight. When it shows divergence, you tighten controls or redesign the agent's decision-making.</p>

<p>Critically, this progression is not one-way. Organisations must be prepared to reintroduce human oversight when new evidence warrants it. A model update, a prompt change, or a shift in the agent's operational environment can all invalidate previously earned trust.</p>

<h3>Principle 5: Observability as Security Infrastructure</h3>

<p>You cannot secure what you cannot observe. For agentic systems, observability is not a debugging convenience — it is security infrastructure. And it must be protected from the agents it monitors. You would not allow an employee to edit their own audit logs. The same principle applies to agents.</p>

<div style="margin: 2.5rem auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Agent Observability Stack</div>
<div style="font-family: monospace; font-size: 0.72rem; line-height: 1.7; color: rgba(255,255,255,0.7); white-space: pre; overflow-x: auto;">
┌─────────────────────────────────────────────────────┐
│              OBSERVABILITY PLANE                     │
│         (Agent has NO write access here)            │
│                                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────────┐  │
│  │ Action Log │ │ Decision   │ │ Anomaly        │  │
│  │ (every     │ │ Trace      │ │ Detector       │  │
│  │  tool call)│ │ (reasoning │ │ (behavioral    │  │
│  │            │ │  chain)    │ │  drift alerts) │  │
│  └─────┬──────┘ └─────┬──────┘ └───────┬────────┘  │
│        │               │                │           │
│        └───────────────┼────────────────┘           │
│                        ▼                            │
│              ┌──────────────────┐                   │
│              │  Security SIEM   │                   │
│              │  (correlation,   │                   │
│              │   alerting,      │                   │
│              │   forensics)     │                   │
│              └──────────────────┘                   │
└─────────────────────────────────────────────────────┘
                         │
             What gets logged per action:
             • Agent ID + Task ID
             • Tool called + Parameters
             • Data accessed (classification level)
             • Guardrail verdict (pass/block/escalate)
             • Cost consumed
             • Delegation chain (who triggered this?)
             • Timestamp + Duration
</div>
</div>
</div>

<p>The observability requirements for agentic systems go beyond traditional application logging. You need: full decision traces (the chain of reasoning that led to each action), parameter-level tool call logs (not just "called the API" but "called the API with these specific arguments"), data access classification (what sensitivity level of data was accessed), guardrail verdicts (was this action approved, blocked, or escalated — and why), delegation chains (which human user's request ultimately led to this agent action), and behavioural baselines that detect drift over time.</p>

<p>This observability data serves three purposes: real-time security monitoring (detect active attacks), forensic investigation (understand what happened post-incident), and the evidence base for earned autonomy (systematic record of agent decision quality over time).</p>

<h3>Principle 6: Compute Isolation and Sandboxing</h3>

<p>When an agent can execute code, browse the web, or run shell commands, the blast radius of a compromised agent extends to everything on the host machine. The mitigation is compute isolation: run agents in environments where the damage from a successful attack is contained.</p>

<p>The isolation spectrum ranges from process-level sandboxing (minimal protection) to full micro-VM isolation (maximum containment). AWS uses <a href="https://firecracker-microvm.github.io/" target="_blank" rel="noopener">Firecracker</a> — lightweight micro-VMs backed by Linux KVM and hardware virtualisation — to achieve container-speed with VM-level isolation for agent compute. For most organisations, Docker containers with restricted capabilities provide a practical middle ground.</p>

<p>The key architectural decisions for agent sandboxing:</p>

<ul>
<li><strong>Network isolation:</strong> Agents that process untrusted content should have no network access, or access restricted to a strict allow-list of domains. Even a GET request to an attacker-controlled URL can exfiltrate data via query parameters.</li>
<li><strong>Filesystem isolation:</strong> Mount only the minimum required project files. Never expose credentials files, SSH keys, browser cookies, or cloud configuration.</li>
<li><strong>Credential isolation:</strong> Use ephemeral, scoped tokens injected at runtime. Never store long-lived credentials in the agent's accessible environment.</li>
<li><strong>Output boundary:</strong> All agent outputs — code generated, files written, commands executed — should be captured in an isolated workspace that requires explicit human approval to promote to production.</li>
</ul>

<h3>The Ownership Problem</h3>

<p><a href="https://blogs.cisco.com/security/the-agent-trust-gap-what-our-research-reveals-about-agentic-ai-security" target="_blank" rel="noopener">Cisco's research</a> surfaced a structural challenge that technical architectures alone cannot solve: who owns agentic AI security? Their findings show 29% say the CISO, 27% say CIO/IT, 24% point to a central AI committee, and 11% admit there is no clear ownership. This fragmentation is a nightmare for production deployments.</p>

<p>When agent security spans identity systems (IAM team), infrastructure (platform team), model behaviour (AI/ML team), and data governance (compliance team), fragmented ownership means fragmented enforcement. Your policies and your actual controls will be completely out of sync.</p>

<p>The organisations that successfully reach production — that 5% in Cisco's research — are the ones that establish unified accountability early. Not a committee. A single accountable owner with authority to enforce security decisions across all teams that touch agent infrastructure.</p>

<h3>Practical Implementation Checklist</h3>

<p>If you are building agentic AI systems today, here is the minimum security architecture I recommend before any production deployment:</p>

<div style="margin: 2.5rem auto; max-width: 640px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Production Readiness Checklist</div>
<div style="font-size: 0.75rem; color: rgba(255,255,255,0.7); line-height: 2;">
<div style="padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">□ Every agent has its own machine identity (not user's credentials)</div>
<div style="padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">□ Tool access enforced externally (gateway, not prompt instructions)</div>
<div style="padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">□ Parameter-level policy enforcement on all tool calls</div>
<div style="padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">□ No agent has all three trifecta elements simultaneously</div>
<div style="padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">□ High-consequence actions require human approval</div>
<div style="padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">□ Compute isolated (container/VM) for agents processing untrusted input</div>
<div style="padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">□ Full audit trail — every action, every guardrail verdict</div>
<div style="padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">□ Observability plane inaccessible to agents</div>
<div style="padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">□ Behavioural drift detection with automatic rollback</div>
<div style="padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">□ Network allow-list (not block-list) for agent communications</div>
<div style="padding: 0.3rem 0; border-bottom: 1px solid rgba(255,255,255,0.04);">□ Credentials never stored in agent-accessible filesystem</div>
<div style="padding: 0.3rem 0;">□ Clear single-owner accountability for agent security</div>
</div>
</div>
</div>

<h3>The Path Forward</h3>

<p>Agentic AI is not going away. The productivity gains are real, the use cases are compelling, and the economic pressure to adopt is intense. But the 85%-to-5% gap in Cisco's research tells us something important: the industry is not blocked on capability. It is blocked on trust. And trust is an engineering problem with an engineering solution.</p>

<p>That solution is not "wait until LLMs are more secure." The instruction-data conflation problem is architectural — it will not be patched away. The solution is to design systems where security does not depend on the LLM behaving correctly. Deterministic external controls. Least-privilege identities. Task decomposition that breaks the lethal trifecta. Earned autonomy through systematic evaluation. Observability that the agent cannot subvert. Compute isolation that contains blast radius.</p>

<p>The organisations that reach production are not the ones moving fastest. They are the ones that embed these architectural principles from day one. Security is not the enemy of agentic AI adoption — it is the precondition for it.</p>

<hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 2.5rem 0;" />
<p style="font-size: 0.8rem; color: rgba(255,255,255,0.45); line-height: 1.8;"><strong style="color: rgba(255,255,255,0.6);">References:</strong><br/>
• <a href="https://aws.amazon.com/blogs/security/four-security-principles-for-agentic-ai-systems/" target="_blank" rel="noopener" style="color: #d4b896;">Four Security Principles for Agentic AI Systems</a> — AWS Security Blog (Mark Ryland, Riggs Goodman III, Todd MacDermid)<br/>
• <a href="https://martinfowler.com/articles/agentic-ai-security.html" target="_blank" rel="noopener" style="color: #d4b896;">Agentic AI and Security</a> — martinfowler.com (Korny Sietsma)<br/>
• <a href="https://blogs.cisco.com/security/the-agent-trust-gap-what-our-research-reveals-about-agentic-ai-security" target="_blank" rel="noopener" style="color: #d4b896;">The Agent Trust Gap: What Our Research Reveals About Agentic AI Security</a> — Cisco Security Blog (Ted Kietzman)<br/>
• <a href="https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/" target="_blank" rel="noopener" style="color: #d4b896;">The Lethal Trifecta for AI Agents</a> — Simon Willison</p>`
  },
  {
    slug: "token-economy-agentic-systems",
    title: "The Token Economy: Architectural Patterns for Cost-Efficient Agentic Systems",
    category: "AI Systems",
    date: "2026-05-23",
    dateDisplay: "May 23, 2026",
    readTime: "16 min read",
    featured: true,
    theme: "Token optimization is not about saving money — it is about building systems that can scale without the cost curve becoming the binding constraint on what you can build.",
    excerpt: "An unoptimized agent can burn through $2,000/month on a single workflow. The difference between a prototype and a production system is not capability — it is token discipline.",
    body: `<p>Here is a number that should concern every team shipping agentic AI to production: a single unoptimized agent handling 100 conversations per day can consume 150,000+ input tokens per turn. At current pricing, that is $2,000–$3,000 per month — for one agent, doing one job. Scale that across a fleet of agents in a real enterprise workflow and you are looking at infrastructure costs that make your Kubernetes bill look modest.</p>

<p>The uncomfortable truth is that most agentic systems I audit are burning 60–80% of their token budget on context that adds no value to the current decision. Stale conversation history, fully loaded tool schemas that will never be invoked, system prompts that repeat instructions the model already internalized three turns ago. This is not an intelligence problem. It is an architecture problem.</p>

<p>What follows is a set of production-tested patterns for building agents that are both capable and economically sustainable. These are not theoretical — they are drawn from systems I have designed and operated at scale.</p>

<h3>The Token Budget Mental Model</h3>

<p>Before diving into patterns, you need a framework for thinking about token consumption. Every token in an agentic system falls into one of four categories:</p>

<div style="margin: 2.5rem auto; max-width: 640px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.08), rgba(201,168,124,0.03)); border: 1px solid rgba(212,184,150,0.3); border-radius: 12px; padding: 1.5rem; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Token Budget Taxonomy</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
<div style="background: rgba(212,184,150,0.12); border: 1px solid rgba(212,184,150,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-size: 0.7rem; font-weight: 600; color: #d4b896; margin-bottom: 0.3rem;">STRUCTURAL</div>
<div style="font-size: 0.72rem; color: rgba(255,255,255,0.65); line-height: 1.4;">System prompt, persona, constraints. Fixed cost per turn.</div>
</div>
<div style="background: rgba(212,184,150,0.12); border: 1px solid rgba(212,184,150,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-size: 0.7rem; font-weight: 600; color: #d4b896; margin-bottom: 0.3rem;">CONTEXTUAL</div>
<div style="font-size: 0.72rem; color: rgba(255,255,255,0.65); line-height: 1.4;">Conversation history, retrieved documents, prior tool results.</div>
</div>
<div style="background: rgba(212,184,150,0.12); border: 1px solid rgba(212,184,150,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-size: 0.7rem; font-weight: 600; color: #d4b896; margin-bottom: 0.3rem;">CAPABILITY</div>
<div style="font-size: 0.72rem; color: rgba(255,255,255,0.65); line-height: 1.4;">Tool schemas, function definitions, available actions.</div>
</div>
<div style="background: rgba(212,184,150,0.12); border: 1px solid rgba(212,184,150,0.25); border-radius: 8px; padding: 0.8rem;">
<div style="font-size: 0.7rem; font-weight: 600; color: #d4b896; margin-bottom: 0.3rem;">GENERATIVE</div>
<div style="font-size: 0.72rem; color: rgba(255,255,255,0.65); line-height: 1.4;">The model's output tokens — reasoning, tool calls, responses.</div>
</div>
</div>
</div>
</div>

<p>The first three are input costs you control architecturally. The fourth is output cost you influence through prompt design. Most optimization efforts focus on the wrong category. Let me show you where the real leverage is.</p>

<h3>Pattern 1: Context Window Tiering</h3>

<p>The most impactful pattern I have deployed is treating context like a cache hierarchy — not everything belongs in L1. Most agentic frameworks dump the entire conversation history into every request. This is the equivalent of loading your entire database into memory for every query.</p>

<div style="margin: 2.5rem auto; max-width: 640px;">
<div style="background: rgba(20,20,25,0.8); border: 1px solid rgba(212,184,150,0.2); border-radius: 12px; padding: 1.5rem; font-family: monospace;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Context Window Tiering Architecture</div>
<div style="display: flex; flex-direction: column; gap: 0.5rem;">
<div style="display: flex; align-items: center; gap: 0.8rem;">
<div style="width: 60px; font-size: 0.65rem; color: #d4b896; font-weight: 600;">L1 HOT</div>
<div style="flex: 1; background: linear-gradient(90deg, rgba(212,184,150,0.3), rgba(212,184,150,0.05)); border-radius: 4px; padding: 0.5rem 0.8rem; font-size: 0.7rem; color: rgba(255,255,255,0.8);">Current turn + last 2 exchanges + active tool results</div>
</div>
<div style="display: flex; align-items: center; gap: 0.8rem;">
<div style="width: 60px; font-size: 0.65rem; color: rgba(212,184,150,0.7); font-weight: 600;">L2 WARM</div>
<div style="flex: 1; background: linear-gradient(90deg, rgba(212,184,150,0.15), rgba(212,184,150,0.03)); border-radius: 4px; padding: 0.5rem 0.8rem; font-size: 0.7rem; color: rgba(255,255,255,0.65);">Summarized history + key decisions + user preferences</div>
</div>
<div style="display: flex; align-items: center; gap: 0.8rem;">
<div style="width: 60px; font-size: 0.65rem; color: rgba(212,184,150,0.4); font-weight: 600;">L3 COLD</div>
<div style="flex: 1; background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)); border-radius: 4px; padding: 0.5rem 0.8rem; font-size: 0.7rem; color: rgba(255,255,255,0.5);">Full conversation archive — retrieved on-demand via semantic search</div>
</div>
</div>
<div style="margin-top: 1rem; padding-top: 0.8rem; border-top: 1px solid rgba(255,255,255,0.06); font-size: 0.65rem; color: rgba(255,255,255,0.4); text-align: center;">L1: every turn (~2K tokens) · L2: every 5th turn (~1K tokens) · L3: on explicit recall (~variable)</div>
</div>
</div>

<p>The implementation is straightforward: after every N turns (I use 5), run a compaction step that summarizes the conversation so far into a structured digest — key facts, decisions made, open questions. This digest becomes your L2 context. The raw history moves to L3 storage (a vector store or simple key-value map) and is only retrieved if the agent explicitly needs to recall something distant.</p>

<p>In production, this pattern alone reduces average input tokens by 40–55% after the tenth turn of a conversation. The compaction itself costs tokens, but the amortized savings are dramatic — especially for long-running agent sessions.</p>

<h3>Pattern 2: Lazy Tool Loading</h3>

<p>A typical production agent has access to 15–40 tools. Each tool schema consumes 200–800 tokens. Loading all tool definitions into every request means 5,000–15,000 tokens of capability context that the model will never use in most turns.</p>

<p>The pattern: load tools in stages based on conversational signal.</p>

<div style="margin: 2.5rem auto; max-width: 640px;">
<div style="background: rgba(20,20,25,0.8); border: 1px solid rgba(212,184,150,0.2); border-radius: 12px; padding: 1.5rem;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Lazy Tool Loading Pipeline</div>
<div style="display: flex; flex-direction: column; gap: 0.6rem;">
<div style="display: flex; align-items: center; gap: 0.6rem;">
<div style="width: 24px; height: 24px; background: rgba(212,184,150,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: #d4b896; font-weight: 700; flex-shrink: 0;">1</div>
<div style="font-size: 0.75rem; color: rgba(255,255,255,0.75);"><strong style="color: #d4b896;">Classify intent</strong> — lightweight classifier (or the model itself) determines the action domain</div>
</div>
<div style="display: flex; align-items: center; gap: 0.6rem;">
<div style="width: 24px; height: 24px; background: rgba(212,184,150,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: #d4b896; font-weight: 700; flex-shrink: 0;">2</div>
<div style="font-size: 0.75rem; color: rgba(255,255,255,0.75);"><strong style="color: #d4b896;">Load relevant tools</strong> — inject only the 3–5 tool schemas that match the classified domain</div>
</div>
<div style="display: flex; align-items: center; gap: 0.6rem;">
<div style="width: 24px; height: 24px; background: rgba(212,184,150,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: #d4b896; font-weight: 700; flex-shrink: 0;">3</div>
<div style="font-size: 0.75rem; color: rgba(255,255,255,0.75);"><strong style="color: #d4b896;">Execute + validate</strong> — run tool calls with full schema, discard after turn completes</div>
</div>
<div style="display: flex; align-items: center; gap: 0.6rem;">
<div style="width: 24px; height: 24px; background: rgba(212,184,150,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: #d4b896; font-weight: 700; flex-shrink: 0;">4</div>
<div style="font-size: 0.75rem; color: rgba(255,255,255,0.75);"><strong style="color: #d4b896;">Fallback expansion</strong> — if no tool matches, expand to full schema set (rare path)</div>
</div>
</div>
<div style="margin-top: 1rem; padding-top: 0.8rem; border-top: 1px solid rgba(255,255,255,0.06); font-size: 0.65rem; color: rgba(255,255,255,0.4); text-align: center;">Typical savings: 8,000–12,000 tokens/turn for agents with 20+ tools</div>
</div>
</div>

<p>The intent classification step can be as simple as a regex match on the user message or as sophisticated as a small fine-tuned classifier. In most systems I build, a 200-line routing function with keyword matching handles 85% of cases correctly. The remaining 15% hits the fallback path — slightly more expensive, but rare enough to be negligible at aggregate.</p>

<p>The tradeoff is latency: you add one classification step before the main inference. In practice this adds 50–100ms when using a small model for routing, which is imperceptible in most agent UX patterns.</p>

<h3>Pattern 3: Model Cascading</h3>

<p>Not every agent turn requires your most capable (and most expensive) model. The insight is that most conversational turns in an agentic workflow are routine — acknowledgments, clarifying questions, simple lookups, status checks. Only 15–25% of turns require genuine reasoning over complex, ambiguous situations.</p>

<div style="margin: 2.5rem auto; max-width: 640px;">
<div style="background: rgba(20,20,25,0.8); border: 1px solid rgba(212,184,150,0.2); border-radius: 12px; padding: 1.5rem;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Model Cascade Architecture</div>
<div style="display: flex; align-items: stretch; gap: 0.4rem; height: 120px;">
<div style="flex: 3; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.5rem;">
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.4); margin-bottom: 0.3rem;">75% of turns</div>
<div style="font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.7);">Small / Fast Model</div>
<div style="font-size: 0.6rem; color: rgba(212,184,150,0.6); margin-top: 0.2rem;">~$0.15/1M tokens</div>
</div>
<div style="flex: 1.5; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(212,184,150,0.08); border: 1px solid rgba(212,184,150,0.2); border-radius: 8px; padding: 0.5rem;">
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.4); margin-bottom: 0.3rem;">20% of turns</div>
<div style="font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.8);">Mid-tier Model</div>
<div style="font-size: 0.6rem; color: rgba(212,184,150,0.7); margin-top: 0.2rem;">~$3/1M tokens</div>
</div>
<div style="flex: 0.8; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(212,184,150,0.15); border: 1px solid rgba(212,184,150,0.35); border-radius: 8px; padding: 0.5rem;">
<div style="font-size: 0.6rem; color: rgba(255,255,255,0.4); margin-bottom: 0.3rem;">5%</div>
<div style="font-size: 0.72rem; font-weight: 600; color: #d4b896;">Frontier</div>
<div style="font-size: 0.6rem; color: rgba(212,184,150,0.8); margin-top: 0.2rem;">~$15/1M</div>
</div>
</div>
<div style="margin-top: 1rem; font-size: 0.65rem; color: rgba(255,255,255,0.4); text-align: center;">Router decides complexity → dispatches to appropriate tier → escalates on uncertainty</div>
</div>
</div>

<p>The router that decides which model handles a given turn can itself be a small model, a rule-based system, or a confidence-threshold mechanism. My preferred approach: start every turn with the cheapest model. If its confidence score (logprobs or a self-assessed certainty token) falls below a threshold, escalate to the next tier. This means you only pay premium prices for genuinely hard problems.</p>

<p>In one production system I architected, this pattern reduced monthly LLM costs by 72% while maintaining the same task completion rate. The key insight: users cannot distinguish between responses from a $0.15/M model and a $15/M model when the task is simple. They absolutely can when the task is complex — which is precisely when you escalate.</p>

<h3>Pattern 4: Prompt Caching and Prefix Sharing</h3>

<p>If your agent's system prompt is 3,000 tokens and you send 100 requests per hour, you are paying for those same 3,000 tokens 100 times. Anthropic, OpenAI, and Google all now offer prompt caching — where repeated prefixes are stored server-side and charged at a steep discount (typically 75–90% off).</p>

<p>This is not a code pattern — it is an architectural decision about prompt structure. The principle: design your prompts with a stable prefix and a variable suffix.</p>

<div style="margin: 2rem auto; max-width: 580px; background: rgba(20,20,25,0.9); border: 1px solid rgba(212,184,150,0.15); border-radius: 8px; padding: 1.2rem; font-family: monospace; font-size: 0.7rem; line-height: 1.6;">
<div style="color: rgba(212,184,150,0.6);">// Prompt structure for maximum cache hits</div>
<div style="color: rgba(255,255,255,0.5); margin-top: 0.5rem;">┌─────────────────────────────────────┐</div>
<div style="color: rgba(255,255,255,0.5);">│ <span style="color: #d4b896;">CACHED PREFIX</span> (stable across requests) │</div>
<div style="color: rgba(255,255,255,0.5);">│  • System identity &amp; constraints    │</div>
<div style="color: rgba(255,255,255,0.5);">│  • Tool schemas (sorted, stable)     │</div>
<div style="color: rgba(255,255,255,0.5);">│  • Output format specifications      │</div>
<div style="color: rgba(255,255,255,0.5);">│  • Safety guardrails                 │</div>
<div style="color: rgba(255,255,255,0.5);">├─────────────────────────────────────┤</div>
<div style="color: rgba(255,255,255,0.5);">│ <span style="color: rgba(255,255,255,0.8);">VARIABLE SUFFIX</span> (changes per request)  │</div>
<div style="color: rgba(255,255,255,0.5);">│  • Conversation context (tiered)     │</div>
<div style="color: rgba(255,255,255,0.5);">│  • Current user message              │</div>
<div style="color: rgba(255,255,255,0.5);">│  • Retrieved documents (if any)      │</div>
<div style="color: rgba(255,255,255,0.5);">└─────────────────────────────────────┘</div>
</div>

<p>The critical implementation detail: your cached prefix must be byte-identical across requests. This means tool schemas should be deterministically sorted, not randomly ordered. Timestamps or request IDs must not appear in the prefix. Any dynamic content — even a single character change — invalidates the cache.</p>

<p>When combined with context tiering (Pattern 1), prompt caching can reduce your effective input cost by 60–70% on the structural portion of every request.</p>

<h3>Pattern 5: Semantic Deduplication</h3>

<p>In RAG-augmented agents, the retrieval step often returns overlapping or redundant context chunks. Three chunks that all say roughly the same thing about a topic consume 3x the tokens while providing diminishing returns on grounding quality.</p>

<p>The pattern: add a deduplication layer between retrieval and context injection. After your vector search returns K candidates, compute pairwise similarity scores and collapse near-duplicates into a single representative chunk (the one with the highest retrieval score). In practice, I find that top-10 retrieval results typically contain 3–4 redundant pairs, meaning you can often reduce RAG context by 30–40% with no loss in answer quality.</p>

<p>The implementation is lightweight: a cosine similarity threshold (0.92 works well for most embedding models) between retrieved chunks, with the highest-scoring chunk kept and its duplicates discarded. Total compute cost: negligible compared to the token savings downstream.</p>

<h3>Pattern 6: Subagent Delegation with Minimal Context</h3>

<p>When a primary agent delegates to a subagent, the naive approach is to forward the entire conversation context. This is almost always wrong. The subagent needs a scoped task description, not the full history of how that task was identified.</p>

<div style="margin: 2.5rem auto; max-width: 640px;">
<div style="background: rgba(20,20,25,0.8); border: 1px solid rgba(212,184,150,0.2); border-radius: 12px; padding: 1.5rem;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 1rem; text-align: center;">Delegation Context Protocol</div>
<div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.8rem; align-items: center;">
<div style="background: rgba(212,184,150,0.1); border: 1px solid rgba(212,184,150,0.2); border-radius: 8px; padding: 1rem; text-align: center;">
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.4); margin-bottom: 0.4rem;">ORCHESTRATOR</div>
<div style="font-size: 0.72rem; color: rgba(255,255,255,0.7);">Full context<br/>(50K tokens)</div>
</div>
<div style="display: flex; flex-direction: column; align-items: center; gap: 0.3rem;">
<div style="font-size: 0.9rem; color: rgba(212,184,150,0.6);">→</div>
<div style="font-size: 0.55rem; color: rgba(255,255,255,0.35); max-width: 60px; text-align: center;">task brief only</div>
<div style="font-size: 0.9rem; color: rgba(212,184,150,0.6);">→</div>
</div>
<div style="background: rgba(212,184,150,0.1); border: 1px solid rgba(212,184,150,0.2); border-radius: 8px; padding: 1rem; text-align: center;">
<div style="font-size: 0.65rem; color: rgba(255,255,255,0.4); margin-bottom: 0.4rem;">SUBAGENT</div>
<div style="font-size: 0.72rem; color: rgba(255,255,255,0.7);">Scoped context<br/>(3K tokens)</div>
</div>
</div>
<div style="margin-top: 1rem; padding-top: 0.8rem; border-top: 1px solid rgba(255,255,255,0.06); font-size: 0.65rem; color: rgba(255,255,255,0.4); text-align: center;">The orchestrator crafts a minimal brief: objective + constraints + expected output format</div>
</div>
</div>

<p>The orchestrator's job is to distill a 50K-token conversation into a 500-token task brief for the subagent. This brief contains: what to do, what constraints apply, and what format the result should take. Nothing else. The subagent operates with a clean, minimal context — faster inference, lower cost, and often better results because there is less noise to distract the model.</p>

<p>This mirrors how good engineering managers delegate: you do not forward the entire Slack thread. You write a clear, scoped brief.</p>

<h3>The Compound Effect</h3>

<p>These patterns are not mutually exclusive — they stack. Let me quantify what happens when you apply all six to a typical production agent processing 100 sessions per day:</p>

<div style="margin: 2rem auto; max-width: 580px;">
<table style="width: 100%; border-collapse: collapse; font-size: 0.75rem;">
<tr style="border-bottom: 1px solid rgba(212,184,150,0.2);">
<td style="padding: 0.6rem 0.8rem; color: rgba(255,255,255,0.5);">Baseline (no optimization)</td>
<td style="padding: 0.6rem 0.8rem; color: rgba(255,255,255,0.8); text-align: right;">~$2,400/mo</td>
</tr>
<tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
<td style="padding: 0.6rem 0.8rem; color: rgba(255,255,255,0.5);">+ Context tiering</td>
<td style="padding: 0.6rem 0.8rem; color: rgba(255,255,255,0.8); text-align: right;">~$1,320/mo</td>
</tr>
<tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
<td style="padding: 0.6rem 0.8rem; color: rgba(255,255,255,0.5);">+ Lazy tool loading</td>
<td style="padding: 0.6rem 0.8rem; color: rgba(255,255,255,0.8); text-align: right;">~$980/mo</td>
</tr>
<tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
<td style="padding: 0.6rem 0.8rem; color: rgba(255,255,255,0.5);">+ Model cascading</td>
<td style="padding: 0.6rem 0.8rem; color: rgba(255,255,255,0.8); text-align: right;">~$390/mo</td>
</tr>
<tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
<td style="padding: 0.6rem 0.8rem; color: rgba(255,255,255,0.5);">+ Prompt caching</td>
<td style="padding: 0.6rem 0.8rem; color: rgba(255,255,255,0.8); text-align: right;">~$240/mo</td>
</tr>
<tr style="border-bottom: 1px solid rgba(212,184,150,0.2);">
<td style="padding: 0.6rem 0.8rem; color: rgba(255,255,255,0.5);">+ Semantic dedup + subagent scoping</td>
<td style="padding: 0.6rem 0.8rem; color: #d4b896; font-weight: 600; text-align: right;">~$160/mo</td>
</tr>
</table>
<div style="text-align: center; margin-top: 0.8rem; font-size: 0.65rem; color: rgba(255,255,255,0.35);">93% reduction · Same task completion rate · Same user satisfaction scores</div>
</div>

<p>From $2,400 to $160. Same capability. Same user experience. The difference is pure architectural discipline.</p>

<h3>The Tradeoffs You Must Accept</h3>

<p>Token optimization is not free. Every pattern introduces complexity and potential failure modes:</p>

<ul>
<li><strong>Context tiering</strong> can lose important details during compaction. You need a quality threshold on your summaries and a mechanism to retrieve raw history when the agent is uncertain.</li>
<li><strong>Lazy tool loading</strong> can misroute — the classifier might not load a tool the model actually needs. Your fallback expansion path must be fast and well-monitored.</li>
<li><strong>Model cascading</strong> can produce noticeably worse responses on edge cases that a simple router misclassifies as routine. You need confidence calibration and escalation telemetry.</li>
<li><strong>Prompt caching</strong> requires strict prompt hygiene — any accidental dynamic content in your prefix kills cache hit rates silently.</li>
</ul>

<p>The meta-principle: every optimization adds an observability requirement. If you cannot measure whether an optimization is degrading quality, you should not deploy it. Instrument first, optimize second.</p>

<h3>Implementation Priorities</h3>

<p>If you are starting from an unoptimized agent and want to know where to begin:</p>

<ol>
<li><strong>Prompt caching</strong> — zero code change in most cases, immediate 50–75% savings on structural tokens. Do this today.</li>
<li><strong>Context tiering</strong> — moderate implementation effort, highest sustained savings over long conversations. Do this week.</li>
<li><strong>Model cascading</strong> — requires a routing mechanism but delivers the single largest absolute cost reduction. Do this month.</li>
<li><strong>Lazy tool loading</strong> — only relevant if you have 10+ tools. High impact when applicable.</li>
<li><strong>Semantic dedup and subagent scoping</strong> — refinements that matter at scale. Implement when the first four are stable.</li>
</ol>

<p>The order matters because each pattern's savings compound on the previous. Prompt caching first means your subsequent optimizations operate on already-discounted tokens.</p>

<h3>The Deeper Point</h3>

<p>Token optimization is not really about saving money — though the money matters. It is about building systems that can scale without the cost curve becoming the binding constraint on what you can build. An agent that costs $2,400/month is a prototype. An agent that costs $160/month is infrastructure you can replicate across your entire organization.</p>

<p>The teams that will win the agentic era are not the ones with the biggest model budgets. They are the ones with the most disciplined architectures — systems that deliver maximum intelligence per token spent. That is the real competitive advantage.</p>`
  },
  {
    slug: "developer-identity-ai-era",
    title: "The developer is dead. Long live the developer.",
    category: "AI Systems",
    date: "2026-05-22",
    dateDisplay: "May 22, 2026",
    readTime: "14 min read",
    featured: true,
    theme: "The role is not disappearing — it is ascending. From writing code to orchestrating systems of intelligence. The developers who thrive will be T-shaped: deep in engineering, broad in orchestration.",
    excerpt: "Google's Developer Intelligence team just told us where development is heading. 75% of their code is AI-generated. Here is what that means for architectural identity.",
    body: `<p>Google's Developer Intelligence team recently presented at I/O 2026 with a number that should stop every software engineer mid-scroll: 75% of new code at Google is now written with AI assistance. Not autocomplete suggestions. Not snippet generation. Substantive, structural, production-bound code. If you are still thinking of AI as a faster keyboard, you are thinking about this wrong.</p>

<p>The talk articulated something I have been observing across every team I advise: the developer role is not being replaced — it is being elevated. The unit of work is no longer the function or the class. It is the system. And the engineers who thrive in this new landscape are not the fastest coders — they are the clearest thinkers.</p>

<h3>The T-Shaped Developer: A New Architectural Identity</h3>

<p>The most useful mental model from Google's talk is the T-shaped developer — and it maps precisely to what I see in the highest-performing engineers I work with. Let me make this concrete:</p>

<div style="margin: 2.5rem auto; max-width: 640px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.15), rgba(201,168,124,0.05)); border: 1px solid rgba(212,184,150,0.4); border-radius: 10px; padding: 1.2rem 1.5rem; text-align: center; position: relative;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 0.6rem;">← Breadth: Orchestration &amp; Systems Thinking →</div>
<div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.4rem;">
<span style="font-size: 0.75rem; padding: 0.3rem 0.6rem; background: rgba(255,255,255,0.05); border-radius: 4px; color: rgba(255,255,255,0.75);">Security</span>
<span style="font-size: 0.75rem; padding: 0.3rem 0.6rem; background: rgba(255,255,255,0.05); border-radius: 4px; color: rgba(255,255,255,0.75);">DevOps</span>
<span style="font-size: 0.75rem; padding: 0.3rem 0.6rem; background: rgba(255,255,255,0.05); border-radius: 4px; color: rgba(255,255,255,0.75);">Product</span>
<span style="font-size: 0.75rem; padding: 0.3rem 0.6rem; background: rgba(255,255,255,0.05); border-radius: 4px; color: rgba(255,255,255,0.75);">Data</span>
<span style="font-size: 0.75rem; padding: 0.3rem 0.6rem; background: rgba(255,255,255,0.05); border-radius: 4px; color: rgba(255,255,255,0.75);">UX</span>
<span style="font-size: 0.75rem; padding: 0.3rem 0.6rem; background: rgba(255,255,255,0.05); border-radius: 4px; color: rgba(255,255,255,0.75);">Business</span>
<span style="font-size: 0.75rem; padding: 0.3rem 0.6rem; background: rgba(255,255,255,0.05); border-radius: 4px; color: rgba(255,255,255,0.75);">AI Ops</span>
</div>
</div>
<div style="width: 3px; height: 24px; background: rgba(212,184,150,0.4); margin: 0 auto;"></div>
<div style="width: 180px; margin: 0 auto; background: linear-gradient(180deg, rgba(212,184,150,0.15), rgba(201,168,124,0.05)); border: 1px solid rgba(212,184,150,0.4); border-radius: 10px; padding: 1.2rem 1rem; text-align: center;">
<div style="font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 0.6rem;">Depth ↓</div>
<div style="font-size: 0.85rem; font-weight: 600; color: #d4b896; margin-bottom: 0.5rem;">Deep Technical Mastery</div>
<div style="font-size: 0.75rem; color: rgba(255,255,255,0.6); line-height: 1.7;">Systems Design<br/>Algorithms<br/>Patterns &amp; Trade-offs<br/>Engineering Judgment<br/>Evaluation &amp; Review</div>
</div>
<p style="text-align: center; font-size: 0.75rem; color: rgba(255,255,255,0.35); margin-top: 1rem; margin-bottom: 0;">The T-shaped developer: wide orchestration breadth, deep technical stem.</p>
</div>

<p>The vertical bar of the T is your deep technical mastery — algorithms, systems design, architectural patterns, and engineering judgment. This does not go away. In fact, it becomes more critical, because AI makes mistakes at speed. If you cannot evaluate whether generated code is correct, performant, and secure, you are not accelerating — you are accumulating liability.</p>

<p>The horizontal bar is the new dimension: the ability to orchestrate across disciplines. Security, deployment, monitoring, product thinking, data architecture, user experience — you need working fluency across all of these because AI does not respect organisational boundaries. An AI agent that generates code without security awareness creates vulnerabilities. One that builds features without product context solves the wrong problem.</p>

<h3>From Prompt Writer to Systems Orchestrator</h3>

<p>The framing I find most useful: you are no longer a developer who uses AI tools. You are a technical leader managing a team of AI capabilities — each with different strengths, limitations, and failure modes. This is not metaphorical. It is architecturally literal.</p>

<p>In practice, a modern development workflow looks like:</p>
<ul>
<li><strong>One AI agent handles planning</strong> — breaking requirements into architectural decisions and task decomposition</li>
<li><strong>One handles implementation</strong> — generating code against specifications you have defined</li>
<li><strong>One handles review</strong> — acting as a critic, finding bugs, security holes, and performance issues</li>
<li><strong>One handles testing</strong> — generating test cases, especially adversarial ones you would not think of</li>
<li><strong>You handle judgment</strong> — the architectural decisions, the trade-off evaluation, the "should we build this at all?" questions that no AI can answer</li>
</ul>

<p>This is not delegation. It is orchestration. The distinction matters. Delegation means handing off work and trusting the outcome. Orchestration means maintaining awareness of the full system, intervening at critical junctures, and ensuring the aggregate output is coherent. You are the conductor, not the audience.</p>

<h3>Five Habits That Separate Orchestrators from Operators</h3>

<p>Google's team identified five habits of their highest-performing AI-era developers. I want to reframe these through the lens of what I see in staff-level and principal engineers:</p>

<h4>1. They connect engineering to business outcomes</h4>
<p>The best developers I know do not start with "how do I build this?" They start with "why does this matter?" When AI can generate implementation faster than you can type requirements, the bottleneck shifts from coding to problem definition. The engineer who understands the business context — who can distinguish a high-value feature from a low-value one — becomes exponentially more valuable than one who can only execute specifications.</p>

<h4>2. They specify intent before touching code</h4>
<p>This is the most profound shift I am observing. Intent specification — writing clear constraints, rules, architectural boundaries, and acceptance criteria before any code is generated — becomes the primary artifact of engineering. The code is ephemeral (AI can regenerate it). The intent is durable. In this world, your design documents, architectural decision records, and specification files are not documentation — they are source code for a higher-order system.</p>

<h4>3. They build systems, not prompts</h4>
<p>A prompt is a single interaction. A system is a set of interacting components with defined boundaries, feedback loops, and failure modes. The developers who succeed are building AI systems — multi-agent workflows with human checkpoints, evaluation harnesses, guardrails, and observability. They are not chatting with an AI; they are architecting a collaboration between human judgment and machine capability.</p>

<h4>4. They work in small, adaptive teams</h4>
<p>When AI handles implementation and testing, the coordination overhead of large teams becomes the dominant cost. A team of three engineers with strong orchestration skills can now build what previously required twelve — because each person is running their own "AI team" in parallel. This reshapes org design: fewer, more senior engineers, each with broader scope and deeper judgment.</p>

<h4>5. They experiment relentlessly</h4>
<p>The tool landscape changes weekly. The developers who stay effective are not loyal to specific tools — they are loyal to outcomes. They try a new model every week. They benchmark new workflows against their current approach. They maintain an experimental mindset where "what I did last month" is not assumed to be optimal today.</p>

<h3>The Skill Set Evolution</h3>

<p>What does the capability profile of a high-performing developer actually look like in 2026? I see four pillars:</p>

<ul>
<li><strong>Deep technical judgment.</strong> AI generates code fast. It also generates bugs fast, security vulnerabilities fast, and architectural anti-patterns fast. Your ability to evaluate — to look at generated code and know whether it is correct, performant, secure, and maintainable — is the irreplaceable skill. You delegate execution to AI. You never delegate judgment.</li>
<li><strong>Multi-agent coordination.</strong> Running a "team" of AI tools effectively requires understanding their individual strengths, knowing when to use which model for which task, and designing workflows where their outputs feed into each other productively. This is a genuinely new skill that did not exist two years ago.</li>
<li><strong>Broad systems literacy.</strong> Security, observability, deployment, data modelling, performance — you need enough depth in each to prevent AI from creating hidden liabilities. The AI does not know your compliance requirements, your latency budget, or your operational context. You do.</li>
<li><strong>Problem framing.</strong> Talking to users, understanding business constraints, defining what "done" looks like — this is the highest-leverage activity because it determines whether AI builds the right thing. The best technology applied to the wrong problem is waste.</li>
</ul>

<h3>Practical Disciplines for the Transition</h3>

<p>If you are an engineer reading this and wondering what to do differently starting Monday, here are the practices I recommend:</p>

<ul>
<li><strong>Ask for rewrites, not fixes.</strong> When AI generates code, do not just ask it to fix the bug. Ask it to rebuild the solution using a different approach. Compare the two. Understand the trade-offs. This builds your architectural judgment faster than accepting the first answer.</li>
<li><strong>Review code you did not write.</strong> Read AI-generated code the way you would read a junior engineer's pull request. Whiteboard the data flow. Question the error handling. Challenge the assumptions. This keeps your technical judgment sharp in a world where you write less code directly.</li>
<li><strong>Make AI keep a journal.</strong> Have your AI tools log where they get stuck, where they ask clarifying questions, where they produce outputs that need correction. This log is a map of your documentation gaps and specification weaknesses. Fix the upstream causes.</li>
<li><strong>Use AI to test AI.</strong> Set up a separate agent — one you have prompted to be adversarial — to review the output of your primary agent. Let it act as a security auditor, a performance critic, or a pedantic code reviewer. Multi-agent evaluation catches what single-agent workflows miss.</li>
</ul>

<h3>What This Means for Engineering Leadership</h3>

<p>If you manage engineers, the implications are significant:</p>

<ul>
<li><strong>Retire output metrics.</strong> Lines of code, pull requests per week, story points completed — these are meaningless when AI can generate infinite output. Measure value delivered, quality achieved, and problems solved. The unit of measurement is outcomes, not activity.</li>
<li><strong>Invest in learning time.</strong> The tooling landscape is evolving faster than any individual can track through normal work. Dedicated experimentation time — not "20% time" as a nice-to-have, but protected hours for architectural exploration and tool evaluation — is a competitive necessity.</li>
<li><strong>Normalise failure in new workflows.</strong> AI-augmented development is new. Workflows will fail. Experiments will not pan out. Teams that are afraid to try new approaches because failure is punished will fall behind teams that expect and learn from failure. Blameless retrospectives are not just a nice cultural practice — they are the mechanism through which your organisation learns to use AI effectively.</li>
</ul>

<h3>The Identity Question</h3>

<p>Underneath all the practical advice is a deeper question: what does it mean to be a developer when AI writes most of the code? I have spent close to two decades in this industry, and my answer is: being a developer was never really about writing code. It was about solving problems through technology. The code was always a means, not an end.</p>

<p>What is changing is not the identity — it is the altitude. We are moving up the abstraction stack. From machine code to assembly to high-level languages to frameworks to AI-generated systems. Each elevation did not eliminate developers; it elevated them. Made them more powerful. Let them solve bigger problems.</p>

<p>The developer is not dead. The developer is ascending. The question is whether you ascend with the role — deepening your judgment, broadening your systems thinking, and learning to orchestrate intelligence — or whether you cling to the altitude where you are comfortable. The former is a career. The latter is a timeline.</p>`
  },
  {
    slug: "model-context-protocol-infrastructure",
    title: "MCP is not a protocol — it is the missing infrastructure layer for AI agents",
    category: "AI Systems",
    date: "2026-05-18",
    dateDisplay: "May 18, 2026",
    readTime: "8 min read",
    featured: true,
    theme: "When every AI agent speaks a different language to every tool, integration becomes the bottleneck. MCP is the USB-C moment for agentic systems.",
    excerpt: "The Model Context Protocol turns tool integration from a bespoke wiring problem into a standardised infrastructure layer. This changes the economics of agentic AI.",
    body: `<p>If you have built more than one agentic AI system, you have felt the pain: every new tool integration is a bespoke adapter. Every agent framework has its own way of describing capabilities, invoking functions, and handling context. The result is an industry that spends more engineering time on plumbing than on intelligence.</p>

<h3>What MCP actually solves</h3>
<p>The Model Context Protocol, originally introduced by Anthropic and now gaining broad adoption, standardises the interface between AI models and external tools, data sources, and services. Think of it as the USB-C moment for agentic systems — a single protocol that replaces dozens of proprietary connectors.</p>
<p>The key insight is separation of concerns:</p>
<ul>
<li><strong>MCP Servers</strong> expose capabilities — tools, resources, prompts — through a standard JSON-RPC interface</li>
<li><strong>MCP Clients</strong> (the AI agent/host) discover and invoke those capabilities without knowing implementation details</li>
<li><strong>Transport is decoupled</strong> — stdio for local tools, HTTP+SSE for remote services, same protocol either way</li>
</ul>

<h3>Why this matters architecturally</h3>
<p>Before MCP, integrating a new tool into an agent meant: writing a custom function schema, building serialisation logic, handling errors in a tool-specific way, and maintaining that adapter as both sides evolve. Multiply this by every tool in your stack and you have a combinatorial maintenance burden.</p>
<p>With MCP, the integration surface collapses to a single protocol. An agent that speaks MCP can discover and use any MCP server without custom code. This has three architectural consequences:</p>
<ol>
<li><strong>Composability at scale.</strong> Teams can publish internal services as MCP servers and any agent in the organisation can use them instantly.</li>
<li><strong>Trust boundaries become explicit.</strong> MCP's capability negotiation means you can expose exactly what a given agent should access — no more, no less.</li>
<li><strong>The tool ecosystem becomes shared infrastructure.</strong> Build an MCP server for your database once, and every AI tool in your stack benefits.</li>
</ol>

<h3>The production patterns emerging</h3>
<p>In production deployments I am seeing three patterns crystallise:</p>
<h4>Pattern 1: Gateway MCP servers</h4>
<p>A single MCP server that proxies multiple internal services, handling auth, rate limiting, and audit logging in one place. The agent sees a unified tool surface; the gateway enforces policy.</p>
<h4>Pattern 2: Capability registries</h4>
<p>Organisations running dozens of MCP servers use a registry service that agents query to discover available capabilities dynamically. This is service discovery for AI tools.</p>
<h4>Pattern 3: Sandboxed execution environments</h4>
<p>MCP servers that run tools inside containers or VMs, giving agents powerful capabilities (code execution, file system access) without risking the host environment.</p>

<h3>What I am building with MCP</h3>
<p>My current work involves designing MCP-native architectures where the protocol is not an afterthought but the primary integration pattern. The shift from "agent calls function" to "agent discovers and negotiates capability" changes how you think about system boundaries, permission models, and the lifecycle of AI-powered features.</p>

<p>MCP is still early. The spec is evolving, tooling is maturing, and best practices are forming in real-time. But the direction is clear: agentic AI needs a standard integration layer, and MCP is the most credible candidate we have.</p>`
  },
  {
    slug: "ai-evaluation-production-systems",
    title: "Why AI evaluation is the hardest unsolved infrastructure problem",
    category: "AI Systems",
    date: "2026-05-18",
    dateDisplay: "May 18, 2026",
    readTime: "9 min read",
    featured: true,
    theme: "Evaluation is not testing. It is the continuous practice of knowing whether your AI is still doing what you think it is doing.",
    excerpt: "Most teams treat AI evaluation as a pre-launch gate. The teams that survive production treat it as infrastructure that runs every hour of every day.",
    body: `<p>When I ask engineering teams how they evaluate their AI systems, the most common answer is: "We run a test suite before deployment." This is not evaluation. This is quality assurance for deterministic systems applied to probabilistic ones — and it will fail you exactly when it matters most.</p>

<h3>The evaluation gap</h3>
<p>Deterministic software has a simple contract: given input X, produce output Y. You can write tests that verify this contract exhaustively. AI systems have no such contract. The same input can produce different outputs across runs, and "correct" is often a spectrum rather than a binary.</p>
<p>This means evaluation must be:</p>
<ul>
<li><strong>Continuous</strong> — not a gate, but a running process</li>
<li><strong>Multi-dimensional</strong> — quality, safety, cost, latency are all independent axes</li>
<li><strong>Comparative</strong> — meaningful only relative to a baseline</li>
<li><strong>Domain-aware</strong> — what "good" means changes by use case</li>
</ul>

<h3>The three evaluation layers</h3>
<h4>Layer 1: Automated metrics (the floor)</h4>
<p>Automated metrics give you coverage and speed. They catch obvious regressions. But they are blunt instruments: BLEU scores, embedding similarity, and regex-based checks will miss subtle quality degradation that users notice immediately.</p>

<h4>Layer 2: LLM-as-judge (the middle)</h4>
<p>Using a capable model to evaluate outputs of a less capable one gives you scalable qualitative assessment. The key insight is that judging is easier than generating. A model that cannot write a perfect legal brief can still identify when one is missing key clauses.</p>

<h4>Layer 3: Human evaluation (the ceiling)</h4>
<p>For high-stakes domains, human evaluation remains the gold standard. The challenge is making it systematic, calibrated, and fast enough to provide signal before damage compounds.</p>

<h3>Drift detection is the real problem</h3>
<p>The most dangerous failure mode in production AI is not a sudden crash — it is gradual drift. The model slowly gets worse in ways that no single request reveals. Only statistical analysis across thousands of interactions surfaces the pattern. By the time someone notices anecdotally, you have been serving degraded quality for weeks.</p>

<h3>What I build into every AI system</h3>
<p>Every production AI system I architect includes: a golden evaluation dataset that grows over time, automated scoring on every deployment, drift detection with alerting thresholds, and a fast rollback path that does not require a full redeployment. Evaluation is not a phase. It is infrastructure.</p>`
  },
  {
    slug: "ai-token-cost-optimization",
    title: "The real cost of AI tokens — and how organisations can stop bleeding money",
    category: "AI Systems",
    date: "2026-05-16",
    dateDisplay: "May 16, 2026",
    readTime: "10 min read",
    featured: true,
    theme: "Token economics is an architectural discipline. The teams that ignore it pay twice — once in dollars, once in latency.",
    excerpt: "Most teams treat LLM costs as a cloud bill line item. The teams that scale AI treat token economics as an architectural discipline.",
    body: `<p>Every call to a large language model has a price — measured in tokens consumed, dollars spent, and latency incurred. As organisations move from AI experiments to production systems handling millions of requests, token costs quietly become one of the largest and least-understood line items in the engineering budget.</p>

<h3>Why token costs spiral out of control</h3>
<p>The root cause is almost never the model itself. It is the architecture around it. Common culprits:</p>
<ul>
<li><strong>Bloated system prompts.</strong> Teams copy-paste instructions that grow to thousands of tokens. Every single request pays for that overhead.</li>
<li><strong>No caching layer.</strong> Identical or near-identical queries hit the model fresh each time. Semantic caching can eliminate 30-60% of redundant calls.</li>
<li><strong>Wrong model for the job.</strong> Using GPT-4o for tasks a fine-tuned GPT-4o-mini handles at 1/20th the cost.</li>
<li><strong>Uncontrolled agent loops.</strong> Agentic systems that reason in circles, retry without backoff, or invoke tools speculatively.</li>
<li><strong>Retrieval bloat.</strong> RAG pipelines that stuff 20 chunks into context when 3 would suffice — paying for context the model mostly ignores.</li>
</ul>

<h3>A framework for token cost optimisation</h3>
<p>I use a four-layer model when helping teams get their AI costs under control:</p>

<h4>Layer 1: Measure before you optimise</h4>
<p>You cannot optimise what you cannot see. Instrument every LLM call with: model name, input tokens, output tokens, latency, and a semantic label for the task type. Build dashboards that break cost down by feature, by user segment, and by time.</p>

<h4>Layer 2: Route intelligently</h4>
<p>Not every request needs your most capable model. Build a routing layer that classifies incoming requests and dispatches them to the cheapest model that meets the quality bar. A simple intent classifier (which can itself be a small model) can save 40-70% on token costs overnight.</p>
<pre><code>class ModelRouter:
    """Route requests to the cheapest adequate model."""

    TIERS = [
        ("gpt-4o-mini", 0.15, TaskComplexity.SIMPLE),
        ("gpt-4o",      2.50, TaskComplexity.MODERATE),
        ("o3",         15.00, TaskComplexity.COMPLEX),
    ]

    async def route(self, request: LLMRequest) -> str:
        complexity = await self.classify(request)
        for model, cost, tier in self.TIERS:
            if tier >= complexity:
                return model
        return self.TIERS[-1][0]  # fallback to most capable</code></pre>

<h4>Layer 3: Cache aggressively</h4>
<p>Semantic caching stores embeddings of previous queries and returns cached responses for sufficiently similar new queries. The key insight: you do not need exact match caching. An embedding similarity threshold of 0.95+ catches most repeated intent without sacrificing quality.</p>

<h4>Layer 4: Compress and prune context</h4>
<p>For RAG systems, this means smarter chunking, better reranking to surface only the most relevant passages, and summary-based context injection for long documents. For agent systems, it means trajectory summarisation — compressing earlier reasoning steps instead of carrying the full history.</p>

<h3>The organisational dimension</h3>
<p>Token cost optimisation is not purely a technical problem. It requires:</p>
<ul>
<li><strong>Cost attribution.</strong> Teams that own AI features must see their token spend — not buried in a shared infrastructure bill.</li>
<li><strong>Quality-cost tradeoff agreements.</strong> Define acceptable quality thresholds per use case. A search autocomplete does not need the same fidelity as a medical summarisation.</li>
<li><strong>Budget guardrails.</strong> Hard caps per user, per session, and per feature. Circuit breakers that degrade gracefully when budgets are hit.</li>
</ul>

<h3>What I have seen work in practice</h3>
<p>The teams that handle this well share a common trait: they treat token economics as an architectural concern from day one — not as a cost-cutting exercise after the bill arrives. They build cost observability into the platform layer, enforce model routing as infrastructure, and review token budgets in the same forum where they review system design.</p>

<p>AI at scale is not just an intelligence problem. It is an economics problem. The organisations that build this muscle early will outrun the ones optimising after the fact.</p>`
  },
  {
    slug: "invisible-architecture-agentic-workflow",
    title: "The Invisible Architecture of an Agentic Workflow",
    category: "AI Systems",
    date: "2026-05-09",
    dateDisplay: "May 9, 2026",
    readTime: "12 min read",
    featured: false,
    theme: "The model is a capability. The architecture is what determines whether that capability is reliable, auditable, and correctable.",
    excerpt: "We talk at length about what AI agents can do. We talk far less about the design patterns that make them safe to run in production.",
    body: `<p>We talk at length about what AI agents can do. We talk far less about the design patterns that make them safe to run in production — the orchestration layer, the interrupt mechanisms, the audit trails that keep humans meaningfully in the loop. This is the invisible architecture: the 80% of the system that determines whether the other 20% (the model) creates value or creates incidents.</p>

<h3>Why the scaffolding matters more than the model</h3>
<p>When I first started integrating LLMs into production systems, the instinct was to treat the model as the interesting part and everything around it as plumbing. That framing is backwards. The model is a capability; the architecture is what determines whether that capability is reliable, auditable, and correctable.</p>
<p>An agentic workflow that can browse the web, call APIs, write and execute code, and trigger downstream systems is, from an architectural standpoint, a new kind of actor in your system. It needs to be reasoned about the same way you reason about any powerful, partially trusted component: with explicit permissions boundaries, observable state, and clear escalation paths when something goes wrong.</p>
<p>The teams I see succeeding with agentic AI share a common architectural posture: they design the control plane first, and the intelligence second. The control plane — orchestration, state management, interrupt handling, observability — is where production reliability lives.</p>

<h3>The three things I always design first</h3>
<p>Before I think about which model to use or how to structure prompts, I ask three architectural questions:</p>
<ul>
<li><strong>What is the blast radius?</strong> What is the worst possible outcome of a single agent action, and is that outcome reversible? If an agent can write to a production database, the blast radius is your entire data layer. If it can only read and suggest, the blast radius is a bad recommendation that a human reviews. Design the permission boundary first, then figure out what intelligence to put inside it.</li>
<li><strong>How do I know what it did?</strong> Full auditability is non-negotiable. Every tool invocation, every reasoning step, every piece of context retrieved — all of it logged in a structured, queryable format. When (not if) something goes wrong, you need to reconstruct the causal chain. This is not optional observability; it is the forensic infrastructure that lets you trust the system enough to give it more autonomy over time.</li>
<li><strong>How do I stop it?</strong> Circuit breakers, cost caps, and step-level timeouts are not optional safety features — they are load-bearing architecture. An agent in a reasoning loop can spend thousands of dollars in minutes. An agent with unbounded tool access can take actions that are expensive or impossible to reverse. The stop button is the most important button in the system.</li>
</ul>

<h3>Trust is a spectrum, not a binary</h3>
<p>The most useful mental model I have found for agentic trust is a graduated permission system similar to how operating systems handle process privileges. An agent starts with minimal permissions and earns expanded access through demonstrated, logged, reversible actions. This maps to three operational modes:</p>
<ul>
<li><strong>Supervised mode:</strong> The agent proposes actions. A human approves or rejects each one. This is how every new agent workflow should start — not because the model is incapable, but because you need to build the operational muscle of understanding what the agent does before you let it do more.</li>
<li><strong>Semi-autonomous mode:</strong> The agent executes low-risk actions independently but escalates high-risk ones. The definition of "low-risk" is codified in a policy engine — not left to the model's judgement.</li>
<li><strong>Autonomous mode:</strong> The agent acts independently within well-defined guardrails. Even here, every action is logged, budget-capped, and subject to post-hoc review. True autonomy is not the absence of oversight — it is oversight that happens asynchronously rather than synchronously.</li>
</ul>

<h3>The state management problem nobody talks about</h3>
<p>Agentic workflows are stateful. The agent accumulates context, makes decisions based on prior steps, and builds toward a goal over multiple interactions. Managing this state is an architectural challenge that most tutorials skip entirely.</p>
<p>In production, you need to answer: Where does agent state live? How is it persisted across failures? Can you resume a partially-completed workflow? Can you fork a workflow to try alternative paths? Can you roll back to a checkpoint?</p>
<p>The systems that handle this well treat agent state as a first-class data model with versioning, checkpointing, and garbage collection — not as an in-memory variable that disappears when the process crashes.</p>

<h3>The operational maturity ladder</h3>
<p>I assess agentic system maturity on a five-rung ladder:</p>
<ol>
<li><strong>Demo:</strong> The agent works in happy-path scenarios with manual oversight.</li>
<li><strong>Supervised production:</strong> Running on real workloads with human-in-the-loop approval for every action.</li>
<li><strong>Guarded autonomy:</strong> Independent execution within policy-enforced boundaries, with alerting on anomalies.</li>
<li><strong>Observed autonomy:</strong> Full autonomy with comprehensive observability, drift detection, and periodic human review.</li>
<li><strong>Self-improving:</strong> The system uses its operational data to improve its own performance — but only within architecturally-enforced constraints.</li>
</ol>
<p>Most organisations should aim for rung 3 or 4. Rung 5 requires a level of evaluation infrastructure and safety engineering that few teams have built.</p>`
  },
  {
    slug: "design-drift-not-technical-debt",
    title: "Why I stopped calling it technical debt and started calling it design drift",
    category: "Architecture",
    date: "2026-04-28",
    dateDisplay: "Apr 28, 2026",
    readTime: "9 min read",
    featured: false,
    theme: "Debt implies intention. What we actually have is drift — a slow departure from the architecture the system was meant to be.",
    excerpt: "The framing of debt implies intention to repay. Most of what we call tech debt is entropy.",
    body: `<p>The framing of debt implies intention. You borrowed something with a plan to repay it. Most of what we label technical debt was never a deliberate borrowing — it was a series of decisions made under incomplete information that, in aggregate, pushed the system away from an architecture that would have served it better.</p>

<h3>Drift is a more accurate mental model</h3>
<p>Design drift describes what actually happens. A system starts with a coherent conceptual model — a set of invariants, boundaries, and conventions that form its architectural identity. Over time, requirements change. New engineers join who were not present for the original design conversations. Shortcuts accumulate in areas where the original abstractions did not anticipate current needs. The system drifts from its original design intent.</p>
<p>The important distinction: debt implies a conscious trade-off. Drift implies gradual, often unnoticed divergence. The former suggests a ledger you can audit. The latter suggests a navigation problem — you need to periodically check whether you are still on course.</p>

<h3>The three types of drift I see most often</h3>

<h4>1. Conceptual drift</h4>
<p>The mental model of what a component "is" diverges across the team. Service A was designed as a data gateway, but over time it accumulated business logic until it became an implicit orchestrator. No single commit made this choice — it happened one expedient addition at a time. The architecture diagram still shows a gateway, but the code has drifted into something else entirely.</p>

<h4>2. Boundary drift</h4>
<p>Service boundaries were drawn around one set of domain concepts, but the domain evolved. What was once a clean bounded context now has tentacles reaching into three other contexts. The boundaries are still enforced at the API level, but semantically they no longer match how the team thinks about the domain. This is the most expensive drift to correct because it often requires re-partitioning data.</p>

<h4>3. Convention drift</h4>
<p>The team agreed on patterns — how errors are handled, how configuration is managed, how services communicate. Over time, new patterns emerge in newer code while older code retains the original patterns. Now you have two (or three, or four) ways of doing the same thing, and an engineer cannot predict which pattern a given service uses without reading the code.</p>

<h3>Why the debt metaphor is actively harmful</h3>
<p>Calling it debt creates a false sense that it is manageable through allocation of repayment capacity — "sprint tax" or "tech debt sprints." But drift is not repaid in increments. It is corrected through realignment — a fundamentally different activity that requires understanding the desired end state, not just cleaning up what is messy.</p>
<p>Worse, the debt metaphor encourages a blame-free framing that removes agency. "We have debt" implies it accumulated passively. "We have drifted" implies we can navigate back — and that navigating is an active, ongoing responsibility rather than a periodic cleanup activity.</p>

<h3>What I do instead: Architecture alignment sessions</h3>
<p>I run periodic architecture alignment sessions — not to audit blame, but to ask a specific set of questions:</p>
<ul>
<li><strong>What was this system designed to be?</strong> Articulate the original intent, even if it was never written down.</li>
<li><strong>What has it become?</strong> Describe the current reality without judgment.</li>
<li><strong>Is the drift intentional?</strong> Sometimes drift reflects legitimate evolution. If so, update the design intent to match reality.</li>
<li><strong>Where is the drift harmful?</strong> Identify specific places where the divergence causes confusion, bugs, or velocity loss.</li>
<li><strong>What is the correction path?</strong> Not "refactor everything" — but specifically, what moves the system from where it is toward where it should be, given what we know now?</li>
</ul>
<p>The output is not a backlog of tickets. It is an updated architectural narrative — a shared understanding of where we are, where we want to be, and what the next meaningful step is. This is architectural leadership, not backlog management.</p>

<h3>Preventing drift in the first place</h3>
<p>The most effective drift-prevention mechanism I have found is not process, tooling, or code review rigour. It is shared mental models. When every engineer on a team can explain why the system is shaped the way it is — not just what it does — they make daily decisions that preserve architectural coherence. Documentation helps, but it is a poor substitute for genuine understanding. The investment that pays off most is spending time teaching architecture rather than just enforcing it.</p>`
  },
  {
    slug: "rag-knowledge-architecture",
    title: "RAG is not retrieval — it is a knowledge architecture question",
    category: "AI Systems",
    date: "2026-04-12",
    dateDisplay: "Apr 12, 2026",
    readTime: "11 min read",
    featured: false,
    theme: "The quality of retrieval depends entirely on how knowledge was structured when it was ingested. Chunking is downstream.",
    excerpt: "Most RAG discussions get stuck on chunking strategies. The important questions are about how you model knowledge.",
    body: `<p>Most discussions of retrieval-augmented generation get stuck early. They debate chunk sizes, embedding models, similarity thresholds, and reranking strategies. These are real engineering questions, but they are downstream of a more fundamental one: how do you model knowledge in a way that makes the right information retrievable at the right level of granularity?</p>

<h3>The knowledge modelling problem</h3>
<p>RAG works by finding semantically related content and injecting it into the model's context. The quality of what gets retrieved depends entirely on how knowledge was structured when it was ingested. If you chunk a 50-page technical document into 500-token fragments with no awareness of document structure, you will retrieve fragments that are semantically close to the query but contextually meaningless — a paragraph that references "the approach described above" with no access to what was described above.</p>
<p>This is not a retrieval problem. It is a knowledge architecture problem. The question is not "how do I find relevant text?" but "how do I represent knowledge so that relevant context is self-contained and retrievable?"</p>

<h3>What knowledge modelling actually involves</h3>
<p>Before you write any RAG code, you need answers to several fundamental questions:</p>
<ul>
<li><strong>What are the natural units of knowledge in your domain?</strong> In a legal corpus, it might be clauses. In a codebase, it might be functions with their docstrings. In medical literature, it might be findings with their evidence base. Chunk boundaries should respect these natural units.</li>
<li><strong>How do those units relate to each other?</strong> Knowledge rarely exists in isolation. A clinical finding has prerequisites, a code function has callers, a legal clause has exceptions. Your retrieval system needs to surface not just the matching unit, but enough surrounding context for the model to reason correctly.</li>
<li><strong>What metadata enriches retrieval?</strong> Semantic similarity alone is insufficient. A query about "error handling in the payments service" benefits from metadata filtering (service=payments) before semantic search (topic=error handling). This hybrid approach — structured filtering plus semantic search — dramatically improves precision.</li>
<li><strong>What level of granularity serves the model?</strong> Too small, and retrieved chunks lack context. Too large, and you waste context window on irrelevant material. The right answer depends on your model's context window, your latency budget, and the nature of the questions being asked.</li>
</ul>

<h3>The three-layer retrieval architecture</h3>
<p>The RAG systems I design in production use a three-layer retrieval architecture:</p>

<h4>Layer 1: Document-level understanding</h4>
<p>Before any chunking happens, we generate a document-level summary and extract structural metadata — sections, headings, cross-references, entities. This metadata becomes the scaffold that holds chunks together and enables document-aware retrieval.</p>

<h4>Layer 2: Semantic chunking with overlap</h4>
<p>Chunks are split along semantic boundaries — paragraph breaks, section headers, topic shifts detected via embedding similarity. Each chunk carries metadata about its position in the document hierarchy, its parent section, and its relationship to adjacent chunks. We use sliding-window overlap so that no piece of context exists only at a chunk boundary.</p>

<h4>Layer 3: Multi-strategy retrieval</h4>
<p>At query time, we do not rely on a single retrieval strategy. We run parallel searches — dense vector search for semantic similarity, sparse keyword search for exact-match requirements, metadata-filtered search for known constraints — then fuse results using reciprocal rank fusion or a learned reranker. This ensures we catch both semantic matches and lexical matches that embedding models might miss.</p>

<h3>The reranking imperative</h3>
<p>Initial retrieval is recall-optimised: cast a wide net, accept false positives. Reranking is precision-optimised: from the wide net, select the truly relevant results. A cross-encoder reranker that scores query-document pairs jointly is dramatically more accurate than bi-encoder similarity for the final selection. The latency cost is acceptable because you are only reranking 20-50 candidates, not the entire corpus.</p>

<h3>Where most RAG pipelines fail</h3>
<p>The failure patterns I see repeatedly in production RAG:</p>
<ul>
<li><strong>Retrieval that returns text, not answers.</strong> The model receives five paragraphs that contain the answer somewhere, but has to synthesise across disconnected fragments. Better: retrieve at a granularity where each chunk is a self-contained unit of reasoning.</li>
<li><strong>No freshness awareness.</strong> The vector store contains stale information alongside current information, with no mechanism to prefer recent data. Build temporal awareness into your retrieval layer.</li>
<li><strong>Ignoring the "I don't know" case.</strong> When retrieval returns low-confidence results, the system should abstain rather than hallucinate an answer from marginally-relevant context. Confidence thresholds on retrieval scores are essential guardrails.</li>
<li><strong>Single-hop retrieval for multi-hop questions.</strong> Complex questions require chaining — retrieve context, reason partially, retrieve more context based on what was learned. Single-round retrieval is insufficient for questions that require synthesis across multiple documents.</li>
</ul>

<h3>The evaluation gap in RAG</h3>
<p>Most teams evaluate their RAG system end-to-end: "Did the final answer match the expected answer?" This is necessary but insufficient. You need to evaluate each stage independently: Did retrieval surface the right chunks? Did reranking order them correctly? Did the model use the context faithfully? Without stage-level evaluation, you cannot diagnose where quality is lost — and your improvements become trial and error rather than engineering.</p>`
  },
  {
    slug: "knowing-vs-understanding-system",
    title: "On the difference between knowing a system and understanding it",
    category: "Reflection",
    date: "2026-03-24",
    dateDisplay: "Mar 24, 2026",
    readTime: "10 min read",
    featured: false,
    theme: "Knowing a system means navigating it. Understanding means predicting its behaviour under novel conditions.",
    excerpt: "You can spend a year on a codebase and still not understand it. Understanding is about mental models, not familiarity.",
    body: `<p>You can spend a year working on a codebase and still not understand it. This is one of the more uncomfortable truths in software engineering. Familiarity — knowing where things are, which files to open, which services to restart — is not the same as understanding. Understanding means you can predict how the system will behave under conditions you have never observed.</p>

<h3>Familiarity is not a model</h3>
<p>Knowing a system means being able to navigate it. You know which service handles authentication. You know the deployment pipeline. You can find the bug, fix it, and ship a patch. This is valuable operational knowledge, but it is not understanding.</p>
<p>Understanding a system means holding a mental model of its behaviour — one accurate enough to predict outcomes in scenarios you have not yet encountered. When a new load pattern arrives, when a downstream dependency fails in an unexpected way, when two race conditions interact — understanding is what lets you predict what will happen before you look at the logs.</p>
<p>The distinction matters because most day-to-day engineering rewards familiarity. You can be productive on a codebase you do not truly understand. You fix bugs, ship features, and pass code reviews. The gap between familiarity and understanding only becomes apparent during incidents, design decisions, and migrations — the moments when prediction matters more than navigation.</p>

<h3>How understanding is built</h3>
<p>Understanding is built through a specific kind of engagement with a system. It requires asking "why" more often than "what." Why is this service separate from that one? Why does this data flow through a queue rather than a direct call? Why is this timeout set to 30 seconds and not 5?</p>
<p>The answers to these questions reveal the forces that shaped the system — the constraints, trade-offs, and historical context that produced the current architecture. Without this context, you are operating on a system whose shape is arbitrary to you. With it, the shape becomes legible — and you can reason about whether it still serves its purpose.</p>
<p>I have found three activities that build understanding faster than anything else:</p>
<ul>
<li><strong>Drawing the system from memory.</strong> Not copying an architecture diagram — drawing what you believe the system to be, then comparing it against reality. The gaps between your drawing and the actual system are exactly the places where your understanding is weakest.</li>
<li><strong>Predicting before investigating.</strong> When a bug report arrives, before looking at logs or code, write down what you think is happening and why. Then investigate. The delta between your prediction and reality calibrates your mental model.</li>
<li><strong>Explaining to someone who will push back.</strong> Explaining a system to a sharp colleague — one who asks uncomfortable questions — forces you to confront the parts you have glossed over. If you cannot explain why a design choice was made, you do not understand it; you have merely accepted it.</li>
</ul>

<h3>Why this matters for architecture</h3>
<p>Good architectural decisions require understanding, not just knowledge. When you propose splitting a monolith into services, you need to understand the coupling patterns — not just know where the code boundaries are. When you choose between eventual consistency and strong consistency, you need to understand the failure modes of each under your specific workload — not just know the theoretical trade-offs.</p>
<p>This is why architecture decisions made by people who are new to a system are often subtly wrong. They have knowledge — they can read the code, trace the flows, identify the bottlenecks. But they lack the understanding that comes from having seen the system behave under stress, from knowing which assumptions are load-bearing and which are incidental.</p>

<h3>The organisational dimension</h3>
<p>Understanding is not evenly distributed across a team. In most organisations, deep understanding of critical systems is concentrated in one or two people. This is an organisational risk that rarely appears on risk registers. When those people leave — and they will eventually leave — the organisation does not lose knowledge (the code is still there, the documentation still exists). It loses understanding. And understanding cannot be transferred through documentation alone; it requires shared experience, pairing, and sustained engagement.</p>
<p>The most valuable thing a senior engineer can do is not write code — it is transfer understanding. Explain the why, not just the what. Make the forces visible. Turn implicit knowledge into shared mental models. This is invisible work, and it is the work that prevents systems from becoming opaque to the teams that maintain them.</p>

<h3>Understanding as a practice</h3>
<p>Building understanding is slow and cannot be shortcut. You cannot read your way to understanding a complex system any more than you can read your way to understanding a city. You have to live in it — get lost, make wrong turns, discover why the streets are laid out the way they are. The investment is time, and the return is judgment. This is the compound interest of engineering experience: not more knowledge, but deeper understanding that lets you make better decisions faster.</p>`
  },
  {
    slug: "complexity-budgets",
    title: "Complexity budgets: treating cognitive load as a first-class constraint",
    category: "Architecture",
    date: "2026-03-03",
    dateDisplay: "Mar 3, 2026",
    readTime: "10 min read",
    featured: false,
    theme: "Every abstraction has a cognitive cost. The question is not whether it is elegant — but whether the team can carry it.",
    excerpt: "Every architectural decision spends from a finite budget of complexity a team can hold in mind.",
    body: `<p>Every architectural decision has a cognitive cost. It introduces concepts that engineers must hold in mind, patterns they must follow, abstractions they must understand. A team's cognitive capacity is finite — not as a metaphor, but as a genuine constraint on how much complexity a system can sustainably carry.</p>

<h3>The budget metaphor</h3>
<p>I find it useful to think of a team's cognitive capacity as a finite budget. Every piece of the system spends from that budget. A microservices architecture with fifteen services spends heavily from the "distributed systems reasoning" budget. A complex type system spends from the "abstraction comprehension" budget. A multi-stage deployment pipeline spends from the "operational awareness" budget.</p>
<p>Like a financial budget, the problem is never a single expense — it is the accumulation. Each individual decision seems reasonable in isolation. A message queue here, a new abstraction there, a configuration layer on top. But at some point, the total exceeds what the team can carry, and the symptoms emerge: bugs in areas the team thought they understood, design inconsistencies across modules, and a pervasive sense of fragility where nobody is confident about the system's behaviour.</p>

<h3>Where complexity budgets are most often overspent</h3>
<p>In my experience, the three areas where complexity budgets are most frequently blown:</p>

<h4>1. Distributed transaction management</h4>
<p>Teams adopt microservices for organisational scaling, then discover they need transactional guarantees across service boundaries. The result is sagas, compensating transactions, eventual consistency patterns, and dead-letter queues — each one individually justified, but together forming a distributed coordination layer that exceeds what most teams can reason about reliably. The cognitive cost is not in understanding each pattern; it is in understanding their interactions under partial failure.</p>

<h4>2. Configuration surfaces</h4>
<p>Flexibility is expensive. Every configuration option is a dimension of variation that someone must understand, test, and maintain. I have seen systems where the configuration surface is so large that no single person understands all the valid combinations. The system works — until someone sets a novel combination of flags that no one ever tested together. Configuration that was meant to provide flexibility instead provides a combinatorial explosion of untested states.</p>

<h4>3. Error handling and recovery</h4>
<p>Robust error handling is essential — but the cognitive cost of reasoning about error paths often exceeds the cost of reasoning about happy paths. When every function can fail in multiple ways, and each failure mode has its own recovery strategy, and those strategies can themselves fail — the error handling surface becomes a secondary system that is harder to understand than the primary one. This is where I see the most "surprise" bugs: not in the business logic, but in the interactions between error recovery paths.</p>

<h3>How to assess your current spend</h3>
<p>The most reliable signal of overspent complexity budget is not code metrics or architecture diagrams. It is the onboarding experience. How long does it take a competent senior engineer — not someone who needs hand-holding, but someone with strong fundamentals — to make their first confident architectural contribution? If the answer is more than three months, your complexity budget is overspent.</p>
<p>Other signals:</p>
<ul>
<li><strong>The team avoids touching certain areas.</strong> Not because they are well-designed and stable, but because nobody is confident they understand them.</li>
<li><strong>Changes in one area cause unexpected failures elsewhere.</strong> This indicates coupling that exceeds what the team can hold in their mental model.</li>
<li><strong>Design discussions become circular.</strong> When the system is too complex for anyone to confidently predict consequences, design decisions devolve into competing intuitions without resolution.</li>
<li><strong>Documentation is always stale.</strong> When the system changes faster than anyone can document it — and nobody trusts the docs — the cognitive cost has exceeded what external aids can offset.</li>
</ul>

<h3>Spending wisely</h3>
<p>The goal is not minimal complexity — it is appropriate complexity. Some problems are genuinely hard, and the architecture must reflect that. The goal is to spend your complexity budget intentionally, in the places where it buys you something valuable, and to be ruthless about simplicity everywhere else.</p>
<p>Practically, this means:</p>
<ul>
<li><strong>Centralise unavoidable complexity.</strong> If your domain requires complex coordination, put that complexity in one place — a dedicated orchestration layer — rather than spreading it across twenty services. One complex thing is easier to understand than twenty slightly-complex things.</li>
<li><strong>Choose boring technology for load-bearing infrastructure.</strong> Every novel technology choice is a withdrawal from the complexity budget. Reserve novelty for the areas where it provides genuine leverage, and use proven, well-understood tools everywhere else.</li>
<li><strong>Prune unused flexibility.</strong> Configuration options nobody changes, abstractions with only one implementation, extension points nobody extends — these are complexity costs with no corresponding benefit. Remove them.</li>
<li><strong>Make the implicit explicit.</strong> Hidden dependencies, implicit conventions, and undocumented invariants are the most expensive complexity because they are invisible until they break. Make them visible — through types, tests, or explicit documentation.</li>
</ul>

<h3>The architectural responsibility</h3>
<p>As a senior architect, I consider complexity budget management one of my primary responsibilities. It is not glamorous work. It means saying no to elegant solutions that exceed the team's capacity. It means arguing for simpler approaches when the more sophisticated approach is technically superior. It means treating "our team can reliably operate this" as a hard constraint, not a soft preference. The most elegant architecture that your team cannot understand is worse than the boring architecture that they can.</p>`
  },
  {
    slug: "staff-level-engineering",
    title: "What staff-level engineering actually looks like in practice",
    category: "Leadership",
    date: "2026-01-18",
    dateDisplay: "Jan 18, 2026",
    readTime: "12 min read",
    featured: false,
    theme: "At staff level, the unit of work changes. You are measured not by what you build, but by what your organisation builds.",
    excerpt: "The transition from senior to staff engineer is not about writing better code.",
    body: `<p>The staff engineer title is one of the most inconsistently defined in the industry. At some companies it means "senior engineer who stayed technical." At others it means "architect without direct reports." At the best companies, it means something specific: an engineer whose scope of impact extends beyond their immediate team to the broader engineering organisation.</p>

<h3>The unit of work changes</h3>
<p>As an engineer, you are measured by what you build. As a senior engineer, by what your team builds. As a staff engineer, by what your organisation builds. This shift is disorienting because the feedback loops are longer, the attribution is murkier, and the work itself is often invisible.</p>
<p>At the individual contributor level, you write code and see it deploy. At staff level, you might spend three months building alignment around an architectural direction and the only visible artifact is a design document that others execute against. The impact is real — the organisation made a better decision because of your work — but it does not feel like "building" in the way you have spent your career understanding that word.</p>

<h3>The leverage question</h3>
<p>The question I ask most often at this level is: where is my leverage? Not "what is interesting to work on" or "what is technically challenging" — but where does my specific expertise, context, and judgement create the most value for the organisation?</p>
<p>Leverage at staff level typically takes four forms:</p>
<ul>
<li><strong>Technical direction.</strong> Setting architectural standards that improve quality and velocity across multiple teams. Not by mandate, but by providing a clear technical vision that teams can align with autonomously.</li>
<li><strong>Force multiplication.</strong> Building tools, patterns, or abstractions that make other engineers more effective. A well-designed internal library that ten teams use has more impact than any individual feature.</li>
<li><strong>Risk reduction.</strong> Identifying and addressing systemic risks before they become incidents. This includes architectural risks (single points of failure), technical risks (scaling limits), and organisational risks (key-person dependencies).</li>
<li><strong>Decision quality.</strong> Being present in the decisions that matter most, and helping teams navigate trade-offs with better information and clearer thinking. Sometimes this means writing the design doc. Sometimes it means asking the right question in a review. Sometimes it means connecting two teams who are solving the same problem independently.</li>
</ul>

<h3>The craft of influence without authority</h3>
<p>Staff engineers rarely have formal authority over the teams they influence. You cannot mandate architectural decisions — you must make the case convincingly enough that teams adopt your recommendations because they trust your judgement. This requires a specific set of capabilities:</p>
<ul>
<li><strong>Technical credibility.</strong> People follow technical direction from engineers they believe are excellent. This means staying technically sharp even as your scope broadens. You do not need to write as much code as you once did, but you need to remain capable of going deep when it matters.</li>
<li><strong>Empathetic communication.</strong> Understanding why a team is resistant to an architectural recommendation — usually they have context you lack, or constraints you have not considered — and adapting your approach accordingly.</li>
<li><strong>Written persuasion.</strong> At this level, writing is your primary tool. Design documents, RFCs, architecture decision records — these are the vehicles through which you scale your influence beyond what meetings can achieve.</li>
<li><strong>Strategic patience.</strong> Some changes take quarters, not sprints. Building alignment for a large architectural shift requires sustained, patient engagement — presenting the vision, addressing concerns, demonstrating value incrementally, and waiting for the organisation to be ready.</li>
</ul>

<h3>What staff engineers actually do all day</h3>
<p>If I inventory a typical week at staff level, it looks something like:</p>
<ul>
<li>Two to three hours reviewing design documents from other teams, providing feedback on architectural choices, failure modes, and operational concerns.</li>
<li>One to two hours writing — design documents, architecture decision records, technical strategy papers that set direction for the quarter or year.</li>
<li>Three to four hours in discussions — alignment meetings, design sessions, incident retrospectives, mentoring conversations.</li>
<li>Five to ten hours of focused technical work — prototyping, investigating, coding on high-leverage problems, or doing the technical research that informs architectural decisions.</li>
<li>One to two hours of organisational work — identifying gaps, connecting people, unblocking cross-team initiatives.</li>
</ul>
<p>The ratio shifts depending on what the organisation needs. During a major migration, technical work dominates. During a planning cycle, writing and alignment dominates. The constant is that you are always asking: "Where is my attention most needed right now?"</p>

<h3>The identity transition</h3>
<p>The hardest part of the staff transition is not learning new skills — it is releasing the identity of "person who builds things directly." For a decade or more, your self-worth was tied to the code you wrote, the systems you designed, the problems you solved with your own hands. At staff level, your highest-leverage work is often enabling others to do those things better. The code you do not write — because you equipped someone else to write it — is more impactful than the code you write yourself.</p>
<p>This is not a comfortable transition for most engineers. It requires redefining what "good work" means to you personally. The engineers who navigate this transition successfully develop a new source of satisfaction: seeing the organisation's technical quality improve as a result of their influence, even when their fingerprints are not directly on the code.</p>`
  },
  {
    slug: "llm-pipelines-production",
    title: "Building LLM pipelines that do not collapse under production load",
    category: "AI Systems",
    date: "2025-12-14",
    dateDisplay: "Dec 14, 2025",
    readTime: "13 min read",
    featured: false,
    theme: "Prompt engineering gets you to a demo. Architecture gets you to production. The gap between them is wider than most teams imagine.",
    excerpt: "Prompt engineering gets you to a demo. Architecture gets you to production.",
    body: `<p>Prompt engineering gets you to a demo. Architecture gets you to production. The gap between them is wider than most teams imagine — not because production is harder technically, but because production introduces constraints that demos are designed to avoid: latency budgets, cost envelopes, reliability requirements, and the need for deterministic behaviour from a fundamentally probabilistic system.</p>

<h3>The non-determinism problem</h3>
<p>The fundamental challenge of LLM systems in production is that they are probabilistic. The same input can produce different outputs on different invocations. For a generation task — writing marketing copy, summarising a document — this variability is acceptable. For a pipeline that makes routing decisions, extracts structured data, or triggers downstream actions, non-determinism is a reliability risk.</p>
<p>The architectural response to non-determinism is not to eliminate it (you cannot) but to contain it. Every point where an LLM makes a decision that affects system behaviour needs:</p>
<ul>
<li><strong>Output validation.</strong> The LLM's output is parsed and validated against a schema before it is acted upon. If the output does not conform — wrong structure, missing fields, invalid values — it is rejected and retried or escalated. Never trust raw model output as structured data.</li>
<li><strong>Deterministic fallbacks.</strong> When the LLM fails to produce valid output after retries, the system falls back to a deterministic path. This might mean routing to a human, using a rule-based default, or failing gracefully with an explicit "I could not process this" signal.</li>
<li><strong>Idempotency.</strong> If a pipeline step is retried (because of validation failure, timeout, or infrastructure flap), the retry must be safe. This is standard distributed systems hygiene, but it is especially important when your processing logic includes a non-deterministic component.</li>
</ul>

<h3>The latency architecture</h3>
<p>LLM calls are slow. A single GPT-4 call might take 3-15 seconds. A pipeline with three sequential LLM calls has a baseline latency of 10-45 seconds before you add any other processing. For real-time user-facing applications, this is often unacceptable.</p>
<p>Architectural patterns for managing LLM latency:</p>
<ul>
<li><strong>Parallel decomposition.</strong> If your pipeline has multiple independent extraction or analysis steps, run them concurrently. Three 10-second calls in parallel is 10 seconds, not 30.</li>
<li><strong>Streaming responses.</strong> For generation tasks, stream the response to the user as it is produced rather than waiting for completion. This dramatically improves perceived latency.</li>
<li><strong>Tiered model selection.</strong> Not every step needs GPT-4. Use smaller, faster models for simpler tasks (classification, extraction) and reserve the expensive model for tasks that genuinely require its capabilities (complex reasoning, nuanced generation). A well-designed pipeline might use three different models at different cost/latency/quality trade-off points.</li>
<li><strong>Semantic caching.</strong> If you see the same or semantically similar queries repeatedly, cache the results. This requires embedding-based similarity matching rather than exact-match caching, but the latency and cost savings are substantial for workloads with query repetition.</li>
<li><strong>Precomputation.</strong> For known document types or recurring analysis tasks, precompute the LLM-intensive work offline and serve results from a fast data store at query time.</li>
</ul>

<h3>The cost architecture</h3>
<p>LLM costs scale with token volume. A pipeline processing 10,000 documents per day at $0.03 per 1K input tokens adds up quickly. Cost architecture is not an afterthought — it is a design constraint that shapes the pipeline from the beginning.</p>
<p>Cost-aware design principles:</p>
<ul>
<li><strong>Minimize context window usage.</strong> Send only what the model needs. Strip boilerplate, compress repetitive content, and use focused prompts. A prompt that includes 2,000 irrelevant tokens 10,000 times a day is $600/day in wasted input cost alone.</li>
<li><strong>Progressive refinement.</strong> Use a cheap classifier to determine whether an item needs expensive processing. Process 80% of traffic with a fast/cheap model and route only the complex 20% to the expensive model.</li>
<li><strong>Budget caps and alerting.</strong> Set hard cost caps per pipeline, per day, and per customer. Alert on anomalies — a sudden spike in token usage often indicates a bug (infinite loop, prompt injection expanding context) rather than legitimate traffic.</li>
</ul>

<h3>Evaluation is infrastructure</h3>
<p>The teams that run LLM systems reliably in production treat evaluation as infrastructure — not a phase that happens before launch. This means:</p>
<ul>
<li><strong>Continuous evaluation.</strong> A sample of production traffic is continuously evaluated against quality benchmarks. When quality degrades — because of model updates, data drift, or changing input patterns — the team is alerted.</li>
<li><strong>Multi-dimensional metrics.</strong> Not just "is the answer correct?" but: Is it well-formatted? Is it safe? Is it within latency budget? Did it stay within the prompt's constraints? Each dimension is tracked independently because they degrade independently.</li>
<li><strong>Golden datasets.</strong> A curated set of input-output pairs that represent known-good behaviour. These are run after every model change, prompt update, or pipeline modification. They are your regression tests for a non-deterministic system.</li>
<li><strong>Human-in-the-loop evaluation.</strong> Automated metrics miss things. A regular cadence of human review — domain experts looking at real outputs — catches quality issues that metrics cannot detect.</li>
</ul>

<h3>The observability layer</h3>
<p>LLM pipelines need specialised observability. Standard application monitoring (latency, error rates, throughput) is necessary but insufficient. You also need:</p>
<ul>
<li><strong>Token usage per step.</strong> Know exactly where your token budget is being spent so you can optimise the expensive parts.</li>
<li><strong>Prompt-response logging.</strong> Every LLM invocation should be logged with the full prompt and response, in a queryable format. When something goes wrong, you need the forensic trail.</li>
<li><strong>Quality score tracking.</strong> If you have automated evaluators, track their scores over time as time-series data. Quality degradation is often gradual — you need trend detection, not just threshold alerting.</li>
<li><strong>Cost attribution.</strong> Know which pipeline, which customer, which document type is driving cost. Without attribution, you cannot make informed optimization decisions.</li>
</ul>`
  },
  {
    slug: "event-driven-architecture-cultural",
    title: "Event-driven architecture is a cultural choice, not a technical one",
    category: "Architecture",
    date: "2025-11-07",
    dateDisplay: "Nov 7, 2025",
    readTime: "10 min read",
    featured: false,
    theme: "The hardest part of going event-driven is not the infrastructure. It is getting teams to stop thinking in synchronous terms.",
    excerpt: "The hardest part of going event-driven is not the infrastructure — it is getting teams to stop thinking in synchronous terms.",
    body: `<p>I have seen event-driven architecture migrations succeed technically and fail organisationally more often than the reverse. The Kafka cluster is healthy, the schema registry is running, the consumers are processing messages — and yet the organisation is struggling. Teams are confused about ownership, debugging is painful, and the system feels harder to reason about than the monolith it replaced.</p>

<h3>The mental model shift</h3>
<p>In a synchronous system, a service call is a transaction. Service A calls Service B, waits for a response, and proceeds based on the result. The mental model is linear: do this, then do that. Cause and effect are collocated in time and space.</p>
<p>In an event-driven system, a service publishes a fact about something that happened. Other services react to that fact asynchronously, at their own pace, in their own time. The mental model is fundamentally different: something happened, and consequences will unfold eventually. Cause and effect are separated — sometimes by milliseconds, sometimes by minutes.</p>
<p>This shift in mental model is the actual migration. The infrastructure — Kafka, RabbitMQ, EventBridge — is the easy part. Getting seventy engineers to stop thinking "I call the payments service" and start thinking "I emit a PaymentRequested event and trust that the ecosystem will react" is the hard part.</p>

<h3>Why this is a cultural choice</h3>
<p>Event-driven architecture is not just a technical pattern — it is an organisational statement about how teams relate to each other. It says:</p>
<ul>
<li><strong>Teams own facts, not workflows.</strong> The order service owns the fact that an order was placed. It does not own the decision of what happens next — that is distributed across the consumers who care about that event.</li>
<li><strong>Coupling is managed through contracts, not calls.</strong> Teams agree on event schemas, not API interfaces. The coupling surface is the shape of the data, not the timing of the interaction.</li>
<li><strong>Autonomy over coordination.</strong> Teams can deploy, scale, and evolve independently because they are decoupled at the communication layer. But this autonomy requires discipline — schema evolution, backward compatibility, and clear ownership of event definitions.</li>
</ul>
<p>If your organisation's culture values tight coordination, synchronous decision-making, and centralised control, event-driven architecture will fight you at every turn. It is an architectural pattern that assumes — and requires — team autonomy.</p>

<h3>The debugging problem</h3>
<p>The most common complaint I hear from teams adopting event-driven architecture is that debugging becomes harder. In a synchronous system, you can trace a request through the call chain. In an event-driven system, a single event might trigger five downstream reactions, each of which triggers further events. The causal chain fans out rather than flowing linearly.</p>
<p>This is a real cost, and teams that do not invest in the tooling to manage it will suffer. The investment required:</p>
<ul>
<li><strong>Correlation IDs.</strong> Every event carries a correlation ID that traces back to the original trigger. When you are debugging, you can pull the full causal tree for any business operation.</li>
<li><strong>Event stores with temporal queries.</strong> The ability to ask "what happened to order X?" and get a time-ordered sequence of all events related to that entity, across all services.</li>
<li><strong>Dead letter queue visibility.</strong> When messages fail processing, they end up in DLQs. You need dashboards that surface these failures, show the failed message content, and provide tooling to replay or discard them.</li>
<li><strong>Local development experience.</strong> Engineers need to be able to run a meaningful subset of the event-driven system locally. If the only way to test is against a shared staging environment, development velocity collapses.</li>
</ul>

<h3>The eventual consistency contract</h3>
<p>Event-driven systems are eventually consistent by nature. When Service A publishes an event and Service B consumes it, there is a window — however small — where A and B disagree about the state of the world. This is not a bug; it is the fundamental trade-off that enables decoupling.</p>
<p>But it needs to be made explicit to the entire organisation. Product managers need to understand that "Order placed" and "Inventory reserved" are not atomic. Customer support needs to know that a brief inconsistency window exists. The UI needs to communicate uncertainty rather than showing stale state as truth.</p>

<h3>When not to go event-driven</h3>
<p>Event-driven architecture is not universally appropriate. It adds complexity that is only justified when you need:</p>
<ul>
<li>Independent deployability across many teams</li>
<li>Temporal decoupling (producer and consumer operating at different speeds)</li>
<li>Fan-out (one event triggering multiple independent reactions)</li>
<li>Replay capability (reprocessing historical events for new consumers)</li>
</ul>
<p>If you have a small team, a single deployment unit, and synchronous requirements — a well-structured monolith with clear module boundaries will serve you better, at dramatically lower operational cost. The maturity curve for event-driven architecture is steep, and the operational complexity is permanent. Choose it deliberately, not because it is trendy.</p>`
  },
  {
    slug: "fourteen-years-software",
    title: "Close to two decades in software: what I wish I had understood earlier",
    category: "Reflection",
    date: "2025-09-22",
    dateDisplay: "Sep 22, 2025",
    readTime: "14 min read",
    featured: false,
    theme: "Most of what I know about software I learned by getting things wrong. Compounding mistakes become compounding judgment.",
    excerpt: "A reflection on compounding mistakes, compounding judgment, and what it actually means to be good at this work.",
    body: `<p>Most of what I know about software I learned by getting things wrong. Not catastrophically — though there have been a few of those — but in the slow, accumulative way that builds judgment. Every system I built that turned out to be over-engineered, every migration I planned too optimistically, every time I optimised for the wrong constraint — these failures compound into something that looks, from the outside, like experience. From the inside, it feels more like a slowly-updating model of how things actually work.</p>

<h3>The compounding effect of small decisions</h3>
<p>Early in my career I thought the consequential decisions were the architectural ones: which database to use, how to partition services, which framework to adopt. I now think the more consequential decisions are the small ones made daily by every engineer on the team. How a function is named. Whether an edge case is handled or deferred. How an error message is worded. Whether a test is written or skipped.</p>
<p>These decisions compound. A hundred small good decisions produce a system that is pleasant to work in — where the next change is easy because the last hundred changes were made with care. A hundred small careless decisions produce a system where every change is a negotiation with accumulated friction. The difference between these two outcomes is not visible in any single commit. It is only visible over months.</p>

<h3>Communication is not a soft skill</h3>
<p>The clearest line I can draw between engineers who have a large impact and those who have a modest one is communication. Not charisma — communication. The ability to explain a technical decision in terms that non-technical stakeholders can act on. The ability to write a design document that anticipates questions and addresses them. The ability to disagree with a colleague's approach without making them defensive.</p>
<p>I used to think this was a nice-to-have. I now think it is the meta-skill that determines how much of your technical ability actually reaches the organisation. An engineer with brilliant technical judgment who cannot communicate it effectively has the same organisational impact as an engineer with mediocre judgment who communicates it clearly. The output — the decisions that actually get made — is a function of both judgment and communication.</p>

<h3>The systems you do not build matter more</h3>
<p>The most valuable thing a senior engineer does is prevent unnecessary systems from being built. Every system that exists must be maintained, monitored, debugged, and eventually migrated or decommissioned. The cheapest system — in total cost of ownership — is the one that was never built because someone identified that the problem could be solved with existing infrastructure, or that the problem did not actually need to be solved.</p>
<p>This is counterintuitive in an industry that celebrates building. But after two decades, I am certain: the highest-leverage technical decision is often "we don't need this." It requires confidence and political capital to make this argument, because saying no is less visible than saying yes. But it is often the right answer.</p>

<h3>Judgment is calibrated pessimism</h3>
<p>Engineering judgment is not optimism or pessimism — it is calibrated pessimism. It means knowing which things will probably go wrong, how badly, and whether the cost of prevention is justified. Early in your career, everything seems risky (because you have not seen enough to calibrate). Later, you develop an instinct for which risks are real and which are theoretical.</p>
<p>The dangerous middle ground is when you have enough experience to feel confident but not enough to be well-calibrated. You have seen some things work, and you over-generalise. "We used Kafka at my last company and it worked great" becomes an argument for Kafka in contexts where it is inappropriate. Genuine calibration requires a wider sample — seeing the same pattern succeed in one context and fail in another, and understanding why.</p>

<h3>Speed and quality are not trade-offs</h3>
<p>One of the most persistent myths in software engineering is that you can either move fast or maintain quality. After almost two decades, I am convinced this is false. The teams I have seen that move fastest are the teams with the highest quality standards — because they spend less time debugging, less time on rework, and less time coordinating around fragile systems.</p>
<p>The trade-off is not speed vs. quality. It is short-term speed vs. sustained speed. You can move fast this week by cutting corners. But next month, those corners will slow you down more than the time you saved. The compounding math always wins.</p>

<h3>People rotate; systems persist</h3>
<p>Over a long enough timeline, every person on the team will leave. The system remains. This means the system must be designed not for the people who built it — who understand its quirks, remember its history, and can navigate its undocumented assumptions — but for the people who will inherit it. People who have no context, no relationship with the original authors, and no patience for systems that are confusing without good reason.</p>
<p>Designing for future maintainers is an act of professional empathy. It means writing code that explains itself. It means documenting the "why" even when the "what" is clear. It means choosing boring, predictable patterns over clever, efficient ones. It means accepting a higher up-front cost for a lower lifetime cost.</p>

<h3>What it actually means to be good at this</h3>
<p>After close to twenty years, I think being good at software engineering means three things:</p>
<ul>
<li><strong>Accurate prediction.</strong> You can predict, before building, which approaches will work and which will create problems later. This is judgment, and it comes only from accumulated experience — both success and failure.</li>
<li><strong>Appropriate response.</strong> You match the weight of your response to the weight of the problem. You do not over-engineer simple things or under-engineer complex ones. You know when to be careful and when to be fast.</li>
<li><strong>Sustainable pace.</strong> You build systems and teams that can maintain quality and velocity indefinitely — not just for a sprint or a quarter, but for years. This means investing in people, in tooling, in maintainability, and in the boring infrastructure that keeps the interesting work possible.</li>
</ul>
<p>None of this is glamorous. None of it makes for a good conference talk. But it is what distinguishes engineers who build things that last from engineers who build things that need to be replaced.</p>`
  },
  {
    slug: "five-questions-system-design",
    title: "The five questions I ask before signing off on any system design",
    category: "Architecture",
    date: "2025-07-30",
    dateDisplay: "Jul 30, 2025",
    readTime: "11 min read",
    featured: false,
    theme: "Design reviews are only useful if you know what you are looking for. These five questions surface the risks that matter.",
    excerpt: "Design reviews are only useful if you know what you are looking for.",
    body: `<p>Design reviews are only useful if you know what you are looking for. Without a consistent framework for evaluation, reviews devolve into subjective opinions about naming conventions and code style. The five questions I ask on every design review are not about aesthetics or preference — they are about surfacing the risks that will matter six months from now, when the system is in production and the original authors have moved on.</p>

<h3>1. What is the failure model?</h3>
<p>Every system fails. The question is not whether it will fail, but how it will fail, and whether the failure mode is acceptable. When I ask "what is the failure model?" I am looking for specific answers:</p>
<ul>
<li>What happens when the database is unreachable for 30 seconds? For 5 minutes? For an hour?</li>
<li>What happens when a downstream dependency returns errors? Does the failure cascade, or is it contained?</li>
<li>What happens when the system receives malformed input? Does it reject cleanly, or does it corrupt state?</li>
<li>What is the blast radius of a single bad deployment? Can one service's failure take down the entire platform?</li>
</ul>
<p>If the design does not have clear answers to these questions, it will develop answers in production — under pressure, without preparation, and usually in the worst possible way. I would rather see a system with a limited feature set and a well-understood failure model than a feature-rich system that has never thought about what happens when things go wrong.</p>

<h3>2. What happens at 10x load?</h3>
<p>This is not a capacity planning question — it is an architectural question. When load increases by an order of magnitude, which components become bottlenecks? Which assumptions break? Which costs become unsustainable?</p>
<p>I am not asking whether the system can handle 10x load today. I am asking whether the architecture permits scaling to 10x without a rewrite. The signals I look for:</p>
<ul>
<li><strong>Stateless vs. stateful.</strong> Stateless components scale horizontally by adding instances. Stateful components require coordination, and coordination is where scaling breaks down.</li>
<li><strong>O(1) vs. O(n) operations in the hot path.</strong> A single O(n) operation that seems fine at current load becomes a wall at 10x.</li>
<li><strong>Cost linearity.</strong> Does cost scale linearly with load, or super-linearly? Systems where cost grows faster than load eventually become economically unviable.</li>
<li><strong>Data growth.</strong> Where does data accumulate? What is the retention policy? A system that works at 100GB but has no plan for 1TB will hit that wall sooner than anyone expects.</li>
</ul>

<h3>3. How do you know it is working?</h3>
<p>This is the observability question. If this system deployed today and I asked you "is it healthy?" — what would you look at? If the answer is "the logs" or "the error rate in our monitoring tool" — the observability model is insufficient.</p>
<p>A well-instrumented system can answer specific questions:</p>
<ul>
<li>What is the end-to-end latency distribution for the critical user journey?</li>
<li>What percentage of requests are succeeding on the first attempt vs. after retries?</li>
<li>What is the current queue depth, and is it growing or shrinking?</li>
<li>Are there anomalies in the data patterns that suggest correctness issues (not just availability issues)?</li>
</ul>
<p>I especially push on correctness monitoring. Availability is easy to measure — the system is either responding or it is not. Correctness is harder: the system is responding, but is it responding correctly? For systems that process data, transform it, or make decisions, correctness monitoring is the only thing that catches "silently wrong" failures.</p>

<h3>4. What does rollback look like?</h3>
<p>Every deployment should be reversible. But "reversible" is more nuanced than "deploy the previous version." When I ask about rollback, I am probing for:</p>
<ul>
<li><strong>Schema migrations.</strong> If the new version includes a database schema change, can you roll back the code without rolling back the schema? If not, what is the data migration story?</li>
<li><strong>State contamination.</strong> If the new version processed data during the window it was deployed, is that data compatible with the old version? Or does rolling back the code leave corrupted state?</li>
<li><strong>Feature flags.</strong> Can the new behaviour be disabled without a deployment? This is the safest rollback mechanism — it separates deployment from activation.</li>
<li><strong>Time to rollback.</strong> How long does it take to detect a problem and complete a rollback? If detection takes 30 minutes and rollback takes another 30, you have a 60-minute exposure window for every deployment.</li>
</ul>
<p>The designs I worry about most are those where rollback is technically possible but practically terrifying — where nobody is confident enough to actually pull the trigger because the consequences are unclear.</p>

<h3>5. Who needs to change their behaviour?</h3>
<p>This is the most underrated question in system design. Technical designs do not exist in a vacuum — they require humans to interact with them. When I ask who needs to change their behaviour, I am asking:</p>
<ul>
<li>Which teams need to update their integration code? What is the migration path for them?</li>
<li>Which operational runbooks need to be updated? Who writes those updates?</li>
<li>Which monitoring dashboards need new panels? Who creates them?</li>
<li>Which on-call rotation inherits alerting for this new system? Are they prepared?</li>
<li>Which product managers need to understand new limitations or capabilities?</li>
</ul>
<p>A design that requires twelve teams to change their behaviour in a coordinated way is a different proposition than a design that can be adopted incrementally by each team independently. The technical elegance of the solution matters far less than the human coordination cost of implementing it.</p>

<h3>Using these questions in practice</h3>
<p>These five questions are not a checklist to be completed once and filed away. They are a lens through which to view the design continuously. The answers evolve as the system evolves, and revisiting them periodically — especially before major changes — keeps the team honest about what they know and what they are assuming.</p>
<p>The goal is not to create perfect designs. The goal is to create designs where the risks are visible, the trade-offs are explicit, and the team has a shared understanding of what they are signing up for. A design with known risks is manageable. A design with hidden risks is a liability.</p>`
  },
  {
    slug: "ai-integrations-fail",
    title: "Why most AI integrations fail — and it is not the model",
    category: "AI Systems",
    date: "2025-05-05",
    dateDisplay: "May 5, 2025",
    readTime: "11 min read",
    featured: false,
    theme: "When an AI integration underperforms, the instinct is to blame the model. In most cases the problem is upstream.",
    excerpt: "When an AI integration underperforms, the instinct is to blame the model. In most cases the problem is upstream.",
    body: `<p>When an AI integration underperforms in production, the instinct is to blame the model. "GPT-4 is not good enough for our use case." "We need a more powerful model." "The model hallucinates too much." In eighteen months of building production AI systems, I have found that the model is rarely the root cause. The problems are almost always upstream — in the data contracts, the evaluation infrastructure, or the integration patterns.</p>

<h3>The three architectural failure patterns</h3>

<h4>1. Weak data contracts</h4>
<p>The model is only as good as the data it receives. This is obvious in theory and ignored in practice. I see it constantly: teams spend weeks on prompt engineering while feeding the model unstructured, inconsistent, or incomplete data.</p>
<p>Symptoms of weak data contracts:</p>
<ul>
<li>The prompt includes instructions like "if the field is empty, ignore it" — compensating for data quality issues at the prompt level rather than fixing them at the source.</li>
<li>Different upstream systems send the same concept in different formats. The model must handle date formats as "2025-01-15", "Jan 15, 2025", "15/01/2025", and "yesterday" — not because the task requires it, but because nobody standardised the input.</li>
<li>Critical context is missing because the data pipeline drops fields silently. The model produces poor results not because it lacks capability, but because it lacks information that exists in the source system but never reaches the prompt.</li>
</ul>
<p>The fix is not better prompting. It is treating the data flowing into your AI system with the same rigour you would treat data flowing into a financial reporting system: schemas, validation, versioning, and monitoring for drift.</p>

<h4>2. No evaluation framework</h4>
<p>If you cannot measure quality, you cannot improve quality. And yet the majority of AI integrations I review have no systematic evaluation framework. They have vibes. "It seems to work pretty well." "The product manager tried ten examples and they were good."</p>
<p>Without systematic evaluation:</p>
<ul>
<li>You cannot distinguish a good prompt from a slightly-better prompt. A/B testing requires statistical rigour, not anecdotes.</li>
<li>You cannot detect regression. When you update the prompt, change the model version, or modify the data pipeline — how do you know you have not made things worse? Without a benchmark dataset and automated evaluation, you are flying blind.</li>
<li>You cannot diagnose failure modes. "The model sometimes gets it wrong" is not actionable. "The model fails on inputs where the entity name contains special characters" is actionable. Systematic evaluation reveals patterns; anecdotes reveal instances.</li>
</ul>
<p>The evaluation framework does not need to be sophisticated to be useful. Start with a golden dataset of 100 input-output pairs that represent your known-good behaviour. Run it after every change. Track the score over time. This alone puts you ahead of 90% of AI integrations.</p>

<h4>3. Integration patterns designed for determinism</h4>
<p>The most subtle failure pattern: teams integrate an LLM using the same patterns they would use for a deterministic API. They expect consistent output formatting, stable response times, and predictable behaviour across all inputs. When the LLM behaves probabilistically — as it is designed to do — the surrounding system breaks.</p>
<p>Manifestations:</p>
<ul>
<li><strong>Brittle parsing.</strong> The downstream system expects the LLM output to be in exact JSON format. When the model includes a preamble ("Here is the JSON:") or slightly varies the structure, the parser fails. The fix is not better prompting — it is robust parsing that handles variation.</li>
<li><strong>No retry logic.</strong> The system treats an LLM call like a database query — it either succeeds or fails. But LLM calls can produce invalid output that is not a technical error. You need application-level retries for "the call succeeded but the output was not usable."</li>
<li><strong>Synchronous blocking.</strong> The system blocks the user while waiting for an LLM response. When the model takes 12 seconds instead of the expected 3, the user sees a timeout. The architecture needs to accommodate variable latency — through streaming, async processing, or optimistic UI patterns.</li>
<li><strong>Single-attempt extraction.</strong> The system asks the model to extract ten fields from a document in a single call. When three of them are wrong, all ten are discarded. Better: extract independently (or in verified batches) so partial success is possible.</li>
</ul>

<h3>The upstream diagnosis framework</h3>
<p>When an AI integration underperforms, I work through this diagnostic sequence:</p>
<ol>
<li><strong>Data audit.</strong> Examine 50 real production inputs. Are they well-structured? Complete? Consistent? Do they contain the information the model needs to produce a good answer?</li>
<li><strong>Prompt-in-context review.</strong> Look at the actual prompt as constructed at runtime — with the real data filled in, not the template. Is the context coherent? Is there contradictory information? Is the instruction clear given the actual data?</li>
<li><strong>Output analysis.</strong> Categorise failures. What percentage are data quality issues (bad input → bad output)? What percentage are capability limitations (good input → bad output)? What percentage are parsing/integration issues (good output → lost in translation)?</li>
<li><strong>Model capability check.</strong> Only after confirming that inputs are clean and integration is robust, test whether the model is actually capable of the task. Give it perfect inputs manually and evaluate the output quality.</li>
</ol>
<p>In my experience, step 4 — the model's intrinsic capability — is the root cause less than 20% of the time. The other 80% is upstream: bad data, missing context, brittle integration, or unclear instructions.</p>

<h3>The organisational pattern</h3>
<p>There is an organisational dimension to this failure pattern. AI integrations often live at the boundary between a data engineering team (who owns the input pipeline), an ML/AI team (who owns the model and prompts), and a product engineering team (who owns the integration code). When these three teams do not have shared visibility into the end-to-end pipeline, each team optimises their piece in isolation — and the failures happen at the seams.</p>
<p>The fix is end-to-end ownership. Someone — ideally a senior engineer who understands data, models, and systems integration — must own the pipeline from data ingestion to final output. They do not need to build every piece, but they need visibility and authority across the full chain.</p>`
  },
  {
    slug: "architecture-reviews-useful",
    title: "How I run architecture reviews that engineers actually find useful",
    category: "Leadership",
    date: "2025-02-18",
    dateDisplay: "Feb 18, 2025",
    readTime: "10 min read",
    featured: false,
    theme: "Most architecture reviews are either rubber-stamps or interrogations. Neither produces better systems.",
    excerpt: "Most architecture reviews are either rubber-stamps or interrogations. Neither produces better systems.",
    body: `<p>Most architecture reviews are either rubber-stamps or interrogations. The rubber-stamp review is a formality — the design is already decided, the review is a checkbox, and the reviewers provide polite comments that change nothing. The interrogation review is a power dynamic — a senior architect cross-examines the presenter, finds flaws, and sends them back to iterate. Neither produces better systems. One produces resentment; the other produces theatre.</p>

<h3>The format I have settled on</h3>
<p>After years of experimenting, I have converged on a three-phase format that consistently produces useful outcomes. The key insight: the review is not about the reviewer demonstrating expertise. It is about the team making a better decision.</p>

<h4>Understanding phase (40% of the time)</h4>
<p>Before any critique, I ask questions until I can explain the proposed design back to the presenter in my own words. This is not performative — it genuinely surfaces misunderstandings on both sides. Often, the act of explaining the design to an outsider reveals assumptions the team has not made explicit.</p>
<p>Questions I ask in this phase:</p>
<ul>
<li>"Walk me through the critical user journey end-to-end. Which components are involved, and what is the data flow?"</li>
<li>"What are the top three constraints that shaped this design? What would you do differently without those constraints?"</li>
<li>"What alternatives did you consider, and why did you reject them?"</li>
<li>"Who are the users of this system — both human users and system consumers — and what are their performance expectations?"</li>
</ul>
<p>This phase serves a dual purpose: it builds my understanding, and it gives the presenter an opportunity to articulate their thinking. Often, the process of explaining reveals gaps that the presenter catches themselves — before I say anything.</p>

<h4>Trade-offs phase (30% of the time)</h4>
<p>Every design is a set of trade-offs. In this phase, I ask the presenter to articulate what was given up. Not as a gotcha — but because trade-offs that are explicit and intentional are fine. Trade-offs that are accidental or invisible are risks.</p>
<p>The questions:</p>
<ul>
<li>"What does this design optimise for? What does it sacrifice?"</li>
<li>"Where is the complexity in this system concentrated? Is that intentional?"</li>
<li>"What would make this design the wrong choice? Under what conditions would you recommend a different approach?"</li>
<li>"What is the cost of being wrong? If this turns out to be the wrong architecture, how expensive is it to change course?"</li>
</ul>
<p>The most valuable outcome of this phase is surfacing trade-offs that the team made unconsciously. "We chose eventual consistency" is a trade-off. "We did not think about the consistency model" is a risk. The difference matters enormously.</p>

<h4>Risk phase (30% of the time)</h4>
<p>In the final phase, I ask what could go wrong. Not hypothetical edge cases or unlikely failure scenarios — but realistic risks given the team's context, timeline, and capabilities.</p>
<ul>
<li>"What is the most likely way this project fails? Not technically — organisationally. What could derail it?"</li>
<li>"Which parts of this design are you least confident about? Where are you making bets rather than informed decisions?"</li>
<li>"If you had to ship this in half the time, what would you cut? What is essential vs. desirable?"</li>
<li>"Six months from now, what will you wish you had done differently?"</li>
</ul>
<p>This phase often surfaces the real concerns that the team has been carrying privately. Giving them explicit permission to voice uncertainty — in a non-judgemental forum — often produces the most actionable insights of the entire review.</p>

<h3>What I never do</h3>
<ul>
<li><strong>I never redesign their system in the review.</strong> The review is not the venue for me to propose an alternative architecture. If I have fundamental concerns, the outcome is "let's schedule a working session to explore alternatives" — not a live redesign that the team has no investment in.</li>
<li><strong>I never block on style or preference.</strong> If the design is sound but I would have done it differently — that is not a blocking concern. Different engineers make different choices, and the goal is good outcomes, not uniformity.</li>
<li><strong>I never ask questions I already know the answer to.</strong> Socratic questioning as a power play is disrespectful. If I see a gap, I name it directly: "I notice the design does not address failover. Is that intentional, or is it a gap we should discuss?"</li>
</ul>

<h3>The output</h3>
<p>A useful architecture review produces one of three outcomes:</p>
<ol>
<li><strong>Approval with confidence.</strong> The design is sound, the trade-offs are intentional, and the risks are manageable. Proceed.</li>
<li><strong>Approval with identified risks.</strong> The design is fundamentally sound, but there are specific risks that need mitigation plans. Proceed, but address these risks explicitly.</li>
<li><strong>Request for iteration.</strong> There is a specific gap — usually a failure mode that has not been thought through, or a trade-off that is accidental rather than intentional — that needs more thinking before the team commits.</li>
</ol>
<p>Notice: "rejected" is not an outcome. Architecture reviews that produce rejections are interrogations. If the design is fundamentally flawed, the failure happened upstream — in the problem framing, the requirement gathering, or the preliminary discussions that should have happened before a formal review. The review's job is refinement, not gatekeeping.</p>

<h3>Why this matters</h3>
<p>The goal of architecture reviews is not to produce perfect designs. It is to produce teams that think architecturally — that consider failure modes, trade-offs, and operational concerns as part of their design process. A good review teaches the team to ask these questions of themselves next time. Over months, the quality of designs that come into review steadily improves, because the team has internalised the lens. That is the real measure of a useful review practice.</p>`
  },
];

export const THINKING = [
  {
    title: "When an agent can act, what does trust architecture look like?",
    tag: "AI Architecture",
    tagClass: "ai",
    featured: true,
    sidebarText: "Agentic systems and the architecture of trust",
    body: "Agentic AI introduces a new class of architectural problem: an entity that reasons, plans, and executes autonomously within your infrastructure. The question is not whether to trust it — it is how to design trust boundaries that degrade gracefully, maintain auditability, and do not cascade into failure downstream when the model surprises you."
  },
  {
    title: "Can AI systems evaluate themselves — and should we let them?",
    tag: "AI Safety",
    tagClass: "ai",
    featured: true,
    sidebarText: "Self-evaluation and the limits of introspection",
    body: "As models become capable of judging their own outputs, the temptation is to close the loop: let the system evaluate itself. But self-evaluation creates epistemic blind spots. When the evaluator shares the same biases as the generator, failure modes become invisible. The harder question is what external reference points give us genuine signal about quality, safety, and drift."
  },
  {
    title: "The edge is not a smaller cloud — it is a different problem class",
    tag: "Cloud & Edge",
    tagClass: "cl",
    featured: false,
    sidebarText: "The edge-cloud continuum",
    body: "As compute moves toward the physical world, the assumptions behind clean cloud architecture start breaking. Connectivity is intermittent. Resources are constrained. Updates carry irreversible risk."
  },
  {
    title: "Observability is not monitoring — it is epistemology",
    tag: "Systems Design",
    tagClass: "sys",
    featured: false,
    sidebarText: "Observability as a design discipline",
    body: "Most teams instrument systems to detect known failures. The interesting question is how you build a system that surfaces unknown unknowns. Observability, properly designed, is how you stay epistemically honest about your production environment."
  }
];

export const SHOWCASE = [
  {
    slug: "agent-harness-framework",
    title: "Production Agent Harness with Circuit Breakers and Fallback Chains",
    tag: "AI Infrastructure",
    tagClass: "ai",
    featured: true,
    date: "2026-06-05",
    problem: "Agent frameworks provide orchestration primitives but not production resilience. Teams deploy agents that retry infinitely, burn token budgets, lose state on failure, and provide no visibility into quality degradation — turning a demo into an operational liability.",
    approach: "A harness framework that wraps any LLM-based agent with deterministic execution policies, fallback model chains, circuit breakers, checkpoint/restore, runtime evaluation gates, and structured observability — all enforced in code, never in prompts.",
    architecture: `<div style="font-family: monospace; font-size: 0.72rem; line-height: 1.7; color: rgba(255,255,255,0.7); white-space: pre; overflow-x: auto;">
┌─────────────────────────────────────────────────────────┐
│                    AGENT HARNESS                         │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │              EXECUTION POLICY                     │  │
│  │  max_retries: 3  │  timeout: 30s  │  budget: $1  │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                              │
│  ┌──────────┐    ┌──────▼──────┐    ┌──────────────┐   │
│  │ STATE    │    │ TOOL        │    │ EVALUATION   │   │
│  │ MACHINE  │    │ GOVERNANCE  │    │ LAYER        │   │
│  │          │    │             │    │              │   │
│  │ IDLE     │    │ Schema val  │    │ Gate checks  │   │
│  │ PLANNING │    │ Permissions │    │ Quality score│   │
│  │ EXECUTING│    │ Rate limits │    │ Drift detect │   │
│  │ EVALUATNG│    │ Sanitise    │    │              │   │
│  │ RECOVERY │    │             │    │              │   │
│  └──────────┘    └─────────────┘    └──────────────┘   │
│                          │                              │
│  ┌───────────────────────▼───────────────────────────┐  │
│  │              RECOVERY ENGINE                       │  │
│  │                                                   │  │
│  │  Retry (same model) ──▶ Fallback (cheaper model)  │  │
│  │  ──▶ Circuit Break ──▶ Human Escalation           │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                              │
│  ┌───────────────────────▼───────────────────────────┐  │
│  │              TELEMETRY COLLECTOR                   │  │
│  │  Traces │ Cost │ Quality │ Latency │ Anomalies    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
</div>`,
    code: `import time
import json
from enum import Enum
from dataclasses import dataclass, field
from typing import Any, Callable

# --- Execution Policy ---

@dataclass
class ExecutionPolicy:
    max_retries: int = 3
    timeout_seconds: float = 30.0
    max_tokens_per_turn: int = 50_000
    max_cost_per_task: float = 1.0
    max_turns: int = 15
    backoff_base: float = 1.0  # exponential backoff

# --- Agent States ---

class AgentState(Enum):
    IDLE = "idle"
    PLANNING = "planning"
    EXECUTING = "executing"
    EVALUATING = "evaluating"
    RECOVERY = "recovery"
    COMPLETE = "complete"

# --- Circuit Breaker ---

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 3, cooldown: float = 60.0):
        self.failure_threshold = failure_threshold
        self.cooldown = cooldown
        self.failures: dict[str, list[float]] = {}
        self.open_until: dict[str, float] = {}

    def record_failure(self, service: str):
        now = time.time()
        self.failures.setdefault(service, []).append(now)
        # Only count recent failures
        recent = [t for t in self.failures[service] if now - t < self.cooldown]
        self.failures[service] = recent
        if len(recent) >= self.failure_threshold:
            self.open_until[service] = now + self.cooldown

    def is_open(self, service: str) -> bool:
        if service not in self.open_until:
            return False
        if time.time() > self.open_until[service]:
            del self.open_until[service]
            self.failures.pop(service, None)
            return False
        return True

    def record_success(self, service: str):
        self.failures.pop(service, None)
        self.open_until.pop(service, None)

# --- Fallback Chain ---

@dataclass
class ModelConfig:
    name: str
    call_fn: Callable
    cost_per_1k_tokens: float
    timeout: float = 30.0

class FallbackChain:
    def __init__(self, models: list[ModelConfig]):
        self.models = models  # ordered primary -> cheapest fallback
        self.circuit_breaker = CircuitBreaker()

    async def call(self, messages: list[dict], **kwargs) -> dict:
        last_error = None
        for model in self.models:
            if self.circuit_breaker.is_open(model.name):
                continue
            try:
                result = await model.call_fn(messages, **kwargs)
                self.circuit_breaker.record_success(model.name)
                return {"model_used": model.name, "result": result}
            except Exception as e:
                self.circuit_breaker.record_failure(model.name)
                last_error = e
        raise RuntimeError(f"All models exhausted. Last: {last_error}")

# --- Evaluation Gate ---

@dataclass
class EvalResult:
    passed: bool
    score: float
    reason: str

class EvaluationGate:
    def __init__(self, checks: list[Callable]):
        self.checks = checks

    def evaluate(self, output: str, context: dict) -> EvalResult:
        for check in self.checks:
            result = check(output, context)
            if not result.passed:
                return result
        return EvalResult(passed=True, score=1.0, reason="all_checks_passed")

# --- Trace Collector ---

@dataclass
class Span:
    name: str
    start_time: float = field(default_factory=time.time)
    end_time: float | None = None
    tokens_used: int = 0
    cost: float = 0.0
    metadata: dict = field(default_factory=dict)

class TraceCollector:
    def __init__(self, task_id: str):
        self.task_id = task_id
        self.spans: list[Span] = []
        self._active: Span | None = None

    def start_span(self, name: str, **meta) -> Span:
        span = Span(name=name, metadata=meta)
        self._active = span
        self.spans.append(span)
        return span

    def end_span(self, tokens: int = 0, cost: float = 0.0):
        if self._active:
            self._active.end_time = time.time()
            self._active.tokens_used = tokens
            self._active.cost = cost
            self._active = None

    def summary(self) -> dict:
        total_tokens = sum(s.tokens_used for s in self.spans)
        total_cost = sum(s.cost for s in self.spans)
        total_duration = (
            (self.spans[-1].end_time or time.time()) - self.spans[0].start_time
            if self.spans else 0
        )
        return {
            "task_id": self.task_id,
            "spans": len(self.spans),
            "total_tokens": total_tokens,
            "total_cost": f"\${total_cost:.4f}",
            "total_duration_ms": int(total_duration * 1000),
        }

# --- The Harness ---

class AgentHarness:
    def __init__(
        self,
        policy: ExecutionPolicy,
        fallback_chain: FallbackChain,
        eval_gate: EvaluationGate,
        tools: dict[str, Callable] | None = None,
    ):
        self.policy = policy
        self.fallback_chain = fallback_chain
        self.eval_gate = eval_gate
        self.tools = tools or {}
        self.state = AgentState.IDLE
        self.turn_count = 0
        self.total_cost = 0.0
        self.trace: TraceCollector | None = None

    async def run(self, task: str, context: dict = None) -> dict:
        self.trace = TraceCollector(task_id=task[:32])
        self.state = AgentState.PLANNING
        self.turn_count = 0
        context = context or {}
        messages = [{"role": "user", "content": task}]

        while self.turn_count < self.policy.max_turns:
            self.turn_count += 1

            # --- Execute with harness controls ---
            self.state = AgentState.EXECUTING
            span = self.trace.start_span(
                f"turn_{self.turn_count}", state=self.state.value
            )

            try:
                response = await self.fallback_chain.call(messages)
            except RuntimeError as e:
                self.state = AgentState.RECOVERY
                self.trace.end_span()
                return self._escalate(str(e), messages)

            tokens = response["result"].get("tokens_used", 0)
            cost = tokens * 0.00003  # approximate
            self.total_cost += cost
            self.trace.end_span(tokens=tokens, cost=cost)

            # --- Cost ceiling check ---
            if self.total_cost > self.policy.max_cost_per_task:
                return self._budget_exceeded(messages)

            # --- Evaluate output ---
            self.state = AgentState.EVALUATING
            output = response["result"].get("content", "")
            eval_result = self.eval_gate.evaluate(output, context)

            if not eval_result.passed:
                messages.append({
                    "role": "system",
                    "content": f"Output rejected: {eval_result.reason}. Retry."
                })
                continue

            # --- Check if task is complete ---
            if response["result"].get("done", False):
                self.state = AgentState.COMPLETE
                return {
                    "status": "complete",
                    "output": output,
                    "trace": self.trace.summary(),
                    "model_used": response["model_used"],
                }

            messages.append({"role": "assistant", "content": output})

        # Turn limit reached
        return self._turn_limit_reached(messages)

    def _escalate(self, error: str, messages: list) -> dict:
        return {
            "status": "escalated",
            "error": error,
            "context": messages[-3:],
            "trace": self.trace.summary() if self.trace else {},
        }

    def _budget_exceeded(self, messages: list) -> dict:
        return {
            "status": "budget_exceeded",
            "cost": f"\${self.total_cost:.4f}",
            "trace": self.trace.summary() if self.trace else {},
        }

    def _turn_limit_reached(self, messages: list) -> dict:
        return {
            "status": "turn_limit",
            "turns": self.turn_count,
            "trace": self.trace.summary() if self.trace else {},
        }`,
    lang: "python",
    runInstructions: `# Install dependencies
pip install asyncio

# Usage example:
import asyncio
from harness import (
    AgentHarness, ExecutionPolicy, FallbackChain,
    ModelConfig, EvaluationGate, EvalResult
)

# Define your model call functions
async def call_gpt4o(messages, **kw):
    # Your OpenAI API call here
    return {"content": "...", "tokens_used": 1200, "done": True}

async def call_claude_sonnet(messages, **kw):
    # Your Anthropic API call here
    return {"content": "...", "tokens_used": 900, "done": True}

# Build the harness
policy = ExecutionPolicy(max_retries=3, timeout_seconds=30, max_cost_per_task=2.0)
chain = FallbackChain([
    ModelConfig("gpt-4o", call_gpt4o, cost_per_1k_tokens=0.03),
    ModelConfig("claude-sonnet", call_claude_sonnet, cost_per_1k_tokens=0.015),
])

def format_check(output, ctx):
    if len(output) < 10:
        return EvalResult(False, 0.0, "output_too_short")
    return EvalResult(True, 1.0, "ok")

gate = EvaluationGate(checks=[format_check])
harness = AgentHarness(policy=policy, fallback_chain=chain, eval_gate=gate)

# Run
result = asyncio.run(harness.run("Summarise the Q2 sales report"))
print(result)
# {'status': 'complete', 'output': '...', 'trace': {...}, 'model_used': 'gpt-4o'}`,
    outcomes: [
      "Circuit breaker prevents cascading failures — 3 consecutive failures opens circuit for 60s cooldown",
      "Fallback chain maintains availability — automatic model downgrade when primary is unavailable or over-budget",
      "Cost ceiling enforcement stops runaway agents — hard stop at configurable dollar limit per task",
      "Structured traces provide full cost/latency/quality attribution per span",
      "Evaluation gates reject low-quality outputs before they reach users — forcing regeneration with context"
    ],
    lessons: [
      "Enforce everything in code, never in prompts — the LLM will violate any instruction-based constraint under adversarial or edge-case inputs",
      "Fallback chains should degrade gracefully, not fail completely — a cheaper model with a simpler prompt is always better than an error",
      "Circuit breakers need per-service granularity — one downed tool should not disable unrelated capabilities",
      "Trace everything from day one — retrofitting observability is 10x harder than building it in",
      "Turn limits are the single most important safety mechanism — unbounded loops are the primary cause of production cost blowouts"
    ]
  },
  {
    slug: "prompt-injection-firewall",
    title: "Prompt Injection Firewall for Multi-Agent Systems",
    tag: "AI Security",
    tagClass: "ai",
    featured: true,
    date: "2026-05-20",
    problem: "Multi-agent LLM systems pass messages between agents — but without validation, a single compromised or adversarial input can inject instructions that propagate across trust boundaries, hijacking the entire pipeline. Existing single-agent guardrails don't account for domain-camouflaged attacks disguised as legitimate inter-agent communication.",
    approach: "Defense-in-depth: intercept every inter-agent message and apply three layered detection strategies concurrently — pattern matching for known signatures, semantic drift analysis for camouflaged payloads, and privilege escalation detection for boundary violations. Untrusted agents get zero-tolerance enforcement.",
    architecture: `<div style="margin: 0 auto; max-width: 680px;">
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
</div>`,
    code: `"""
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
        return worst`,
    lang: "python",
    runInstructions: `# Install dependencies
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
verdict = await firewall.inspect(message)`,
    outcomes: [
      "Blocked 94% of known injection patterns in benchmark testing",
      "Semantic drift detector catches domain-camouflaged attacks that regex misses",
      "Zero false positives on 10K legitimate inter-agent messages in staging",
      "Full audit trail enables forensic analysis of attack vectors post-incident"
    ],
    lessons: [
      "Single-layer detection is insufficient — pattern matching misses semantic attacks, semantic analysis has false positives. Layering creates defense-in-depth.",
      "Trust tiers are essential. Not all agents are equal — external/untrusted agents need stricter enforcement without slowing internal communication.",
      "Audit everything. Even CLEAN verdicts get logged. When a novel attack eventually bypasses detection, the audit trail is how you find and patch the gap."
    ]
  },
  {
    slug: "a2a-protocol-gateway",
    title: "A2A Protocol Gateway",
    tag: "Agentic AI",
    tagClass: "ai",
    featured: true,
    date: "2026-05-18",
    problem: "Every agent framework (LangGraph, Autogen, CrewAI) has its own communication format. Multi-agent systems today are islands — agents can't discover, negotiate with, or delegate to peers built on different frameworks. Integration is bespoke and brittle.",
    approach: "Implement Google's Agent-to-Agent (A2A) protocol as a gateway layer. Agents register capability cards, discover peers via skill matching, delegate tasks through a standardized lifecycle, and stream results — regardless of underlying framework.",
    architecture: `<div style="margin: 0 auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.06), rgba(201,168,124,0.02)); border: 1px solid rgba(212,184,150,0.2); border-radius: 12px; padding: 1.5rem; font-family: monospace; font-size: 0.72rem; line-height: 1.6; color: rgba(255,255,255,0.7);">
<div style="text-align: center; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(212,184,150,0.6); margin-bottom: 1rem;">A2A GATEWAY ARCHITECTURE</div>
<pre style="margin: 0; white-space: pre; overflow-x: auto;">
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  LangGraph   │  │   Autogen    │  │   CrewAI     │
│   Agent      │  │   Agent      │  │   Agent      │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       │    AgentCard    │    AgentCard    │   AgentCard
       │   (Discovery)   │   (Discovery)   │  (Discovery)
       ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────┐
│                  A2A GATEWAY                         │
│                                                     │
│  ┌─────────┐  ┌───────────┐  ┌─────────────────┐  │
│  │Registry │  │Task Router│  │Stream Multiplexer│  │
│  │& Discover│  │& Lifecycle│  │   (SSE/WS)      │  │
│  └─────────┘  └───────────┘  └─────────────────┘  │
│                                                     │
│  Patterns: Sequential Chain │ Fan-Out │ Fan-In     │
└─────────────────────────────────────────────────────┘
       │                 │                 │
       ▼                 ▼                 ▼
  /tasks/send     /tasks/subscribe    /tasks/cancel
</pre>
</div>
</div>`,
    code: `"""
A2A Protocol Gateway — Agent Interoperability Layer
"""
from dataclasses import dataclass, field
from enum import Enum
from typing import AsyncIterator
import uuid, asyncio

class TaskState(Enum):
    SUBMITTED = "submitted"
    WORKING = "working"
    COMPLETED = "completed"
    FAILED = "failed"

@dataclass
class AgentCard:
    """Public capability declaration — the A2A discovery contract."""
    name: str
    description: str
    url: str
    skills: list[dict]
    streaming: bool = True

    def to_json(self) -> dict:
        return {
            "name": self.name,
            "url": self.url,
            "capabilities": {"streaming": self.streaming},
            "skills": self.skills,
        }

@dataclass
class A2ATask:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    state: TaskState = TaskState.SUBMITTED
    messages: list[dict] = field(default_factory=list)
    artifacts: list[dict] = field(default_factory=list)

class A2AGateway:
    """Central gateway for cross-framework agent collaboration."""

    def __init__(self):
        self._registry: dict[str, AgentCard] = {}
        self._tasks: dict[str, A2ATask] = {}

    def register_agent(self, card: AgentCard):
        self._registry[card.name] = card

    def discover(self, skill_query: str) -> list[AgentCard]:
        """Find agents whose skills match the query."""
        return [c for c in self._registry.values()
                if self._matches(c.skills, skill_query)]

    async def send_task(self, target: str, prompt: str) -> A2ATask:
        task = A2ATask()
        task.messages.append({"role": "user", "parts": [{"text": prompt}]})
        task.state = TaskState.WORKING
        self._tasks[task.id] = task
        await self._dispatch(self._registry[target], task)
        return task

    async def delegate_chain(self, agents: list[str], prompt: str) -> A2ATask:
        """Sequential: output of agent N → input of agent N+1"""
        current = prompt
        for name in agents:
            task = await self.send_task(name, current)
            await self._wait(task)
            current = task.artifacts[-1]["data"] if task.artifacts else current
        return task

    async def delegate_parallel(self, assignments: dict[str, str]):
        """Fan-out: different subtasks to multiple agents concurrently."""
        tasks = await asyncio.gather(*[
            self.send_task(agent, prompt)
            for agent, prompt in assignments.items()
        ])
        return {self._registry[t.id]: t for t in tasks}`,
    lang: "python",
    runInstructions: `# Install
pip install httpx pydantic uvicorn

# Start the gateway server
uvicorn a2a_gateway:app --port 8080

# Register an agent
curl -X POST localhost:8080/agents/register \\
  -H "Content-Type: application/json" \\
  -d '{"name": "research-agent", "url": "http://localhost:8081", "skills": [...]}'

# Send a task with streaming
curl -N localhost:8080/tasks/sendSubscribe \\
  -d '{"target": "research-agent", "prompt": "Analyse competitor pricing"}'`,
    outcomes: [
      "3 heterogeneous agent frameworks collaborating through a single gateway",
      "Task delegation latency under 50ms (gateway overhead only)",
      "Sequential chains and parallel fan-out patterns both production-stable",
      "Agent discovery enables dynamic capability routing without hardcoded wiring"
    ],
    lessons: [
      "AgentCards should be versioned — skill schemas evolve, and consuming agents need to handle backward compatibility gracefully.",
      "Streaming (SSE) is non-negotiable for long-running agent tasks. Polling creates unnecessary load and poor UX.",
      "The gateway must be stateless except for task tracking. Agent state lives with the agents themselves."
    ]
  },
  {
    slug: "eval-pipeline-drift",
    title: "AI Evaluation Pipeline with Drift Detection",
    tag: "AI Safety",
    tagClass: "ai",
    featured: true,
    date: "2026-05-15",
    problem: "Production AI models degrade silently. Without continuous evaluation, you discover quality drops from user complaints — not metrics. Model updates, data drift, and prompt changes all introduce regression risk that manual spot-checking can't catch at scale.",
    approach: "Build a continuous evaluation pipeline that runs every model update against a golden dataset, computes quality and safety scores, compares against a rolling baseline, and triggers automated rollback when safety thresholds are breached.",
    architecture: `<div style="margin: 0 auto; max-width: 680px;">
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
</div>`,
    code: `"""
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
            msg=f"Safety breach: {model}@{version} — rolled back")`,
    lang: "python",
    runInstructions: `# Install evaluation framework
pip install openai numpy pandas

# Prepare golden dataset (YAML format)
# golden/cases.yaml contains prompt + expected + rubric

# Run evaluation
python eval_pipeline.py --model gpt-4o --version 2026-05-15 \\
  --golden ./golden/cases.yaml \\
  --threshold-drift 0.9 \\
  --threshold-safety 0.95

# CI integration (runs on every model config change)
# .github/workflows/eval.yml triggers on: push paths: ['prompts/**', 'model-config/**']`,
    outcomes: [
      "Caught 3 silent quality regressions before they reached production",
      "Automated rollback triggered once — safety score dropped to 0.91 after a prompt template change",
      "30-day rolling baseline adapts to genuine improvements vs regressions",
      "Eval runs in <4 minutes for 200-case golden set (parallel async execution)"
    ],
    lessons: [
      "Golden datasets need curation — stale test cases that no longer reflect real usage create false confidence.",
      "Safety scoring must be separate from quality scoring. A model can produce high-quality unsafe outputs.",
      "Rollback automation needs a human-in-the-loop escape hatch. Sometimes the 'regression' is intentional behavior change."
    ]
  },
  {
    slug: "qmd-query-documents",
    title: "QMD: Query Markup Documents",
    tag: "AI Infrastructure",
    tagClass: "ai",
    featured: true,
    date: "2026-05-10",
    problem: "LLM prompts are scattered across codebases as raw strings — untested, unversioned, and impossible to audit. When a prompt causes a production incident, there's no git blame, no diff history, and no way to systematically manage hundreds of prompts across an organization.",
    approach: "Treat prompts as first-class engineering artefacts. QMD (Query Markup Documents) is a structured YAML format where each prompt is a versionable, composable, testable document with metadata, templating, guardrails, and output schemas.",
    architecture: `<div style="margin: 0 auto; max-width: 680px;">
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
</div>`,
    code: `"""
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
        }`,
    lang: "python",
    runInstructions: `# Create a QMD file
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
    priority="high")`,
    outcomes: [
      "All prompts versioned in git — full blame/diff history for incident response",
      "Fingerprint-based caching reduced redundant LLM calls by 35%",
      "CI validation catches broken templates before deployment",
      "Organization-wide prompt registry enables reuse and governance"
    ],
    lessons: [
      "Prompts are code. They deserve the same engineering rigor — version control, testing, review, and deployment pipelines.",
      "Variable validation at render time catches integration bugs early rather than getting cryptic LLM responses.",
      "Guardrails declared in the document itself (not just runtime) makes compliance auditable by default."
    ]
  },
  {
    slug: "rag-semantic-chunking",
    title: "RAG Pipeline with Semantic Chunking",
    tag: "AI Infrastructure",
    tagClass: "ai",
    featured: false,
    date: "2026-05-05",
    problem: "Naive fixed-size chunking breaks documents at arbitrary points — splitting sentences, separating context from its explanation, and creating chunks that make no semantic sense. The retrieval quality ceiling is determined by chunking quality, and most pipelines get this wrong.",
    approach: "Semantic chunking: split documents at natural boundary points where embedding similarity between adjacent sentences drops below a threshold. Combine with two-stage retrieval — broad vector search followed by cross-encoder re-ranking for precision.",
    architecture: `<div style="margin: 0 auto; max-width: 680px;">
<div style="background: linear-gradient(135deg, rgba(212,184,150,0.06), rgba(201,168,124,0.02)); border: 1px solid rgba(212,184,150,0.2); border-radius: 12px; padding: 1.5rem; font-family: monospace; font-size: 0.72rem; line-height: 1.6; color: rgba(255,255,255,0.7);">
<div style="text-align: center; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(212,184,150,0.6); margin-bottom: 1rem;">TWO-STAGE RETRIEVAL PIPELINE</div>
<pre style="margin: 0; white-space: pre; overflow-x: auto;">
  Document Corpus
       │
       ▼
┌────────────────────┐
│ Semantic Chunker   │  Split at meaning boundaries
│ (similarity < 0.82)│  not arbitrary token counts
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Embedding + Index  │  text-embedding-3-large
│ (metadata-enriched)│  + source, heading, tokens
└────────┬───────────┘
         │
         ▼                    User Query
┌────────────────────┐            │
│   Vector Store     │◀───────────┘
│  (top_k × 4       │   Stage 1: Broad recall
│   candidates)      │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ Cross-Encoder      │   Stage 2: Precision re-rank
│ Re-ranker          │   (top_k final results)
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ LLM Generation     │   "Answer using only context"
│ (grounded output)  │
└────────────────────┘
</pre>
</div>
</div>`,
    code: `"""
RAG Pipeline — Semantic Chunking + Two-Stage Retrieval
"""
class SemanticChunker:
    """Split documents at natural semantic boundaries."""

    def __init__(self, embedding_model: str, threshold: float = 0.82,
                 max_chunk_tokens: int = 512):
        self.model = embedding_model
        self.threshold = threshold
        self.max_tokens = max_chunk_tokens

    def split(self, text: str) -> list:
        sentences = self._sentence_split(text)
        embeddings = [embed(s) for s in sentences]

        chunks, current = [], [sentences[0]]
        for i in range(1, len(sentences)):
            sim = cosine_similarity(embeddings[i-1], embeddings[i])
            if sim < self.threshold or self._token_count(current) > self.max_tokens:
                chunks.append(Chunk(text=" ".join(current)))
                current = []
            current.append(sentences[i])
        if current:
            chunks.append(Chunk(text=" ".join(current)))
        return chunks

class RAGPipeline:
    """Two-stage retrieval with semantic chunking."""

    def __init__(self, vectorstore, reranker):
        self.vectorstore = vectorstore
        self.reranker = reranker
        self.splitter = SemanticChunker("text-embedding-3-large")

    async def ingest(self, doc) -> int:
        chunks = self.splitter.split(doc.text)
        vectors = [VectorRecord(
            embedding=await embed(c.text),
            metadata={"source": doc.uri, "section": c.heading},
            text=c.text,
        ) for c in chunks]
        return await self.vectorstore.upsert(vectors)

    async def query(self, prompt: str, top_k: int = 5) -> str:
        # Stage 1: Broad recall
        candidates = await self.vectorstore.search(
            await embed(prompt), top_k=top_k * 4)

        # Stage 2: Precision re-ranking
        ranked = self.reranker.rank(prompt, [c.text for c in candidates])
        context = "\\n---\\n".join(c.text for c in ranked[:top_k])

        return await generate(
            system="Answer using only the provided context.",
            user=f"Context:\\n{context}\\n\\nQuestion: {prompt}")`,
    lang: "python",
    runInstructions: `# Install
pip install chromadb sentence-transformers openai

# Ingest documents
python ingest.py --corpus ./docs/ --collection my-knowledge-base

# Query the pipeline
python query.py "How does the rate limiter handle burst traffic?"

# Benchmark chunking quality
python eval_chunking.py --strategy semantic --threshold 0.82 \\
  --compare naive_512 naive_1024`,
    outcomes: [
      "23% improvement in retrieval relevance vs fixed 512-token chunking",
      "Cross-encoder re-ranking eliminates 80% of false-positive retrievals",
      "Semantic boundaries preserve complete explanations and code examples intact",
      "Metadata-enriched vectors enable filtered retrieval by source/section"
    ],
    lessons: [
      "The similarity threshold (0.82) needs tuning per corpus. Technical documentation has different sentence-to-sentence coherence than conversational text.",
      "Re-ranking is expensive but worth it. The quality jump from top-20 → top-5 via cross-encoder is dramatic.",
      "Over-retrieving then filtering (4x candidates → re-rank → top_k) consistently outperforms retrieving exactly top_k."
    ]
  },
  {
    slug: "agent-orchestrator",
    title: "Multi-Agent Orchestrator with Trust Boundaries",
    tag: "Agentic AI",
    tagClass: "ai",
    featured: false,
    date: "2026-04-28",
    problem: "Giving a single monolithic agent access to all tools creates an unacceptable blast radius. When an agent hallucinates a tool call or gets prompt-injected, it shouldn't be able to access payment APIs, delete databases, or escalate privileges across the entire system.",
    approach: "Supervisor pattern with trust boundaries: a coordinator agent classifies intent and delegates to specialised sub-agents, each with isolated tool access, scoped memory, cost budgets, and step limits. A guardrail engine evaluates every action before execution.",
    architecture: `<div style="margin: 0 auto; max-width: 680px;">
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
</div>`,
    code: `"""
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

        return agent.finalise(ctx)`,
    lang: "python",
    runInstructions: `# Define agent capabilities in config
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
python orchestrator.py --config agents.yaml \\
  --task "Research rate limiting patterns and implement one"`,
    outcomes: [
      "Blast radius contained: a hallucinated tool call from code-agent can't reach payment APIs",
      "Cost budgets prevent runaway token consumption — hard $5 cap per agent per task",
      "Audit trail captures every action + guardrail verdict for post-incident analysis",
      "Human escalation gate triggered 2x/week — caught a code deletion action that would have been harmful"
    ],
    lessons: [
      "Start with all actions requiring human approval, then gradually relax as you build confidence in the guardrails.",
      "Cost budgets must be per-agent-per-task, not global. A global budget lets one expensive agent starve others.",
      "The supervisor agent itself is the weakest link — if its intent classification is wrong, the wrong specialist gets the task. Invest heavily in the classifier."
    ]
  }
];

export const DOMAINS = [
  { icon: "⬡", title: "Cloud Architecture & Distributed Systems", desc: "Fault-tolerant, cost-efficient cloud systems at scale. I reason deeply about consistency models, service boundaries, data gravity, and the organisational consequences of architectural choices." },
  { icon: "◈", title: "AI Systems & Agentic Workflows", desc: "Production AI beyond the prototype — orchestrating autonomous agents, designing retrieval-augmented pipelines, and reasoning about how intelligence reshapes architecture." },
  { icon: "△", title: "AI Evaluation & Safety Engineering", desc: "Building the guardrails that make autonomous AI trustworthy — evaluation frameworks, red-teaming pipelines, alignment monitoring, and the feedback loops that keep intelligence accountable in production." },
  { icon: "▣", title: "IoT & Edge Architecture", desc: "End-to-end device ecosystems from firmware lifecycle to fleet orchestration at scale. Bridging the physical and the cloud with integrity on both sides." },
  { icon: "⬘", title: "Real-Time Data Engineering", desc: "Streaming and batch pipelines that move data reliably from source to insight. Correctness, latency, and operational cost are all first-class requirements." },
  { icon: "◫", title: "Platform Engineering & Security", desc: "Internal platforms that let product teams move fast without breaking things. Immutable infrastructure, secrets management, and compliance automation." },
  { icon: "⬙", title: "Engineering Leadership & Design", desc: "Technical decision-making at the organisational level — defining standards, developing architectural thinking in teams, and translating between systems and business language." }
];

export const PILLARS = [
  { num: "01", title: "Clarity over cleverness", desc: "The best systems are ones a new engineer understands in an hour. Complexity that does not earn its keep gets removed." },
  { num: "02", title: "Design for the edge case", desc: "Happy paths are easy. I architect around failure modes, partial states, and the conditions that expose hidden assumptions." },
  { num: "03", title: "Intelligence as infrastructure", desc: "AI is not a feature to add — it is an architectural dimension that changes how you design data flow, feedback loops, and trust boundaries." },
  { num: "04", title: "Ship, observe, evolve", desc: "Every deployment is a hypothesis. I build systems instrumented to teach me. Observability is a first-class design concern." }
];

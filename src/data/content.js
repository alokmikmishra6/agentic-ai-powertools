// Helper: articles with date within last 14 days get "new" badge automatically
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;
const _isNew = (dateStr) => (Date.now() - new Date(dateStr).getTime()) < TWO_WEEKS;

export const ARTICLES = [
  {
    slug: "ai-token-cost-optimization",
    title: "The real cost of AI tokens — and how organisations can stop bleeding money",
    category: "AI Systems",
    date: "2026-05-16",
    dateDisplay: "May 16, 2026",
    readTime: "10 min read",
    featured: true,
    cover: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1400&h=600&fit=crop",
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
    readTime: "8 min read",
    featured: false,
    cover: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=600&fit=crop",
    excerpt: "We talk at length about what AI agents can do. We talk far less about the design patterns that make them safe to run in production.",
    body: `<p>We talk at length about what AI agents can do. We talk far less about the design patterns that make them safe to run in production — the orchestration layer, the interrupt mechanisms, the audit trails that keep humans meaningfully in the loop.</p><h3>Why the scaffolding matters more than the model</h3><p>When I first started integrating LLMs into production systems, the instinct was to treat the model as the interesting part and everything around it as plumbing. That framing is backwards. The model is a capability; the architecture is what determines whether that capability is reliable, auditable, and correctable.</p><p>An agentic workflow that can browse the web, call APIs, write and execute code, and trigger downstream systems is, from an architectural standpoint, a new kind of actor in your system. It needs to be reasoned about the same way you reason about any powerful, partially trusted component: with explicit permissions boundaries, observable state, and clear escalation paths when something goes wrong.</p><h3>The three things I always design first</h3><p>Before I think about which model to use or how to structure prompts, I ask three architectural questions:</p><ul><li><strong>What is the blast radius?</strong> What is the worst possible outcome of a single agent action, and is that outcome reversible?</li><li><strong>How do I know what it did?</strong> Full auditability is non-negotiable.</li><li><strong>How do I stop it?</strong> Circuit breakers, cost caps, and step-level timeouts are not optional.</li></ul><h3>Trust is a spectrum, not a binary</h3><p>The most useful mental model I have found for agentic trust is a graduated permission system similar to how operating systems handle process privileges. An agent starts with minimal permissions and earns expanded access through demonstrated, logged, reversible actions.</p>`
  },
  {
    slug: "design-drift-not-technical-debt",
    title: "Why I stopped calling it technical debt and started calling it design drift",
    category: "Architecture",
    date: "2026-04-28",
    dateDisplay: "Apr 28, 2026",
    readTime: "5 min read",
    featured: false,
    cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&h=600&fit=crop",
    excerpt: "The framing of debt implies intention to repay. Most of what we call tech debt is entropy.",
    body: `<p>The framing of debt implies intention. You borrowed something with a plan to repay it. Most of what we label technical debt was never a deliberate borrowing — it was a series of decisions made under incomplete information that, in aggregate, pushed the system away from an architecture that would have served it better.</p><h3>Drift is a more accurate mental model</h3><p>Design drift describes what actually happens. A system starts with a coherent conceptual model. Over time, requirements change. New engineers join. Shortcuts accumulate. The system drifts from its original design intent.</p><h3>What I do instead</h3><p>I run periodic architecture alignment sessions — not to audit blame, but to ask: what is this system trying to be, and how far has it drifted from that?</p>`
  },
  {
    slug: "rag-knowledge-architecture",
    title: "RAG is not retrieval — it is a knowledge architecture question",
    category: "AI Systems",
    date: "2026-04-12",
    dateDisplay: "Apr 12, 2026",
    readTime: "6 min read",
    featured: false,
    cover: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1400&h=600&fit=crop",
    excerpt: "Most RAG discussions get stuck on chunking strategies. The important questions are about how you model knowledge.",
    body: `<p>Most discussions of retrieval-augmented generation get stuck early. They debate chunk sizes, embedding models, similarity thresholds, and reranking strategies. These are real engineering questions, but they are downstream of a more fundamental one: how do you model knowledge in a way that makes the right information retrievable at the right level of granularity?</p><h3>The knowledge modelling problem</h3><p>RAG works by finding semantically related content and injecting it into the model's context. The quality of what gets retrieved depends entirely on how knowledge was structured when it was ingested.</p><h3>What knowledge modelling actually involves</h3><p>Before you write any RAG code, you need answers to several questions: What are the natural units of knowledge in your domain? How do those units relate to each other?</p>`
  },
  {
    slug: "knowing-vs-understanding-system",
    title: "On the difference between knowing a system and understanding it",
    category: "Reflection",
    date: "2026-03-24",
    dateDisplay: "Mar 24, 2026",
    readTime: "4 min read",
    featured: false,
    cover: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1400&h=600&fit=crop",
    excerpt: "You can spend a year on a codebase and still not understand it. Understanding is about mental models, not familiarity.",
    body: `<p>You can spend a year working on a codebase and still not understand it. This is one of the more uncomfortable truths in software engineering.</p><h3>Familiarity is not a model</h3><p>Knowing a system means being able to navigate it. Understanding a system means being able to predict its behaviour under novel conditions.</p><h3>Why this matters for architecture</h3><p>Good architectural decisions require understanding, not just knowledge. Building this understanding is slow and cannot be shortcut.</p>`
  },
  {
    slug: "complexity-budgets",
    title: "Complexity budgets: treating cognitive load as a first-class constraint",
    category: "Architecture",
    date: "2026-03-03",
    dateDisplay: "Mar 3, 2026",
    readTime: "7 min read",
    featured: false,
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&h=600&fit=crop",
    excerpt: "Every architectural decision spends from a finite budget of complexity a team can hold in mind.",
    body: `<p>Every architectural decision has a cognitive cost. It introduces concepts that engineers must hold in mind, patterns they must follow, abstractions they must understand.</p><h3>The budget metaphor</h3><p>I find it useful to think of a team's cognitive capacity as a finite budget. Every piece of the system spends from that budget.</p><h3>Where complexity budgets are most often overspent</h3><p>In my experience, the three areas where complexity budgets are most frequently blown are: distributed transaction management, configuration surfaces, and error handling.</p>`
  },
  {
    slug: "staff-level-engineering",
    title: "What staff-level engineering actually looks like in practice",
    category: "Leadership",
    date: "2026-01-18",
    dateDisplay: "Jan 18, 2026",
    readTime: "9 min read",
    featured: false,
    cover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&h=600&fit=crop",
    excerpt: "The transition from senior to staff engineer is not about writing better code.",
    body: `<p>The staff engineer title is one of the most inconsistently defined in the industry.</p><h3>The unit of work changes</h3><p>As an engineer, you are measured by what you build. As a senior engineer, by what your team builds. As a staff engineer, by what your organisation builds.</p><h3>The leverage question</h3><p>The question I ask most often at this level is: where is my leverage?</p>`
  },
  {
    slug: "llm-pipelines-production",
    title: "Building LLM pipelines that do not collapse under production load",
    category: "AI Systems",
    date: "2025-12-14",
    dateDisplay: "Dec 14, 2025",
    readTime: "10 min read",
    featured: false,
    cover: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1400&h=600&fit=crop",
    excerpt: "Prompt engineering gets you to a demo. Architecture gets you to production.",
    body: `<p>Prompt engineering gets you to a demo. Architecture gets you to production.</p><h3>The non-determinism problem</h3><p>The fundamental challenge of LLM systems in production is that they are probabilistic.</p><h3>Evaluation is infrastructure</h3><p>The teams that run LLM systems reliably in production treat evaluation as infrastructure — not a phase that happens before launch.</p>`
  },
  {
    slug: "event-driven-architecture-cultural",
    title: "Event-driven architecture is a cultural choice, not a technical one",
    category: "Architecture",
    date: "2025-11-07",
    dateDisplay: "Nov 7, 2025",
    readTime: "7 min read",
    featured: false,
    cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&h=600&fit=crop&q=80",
    excerpt: "The hardest part of going event-driven is not the infrastructure — it is getting teams to stop thinking in synchronous terms.",
    body: `<p>I have seen event-driven architecture migrations succeed technically and fail organisationally more often than the reverse.</p><h3>The mental model shift</h3><p>In a synchronous system, a service call is a transaction. In an event-driven system, a service publishes a fact about something that happened.</p>`
  },
  {
    slug: "fourteen-years-software",
    title: "Close to two decades in software: what I wish I had understood earlier",
    category: "Reflection",
    date: "2025-09-22",
    dateDisplay: "Sep 22, 2025",
    readTime: "11 min read",
    featured: false,
    cover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1400&h=600&fit=crop",
    excerpt: "A reflection on compounding mistakes, compounding judgment, and what it actually means to be good at this work.",
    body: `<p>Most of what I know about software I learned by getting things wrong.</p><h3>The compounding effect of small decisions</h3><p>Early in my career I thought the consequential decisions were the architectural ones. I now think the more consequential decisions are the small ones made daily by every engineer on the team.</p><h3>Communication is not a soft skill</h3><p>The clearest line I can draw between engineers who have a large impact and those who have a modest one is communication.</p>`
  },
  {
    slug: "five-questions-system-design",
    title: "The five questions I ask before signing off on any system design",
    category: "Architecture",
    date: "2025-07-30",
    dateDisplay: "Jul 30, 2025",
    readTime: "6 min read",
    featured: false,
    cover: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1400&h=600&fit=crop",
    excerpt: "Design reviews are only useful if you know what you are looking for.",
    body: `<p>Design reviews are only useful if you know what you are looking for.</p><h3>The five questions</h3><p><strong>1. What is the failure model?</strong></p><p><strong>2. What happens at 10x load?</strong></p><p><strong>3. How do you know it is working?</strong></p><p><strong>4. What does rollback look like?</strong></p><p><strong>5. Who needs to change their behaviour?</strong></p>`
  },
  {
    slug: "ai-integrations-fail",
    title: "Why most AI integrations fail — and it is not the model",
    category: "AI Systems",
    date: "2025-05-05",
    dateDisplay: "May 5, 2025",
    readTime: "8 min read",
    featured: false,
    cover: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=600&fit=crop&q=80",
    excerpt: "When an AI integration underperforms, the instinct is to blame the model. In most cases the problem is upstream.",
    body: `<p>When an AI integration underperforms in production, the instinct is to blame the model.</p><h3>The three architectural failure patterns</h3><p><strong>Weak data contracts.</strong> The model is only as good as the data it receives.</p><p><strong>No evaluation framework.</strong></p><p><strong>Integration patterns designed for determinism.</strong></p>`
  },
  {
    slug: "architecture-reviews-useful",
    title: "How I run architecture reviews that engineers actually find useful",
    category: "Leadership",
    date: "2025-02-18",
    dateDisplay: "Feb 18, 2025",
    readTime: "7 min read",
    featured: false,
    cover: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&h=600&fit=crop",
    excerpt: "Most architecture reviews are either rubber-stamps or interrogations. Neither produces better systems.",
    body: `<p>Most architecture reviews are either rubber-stamps or interrogations.</p><h3>The format I have settled on</h3><p><strong>Understanding phase:</strong> Before any critique, I ask questions until I can explain the proposed design back to the presenter.</p><p><strong>Tradeoffs phase:</strong> I ask the presenter to articulate what was given up.</p><p><strong>Risk phase:</strong> I ask what could go wrong.</p>`
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
    title: "QMD: Query Markup Documents for Structured LLM Interaction",
    tag: "AI Infrastructure",
    tagClass: "ai",
    featured: true,
    description: "A hands-on implementation of QMD (Query Markup Documents) — a structured markup format for composing, templating, and versioning LLM queries as first-class engineering artefacts instead of ad-hoc prompt strings.",
    code: `"""
QMD — Query Markup Documents
Structured, versionable, composable LLM query definitions.
Instead of scattering prompt strings across your codebase,
QMD treats queries as declarative documents with metadata,
variables, guardrails, and output schemas.
"""

from dataclasses import dataclass, field
from pathlib import Path
import yaml, re, hashlib

@dataclass
class QMDDocument:
    """A single Query Markup Document."""
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
    tags: list[str] = field(default_factory=list)

    @property
    def fingerprint(self) -> str:
        """Content hash for cache-keying and drift detection."""
        content = f"{self.system}{self.query_template}{self.model}"
        return hashlib.sha256(content.encode()).hexdigest()[:12]

class QMDRegistry:
    """Load, validate, and serve QMD documents from a directory."""

    def __init__(self, qmd_dir: str = "./qmd"):
        self.qmd_dir = Path(qmd_dir)
        self._cache: dict[str, QMDDocument] = {}
        self._load_all()

    def _load_all(self):
        for path in self.qmd_dir.glob("**/*.qmd.yaml"):
            raw = yaml.safe_load(path.read_text())
            doc = QMDDocument(**raw)
            self._cache[doc.name] = doc

    def get(self, name: str) -> QMDDocument:
        if name not in self._cache:
            raise KeyError(f"QMD '{name}' not found")
        return self._cache[name]

    def render(self, name: str, **kwargs) -> dict:
        """Render a QMD into an LLM-ready request payload."""
        doc = self.get(name)

        # Validate all required variables are provided
        missing = set(doc.variables.keys()) - set(kwargs.keys())
        if missing:
            raise ValueError(f"Missing variables: {missing}")

        # Template substitution
        query = doc.query_template
        for key, value in kwargs.items():
            query = query.replace(f"{{{{{key}}}}}", str(value))

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
                "qmd_fingerprint": doc.fingerprint,
            },
        }

# --- Example QMD file: summarise-ticket.qmd.yaml ---
#
# name: summarise-ticket
# version: "1.2"
# model: gpt-4o-mini
# temperature: 0.2
# max_tokens: 300
# tags: [support, summarisation]
# guardrails: [no-pii-in-output, max-cost-0.01]
# variables:
#   ticket_text: "The raw support ticket body"
#   priority: "Ticket priority level"
# system: |
#   You are a support triage assistant.
#   Summarise tickets concisely. Never include PII.
# query_template: |
#   Summarise this {{priority}} priority ticket:
#   {{ticket_text}}
# output_schema:
#   type: object
#   properties:
#     summary: { type: string, maxLength: 200 }
#     category: { type: string }
#     suggested_action: { type: string }

# --- Usage ---
registry = QMDRegistry("./qmd")
payload = registry.render(
    "summarise-ticket",
    ticket_text="My device won't connect after firmware update...",
    priority="high",
)
# payload is a ready-to-send dict for any LLM client`,
    lang: "python"
  },
  {
    title: "Multi-Agent Orchestrator with Tool Routing",
    tag: "Agentic AI",
    tagClass: "ai",
    featured: false,
    description: "A production orchestration layer that coordinates multiple specialised agents — each with isolated tool access, memory scopes, and trust boundaries.",
    code: `class SupervisorAgent:
    """Orchestrates specialised agents with trust boundaries."""

    def __init__(self, agents: dict[str, Agent], guardrails: GuardrailEngine):
        self.agents = agents
        self.guardrails = guardrails
        self.audit = AuditLogger()

    async def run(self, task: Task) -> AgentResult:
        intent = await self.classify_intent(task)
        agent = self.agents[intent.agent_key]

        ctx = AgentContext(
            tools=agent.allowed_tools,
            memory=ScopedMemory(task.session_id, agent.name),
            cost_budget=task.remaining_budget,
            max_steps=agent.step_limit,
        )

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
    lang: "python"
  },
  {
    title: "RAG Pipeline with Semantic Chunking & Re-ranking",
    tag: "AI Infrastructure",
    tagClass: "ai",
    featured: false,
    description: "A production RAG pipeline that moves beyond naive chunking. Documents are split along semantic boundaries, embedded with metadata-enriched vectors, and retrieved through a two-stage process.",
    code: `class RAGPipeline:
    """Two-stage retrieval with semantic chunking."""

    def __init__(self, vectorstore: VectorStore, reranker: CrossEncoder):
        self.vectorstore = vectorstore
        self.reranker = reranker
        self.splitter = SemanticChunker(
            embedding_model="text-embedding-3-large",
            similarity_threshold=0.82,
            max_chunk_tokens=512,
        )

    async def ingest(self, doc: Document) -> int:
        chunks = self.splitter.split(doc.text)
        vectors = []
        for chunk in chunks:
            embedding = await embed(chunk.text)
            vectors.append(VectorRecord(
                id=chunk.id,
                embedding=embedding,
                metadata={
                    "source": doc.uri,
                    "section": chunk.heading,
                    "tokens": chunk.token_count,
                },
                text=chunk.text,
            ))
        return await self.vectorstore.upsert(vectors)

    async def query(self, prompt: str, top_k: int = 5) -> str:
        q_embedding = await embed(prompt)
        candidates = await self.vectorstore.search(q_embedding, top_k=top_k * 4)
        scored = self.reranker.rank(prompt, [c.text for c in candidates])
        top_chunks = scored[:top_k]
        context = "\\n---\\n".join(c.text for c in top_chunks)
        return await generate(
            system="Answer using only the provided context.",
            user=f"Context:\\n{context}\\n\\nQuestion: {prompt}",
        )`,
    lang: "python"
  },
  {
    title: "Agent Evaluation & Observability Framework",
    tag: "AI Ops",
    tagClass: "sys",
    featured: false,
    description: "A runtime evaluation framework for agentic systems. Every agent action is traced, scored against quality rubrics, and fed into a feedback loop.",
    code: `class AgentEvaluator:
    """Continuous evaluation for agentic workflows."""

    def __init__(self, rubrics: list[QualityRubric], alerter: Alerter):
        self.rubrics = rubrics
        self.alerter = alerter
        self.tracer = trace.get_tracer("agent-eval")

    @contextmanager
    def trace_action(self, agent_id: str, action: AgentAction):
        with self.tracer.start_as_current_span(
            f"agent.{agent_id}.{action.tool}",
            attributes={
                "agent.id": agent_id,
                "agent.tool": action.tool,
                "agent.step": action.step_number,
            },
        ) as span:
            yield span
            span.set_attribute("agent.cost_usd", action.cost)

    async def evaluate_run(self, run: AgentRun) -> EvalReport:
        scores = {}
        for rubric in self.rubrics:
            score = await rubric.score(run)
            scores[rubric.name] = score
            baseline = await self.get_baseline(rubric.name)
            if score.value < baseline * 0.9:
                await self.alerter.fire(
                    severity="warning",
                    msg=f"{rubric.name} dropped to {score.value:.2f}",
                    run_id=run.id,
                )
        report = EvalReport(run_id=run.id, scores=scores)
        await self.persist(report)
        return report`,
    lang: "python"
  },
  {
    title: "Tool-Use Agent with Guardrailed Execution",
    tag: "Agentic AI",
    tagClass: "ai",
    featured: false,
    description: "A ReAct-style agent loop that reasons, selects tools, and executes actions inside a sandboxed environment with guardrails.",
    code: `class ReActAgent:
    """Tool-using agent with guardrailed execution loop."""

    def __init__(self, llm: LLM, tools: ToolRegistry,
                 guardrails: GuardrailEngine, max_steps: int = 15):
        self.llm = llm
        self.tools = tools
        self.guardrails = guardrails
        self.max_steps = max_steps

    async def run(self, prompt: str) -> AgentResult:
        messages = [system_prompt(self.tools.schemas())]
        messages.append({"role": "user", "content": prompt})
        trajectory: list[Step] = []

        for step in range(self.max_steps):
            response = await self.llm.chat(messages)
            thought, action = parse_action(response)

            if action is None:
                return AgentResult(
                    answer=thought,
                    trajectory=trajectory,
                    total_cost=sum(s.cost for s in trajectory),
                )

            tool = self.tools.get(action.tool_name)
            verdict = self.guardrails.check(
                tool=tool, args=action.args,
                budget_remaining=self.budget_remaining(trajectory),
            )

            if verdict.blocked:
                observation = f"BLOCKED: {verdict.reason}"
            elif verdict.requires_approval:
                approved = await request_human_approval(action)
                observation = await tool.execute(**action.args) if approved else "Rejected."
            else:
                observation = await tool.execute(**action.args)

            trajectory.append(Step(thought, action, observation, step))
            messages.append(format_observation(observation))

        raise MaxStepsExceeded(self.max_steps, trajectory)`,
    lang: "python"
  }
];

export const DOMAINS = [
  { icon: "⬡", title: "Cloud Architecture & Distributed Systems", desc: "Fault-tolerant, cost-efficient cloud systems at scale. I reason deeply about consistency models, service boundaries, data gravity, and the organisational consequences of architectural choices." },
  { icon: "◈", title: "AI Systems & Agentic Workflows", desc: "Production AI beyond the prototype — orchestrating autonomous agents, designing retrieval-augmented pipelines, and reasoning about how intelligence reshapes architecture." },
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

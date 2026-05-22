// Helper: articles with date within last 14 days get "new" badge automatically
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;
const _isNew = (dateStr) => (Date.now() - new Date(dateStr).getTime()) < TWO_WEEKS;

export const ARTICLES = [
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
    body: `<p>Google's Developer Intelligence team recently presented at I/O 2025 with a number that should stop every software engineer mid-scroll: 75% of new code at Google is now written with AI assistance. Not autocomplete suggestions. Not snippet generation. Substantive, structural, production-bound code. If you are still thinking of AI as a faster keyboard, you are thinking about this wrong.</p>

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
    title: "Prompt Injection Firewall for Multi-Agent Systems",
    tag: "AI Security",
    tagClass: "ai",
    featured: true,
    description: "A defense-in-depth layer that intercepts, validates, and sanitises inter-agent communication in multi-agent LLM systems. Detects domain-camouflaged injection attacks — payloads disguised as legitimate domain instructions — before they propagate across trust boundaries. Inspired by this week's research on adversarial attacks evading detection in multi-agent pipelines.",
    code: `"""
Prompt Injection Firewall for Multi-Agent Systems
──────────────────────────────────────────────────
Intercepts all inter-agent messages and applies layered
detection before allowing propagation across trust boundaries.
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
    sanitised_content: str | None = None
    explanation: str = ""

@dataclass
class AgentMessage:
    source_agent: str
    target_agent: str
    content: str
    msg_type: str  # "task", "result", "delegation", "context"
    trust_tier: int = 0  # 0=untrusted, 1=internal, 2=privileged

class InjectionDetector:
    """Base class for detection strategies."""
    name: str = "base"
    async def scan(self, msg: AgentMessage) -> ScanResult:
        raise NotImplementedError

class PatternDetector(InjectionDetector):
    """Detects known injection patterns via regex signatures."""
    name = "pattern"

    SIGNATURES = [
        r"ignore\\s+(previous|above|all)\\s+instructions",
        r"you\\s+are\\s+now\\s+a",
        r"system\\s*:\\s*you",
        r"\\[INST\\]|\\[/INST\\]|<\\|im_start\\|>",
        r"do\\s+not\\s+follow\\s+(the|your)\\s+(previous|original)",
        r"pretend\\s+(you|that|to\\s+be)",
        r"new\\s+instructions?\\s*:",
        r"override\\s+(previous|system|safety)",
    ]

    def __init__(self):
        self._compiled = [re.compile(p, re.IGNORECASE) for p in self.SIGNATURES]

    async def scan(self, msg: AgentMessage) -> ScanResult:
        triggered = []
        for i, pattern in enumerate(self._compiled):
            if pattern.search(msg.content):
                triggered.append(f"pattern_{i}")
        if triggered:
            return ScanResult(
                level=ThreatLevel.BLOCKED,
                detectors_triggered=triggered,
                explanation=f"Known injection patterns: {triggered}",
            )
        return ScanResult(level=ThreatLevel.CLEAN)

class SemanticDriftDetector(InjectionDetector):
    """Detects domain-camouflaged attacks via semantic similarity drift."""
    name = "semantic_drift"

    def __init__(self, embed_fn: Callable, threshold: float = 0.4):
        self.embed = embed_fn
        self.threshold = threshold

    async def scan(self, msg: AgentMessage) -> ScanResult:
        # Compare semantic similarity between stated task and actual content
        # Domain-camouflaged attacks appear topically relevant but contain
        # instruction-level directives hidden in domain language
        task_embedding = await self.embed(f"Task for {msg.target_agent}")
        content_embedding = await self.embed(msg.content)
        drift_score = 1.0 - cosine_similarity(task_embedding, content_embedding)

        if drift_score > self.threshold:
            return ScanResult(
                level=ThreatLevel.SUSPICIOUS,
                detectors_triggered=["semantic_drift"],
                explanation=f"Semantic drift {drift_score:.2f} exceeds threshold",
            )
        return ScanResult(level=ThreatLevel.CLEAN)

class PrivilegeEscalationDetector(InjectionDetector):
    """Detects attempts to escalate trust tier or access tools beyond scope."""
    name = "privilege_escalation"

    ESCALATION_PATTERNS = [
        r"access\\s+(all|any|every)\\s+tools?",
        r"grant\\s+(me|yourself)\\s+(admin|elevated|full)",
        r"execute\\s+(without|bypassing)\\s+(guardrails?|restrictions?|limits?)",
        r"call\\s+\\w+\\s+directly\\s+without\\s+approval",
    ]

    def __init__(self):
        self._compiled = [re.compile(p, re.IGNORECASE) for p in self.ESCALATION_PATTERNS]

    async def scan(self, msg: AgentMessage) -> ScanResult:
        for i, pattern in enumerate(self._compiled):
            if pattern.search(msg.content):
                return ScanResult(
                    level=ThreatLevel.BLOCKED,
                    detectors_triggered=[f"escalation_{i}"],
                    explanation="Privilege escalation attempt detected",
                )
        return ScanResult(level=ThreatLevel.CLEAN)

class PromptInjectionFirewall:
    """
    Central firewall that all inter-agent messages pass through.
    Applies layered detection and enforces trust boundaries.
    """

    def __init__(self, detectors: list[InjectionDetector], audit_log: "AuditLogger"):
        self.detectors = detectors
        self.audit = audit_log
        self._blocked_count = 0
        self._total_count = 0

    async def inspect(self, msg: AgentMessage) -> ScanResult:
        """Run all detectors concurrently. Block if ANY detector flags."""
        self._total_count += 1
        msg_hash = hashlib.sha256(msg.content.encode()).hexdigest()[:16]

        # Trust boundary enforcement: untrusted agents get stricter scanning
        results = await asyncio.gather(
            *[d.scan(msg) for d in self.detectors]
        )

        # Aggregate: highest threat level wins
        worst = ThreatLevel.CLEAN
        all_triggered = []
        explanations = []

        for result in results:
            if result.level.value > worst.value:
                worst = result.level
            all_triggered.extend(result.detectors_triggered)
            if result.explanation:
                explanations.append(result.explanation)

        # Untrusted agents: SUSPICIOUS → BLOCKED (zero tolerance)
        if msg.trust_tier == 0 and worst == ThreatLevel.SUSPICIOUS:
            worst = ThreatLevel.BLOCKED

        final = ScanResult(
            level=worst,
            detectors_triggered=all_triggered,
            original_hash=msg_hash,
            explanation=" | ".join(explanations),
        )

        if worst == ThreatLevel.BLOCKED:
            self._blocked_count += 1

        # Full audit trail — every message, every decision
        await self.audit.log_scan(
            source=msg.source_agent,
            target=msg.target_agent,
            msg_type=msg.msg_type,
            trust_tier=msg.trust_tier,
            result=final,
        )

        return final

    @property
    def block_rate(self) -> float:
        if self._total_count == 0:
            return 0.0
        return self._blocked_count / self._total_count

# --- Usage in an orchestration loop ---

firewall = PromptInjectionFirewall(
    detectors=[
        PatternDetector(),
        SemanticDriftDetector(embed_fn=embed, threshold=0.4),
        PrivilegeEscalationDetector(),
    ],
    audit_log=AuditLogger(sink="injection-firewall-events"),
)

async def route_message(msg: AgentMessage) -> str | None:
    """All inter-agent messages pass through the firewall."""
    verdict = await firewall.inspect(msg)

    if verdict.level == ThreatLevel.BLOCKED:
        return None  # Message never reaches target agent

    if verdict.level == ThreatLevel.SUSPICIOUS:
        # Flag for human review but allow with reduced tool access
        await escalate_to_human(msg, verdict)

    return msg.content  # Clean — deliver to target agent`,
    lang: "python"
  },
  {
    title: "A2A (Agent-to-Agent) Protocol Gateway",
    tag: "Agentic AI",
    tagClass: "ai",
    featured: true,
    description: "An implementation of Google's Agent-to-Agent protocol — the interoperability standard for multi-agent communication. While MCP standardises agent↔tool interaction, A2A standardises agent↔agent collaboration: discovery, capability negotiation, task delegation, and streaming results across heterogeneous agent frameworks.",
    code: `"""
A2A Protocol Gateway — Agent-to-Agent Interoperability
───────────────────────────────────────────────────────
Implements Google's A2A protocol for cross-framework agent
collaboration. Agents discover peers, negotiate capabilities,
delegate tasks, and stream results — regardless of whether
they run on LangGraph, Autogen, CrewAI, or custom frameworks.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import AsyncIterator
import uuid, json, asyncio

class TaskState(Enum):
    SUBMITTED = "submitted"
    WORKING = "working"
    INPUT_REQUIRED = "input-required"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELED = "canceled"

@dataclass
class AgentCard:
    """Public capability declaration — the A2A discovery contract."""
    name: str
    description: str
    url: str  # Agent's A2A endpoint
    skills: list[dict]  # [{name, description, input_schema, output_schema}]
    auth_schemes: list[str] = field(default_factory=lambda: ["bearer"])
    streaming: bool = True
    max_concurrent_tasks: int = 10

    def to_json(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "url": self.url,
            "capabilities": {
                "streaming": self.streaming,
                "pushNotifications": True,
            },
            "skills": self.skills,
            "authentication": {"schemes": self.auth_schemes},
        }

@dataclass
class A2ATask:
    """A task flowing between agents via the A2A protocol."""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    state: TaskState = TaskState.SUBMITTED
    messages: list[dict] = field(default_factory=list)
    artifacts: list[dict] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)

    def add_message(self, role: str, content: str, parts: list[dict] = None):
        self.messages.append({
            "role": role,
            "parts": parts or [{"type": "text", "text": content}],
        })

    def add_artifact(self, name: str, mime_type: str, data: str):
        self.artifacts.append({
            "name": name,
            "parts": [{"type": "inline", "mimeType": mime_type, "data": data}],
        })

class A2AGateway:
    """
    Central gateway that manages agent discovery, routing, and
    task lifecycle across a fleet of A2A-compatible agents.
    """

    def __init__(self):
        self._registry: dict[str, AgentCard] = {}
        self._tasks: dict[str, A2ATask] = {}
        self._task_routing: dict[str, str] = {}  # task_id → agent_name

    # ─── Discovery ────────────────────────────────────────────────

    def register_agent(self, card: AgentCard):
        """Register an agent's capabilities with the gateway."""
        self._registry[card.name] = card

    def discover(self, skill_query: str) -> list[AgentCard]:
        """Find agents whose skills match a natural language query."""
        matches = []
        for card in self._registry.values():
            for skill in card.skills:
                if self._skill_matches(skill, skill_query):
                    matches.append(card)
                    break
        return matches

    def _skill_matches(self, skill: dict, query: str) -> bool:
        """Semantic matching between query and skill description."""
        # Production: use embedding similarity
        # Simplified: keyword overlap
        query_terms = set(query.lower().split())
        skill_terms = set(skill["description"].lower().split())
        return len(query_terms & skill_terms) >= 2

    # ─── Task Lifecycle ───────────────────────────────────────────

    async def send_task(self, target: str, prompt: str, **kwargs) -> A2ATask:
        """Submit a task to a target agent via A2A protocol."""
        if target not in self._registry:
            raise ValueError(f"Agent '{target}' not registered")

        task = A2ATask(metadata=kwargs)
        task.add_message("user", prompt)
        task.state = TaskState.SUBMITTED

        self._tasks[task.id] = task
        self._task_routing[task.id] = target

        # Dispatch to target agent's A2A endpoint
        card = self._registry[target]
        await self._dispatch(card, task)

        return task

    async def send_task_streaming(
        self, target: str, prompt: str
    ) -> AsyncIterator[dict]:
        """Stream task updates as Server-Sent Events (SSE)."""
        task = await self.send_task(target, prompt)

        # Yield state transitions as they happen
        async for event in self._stream_events(task.id):
            yield event
            if event["state"] in ("completed", "failed", "canceled"):
                break

    async def get_task(self, task_id: str) -> A2ATask:
        """Poll task status (for non-streaming clients)."""
        return self._tasks.get(task_id)

    async def cancel_task(self, task_id: str) -> A2ATask:
        """Request cancellation of an in-progress task."""
        task = self._tasks[task_id]
        task.state = TaskState.CANCELED
        target = self._task_routing[task_id]
        card = self._registry[target]
        await self._send_cancel(card, task)
        return task

    # ─── Multi-Agent Collaboration ────────────────────────────────

    async def delegate_chain(
        self, agents: list[str], initial_prompt: str
    ) -> A2ATask:
        """
        Chain delegation: output of agent N becomes input for agent N+1.
        Implements the sequential collaboration pattern.
        """
        current_input = initial_prompt
        final_task = None

        for agent_name in agents:
            task = await self.send_task(agent_name, current_input)
            await self._wait_for_completion(task)

            if task.state == TaskState.FAILED:
                return task  # Propagate failure

            # Extract output for next agent in chain
            if task.artifacts:
                current_input = task.artifacts[-1]["parts"][0]["data"]
            else:
                last_msg = task.messages[-1]
                current_input = last_msg["parts"][0]["text"]

            final_task = task

        return final_task

    async def delegate_parallel(
        self, assignments: dict[str, str]
    ) -> dict[str, A2ATask]:
        """
        Fan-out: send different subtasks to multiple agents concurrently.
        Returns when all complete or any fails.
        """
        tasks = await asyncio.gather(*[
            self.send_task(agent, prompt)
            for agent, prompt in assignments.items()
        ])
        await asyncio.gather(*[
            self._wait_for_completion(t) for t in tasks
        ])
        return {
            self._task_routing[t.id]: t for t in tasks
        }

    # ─── Internal ─────────────────────────────────────────────────

    async def _dispatch(self, card: AgentCard, task: A2ATask):
        """HTTP POST to agent's /tasks/send endpoint."""
        task.state = TaskState.WORKING
        # In production: httpx.post(card.url + "/tasks/send", json=task)

    async def _stream_events(self, task_id: str) -> AsyncIterator[dict]:
        """SSE stream from agent's /tasks/sendSubscribe endpoint."""
        task = self._tasks[task_id]
        while task.state == TaskState.WORKING:
            await asyncio.sleep(0.1)
            yield {"task_id": task_id, "state": task.state.value}
        yield {"task_id": task_id, "state": task.state.value, "final": True}

    async def _wait_for_completion(self, task: A2ATask):
        while task.state in (TaskState.SUBMITTED, TaskState.WORKING):
            await asyncio.sleep(0.1)


# ─── Example: Register agents and orchestrate ─────────────────────

gateway = A2AGateway()

# Register specialised agents
gateway.register_agent(AgentCard(
    name="research-agent",
    description="Deep research and information synthesis",
    url="http://agents.internal/research",
    skills=[{"name": "research", "description": "research synthesise information"}],
))
gateway.register_agent(AgentCard(
    name="code-agent",
    description="Code generation and review",
    url="http://agents.internal/code",
    skills=[{"name": "generate", "description": "generate review code"}],
))
gateway.register_agent(AgentCard(
    name="security-agent",
    description="Security analysis and vulnerability scanning",
    url="http://agents.internal/security",
    skills=[{"name": "audit", "description": "security audit vulnerabilities"}],
))

# Chain: research → code → security review
# result = await gateway.delegate_chain(
#     ["research-agent", "code-agent", "security-agent"],
#     "Build a rate limiter for our API gateway"
# )`,
    lang: "python"
  },
  {
    title: "AI Evaluation Pipeline with Drift Detection",
    tag: "AI Safety",
    tagClass: "ai",
    featured: true,
    description: "A continuous evaluation system for production AI that detects quality drift, compares model outputs against golden datasets, and triggers automated rollback when safety thresholds are breached.",
    code: `class EvalPipeline:
    """Continuous AI evaluation with automated drift detection."""

    def __init__(self, golden_set: GoldenDataset, thresholds: EvalThresholds):
        self.golden = golden_set
        self.thresholds = thresholds
        self.history = MetricHistory(window_days=30)

    async def evaluate_model(self, model: str, version: str) -> EvalReport:
        results = []
        for case in self.golden.cases:
            output = await generate(model=model, prompt=case.prompt)
            score = await self.score(output, case.expected, case.rubric)
            results.append(EvalResult(case_id=case.id, score=score))

        report = EvalReport(
            model=model,
            version=version,
            overall_score=mean(r.score for r in results),
            safety_score=mean(r.score for r in results if r.is_safety_case),
            results=results,
        )

        # Drift detection: compare against rolling baseline
        baseline = self.history.get_baseline(model)
        if report.overall_score < baseline * self.thresholds.drift_ratio:
            await self.alert_drift(report, baseline)
        if report.safety_score < self.thresholds.safety_floor:
            await self.trigger_rollback(model, version, report)

        self.history.record(report)
        return report

    async def trigger_rollback(self, model, version, report):
        """Automated rollback when safety thresholds are breached."""
        previous = self.history.last_passing_version(model)
        await self.router.pin_model(model, previous)
        await self.notify(
            severity="critical",
            msg=f"Safety breach: {model}@{version} scored {report.safety_score:.2f}",
        )`,
    lang: "python"
  },
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

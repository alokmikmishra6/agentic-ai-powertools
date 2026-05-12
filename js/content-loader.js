/* ═══════════════════════════════════════
   CONTENT LOADER
   Loads writing & thinking data from
   individual JSON files in content/
═══════════════════════════════════════ */

const WRITING_FILES = [
  'invisible-architecture-agentic-workflow',
  'design-drift-not-technical-debt',
  'rag-knowledge-architecture',
  'knowing-vs-understanding-system',
  'complexity-budgets',
  'staff-level-engineering',
  'llm-pipelines-production',
  'event-driven-architecture-cultural',
  'fourteen-years-software',
  'five-questions-system-design',
  'ai-integrations-fail',
  'architecture-reviews-useful',
  'eventual-consistency-hidden-costs'
];

const THINKING_FILES = [
  'agent-trust-architecture',
  'observability-epistemology',
  'edge-cloud-continuum'
];

/* Globals populated after loading */
var ARTICLES = [];
var THINKING = [];

async function loadContent() {
  // Load writings
  const writingPromises = WRITING_FILES.map(slug =>
    fetch('content/writings/' + slug + '.json')
      .then(r => r.json())
      .catch(() => null)
  );
  const writings = await Promise.all(writingPromises);
  ARTICLES = writings.filter(Boolean);

  // Load thinking
  const thinkingPromises = THINKING_FILES.map(slug =>
    fetch('content/thinking/' + slug + '.json')
      .then(r => r.json())
      .catch(() => null)
  );
  const thinkingItems = await Promise.all(thinkingPromises);
  THINKING = thinkingItems.filter(Boolean);
}

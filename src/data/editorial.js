// Editorial labels and relationships, maintained alongside the writing.
export const FORMATS = {
  'ai-second-brain-living-knowledge': 'Deep dive', 'agents-survive-failure-checkpointing': 'Implementation',
  'learning-loop-architecture': 'Concept', 'agentic-ai-harness-engineering': 'Implementation',
  'security-principles-agentic-ai': 'Deep dive', 'token-economy-agentic-systems': 'Implementation',
  'developer-identity-ai-era': 'Perspective', 'ai-evaluation-production-systems': 'Deep dive',
  'model-context-protocol-infrastructure': 'Concept', 'ai-token-cost-optimization': 'Deep dive',
  'invisible-architecture-agentic-workflow': 'Concept', 'design-drift-not-technical-debt': 'Perspective',
  'rag-knowledge-architecture': 'Concept', 'knowing-vs-understanding-system': 'Perspective',
  'complexity-budgets': 'Concept', 'staff-level-engineering': 'Perspective',
  'llm-pipelines-production': 'Implementation', 'event-driven-architecture-cultural': 'Perspective',
  'fourteen-years-software': 'Perspective', 'five-questions-system-design': 'Implementation',
  'ai-integrations-fail': 'Deep dive', 'architecture-reviews-useful': 'Implementation',
  'eventual-consistency-hidden-costs': 'Deep dive',
}
export const CONNECTIONS = [
  { from: 'invisible-architecture-agentic-workflow', to: 'agentic-ai-harness-engineering', label: 'Turns the architecture into a control plane' },
  { from: 'agentic-ai-harness-engineering', to: 'agents-survive-failure-checkpointing', label: 'Extends the harness with durable recovery' },
  { from: 'security-principles-agentic-ai', to: 'agentic-ai-harness-engineering', label: 'Applies trust boundaries to execution' },
  { from: 'rag-knowledge-architecture', to: 'ai-second-brain-living-knowledge', label: 'Expands retrieval into living knowledge' },
  { from: 'five-questions-system-design', to: 'complexity-budgets', label: 'Adds a cognitive constraint to design reviews' },
  { from: 'complexity-budgets', to: 'eventual-consistency-hidden-costs', label: 'Examines one consequential complexity tradeoff' },
  { from: 'ai-token-cost-optimization', to: 'token-economy-agentic-systems', label: 'Applies cost discipline to agent workflows' },
  { from: 'knowing-vs-understanding-system', to: 'staff-level-engineering', label: 'Connects mental models with engineering judgment' },
  { from: 'staff-level-engineering', to: 'fourteen-years-software', label: 'Reflects on how judgment compounds' },
]

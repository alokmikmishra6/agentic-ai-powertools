---
title: "The five questions I ask before signing off on any system design"
slug: five-questions-system-design
category: Architecture
date: "2025-07-30"
readTime: "11 min read"
excerpt: "Design reviews are only useful if you know what you are looking for."
theme: "Design reviews are only useful if you know what you are looking for. These five questions surface the risks that matter."
---

Design reviews are only useful if you know what you are looking for. Without a consistent framework for evaluation, reviews devolve into subjective opinions about naming conventions and code style. The five questions I ask on every design review are not about aesthetics or preference — they are about surfacing the risks that will matter six months from now, when the system is in production and the original authors have moved on.

### 1. What is the failure model?

Every system fails. The question is not whether it will fail, but how it will fail, and whether the failure mode is acceptable. When I ask "what is the failure model?" I am looking for specific answers:

- What happens when the database is unreachable for 30 seconds? For 5 minutes? For an hour?

- What happens when a downstream dependency returns errors? Does the failure cascade, or is it contained?

- What happens when the system receives malformed input? Does it reject cleanly, or does it corrupt state?

- What is the blast radius of a single bad deployment? Can one service's failure take down the entire platform?

If the design does not have clear answers to these questions, it will develop answers in production — under pressure, without preparation, and usually in the worst possible way. I would rather see a system with a limited feature set and a well-understood failure model than a feature-rich system that has never thought about what happens when things go wrong.

### 2. What happens at 10x load?

This is not a capacity planning question — it is an architectural question. When load increases by an order of magnitude, which components become bottlenecks? Which assumptions break? Which costs become unsustainable?

I am not asking whether the system can handle 10x load today. I am asking whether the architecture permits scaling to 10x without a rewrite. The signals I look for:

- **Stateless vs. stateful.** Stateless components scale horizontally by adding instances. Stateful components require coordination, and coordination is where scaling breaks down.

- **O(1) vs. O(n) operations in the hot path.** A single O(n) operation that seems fine at current load becomes a wall at 10x.

- **Cost linearity.** Does cost scale linearly with load, or super-linearly? Systems where cost grows faster than load eventually become economically unviable.

- **Data growth.** Where does data accumulate? What is the retention policy? A system that works at 100GB but has no plan for 1TB will hit that wall sooner than anyone expects.

### 3. How do you know it is working?

This is the observability question. If this system deployed today and I asked you "is it healthy?" — what would you look at? If the answer is "the logs" or "the error rate in our monitoring tool" — the observability model is insufficient.

A well-instrumented system can answer specific questions:

- What is the end-to-end latency distribution for the critical user journey?

- What percentage of requests are succeeding on the first attempt vs. after retries?

- What is the current queue depth, and is it growing or shrinking?

- Are there anomalies in the data patterns that suggest correctness issues (not just availability issues)?

I especially push on correctness monitoring. Availability is easy to measure — the system is either responding or it is not. Correctness is harder: the system is responding, but is it responding correctly? For systems that process data, transform it, or make decisions, correctness monitoring is the only thing that catches "silently wrong" failures.

### 4. What does rollback look like?

Every deployment should be reversible. But "reversible" is more nuanced than "deploy the previous version." When I ask about rollback, I am probing for:

- **Schema migrations.** If the new version includes a database schema change, can you roll back the code without rolling back the schema? If not, what is the data migration story?

- **State contamination.** If the new version processed data during the window it was deployed, is that data compatible with the old version? Or does rolling back the code leave corrupted state?

- **Feature flags.** Can the new behaviour be disabled without a deployment? This is the safest rollback mechanism — it separates deployment from activation.

- **Time to rollback.** How long does it take to detect a problem and complete a rollback? If detection takes 30 minutes and rollback takes another 30, you have a 60-minute exposure window for every deployment.

The designs I worry about most are those where rollback is technically possible but practically terrifying — where nobody is confident enough to actually pull the trigger because the consequences are unclear.

### 5. Who needs to change their behaviour?

This is the most underrated question in system design. Technical designs do not exist in a vacuum — they require humans to interact with them. When I ask who needs to change their behaviour, I am asking:

- Which teams need to update their integration code? What is the migration path for them?

- Which operational runbooks need to be updated? Who writes those updates?

- Which monitoring dashboards need new panels? Who creates them?

- Which on-call rotation inherits alerting for this new system? Are they prepared?

- Which product managers need to understand new limitations or capabilities?

A design that requires twelve teams to change their behaviour in a coordinated way is a different proposition than a design that can be adopted incrementally by each team independently. The technical elegance of the solution matters far less than the human coordination cost of implementing it.

### Using these questions in practice

These five questions are not a checklist to be completed once and filed away. They are a lens through which to view the design continuously. The answers evolve as the system evolves, and revisiting them periodically — especially before major changes — keeps the team honest about what they know and what they are assuming.

The goal is not to create perfect designs. The goal is to create designs where the risks are visible, the trade-offs are explicit, and the team has a shared understanding of what they are signing up for. A design with known risks is manageable. A design with hidden risks is a liability.

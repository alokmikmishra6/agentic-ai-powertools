---
title: "Who budgets the human attention in an agent workflow?"
slug: "who-budgets-review-attention"
date: "2026-09-19"
tag: "Agent systems"
tagClass: "ai"
featured: true
status: "open"
sidebarText: "The review budget"
relatedWriting: "review-is-the-new-bottleneck"
---

A team can put a hard limit on API spend and still overwhelm the person who approves its changes. Five inexpensive agents can produce five substantial review requests at the same time. The tool budget looks healthy while the human queue becomes the bottleneck.

I am interested in treating reviewer availability as an input to scheduling. A task that is likely to need architectural judgment should consume a different kind of capacity from a formatting fix. That could mean limiting concurrent risky changes or reserving review windows before work starts.

The difficult part is predicting review effort without rewarding superficial smallness. A ten-line authorization change may need more thought than a thousand generated fixtures. File count and diff size are useful clues, but weak substitutes for understanding consequence.

A useful experiment would compare queue age, active review time, and follow-up fixes before and after adding a work-in-progress limit. I would want to see whether the limit improves completed delivery, not merely whether it makes the dashboard quieter. The constraint may turn out to be task definition rather than reviewer capacity.

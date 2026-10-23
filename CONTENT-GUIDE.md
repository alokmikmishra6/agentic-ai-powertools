# Publishing Field Notes

## Write an essay

Run `npm run new:writing` to scaffold a Markdown file, or create one in `content/writings/`:

```markdown
---
title: "My new essay"
slug: my-new-essay
category: AI Systems
date: "2026-10-23"
featured: false
excerpt: "A short description for the library and sharing preview."
theme: "An optional longer introduction."
---

Start your essay here.

## A useful section heading

Section headings become stable, shareable links automatically.
```

Categories are AI Systems, Architecture, Reflection, and Leadership. Reading time is calculated when omitted. Keep a published slug stable so bookmarks, reading progress, and shared links continue to work.

Markdown takes precedence over a legacy JSON article with the same slug. Edit source files in `content/`; `src/data/content.js`, `src/data/index.js`, and `src/data/search-index.json` are generated files. The older `add-content.mjs` script edits generated data directly and should not be used for this workflow.

## Curate the reading experience

- `src/data/editorial.js`: add an essay's format (Concept, Deep dive, Implementation, or Perspective) to `FORMATS`. Add meaningful connections between real article slugs to `CONNECTIONS`, with a short explanation of why the next essay is useful.
- `src/data/journeys.js`: curate ordered reading paths with real article slugs. Completion is stored in each reader's browser.
- `src/components/labs/SystemLab.jsx` and `src/lib/labs.js`: the three interactive demos and their calculations. Essay-to-lab links are in `src/pages/Article.jsx`.
- `content/showcase/`: Markdown or legacy JSON project sources. Use the existing Markdown sections: Problem, Approach, Architecture, Code, Run, Outcomes, and Lessons. Download buttons use the actual code and run instructions; reference snippets should clearly state their prerequisites.
- `content/thinking/`: short inquiries in Markdown with frontmatter. Avoid duplicate Markdown and JSON versions of the same inquiry.

Bookmarks, reading position, preferences, and completion stay in the reader's browser. There is no account or cross-device sync. Readers can clear their reading data on the Saved page.

## Preview and publish

```bash
npm run build:content
npm test
npm run dev
# When ready to check the production output:
npm run build
```

The production build generates full HTML for each essay, an individual PNG sharing preview, RSS, a sitemap, and `updates.json`. Clean article URLs look like `/agentic-ai-powertools/writing/my-new-essay/`. Previously shared hash links remain supported.

Review and commit the intended source and generated data changes, then push to `main` when ready to publish. GitHub Actions deploys the production build to GitHub Pages. A local preview or build does not publish anything or send email.

## Free email updates

Follow [newsletter/SETUP.md](newsletter/SETUP.md) once to activate the Google Apps Script sender and connect its URL. Until configured, the website offers RSS and explains that email updates are coming soon.

Once activated, the hourly sender detects new or revised essays, projects, and inquiries in the deployed `updates.json`. It sends a digest to confirmed subscribers and queues overflow within Google's free quota. Existing content is baselined during setup, so activation does not send the whole archive. Each confirmed signup queues a welcome email and an owner notification. Unsubscribed readers are excluded from queued updates.

Editing a published essay's content or metadata changes its revision and can trigger an update. Batch related edits into one deployment to keep digests useful. Changing only the site's styling does not change content revisions. Never commit the subscriber Sheet, exports, or private Google settings.

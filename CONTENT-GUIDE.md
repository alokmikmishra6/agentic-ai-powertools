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
- `content/showcase/`: Markdown or legacy JSON project sources. Use the existing Markdown sections: Problem, Approach, Architecture, Code, Run, Outcomes, and Lessons. Download buttons use the actual code and run instructions; reference snippets should clearly state their prerequisites. Set `runnable: true` only for standalone examples with executable checks, and use `relatedWriting` to link a companion essay. Projects appear newest first.
- `content/thinking/`: dated inquiries in Markdown with a stable `slug`, `status: open` or `archived`, `relatedWriting` essay slug, and optional `archiveNote`. Current questions appear newest first; archived entries keep their links. Markdown takes precedence over legacy JSON with the same slug.

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

## Generate Kokoro narration locally

Heart (`af_heart`, American English) is the default narrator for the Writing archive. Essays without a current recording use the device-voice reader. The site never downloads an AI model onto the visitor's device.

After updating and compiling an essay, generate its full recording locally:

```bash
npm run build:content
npm run audio:generate -- --slug agents-need-stop-rules
# Or generate all missing / changed essays with one model load
npm run audio:generate -- --all
npm run build
```

The first run downloads the free Kokoro model. Generation uses the local CPU. On a machine with spare memory and CPU capacity, `--all --jobs 4 --threads 2` generates up to four essays concurrently; the default is one essay at a time. Encoding uses macOS's built-in `afconvert`, or FFmpeg on other platforms. Node 22+ is recommended. On Node versions supporting system certificates, `NODE_USE_SYSTEM_CA=1` can be used where an organization's trusted certificate is required; do not disable TLS verification.

Heart is selected explicitly by the player. The archive command saves progress after each essay and skips unchanged recordings, so interrupted runs can be resumed with the same command. For local auditions the generator also accepts `--voice am_michael` or `--voice bf_emma` and `--sample`; these do not change the selected narrator. Audition files are written to `public/audio`, so remove them before publishing if you do not want them hosted. Use `--force` to regenerate an unchanged recording after adjusting pronunciation. Regenerate and redeploy after text edits; the build hides old audio when its source hash no longer matches the article.

Commit the intended M4A files, `public/audio/manifest.json`, and regenerated `src/data/narration.json`. Build and deployment read those files and do not run inference. The model cache stays in ignored dependencies. Audio adds storage and transfer usage to the existing hosting plan.

The extractor keeps headings, prose, lists, quotations, and link labels. It skips code blocks and tables, and normalizes common technical initialisms. The written essay remains authoritative. Review pronunciation and content omissions before publication. Listening position is stored locally per recording, with no autoplay.

# Adding New Content

Quick reference for adding writing, showcases, and thinking entries.

## Option 1: Interactive CLI

```bash
# Add a new writing article
node scripts/add-content.mjs writing

# Add a new showcase
node scripts/add-content.mjs showcase

# Add a new thinking entry
node scripts/add-content.mjs thinking
```

The script prompts you for each field and inserts the entry at the top of the relevant array in `src/data/content.js`.

## Option 2: JSON File

Create a JSON file with the fields and pass it:

```bash
node scripts/add-content.mjs writing --json my-article.json
```

Example `my-article.json`:
```json
{
  "title": "My New Article",
  "category": "AI Systems",
  "featured": true,
  "excerpt": "A one-line summary.",
  "body": "<p>The full article in HTML.</p>"
}
```

## Option 3: Edit Directly

Open `src/data/content.js` and add a new entry to the top of the relevant array:

### Writing (ARTICLES array)
```js
{
  slug: "my-article-slug",
  title: "Article Title",
  category: "AI Systems",        // AI Systems | Architecture | Reflection | Leadership
  date: "2026-05-16",
  dateDisplay: "May 16, 2026",
  readTime: "8 min read",
  featured: true,                 // shows "Featured" badge
  cover: "https://...",           // Unsplash URL recommended
  excerpt: "One-line summary.",
  body: `<p>HTML content...</p>`
}
```

### Showcase (SHOWCASE array)
```js
{
  title: "Showcase Title",
  tag: "AI Infrastructure",
  tagClass: "ai",                // ai | sys
  featured: true,                // shows ★ badge on tab
  description: "Description text.",
  code: `# Python code here...`,
  lang: "python"
}
```

### Thinking (THINKING array)
```js
{
  title: "Question or thesis",
  tag: "AI Architecture",
  tagClass: "ai",               // ai | cl | sys
  featured: true,
  sidebarText: "Sidebar label",
  body: "Full paragraph."
}
```

## Content Features

- **Featured badge**: Set `featured: true` — shows a gradient "Featured" badge on writing cards and ★ on showcase tabs
- **New badge**: Articles published within the last 14 days automatically get a "New" badge (based on the `date` field)
- **Home page indicators**: The Explore section shows a pulsing "New" dot on Showcase/Writing cards when there's featured or recent content
- **Filter buttons**: The Writing page has "Featured" and "New" filter tabs alongside category filters

## After Adding Content

```bash
npm run dev     # preview locally
npm run build   # verify production build
git add -A && git commit -m "Add: new content" && git push
```

Deployment to GitHub Pages happens automatically via GitHub Actions on push to `main`.

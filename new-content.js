#!/usr/bin/env node
/**
 * new-content.js — CLI helper to create new writing or thinking entries
 *
 * Usage:
 *   node new-content.js writing
 *   node new-content.js thinking
 *
 * Prompts for details and creates the JSON file in the appropriate directory.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

function runBuild() {
  console.log('\nRebuilding content-data.js...');
  execSync('node ' + path.join(__dirname, 'build-content.js'), { stdio: 'inherit' });
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = q => new Promise(r => rl.question(q, r));

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function newWriting() {
  const title = await ask('Title: ');
  const category = await ask('Category (AI Systems / Architecture / Reflection / Leadership): ');
  const readTime = await ask('Read time (e.g. "8 min read"): ');
  const cover = await ask('Cover image URL (Unsplash recommended, press Enter for default): ');
  const excerpt = await ask('Excerpt (1-2 sentences): ');

  console.log('\nPaste article body as HTML (end with an empty line):');
  let body = '';
  const bodyRl = readline.createInterface({ input: process.stdin, output: process.stdout });
  for await (const line of bodyRl) {
    if (line === '') break;
    body += line + '\n';
  }
  body = body.trim();

  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const dateDisplay = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const defaultCover = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=600&fit=crop';
  const coverUrl = cover || defaultCover;
  const thumbUrl = coverUrl.replace(/w=\d+/, 'w=800').replace(/h=\d+/, 'h=400');

  const data = {
    title,
    category: category || 'Reflection',
    date,
    dateDisplay,
    readTime: readTime || '5 min read',
    cover: coverUrl,
    coverThumb: thumbUrl,
    excerpt,
    body: body || `<p>${excerpt}</p>`
  };

  const slug = slugify(title);
  const filePath = path.join(__dirname, 'content', 'writings', slug + '.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`\n✓ Created: ${filePath}`);
  runBuild();
  process.exit(0);
}

async function newThinking() {
  const title = await ask('Title: ');
  const tag = await ask('Tag (e.g. "AI Architecture", "Systems Design", "Cloud & Edge"): ');
  const tagClass = await ask('Tag CSS class (ai / sys / cl): ');
  const featured = (await ask('Featured? (y/n): ')).toLowerCase() === 'y';
  const sidebarText = await ask('Sidebar text: ');
  const body = await ask('Body paragraph: ');

  const data = { title, tag, tagClass: tagClass || 'sys', featured, sidebarText, body };

  const slug = slugify(title);
  const filePath = path.join(__dirname, 'content', 'thinking', slug + '.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`\n✓ Created: ${filePath}`);
  runBuild();
  process.exit(0);
}

(async () => {
  const type = process.argv[2];
  if (type === 'writing') await newWriting();
  else if (type === 'thinking') await newThinking();
  else {
    console.log('Usage: node new-content.js [writing|thinking]');
    process.exit(1);
  }
})();

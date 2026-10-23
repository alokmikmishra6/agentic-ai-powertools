import { mkdirSync, readFileSync, writeFileSync, existsSync, renameSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { fork, spawnSync } from 'node:child_process'
import { KokoroTTS } from 'kokoro-js'
import { StyleTextToSpeech2Model, AutoTokenizer } from '@huggingface/transformers'
import { ARTICLES } from '../src/data/content.js'
import { narrationHash, narrationBlocks, splitSpeech } from './lib/narration.mjs'

const args = process.argv.slice(2)
const isMainThread = !args.includes('--worker')
const option = key => args[args.indexOf(key) + 1]
const slug = args.includes('--slug') ? option('--slug') : 'agents-need-stop-rules'
const voice = args.includes('--voice') ? option('--voice') : 'af_heart'
const sample = args.includes('--sample')
const jobs = args.includes('--jobs') ? Number(option('--jobs')) : 1
const threads = args.includes('--threads') ? Number(option('--threads')) : 4
if (!Number.isInteger(jobs) || jobs < 1 || jobs > 8) throw new Error('--jobs must be an integer from 1 to 8.')
if (!Number.isInteger(threads) || threads < 1 || threads > 16) throw new Error('--threads must be an integer from 1 to 16.')
if (args.includes('--all') && args.includes('--slug')) throw new Error('Choose --all or --slug, not both.')
const articles = args.includes('--all') ? ARTICLES : ARTICLES.filter(item => item.slug === slug)
if (!articles.length) throw new Error('Unknown article slug: ' + slug)
if (!['af_heart', 'am_michael', 'bf_emma'].includes(voice)) throw new Error('Supported audition voices: af_heart, am_michael, bf_emma')
const kind = sample ? 'sample' : 'full'
const directory = resolve('public/audio')
const manifestPath = resolve(directory, 'manifest.json')
mkdirSync(directory, { recursive: true })
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {}
const encoder = process.platform === 'darwin' ? '/usr/bin/afconvert' : 'ffmpeg'
const probe = spawnSync(encoder, process.platform === 'darwin' ? ['-h'] : ['-version'], { encoding: 'utf8' })
if (probe.error) throw new Error('Install FFmpeg to encode narration, or run on macOS with afconvert.')
async function generateArticle(article, tts) {
  const { slug } = article
  const sourceHash = narrationHash(article)
  const stem = `${slug}-${voice.replaceAll('_', '-')}-${kind}-${sourceHash.slice(0, 10)}`
  const output = resolve(directory, stem + '.m4a')
  const existing = manifest[slug]?.sourceHash === sourceHash && manifest[slug].recordings?.find(r => r.kind === kind && r.voice === voice && existsSync(resolve('public', r.src)))
  if (existing && !args.includes('--force')) { console.log('Already generated:', existing.src); return }
  console.log(`Generating: ${slug}`)
  let blocks = narrationBlocks(article)
  if (sample) blocks = blocks.slice(0, 4)
  const rate = 24000, pieces = [], chapters = []
  let length = 0
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index]
    if (block.heading) chapters.push({ title: block.heading, start: length / rate })
    for (const chunk of splitSpeech(block.text)) {
      const audio = await tts.generate(chunk, { voice, speed: 1 })
      if (audio.sampling_rate !== rate || !audio.audio.length || audio.audio.some(value => !Number.isFinite(value))) throw new Error('Invalid generated waveform')
      pieces.push(audio.audio); length += audio.audio.length
      const gap = new Float32Array(Math.round(rate * .12)); pieces.push(gap); length += gap.length
    }
    const pause = new Float32Array(Math.round(rate * (block.heading ? .5 : .25)))
    pieces.push(pause); length += pause.length
    if ((index + 1) % 5 === 0 || index + 1 === blocks.length) console.log(`${slug}: ${index + 1}/${blocks.length} blocks, ${(length / rate).toFixed(1)} seconds`)
  }
  // Write mono PCM16 WAV, then encode AAC for small, widely playable static files.
  const wav = Buffer.alloc(44 + length * 2)
  wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8)
  wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22)
  wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34)
  wav.write('data', 36); wav.writeUInt32LE(length * 2, 40)
  let offset = 44
  for (const piece of pieces) for (const value of piece) { wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value)) * 32767), offset); offset += 2 }
  const temp = resolve(directory, stem + '.tmp.wav'), encoded = resolve(directory, stem + '.tmp.m4a')
  try {
    writeFileSync(temp, wav)
    const encodingArgs = process.platform === 'darwin' ? ['-f', 'm4af', '-d', 'aac', '-b', '64000', temp, encoded] : ['-y', '-i', temp, '-c:a', 'aac', '-b:a', '64k', '-movflags', '+faststart', encoded]
    const result = spawnSync(encoder, encodingArgs, { encoding: 'utf8' })
    if (result.status !== 0) throw new Error(result.stderr || 'Audio encoding failed')
    renameSync(encoded, output)
  } finally { rmSync(temp, { force: true }); rmSync(encoded, { force: true }) }
  const previous = manifest[slug]?.sourceHash === sourceHash ? manifest[slug].recordings || [] : []
  const labels = { af_heart: 'Heart · American English', am_michael: 'Michael · American English', bf_emma: 'Emma · British English' }
  manifest[slug] = { sourceHash, model: 'Kokoro-82M-v1.0', recordings: [...previous.filter(r => !(r.kind === kind && r.voice === voice)), { kind, voice, label: labels[voice], src: 'audio/' + stem + '.m4a', duration: length / rate, chapters }] }
  if (isMainThread) saveManifest()
  else process.send({ slug, entry: manifest[slug] })
  console.log('Saved:', output)
}

function saveManifest() {
  writeFileSync(manifestPath + '.tmp', JSON.stringify(manifest, null, 2) + '\n')
  renameSync(manifestPath + '.tmp', manifestPath)
}

async function generateBatch(batch) {
  if (!batch.length) return
  const modelId = 'onnx-community/Kokoro-82M-v1.0-ONNX'
  const model = await StyleTextToSpeech2Model.from_pretrained(modelId, {
    dtype: 'q8', device: 'cpu', session_options: { intraOpNumThreads: threads },
  })
  try {
    const tts = new KokoroTTS(model, await AutoTokenizer.from_pretrained(modelId))
    for (const article of batch) await generateArticle(article, tts)
  } finally { await model.dispose() }
}

if (!isMainThread) {
  const { articles: batch } = await new Promise(resolve => process.once('message', resolve))
  await generateBatch(batch)
  process.disconnect()
} else {
  const pending = articles.filter(article => {
    const entry = manifest[article.slug]
    const current = entry?.sourceHash === narrationHash(article) && entry.recordings?.some(r => r.kind === kind && r.voice === voice && existsSync(resolve('public', r.src)))
    if (current && !args.includes('--force')) console.log('Already generated:', article.slug)
    return !current || args.includes('--force')
  })
  if (jobs === 1 || pending.length < 2) await generateBatch(pending)
  else {
    // ONNX inference blocks its JS thread, and its native bindings do not safely
    // load in worker_threads. Child processes provide isolated local CPU workers;
    // only the parent writes the manifest to prevent lost updates.
    const buckets = Array.from({ length: Math.min(jobs, pending.length) }, () => ({ articles: [], weight: 0 }))
    const weighted = pending.map(article => ({ article, weight: narrationBlocks(article).reduce((sum, b) => sum + b.text.length, 0) }))
    for (const { article, weight } of weighted.sort((a, b) => b.weight - a.weight)) {
      buckets.sort((a, b) => a.weight - b.weight)
      buckets[0].articles.push(article)
      buckets[0].weight += weight
    }
    let completed = 0
    const children = new Set()
    const stop = () => { for (const child of children) child.kill('SIGTERM'); process.exit(130) }
    process.once('SIGINT', stop)
    process.once('SIGTERM', stop)
    const results = await Promise.allSettled(buckets.map(bucket => new Promise((resolve, reject) => {
      const worker = fork(new URL(import.meta.url), [...args, '--worker'], { stdio: ['ignore', 'inherit', 'inherit', 'ipc'] })
      children.add(worker)
      worker.on('message', ({ slug, entry }) => {
        manifest[slug] = entry
        saveManifest()
        console.log(`Completed ${++completed}/${pending.length} new recordings`)
      })
      worker.send({ articles: bucket.articles })
      worker.on('error', reject)
      worker.on('exit', code => {
        children.delete(worker)
        code === 0 ? resolve() : reject(new Error(`Narration worker exited with code ${code}`))
      })
    })))
    process.removeListener('SIGINT', stop)
    process.removeListener('SIGTERM', stop)
    const failure = results.find(result => result.status === 'rejected')
    if (failure) throw failure.reason
  }
  console.log('Narration generation complete.')
}

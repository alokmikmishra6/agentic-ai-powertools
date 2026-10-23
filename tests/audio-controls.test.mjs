import test from 'node:test'
import assert from 'node:assert/strict'
import { parseHTML } from 'linkedom'
import { createServer } from 'vite'
import React, { act } from 'react'
import { audioTime, chapterSegments, chapterAtTime } from '../src/lib/audio-position.js'
import narrations from '../src/data/narration.json' with { type: 'json' }

test('integrated audio controls play, change speed, seek, resume, and recover from errors', async () => {
  const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  const { window, document } = parseHTML('<html><body><main></main></body></html>')
  // Linkedom supports input events but does not expose this browser capability flag.
  document.oninput = null
  const storage = new Map()
  const globals = { window, document, localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) }, IS_REACT_ACT_ENVIRONMENT: true }
  const previous = Object.fromEntries(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]))
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value })
  let root
  try {
    const { createRoot } = await import('react-dom/client')
    const { default: Player } = await vite.ssrLoadModule('/src/components/ArticleAudioPlayer.jsx')
    const recording = narrations['agents-need-stop-rules'].recordings[0]
    const segments = chapterSegments(recording.chapters, recording.duration)
    const key = 'field-notes-audio:' + recording.src
    storage.set(key, '45')
    root = createRoot(document.querySelector('main'))
    await act(async () => root.render(React.createElement(Player, { slug: 'agents-need-stop-rules', title: 'An essay', articleBody: '' })))
    const audio = document.querySelector('audio')
    const emit = name => audio.dispatchEvent(new window.Event(name))
    for (const [key, value] of Object.entries({ paused: true, ended: false, currentTime: 0, duration: recording.duration, readyState: 0, playbackRate: 1, volume: 1, muted: false })) Object.defineProperty(audio, key, { configurable: true, writable: true, value })
    audio.play = async () => { audio.paused = false; emit('play'); emit('playing') }
    audio.pause = () => { audio.paused = true; emit('pause') }
    audio.load = () => {}
    const click = selector => document.querySelector(selector).dispatchEvent(new window.Event('click', { bubbles: true }))
    assert.equal(document.querySelector('.narration-seek').disabled, true)
    assert.equal(document.querySelector('.narration-transport select'), null)
    assert.equal(document.querySelector('.narration-popover'), null)
    assert.equal(document.querySelector('[aria-label="Narration volume"]'), null)
    await act(async () => { audio.readyState = 1; emit('loadedmetadata') })
    assert.equal(audio.currentTime, 45)
    const bars = document.querySelectorAll('.narration-segment')
    assert.equal(bars.length, recording.chapters.length)
    assert.equal(bars[1].style.left, `${recording.chapters[1].start / recording.duration * 100}%`)
    assert.equal(document.querySelector('.narration-current-chapter').textContent, 'Introduction')
    await act(async () => click('[aria-label="Play narration"]'))
    assert.ok(document.querySelector('[aria-label="Pause narration"]'))
    await act(async () => click('.narration-speed'))
    assert.equal(document.querySelector('.narration-speed').getAttribute('aria-expanded'), 'true')
    assert.equal(document.querySelector('.narration-rate-options [aria-pressed="true"]').textContent, '1×')
    await act(async () => {
      const option = [...document.querySelectorAll('.narration-rate-options button')].find(button => button.textContent === '1.5×')
      option.dispatchEvent(new window.Event('click', { bubbles: true }))
    })
    assert.equal(audio.playbackRate, 1.5)
    assert.equal(document.querySelector('.narration-speed').textContent, '1.5×')
    assert.equal(document.querySelector('.narration-popover'), null)
    await act(async () => click('.narration-speed'))
    await act(async () => click('[aria-label="Volume controls"]'))
    assert.equal(document.querySelectorAll('.narration-popover').length, 1)
    assert.equal(document.querySelector('.narration-rate-options'), null)
    await act(async () => {
      const event = new window.Event('keydown', { bubbles: true })
      event.key = 'Escape'
      document.querySelector('[aria-label="Narration volume"]').dispatchEvent(event)
    })
    assert.equal(document.querySelector('.narration-popover'), null)
    assert.equal(document.querySelector('[aria-label="Volume controls"]').getAttribute('aria-expanded'), 'false')
    await act(async () => click('.narration-speed'))
    await act(async () => document.body.dispatchEvent(new window.Event('pointerdown', { bubbles: true })))
    assert.equal(document.querySelector('.narration-popover'), null)
    await act(async () => click('[aria-label="Pause narration"]'))
    assert.equal(audio.paused, true)
    assert.equal(storage.get(key), '45')
    assert.equal(document.querySelector('.narration-chapters'), null)
    const seek = document.querySelector('.narration-seek')
    await act(async () => {
      seek.value = String(recording.chapters[1].start)
      seek.dispatchEvent(new window.Event('input', { bubbles: true }))
    })
    assert.equal(audio.currentTime, recording.chapters[1].start)
    assert.equal(document.querySelector('.narration-current-chapter').textContent, recording.chapters[1].title)
    assert.equal(document.querySelectorAll('.narration-segment[data-current="true"]').length, 1)
    assert.equal(audio.paused, true, 'seeking while paused must not start playback')
    await act(async () => {
      seek.value = '120'
      seek.dispatchEvent(new window.Event('input', { bubbles: true }))
    })
    assert.equal(audio.currentTime, 120)
    const bounds = { left: 0, width: 300 }
    seek.getBoundingClientRect = () => bounds
    await act(async () => {
      const event = new window.Event('pointermove', { bubbles: true })
      event.clientX = 6 + (180 / recording.duration) * 288
      seek.dispatchEvent(event)
    })
    assert.ok(document.querySelector('.narration-chapter-preview').textContent.includes(chapterAtTime(segments, 180).title))
    assert.equal(document.querySelector('.narration-chapter-preview time').textContent, '3:00')
    assert.equal(audio.currentTime, 120, 'hover previews must not seek')
    assert.equal(storage.get(key), '120')
    await act(async () => click('[aria-label="Volume controls"]'))
    await act(async () => {
      const volume = document.querySelector('[aria-label="Narration volume"]')
      volume.value = '0.35'
      volume.dispatchEvent(new window.Event('input', { bubbles: true }))
      emit('volumechange')
    })
    assert.equal(audio.volume, 0.35)
    assert.ok(document.querySelector('.narration-volume-setting').textContent.includes('35%'))
    await act(async () => click('[aria-label="Mute narration"]'))
    assert.equal(audio.muted, true)
    await act(async () => emit('volumechange'))
    assert.ok(document.querySelector('[aria-label="Unmute narration"]'))
    await act(async () => { audio.currentTime = 90; emit('timeupdate') })
    assert.equal(document.querySelector('.narration-seek').getAttribute('aria-valuetext'), `1:30 of ${audioTime(recording.duration)}, ${chapterAtTime(segments, 90).title}`)
    await act(async () => click('[aria-label="Play narration"]'))
    await act(async () => { emit('error') })
    assert.ok(document.querySelector('[aria-label="Retry narration"]'))
    await act(async () => click('[aria-label="Retry narration"]'))
    assert.ok(document.querySelector('[aria-label="Pause narration"]'))
    await act(async () => { audio.ended = true; emit('ended') })
    assert.equal(storage.get(key), '0')
    assert.ok(document.querySelector('[aria-label="Play narration"]'))
  } finally {
    if (root) await act(async () => root.unmount())
    for (const [key, descriptor] of Object.entries(previous)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else delete globalThis[key]
    }
    await vite.close()
  }
})

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Voice Quality Ranking ─────────────────────────────────────────────────────
// macOS/iOS premium voices (downloaded via System Settings > Accessibility > Spoken Content)
// These are neural/high-quality voices that sound near-professional
const PREMIUM_VOICE_KEYWORDS = [
  'Premium', 'Enhanced', 'Eloquence',
  // macOS neural voices
  'Evan', 'Ava', 'Zoe', 'Allison', 'Tom',
  // macOS high-quality
  'Samantha', 'Alex', 'Karen', 'Daniel', 'Moira',
  // Windows neural voices (Edge)
  'Online', 'Neural',
  // Google Chrome built-in
  'Google US English', 'Google UK English Female', 'Google UK English Male',
]

// Common abbreviations to expand for natural reading
const ABBREVIATIONS = {
  'AI': 'A.I.',
  'ML': 'M.L.',
  'LLM': 'L.L.M.',
  'API': 'A.P.I.',
  'APIs': 'A.P.I.s',
  'UI': 'U.I.',
  'UX': 'U.X.',
  'CI': 'C.I.',
  'CD': 'C.D.',
  'TDD': 'T.D.D.',
  'RAG': 'R.A.G.',
  'MCP': 'M.C.P.',
  'IoT': 'I.o.T.',
  'SLA': 'S.L.A.',
  'SLO': 'S.L.O.',
  'AWS': 'A.W.S.',
  'GCP': 'G.C.P.',
  'CPU': 'C.P.U.',
  'GPU': 'G.P.U.',
  'YAML': 'YAML',
  'JSON': 'JSON',
  'HTTP': 'H.T.T.P.',
  'gRPC': 'G.R.P.C.',
  'DX': 'D.X.',
  'OKR': 'O.K.R.',
  'KPI': 'K.P.I.',
  'PR': 'P.R.',
  'PRs': 'P.R.s',
  'e.g.': 'for example',
  'i.e.': 'that is',
  'etc.': 'etcetera',
  'vs.': 'versus',
  'approx.': 'approximately',
}

/**
 * Enhanced Text-to-Speech audio player.
 * - Paragraph-aware chunked reading with natural pauses
 * - Premium voice auto-detection & user selection
 * - Text preprocessing for natural pronunciation
 * - Sentence-level progress tracking
 */
export default function ArticleAudioPlayer({ articleBody, title }) {
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [currentChunk, setCurrentChunk] = useState(0)

  const chunksRef = useRef([])
  const totalLengthRef = useRef(0)
  const intervalRef = useRef(null)
  const isStoppedRef = useRef(false)
  const isPausedRef = useRef(false)
  const currentChunkRef = useRef(0)
  const pauseTimeoutRef = useRef(null)

  // ─── Parse HTML into paragraph chunks ──────────────────────────────────
  const getChunks = useCallback(() => {
    if (chunksRef.current.length > 0) return chunksRef.current

    const div = document.createElement('div')
    div.innerHTML = articleBody

    const chunks = []
    // Add title as first chunk
    chunks.push({ text: preprocessText(title), type: 'heading' })

    // Walk block-level elements to create natural chunks
    const walkNodes = (parent) => {
      for (const node of parent.children) {
        const tag = node.tagName?.toLowerCase()
        const text = (node.textContent || '').trim()
        if (!text) continue

        if (tag === 'h3' || tag === 'h4' || tag === 'h5') {
          chunks.push({ text: preprocessText(text), type: 'heading' })
        } else if (tag === 'ul' || tag === 'ol') {
          // Read list items individually with short pauses
          for (const li of node.querySelectorAll('li')) {
            const liText = (li.textContent || '').trim()
            if (liText) chunks.push({ text: preprocessText(liText), type: 'list-item' })
          }
        } else if (tag === 'blockquote') {
          chunks.push({ text: preprocessText(text), type: 'quote' })
        } else if (tag === 'pre' || tag === 'code') {
          // Skip code blocks — they don't read well
          chunks.push({ text: 'Code block skipped.', type: 'code' })
        } else if (tag === 'div' && node.children.length > 0) {
          walkNodes(node)
        } else {
          // Paragraph or other block — split long ones into sentences
          const sentences = splitIntoSentences(preprocessText(text))
          if (sentences.length > 4) {
            // Group sentences into ~3 sentence chunks for natural pacing
            for (let i = 0; i < sentences.length; i += 3) {
              const group = sentences.slice(i, i + 3).join(' ')
              chunks.push({ text: group, type: 'paragraph' })
            }
          } else {
            chunks.push({ text: preprocessText(text), type: 'paragraph' })
          }
        }
      }
    }

    // If body has block-level children, walk them; otherwise treat as single text
    if (div.children.length > 0) {
      walkNodes(div)
    } else {
      const plainText = preprocessText(div.textContent || '')
      const sentences = splitIntoSentences(plainText)
      for (let i = 0; i < sentences.length; i += 3) {
        chunks.push({ text: sentences.slice(i, i + 3).join(' '), type: 'paragraph' })
      }
    }

    chunksRef.current = chunks
    totalLengthRef.current = chunks.reduce((sum, c) => sum + c.text.length, 0)
    return chunks
  }, [articleBody, title])

  // ─── Text preprocessing ────────────────────────────────────────────────
  function preprocessText(text) {
    let processed = text
    // Expand abbreviations (whole-word match)
    for (const [abbr, expansion] of Object.entries(ABBREVIATIONS)) {
      processed = processed.replace(new RegExp(`\\b${escapeRegex(abbr)}\\b`, 'g'), expansion)
    }
    // Clean up artifacts
    processed = processed
      .replace(/—/g, ' — ')           // Add space around em-dashes for pause
      .replace(/\s+/g, ' ')            // Collapse whitespace
      .replace(/\(\s*\)/g, '')         // Remove empty parens
      .replace(/[""]/g, '"')           // Normalize quotes
      .replace(/['']/g, "'")
      .replace(/\.{3,}/g, '...')       // Normalize ellipsis
      .replace(/(\d+)%/g, '$1 percent') // Read percentages naturally
      .replace(/(\d+)x\b/g, '$1 times') // 10x → 10 times
      .replace(/\b(\d+)k\b/gi, '$1 thousand')
      .replace(/\b(\d+)ms\b/g, '$1 milliseconds')
      .trim()
    return processed
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function splitIntoSentences(text) {
    return text
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.trim().length > 0)
  }

  // ─── Voice management ──────────────────────────────────────────────────
  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis?.getVoices() || []
      const english = available.filter(v => v.lang.startsWith('en'))
      if (english.length > 0) {
        // Sort: premium first, then by name
        const scored = english.map(v => ({
          voice: v,
          score: getVoiceQualityScore(v),
        })).sort((a, b) => b.score - a.score)

        setVoices(scored.map(s => s.voice))
        // Auto-select best voice
        if (!selectedVoice) setSelectedVoice(scored[0].voice)
      }
    }
    loadVoices()
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices)
  }, [])

  function getVoiceQualityScore(voice) {
    let score = 0
    const name = voice.name
    // Premium/Enhanced keyword match
    if (PREMIUM_VOICE_KEYWORDS.some(kw => name.includes(kw))) score += 10
    // Prefer non-local (network) voices — they're usually higher quality
    if (!voice.localService) score += 5
    // Prefer en-US over other dialects (most content is US English)
    if (voice.lang === 'en-US') score += 3
    if (voice.lang === 'en-GB') score += 2
    return score
  }

  // ─── Cleanup ───────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
      clearKeepAlive()
      stopProgressTimer()
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    }
  }, [])

  // ─── Pause on tab/page switch ─────────────────────────────────────────
  const isPlayingRef = useRef(false)
  useEffect(() => { isPlayingRef.current = playing && !paused }, [playing, paused])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isPlayingRef.current) {
        // Tab became hidden while actively speaking → force stop
        window.speechSynthesis?.cancel()
        clearKeepAlive()
        stopProgressTimer()
        if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
        isPausedRef.current = true
        setPaused(true)
        setPlaying(true)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  const clearKeepAlive = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startKeepAlive = () => {
    clearKeepAlive()
    // Chrome stops speaking after ~15s; workaround: pause/resume periodically
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent)
    if (!isChrome) return // Only needed for Chrome
    intervalRef.current = setInterval(() => {
      if (isPausedRef.current || isStoppedRef.current) return
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
      }
    }, 10000)
  }

  // ─── Timer-based progress tracking (cross-browser reliable) ────────────
  const progressTimerRef = useRef(null)
  const chunkStartTimeRef = useRef(0)
  const chunkDurationRef = useRef(0)
  const chunkProgressBaseRef = useRef(0)

  const startProgressTimer = (chunkIndex) => {
    stopProgressTimer()
    const chunks = chunksRef.current
    if (!chunks.length) return

    // Calculate base progress (all previous chunks)
    const baseChars = chunks.slice(0, chunkIndex).reduce((s, c) => s + c.text.length, 0)
    const chunkChars = chunks[chunkIndex].text.length
    const basePct = (baseChars / totalLengthRef.current) * 100
    const chunkPctRange = (chunkChars / totalLengthRef.current) * 100

    // Estimate speaking duration: ~150 words/min at speed 1, adjusted for rate
    const wordCount = chunks[chunkIndex].text.split(/\s+/).length
    const durationMs = (wordCount / (150 * speed)) * 60 * 1000

    chunkStartTimeRef.current = Date.now()
    chunkDurationRef.current = durationMs
    chunkProgressBaseRef.current = basePct

    progressTimerRef.current = setInterval(() => {
      if (isPausedRef.current || isStoppedRef.current) return
      const elapsed = Date.now() - chunkStartTimeRef.current
      const chunkPct = Math.min(elapsed / durationMs, 1)
      const totalPct = basePct + chunkPct * chunkPctRange
      setProgress(Math.min(totalPct, 99))
    }, 200)
  }

  const stopProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
  }

  // ─── Chunked speech engine ─────────────────────────────────────────────
  const speakChunk = useCallback((index) => {
    const chunks = getChunks()
    if (index >= chunks.length || isStoppedRef.current) {
      setPlaying(false)
      setPaused(false)
      isPausedRef.current = false
      setProgress(100)
      setCurrentChunk(0)
      currentChunkRef.current = 0
      clearKeepAlive()
      stopProgressTimer()
      setTimeout(() => setProgress(0), 2000)
      return
    }

    // Don't start next chunk if user paused
    if (isPausedRef.current) return

    const chunk = chunks[index]
    setCurrentChunk(index)
    currentChunkRef.current = index

    const utterance = new SpeechSynthesisUtterance(chunk.text)
    utterance.voice = selectedVoice
    utterance.rate = speed

    // Vary pitch slightly for headings (sounds more natural/expressive)
    if (chunk.type === 'heading') {
      utterance.pitch = 1.05
      utterance.rate = speed * 0.9
    } else if (chunk.type === 'quote') {
      utterance.pitch = 0.95
    } else {
      utterance.pitch = 1.0
    }

    // Use onboundary for precise progress when available (Safari, Edge)
    // Falls back to timer-based progress (Chrome)
    const chunkStartLen = chunks.slice(0, index).reduce((s, c) => s + c.text.length, 0)
    let boundaryFired = false
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        boundaryFired = true
        const globalPos = chunkStartLen + e.charIndex
        setProgress(Math.min((globalPos / totalLengthRef.current) * 100, 99))
      }
    }

    utterance.onend = () => {
      stopProgressTimer()
      // Do NOT advance if user paused or stopped
      if (isPausedRef.current || isStoppedRef.current) return

      // Update progress to end of this chunk
      const endPct = ((chunkStartLen + chunk.text.length) / totalLengthRef.current) * 100
      setProgress(Math.min(endPct, 99))

      // Add a natural pause between chunks
      const pause = chunk.type === 'heading' ? 600 : chunk.type === 'list-item' ? 200 : 350
      pauseTimeoutRef.current = setTimeout(() => {
        if (!isPausedRef.current && !isStoppedRef.current) {
          speakChunk(index + 1)
        }
      }, pause / speed)
    }

    utterance.onerror = (e) => {
      stopProgressTimer()
      if (e.error !== 'canceled' && !isStoppedRef.current && !isPausedRef.current) {
        setTimeout(() => speakChunk(index + 1), 100)
      }
    }

    // Start speaking
    window.speechSynthesis.speak(utterance)
    startKeepAlive()

    // Start timer-based progress — after a short delay, check if onboundary fires
    // If it does, the timer becomes redundant (but won't conflict since both set progress)
    startProgressTimer(index)
  }, [getChunks, selectedVoice, speed])

  const startSpeech = () => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    isStoppedRef.current = false
    isPausedRef.current = false
    setPlaying(true)
    setPaused(false)
    setProgress(0)
    speakChunk(0)
  }

  const togglePlay = () => {
    if (!window.speechSynthesis) return

    if (playing && !paused) {
      // ─── PAUSE ─────────────────────────────────────────────────────────
      // Use cancel() instead of pause() — works reliably across all browsers
      isPausedRef.current = true
      clearKeepAlive()
      stopProgressTimer()
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
        pauseTimeoutRef.current = null
      }
      window.speechSynthesis.cancel()
      setPaused(true)
    } else if (playing && paused) {
      // ─── RESUME ────────────────────────────────────────────────────────
      // Since we used cancel(), resume by restarting the current chunk
      isPausedRef.current = false
      isStoppedRef.current = false
      setPaused(false)
      speakChunk(currentChunkRef.current)
    } else {
      startSpeech()
    }
  }

  const stop = () => {
    isStoppedRef.current = true
    isPausedRef.current = false
    clearKeepAlive()
    stopProgressTimer()
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current)
      pauseTimeoutRef.current = null
    }
    window.speechSynthesis?.cancel()
    setPlaying(false)
    setPaused(false)
    setProgress(0)
    setCurrentChunk(0)
    currentChunkRef.current = 0
  }

  const changeSpeed = () => {
    const speeds = [0.8, 1, 1.2, 1.5, 1.8]
    const idx = speeds.indexOf(speed)
    const next = speeds[(idx + 1) % speeds.length]
    setSpeed(next)
    // If playing, restart current chunk at new speed
    if (playing && !isPausedRef.current) {
      window.speechSynthesis.cancel()
      isStoppedRef.current = false
      stopProgressTimer()
      setTimeout(() => speakChunk(currentChunkRef.current), 50)
    }
  }

  // ─── Seek: click on progress bar to jump to a chunk ────────────────────
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const pct = Math.max(0, Math.min(clickX / rect.width, 1))

    const chunks = getChunks()
    const targetCharPos = pct * totalLengthRef.current

    // Find which chunk corresponds to this position
    let accumulated = 0
    let targetIdx = 0
    for (let i = 0; i < chunks.length; i++) {
      accumulated += chunks[i].text.length
      if (accumulated >= targetCharPos) {
        targetIdx = i
        break
      }
    }

    // Update progress immediately
    setProgress(pct * 100)

    // If playing, cancel and restart from target chunk
    if (playing) {
      isPausedRef.current = false
      clearKeepAlive()
      stopProgressTimer()
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
      window.speechSynthesis.cancel()
      isStoppedRef.current = false
      setPaused(false)
      setTimeout(() => speakChunk(targetIdx), 50)
    } else {
      // Not playing yet — set the start position and begin
      isStoppedRef.current = false
      isPausedRef.current = false
      setPlaying(true)
      setPaused(false)
      speakChunk(targetIdx)
    }
  }

  // Don't render if Speech API unavailable
  if (!window.speechSynthesis) return null

  const chunks = getChunks()
  const totalWords = chunks.reduce((sum, c) => sum + c.text.split(/\s+/).length, 0)
  const totalMinutes = Math.ceil(totalWords / (150 * speed))
  const elapsedMinutes = Math.floor(totalMinutes * (progress / 100))
  const remainingMinutes = Math.max(1, totalMinutes - elapsedMinutes)

  // Dynamic time display based on state
  const timeDisplay = playing
    ? paused
      ? `${elapsedMinutes}:${String(Math.round((totalMinutes * (progress / 100) - elapsedMinutes) * 60)).padStart(2, '0')} / ${totalMinutes} min`
      : `${remainingMinutes} min left`
    : `~${totalMinutes} min at ${speed}×`

  return (
    <div className="audio-player">
      <div className="audio-player-inner">
        <button
          className={`audio-btn audio-btn-play ${playing && !paused ? 'playing' : ''}`}
          onClick={togglePlay}
          aria-label={playing && !paused ? 'Pause' : 'Play'}
          title={playing && !paused ? 'Pause reading' : 'Listen to article'}
        >
          {playing && !paused ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <div className="audio-info">
          <span className="audio-label">
            {playing ? (paused ? 'Paused' : 'Playing') : 'Listen to this article'}
          </span>
          <span className="audio-time">{timeDisplay}</span>
        </div>

        <div className="audio-progress-track" onClick={handleSeek} title="Click to seek">
          <div className="audio-progress-fill" style={{ width: `${progress}%` }} />
          <div className="audio-progress-thumb" style={{ left: `${progress}%` }} />
        </div>

        <button
          className="audio-btn audio-btn-speed"
          onClick={changeSpeed}
          title="Change speed"
        >
          {speed}×
        </button>

        {playing && (
          <button
            className="audio-btn audio-btn-stop"
            onClick={stop}
            title="Stop"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import BrowserAudioPlayer from './BrowserAudioPlayer'
import narrations from '../data/narration.json'
import { audioTime, safeAudioPosition, chapterSegments, chapterAtTime } from '../lib/audio-position'

function RecordedAudio({ recording, title, remember = false }) {
  const audioRef = useRef(null)
  const restored = useRef(false)
  const lastSaved = useRef(0)
  const [speed, setSpeed] = useState(1)
  const [error, setError] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(recording.duration)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [loadedMetadata, setLoadedMetadata] = useState(false)
  const [hoverTime, setHoverTime] = useState(null)
  const [seekFocused, setSeekFocused] = useState(false)
  const [openControl, setOpenControl] = useState(null)
  const controlsRef = useRef(null)
  const panelRef = useRef(null)
  const speedButtonRef = useRef(null)
  const volumeButtonRef = useRef(null)
  const controlId = useId()
  const mounted = useRef(true)
  const storageKey = 'field-notes-audio:' + recording.src
  function savePosition(force = false) {
    const audio = audioRef.current
    if (!remember || !restored.current || !audio || (!force && Date.now() - lastSaved.current < 5000)) return
    try {
      localStorage.setItem(storageKey, String(audio.ended ? 0 : audio.currentTime))
      lastSaved.current = Date.now()
    } catch { /* Playback still works when browser storage is unavailable. */ }
  }
  useEffect(() => {
    mounted.current = true
    const audio = audioRef.current
    const save = () => savePosition(true)
    window.addEventListener('pagehide', save)
    return () => {
      mounted.current = false
      window.removeEventListener('pagehide', save)
      if (remember && restored.current && audio) {
        try { localStorage.setItem(storageKey, String(audio.ended ? 0 : audio.currentTime)) } catch { /* Optional storage. */ }
      }
      audio?.pause()
    }
  }, [storageKey, remember])
  useEffect(() => {
    if (!openControl) return
    const outside = event => { if (!controlsRef.current?.contains(event.target)) setOpenControl(null) }
    document.addEventListener('pointerdown', outside)
    panelRef.current?.querySelector(openControl === 'speed' ? '[aria-pressed="true"]' : 'input')?.focus()
    return () => document.removeEventListener('pointerdown', outside)
  }, [openControl])
  function closeControl(restoreFocus = false) {
    if (restoreFocus) (openControl === 'speed' ? speedButtonRef : volumeButtonRef).current?.focus()
    setOpenControl(null)
  }
  function loaded() {
    const audio = audioRef.current
    setError(false)
    audio.playbackRate = speed
    if (remember && !restored.current) {
      try { audio.currentTime = safeAudioPosition(localStorage.getItem(storageKey), audio.duration) } catch { /* Optional resume. */ }
    }
    restored.current = true
    setLoadedMetadata(true)
    setDuration(Number.isFinite(audio.duration) ? audio.duration : recording.duration)
    setPosition(audio.currentTime)
  }
  function play(event) {
    setPlaying(true)
    // Keep narration and the device reader from overlapping.
    document.querySelectorAll('audio[data-article-narration]').forEach(audio => {
      if (audio !== event.currentTarget) audio.pause()
    })
    window.speechSynthesis?.cancel()
  }
  function seek(value) {
    const audio = audioRef.current
    if (audio?.readyState >= 1) {
      audio.currentTime = Math.max(0, Math.min(duration, Number(value)))
      setPosition(audio.currentTime)
      savePosition(true)
    }
  }
  async function togglePlayback() {
    const audio = audioRef.current
    if (!audio.paused && !error) { audio.pause(); return }
    if (error) { setError(false); audio.load() }
    setBuffering(true)
    try { await audio.play() }
    catch (reason) {
      if (!mounted.current || reason.name === 'AbortError') return
      setError(true); setPlaying(false); setBuffering(false)
    }
  }
  function failed() { setError(true); setPlaying(false); setBuffering(false) }
  const segments = useMemo(() => chapterSegments(recording.chapters, duration), [recording.chapters, duration])
  const activeChapter = chapterAtTime(segments, position)
  const previewTime = hoverTime ?? position
  const previewChapter = chapterAtTime(segments, previewTime)
  function preview(event) {
    // Native range thumb centres travel between six-pixel insets, like the bars.
    const bounds = event.currentTarget.getBoundingClientRect()
    const fraction = (event.clientX - bounds.left - 6) / Math.max(1, bounds.width - 12)
    setHoverTime(Math.max(0, Math.min(duration, fraction * duration)))
  }

  return <div className="recorded-audio">
    <audio ref={audioRef} data-article-narration hidden preload="none" src={import.meta.env.BASE_URL + recording.src}
      onLoadedMetadata={loaded} onPlay={play} onPlaying={() => setBuffering(false)} onWaiting={() => { if (!audioRef.current.paused) setBuffering(true) }}
      onPause={() => { setPlaying(false); setBuffering(false); savePosition(true) }}
      onTimeUpdate={() => { setPosition(audioRef.current.currentTime); savePosition() }}
      onEnded={() => { setPlaying(false); setBuffering(false); savePosition(true) }} onError={failed}
      onVolumeChange={() => { setMuted(audioRef.current.muted); setVolume(audioRef.current.volume) }} />
    <div className="narration-transport" role="group" aria-label={`Listen to: ${title}`}>
      <button className="narration-play" type="button" aria-label={playing ? 'Pause narration' : error ? 'Retry narration' : 'Play narration'} onClick={togglePlayback}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">{playing ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="m8 4 12 8-12 8z" />}</svg>
      </button>
      <div className="narration-timeline">
        <div className="narration-scrubber">
          <div className="narration-segments" aria-hidden="true">{segments.map(segment => <span key={segment.start} className="narration-segment" data-current={segment.start === activeChapter?.start} style={{ left: `${segment.left}%`, width: `${segment.width}%` }}><span className="narration-segment-track"><span style={{ width: `${Math.max(0, Math.min(100, (position - segment.start) / (segment.end - segment.start) * 100))}%` }} /></span></span>)}</div>
          <input className="narration-seek" type="range" min="0" max={duration} step="0.1" value={position} disabled={!loadedMetadata || error} aria-label="Seek narration" aria-valuetext={`${audioTime(position)} of ${audioTime(duration)}${activeChapter ? `, ${activeChapter.title}` : ''}`} onInput={event => seek(event.target.value)} onPointerMove={preview} onPointerUp={event => { if (event.pointerType !== 'mouse') { setHoverTime(null); setSeekFocused(false) } }} onKeyDown={() => setSeekFocused(true)} onPointerLeave={() => setHoverTime(null)} onFocus={() => setSeekFocused(true)} onBlur={() => { setSeekFocused(false); setHoverTime(null) }} />
          {(hoverTime !== null || seekFocused) && previewChapter && <span className="narration-chapter-preview" aria-hidden="true"><span>{previewChapter.title}</span><time>{audioTime(previewTime)}</time></span>}
        </div>
        <div className="narration-timing"><span>{audioTime(position)}</span><span className="narration-current-chapter" title={activeChapter?.title}>{activeChapter?.title}</span><span>{audioTime(duration)}</span></div>
      </div>
      <div className="narration-utilities" ref={controlsRef}
        onKeyDown={event => { if (event.key === 'Escape' && openControl) { event.preventDefault(); event.stopPropagation(); closeControl(true) } }}
        onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) closeControl() }}>
        <button ref={speedButtonRef} className="narration-utility narration-speed" type="button" aria-label={`Playback speed: ${speed}×`} title="Playback speed" aria-expanded={openControl === 'speed'} aria-controls={`${controlId}-speed`} onClick={() => setOpenControl(openControl === 'speed' ? null : 'speed')}>{speed}×</button>
        <button ref={volumeButtonRef} className="narration-utility narration-volume" type="button" aria-label="Volume controls" title="Volume" aria-expanded={openControl === 'volume'} aria-controls={`${controlId}-volume`} onClick={() => setOpenControl(openControl === 'volume' ? null : 'volume')}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M11 4 6 8H3v8h3l5 4z" />{muted || volume === 0 ? <path d="m16 9 6 6m0-6-6 6" /> : <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></>}</svg>
        </button>
        {openControl === 'speed' && <div ref={panelRef} id={`${controlId}-speed`} className="narration-popover" role="group" aria-label="Playback speed">
          <span className="narration-popover-title">Playback speed</span>
          <div className="narration-rate-options">{[.8, 1, 1.25, 1.5, 1.75, 2].map(rate => <button type="button" key={rate} aria-pressed={speed === rate} onClick={() => { setSpeed(rate); audioRef.current.playbackRate = rate; closeControl(true) }}>{rate}×</button>)}</div>
        </div>}
        {openControl === 'volume' && <div ref={panelRef} id={`${controlId}-volume`} className="narration-popover" role="group" aria-label="Volume">
          <label className="narration-volume-setting"><span className="narration-popover-title">Volume <span>{Math.round((muted ? 0 : volume) * 100)}%</span></span><input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume} aria-label="Narration volume" onInput={event => { const audio = audioRef.current; audio.volume = Number(event.target.value); audio.muted = false }} /></label>
          <button type="button" className="narration-mute" aria-label={muted || volume === 0 ? 'Unmute narration' : 'Mute narration'} onClick={() => { const audio = audioRef.current; audio.muted = !(audio.muted || audio.volume === 0); if (!audio.muted && audio.volume === 0) audio.volume = 1 }}>{muted || volume === 0 ? 'Unmute' : 'Mute'}</button>
        </div>}
      </div>
    </div>
    <span className="sr-only" role="status">{error ? 'This recording could not load. Use Retry narration to try again.' : buffering ? 'Loading audio…' : ''}</span>
    {error && <p>This recording could not load. Press play to retry.</p>}
  </div>
}

export default function ArticleAudioPlayer({ slug, articleBody, title }) {
  const entry = narrations[slug]
  const full = entry?.recordings.find(recording => recording.kind === 'full' && recording.voice === 'af_heart')
  if (!full) return <BrowserAudioPlayer articleBody={articleBody} title={title} />
  return <section className="narration-player" aria-label="Article narration">
    <div className="narration-heading"><div><span className="journal-kicker">Listen to this essay</span><h2>A voice for the notebook.</h2></div></div>
    <RecordedAudio key={full.src} recording={full} title={title} remember />
  </section>
}

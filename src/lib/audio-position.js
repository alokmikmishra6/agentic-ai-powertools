export function safeAudioPosition(value, duration) {
  const position = Number(value)
  return Number.isFinite(position) && Number.isFinite(duration) && position > 0 && position < duration - 2 ? position : 0
}
export function audioTime(value) {
  const seconds = Math.max(0, Math.floor(Number(value) || 0))
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

// Keep segment boundaries in seconds so changing playback speed never moves them.
export function chapterSegments(chapters = [], duration) {
  if (!Number.isFinite(duration) || duration <= 0) return []
  const ordered = chapters.filter(chapter => Number.isFinite(chapter.start) && chapter.start >= 0 && chapter.start < duration)
    .map(chapter => ({ ...chapter })).sort((a, b) => a.start - b.start)
    .filter((chapter, index, all) => index === 0 || chapter.start !== all[index - 1].start)
  if (ordered[0]?.start !== 0) ordered.unshift({ title: 'Introduction', start: 0 })
  return ordered.map((chapter, index) => {
    const end = ordered[index + 1]?.start ?? duration
    return { title: index === 0 ? 'Introduction' : chapter.title, start: chapter.start, end, left: chapter.start / duration * 100, width: (end - chapter.start) / duration * 100 }
  })
}

export function chapterAtTime(segments, time) {
  return segments.findLast(segment => segment.start <= time) || segments[0]
}

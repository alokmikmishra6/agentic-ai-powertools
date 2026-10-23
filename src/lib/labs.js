export function recoveryTrace(failureStep, checkpoint) {
  const failure = Math.max(1, Math.min(5, Number(failureStep) || 1))
  const before = Array.from({ length: failure }, (_, i) => i + 1)
  const after = Array.from({ length: checkpoint ? 6 - failure : 5 }, (_, i) => (checkpoint ? failure : 1) + i)
  return { before, after, attempts: before.length + after.length, repeatedCompleted: checkpoint ? 0 : failure - 1 }
}
export function chunkWords(text, size, overlap) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const length = Math.max(1, Math.floor(Number(size) || 1))
  const shared = Math.max(0, Math.min(length - 1, Math.floor(Number(overlap) || 0)))
  const chunks = []
  for (let start = 0; start < words.length; start += length - shared) {
    chunks.push({ start, words: words.slice(start, start + length), shared: start ? Math.min(shared, words.length - start) : 0 })
    if (start + length >= words.length) break
  }
  return chunks
}
export function tokenBudget({ requests, input, output, inputRate, outputRate, cache }) {
  const n = v => Math.max(0, Number(v) || 0)
  const fraction = Math.min(1, n(cache) / 100)
  const baseline = n(requests) * (n(input) * n(inputRate) + n(output) * n(outputRate)) / 1e6
  const daily = n(requests) * (n(input) * (1 - fraction) * n(inputRate) + n(output) * n(outputRate)) / 1e6
  return { baseline, daily, monthly: daily * 30, saved: baseline - daily }
}

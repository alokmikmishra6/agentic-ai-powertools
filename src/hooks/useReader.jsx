import { useSyncExternalStore } from 'react'
import { EMPTY_READER, normalizeReader, updateReader } from '../lib/reader'
const KEY = 'field-notes-reader-v1'
let snapshot = null
const listeners = new Set()
function read() {
  if (snapshot) return snapshot
  try { snapshot = normalizeReader(JSON.parse(window.localStorage.getItem(KEY))) }
  catch { snapshot = normalizeReader(null) }
  return snapshot
}
function emit() { listeners.forEach(listener => listener()) }
function onStorage(event) { if (event.key === KEY || event.key === null) { snapshot = null; emit() } }
function subscribe(listener) {
  listeners.add(listener)
  if (listeners.size === 1) window.addEventListener('storage', onStorage)
  return () => { listeners.delete(listener); if (!listeners.size) window.removeEventListener('storage', onStorage) }
}
export function readerAction(action) {
  snapshot = updateReader(read(), action)
  try { window.localStorage.setItem(KEY, JSON.stringify(snapshot)) } catch { /* Keep session functionality when storage is unavailable. */ }
  emit()
}
export const useReader = () => useSyncExternalStore(subscribe, read, () => EMPTY_READER)

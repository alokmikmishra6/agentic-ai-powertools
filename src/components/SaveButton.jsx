import { readerAction, useReader } from '../hooks/useReader'
export default function SaveButton({ slug, title }) {
  const reader = useReader()
  const saved = reader.saved.includes(slug)
  return <button className="save-essay" aria-pressed={saved} aria-label={`${saved ? 'Unsave' : 'Save'} ${title}`} onClick={() => readerAction({ type: 'save', slug })}><svg aria-hidden="true" width="14" height="17" viewBox="0 0 14 17" fill={saved ? 'currentColor' : 'none'} stroke="currentColor"><path d="M2 1h10v14l-5-3-5 3z" /></svg>{saved ? 'Saved' : 'Save essay'}</button>
}

import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const ITEMS = [{ label: 'Writing', to: '/writing' }, { label: 'Showcase', to: '/showcase' }, { label: 'Labs', to: '/labs' }, { label: 'Thinking', to: '/thinking' }, { label: 'About', to: '/about' }]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const location = useLocation()
  useEffect(() => setOpen(false), [location])
  useEffect(() => {
    const close = event => {
      if (event.key === 'Escape' && open) { setOpen(false); menuRef.current?.focus() }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])
  const search = () => { setOpen(false); window.dispatchEvent(new Event('journal:search')) }
  return (
    <>
      <a href="#main-content" className="skip-link" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus() }}>Skip to content</a>
      <header className="journal-header">
        <nav className="journal-nav journal-container" aria-label="Main navigation">
          <Link to="/" className="journal-brand" aria-label="Alok Mishra home"><span className="journal-brand-mark">am<span>.</span></span><span>ALOK MISHRA<small>FIELD NOTES</small></span></Link>
          <div className="journal-nav-links">{ITEMS.map(item => <NavLink key={item.to} to={item.to}>{item.label}</NavLink>)}</div>
          <div className="journal-nav-actions"><Link to="/saved" className="nav-saved" aria-label="Saved essays">Saved</Link><button className="journal-search-trigger" onClick={search} aria-label="Search writing and projects"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="m15 15 5 5" /></svg><span>Search</span><kbd>⌘ K</kbd></button><Link className="journal-nav-subscribe" to="/?scrollTo=subscribe">Subscribe <span aria-hidden="true">↗</span></Link><button ref={menuRef} className="journal-menu-button" aria-expanded={open} aria-controls="journal-mobile-menu" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '×' : '☰'}</span></button></div>
        </nav>
        {open && <nav id="journal-mobile-menu" className="journal-mobile-menu" aria-label="Mobile navigation">{ITEMS.map(item => <NavLink key={item.to} to={item.to}>{item.label}<span aria-hidden="true">↗</span></NavLink>)}<Link to="/?scrollTo=subscribe">Subscribe <span aria-hidden="true">↗</span></Link></nav>}
      </header>
    </>
  )
}

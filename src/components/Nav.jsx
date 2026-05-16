import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'About', href: '/#about' },
  { label: 'Philosophy', href: '/#philosophy' },
  { label: 'Domains', href: '/#domains' },
  { label: 'Showcase', href: '/showcase' },
  { label: 'Thinking', href: '/thinking' },
  { label: 'Writing', href: '/writing' },
  { label: 'Connect', href: '/#connect' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
  }, [location])

  const handleNav = (item, e) => {
    if (item.href.startsWith('/#')) {
      const sectionId = item.href.slice(2)
      if (location.pathname === '/') {
        e.preventDefault()
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setDrawerOpen(false)
  }

  const isActive = (item) => {
    if (item.href.startsWith('/#')) return false
    return location.pathname === item.href
  }

  const renderLink = (item) => {
    if (item.href.startsWith('/#')) {
      const sectionId = item.href.slice(2)
      if (location.pathname === '/') {
        return (
          <a
            key={item.label}
            href={`#${sectionId}`}
            onClick={(e) => handleNav(item, e)}
          >
            {item.label}
          </a>
        )
      }
      // On sub-pages, navigate to home then scroll
      return (
        <Link
          key={item.label}
          to={`/${sectionId ? `?scrollTo=${sectionId}` : ''}`}
          onClick={() => setDrawerOpen(false)}
        >
          {item.label}
        </Link>
      )
    }
    return (
      <Link
        key={item.label}
        to={item.href}
        className={isActive(item) ? 'active' : ''}
      >
        {item.label}
      </Link>
    )
  }

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className="nav-logo" />
            Alok Mishra
          </Link>
          <ul className="nav-links">
            {NAV_ITEMS.map(item => (
              <li key={item.label}>{renderLink(item)}</li>
            ))}
          </ul>
          <button
            className="nav-burger"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`nav-drawer ${drawerOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setDrawerOpen(false)}>Home</Link>
        {NAV_ITEMS.map(item => (
          <span key={item.label}>{renderLink(item)}</span>
        ))}
      </div>
    </>
  )
}

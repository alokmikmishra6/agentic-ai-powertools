import { Link } from 'react-router-dom'

export default function Footer() {
  const scrollToSection = (id) => (e) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.hash = `#/?scrollTo=${id}`
    }
  }

  return (
    <footer className="footer-wrap">
      <div className="footer">
        <small>© 2026 Alok Mishra. All rights reserved.</small>
        <ul className="footer-links">
          <li><a href="#/" onClick={scrollToSection('about')}>About</a></li>
          <li><a href="#/" onClick={scrollToSection('philosophy')}>Philosophy</a></li>
          <li><Link to="/showcase">Showcase</Link></li>
          <li><Link to="/thinking">Thinking</Link></li>
          <li><Link to="/writing">Writing</Link></li>
        </ul>
      </div>
    </footer>
  )
}

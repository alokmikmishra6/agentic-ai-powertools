import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer-wrap">
      <div className="footer">
        <small>© 2026 Alok Mishra. All rights reserved.</small>
        <ul className="footer-links">
          <li><Link to="/about">About</Link></li>
          <li><Link to="/showcase">Showcase</Link></li>
          <li><Link to="/thinking">Thinking</Link></li>
          <li><Link to="/writing">Writing</Link></li>
        </ul>
      </div>
    </footer>
  )
}

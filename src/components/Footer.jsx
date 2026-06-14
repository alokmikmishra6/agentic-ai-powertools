import { Link } from 'react-router-dom'
import Subscribe from './Subscribe'

export default function Footer() {
  return (
    <footer className="footer-wrap">
      <div className="footer">
        <div className="footer-subscribe">
          <Subscribe compact source="site-footer" />
        </div>
        <div className="footer-bottom">
          <small>© 2026 Alok Mishra. All rights reserved.</small>
          <ul className="footer-links">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/showcase">Showcase</Link></li>
            <li><Link to="/thinking">Thinking</Link></li>
            <li><Link to="/writing">Writing</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
export default function Footer() {
  return <footer className="journal-footer"><div className="journal-container">
    <div className="journal-footer-top"><Link to="/" className="journal-brand-mark">am<span>.</span></Link><p>Stay curious.<br /><span>Build with intention.</span></p><nav aria-label="Footer navigation"><Link to="/writing">Writing</Link><Link to="/showcase">Showcase</Link><Link to="/saved">Saved</Link><Link to="/labs">Labs</Link><a href={`${import.meta.env.BASE_URL}feed.xml`}>RSS ↗</a></nav></div>
    <div className="journal-footer-bottom"><span>© {new Date().getFullYear()} Alok Mishra</span><span>Independent thoughts on an interconnected world.</span><Link to="/?scrollTo=subscribe">Get the next essay ↗</Link></div>
  </div></footer>
}

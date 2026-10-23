import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ARTICLES } from '../data/index'
import { TOPICS, findArticles, topicPath } from '../lib/articles'
import TopicAtlas from '../components/TopicAtlas'
import ArticleCard from '../components/ArticleCard'
import GenerativeCover from '../components/GenerativeCover'
import Subscribe from '../components/Subscribe'
import KnowledgeMap from '../components/KnowledgeMap'
import ReadingJourneys from '../components/ReadingJourneys'

export default function Home() {
  const { search } = useLocation()
  const articles = findArticles(ARTICLES)
  const featured = articles.find(a => a.featured) || articles[0]
  const latest = articles.filter(a => a.slug !== featured?.slug).slice(0, 3)
  useEffect(() => {
    const section = new URLSearchParams(search).get('scrollTo')
    if (section) document.getElementById(section)?.scrollIntoView()
  }, [search])

  return (
    <div className="journal-home">
      <section className="journal-hero journal-container">
        <div className="journal-hero-copy">
          <div className="journal-kicker"><span className="status-spark" /> Independent thinking. Built on experience.</div>
          <h1>Notes on<br />building<br /><em>intelligence.</em></h1>
          <p>Field notes on AI, software architecture, and the craft of building systems that endure.</p>
          <div className="journal-hero-actions"><Link className="journal-button" to="/writing">Explore the writing <span aria-hidden="true">→</span></Link><Link className="journal-text-link" to="/about">Meet the author <span aria-hidden="true">→</span></Link></div>
          <div className="journal-byline"><span className="journal-monogram" aria-hidden="true">am.</span><div><strong>Alok Mishra</strong><span>Architect by profession. Curious by nature.</span></div></div>
        </div>
        <TopicAtlas />
        <div className="journal-hero-foot"><span>Ideas from the field, not the sidelines.</span><Link to="/writing">{ARTICLES.length} essays & counting <span aria-hidden="true">→</span></Link></div>
      </section>

      {featured && <section className="journal-section journal-container" aria-labelledby="featured-title">
        <div className="journal-section-heading"><span className="journal-kicker">01 / The featured essay</span><span className="journal-side-note">An idea worth spending time with</span></div>
        <Link to={`/writing/${featured.slug}`} className="journal-feature">
          <div className="journal-feature-copy"><div className="journal-meta"><span>{featured.category}</span><span>Selected reading</span></div><h2 id="featured-title">{featured.title}</h2><p>{featured.excerpt}</p><div className="journal-feature-foot"><span>{featured.readTime} <span aria-hidden="true">·</span> {featured.dateDisplay}</span><span className="journal-circle-arrow" aria-hidden="true">→</span></div></div>
          <div className="journal-feature-art"><GenerativeCover slug={featured.slug} category={featured.category} height={360} /><span className="journal-art-caption">THE ARCHITECTURE OF AN IDEA</span></div>
        </Link>
      </section>}

      <section className="journal-section journal-container" aria-labelledby="latest-title">
        <div className="journal-section-heading"><div><span className="journal-kicker">02 / From the notebook</span><h2 id="latest-title">Recent explorations<span className="gold-period">.</span></h2></div><Link className="journal-text-link" to="/writing">All writing <span aria-hidden="true">→</span></Link></div>
        <div className="journal-grid">{latest.map((article, index) => <ArticleCard key={article.slug} article={article} number={index + 1} />)}</div>
      </section>

      <ReadingJourneys />
      <KnowledgeMap />

      <section className="journal-topics-band" aria-labelledby="topics-title"><div className="journal-container journal-topics-layout">
        <div><span className="journal-kicker">03 / Follow your curiosity</span><h2 id="topics-title">Different lenses.<br /><em>Connected ideas.</em></h2><p>Find the thread that interests you. See where it leads.</p></div>
        <div className="journal-topic-list">{TOPICS.map(t => <Link to={topicPath(t.name)} key={t.name} style={{ '--topic-color': t.color }}><span className="journal-topic-number">{t.number}</span><div><h3>{t.name}</h3><p>{t.description}</p></div><span className="journal-topic-count">{ARTICLES.filter(a => a.category === t.name).length} essays</span><span aria-hidden="true">→</span></Link>)}</div>
      </div></section>

      <section className="journal-section journal-container journal-practice" aria-labelledby="practice-title"><div><span className="journal-kicker">04 / From thought to practice</span><h2 id="practice-title">Ideas are better<br />when you can <em>build with them.</em></h2></div><div><p>Architecture walkthroughs, implementation patterns, and the lessons that only emerge when you ship.</p><Link className="journal-text-link" to="/showcase">Explore the showcase <span aria-hidden="true">→</span></Link><Link className="journal-text-link" to="/labs">Try the interactive labs <span aria-hidden="true">→</span></Link><Link className="journal-text-link" to="/thinking">What I’m thinking about <span aria-hidden="true">→</span></Link></div></section>

      <section className="journal-container journal-subscribe" id="subscribe"><span className="journal-kicker">A note when there’s something worth sharing</span><Subscribe source="home" /></section>
      <section id="connect" className="journal-container journal-connect"><p>Good ideas start with a conversation.</p><a className="journal-text-link" href="https://www.linkedin.com/in/alokmishra6/" target="_blank" rel="noopener noreferrer">Let’s connect <span aria-hidden="true">→</span></a></section>
    </div>
  )
}

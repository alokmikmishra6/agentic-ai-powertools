import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ARTICLES } from '../data/index'
import { TOPICS, topicPath } from '../lib/articles'
import LivingField from './LivingField'

const positions = [{ left: '79%', top: '19%' }, { left: '81%', top: '75%' }, { left: '25%', top: '81%' }, { left: '18%', top: '27%' }]

export default function TopicAtlas() {
  const [selected, setSelected] = useState(0)
  const [paused, setPaused] = useState(false)
  const topic = TOPICS[selected]
  const count = ARTICLES.filter(a => a.category === topic.name).length
  return <div className="topic-atlas atlas-sculpture" style={{ '--atlas-accent': topic.color }}>
    <div className="atlas-label"><span className="status-spark" /> A map of connected ideas <span>FIG. 01</span></div>
    <div className="atlas-field">
      <LivingField color={topic.color} paused={paused} selected={selected} />
      <span className="atlas-coordinate atlas-coordinate-top" aria-hidden="true">INTELLIGENCE × STRUCTURE</span>
      {TOPICS.map((t, index) => <button key={t.name} data-atlas-node={index} className={`atlas-node ${selected === index ? 'selected' : ''}`} style={positions[index]} aria-pressed={selected === index} aria-controls="atlas-topic-detail" onClick={() => setSelected(index)}>
        <span className="atlas-node-dot" /><span>{t.name}</span>
      </button>)}
    </div>
    <div className="atlas-field-footer"><span>Four perspectives. One connected practice.</span><button className="atlas-motion-toggle" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Play motion' : 'Pause motion'} <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button></div>
    <div className="atlas-detail" id="atlas-topic-detail" aria-live="polite">
      <div><span className="journal-kicker">{topic.number} / {topic.name}</span><p>{topic.short}</p></div>
      <Link to={topicPath(topic.name)} aria-label={`Read ${count} essays on ${topic.name}`}>{count} essays <span aria-hidden="true">→</span></Link>
    </div>
  </div>
}

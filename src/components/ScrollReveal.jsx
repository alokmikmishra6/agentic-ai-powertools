import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

/* ═══ APPLE-STYLE SCROLL ANIMATIONS ═══ */

const ease = [0.22, 1, 0.36, 1]

// Basic fade + slide up (default reveal)
export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.0, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

// Scale up from smaller — Apple hero style
export function ScaleReveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.85, y: 60, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1.2, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

// Slide in from left or right — for cards
export function SlideIn({ children, direction = 'left', delay = 0, className = '' }) {
  const x = direction === 'left' ? -80 : 80
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

// Float up with slight rotation — playful entrance
export function FloatIn({ children, delay = 0, rotate = 3, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, rotate: rotate, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

// Scroll-linked scale — element grows as it scrolls into center of viewport
export function ScrollScale({ children, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center']
  })
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1])

  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  )
}

// Scroll-linked horizontal movement — objects translate as you scroll
export function ScrollSlide({ children, speed = 100, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const x = useTransform(scrollYProgress, [0, 1], [-speed, speed])

  return (
    <motion.div ref={ref} style={{ x }} className={className}>
      {children}
    </motion.div>
  )
}

// Horizontal text marquee that moves with scroll — Juan Mora style
export function TextMarquee({ text, speed = 300, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -speed])

  return (
    <div ref={ref} className={`text-marquee-wrap ${className}`}>
      <motion.div className="text-marquee-track text-marquee-continuous" style={{ x }}>
        <span className="text-marquee-text">{text}</span>
        <span className="text-marquee-text" aria-hidden="true">{text}</span>
        <span className="text-marquee-text" aria-hidden="true">{text}</span>
        <span className="text-marquee-text" aria-hidden="true">{text}</span>
      </motion.div>
    </div>
  )
}

// Word-by-word reveal on scroll — like juanmora "making users click"
export function TextRevealByWord({ text, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.3']
  })
  const words = text.split(' ')

  return (
    <p ref={ref} className={`text-reveal-wrap ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + (1 / words.length)
        return <TextWord key={i} progress={scrollYProgress} range={[start, end]}>{word}</TextWord>
      })}
    </p>
  )
}

function TextWord({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  const y = useTransform(progress, range, [8, 0])
  return (
    <motion.span style={{ opacity, y, display: 'inline-block', marginRight: '0.3em' }}>
      {children}
    </motion.span>
  )
}

// Full viewport pinned section with scroll progress
export function PinnedSection({ children, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  })

  return (
    <div ref={ref} className={`pinned-section ${className}`}>
      <motion.div className="pinned-content" style={{ position: 'sticky', top: 0 }}>
        {typeof children === 'function' ? children(scrollYProgress) : children}
      </motion.div>
    </div>
  )
}

export function StaggerContainer({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.95, filter: 'blur(6px)' },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          transition: { duration: 0.8, ease }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export function Parallax({ children, speed = 0.2, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// ── Content slides in from the side and rotates into place (3D perspective) ──
export function PerspectiveReveal({ children, direction = 'left', delay = 0, className = '' }) {
  const rotateY = direction === 'left' ? 25 : -25
  const x = direction === 'left' ? -120 : 120
  return (
    <motion.div
      className={className}
      style={{ perspective: '1200px', height: '100%' }}
      initial={{ opacity: 0, x, rotateY, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.2, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

// ── Content reveals through a clip-path wipe (like a curtain) ──
export function ClipReveal({ children, direction = 'left', delay = 0, className = '' }) {
  const clipFrom = {
    left: 'inset(0 100% 0 0)',
    right: 'inset(0 0 0 100%)',
    top: 'inset(0 0 100% 0)',
    bottom: 'inset(100% 0 0 0)',
  }
  return (
    <motion.div
      className={className}
      initial={{ clipPath: clipFrom[direction], opacity: 0 }}
      whileInView={{ clipPath: 'inset(0 0 0 0)', opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.0, delay, ease: [0.77, 0, 0.175, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ── Content flies toward viewer from deep Z-space ──
export function DepthReveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      style={{ perspective: '1000px', height: '100%' }}
    >
      <motion.div
        initial={{ opacity: 0, z: -300, scale: 0.6, rotateX: 15, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, z: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1.4, delay, ease }}
        style={{ transformStyle: 'preserve-3d', height: '100%' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// ── Cards fan out from center with staggered rotation ──
export function FanReveal({ children, index = 0, total = 3, className = '' }) {
  const spread = 8
  const rotate = (index - (total - 1) / 2) * spread
  const delay = index * 0.12
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, rotate: rotate * 2, y: 80, scale: 0.85 }}
      whileInView={{ opacity: 1, rotate: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1.0, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

// ── Horizontal scroll-linked section (pinned, content scrolls sideways) ──
export function HorizontalScroll({ children, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-60%'])

  return (
    <div ref={ref} className={`horizontal-scroll-outer ${className}`} style={{ height: '200vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <motion.div style={{ x, display: 'flex', gap: '40px', paddingLeft: '48px', paddingRight: '200px' }}>
          {children}
        </motion.div>
      </div>
    </div>
  )
}

// ── Counter/number that counts up as it scrolls into view ──
export function CountUp({ value, suffix = '', className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const num = parseInt(value) || 0
    const duration = 1500
    const start = performance.now()
    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(eased * num))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isInView, value])

  return <span ref={ref} className={className}>{isInView ? count : 0}{suffix}</span>
}

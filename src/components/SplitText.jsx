import { motion } from 'framer-motion'

const container = {
  hidden: {},
  visible: (delay = 0) => ({
    transition: { staggerChildren: 0.03, delayChildren: delay }
  })
}

const child = {
  hidden: { opacity: 0, y: 80, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function SplitText({ text, className = '', delay = 0, gradient = false }) {
  const charStyle = gradient
    ? {
        display: 'inline-block',
        transformOrigin: 'bottom',
        background: 'linear-gradient(135deg, #ffffff 0%, #d4b896 50%, #c9a87c 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }
    : { display: 'inline-block', transformOrigin: 'bottom' }

  const words = text.split(' ')

  return (
    <motion.span
      className={className}
      style={{ display: 'inline', perspective: '600px' }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={delay}
    >
      {words.map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, ci) => (
            <motion.span
              key={ci}
              variants={child}
              style={charStyle}
            >
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 && (
            <motion.span variants={child} style={charStyle}>
              {'\u00A0'}
            </motion.span>
          )}
        </span>
      ))}
    </motion.span>
  )
}

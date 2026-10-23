import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Progressive enhancement: content remains visible when JS or observers are unavailable.
export default function ExperienceEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    const main = document.getElementById('main-content')
    if (!main || !window.IntersectionObserver || !main.animate) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let observer
    const observed = new WeakSet()
    function register() {
      if (preference.matches) return
      main.querySelectorAll('.journal-section, .journey-section, .journal-card, .about-principle, .inquiry-card').forEach(el => {
        if (observed.has(el)) return
        observed.add(el)
        observer.observe(el)
      })
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        if (!preference.matches) {
          entry.target.animate([{ opacity: .5, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 550, easing: 'cubic-bezier(.2,.7,.2,1)' })
        }
        observer.unobserve(entry.target)
      })
    }, { threshold: .08 })
    const mutations = new MutationObserver(register)
    mutations.observe(main, { childList: true, subtree: true })
    register()
    if (!preference.matches) main.animate([{ opacity: .6 }, { opacity: 1 }], { duration: 250 })
    return () => { observer.disconnect(); mutations.disconnect() }
  }, [pathname])
  return null
}

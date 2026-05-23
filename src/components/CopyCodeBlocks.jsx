import { useEffect } from 'react'

/**
 * Adds "Copy" buttons to all <pre> code blocks within the article body.
 * Uses event delegation so it works with dangerouslySetInnerHTML content.
 */
export default function CopyCodeBlocks() {
  useEffect(() => {
    const articleEl = document.querySelector('.article-body')
    if (!articleEl) return

    const addButtons = () => {
      const pres = articleEl.querySelectorAll('pre')
      pres.forEach(pre => {
        if (pre.querySelector('.copy-code-btn')) return // Already has button

        // Wrap in relative container if not already
        if (!pre.parentElement?.classList.contains('code-block-wrap')) {
          const wrapper = document.createElement('div')
          wrapper.className = 'code-block-wrap'
          pre.parentNode.insertBefore(wrapper, pre)
          wrapper.appendChild(pre)
        }

        const btn = document.createElement('button')
        btn.className = 'copy-code-btn'
        btn.textContent = 'Copy'
        btn.setAttribute('aria-label', 'Copy code to clipboard')

        btn.addEventListener('click', async () => {
          const code = pre.querySelector('code')?.textContent || pre.textContent
          try {
            await navigator.clipboard.writeText(code)
            btn.textContent = 'Copied!'
            btn.classList.add('copied')
            setTimeout(() => {
              btn.textContent = 'Copy'
              btn.classList.remove('copied')
            }, 2000)
          } catch {
            // Fallback
            const textarea = document.createElement('textarea')
            textarea.value = code
            textarea.style.position = 'fixed'
            textarea.style.opacity = '0'
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            btn.textContent = 'Copied!'
            btn.classList.add('copied')
            setTimeout(() => {
              btn.textContent = 'Copy'
              btn.classList.remove('copied')
            }, 2000)
          }
        })

        pre.parentElement.appendChild(btn)
      })
    }

    // Wait for content to render
    const timer = setTimeout(addButtons, 200)
    return () => clearTimeout(timer)
  }, [])

  return null // No rendered output — DOM manipulation only
}

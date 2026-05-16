export default function CodeBlock({ code, lang = 'python' }) {
  const highlighted = highlightPython(code)
  return (
    <div className="sc-code-block">
      <div className="sc-code-header">
        <span className="sc-dot" />
        <span className="sc-dot" />
        <span className="sc-dot" />
      </div>
      <div
        className="sc-code-body"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  )
}

function highlightPython(code) {
  const tokens = []
  let i = 0

  while (i < code.length) {
    // Triple-quoted strings
    if (code.slice(i, i + 3) === '"""' || code.slice(i, i + 3) === "'''") {
      const q = code.slice(i, i + 3)
      let end = code.indexOf(q, i + 3)
      if (end === -1) end = code.length - 3
      tokens.push(`<span class="st">${esc(code.slice(i, end + 3))}</span>`)
      i = end + 3
      continue
    }
    // Comments
    if (code[i] === '#') {
      let end = code.indexOf('\n', i)
      if (end === -1) end = code.length
      tokens.push(`<span class="cm">${esc(code.slice(i, end))}</span>`)
      i = end
      continue
    }
    // Strings
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i]
      let j = i + 1
      while (j < code.length && code[j] !== q) {
        if (code[j] === '\\') j++
        j++
      }
      tokens.push(`<span class="st">${esc(code.slice(i, j + 1))}</span>`)
      i = j + 1
      continue
    }
    // f-string prefix
    if ((code[i] === 'f' || code[i] === 'F') && (code[i + 1] === '"' || code[i + 1] === "'")) {
      const q = code[i + 1]
      let j = i + 2
      while (j < code.length && code[j] !== q) {
        if (code[j] === '\\') j++
        j++
      }
      tokens.push(`<span class="st">${esc(code.slice(i, j + 1))}</span>`)
      i = j + 1
      continue
    }
    // Numbers
    if (/\d/.test(code[i]) && (i === 0 || /[\s=(:,\[]/.test(code[i - 1]))) {
      let j = i
      while (j < code.length && /[\d.]/.test(code[j])) j++
      tokens.push(`<span class="nr">${esc(code.slice(i, j))}</span>`)
      i = j
      continue
    }
    // Words
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i
      while (j < code.length && /\w/.test(code[j])) j++
      const word = code.slice(i, j)
      const keywords = ['class', 'def', 'async', 'await', 'for', 'in', 'if', 'elif', 'else', 'return', 'yield', 'import', 'from', 'with', 'as', 'not', 'and', 'or', 'None', 'True', 'False', 'raise', 'try', 'except', 'finally', 'while', 'break', 'continue', 'pass', 'lambda']
      const decorators = ['contextmanager']
      const selfWord = word === 'self'

      if (keywords.includes(word)) {
        tokens.push(`<span class="kw">${word}</span>`)
      } else if (selfWord) {
        tokens.push(`<span class="slf">${word}</span>`)
      } else if (decorators.includes(word)) {
        tokens.push(`<span class="dc">${word}</span>`)
      } else if (code[j] === '(') {
        tokens.push(`<span class="fn">${word}</span>`)
      } else {
        tokens.push(esc(word))
      }
      i = j
      continue
    }
    // Decorator @
    if (code[i] === '@') {
      tokens.push(`<span class="dc">${esc(code[i])}</span>`)
      i++
      continue
    }
    // Operators
    if ('=+-*/<>!:&|^~%'.includes(code[i])) {
      tokens.push(`<span class="op">${esc(code[i])}</span>`)
      i++
      continue
    }
    tokens.push(esc(code[i]))
    i++
  }

  return tokens.join('')
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

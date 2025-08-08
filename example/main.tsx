import React from 'react'
import { createRoot } from 'react-dom/client'
import { SafeMarkdown } from 'safe-markdown-react'

const md = `# Hello **world**

- [External link](https://example.com)
- Inline code: \`const x = 1\`
- Image: ![x](https://images.example.com/x.png)

<script>alert('xss');</script>
`

function App() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: 24, lineHeight: 1.6 }}>
      <h1>safe-markdown-react — playground</h1>
      <SafeMarkdown markdown={md} allowedImageHosts={['images.example.com']} />
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)

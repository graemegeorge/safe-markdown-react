# safe-markdown-react

> Safe, GFM-friendly Markdown → React renderer with sanitation, link policy, and image allowlists.

Perfect for rendering **AI / user-generated content** without inviting XSS or layout chaos.

---

## Features

- ✅ **No raw HTML** from Markdown (by default)
- ✅ **Sanitized** output via `rehype-sanitize` (strict schema)
- ✅ **GFM** support (tables, strikethrough, task lists)
- ✅ **Link policy**: adds `rel="nofollow noopener noreferrer"` and `target="_blank"`
- ✅ **Image allowlist**: blocks images unless host is allowed
- ✅ **Heading depth guard**: cap headings to a max level (e.g., `h1..h3` only)
- ✅ **Override components**: map tags to your React components
- ✅ TypeScript types, React 18+

---

## Install

```bash
npm i safe-markdown-react
# peer deps: react >= 18
```

---

## Usage

```tsx
import { SafeMarkdown } from 'safe-markdown-react';

export default function Article({ content }: { content: string }) {
  return (
    <SafeMarkdown
      markdown={content}
      allowedImageHosts={['images.example.com', 'cdn.jsdelivr.net']}
      maxHeadingLevel={3}
      linkTarget="_blank"
    />
  );
}
```

### With custom components

```tsx
import { SafeMarkdown } from 'safe-markdown-react';

const components = {
  h2: (props) => <h2 className="text-2xl font-semibold" {...props} />,
  code: (props) => <code className="rounded bg-zinc-950/90 px-1 py-0.5" {...props} />,
};

<SafeMarkdown markdown={md} components={components} />;
```

---

## API

### `<SafeMarkdown />`

Props:

- `markdown: string` — the raw Markdown text
- `allowedImageHosts?: string[]` — host allowlist for `<img src>`. Defaults to `[]` (block external images).
- `allowedSchemes?: string[]` — URL schemes to permit in `href/src`. Defaults to `['http', 'https', 'mailto']`.
- `maxHeadingLevel?: 1|2|3|4|5|6` — cap headings to at most this level (default `3`).
- `linkRel?: string` — rel attribute for links (default `'nofollow noopener noreferrer'`).
- `linkTarget?: string` — target for links (default `'_blank'`).
- `components?: Record<string, React.ComponentType<any>>` — map element names to your components.

---

## Security notes

- Raw HTML in Markdown is **ignored**. If you need it, you must opt-in and extend the sanitizer schema carefully.
- Links always get safe `rel` and `target` by default.
- Images are blocked unless you allow a host explicitly.
- Only standard schemes (`http`, `https`, `mailto`) are allowed by default.

---

## License

MIT

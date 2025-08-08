import React from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeReact from 'rehype-react';
import type { Root } from 'hast';
import { Fragment } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';

import { rehypeHeadingMaxLevel } from './plugins/rehypeHeadingMaxLevel.js';
import { rehypeLinkPolicy } from './plugins/rehypeLinkPolicy.js';
import { rehypeFilterImages } from './plugins/rehypeFilterImages.js';
import { rehypeFilterSchemes } from './plugins/rehypeFilterSchemes.js';

export type ComponentsMap = Record<string, React.ComponentType<any>>;

export interface SafeMarkdownProps {
  markdown: string;
  /** Allowed hosts for <img src>. Empty = block external images. */
  allowedImageHosts?: string[];
  /** Allowed URL schemes (href/src). */
  allowedSchemes?: string[];
  /** Cap headings to this level (default: 3). */
  maxHeadingLevel?: 1|2|3|4|5|6;
  /** rel for links (default: 'nofollow noopener noreferrer'). */
  linkRel?: string;
  /** target for links (default: '_blank'). */
  linkTarget?: string;
  /** Map tagName -> Component to override rendering. */
  components?: ComponentsMap;
}

const defaultAllowedSchemes = ['http', 'https', 'mailto'];

function createSchema() {
  // Start from the default schema and allow className on code/pre/table
  const schema: any = JSON.parse(JSON.stringify(defaultSchema));
  const add = (tag: string, attrs: any[]) => {
    schema.attributes = schema.attributes || {};
    const cur = schema.attributes[tag] || [];
    schema.attributes[tag] = Array.from(new Set([...cur, ...attrs]));
  };
  add('code', ['className']);
  add('pre', ['className']);
  add('table', ['className']);
  add('thead', ['className']);
  add('tbody', ['className']);
  add('tr', ['className']);
  add('td', ['className']);
  add('th', ['className']);
  add('a', ['rel', 'target']);
  return schema;
}

export function SafeMarkdown(props: SafeMarkdownProps) {
  const {
    markdown,
    allowedImageHosts = [],
    allowedSchemes = defaultAllowedSchemes,
    maxHeadingLevel = 3,
    linkRel = 'nofollow noopener noreferrer',
    linkTarget = '_blank',
    components = {},
  } = props;

  const file = unified()
    .use(remarkParse)
    .use(remarkGfm)
    // Disallow raw HTML (no rehype-raw)
    .use(remarkRehype, { allowDangerousHtml: false })
    // Policy & guards
    .use(rehypeHeadingMaxLevel, { max: maxHeadingLevel })
    .use(rehypeFilterSchemes, { schemes: allowedSchemes })
    .use(rehypeFilterImages, { hosts: allowedImageHosts })
    .use(rehypeLinkPolicy, { rel: linkRel, target: linkTarget })
    // Sanitize last
    .use(rehypeSanitize, createSchema())
    // Render to React
    .use(rehypeReact, { Fragment, jsx, jsxs, components });

  const hast = file.processSync(markdown).result as React.ReactNode;
  return <>{hast}</>;
}

export default SafeMarkdown;

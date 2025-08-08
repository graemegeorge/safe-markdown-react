import type { Root } from 'hast';
import { visit } from 'unist-util-visit';
import { Plugin } from 'unified';

/**
 * Remove <img> if host is not allowlisted.
 * Replace with <a href="...">image</a> so content still references the asset.
 */
export const rehypeFilterImages: Plugin<[ { hosts?: string[] }? ], Root> = (opts = {}) => {
  const hosts = new Set(((opts as any).hosts ?? []) as string[]);
  return (tree) => {
    visit(tree, 'element', (node: any, index: number | null, parent: any | null) => {
      if (node.tagName !== 'img') return;
      const src = String(node.properties?.src || '');
      try {
        const url = new URL(src, 'http://_base');
        const host = url.host;
        if (!host || !hosts.has(host)) {
          if (parent && typeof index === 'number') {
            parent.children[index] = {
              type: 'element',
              tagName: 'a',
              properties: { href: src, rel: 'nofollow noopener noreferrer', target: '_blank' },
              children: [{ type: 'text', value: 'image' }]
            };
          }
        }
      } catch {
        if (parent && typeof index === 'number') parent.children.splice(index, 1);
      }
    });
  };
};

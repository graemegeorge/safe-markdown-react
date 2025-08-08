import type { Root } from 'hast';
import { visit } from 'unist-util-visit';
import { Plugin } from 'unified';

/** Remove links/images with disallowed schemes. */
export const rehypeFilterSchemes: Plugin<[ { schemes?: string[] }? ], Root> = (opts = {}) => {
  const schemes = new Set(((opts as any).schemes ?? ['http','https','mailto']).map((s: string) => s.replace(/:$/, '')));
  return (tree) => {
    visit(tree, 'element', (node: any, index: number | null, parent: any | null) => {
      if (!parent || typeof index !== 'number') return;
      const props = node.properties || {};
      const url: string | undefined = (node.tagName === 'a' ? props.href : node.tagName === 'img' ? props.src : undefined) as any;
      if (!url) return;
      try {
        const u = new URL(String(url), 'http://_base');
        const scheme = u.protocol.replace(/:$/, '');
        if (scheme && !schemes.has(scheme)) {
          parent.children.splice(index, 1);
        }
      } catch {
        parent.children.splice(index, 1);
      }
    });
  };
};

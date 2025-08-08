import type { Root } from 'hast';
import { visit } from 'unist-util-visit';
import { Plugin } from 'unified';

/** Demote headings so that level never exceeds `max`. e.g., h5 -> h3 when max=3 */
export const rehypeHeadingMaxLevel: Plugin<[ { max?: 1|2|3|4|5|6 }? ], Root> = (opts = {}) => {
  const max = Math.min(Math.max((opts as any).max ?? 3, 1), 6) as 1|2|3|4|5|6;
  return (tree) => {
    visit(tree, 'element', (node: any) => {
      const tag = node.tagName;
      if (/^h[1-6]$/.test(tag)) {
        const n = Number(tag[1]);
        if (n > max) node.tagName = ('h' + max) as any;
      }
    });
  };
};

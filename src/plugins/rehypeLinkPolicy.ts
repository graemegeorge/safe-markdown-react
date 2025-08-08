import type { Root } from 'hast';
import { visit } from 'unist-util-visit';
import { Plugin } from 'unified';

export const rehypeLinkPolicy: Plugin<[ { rel?: string; target?: string }? ], Root> = (opts = {}) => {
  const rel = (opts as any).rel ?? 'nofollow noopener noreferrer';
  const target = (opts as any).target ?? '_blank';
  return (tree) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'a') {
        node.properties = node.properties || {};
        node.properties.rel = rel;
        node.properties.target = target;
      }
    });
  };
};

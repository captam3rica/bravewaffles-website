import type { Root } from 'hast';
import { isShortcut, shortcutTokens, type ShortcutToken } from './shortcut-pills';

type HastNode = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: HastNode[]; value?: string };

function textOf(node: HastNode): string {
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(textOf).join('');
}

// hast text nodes hold raw text; rehype-stringify escapes values on output.
function tokensToNodes(tokens: ShortcutToken[]): HastNode[] {
  const nodes: HastNode[] = [];
  for (const t of tokens) {
    if (t.kind === 'key') {
      nodes.push({
        type: 'element',
        tagName: 'span',
        properties: { className: ['keycap'] },
        children: [{ type: 'text', value: t.text }],
      });
    } else {
      nodes.push({ type: 'text', value: '\u00a0' });
    }
  }
  return nodes;
}

function transformStrong(node: HastNode): void {
  if (node.type !== 'element' || node.tagName !== 'strong') return;
  const text = textOf(node);
  if (!isShortcut(text)) return;
  node.tagName = 'span';
  node.properties = { ...(node.properties ?? {}), className: ['keycap-set'] };
  node.children = tokensToNodes(shortcutTokens(text));
}

function walk(node: HastNode): void {
  transformStrong(node);
  (node.children ?? []).forEach(walk);
}

export default function rehypeShortcutPills() {
  return (tree: Root) => {
    walk(tree as unknown as HastNode);
  };
}
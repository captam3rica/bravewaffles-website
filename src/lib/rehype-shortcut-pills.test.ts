import { describe, it, expect } from 'vitest';
import rehypeShortcutPills from './rehype-shortcut-pills';

type Node = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
  value?: string;
};

function textNode(value: string): Node {
  return { type: 'text', value };
}

function strong(children: Node[]): Node {
  return { type: 'element', tagName: 'strong', properties: {}, children };
}

function keycapSpan(value: string): Node {
  return {
    type: 'element',
    tagName: 'span',
    properties: { className: ['keycap'] },
    children: [{ type: 'text', value }],
  };
}

function run(children: Node[]): Node[] {
  const tree: Node = { type: 'root', children };
  const plugin = rehypeShortcutPills();
  plugin(tree as never);
  return tree.children as Node[];
}

const NBSP = '\u00a0';

describe('rehypeShortcutPills', () => {
  it('turns a shortcut strong into a keycap-set of per-key spans', () => {
    const [node] = run([strong([textNode('⇧⌘C')])]);
    expect(node).toEqual({
      type: 'element',
      tagName: 'span',
      properties: { className: ['keycap-set'] },
      children: [keycapSpan('⇧'), keycapSpan('⌘'), keycapSpan('C')],
    });
  });

  it('separates series groups with an nbsp between keycap spans', () => {
    const [node] = run([strong([textNode('⌘B / ⌘I')])]);
    expect(node).toEqual({
      type: 'element',
      tagName: 'span',
      properties: { className: ['keycap-set'] },
      children: [keycapSpan('⌘'), keycapSpan('B'), textNode(NBSP), keycapSpan('⌘'), keycapSpan('I')],
    });
  });

  it('leaves ordinary prose strong untouched', () => {
    const bold = strong([textNode('bold')]);
    const prose = strong([textNode('⌘⇧F = everything. ⌘F = this entry.')]);
    const [boldNode, proseNode] = run([bold, prose]);
    expect(boldNode.tagName).toBe('strong');
    expect(boldNode.children).toEqual([textNode('bold')]);
    expect(proseNode.tagName).toBe('strong');
    expect(proseNode.children).toEqual([textNode('⌘⇧F = everything. ⌘F = this entry.')]);
  });

  it('leaves a lone modifier strong untouched', () => {
    const lone = strong([textNode('⌘')]);
    const [node] = run([lone]);
    expect(node.tagName).toBe('strong');
    expect(node.children).toEqual([textNode('⌘')]);
  });
});
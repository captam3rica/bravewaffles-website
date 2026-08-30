import { describe, it, expect } from 'vitest';
import { isShortcut, shortcutTokens } from './shortcut-pills';

describe('isShortcut', () => {
  it('recognizes modifier + main key combos', () => {
    expect(isShortcut('⇧⌘C')).toBe(true);
    expect(isShortcut('⌘B')).toBe(true);
    expect(isShortcut('⌘⇧F')).toBe(true);
    expect(isShortcut('⌃r')).toBe(true);
    expect(isShortcut('⌘,')).toBe(true);
    expect(isShortcut('⌘[')).toBe(true);
    expect(isShortcut('⌘↑')).toBe(true);
  });

  it('recognizes bare single keys and the Return word', () => {
    expect(isShortcut('↑')).toBe(true);
    expect(isShortcut('↓')).toBe(true);
    expect(isShortcut('⏎')).toBe(true);
    expect(isShortcut('?')).toBe(true);
    expect(isShortcut('Return')).toBe(true);
    expect(isShortcut('1')).toBe(true);
  });

  it('recognizes series separated by / or whitespace', () => {
    expect(isShortcut('⌘B / ⌘I / ⌘E / ⌘L / ⌘U')).toBe(true);
    expect(isShortcut('⌘1 / ⌘2 / ⌘3')).toBe(true);
    expect(isShortcut('⌘1/⌘2/⌘3')).toBe(true);
    expect(isShortcut('⌘↑ / ⌘↓')).toBe(true);
  });

  it('rejects ordinary words and prose', () => {
    expect(isShortcut('bold')).toBe(false);
    expect(isShortcut('everything.')).toBe(false);
    expect(isShortcut('⌘⇧F = everything. ⌘F = this entry.')).toBe(false);
    expect(isShortcut('⌘')).toBe(false); // lone modifier is not a full combo
  });

  it('rejects empty string', () => {
    expect(isShortcut('')).toBe(false);
  });
});

describe('shortcutTokens', () => {
  it('emits one key token per key in a combo', () => {
    expect(shortcutTokens('⇧⌘C')).toEqual([
      { kind: 'key', text: '⇧' },
      { kind: 'key', text: '⌘' },
      { kind: 'key', text: 'C' },
    ]);
    expect(shortcutTokens('⌘B')).toEqual([
      { kind: 'key', text: '⌘' },
      { kind: 'key', text: 'B' },
    ]);
  });

  it('emits one key token for a single-key shortcut', () => {
    expect(shortcutTokens('⏎')).toEqual([{ kind: 'key', text: '⏎' }]);
    expect(shortcutTokens('Return')).toEqual([{ kind: 'key', text: 'Return' }]);
  });

  it('separates series groups with a separator token', () => {
    expect(shortcutTokens('⌘B / ⌘I / ⌘E / ⌘L / ⌘U')).toEqual([
      { kind: 'key', text: '⌘' },
      { kind: 'key', text: 'B' },
      { kind: 'separator', text: '' },
      { kind: 'key', text: '⌘' },
      { kind: 'key', text: 'I' },
      { kind: 'separator', text: '' },
      { kind: 'key', text: '⌘' },
      { kind: 'key', text: 'E' },
      { kind: 'separator', text: '' },
      { kind: 'key', text: '⌘' },
      { kind: 'key', text: 'L' },
      { kind: 'separator', text: '' },
      { kind: 'key', text: '⌘' },
      { kind: 'key', text: 'U' },
    ]);
    expect(shortcutTokens('⌘1 / ⌘2 / ⌘3')).toEqual([
      { kind: 'key', text: '⌘' },
      { kind: 'key', text: '1' },
      { kind: 'separator', text: '' },
      { kind: 'key', text: '⌘' },
      { kind: 'key', text: '2' },
      { kind: 'separator', text: '' },
      { kind: 'key', text: '⌘' },
      { kind: 'key', text: '3' },
    ]);
  });

  it('emits separator tokens between groups where a single arrow key follows a modifier', () => {
    expect(shortcutTokens('⌘↑ / ⌘↓')).toEqual([
      { kind: 'key', text: '⌘' },
      { kind: 'key', text: '↑' },
      { kind: 'separator', text: '' },
      { kind: 'key', text: '⌘' },
      { kind: 'key', text: '↓' },
    ]);
  });
});
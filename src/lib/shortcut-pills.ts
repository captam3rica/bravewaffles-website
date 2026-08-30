const MODIFIERS = /[⌘⇧⌥⌃]/;
const RETURN_KEY = 'Return';

function splitGroups(s: string): string[] {
  return s.split(/\s*\/\s*|\s+/).filter(Boolean);
}

function isValidGroup(g: string): boolean {
  if (g === RETURN_KEY) return true;
  if (MODIFIERS.test(g)) return /^[⌘⇧⌥⌃]+.$/.test(g);
  return g.length === 1;
}

export function isShortcut(s: string): boolean {
  if (!s) return false;
  const groups = splitGroups(s);
  if (groups.length === 0) return false;
  return groups.every(isValidGroup);
}

function splitKeys(group: string): string[] {
  const keys: string[] = [];
  let i = 0;
  while (i < group.length && MODIFIERS.test(group[i])) {
    keys.push(group[i]);
    i += 1;
  }
  const rest = group.slice(i);
  if (rest) keys.push(rest);
  return keys;
}

export interface ShortcutToken {
  kind: 'key' | 'separator';
  text: string;
}

export function shortcutTokens(text: string): ShortcutToken[] {
  const tokens: ShortcutToken[] = [];
  const groups = splitGroups(text);
  groups.forEach((g, i) => {
    if (i > 0) tokens.push({ kind: 'separator', text: '' });
    for (const key of splitKeys(g)) tokens.push({ kind: 'key', text: key });
  });
  return tokens;
}
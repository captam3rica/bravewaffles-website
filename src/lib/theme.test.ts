import { describe, it, expect, beforeEach } from 'vitest';
import { getInitialTheme, applyTheme, toggleTheme, THEME_STORAGE_KEY } from './theme';

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('defaults to dark when nothing is stored', () => {
    expect(getInitialTheme()).toBe('dark');
  });

  it('reads the stored theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    expect(getInitialTheme()).toBe('light');
  });

  it('ignores invalid stored values', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'neon');
    expect(getInitialTheme()).toBe('dark');
  });

  it('applies the theme to the document and persists it', () => {
    applyTheme('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('toggles between themes', () => {
    expect(toggleTheme('dark')).toBe('light');
    expect(toggleTheme('light')).toBe('dark');
  });
});

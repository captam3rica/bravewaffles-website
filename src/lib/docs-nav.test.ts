import { describe, it, expect } from 'vitest';
import { DOC_NAV, docSlugs, prevNext, slugToNavItem } from './docs-nav';

describe('docs nav', () => {
  it('has 6 groups and 19 visible pages', () => {
    expect(DOC_NAV).toHaveLength(6);
    const pages = DOC_NAV.flatMap((g) => g.items);
    expect(pages).toHaveLength(19);
  });

  it('slugs are unique and ordered', () => {
    const slugs = docSlugs();
    expect(new Set(slugs).size).toBe(19);
    expect(slugs[0]).toBe('install-and-setup');
    expect(slugs[slugs.length - 1]).toBe('changelog');
  });

  it('maps a slug to its group', () => {
    expect(slugToNavItem('quickstart')?.group).toBe('Getting started');
    expect(slugToNavItem('nope')).toBeUndefined();
  });

  it('returns prev/next across groups', () => {
    // last of Getting started -> first of Using the app
    expect(prevNext('quickstart').next?.slug).toBe('writing-notes');
    expect(prevNext('writing-notes').prev?.slug).toBe('quickstart');
    expect(prevNext('install-and-setup').prev).toBeUndefined();
    expect(prevNext('changelog').next).toBeUndefined();
  });
});

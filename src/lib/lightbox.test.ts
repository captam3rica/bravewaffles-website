import { describe, it, expect } from 'vitest';
import { nextSlideIndex, prevSlideIndex } from './lightbox';

describe('lightbox slide navigation', () => {
  const count = 3;

  it('advances forward and wraps to the first slide', () => {
    expect(nextSlideIndex(0, count)).toBe(1);
    expect(nextSlideIndex(1, count)).toBe(2);
    expect(nextSlideIndex(2, count)).toBe(0);
  });

  it('goes backward and wraps to the last slide', () => {
    expect(prevSlideIndex(0, count)).toBe(2);
    expect(prevSlideIndex(2, count)).toBe(1);
    expect(prevSlideIndex(1, count)).toBe(0);
  });
});
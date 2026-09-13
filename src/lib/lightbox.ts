export function nextSlideIndex(current: number, count: number): number {
  return (current + 1) % count;
}

export function prevSlideIndex(current: number, count: number): number {
  return (current - 1 + count) % count;
}
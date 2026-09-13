export function nextSlideIndex(current: number, count: number): number {
  return (current + 1) % count;
}

export function prevSlideIndex(current: number, count: number): number {
  return (current - 1 + count) % count;
}

export function initLightbox(): void {
  const dialog = document.getElementById('lightbox') as HTMLDialogElement | null;
  const slides = Array.from(dialog?.querySelectorAll<HTMLElement>('.lightbox-slide') ?? []);
  const openers = Array.from(document.querySelectorAll<HTMLElement>('.shot-open'));
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  if (!dialog || !slides.length || !openers.length) return;

  let current = 0;

  function show(index: number) {
    current = index;
    slides.forEach((slide, i) => {
      slide.hidden = i !== index;
    });
  }

  openers.forEach((btn) => {
    btn.addEventListener('click', () => {
      show(Number(btn.dataset.index ?? 0));
      dialog.showModal();
    });
  });

  prevBtn?.addEventListener('click', () => show(prevSlideIndex(current, slides.length)));
  nextBtn?.addEventListener('click', () => show(nextSlideIndex(current, slides.length)));

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      show(prevSlideIndex(current, slides.length));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      show(nextSlideIndex(current, slides.length));
    }
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  closeBtn?.addEventListener('click', () => dialog.close());
}

(() => {
  'use strict';

  const preview = document.querySelector('[data-glimpse-total]');
  if (!preview) return;

  const image = preview.querySelector('[data-glimpse-page]');
  const status = preview.querySelector('[data-page-status]');
  const selectedCount = preview.querySelector('[data-selected-index]');
  const previousButton = preview.querySelector('[data-page-step="previous"]');
  const nextButton = preview.querySelector('[data-page-step="next"]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pages = [
    { number: 4, alt: 'Introduction page with story text and an illustration of Yue.' },
    { number: 5, alt: 'Blue and white contents page listing four parts of the book.' },
    { number: 8, alt: 'Expressive blue typography arranged around the question of when to begin.' },
    { number: 9, alt: 'Story page introducing Yue at the beginning of a new chapter in her life.' },
    { number: 13, alt: 'Typographic page about growth set in oversized yellow letters.' },
    { number: 15, alt: 'Blue section divider introducing the book section titled Purpose.' },
    { number: 18, alt: 'Reflective writing prompt with ruled lines and an illustration of a hand writing.' },
    { number: 21, alt: 'Blue and white display typography arranged to read Be You Tiful.' },
    { number: 31, alt: 'Illustrated wheel of feelings on a reflective page.' },
    { number: 34, alt: 'Three sequential illustrations of Yue in a yellow shirt.' },
    { number: 42, alt: 'Full-page night illustration of a figure standing on a glowing star.' },
    { number: 43, alt: 'Activity page with a heart-shaped maze and two small illustrated characters.' },
    { number: 47, alt: 'Blue journal page with five questions arranged around a yellow circle.' },
    { number: 51, alt: 'Yellow illustrated page titled Her Spark Is Back.' },
    { number: 61, alt: 'Blue and yellow expressive typography page reading Go Little Rockstar.' },
    { number: 64, alt: 'Illustration of glowing fireflies above a jar with the words You Glow Girl.' }
  ].map((page) => ({
    ...page,
    src: `../assets/moonlight/preview/page-${String(page.number).padStart(2, '0')}.webp`
  }));

  let currentIndex = pages.findIndex((page) => page.number === Number(image?.dataset.pageNumber));
  if (currentIndex < 0) currentIndex = 0;
  let requestId = 0;
  const imageCache = new Map();

  function loadPage(index) {
    if (imageCache.has(index)) return imageCache.get(index);
    const page = pages[index];
    const preload = new Image();
    preload.decoding = 'async';
    const ready = new Promise((resolve, reject) => {
      preload.onload = () => {
        if (typeof preload.decode === 'function') preload.decode().then(() => resolve(true), reject);
        else resolve(true);
      };
      preload.onerror = () => reject(new Error(`Could not load selected book page ${page.number}.`));
    });
    preload.src = new URL(page.src, document.baseURI).href;
    imageCache.set(index, ready);
    return ready;
  }

  function prefetch(index) {
    if (index < 0 || index >= pages.length) return;
    loadPage(index).catch(() => {});
  }

  function updateControls() {
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === pages.length - 1;
    selectedCount.textContent = String(currentIndex + 1).padStart(2, '0');
    status.textContent = `PAGE ${String(pages[currentIndex].number).padStart(2, '0')} / 74`;
  }

  async function showPage(index) {
    const nextIndex = Math.max(0, Math.min(pages.length - 1, index));
    if (nextIndex === currentIndex) return;

    currentIndex = nextIndex;
    const thisRequest = ++requestId;
    updateControls();
    const page = pages[currentIndex];

    try {
      await loadPage(currentIndex);
    } catch (error) {
      if (thisRequest === requestId) status.textContent = error.message;
      return;
    }
    if (thisRequest !== requestId) return;

    const noMotion = reducedMotion.matches || document.documentElement.classList.contains('motion-paused');
    if (!noMotion) {
      image.classList.add('is-changing');
      await new Promise((resolve) => window.setTimeout(resolve, 120));
      if (thisRequest !== requestId) return;
    }

    image.src = new URL(page.src, document.baseURI).href;
    image.alt = page.alt;
    image.dataset.pageNumber = String(page.number);
    if (noMotion) image.classList.remove('is-changing');
    else requestAnimationFrame(() => image.classList.remove('is-changing'));
    prefetch(currentIndex - 1);
    prefetch(currentIndex + 1);
  }

  previousButton.addEventListener('click', () => showPage(currentIndex - 1));
  nextButton.addEventListener('click', () => showPage(currentIndex + 1));
  updateControls();
  prefetch(currentIndex + 1);
})();

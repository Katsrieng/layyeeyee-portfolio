(() => {
  'use strict';

  const dialog = document.querySelector('[data-photo-viewer]');
  if (!dialog) return;

  const photos = [...document.querySelectorAll('[data-photo-index]')].map((button) => {
    const image = button.querySelector('img');
    return image ? { src: new URL(image.getAttribute('src'), document.baseURI).href, alt: image.alt } : null;
  }).filter(Boolean);
  const viewerImage = dialog.querySelector('[data-photo-viewer-image]');
  const count = dialog.querySelector('[data-photo-count]');
  const caption = dialog.querySelector('[data-photo-caption]');
  const closeButton = dialog.querySelector('[data-photo-close]');
  const previousButton = dialog.querySelector('[data-photo-previous]');
  const nextButton = dialog.querySelector('[data-photo-next]');
  const preloaded = new Map();
  let activeIndex = 0;
  let sequence = 0;
  let closeTimer = 0;
  let lastTrigger = null;

  function preload(index) {
    const photo = photos[(index + photos.length) % photos.length];
    if (preloaded.has(photo.src)) return preloaded.get(photo.src);
    const image = new Image();
    const pending = new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = reject;
    });
    image.src = photo.src;
    preloaded.set(photo.src, pending);
    return pending;
  }

  function preloadAdjacent(index) {
    if (photos.length < 2) return;
    preload(index - 1).catch(() => {});
    preload(index + 1).catch(() => {});
  }

  function showPhoto(index, animate = true) {
    activeIndex = (index + photos.length) % photos.length;
    const photo = photos[activeIndex];
    const request = ++sequence;
    if (animate) viewerImage.classList.add('is-changing');

    preload(activeIndex).then((loadedImage) => {
      if (request !== sequence) return;
      viewerImage.src = loadedImage.src;
      viewerImage.alt = photo.alt;
      const number = `${String(activeIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
      count.textContent = number;
      caption.textContent = number;
      requestAnimationFrame(() => viewerImage.classList.remove('is-changing'));
      preloadAdjacent(activeIndex);
    }).catch(() => {
      if (request === sequence) count.textContent = 'PHOTOGRAPH COULD NOT BE LOADED';
    });
  }

  function openViewer(index, trigger) {
    if (!photos.length || dialog.open) return;
    window.clearTimeout(closeTimer);
    dialog.classList.remove('is-closing');
    lastTrigger = trigger;
    document.body.classList.add('photo-viewer-open');
    dialog.showModal();
    showPhoto(index, false);
    closeButton.focus();
  }

  function closeViewer() {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    dialog.classList.add('is-closing');
    closeTimer = window.setTimeout(() => {
      if (dialog.open) dialog.close();
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420);
  }

  document.querySelectorAll('[data-photo-index]').forEach((button) => {
    button.addEventListener('click', () => openViewer(Number(button.dataset.photoIndex) || 0, button));
  });
  previousButton.addEventListener('click', () => showPhoto(activeIndex - 1));
  nextButton.addEventListener('click', () => showPhoto(activeIndex + 1));
  closeButton.addEventListener('click', closeViewer);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeViewer();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeViewer();
  });
  dialog.addEventListener('close', () => {
    window.clearTimeout(closeTimer);
    dialog.classList.remove('is-closing');
    document.body.classList.remove('photo-viewer-open');
    if (lastTrigger?.isConnected) lastTrigger.focus();
  });
  document.addEventListener('keydown', (event) => {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPhoto(activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(activeIndex + 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeViewer();
    }
  });
})();

(() => {
  'use strict';

  const dialog = document.querySelector('[data-poster-viewer]');
  if (!dialog) return;

  const posters = [...document.querySelectorAll('[data-poster-art]')].map((button) => {
    const image = button.querySelector('img');
    return {
      src: new URL(image.getAttribute('src'), document.baseURI).href,
      alt: image.alt,
      kind: button.dataset.posterKind || (Number(button.dataset.posterIndex) < 3 ? 'PRODUCT VISUAL' : 'VISUAL DESIGN')
    };
  });
  const viewerImage = dialog.querySelector('[data-viewer-image]');
  const viewerCaption = dialog.querySelector('[data-viewer-caption]');
  const viewerStatus = dialog.querySelector('[data-viewer-status]');
  const closeButton = dialog.querySelector('[data-poster-close]');
  const previousButton = dialog.querySelector('[data-poster-previous]');
  const nextButton = dialog.querySelector('[data-poster-next]');
  const loaded = new Map();
  let activeIndex = 0;
  let lastTrigger = null;
  let sequence = 0;
  let closeTimer = 0;

  function preload(index) {
    const poster = posters[(index + posters.length) % posters.length];
    if (loaded.has(poster.src)) return loaded.get(poster.src);
    const image = new Image();
    const promise = new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = reject;
    });
    image.src = poster.src;
    loaded.set(poster.src, promise);
    return promise;
  }

  function preloadNeighbors(index) {
    if (posters.length < 2) return;
    preload(index - 1).catch(() => {});
    preload(index + 1).catch(() => {});
  }

  function display(index, animate = true) {
    activeIndex = (index + posters.length) % posters.length;
    const poster = posters[activeIndex];
    const thisSequence = ++sequence;
    if (animate) viewerImage.classList.add('is-changing');

    preload(activeIndex).then((image) => {
      if (thisSequence !== sequence) return;
      viewerImage.src = image.src;
      viewerImage.alt = poster.alt;
      viewerCaption.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${poster.kind}`;
      viewerStatus.textContent = `POSTER ${String(activeIndex + 1).padStart(2, '0')} / ${String(posters.length).padStart(2, '0')}`;
      requestAnimationFrame(() => viewerImage.classList.remove('is-changing'));
      preloadNeighbors(activeIndex);
    }).catch(() => {
      if (thisSequence === sequence) viewerStatus.textContent = 'THIS POSTER COULD NOT BE LOADED';
    });
  }

  function openViewer(index, trigger) {
    if (!posters.length || dialog.open) return;
    window.clearTimeout(closeTimer);
    dialog.classList.remove('is-closing');
    lastTrigger = trigger;
    document.body.classList.add('poster-viewer-open');
    dialog.showModal();
    display(index, false);
    closeButton.focus();
  }

  function closeViewer() {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    dialog.classList.add('is-closing');
    closeTimer = window.setTimeout(() => {
      if (dialog.open) dialog.close();
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 350);
  }

  document.querySelectorAll('[data-poster-index]').forEach((button) => {
    button.addEventListener('click', () => {
      openViewer(Number(button.dataset.posterIndex) || 0, button);
    });
  });
  closeButton.addEventListener('click', closeViewer);
  previousButton.addEventListener('click', () => display(activeIndex - 1));
  nextButton.addEventListener('click', () => display(activeIndex + 1));
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
    document.body.classList.remove('poster-viewer-open');
    if (lastTrigger?.isConnected) lastTrigger.focus();
  });
  document.addEventListener('keydown', (event) => {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      display(activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      display(activeIndex + 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeViewer();
    }
  });
})();

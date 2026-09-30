(() => {
  'use strict';

  const showcase = document.querySelector('[data-school-showcase]');
  if (!showcase) return;

  const canvas = showcase.querySelector('[data-school-canvas]');
  const status = showcase.querySelector('[data-school-status]');
  const controls = [...showcase.querySelectorAll('[data-school-screen]')];
  const layers = [...showcase.querySelectorAll('[data-school-layer]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const preloaded = new Map();
  let activeKey = 'home';
  let isTransitioning = false;
  let queuedKey = null;

  const decodeScreen = (control) => new Promise((resolve) => {
    const src = new URL(control.dataset.screenSrc, document.baseURI).href;
    const image = layers.find((layer) => layer.dataset.schoolLayer === control.dataset.schoolScreen);
    if (!image || image.src !== src) {
      resolve(null);
      return;
    }
    image.decoding = 'async';
    const ready = () => resolve(image.naturalWidth > 0 ? { image, src } : null);
    if (typeof image.decode === 'function') {
      image.decode().then(ready, () => resolve(null));
    } else if (image.complete) {
      resolve(image.naturalWidth > 0 ? { image, src } : null);
    } else {
      image.addEventListener('load', ready, { once: true });
      image.addEventListener('error', () => resolve(null), { once: true });
    }
  });

  const finishTransition = (nextKey) => {
    const previous = layers.find((layer) => layer.dataset.schoolLayer === activeKey);
    const incoming = layers.find((layer) => layer.dataset.schoolLayer === nextKey);
    activeKey = nextKey;
    isTransitioning = false;
    if (previous) previous.setAttribute('aria-hidden', 'true');
    if (incoming) incoming.removeAttribute('aria-hidden');
    if (queuedKey && queuedKey !== activeKey) {
      const queued = queuedKey;
      queuedKey = null;
      showScreen(queued);
    } else {
      queuedKey = null;
    }
  };

  const showScreen = (key) => {
    if (!preloaded.size) {
      queuedKey = key;
      return;
    }
    if (isTransitioning) {
      queuedKey = key;
      return;
    }
    if (key === activeKey) return;

    const control = controls.find((item) => item.dataset.schoolScreen === key);
    const imageData = preloaded.get(key);
    const incoming = layers.find((layer) => layer.dataset.schoolLayer === key);
    const previous = layers.find((layer) => layer.dataset.schoolLayer === activeKey);
    if (!control || !imageData || !incoming || !previous) {
      status.textContent = 'This screen could not be loaded.';
      return;
    }

    isTransitioning = true;
    incoming.alt = control.dataset.screenAlt || '';
    previous.alt = '';
    incoming.classList.add('is-active');
    previous.classList.remove('is-active');
    canvas.style.aspectRatio = `${imageData.image.naturalWidth} / ${imageData.image.naturalHeight}`;
    controls.forEach((item) => item.setAttribute('aria-pressed', String(item === control)));
    status.textContent = `SHOWING SCREEN ${control.textContent.trim().replace(/\s+/g, ' — ')}`;

    if (reducedMotion.matches || document.documentElement.classList.contains('motion-paused')) {
      finishTransition(key);
      return;
    }
    incoming.addEventListener('transitionend', (event) => {
      if (event.propertyName === 'opacity') finishTransition(key);
    }, { once: true });
  };

  controls.forEach((control) => {
    control.addEventListener('click', () => showScreen(control.dataset.schoolScreen));
  });

  Promise.all(controls.map((control) => decodeScreen(control))).then((results) => {
    results.forEach((result, index) => {
      if (result) preloaded.set(controls[index].dataset.schoolScreen, result);
    });
    controls.forEach((control) => {
      if (!preloaded.has(control.dataset.schoolScreen)) control.disabled = true;
    });
    const home = preloaded.get(activeKey);
    if (home) canvas.style.aspectRatio = `${home.image.naturalWidth} / ${home.image.naturalHeight}`;
    if (preloaded.size !== controls.length) {
      status.textContent = 'Some website screens could not be loaded.';
      return;
    }
    if (queuedKey) {
      const queued = queuedKey;
      queuedKey = null;
      showScreen(queued);
    }
  });
})();

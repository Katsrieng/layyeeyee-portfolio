(() => {
  'use strict';

  const showcase = document.querySelector('[data-prime-showcase]');
  if (!showcase) return;

  const controls = [...showcase.querySelectorAll('[data-prime-control]')];
  const layers = [...showcase.querySelectorAll('[data-prime-layer]')];
  const caption = showcase.querySelector('[data-prime-caption]');
  const status = document.querySelector('[data-prime-status]');
  let activeKey = layers.find((image) => image.classList.contains('is-active'))?.dataset.primeLayer;

  function showSpread(key) {
    const control = controls.find((button) => button.dataset.primeControl === key);
    const selected = layers.find((image) => image.dataset.primeLayer === key);
    if (!control || !selected) return;

    activeKey = key;
    controls.forEach((button) => {
      button.setAttribute('aria-pressed', String(button === control));
    });
    layers.forEach((image) => {
      const active = image === selected;
      image.classList.toggle('is-active', active);
      image.setAttribute('aria-hidden', String(!active));
      image.alt = active ? image.dataset.primeAlt || '' : '';
    });

    const index = control.dataset.primeIndex;
    const label = control.dataset.primeLabel;
    const page = control.dataset.primePage;
    if (caption) caption.textContent = `${label} / PDF PAGE ${page}`;
    if (status) status.textContent = `SHOWING ${index} / 06 — ${label} · PDF PAGE ${page}`;
  }

  controls.forEach((button) => {
    button.addEventListener('click', () => showSpread(button.dataset.primeControl));
  });

  const decodeLayer = async (image) => {
    try {
      if (typeof image.decode === 'function') {
        await image.decode();
        return image.naturalWidth !== 0;
      }
      if (image.complete) return image.naturalWidth > 0;
      return await new Promise((resolve) => {
        image.addEventListener('load', () => resolve(true), { once: true });
        image.addEventListener('error', () => resolve(false), { once: true });
      });
    } catch {
      return false;
    }
  };

  Promise.all(layers.map(decodeLayer)).then((loaded) => {
    loaded.forEach((success, index) => {
      if (success) return;
      const key = layers[index].dataset.primeLayer;
      const control = controls.find((button) => button.dataset.primeControl === key);
      if (control) control.disabled = true;
    });
    if (loaded.some((success) => !success) && status) {
      status.textContent = 'Some guideline spreads could not be loaded.';
    }
  });
})();

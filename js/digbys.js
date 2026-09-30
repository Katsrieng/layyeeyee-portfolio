(() => {
  'use strict';

  const showcase = document.querySelector('[data-digby-showcase]');
  if (!showcase) return;

  const controls = [...showcase.querySelectorAll('[data-digby-view]')];
  const layers = [...showcase.querySelectorAll('[data-digby-layer]')];
  const caption = showcase.querySelector('[data-digby-caption]');
  const status = showcase.querySelector('[data-digby-status]');
  const captions = {
    oysters: 'OYSTER APPETIZER / PROMOTION',
    totes: 'STEAK ILLUSTRATION / TOTE APPLICATIONS'
  };
  const statusLabels = {
    oysters: '01 — OYSTER PROMOTION',
    totes: '02 — TOTE APPLICATIONS'
  };

  function showApplication(key) {
    const control = controls.find((item) => item.dataset.digbyView === key);
    const activeLayer = layers.find((image) => image.dataset.digbyLayer === key);
    if (!control || !activeLayer) return;

    controls.forEach((item) => item.setAttribute('aria-pressed', String(item === control)));
    layers.forEach((image) => {
      const active = image === activeLayer;
      image.classList.toggle('is-active', active);
      image.setAttribute('aria-hidden', String(!active));
      if (active) image.alt = image.dataset.digbyAlt || image.alt;
      else image.alt = '';
    });

    if (caption) caption.textContent = captions[key];
    if (status) status.textContent = `SHOWING ${statusLabels[key]}`;
  }

  controls.forEach((control) => {
    control.addEventListener('click', () => showApplication(control.dataset.digbyView));
  });

  layers.forEach((image) => {
    image.dataset.digbyAlt = image.alt;
    if (typeof image.decode === 'function') image.decode().catch(() => {});
  });
})();

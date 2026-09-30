(() => {
  'use strict';

  const stage = document.querySelector('[data-shirt-stage]');
  if (!stage) return;

  const image = stage.querySelector('[data-shirt-image]');
  const motionLayer = stage.querySelector('[data-shirt-motion]');
  const caption = stage.querySelector('[data-shirt-caption]');
  const status = document.querySelector('[data-shirt-status]');
  const colorButtons = [...document.querySelectorAll('[data-color-choice]')];
  const viewButtons = [...document.querySelectorAll('[data-view-choice]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gsap = window.gsap;
  const views = {
    'black-front': { src: '../assets/unnegotiable/image55.png', alt: 'Black T-shirt mockup, front view with Unnegotiable typography' },
    'black-back': { src: '../assets/unnegotiable/image55.png', alt: 'Black T-shirt mockup, back view with the portrait graphic' },
    'white-front': { src: '../assets/unnegotiable/white shirt.jpg', alt: 'White Unnegotiable T-shirt mockup, front view with layered typography' },
    'white-back': { src: '../assets/unnegotiable/white shirt back.jpg', alt: 'White Unnegotiable T-shirt mockup, back view with portrait artwork' }
  };

  let color = 'black';
  let view = 'front';
  let requestId = 0;
  let transitionTween = null;

  // The black mockup contains both sides; the white sides use their separate assets.
  const imageReady = new Map();
  [...new Set(Object.values(views).map((item) => item.src))].forEach((src) => {
    const preload = new Image();
    preload.decoding = 'async';
    preload.src = new URL(src, document.baseURI).href;
    const ready = typeof preload.decode === 'function'
      ? preload.decode().then(() => true).catch(() => false)
      : new Promise((resolve) => {
          if (preload.complete) resolve(preload.naturalWidth > 0);
          else {
            preload.addEventListener('load', () => resolve(true), { once: true });
            preload.addEventListener('error', () => resolve(false), { once: true });
          }
        });
    imageReady.set(src, ready);
  });

  function renderControls() {
    colorButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.colorChoice === color));
    });
    viewButtons.forEach((button) => {
      const active = button.dataset.viewChoice === view;
      button.setAttribute('aria-pressed', String(active));
    });

    const label = `${color.toUpperCase()} / ${view.toUpperCase()}`;
    if (caption) caption.textContent = label;
    if (status) status.textContent = label;
  }

  function renderShirt(nextColor, nextView) {
    const next = views[`${nextColor}-${nextView}`];
    if (!next) return;
    stage.dataset.shirtColor = nextColor;
    stage.dataset.shirtView = nextView;
    image.src = next.src;
    image.alt = next.alt;
  }

  function stopTransition() {
    if (transitionTween) transitionTween.kill();
    transitionTween = null;
  }

  function setState(nextColor, nextView, direction) {
    if (!views[`${nextColor}-${nextView}`]) return;
    if (color === nextColor && view === nextView) return;

    color = nextColor;
    view = nextView;
    const thisRequest = ++requestId;
    renderControls();

    const next = views[`${color}-${view}`];
    imageReady.get(next.src)?.then((loaded) => {
      if (thisRequest !== requestId) return;
      if (!loaded) {
        if (status) status.textContent = 'This shirt view could not be loaded.';
        return;
      }

      stopTransition();
      const motionPaused = document.documentElement.classList.contains('motion-paused');
      if (reducedMotion.matches || motionPaused || !gsap || !motionLayer) {
        renderShirt(color, view);
        if (gsap && motionLayer) gsap.set(motionLayer, { clearProps: 'transform,opacity' });
        return;
      }

      const currentRotation = Number(gsap.getProperty(motionLayer, 'rotationY')) || 0;
      const turnRotation = direction === 'view'
        ? (currentRotation >= 0 ? 38 : -38)
        : (currentRotation >= 0 ? 6 : -6);

      transitionTween = gsap.timeline({ defaults: { overwrite: 'auto' } });
      transitionTween.to(motionLayer, {
        opacity: .56,
        scaleX: .91,
        scaleY: 1.04,
        rotationY: turnRotation,
        duration: .27,
        ease: 'power2.in'
      });
      transitionTween.call(() => {
        if (thisRequest === requestId) renderShirt(color, view);
      });
      transitionTween.to(motionLayer, {
        opacity: 1,
        scaleX: 1.14,
        scaleY: 1.14,
        rotationY: 0,
        duration: .3,
        ease: 'power3.out'
      });
    });
  }

  colorButtons.forEach((button) => button.addEventListener('click', () => {
    const nextColor = button.dataset.colorChoice;
    setState(nextColor, view, 'color');
  }));
  viewButtons.forEach((button) => button.addEventListener('click', () => {
    setState(color, button.dataset.viewChoice, 'view');
  }));

  function syncMotionPreference() {
    const paused = reducedMotion.matches || document.documentElement.classList.contains('motion-paused');
    if (!paused) return;
    requestId += 1;
    stopTransition();
    renderShirt(color, view);
    if (gsap && motionLayer) gsap.set(motionLayer, { clearProps: 'transform,opacity' });
  }

  document.addEventListener('portfolio:motionchange', syncMotionPreference);
  reducedMotion.addEventListener('change', syncMotionPreference);
  renderControls();
})();

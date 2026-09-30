(() => {
  'use strict';

  const toggle = document.querySelector('[data-lovento-toggle]');
  const reveal = document.querySelector('[data-lovento-reveal]');
  if (!toggle || !reveal) return;

  const closedImage = reveal.querySelector('[data-package-closed]');
  const openImage = reveal.querySelector('[data-package-open]');
  const label = toggle.querySelector('[data-toggle-label]');

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(isOpen));
    reveal.classList.toggle('is-open', isOpen);
    if (closedImage) closedImage.setAttribute('aria-hidden', String(isOpen));
    if (openImage) openImage.setAttribute('aria-hidden', String(!isOpen));
    if (label) label.textContent = isOpen ? 'CLOSE THE BOX' : 'OPEN THE BOX';
  });
})();

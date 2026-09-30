(() => {
  'use strict';

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  const mobile = window.matchMedia('(max-width: 767px)');
  let menuOpen = false;

  function setMenu(open, returnFocus = false) {
    menuOpen = open && mobile.matches;
    nav.classList.toggle('is-open', menuOpen);
    document.body.classList.toggle('menu-open', menuOpen);
    toggle.setAttribute('aria-expanded', String(menuOpen));
    toggle.innerHTML = menuOpen ? 'CLOSE <span aria-hidden="true">−</span>' : 'MENU <span aria-hidden="true">+</span>';
    main.inert = menuOpen;
    footer.inert = menuOpen;
    if (menuOpen) nav.querySelector('a').focus();
    if (returnFocus) toggle.focus();
  }

  if (toggle && nav) {
    document.documentElement.classList.add('menu-ready');
    toggle.hidden = !mobile.matches;
    toggle.addEventListener('click', () => setMenu(!menuOpen, menuOpen));
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a') && menuOpen) setMenu(false);
    });
    document.addEventListener('keydown', (event) => {
      if (!menuOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenu(false, true);
      }
      if (event.key === 'Tab') {
        const items = [toggle, ...nav.querySelectorAll('a')];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    mobile.addEventListener('change', () => {
      const toggleHadFocus = document.activeElement === toggle;
      setMenu(false);
      toggle.hidden = !mobile.matches;
      if (toggleHadFocus && !mobile.matches) nav.querySelector('a').focus();
    });
  }

  const motionToggle = document.querySelector('.motion-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let manuallyPaused = false;
  try { manuallyPaused = localStorage.getItem('portfolio-motion-paused') === 'true'; } catch { /* Storage is optional. */ }

  function updateMotionPreference() {
    const paused = manuallyPaused || reducedMotion.matches;
    document.documentElement.classList.toggle('motion-paused', paused);
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.disabled = reducedMotion.matches;
    motionToggle.innerHTML = paused ? 'MOTION OFF <span aria-hidden="true">○</span>' : 'PAUSE MOTION <span aria-hidden="true">Ⅱ</span>';
    motionToggle.title = reducedMotion.matches ? 'Reduced motion is enabled in your system settings' : paused ? 'Resume animation' : 'Pause animation';
    document.dispatchEvent(new CustomEvent('portfolio:motionchange', { detail: { paused } }));
  }

  motionToggle.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    try { localStorage.setItem('portfolio-motion-paused', String(manuallyPaused)); } catch { /* Keep the control usable without storage. */ }
    updateMotionPreference();
  });
  reducedMotion.addEventListener('change', updateMotionPreference);
  updateMotionPreference();
})();

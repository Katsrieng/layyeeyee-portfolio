(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setupScreenSwitcher(switcher) {
    const screen = switcher.querySelector('.project-screen-image');
    const viewport = switcher.querySelector('.project-screen-window');
    const status = switcher.querySelector('.project-screen-status');
    const controls = [...switcher.querySelectorAll('.showcase-control[data-screen-src]')];
    let requestId = 0;

    if (!screen || controls.length === 0) return;

    controls.forEach((control) => {
      control.addEventListener('click', () => {
        const src = control.dataset.screenSrc;
        if (!src || new URL(src, document.baseURI).href === screen.src) return;

        const thisRequest = ++requestId;
        const preload = new Image();
        preload.onload = () => {
          if (thisRequest !== requestId) return;

          screen.classList.add('is-switching');
          const changeScreen = () => {
            if (thisRequest !== requestId) return;
            screen.src = preload.src;
            screen.alt = control.dataset.screenAlt || '';
            screen.classList.remove('screen-fit-full', 'screen-fit-wide', 'screen-fit-compact');
            screen.classList.add(`screen-fit-${control.dataset.screenFit || 'full'}`);
            controls.forEach((item) => item.setAttribute('aria-pressed', String(item === control)));
            if (status) status.textContent = `Showing screen ${control.textContent.trim().replace(/\s+/g, ' — ')}`;
            if (viewport) viewport.scrollTop = 0;
            requestAnimationFrame(() => screen.classList.remove('is-switching'));
          };

          if (reducedMotion.matches || document.documentElement.classList.contains('motion-paused')) changeScreen();
          else window.setTimeout(changeScreen, 140);
        };
        preload.onerror = () => {
          if (thisRequest === requestId && status) status.textContent = 'This screen could not be loaded.';
        };
        preload.src = new URL(src, document.baseURI).href;
      });
    });
  }

  document.querySelectorAll('[data-project-switcher]').forEach(setupScreenSwitcher);

  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  let pageContext;

  function syncMotion() {
    if (pageContext) pageContext.revert();
    pageContext = null;
    const paused = reducedMotion.matches || document.documentElement.classList.contains('motion-paused');
    if (paused) return;

    pageContext = gsap.matchMedia();
    pageContext.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.case-title-line', {
        yPercent: 108,
        duration: 1.08,
        delay: .1,
        ease: 'power3.out'
      });
      gsap.from('.case-hero-top, .case-number, .case-category', {
        opacity: 0,
        y: 14,
        duration: .82,
        stagger: .1,
        delay: .15,
        ease: 'power2.out'
      });

      gsap.utils.toArray('[data-case-reveal]').forEach((element) => {
        const direction = element.dataset.caseReveal;
        const start = direction === 'left'
          ? { x: -28, opacity: 0 }
          : direction === 'side'
            ? { clipPath: 'inset(0 0 0 100%)', opacity: .6 }
            : direction === 'scale'
              ? { scale: .96, opacity: .5 }
              : { y: 26, opacity: 0 };

        gsap.from(element, {
          ...start,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 84%', once: true }
        });
      });

    });
    ScrollTrigger.refresh();
  }

  document.addEventListener('portfolio:motionchange', syncMotion);
  reducedMotion.addEventListener('change', syncMotion);
  document.querySelectorAll('img').forEach((image) => {
    if (!image.complete) image.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  });
  window.addEventListener('pageshow', () => ScrollTrigger.refresh());
  syncMotion();
})();

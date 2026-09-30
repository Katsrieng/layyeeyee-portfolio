(() => {
  'use strict';

  const hasGsap = window.gsap && window.ScrollTrigger;
  if (!hasGsap) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let pageContext;

  function animatePage() {
    const context = gsap.matchMedia();
    context.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.projects-title-mask > span', {
        yPercent: 112, duration: 1.05, stagger: .14, ease: 'power3.out', delay: .12
      });
      gsap.from('.projects-intro-top, .projects-index-label, .projects-intro-note, .projects-index-hint', {
        opacity: 0, y: 12, duration: .7, stagger: .08, ease: 'power2.out'
      });

      gsap.utils.toArray('[data-project-reveal]').forEach((visual) => {
        const type = visual.dataset.projectReveal;
        const from = type === 'side'
          ? { clipPath: 'inset(0 100% 0 0)' }
          : type === 'scale'
            ? { scale: .94, opacity: .45 }
            : { clipPath: 'inset(12% 0 0 0)', y: 26, opacity: .35 };
        gsap.from(visual, {
          ...from,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: visual, start: 'top 82%', once: true }
        });
      });

      gsap.utils.toArray('.feature-info').forEach((info) => {
        const number = info.querySelector('.feature-number');
        const metadata = info.querySelector('.feature-name-wrap');
        gsap.from([number, metadata], {
          x: (index) => (index === 0 ? -16 : 0),
          y: (index) => (index === 1 ? 14 : 0),
          opacity: 0,
          duration: .9,
          stagger: .11,
          ease: 'power2.out',
          scrollTrigger: { trigger: info, start: 'top 84%', once: true }
        });
      });

      gsap.from('.more-work-heading > *, .more-project-row', {
        opacity: 0,
        y: 18,
        stagger: .08,
        duration: .82,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.more-work', start: 'top 82%', once: true }
      });
      gsap.from('.projects-photo-heading > *, .photo-frame', {
        opacity: 0,
        y: 18,
        stagger: .11,
        duration: .9,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.projects-photography', start: 'top 82%', once: true }
      });

      const photoContext = gsap.matchMedia();
      photoContext.add('(min-width: 768px)', () => {
        gsap.utils.toArray('[data-photo-depth]').forEach((frame) => {
          const depth = Number(frame.dataset.photoDepth);
          gsap.to(frame.querySelector('img'), {
            yPercent: depth * 5,
            ease: 'none',
            scrollTrigger: {
              trigger: frame,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            }
          });
        });
      });
      return () => photoContext.revert();
    });
    return context;
  }

  function setupHoverPreviews() {
    if (reduceMotion.matches || !finePointer.matches) return;
    document.querySelectorAll('[data-preview-row]').forEach((row) => {
      const image = row.querySelector('.more-preview');
      const moveX = gsap.quickTo(image, 'x', { duration: .32, ease: 'power3.out' });
      const moveY = gsap.quickTo(image, 'y', { duration: .32, ease: 'power3.out' });
      const showAt = (clientX, clientY) => {
        const bounds = row.getBoundingClientRect();
        const width = image.getBoundingClientRect().width || 220;
        const height = image.getBoundingClientRect().height || 150;
        moveX(gsap.utils.clamp(12, Math.max(12, bounds.width - width - 12), clientX - bounds.left + 18));
        moveY(gsap.utils.clamp(2, Math.max(2, bounds.height - height / 2), clientY - bounds.top - height / 2));
        gsap.to(image, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', scale: 1, rotation: 0, duration: .35, ease: 'power2.out', overwrite: 'auto' });
      };
      row.addEventListener('pointerenter', (event) => showAt(event.clientX, event.clientY));
      row.addEventListener('pointermove', (event) => showAt(event.clientX, event.clientY));
      row.addEventListener('pointerleave', () => gsap.to(image, { autoAlpha: 0, clipPath: 'inset(8% 8% 8% 8%)', scale: .94, rotation: -3, duration: .24, ease: 'power2.inOut', overwrite: 'auto' }));
      row.addEventListener('focusin', () => {
        const bounds = row.getBoundingClientRect();
        showAt(bounds.left + bounds.width * .6, bounds.top + bounds.height / 2);
      });
      row.addEventListener('focusout', (event) => {
        if (!row.contains(event.relatedTarget)) gsap.to(image, { autoAlpha: 0, clipPath: 'inset(8% 8% 8% 8%)', scale: .94, rotation: -3, duration: .24, ease: 'power2.inOut', overwrite: 'auto' });
      });
    });
  }

  function syncMotion() {
    if (pageContext) pageContext.revert();
    pageContext = null;
    const paused = document.documentElement.classList.contains('motion-paused') || reduceMotion.matches;
    if (!paused) {
      pageContext = animatePage();
      ScrollTrigger.refresh();
    }
  }

  function refreshImages() {
    document.querySelectorAll('img').forEach((image) => {
      if (!image.complete) image.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    });
  }

  document.addEventListener('portfolio:motionchange', syncMotion);
  reduceMotion.addEventListener('change', syncMotion);
  window.addEventListener('pageshow', () => ScrollTrigger.refresh());
  refreshImages();
  setupHoverPreviews();
  syncMotion();
})();

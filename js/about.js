(() => {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pageContext;

  function addEntrance(target, trigger, from, options = {}) {
    gsap.from(target, {
      ...from,
      duration: options.duration || .95,
      stagger: options.stagger || 0,
      ease: options.ease || 'power3.out',
      scrollTrigger: { trigger, start: options.start || 'top 82%', once: true }
    });
  }

  function animatePage() {
    const context = gsap.matchMedia();
    context.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.about-title-line', {
        yPercent: 108,
        duration: 1.08,
        stagger: .13,
        delay: .08,
        ease: 'power3.out'
      });
      gsap.from('[data-about-hero-detail]', {
        y: 12,
        opacity: 0,
        duration: .82,
        stagger: .1,
        delay: .25,
        ease: 'power2.out'
      });
      gsap.from('.about-portrait-frame', {
        clipPath: 'inset(0 0 100% 0)',
        y: 18,
        duration: 1.12,
        delay: .18,
        ease: 'power3.out'
      });
      gsap.from('.about-portrait figcaption, .about-portrait-star', {
        opacity: 0,
        y: 10,
        duration: .8,
        stagger: .12,
        delay: .55,
        ease: 'power2.out'
      });

      gsap.utils.toArray('[data-about-line]').forEach((label) => {
        addEntrance(label, label, { y: 12, opacity: 0 }, { duration: .82, ease: 'power2.out' });
      });
      addEntrance('.about-intro-heading, .about-intro-body', '.about-intro-grid', { y: 22, opacity: 0, clipPath: 'inset(0 0 10% 0)' }, { duration: 1, stagger: .12 });
      addEntrance('[data-about-discipline]', '.discipline-list', { x: -18, opacity: 0 }, { duration: .84, stagger: .09, ease: 'power2.out' });
      addEntrance('[data-about-background]', '.background-list', { clipPath: 'inset(0 0 100% 0)', y: 12 }, { duration: .92, stagger: .12 });
      addEntrance('[data-about-tool]', '.tools-list', { y: 14, opacity: 0 }, { duration: .82, stagger: .075, ease: 'power2.out' });
      addEntrance('[data-about-statement]', '.about-statement-body', { y: 20, opacity: 0, scale: .985 }, { duration: 1.05 });
      addEntrance('[data-about-contact]', '.about-contact-row', { y: 20, opacity: 0 }, { duration: .95 });

      return () => {};
    });
    context.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to('.about-portrait-frame img', {
        yPercent: 2.5,
        scale: 1.025,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: .45
        }
      });
    });
    return context;
  }

  function syncMotion() {
    if (pageContext) pageContext.revert();
    pageContext = null;
    const paused = document.documentElement.classList.contains('motion-paused') || reduceMotion.matches;
    if (paused) return;
    pageContext = animatePage();
    ScrollTrigger.refresh();
  }

  document.addEventListener('portfolio:motionchange', syncMotion);
  reduceMotion.addEventListener('change', syncMotion);
  window.addEventListener('pageshow', () => ScrollTrigger.refresh());
  document.querySelectorAll('img').forEach((image) => {
    if (!image.complete) image.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  });
  syncMotion();
})();

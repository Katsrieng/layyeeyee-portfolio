(() => {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pageContext;

  function animatePage() {
    const context = gsap.matchMedia();
    context.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.contact-image-frame', {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.12,
        delay: .06,
        ease: 'power3.out'
      });
      gsap.from('.contact-portrait figcaption', {
        y: 10,
        opacity: 0,
        duration: .72,
        delay: .35,
        ease: 'power2.out'
      });
      gsap.from('.contact-page-title', {
        y: 18,
        opacity: 0,
        duration: .92,
        delay: .12,
        ease: 'power3.out'
      });
      gsap.from('.contact-panel', {
        clipPath: 'inset(0 0 100% 0)',
        duration: 1,
        delay: .22,
        ease: 'power3.out'
      });
      gsap.from('.contact-title-line', {
        yPercent: 108,
        duration: 1.08,
        stagger: .12,
        delay: .08,
        ease: 'power3.out'
      });
      gsap.from('.contact-top, .contact-kicker, .contact-thought', {
        y: 12,
        opacity: 0,
        duration: .84,
        stagger: .1,
        delay: .2,
        ease: 'power2.out'
      });
      gsap.from('.contact-star', {
        scale: .82,
        opacity: 0,
        rotation: -12,
        duration: .92,
        delay: .34,
        ease: 'power3.out'
      });
      gsap.from('.contact-email-label, .contact-email, .contact-social-label, .contact-social-icon', {
        y: 16,
        opacity: 0,
        duration: .92,
        stagger: .12,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.contact-panel', start: 'top 84%', once: true }
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
  syncMotion();
})();

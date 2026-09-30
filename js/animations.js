(() => {
  'use strict';

  const intro = document.querySelector('.intro');
  const motionButton = document.querySelector('.motion-toggle');
  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  motionButton.hidden = false;
  let motionContext;
  let firstVisit = true;
  let introTimeout;

  function hideIntro() {
    intro.hidden = true;
    window.clearTimeout(introTimeout);
  }

  function animateEntrance(playIntro) {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (playIntro) {
      intro.hidden = false;
      // The timer is a failsafe; content can never be trapped behind an intro.
      introTimeout = window.setTimeout(hideIntro, 1800);
      timeline.from('.intro-name, .intro p', { y: 18, opacity: 0, duration: .4, stagger: .1 })
        .to(intro, { yPercent: -100, duration: .55, ease: 'power3.inOut', onComplete: hideIntro }, .75);
    }
    const start = playIntro ? .95 : 0;
    timeline.from('.hero-line', { yPercent: 115, duration: 1, stagger: .15 }, start)
      .from('.hero-portrait', { clipPath: 'inset(100% 0 0 0)', y: 30, duration: 1 }, start + .1)
      .from('.hero-detail, .hero-portrait figcaption', { y: 14, opacity: 0, stagger: .09, duration: .65 }, start + .45);
  }

  function animateContinuousElements() {
    gsap.to('.rotating-motif', { rotation: '+=360', duration: 55, repeat: -1, ease: 'none' });
    gsap.to('.marquee-track', { xPercent: -50, duration: 38, repeat: -1, ease: 'none' });
    gsap.to('.scroll-cue span', { y: 6, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  function animateProjects() {
    gsap.utils.toArray('[data-reveal]').forEach((visual) => {
      const type = visual.dataset.reveal;
      const from = type === 'side'
        ? { clipPath: 'inset(0 100% 0 0)' }
        : type === 'scale'
          ? { scale: .94, opacity: .4 }
          : { clipPath: 'inset(12% 0 0 0)', y: 35, opacity: .3 };
      gsap.from(visual, {
        ...from,
        duration: 1.2,
        ease: 'power3.out',
        delay: Number(visual.dataset.revealDelay) || 0,
        scrollTrigger: { trigger: visual, start: 'top 82%', once: true }
      });
    });
  }

  function animateScrollDepth() {
    gsap.to('.portrait-frame img', {
      yPercent: 7, scale: 1.12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
    gsap.fromTo('.title-indent', { x: -15 }, {
      x: 15, ease: 'none', scrollTrigger: { trigger: '.section-title', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
    gsap.to('.lovento-card', {
      y: -24, rotation: 5, ease: 'none',
      scrollTrigger: { trigger: '.lovento-stage', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
    gsap.to('.book-cover', {
      y: -16, rotation: -3, ease: 'none',
      scrollTrigger: { trigger: '.moonlight-stage', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
    gsap.to('.photo-strip', {
      x: () => -window.innerWidth * .08, ease: 'none',
      scrollTrigger: { trigger: '.photography', start: 'top 60%', end: 'bottom 15%', scrub: 1, invalidateOnRefresh: true }
    });
  }

  function syncAnimations() {
    hideIntro();
    if (motionContext) motionContext.revert();
    motionContext = gsap.matchMedia();
    const paused = document.documentElement.classList.contains('motion-paused');
    document.documentElement.classList.toggle('motion-enabled', !paused);
    if (paused) {
      firstVisit = false;
      return;
    }
    motionContext.add('(prefers-reduced-motion: no-preference)', () => {
      animateEntrance(firstVisit);
      firstVisit = false;
      animateContinuousElements();
      animateProjects();
      return hideIntro;
    });
    motionContext.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', animateScrollDepth);
    ScrollTrigger.refresh();
  }

  document.addEventListener('portfolio:motionchange', syncAnimations);
  // Lazy assets have explicit dimensions; refresh also covers delayed image decoding.
  document.querySelectorAll('img').forEach((image) => {
    if (!image.complete) image.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  });
  window.addEventListener('pageshow', () => ScrollTrigger.refresh());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) gsap.globalTimeline.pause();
    else gsap.globalTimeline.resume();
  });
  syncAnimations();
})();

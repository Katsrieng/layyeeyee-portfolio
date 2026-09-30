(() => {
  'use strict';

  const stage = document.querySelector('[data-identity-assembly]');
  if (!stage) return;

  const pieces = [...stage.querySelectorAll('.ye-assembly-piece')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let assemblyTween = null;

  function syncAssemblyMotion() {
    if (assemblyTween) {
      assemblyTween.revert();
      assemblyTween = null;
    }

    const motionPaused = document.documentElement.classList.contains('motion-paused');
    if (reducedMotion.matches || motionPaused || !window.gsap || !window.ScrollTrigger) return;

    assemblyTween = window.gsap.fromTo(pieces, {
      autoAlpha: 0,
      x: (index) => index % 2 === 0 ? -26 : 26,
      y: (index) => index < 2 ? -18 : 18,
      rotation: (index) => index % 2 === 0 ? -2 : 2,
      transformOrigin: '50% 50%'
    }, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      rotation: 0,
      duration: .78,
      stagger: .12,
      ease: 'power3.out',
      scrollTrigger: { trigger: stage, start: 'top 80%', once: true }
    });
  }

  document.addEventListener('portfolio:motionchange', syncAssemblyMotion);
  reducedMotion.addEventListener('change', syncAssemblyMotion);
  syncAssemblyMotion();
})();

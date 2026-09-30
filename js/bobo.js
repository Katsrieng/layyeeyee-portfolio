(() => {
  'use strict';

  const reader = document.querySelector('[data-book-reader]');
  if (!reader) return;

  const manifestElement = document.getElementById('bobo-book-pages');
  const book = reader.querySelector('[data-book-stage]');
  const leftPage = reader.querySelector('[data-book-left]');
  const rightPage = reader.querySelector('[data-book-right]');
  const underLeft = reader.querySelector('[data-under-left]');
  const underRight = reader.querySelector('[data-under-right]');
  const underBlank = reader.querySelector('[data-under-blank]');
  const leafFront = reader.querySelector('[data-leaf-front]');
  const leafBack = reader.querySelector('[data-leaf-back]');
  const coverImage = reader.querySelector('[data-book-cover]');
  const openCover = reader.querySelector('[data-book-open]');
  const previousButton = reader.querySelector('[data-book-previous]');
  const nextButton = reader.querySelector('[data-book-next]');
  const closeButton = reader.querySelector('[data-book-close]');
  const status = reader.querySelector('[data-book-status]');
  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const turnDuration = 940;
  const openingDuration = 1020;
  const preloadedImages = new Map();
  let allPageImagesReady = false;
  let sourcePages;
  let sequence = [];
  let current = 0;
  let isTurning = false;
  let mobile = window.matchMedia('(max-width: 767px)').matches;
  let pointerStart = null;
  let turnId = 0;

  try {
    sourcePages = JSON.parse(manifestElement.textContent);
  } catch (error) {
    status.textContent = 'The book preview could not be loaded.';
    return;
  }
  if (!Array.isArray(sourcePages) || sourcePages.length !== 10) {
    status.textContent = 'The book preview could not be loaded.';
    return;
  }

  const preload = (src) => {
    if (!src) return Promise.resolve(true);
    if (preloadedImages.has(src)) return preloadedImages.get(src).ready;
    const image = new Image();
    image.decoding = 'async';
    let resolveReady;
    const entry = { image, ready: new Promise((resolve) => { resolveReady = resolve; }) };
    preloadedImages.set(src, entry);
    const settle = (loaded) => resolveReady(loaded);
    image.addEventListener('load', async () => {
      try {
        if (typeof image.decode === 'function') await image.decode();
        settle(image.naturalWidth > 0);
      } catch (error) {
        settle(false);
      }
    }, { once: true });
    image.addEventListener('error', () => settle(false), { once: true });
    image.src = src;
    if (image.complete && image.naturalWidth > 0) {
      Promise.resolve(typeof image.decode === 'function' ? image.decode() : true)
        .then(() => settle(true), () => settle(false));
    }
    return entry.ready;
  };
  const makeSequence = () => {
    const states = [{
      pdfPage: 1, label: 'COVER', image: sourcePages[0].image,
      alt: sourcePages[0].alt, left: null, right: null,
      turnImage: sourcePages[0].image, reverseImage: sourcePages[0].image
    }];
    sourcePages.slice(1, 9).forEach((page) => {
      if (mobile && page.mobile) {
        page.mobile.forEach((src, side) => states.push({
          pdfPage: page.pdfPage,
          label: `${page.label} / ${side === 0 ? 'LEFT' : 'RIGHT'}`,
          image: src,
          alt: `${page.alt}, ${side === 0 ? 'left' : 'right'} page`,
          left: null,
          right: src,
          turnImage: src,
          reverseImage: src
        }));
      } else {
        states.push({
          pdfPage: page.pdfPage,
          label: page.label,
          image: page.image,
          alt: page.alt,
          left: page.mobile?.[0] || page.image,
          right: page.mobile?.[1] || page.image,
          turnImage: page.mobile?.[1] || page.image,
          reverseImage: page.mobile?.[0] || page.image
        });
      }
    });
    const back = sourcePages[sourcePages.length - 1];
    states.push({
      pdfPage: 10, label: back.label, image: back.image, alt: back.alt,
      left: null, right: back.image,
      turnImage: back.image, reverseImage: back.image
    });
    return states;
  };
  const setImage = (image, src, alt = '') => {
    if (src) {
      image.src = src;
      image.alt = alt;
    } else {
      image.removeAttribute('src');
      image.alt = '';
    }
  };
  const preloadAround = (index) => {
    [index - 1, index, index + 1].forEach((candidate) => {
      const state = sequence[candidate];
      if (!state) return;
      [state.image, state.left, state.right, state.turnImage, state.reverseImage].forEach(preload);
    });
  };
  const updateControls = () => {
    const state = sequence[current];
    const waitingForFinalAssets = !allPageImagesReady && (state.pdfPage === 9 || state.pdfPage === 10);
    previousButton.disabled = isTurning || current <= 0 || (waitingForFinalAssets && state.pdfPage === 10);
    nextButton.disabled = isTurning || current >= sequence.length - 1 || (waitingForFinalAssets && state.pdfPage === 9);
    closeButton.hidden = current === 0;
    openCover.disabled = current !== 0 || isTurning;
    const nextLabel = current === 0 ? 'OPEN BOOK' : current === sequence.length - 1 ? 'THE END' : 'NEXT';
    const arrowIcon = current === sequence.length - 1 ? '' : ' <svg class="site-symbol site-symbol--arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 12h18m-7-7 7 7-7 7"/></svg>';
    nextButton.innerHTML = nextLabel + arrowIcon;
    status.textContent = current === 0
      ? 'CLOSED COVER / TAP TO OPEN'
      : `${state.label} / PDF PAGE ${String(state.pdfPage).padStart(2, '0')} OF 10`;
  };
  const render = (index, { stageTurn = true } = {}) => {
    current = Math.max(0, Math.min(index, sequence.length - 1));
    const state = sequence[current];
    book.classList.toggle('is-open', current > 0);
    book.classList.toggle('is-back-cover', current > 0 && state.pdfPage === 10);
    book.classList.toggle('is-final-page', current > 0 && state.pdfPage === 10);
    setImage(leftPage, state.left, state.left ? `${state.alt}, left page` : '');
    setImage(rightPage, state.right, state.right ? `${state.alt}, right page` : '');
    const following = sequence[current + 1];
    underBlank.hidden = !(following && following.pdfPage === 10);
    setImage(underLeft, following?.left, following?.left ? `${following.alt}, left page` : '');
    setImage(underRight, following?.right, following?.right ? `${following.alt}, right page` : '');
    const previous = sequence[current - 1];
    if (stageTurn) {
      if (state.pdfPage === 9) {
        setImage(leafFront, state.turnImage, state.alt);
        setImage(leafBack, null);
      } else {
        setImage(leafFront, null);
        setImage(leafBack, null);
      }
    }
    if (state.pdfPage === 10) {
      underBlank.hidden = true;
      setImage(underLeft, previous?.left, previous?.left ? `${previous.alt}, left page` : '');
      setImage(underRight, previous?.right, previous?.right ? `${previous.alt}, right page` : '');
    }
    if (current === 0) setImage(coverImage, state.image, state.alt);
    preloadAround(current);
  };
  const resetTurnLayer = () => {
    book.classList.remove('is-turning-next', 'is-turning-previous', 'is-final-turn-next', 'is-final-turn-previous', 'is-final-turn-next-playing', 'is-final-turn-previous-playing');
  };
  const moveTo = (next, direction, { reduced = false } = {}) => {
    const from = sequence[current];
    const to = sequence[next];
    const finalTurnNext = from.pdfPage === 9 && to.pdfPage === 10;
    const finalTurnPrevious = from.pdfPage === 10 && to.pdfPage === 9;

    if (finalTurnNext || finalTurnPrevious) {
      if (!allPageImagesReady) return;
      isTurning = true;
      const thisTurn = ++turnId;
      updateControls();
      book.classList.add(finalTurnNext ? 'is-final-turn-next' : 'is-final-turn-previous');

      const finishFinalTurn = (immediate = false) => {
        if (thisTurn !== turnId) return;
        if (immediate) {
          resetTurnLayer();
          render(next);
          isTurning = false;
          updateControls();
          return;
        }
        render(next, { stageTurn: false });
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (thisTurn !== turnId) return;
          resetTurnLayer();
          render(next);
          isTurning = false;
          updateControls();
        }));
      };

      if (document.documentElement.classList.contains('motion-paused') && !motionReduced.matches) {
        finishFinalTurn(true);
        return;
      }
      if (reduced) {
        book.classList.add('is-reduced-fade-out');
        window.setTimeout(() => {
          if (thisTurn !== turnId) return;
          finishFinalTurn(true);
          book.classList.remove('is-reduced-fade-out');
          book.classList.add('is-reduced-fade-in');
          window.setTimeout(() => book.classList.remove('is-reduced-fade-in'), 170);
        }, 100);
        return;
      }

      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (thisTurn !== turnId) return;
        book.classList.add(finalTurnNext ? 'is-final-turn-next-playing' : 'is-final-turn-previous-playing');
        window.setTimeout(finishFinalTurn, 900);
      }));
      return;
    }

    const frontSource = direction > 0 ? from.turnImage : from.reverseImage;
    const backSource = direction > 0 ? to.reverseImage : to.turnImage;

    setImage(leafFront, frontSource, from.alt);
    setImage(leafBack, backSource, to.alt);
    setImage(underLeft, to.left, to.left ? `${to.alt}, left page` : '');
    setImage(underRight, to.right, to.right ? `${to.alt}, right page` : '');

    isTurning = true;
    const thisTurn = ++turnId;
    updateControls();

    const finish = () => {
      if (thisTurn !== turnId) return;
      resetTurnLayer();
      render(next);
      isTurning = false;
      updateControls();
    };

    if (document.documentElement.classList.contains('motion-paused') && !motionReduced.matches) {
      resetTurnLayer();
      render(next);
      isTurning = false;
      updateControls();
      return;
    }

    if (reduced) {
      book.classList.add('is-reduced-fade-out');
      window.setTimeout(() => {
        if (thisTurn !== turnId) return;
        render(next);
        book.classList.remove('is-reduced-fade-out');
        book.classList.add('is-reduced-fade-in');
        window.setTimeout(() => {
          if (thisTurn !== turnId) return;
          book.classList.remove('is-reduced-fade-in');
          isTurning = false;
          updateControls();
        }, 170);
      }, 100);
      return;
    }

    book.classList.add(direction > 0 ? 'is-turning-next' : 'is-turning-previous');
    window.setTimeout(() => {
      finish();
    }, turnDuration);
  };
  const turn = (direction) => {
    if (isTurning) return;
    if (current === 0 && direction > 0) {
      if (document.documentElement.classList.contains('motion-paused') && !motionReduced.matches) {
        render(1);
        updateControls();
        return;
      }
      isTurning = true;
      const thisTurn = ++turnId;
      if (motionReduced.matches || document.documentElement.classList.contains('motion-paused')) {
        book.classList.add('is-reduced-fade-out');
        window.setTimeout(() => {
          if (thisTurn !== turnId) return;
          render(1);
          book.classList.remove('is-reduced-fade-out');
          book.classList.add('is-reduced-fade-in');
          window.setTimeout(() => {
            if (thisTurn !== turnId) return;
            book.classList.remove('is-reduced-fade-in');
            isTurning = false;
            updateControls();
          }, 170);
        }, 100);
        updateControls();
        return;
      }
      render(1);
      updateControls();
      window.setTimeout(() => {
        if (thisTurn !== turnId) return;
        isTurning = false;
        updateControls();
      }, openingDuration);
      return;
    }
    if (current === 1 && direction < 0) {
      close();
      return;
    }
    const next = current + direction;
    if (next < 1 || next >= sequence.length) return;
    moveTo(next, direction, { reduced: motionReduced.matches });
  };
  const close = () => {
    if (isTurning || current === 0) return;
    isTurning = true;
    const thisTurn = ++turnId;
    updateControls();
    const finishClose = () => {
      if (thisTurn !== turnId) return;
      book.classList.remove('is-closing');
      resetTurnLayer();
      render(0);
      isTurning = false;
      updateControls();
    };
    if (document.documentElement.classList.contains('motion-paused') && !motionReduced.matches) {
      finishClose();
      return;
    }
    if (motionReduced.matches) {
      book.classList.add('is-reduced-fade-out');
      window.setTimeout(() => {
        if (thisTurn !== turnId) return;
        render(0);
        book.classList.remove('is-reduced-fade-out');
        book.classList.add('is-reduced-fade-in');
        window.setTimeout(() => {
          if (thisTurn !== turnId) return;
          book.classList.remove('is-reduced-fade-in');
          isTurning = false;
          updateControls();
        }, 170);
      }, 100);
      return;
    }
    book.classList.add('is-closing');
    window.setTimeout(finishClose, openingDuration);
  };
  const setResponsiveSequence = () => {
    const previousState = sequence[current];
    mobile = window.matchMedia('(max-width: 767px)').matches;
    book.classList.toggle('is-mobile', mobile);
    sequence = makeSequence();
    const matchingIndex = previousState.pdfPage === 1 ? 0 : previousState.pdfPage === 10
      ? sequence.length - 1
      : sequence.findIndex((state) => state.pdfPage === previousState.pdfPage && (!mobile || state.label.endsWith('LEFT')));
    render(matchingIndex >= 0 ? matchingIndex : 0);
    updateControls();
  };

  openCover.addEventListener('click', () => turn(1));
  previousButton.addEventListener('click', () => turn(-1));
  nextButton.addEventListener('click', () => turn(1));
  closeButton.addEventListener('click', close);
  reader.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' || current === 0 || isTurning) return;
    pointerStart = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  reader.addEventListener('pointerup', (event) => {
    if (!pointerStart || isTurning) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) >= 55 && Math.abs(dx) > Math.abs(dy) * 1.25) turn(dx < 0 ? 1 : -1);
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (window.matchMedia('(max-width: 767px)').matches !== mobile && !isTurning) setResponsiveSequence();
    }, 120);
  }, { passive: true });

  sequence = makeSequence();
  book.classList.toggle('is-mobile', mobile);
  const pageImageSources = [...new Set(sourcePages.flatMap((page) => [page.image, ...(page.mobile || [])]).filter(Boolean))];
  Promise.all(pageImageSources.map(preload)).then((results) => {
    allPageImagesReady = results.every(Boolean);
    updateControls();
  });
  render(0);
  updateControls();
})();

/* Nathaniel Works — Thumbnail tabs and source-quality presentation, 2026-10-07.
 * Load AFTER the existing script.js. This file does not replace or modify it.
 * Uses existing source assets. It does not fabricate HD files or redraw images.
 */
(() => {
  'use strict';
  const root = document.getElementById('thumbnails');
  if (!root || root.dataset.mediaInitialized === 'true') return;
  root.dataset.mediaInitialized = 'true';
  const controllers = new Map();

  root.querySelectorAll('[data-thumbnail-carousel]').forEach(carousel => {
    const kind = carousel.dataset.thumbnailCarousel;
    const slides = [...carousel.querySelectorAll('.nw-thumb-slide')];
    const dots = root.querySelector(`[data-thumbnail-dots="${kind}"]`);
    const status = carousel.querySelector('.nw-thumb-status');
    if (!slides.length || !dots) return;
    let current = 0;
    let suppressClickUntil = 0;
    const buttons = slides.map((slide, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Show ${kind}-form thumbnail ${index + 1} of ${slides.length}`);
      button.addEventListener('click', () => show(index));
      dots.appendChild(button);
      slide.addEventListener('click', event => {
        if (Date.now() < suppressClickUntil) {
          event.preventDefault();
          return;
        }
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        if (index !== current) {
          event.preventDefault();
          show(index);
          return;
        }
        // Preserve the original asset link if the legacy dialog is unavailable.
        if (typeof window.openPortfolioImage === 'function') {
          event.preventDefault();
          window.openPortfolioImage(slide);
        }
      });
      return button;
    });

    function layout() {
      const width = carousel.clientWidth;
      if (!width) return; // Hidden tabs are laid out when selected.
      const mobile = width <= 640;
      let active, side, gap;
      if (kind === 'short') {
        active = mobile ? Math.min(260, Math.floor(width * .64)) : Math.min(280, Math.floor((width - 160) / 2.4));
        side = Math.round(active * .70);
        gap = mobile ? 14 : 22;
      } else {
        active = mobile ? Math.floor(width * .74) : Math.min(560, Math.floor((width - 176) / 2));
        side = Math.round(active * .50);
        gap = mobile ? 14 : 24;
      }
      active = Math.max(100, active);
      const height = active * (kind === 'short' ? 16 / 9 : 9 / 16);
      carousel.style.setProperty('--nw-thumb-active', `${active}px`);
      carousel.style.setProperty('--nw-thumb-side', `${side}px`);
      carousel.style.setProperty('--nw-thumb-offset', `${(active + side) / 2 + gap}px`);
      carousel.style.setProperty('--nw-thumb-stage-height', `${Math.ceil(height + 68)}px`);
    }

    function show(index, announce = true) {
      current = (index + slides.length) % slides.length;
      const before = (current - 1 + slides.length) % slides.length;
      const after = (current + 1) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === current;
        const visible = active || i === before || i === after;
        slide.classList.toggle('is-current', active);
        slide.classList.toggle('is-before', !active && i === before);
        slide.classList.toggle('is-after', !active && i === after);
        slide.setAttribute('aria-hidden', String(!visible));
        slide.tabIndex = active ? 0 : -1;
        const image = slide.querySelector('img');
        slide.setAttribute('aria-label', `${active ? 'View original' : 'Preview'}: ${image?.alt || slide.dataset.title}`);
        if (visible && image && !carousel.closest('[hidden]')) image.loading = 'eager';
        buttons[i].setAttribute('aria-current', String(active));
      });
      carousel.dataset.currentIndex = String(current);
      if (status && announce) status.textContent = `${kind === 'short' ? 'Short' : 'Long'}-form thumbnail ${current + 1} of ${slides.length}`;
    }

    carousel.querySelector('.nw-thumb-previous')?.addEventListener('click', () => show(current - 1));
    carousel.querySelector('.nw-thumb-next')?.addEventListener('click', () => show(current + 1));
    carousel.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.key === 'Home') show(0);
      else if (event.key === 'End') show(slides.length - 1);
      else show(current + (event.key === 'ArrowRight' ? 1 : -1));
      // Keep focus on a displayed item when using the keyboard on a slide.
      if (event.target.closest('.nw-thumb-slide')) slides[current].focus({preventScroll: true});
    });
    // Same swipe direction as the existing video carousels. Vertical scrolling
    // and two-finger pinch zoom remain native. A swipe never opens an image.
    let touch = null;
    carousel.addEventListener('touchstart', event => {
      if (event.touches.length !== 1) { touch = null; return; }
      const t = event.touches[0];
      touch = {x: t.clientX, y: t.clientY, started: Date.now(), horizontal: false};
    }, {passive: true});
    carousel.addEventListener('touchmove', event => {
      if (!touch || event.touches.length !== 1) { touch = null; return; }
      const t = event.touches[0];
      const dx = t.clientX - touch.x, dy = t.clientY - touch.y;
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.15) touch.horizontal = true;
      if (touch.horizontal && event.cancelable) event.preventDefault();
    }, {passive: false});
    carousel.addEventListener('touchend', event => {
      if (!touch || !event.changedTouches.length) { touch = null; return; }
      const t = event.changedTouches[0];
      const dx = t.clientX - touch.x, dy = t.clientY - touch.y;
      if (Math.abs(dx) >= 36 && Math.abs(dx) > Math.abs(dy) * 1.12 && Date.now() - touch.started <= 1200) {
        suppressClickUntil = Date.now() + 550;
        show(current + (dx < 0 ? 1 : -1));
      }
      touch = null;
    }, {passive: true});
    carousel.addEventListener('touchcancel', () => { touch = null; }, {passive: true});
    if ('ResizeObserver' in window) new ResizeObserver(layout).observe(carousel);
    else window.addEventListener('resize', layout, {passive: true});
    controllers.set(kind, {refresh() { layout(); show(current); }});
    layout();
    show(0, false);
  });

  const tabs = [...root.querySelectorAll('.nw-thumbnail-tabs [role="tab"]')];
  function activateTab(selected, focus = false) {
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) panel.hidden = !active;
    });
    const panel = document.getElementById(selected.getAttribute('aria-controls'));
    const kind = panel?.querySelector('[data-thumbnail-carousel]')?.dataset.thumbnailCarousel;
    controllers.get(kind)?.refresh();
    if (focus) selected.focus({preventScroll: true});
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activateTab(tabs[next], true);
    });
  });

  // Original-file view. The natural pixel dimensions are read from the file,
  // not inferred from HTML width/height attributes or labeled as "HD".
  const dialog = document.getElementById('portfolio-image-dialog');
  const image = document.getElementById('portfolio-image-preview');
  const zoom = document.getElementById('nw-image-zoom');
  const resolution = document.getElementById('nw-image-resolution');
  const viewport = document.getElementById('nw-image-viewport');
  if (dialog && image && zoom && resolution && viewport) {
    function resetViewer() {
      dialog.classList.remove('is-native-size');
      zoom.setAttribute('aria-pressed', 'false');
      zoom.textContent = 'View at 100%';
      zoom.disabled = true;
      viewport.scrollTo(0, 0);
      resolution.textContent = image.getAttribute('src') ? 'Loading original image…' : '';
    }
    function updateResolution() {
      if (!image.getAttribute('src') || !image.naturalWidth) return;
      resolution.textContent = `${image.naturalWidth} × ${image.naturalHeight} px · Original file`;
      zoom.disabled = false;
    }
    zoom.addEventListener('click', () => {
      const native = dialog.classList.toggle('is-native-size');
      zoom.setAttribute('aria-pressed', String(native));
      zoom.textContent = native ? 'Fit to screen' : 'View at 100%';
      viewport.scrollTo(0, 0);
    });
    image.addEventListener('load', updateResolution);
    image.addEventListener('error', () => {
      if (image.getAttribute('src')) resolution.textContent = 'Image unavailable. Try the original-image link below.';
      zoom.disabled = true;
    });
    new MutationObserver(() => {
      resetViewer();
      if (image.complete) updateResolution();
    }).observe(image, {attributes: true, attributeFilter: ['src']});
    dialog.addEventListener('close', resetViewer);
  }

  // Five video previews currently request YouTube hqdefault. Probe a larger
  // source only near the viewport; reject unavailable 120px placeholders and
  // keep the original/fallback asset when no larger source can be loaded.
  // No API key, URL guesses for private media, re-encoding or upscaling.
  const youtubeImages = [...document.querySelectorAll('img[src*="i.ytimg.com/"]')];
  function loadCandidate(url) {
    return new Promise(resolve => {
      const probe = new Image();
      let done = false;
      const finish = valid => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        probe.onload = probe.onerror = null;
        resolve(valid ? probe : null);
      };
      const timer = setTimeout(() => finish(false), 6000);
      probe.onload = () => finish(probe.naturalWidth >= 640 && probe.naturalHeight >= 360);
      probe.onerror = () => finish(false);
      probe.decoding = 'async';
      probe.src = url;
    });
  }
  async function upgradeYouTubeThumbnail(img) {
    if (img.dataset.resolutionChecked) return;
    img.dataset.resolutionChecked = 'pending';
    const original = img.getAttribute('src');
    const match = original?.match(/^(https:\/\/i\.ytimg\.com\/vi\/[^/]+\/)hqdefault\.jpg(?:\?.*)?$/);
    if (!match) { img.dataset.resolutionChecked = 'unchanged'; return; }
    for (const size of ['maxresdefault', 'sddefault']) {
      const candidate = await loadCandidate(`${match[1]}${size}.jpg`);
      if (!candidate) continue;
      if (candidate.naturalWidth > Math.max(480, img.naturalWidth || 0)) {
        img.src = candidate.src;
        img.dataset.resolutionChecked = size;
        return;
      }
    }
    img.dataset.resolutionChecked = 'original-retained';
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        upgradeYouTubeThumbnail(entry.target);
      });
    }, {rootMargin: '400px'});
    youtubeImages.forEach(img => observer.observe(img));
  } else youtubeImages.forEach(upgradeYouTubeThumbnail);

  // Inspectable quality audit for the owner. This reads source sizes only; it
  // does not publish visitors' information or send data to another service.
  window.NathanielPortfolio = window.NathanielPortfolio || {};
  window.NathanielPortfolio.imageQualityReport = () => [...document.images].filter(img => img.getAttribute('src')).map(img => {
    const rect = img.getBoundingClientRect();
    const loaded = img.complete && img.naturalWidth > 0;
    return {
      source: img.currentSrc || img.src,
      loaded,
      intrinsicWidth: loaded ? img.naturalWidth : null,
      intrinsicHeight: loaded ? img.naturalHeight : null,
      displayedWidth: Math.round(rect.width),
      displayedHeight: Math.round(rect.height),
      devicePixelRatio: window.devicePixelRatio || 1,
      youtubeSource: img.dataset.resolutionChecked || null
    };
  });
})();

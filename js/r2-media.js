(() => {
  'use strict';

  const configuredBase = String(window.RUQYAH_R2_PUBLIC_URL || '').trim();
  const baseUrl = configuredBase.replace(/\/+$/, '');

  function resolveMediaUrl(path) {
    const value = String(path || '').trim();
    if (!value || /^(?:https?:|data:|blob:)/i.test(value)) return value;

    const key = value.replace(/^(?:\.\/|\/)+/, '');
    return baseUrl ? `${baseUrl}/${key}` : value;
  }

  window.r2MediaUrl = resolveMediaUrl;

  function populateDownloadLinks(root = document) {
    root.querySelectorAll('a[data-media-href]').forEach((link) => {
      link.href = resolveMediaUrl(link.dataset.mediaHref);
    });
  }

  function loadMedia(media) {
    if (!media || media.dataset.mediaLoaded === 'true') return;

    let hasSource = false;
    if (media.dataset.mediaSrc) {
      media.src = resolveMediaUrl(media.dataset.mediaSrc);
      hasSource = true;
    }

    if (media.dataset.lazySrc) {
      media.src = media.dataset.lazySrc;
      hasSource = true;
    }

    media.querySelectorAll('source[data-media-src]').forEach((source) => {
      source.src = resolveMediaUrl(source.dataset.mediaSrc);
      hasSource = true;
    });

    populateDownloadLinks(media);
    media.dataset.mediaLoaded = 'true';
    if (hasSource && typeof media.load === 'function') media.load();
  }

  function observeNearViewport(mediaElements) {
    const pending = new Set(mediaElements);
    const margin = 300;
    const requestFrame = window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : (callback) => window.setTimeout(callback, 16);
    let frameId = 0;

    function checkVisibleMedia() {
      if (frameId) return;
      frameId = requestFrame(() => {
        frameId = 0;
        const viewportBottom = window.innerHeight + margin;

        pending.forEach((media) => {
          const bounds = media.getBoundingClientRect();
          if (bounds.bottom < -margin || bounds.top > viewportBottom) return;
          loadMedia(media);
          pending.delete(media);
        });

        if (!pending.size) {
          window.removeEventListener('scroll', checkVisibleMedia);
          window.removeEventListener('resize', checkVisibleMedia);
        }
      });
    }

    window.addEventListener('scroll', checkVisibleMedia, { passive: true });
    window.addEventListener('resize', checkVisibleMedia, { passive: true });
    checkVisibleMedia();
  }

  function initializeMedia() {
    populateDownloadLinks();

    const mediaElements = Array.from(document.querySelectorAll('video, audio, iframe')).filter((media) =>
      media.hasAttribute('data-media-src') || media.hasAttribute('data-lazy-src') ||
      media.querySelector('source[data-media-src]')
    );

    const eagerMedia = mediaElements.filter((media) => media.hasAttribute('data-media-eager'));
    eagerMedia.forEach(loadMedia);

    const lazyMedia = mediaElements.filter((media) => !media.hasAttribute('data-media-eager'));
    if (!lazyMedia.length) return;

    if (!('IntersectionObserver' in window)) {
      observeNearViewport(lazyMedia);
      return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadMedia(entry.target);
        currentObserver.unobserve(entry.target);
      });
    }, { rootMargin: '300px 0px' });

    lazyMedia.forEach((media) => observer.observe(media));

    // Safety net for environments that expose IntersectionObserver but never
    // deliver callbacks (headless renderers, some embedded WebViews, print).
    // A short delay after launch, anything still unloaded that is already
    // in/near the viewport loads through the scroll-based path instead.
    window.setTimeout(() => {
      const pending = lazyMedia.filter((media) => media.dataset.mediaLoaded !== 'true');
      if (pending.length) observeNearViewport(pending);
    }, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMedia, { once: true });
  } else {
    initializeMedia();
  }
})();

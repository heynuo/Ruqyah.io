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

    media.querySelectorAll('source[data-media-src]').forEach((source) => {
      source.src = resolveMediaUrl(source.dataset.mediaSrc);
      hasSource = true;
    });

    populateDownloadLinks(media);
    media.dataset.mediaLoaded = 'true';
    if (hasSource && typeof media.load === 'function') media.load();
  }

  function initializeMedia() {
    populateDownloadLinks();

    const mediaElements = Array.from(document.querySelectorAll('video, audio, iframe')).filter((media) =>
      media.hasAttribute('data-media-src') || media.querySelector('source[data-media-src]')
    );
    const eagerMedia = mediaElements.filter((media) => media.hasAttribute('data-media-eager'));
    eagerMedia.forEach(loadMedia);

    const lazyMedia = mediaElements.filter((media) => !media.hasAttribute('data-media-eager'));
    if (!lazyMedia.length) return;

    if (!('IntersectionObserver' in window)) {
      lazyMedia.forEach(loadMedia);
      return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        loadMedia(entry.target);
        currentObserver.unobserve(entry.target);
      });
    }, { rootMargin: '400px 0px' });

    lazyMedia.forEach((media) => observer.observe(media));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMedia, { once: true });
  } else {
    initializeMedia();
  }
})();

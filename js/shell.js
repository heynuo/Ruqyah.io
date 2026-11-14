/**
 * Ruqyah Universal Navigation & Shell Engine (v4)
 * Provides unified theme switching (Light/Dark/Sepia), mobile navigation drawer,
 * search & command palette (Ctrl+K), keyboard shortcuts, and bookmark synchronization.
 */
(function () {
  'use strict';

  // ---------- 1. THEME MANAGEMENT ----------
  const THEMES = ['light', 'sepia', 'dark'];
  const themeLightBtn = document.getElementById('themeLightBtn');
  const themeSepiaBtn = document.getElementById('themeSepiaBtn');
  const themeDarkBtn = document.getElementById('themeDarkBtn');

  function applyTheme(theme) {
    if (!THEMES.includes(theme)) theme = 'light';
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.remove('dark', 'sepia');
    if (theme === 'dark') root.classList.add('dark');
    if (theme === 'sepia') root.classList.add('sepia');

    try {
      localStorage.setItem('heynuo-theme', theme);
    } catch (e) {}

    // Synchronize toggle button highlights
    [themeLightBtn, themeSepiaBtn, themeDarkBtn].forEach(btn => {
      if (!btn) return;
      btn.classList.remove('text-primary', 'bg-surface-container-low');
      btn.classList.add('hover:text-on-surface');
    });

    const activeBtn = theme === 'dark' ? themeDarkBtn : (theme === 'sepia' ? themeSepiaBtn : themeLightBtn);
    if (activeBtn) {
      activeBtn.classList.add('text-primary', 'bg-surface-container-low');
      activeBtn.classList.remove('hover:text-on-surface');
    }
  }

  // Global theme switcher binding
  window.setTheme = applyTheme;

  themeLightBtn?.addEventListener('click', () => applyTheme('light'));
  themeSepiaBtn?.addEventListener('click', () => applyTheme('sepia'));
  themeDarkBtn?.addEventListener('click', () => applyTheme('dark'));

  // Initial theme initialization
  try {
    const saved = localStorage.getItem('heynuo-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);
  } catch (e) {
    applyTheme('light');
  }

  // ---------- 2. MOBILE NAVIGATION DRAWER ----------
  const menuBtn = document.getElementById('menu-btn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  menuBtn?.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!isExpanded));
    mobileDrawer?.classList.toggle('hidden');
  });

  // Close mobile drawer on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && mobileDrawer && !mobileDrawer.classList.contains('hidden')) {
      mobileDrawer.classList.add('hidden');
      menuBtn?.setAttribute('aria-expanded', 'false');
    }
  });

  // ---------- 3. SEARCH & COMMAND PALETTE (Ctrl+K) ----------
  const searchModal = document.getElementById('searchModal');
  const navSearchBtn = document.getElementById('navSearchBtn');
  const searchModalInput = document.getElementById('searchModalInput');
  const searchResultsList = document.getElementById('searchResultsList');

  function openSearch() {
    if (!searchModal) return;
    searchModal.classList.remove('hidden');
    searchModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => searchModalInput?.focus(), 50);
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.classList.add('hidden');
    searchModal.setAttribute('aria-hidden', 'true');
    if (searchModalInput) searchModalInput.value = '';
    filterSearchResults('');
  }

  navSearchBtn?.addEventListener('click', openSearch);

  searchModal?.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearch();
  });

  function filterSearchResults(query) {
    if (!searchResultsList) return;
    const items = searchResultsList.querySelectorAll('.search-result-item');
    const q = (query || '').toLowerCase().trim();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = (!q || text.includes(q)) ? 'flex' : 'none';
    });
  }

  searchModalInput?.addEventListener('input', (e) => {
    filterSearchResults(e.target.value);
  });

  // ---------- 4. KEYBOARD SHORTCUTS MODAL ----------
  const shortcutsModal = document.getElementById('shortcutsModal');
  const closeShortcutsBtn = document.getElementById('closeShortcutsBtn') || document.getElementById('shortcutsClose');
  const toggleSingleShortcuts = document.getElementById('toggleSingleShortcuts');

  function openShortcuts() {
    if (!shortcutsModal) return;
    shortcutsModal.classList.remove('hidden');
    shortcutsModal.setAttribute('aria-hidden', 'false');
  }

  function closeShortcuts() {
    if (!shortcutsModal) return;
    shortcutsModal.classList.add('hidden');
    shortcutsModal.setAttribute('aria-hidden', 'true');
  }

  closeShortcutsBtn?.addEventListener('click', closeShortcuts);

  shortcutsModal?.addEventListener('click', (e) => {
    if (e.target === shortcutsModal) closeShortcuts();
  });

  let singleKeyShortcutsEnabled = true;
  try {
    const savedSingle = localStorage.getItem('heynuo-single-shortcuts');
    if (savedSingle !== null) {
      singleKeyShortcutsEnabled = savedSingle === 'true';
    }
  } catch (e) {}

  if (toggleSingleShortcuts) {
    toggleSingleShortcuts.checked = singleKeyShortcutsEnabled;
    toggleSingleShortcuts.addEventListener('change', () => {
      singleKeyShortcutsEnabled = toggleSingleShortcuts.checked;
      try {
        localStorage.setItem('heynuo-single-shortcuts', String(singleKeyShortcutsEnabled));
      } catch (e) {}
    });
  }

  // ---------- 5. GLOBAL KEYBOARD ACCELERATORS ----------
  document.addEventListener('keydown', (e) => {
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) ||
                     document.activeElement?.isContentEditable;

    // Command palette: Ctrl+K / Cmd+K
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModal && !searchModal.classList.contains('hidden')) {
        closeSearch();
      } else {
        openSearch();
      }
      return;
    }

    // Escape: close any modal or drawer
    if (e.key === 'Escape') {
      if (searchModal && !searchModal.classList.contains('hidden')) closeSearch();
      if (shortcutsModal && !shortcutsModal.classList.contains('hidden')) closeShortcuts();
      if (mobileDrawer && !mobileDrawer.classList.contains('hidden')) {
        mobileDrawer.classList.add('hidden');
        menuBtn?.setAttribute('aria-expanded', 'false');
      }
      return;
    }

    if (isTyping) return;

    // Single slash: open search
    if (e.key === '/' && singleKeyShortcutsEnabled) {
      e.preventDefault();
      openSearch();
      return;
    }

    // Question mark: open shortcuts
    if (e.key === '?' && singleKeyShortcutsEnabled) {
      e.preventDefault();
      openShortcuts();
      return;
    }

    // Single key 'T': Cycle theme
    if (e.key.toLowerCase() === 't' && singleKeyShortcutsEnabled && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextIdx = (THEMES.indexOf(current) + 1) % THEMES.length;
      applyTheme(THEMES[nextIdx]);
      return;
    }
  });

  // ---------- 6. SAVED BOOKMARKS COUNTER ----------
  function updateBookmarkCount() {
    const savedCount = document.getElementById('savedCount');
    if (!savedCount) return;
    try {
      const bookmarks = JSON.parse(localStorage.getItem('heynuo-bookmarks') || '[]');
      savedCount.textContent = Array.isArray(bookmarks) ? bookmarks.length : 0;
    } catch (e) {
      savedCount.textContent = '0';
    }
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'heynuo-bookmarks') updateBookmarkCount();
    if (e.key === 'heynuo-theme' && e.newValue) applyTheme(e.newValue);
  });

  updateBookmarkCount();

  // ---------- 7. ACTIVE LINK AUTO-RESOLVER ----------
  (function highlightCurrentNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const cleanCurrent = currentPath.replace(/\.html$/, '');
    const links = document.querySelectorAll('header nav a[data-nav]');
    links.forEach(link => {
      const navKey = link.getAttribute('data-nav');
      if (navKey === cleanCurrent || (cleanCurrent === '' && navKey === 'index')) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('text-primary', 'bg-surface-container-low', 'font-semibold');
        link.classList.remove('text-on-surface-variant');
      }
    });
  })();

  // ---------- 8. SERVICE WORKER REGISTRATION ----------
  // Registration used to live only in js/script.js, which index.html and
  // about.html never load. Because manifest.json declares start_url "./", an
  // installed PWA opens index.html — so offline support was silently broken
  // for anyone launching from the home screen. Doing it in the shared shell
  // covers every page; the window flag keeps js/script.js from registering a
  // second time with a different cache-busting stamp.
  (function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (window.__heynuoSwRequested) return;

    const isSecure = window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';
    if (!isSecure) return;

    window.__heynuoSwRequested = true;

    window.addEventListener('load', () => {
      // The stamp is written into <meta name="heynuo-build"> by
      // tools/stamp-build.ps1. Resolving it at load time also lets pages that
      // do load js/script.js fall back to its global.
      const buildMeta = document.querySelector('meta[name="heynuo-build"]');
      const stamp = (buildMeta && buildMeta.content) ||
        (typeof window.__HEYNUO_BUILD__ !== 'undefined' ? window.__HEYNUO_BUILD__ : '') ||
        'dev';

      navigator.serviceWorker.register(`sw.js?v=${stamp}`).then((reg) => {
        // Activate a waiting worker immediately so this visit gets the
        // refreshed shell rather than the next one.
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      }).catch(() => {
        // Offline caching is a progressive enhancement. A failed registration
        // must never break the page.
      });
    });
  })();

})();

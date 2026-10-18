/**
 * Ruqyah Shared Layout Components
 * Source: Stitch Project #13051442395705679722
 * 
 * Injects the unified header, footer, and theme switcher into every page.
 * Usage: Include this script at the end of <body> on every page.
 */

(function () {
  'use strict';

  // ── Detect Active Page ──────────────────────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const pageMap = {
    'index.html': 'home',
    '': 'home',
    'about.html': 'about',
    'quran.html': 'quran',
    'quran-verses.html': 'master-verses',
    'contact.html': 'contact',
    'privacy.html': 'privacy',
    '404.html': '404'
  };
  const activePage = pageMap[currentPath] || '';

  // ── Build Navigation Links ──────────────────────────────────────────
  function navLink(path, label, href, isMobile) {
    const isActive = activePage === path;
    const baseClass = isMobile
      ? 'flex items-center gap-space-sm px-space-md py-space-sm rounded-lg font-ui-interactive text-ui-interactive transition-colors'
      : 'font-ui-interactive text-caption-meta py-1 px-1 transition-colors';
    const activeClass = isMobile
      ? ' bg-surface-container-low text-primary font-semibold'
      : ' text-primary font-semibold border-b-2 border-primary';
    const inactiveClass = isMobile
      ? ' text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
      : ' text-on-surface-variant hover:text-on-surface';

    const current = isActive ? ' aria-current="page"' : '';
    return `<a class="${baseClass}${isActive ? activeClass : inactiveClass}" href="${href}" data-path="${path}"${current}>${label}</a>`;
  }

  const navItems = [
    { path: 'home', label: 'Home', href: 'index.html' },
    { path: 'quran', label: "Qur'an", href: 'quran.html' },
    { path: 'master-verses', label: '108 Verses', href: 'quran-verses.html' },
    { path: 'about', label: 'About', href: 'about.html' },
    { path: 'contact', label: 'Contact', href: 'contact.html' }
  ];

  // ── Header HTML ─────────────────────────────────────────────────────
  function buildHeader() {
    const desktopNav = navItems.map(n => navLink(n.path, n.label, n.href, false)).join('\n');
    const mobileNav = navItems.map(n => navLink(n.path, n.label, n.href, true)).join('\n');

    return `<header id="heynuo-header" class="fixed top-0 left-0 right-0 z-50 h-14 bg-surface/95 backdrop-blur-md shadow-[0_1px_8px_rgba(15,23,42,0.04)]">
  <div class="max-w-7xl mx-auto h-14 px-margin-mobile md:px-margin flex items-center justify-between gap-space-md">
    <div class="flex items-center gap-space-lg">
      <a aria-label="Ruqyah Home" class="flex items-center gap-space-xs text-primary hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg py-1 px-1.5" href="index.html">
        <span class="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-container text-on-primary-container font-code-mono text-caption-meta font-bold tracking-tight">RQ</span>
        <span class="font-title-page-mobile text-ui-interactive font-bold tracking-tight text-on-surface">Ruqyah</span>
        <span aria-hidden="true" class="material-symbols-outlined text-primary text-[18px] hidden sm:inline-block">history_edu</span>
      </a>
      <nav aria-label="Primary Navigation" class="hidden lg:flex items-center gap-space-md">
        ${desktopNav}
      </nav>
    </div>
    <div class="flex items-center gap-2 sm:gap-space-sm">
      <!-- Search Button Trigger -->
      <button id="navSearchBtn" aria-label="Search documentation and scripture (Ctrl+K)" class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border-subtle bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs font-code-mono transition-all focus:outline-none focus:ring-1 focus:ring-primary shadow-xs cursor-pointer" type="button">
        <span class="material-symbols-outlined text-[16px] text-primary">search</span>
        <span class="hidden sm:inline font-ui-interactive text-[12px]">Search</span>
        <kbd class="hidden md:inline-flex items-center px-1 py-0.2 text-[10px] font-code-mono bg-surface rounded text-on-surface-variant border border-border-subtle">⌘K</kbd>
      </button>

      <!-- Theme Switcher -->
      <div aria-label="Theme Switcher" class="flex items-center bg-surface-container-low rounded-lg p-0.5" role="group" id="heynuo-theme-switcher">
        <button aria-label="Light theme" class="heynuo-theme-btn w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer" data-theme-value="light" type="button">
          <span aria-hidden="true" class="material-symbols-outlined text-[16px]">light_mode</span>
        </button>
        <button aria-label="Sepia theme" class="heynuo-theme-btn w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer" data-theme-value="sepia" type="button">
          <span aria-hidden="true" class="material-symbols-outlined text-[16px]">auto_stories</span>
        </button>
        <button aria-label="Dark theme" class="heynuo-theme-btn w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer" data-theme-value="dark" type="button">
          <span aria-hidden="true" class="material-symbols-outlined text-[16px]">dark_mode</span>
        </button>
      </div>
      <!-- Mobile Menu Toggle -->
      <button aria-label="Toggle navigation menu" class="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer" id="heynuo-mobile-menu-btn" type="button">
        <span aria-hidden="true" class="material-symbols-outlined text-[22px]">menu</span>
      </button>
    </div>
  </div>
  <!-- Mobile Navigation Drawer -->
  <nav id="heynuo-mobile-nav" class="lg:hidden hidden absolute top-14 left-0 right-0 bg-surface shadow-xl border-t border-b border-border-subtle px-4 py-3 z-50" aria-label="Mobile Navigation">
    <div class="mb-3 pt-1">
      <button id="mobileNavSearchBtn" class="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low text-on-surface-variant text-xs font-ui-interactive border border-border-subtle cursor-pointer" type="button">
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px] text-primary">search</span>
          <span>Search articles &amp; surahs...</span>
        </span>
        <kbd class="px-1.5 py-0.5 rounded text-[10px] bg-surface border border-border-subtle font-code-mono">Ctrl+K</kbd>
      </button>
    </div>
    <div class="flex flex-col gap-1">
      ${mobileNav}
    </div>
  </nav>
</header>`;
  }

  // ── Footer HTML ─────────────────────────────────────────────────────
  function buildFooter() {
    return `<footer id="heynuo-footer" class="w-full bg-surface-container-lowest mt-space-3xl shadow-[0_-1px_6px_rgba(15,23,42,0.03)]">
  <div class="max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-xl flex flex-col md:flex-row items-center justify-between gap-space-lg font-ui-interactive text-caption-meta text-on-surface-variant">
    <div class="flex flex-col sm:flex-row items-center gap-space-sm sm:gap-space-md text-center sm:text-left">
      <span>© 2026 Ruqyah. Built for deep scholarship &amp; systems engineering.</span>
      <span aria-hidden="true" class="hidden sm:inline">•</span>
      <a class="hover:text-primary transition-colors underline underline-offset-4" href="about.html">Built to WCAG 2.2 AA; report an issue</a>
    </div>
    <div class="flex flex-wrap items-center justify-center gap-space-md">
      <a class="hover:text-on-surface transition-colors" href="about.html">About</a>
      <a class="hover:text-on-surface transition-colors" href="contact.html">Contact</a>
      <a class="hover:text-on-surface transition-colors" href="privacy.html">Privacy</a>
      <a class="hover:text-primary transition-colors flex items-center gap-1" href="rss.xml">
        <span aria-hidden="true" class="material-symbols-outlined text-[16px]">rss_feed</span>
        <span>RSS</span>
      </a>
      <a class="hover:text-primary transition-colors flex items-center gap-1" href="https://github.com/heynuo/Ruqyah.io" target="_blank" rel="noopener noreferrer">
        <span aria-hidden="true" class="material-symbols-outlined text-[16px]">code</span>
        <span>GitHub</span>
      </a>
    </div>
  </div>
</footer>`;
  }

  // ── Theme Switching Logic ───────────────────────────────────────────
  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme) {
    // Remove all theme classes
    document.documentElement.classList.remove('dark', 'sepia');
    document.documentElement.setAttribute('data-theme', theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'sepia') {
      document.documentElement.classList.add('sepia');
    }

    // Persist
    try { localStorage.setItem('heynuo-theme', theme); } catch (e) { /* noop */ }

    // Update button states
    updateThemeButtons();
  }

  function updateThemeButtons() {
    const current = getCurrentTheme();
    document.querySelectorAll('.heynuo-theme-btn').forEach(function (btn) {
      const val = btn.getAttribute('data-theme-value');
      if (val === current) {
        btn.classList.add('text-primary', 'bg-surface');
        btn.classList.remove('text-on-surface-variant', 'hover:text-on-surface', 'hover:bg-surface');
      } else {
        btn.classList.remove('text-primary', 'bg-surface');
        btn.classList.add('text-on-surface-variant', 'hover:text-on-surface', 'hover:bg-surface');
      }
    });
  }

  // ── Inject Components ───────────────────────────────────────────────
  function injectLayout() {
    // Remove any existing header/footer injected by page-specific code
    var existingHeader = document.getElementById('heynuo-header');
    var existingFooter = document.getElementById('heynuo-footer');
    if (existingHeader) existingHeader.remove();
    if (existingFooter) existingFooter.remove();

    // Find the first <header> element and replace it, or place the shell header
    // immediately after the skip link so the skip link stays first in tab order.
    var oldHeader = document.querySelector('body > header');
    if (oldHeader) {
      oldHeader.outerHTML = buildHeader();
    } else {
      var skipLink = document.querySelector('body > a[href="#main-content"]');
      if (skipLink) {
        skipLink.insertAdjacentHTML('afterend', buildHeader());
      } else {
        document.body.insertAdjacentHTML('afterbegin', buildHeader());
      }
    }

    // Find the last <footer> element and replace it, or append to body
    var oldFooter = document.querySelector('body > footer');
    if (oldFooter) {
      oldFooter.outerHTML = buildFooter();
    } else {
      var mainEl = document.querySelector('body > main');
      if (mainEl) {
        mainEl.insertAdjacentHTML('afterend', buildFooter());
      } else {
        document.body.insertAdjacentHTML('beforeend', buildFooter());
      }
    }

    // ── Wire up Theme Buttons ───────────────────────────────────────
    document.querySelectorAll('.heynuo-theme-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTheme(btn.getAttribute('data-theme-value'));
      });
    });
    updateThemeButtons();

    // ── Wire up Mobile Menu ─────────────────────────────────────────
    var menuBtn = document.getElementById('heynuo-mobile-menu-btn');
    var mobileNav = document.getElementById('heynuo-mobile-nav');
    if (menuBtn && mobileNav) {
      menuBtn.addEventListener('click', function () {
        var isOpen = !mobileNav.classList.contains('hidden');
        mobileNav.classList.toggle('hidden');
        var icon = menuBtn.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.textContent = isOpen ? 'menu' : 'close';
        }
      });
    }

    // ── Wire up Command Palette Search Triggers ────────────────────
    function triggerSearch(e) {
      if (e) e.preventDefault();
      if (window.CommandPalette && typeof window.CommandPalette.open === 'function') {
        window.CommandPalette.open();
      } else {
        var ev = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true, bubbles: true });
        document.dispatchEvent(ev);
      }
    }
    var navSearchBtn = document.getElementById('navSearchBtn');
    if (navSearchBtn) {
      navSearchBtn.addEventListener('click', triggerSearch);
    }
    var mobileNavSearchBtn = document.getElementById('mobileNavSearchBtn');
    if (mobileNavSearchBtn) {
      mobileNavSearchBtn.addEventListener('click', function (e) {
        if (mobileNav && !mobileNav.classList.contains('hidden')) {
          mobileNav.classList.add('hidden');
          var icon = menuBtn ? menuBtn.querySelector('.material-symbols-outlined') : null;
          if (icon) icon.textContent = 'menu';
        }
        triggerSearch(e);
      });
    }
  }

  // Expose setTheme globally
  window.setTheme = setTheme;

  // ── Execute ─────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLayout);
  } else {
    injectLayout();
  }
})();

/**
 * Ruqyah Shared Layout Components
 * Source: Stitch Project #13051442395705679722
 * 
 * Injects the unified header, footer, and theme switcher into every page.
 * Usage: Include this script at the end of <body> on every page.
 */

(function () {
  'use strict';

  // ── Detect Active Page ──────────────────────────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const pageMap = {
    'index.html': 'home',
    '': 'home',
    'about.html': 'about',
    'quran.html': 'quran',
    'quran-verses.html': 'master-verses',
    'videos.html': 'videos',
    'contact.html': 'contact',
    'privacy.html': 'privacy',
    '404.html': '404'
  };
  const activePage = pageMap[currentPath] || '';

  // ── Build Navigation Links ──────────────────────────────────────────────
  function navLink(path, label, href, isMobile) {
    const isActive = activePage === path;
    const baseClass = isMobile
<<<<<<< HEAD
      ? 'flex items-center gap-space-sm px-space-md py-2.5 rounded-lg font-ui-interactive text-ui-interactive min-h-[44px] transition-colors'
=======
      ? 'flex items-center gap-space-sm px-space-md py-space-sm rounded-lg font-ui-interactive text-ui-interactive transition-colors'
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
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
    { path: 'videos', label: 'Videos', href: 'videos.html' },
    { path: 'about', label: 'About', href: 'about.html' },
    { path: 'contact', label: 'Contact', href: 'contact.html' }
  ];

  // ── Header HTML ─────────────────────────────────────────────────────────
  function buildHeader() {
    const desktopNav = navItems.map(n => navLink(n.path, n.label, n.href, false)).join('\n');
    const mobileNav = navItems.map(n => navLink(n.path, n.label, n.href, true)).join('\n');

    return `<header id="heynuo-header" class="fixed top-0 left-0 right-0 z-50 h-14 bg-surface shadow-[0_1px_8px_rgba(15,23,42,0.04)]">
  <div class="max-w-7xl mx-auto h-14 px-margin-mobile md:px-margin flex items-center justify-between gap-space-md">
    <div class="flex items-center gap-space-lg">
<<<<<<< HEAD
      <a aria-label="RQ Ruqyah Home" class="flex items-center gap-space-xs text-primary hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg py-1 px-1.5" href="index.html">
=======
      <a aria-label="Ruqyah Home" class="flex items-center gap-space-xs text-primary hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg py-1 px-1.5" href="index.html">
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        <span class="header-brand-mark flex items-center justify-center w-7 h-7 rounded-lg bg-primary-container text-on-primary-container font-code-mono text-caption-meta font-bold tracking-tight">RQ</span>
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
        <kbd class="hidden md:inline-flex items-center px-1 py-0.2 text-[10px] font-code-mono bg-surface rounded text-on-surface-variant border border-border-subtle">Ctrl+K</kbd>
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
<<<<<<< HEAD
      <button aria-label="Open navigation menu" aria-controls="heynuo-mobile-nav" aria-expanded="false" class="lg:hidden w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer" id="heynuo-mobile-menu-btn" type="button">
=======
      <button aria-label="Open navigation menu" aria-controls="heynuo-mobile-nav" aria-expanded="false" class="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer" id="heynuo-mobile-menu-btn" type="button">
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
        <span aria-hidden="true" class="material-symbols-outlined text-[22px]">menu</span>
      </button>
    </div>
  </div>
  <!-- Mobile Navigation Drawer -->
  <nav id="heynuo-mobile-nav" class="lg:hidden absolute top-14 left-0 right-0 bg-surface shadow-xl border-t border-b border-border-subtle px-4 py-3 z-50" aria-label="Mobile Navigation" aria-hidden="true" inert>
    <div class="mb-3 pt-1">
<<<<<<< HEAD
      <button id="mobileNavSearchBtn" class="w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low text-on-surface-variant text-xs font-ui-interactive border border-border-subtle cursor-pointer" type="button">
=======
      <button id="mobileNavSearchBtn" class="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-low text-on-surface-variant text-xs font-ui-interactive border border-border-subtle cursor-pointer" type="button">
>>>>>>> 530434ac33bd3965cac6dd19bc8b390e009fff1f
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

  // ── Footer HTML ─────────────────────────────────────────────────────────
  function buildFooter() {
    return `<footer id="heynuo-footer">
  <div class="footer-main"><div class="footer-content">
    <nav class="footer-columns" aria-label="Footer navigation">
      <section class="footer-column"><h2>EXPLORE</h2><a href="index.html#articles-section">Latest Articles</a><a href="index.html#systems-section">Systems Engineering</a><a href="index.html#quran-section">Qur'an Studies</a><a href="quran.html">Qur'an Reader</a><a href="quran-verses.html">Verse Archive</a><a href="videos.html">Videos</a></section>
      <section class="footer-column"><h2>RESOURCES</h2><a href="about.html">About the Archive</a><a href="rss.xml">RSS Feed</a><a href="manifest.json">Install the App</a><a href="privacy.html">Privacy</a><a href="sitemap.xml">Sitemap</a></section>
      <section class="footer-column"><h2>SUPPORT</h2><a href="contact.html">Contact</a><a href="contact.html#faq-section">Frequently Asked Questions</a><a href="contact.html#contactForm">Report an Issue</a><a href="about.html#accessibility">Accessibility</a></section>
      <section class="footer-column footer-contact"><h2>CONTACT</h2><a href="mailto:zahiruddin44044@gmail.com">zahiruddin44044@gmail.com</a><p>Ruqyah Scholastic Archive</p><p>Independent study &amp; engineering</p></section>
    </nav>
    <aside class="footer-aside">
      <section class="footer-feed"><h2>Follow the archive</h2><p>New posts are available through RSS. Follow in any feed reader—no email signup or account required.</p><a class="footer-feed-link" href="rss.xml"><span class="material-symbols-outlined" aria-hidden="true">rss_feed</span><span>Follow via RSS</span><span aria-hidden="true">→</span></a></section>
      <section class="footer-social"><h2>Follow &amp; connect</h2><div class="footer-social-links"><a href="https://github.com/heynuo/Ruqyah.io" target="_blank" rel="noopener noreferrer">GitHub</a><a href="rss.xml">RSS</a><a href="mailto:zahiruddin44044@gmail.com">Email</a></div></section>
      <section class="footer-topics"><h2>Explore topics</h2><div class="footer-topic-list"><a href="index.html#systems-section">Systems</a><a href="index.html#quran-section">Qur'an</a><a href="quran.html">Reader</a><a href="quran-verses.html">Verses</a></div></section>
    </aside>
  </div></div>
  <div class="footer-bottom"><div class="footer-bottom-inner"><span>&#169; <span data-footer-year></span> RUQYAH.</span><nav aria-label="Legal and contact links"><a href="privacy.html">Privacy</a><a href="contact.html">Contact</a><a href="about.html#accessibility">Accessibility</a></nav><a class="footer-back-top" href="#main-content" aria-label="Back to top"><span aria-hidden="true">&#8593;</span></a></div></div>
</footer>`;
  }

  // ── Theme Switching Logic ───────────────────────────────────────────────
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
      btn.setAttribute('aria-pressed', String(val === current));
      if (val === current) {
        btn.classList.add('text-primary', 'bg-surface');
        btn.classList.remove('text-on-surface-variant', 'hover:text-on-surface', 'hover:bg-surface');
      } else {
        btn.classList.remove('text-primary', 'bg-surface');
        btn.classList.add('text-on-surface-variant', 'hover:text-on-surface', 'hover:bg-surface');
      }
    });
  }

  // ── Inject Components ───────────────────────────────────────────────────
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

    // ── Wire up Theme Buttons ───────────────────────────────────────────────
    document.querySelectorAll('.heynuo-theme-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTheme(btn.getAttribute('data-theme-value'));
      });
    });
    updateThemeButtons();

    var footerYear = document.querySelector('[data-footer-year]');
    if (footerYear) footerYear.textContent = String(new Date().getFullYear());

    // ── Wire up Mobile Menu ─────────────────────────────────────────────────
    var menuBtn = document.getElementById('heynuo-mobile-menu-btn');
    var mobileNav = document.getElementById('heynuo-mobile-nav');
    if (menuBtn && mobileNav) {
      var setMobileNavOpen = function (isOpen) {
        mobileNav.classList.toggle('is-open', isOpen);
        mobileNav.setAttribute('aria-hidden', String(!isOpen));
        mobileNav.toggleAttribute('inert', !isOpen);
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        menuBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        var icon = menuBtn.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = isOpen ? 'close' : 'menu';
      };

      menuBtn.addEventListener('click', function () {
        var isOpen = mobileNav.classList.contains('is-open');
        setMobileNavOpen(!isOpen);
      });

      mobileNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { setMobileNavOpen(false); });
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && mobileNav.classList.contains('is-open')) {
          setMobileNavOpen(false);
          menuBtn.focus();
        }
      });

      document.addEventListener('click', function (event) {
        if (mobileNav.classList.contains('is-open') &&
            !mobileNav.contains(event.target) && !menuBtn.contains(event.target)) {
          setMobileNavOpen(false);
        }
      });

      var mobileSearchBtn = document.getElementById('mobileNavSearchBtn');
      if (mobileSearchBtn) {
        mobileSearchBtn.addEventListener('click', function () {
          setMobileNavOpen(false);
          var navSearch = document.getElementById('navSearchBtn');
          if (navSearch) navSearch.click();
        });
      }
    }
  }

  // Expose setTheme globally
  window.setTheme = setTheme;
  // Expose updateThemeButtons so script.js can sync button states without re-applying theme
  window.__heynuoUpdateThemeBtns = updateThemeButtons;

  // ── Execute ─────────────────────────────────────────────────────────────
  var layoutInjected = false;
  function safeInjectLayout() {
    if (layoutInjected) return;
    if (document.body) {
      layoutInjected = true;
      injectLayout();
    }
  }

  safeInjectLayout();
  if (!layoutInjected) {
    document.addEventListener('DOMContentLoaded', safeInjectLayout);
  }
})();

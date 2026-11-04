# Ruqyah — Scholastic Archive & Systems Laboratory

[![GitHub Repository](https://img.shields.io/badge/GitHub-heynuo%2FRuqyah.io-181717?style=for-the-badge&logo=github)](https://github.com/heynuo/Ruqyah.io)
[![Live Site](https://img.shields.io/badge/Live%20Website-heynuo.github.io-blue?style=for-the-badge&logo=github)](https://heynuo.github.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](js/script.js)
[![Shared Layout](https://img.shields.io/badge/Design%20System-Material%20Tokens-0F766E?style=for-the-badge)](css/shared-layout.css)
[![Tracker Free](https://img.shields.io/badge/Privacy-100%25%20Tracker--Free-success?style=for-the-badge)](privacy.html)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-purple?style=for-the-badge)](manifest.json)

> **Ruqyah** is an independent digital archive and systems laboratory for Qur’anic reading, authentic Ruqyah healing verses, and a 108-verse verified concordance from 62 classical sources, alongside high-throughput Java architecture and distributed systems notes. Free to use, private by design, and built to work offline.

---

## 🌐 Live Website & Canonical Resources

- **Home Archive:** [https://heynuo.github.io/](https://github.com/heynuo/Ruqyah.io)
- **108 Master Verses Concordance (Ruqyah & Protection):** [https://heynuo.github.io/quran-verses.html](https://heynuo.github.io/quran-verses.html)
- **Qur'an Recitation Audio Engine (114 Surahs):** [https://heynuo.github.io/quran.html](https://heynuo.github.io/quran.html)
- **Engineering Lab & Scholastic Methodology:** [https://heynuo.github.io/about.html](https://heynuo.github.io/about.html)
- **Privacy & Source Methodology:** [https://heynuo.github.io/privacy.html](https://heynuo.github.io/privacy.html)
- **Direct Contact:** [https://heynuo.github.io/contact.html](https://heynuo.github.io/contact.html)
- **RSS 2.0 Feed:** [https://heynuo.github.io/rss.xml](https://heynuo.github.io/rss.xml)

---

## ✨ Features & Architecture

- **100% Tracker-Free & Privacy First:**
  - Zero third-party telemetry, tracking scripts, Google Analytics, or advertising networks.
  - Transparent `localStorage` usage for themes, bookmarks, and playback preferences documented on [`privacy.html`](privacy.html).
  - Direct mailto dispatch with formatted clipboard copying — zero third-party form processors.

- **Unified Stitch Design System & Themes:**
  - Strict **WCAG 2.2 AA verified contrast ratios** (4.5:1 / 3:1).
  - Tri-theme engine: **Light**, **Sepia Scholastic**, and **Midnight Dark**.
  - Consistent layout and navigation injected via [`js/shared-layout.js`](js/shared-layout.js).
  - Accessible typography with *Amiri* for authentic Uthmani calligraphy, *Inter* for interface clarity, and *JetBrains Mono* for system code.

- **Resilient Static & Offline-First (PWA):**
  - Full content is readable with JavaScript disabled; client-side JS progressively enhances audio streaming and instant filtering.
  - Multi-tier audio fallback: Primary streams with automatic fallback to EveryAyah mirrors.
  - Offline Progressive Web App with [`sw.js`](sw.js) precaching core pages and assets.
  - Release build stamping via `tools/stamp-build.ps1` ensuring clean cache invalidation.

- **WCAG 2.1.4 Keyboard Accelerators & Command Palette:**
  - Universal Command Palette (`Ctrl + K` or `/`).
  - Single-key shortcuts (`T` cycles Light &rarr; Sepia &rarr; Dark; `?` opens shortcuts dialog; `Space` controls audio; `V` minimizes audio bar).
  - Accessible toggle to enable or disable single-key shortcuts per user preference.

---

## 📂 Project Structure

```text
heynuo.github.io/
├── index.html                   # Scholastic homepage (editorial hero, sacred medallion, 108 verses)
├── quran.html                   # Complete 114 Surahs audio recitation library and Mushaf PDFs
├── quran-verses.html            # Master concordance of 108 Quranic verses (Ruqyah, Protection, Tafsir)
├── about.html                   # Systems engineering profile, JVM internals, and Islamic methodology
├── contact.html                 # Direct privacy-first contact & interactive subject helper
├── privacy.html                 # Privacy policy, local storage disclosures, and source citations
├── 404.html                     # Custom accessible 404 error page with quick jump links
├── manifest.json                # Progressive Web App manifest
├── sw.js                        # Service worker with static cache-first offline strategy
├── rss.xml                      # RSS 2.0 syndication feed
├── sitemap.xml                  # XML sitemap with accurate lastmod dates
├── robots.txt                   # Search engine crawl rules
├── LICENSE                      # MIT Open Source License
├── README.md                    # Project documentation
├── css/
│   └── shared-layout.css        # Unified Design System tokens (Light, Sepia, Dark) & components
├── buttons.js                   # Shared button and UI enhancement utilities
├── js/
│   ├── shared-layout.js         # Unified header, footer, and theme injection engine
│   ├── tailwind-config.js       # Design system token configuration for Tailwind CSS
│   ├── script.js                # Command palette, keyboard shortcuts modal, clipboard handlers
│   ├── quran-player.js          # Persistent bottom audio streaming engine with mirror failover
│   ├── quran-page.js            # 114 Surahs audio routing and reciter controller
│   ├── master-verses.js         # 108 verses controller, instant search, and bookmarking
│   └── data/
│       └── master-verses-data.js# Dataset of 108 verses from 62 classical sources
├── assets/
│   ├── banners/                 # Optimized OpenGraph banners (1200x630, webp/jpg)
│   └── icons/                   # Crisp UI graphics, theme icons, and metadata
└── tools/                       # Maintenance and automation toolchain
    ├── stamp-build.ps1          # Writes release build stamp for service worker cache busting
    ├── validate-site.ps1        # Site integrity validator (links, assets, schemas, footer)
    ├── sync-components.ps1      # Component stamping script for headers, footers & modals
    ├── sync-design-system.ps1   # Design system token synchronizer
    └── components/              # Canonical HTML component templates
        ├── header.html          # Standard navigation component
        ├── footer.html          # Standard footer component
        └── shortcuts-modal.html # WCAG 2.1.4 compliant accessible shortcuts dialog
```

---

## 🛠️ Local Development & Validation

Serve locally with any static HTTP server:

```bash
# Python 3
python -m http.server 8000

# or Node.js npx
npx serve .
```

Validate site integrity, links, and accessibility constraints:

```powershell
powershell -File tools/validate-site.ps1
```

Stamp a release build before pushing:

```powershell
powershell -File tools/stamp-build.ps1
```

---

## 📜 Scholastic Sources & Methodology

- **Qur'anic Text:** Derived strictly from the King Fahd Complex for the Printing of the Holy Qur'an and Tanzil Project verified Uthmani script (Hafs 'an 'Asim recitation).
- **English Translation:** Saheeh International with verified verse numbering.
- **Audio Recitations:** Sheikh Mishary Rashid Alafasy via EveryAyah 128kbps lossless streaming mirrors.
- **Tafsir & Hadith Verification:** Cross-referenced against canonical Kutub al-Sittah editions with verified isnad classifications according to classical Muhaddithin consensus.

# Ruqyah

Ruqyah is a static Qur'anic study archive with recitation tools, a searchable collection of 108 verses, media experiences, and engineering notes. It is hosted on GitHub Pages.

## Live site

- [Home](https://heynuo.github.io/)
- [Qur'an reader](https://heynuo.github.io/quran.html)
- [108 verse archive](https://heynuo.github.io/quran-verses.html)
- [Videos and experiences](https://heynuo.github.io/videos.html)
- [About and sources](https://heynuo.github.io/about.html)
- [Privacy](https://heynuo.github.io/privacy.html)
- [Contact](https://heynuo.github.io/contact.html)

## Features

- Qur'an recitation with surah and ayah navigation, reciter selection, playback controls, and saved preferences.
- A searchable 108-verse archive with Arabic text, translations, source notes, bookmarks, and downloads.
- Light, sepia, and dark themes; keyboard shortcuts; responsive navigation; and reduced-motion support.
- A service worker that caches the site shell and selected local files for offline reading. Streamed audio and video need an internet connection.
- No analytics or advertising scripts. The site requests fonts from Google Fonts and recitations from external audio hosts.

## Run locally

Install the CSS build dependencies and generate the local utility stylesheet:

```bash
npm ci
npm run build:css
```

Serve the repository root with Python:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>. On Windows, `py -m http.server 8000` can be used instead.

Rebuild `css/tailwind.generated.css` after changing Tailwind utility classes in HTML or JavaScript. The generated file is committed and served directly; the deployed site does not run Node.js.

## Before publishing

Update the cache version and local stylesheet URLs:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\stamp-build.ps1
```

The site integrity checker is available at:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\validate-site.ps1
```

GitHub Pages serves the repository root from `main`. Commit the generated stylesheet along with source changes.

## Audio players

The home page has a compact recitation player for Ayat al-Kursi and Ta-Ha 20:114. Its reciter list is in `js/audio-reciter-data.js`. `quran.html` contains the full 114-surah reader, and `quran-verses.html` has its own player for verse playback. Recitation streams come from EveryAyah and Al-Islam hosts, so availability depends on those services and the user's connection.

## Project map

```text
index.html                 Home page and compact recitation player
quran.html                 114-surah reader
quran-verses.html          Searchable 108-verse archive
videos.html                Media library
about.html                 Project background and sources
contact.html               Contact form
privacy.html               Privacy and storage disclosures
Allah.html                 Standalone tribute experience
HadithQudsi.html           Standalone kinetic typography experience
Tawakkul.html              Standalone reflection experience
css/shared-layout.css      Shared themes, shell, and responsive rules
css/tailwind.input.css     Tailwind CLI entry point
css/tailwind.generated.css Compiled utility stylesheet
js/shared-layout.js        Shared navigation, footer, and theme behavior
js/script.js               Search, shortcuts, and shared interactions
js/audio-reciter-data.js   Homepage and About page reciter list
js/quran-page.js           Surah reader controller
js/about-audio-player.js   About page audio controller
js/data/                   Verse archive data
assets/                    Banners, icons, PDFs, and media
tools/                     Serving, image, cache, CSS, and site validation utilities
sw.js                      Offline shell cache and media request handling
package.json               Local Tailwind build command
```

## Text and audio sources

The archive's page-level notes identify Qur'anic text and translation sources, including the King Fahd Complex, Tanzil, and Saheeh International. Audio recitations are streamed from EveryAyah and Al-Islam. See `privacy.html` for details about browser storage and third-party requests.

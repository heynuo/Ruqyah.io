# Ruqyah (رُقْيَة)

> Authentic Sanctuary for Qur'anic Recitation, Ruqyah Healing Verses, and Classical Tafsir Concordance.

[![Live Site](https://img.shields.io/badge/Live_Site-Ruqyah.io-0f766e?style=for-the-badge&logo=githubpages&logoColor=white)](https://heynuo.github.io/Ruqyah.io/)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge)]()

**Live Website**: [https://heynuo.github.io/Ruqyah.io/](https://heynuo.github.io/Ruqyah.io/)

---

## 📖 Overview

**Ruqyah** is a high-performance, privacy-first Qur'anic study sanctuary and spiritual archive hosted on GitHub Pages. It unites classical Islamic scholarship with modern frontend systems engineering:

- **114-Surah Reader**: Complete Qur'anic directory with Uthmani Arabic typography, multiple translation streams, audio reciter selection, and persistent listening state.
- **108 Master Verses**: Verified concordance across 62 classical tafsir sources with categorized themes (Protection, Healing, Faith, Mercy, Victory).
- **The End (Al-Akhirah)**: Dedicated contemplations on the Ultimate Destination, Husn al-Khatimah, Surah Al-Fajr, and HD cinematic reflection footage.
- **Interactive Spiritual Experiences**: Kinetic typography for Hadith Qudsi, the *Thank You, Allah* (Shukriya) atmospheric sanctuary, and the standalone *Heart in Motion* reflection.
- **Offline & Private**: Built with a service worker for offline shell caching, zero trackers, zero ads, and instant theme switching (Light, Dark, and Sepia).

---

## 🌐 Live Pages Directory

| Page | Description | Direct Link |
| :--- | :--- | :--- |
| **Home** | Primary portal & featured recitation | [heynuo.github.io/Ruqyah.io/](https://heynuo.github.io/Ruqyah.io/) |
| **Qur'an Reader** | Complete 114-Surah reader & reciter player | [heynuo.github.io/Ruqyah.io/quran.html](https://heynuo.github.io/Ruqyah.io/quran.html) |
| **108 Verses Archive** | Searchable concordance across 62 tafsirs | [heynuo.github.io/Ruqyah.io/quran-verses.html](https://heynuo.github.io/Ruqyah.io/quran-verses.html) |
| **The End (Al-Akhirah)** | Reflection on the soul's ultimate return | [heynuo.github.io/Ruqyah.io/end.html](https://heynuo.github.io/Ruqyah.io/end.html) |
| **Thank You, Allah** | Shukriya atmospheric sanctuary & gratitude audio | [heynuo.github.io/Ruqyah.io/thank-you.html](https://heynuo.github.io/Ruqyah.io/thank-you.html) |
| **Videos & Media** | Curated video reflections & visual recitations | [heynuo.github.io/Ruqyah.io/videos.html](https://heynuo.github.io/Ruqyah.io/videos.html) |
| **Hadith Qudsi** | Kinetic typography experience | [heynuo.github.io/Ruqyah.io/HadithQudsi.html](https://heynuo.github.io/Ruqyah.io/HadithQudsi.html) |
| **Allah Tribute** | Sacred names & ambient visual reflection | [heynuo.github.io/Ruqyah.io/Allah.html](https://heynuo.github.io/Ruqyah.io/Allah.html) |
| **Tawakkul** | Reliance on Allah reflection experience | [heynuo.github.io/Ruqyah.io/Tawakkul.html](https://heynuo.github.io/Ruqyah.io/Tawakkul.html) |
| **Heart in Motion** | Standalone animated movie heart emoji | [heynuo.github.io/Ruqyah.io/animated-heart-emoji.html](https://heynuo.github.io/Ruqyah.io/animated-heart-emoji.html) |
| **About & Sources** | Project background, methodology, and citations | [heynuo.github.io/Ruqyah.io/about.html](https://heynuo.github.io/Ruqyah.io/about.html) |
| **Contact** | Direct correspondence & issue reporting | [heynuo.github.io/Ruqyah.io/contact.html](https://heynuo.github.io/Ruqyah.io/contact.html) |
| **Privacy Policy** | Data disclosures & storage transparency | [heynuo.github.io/Ruqyah.io/privacy.html](https://heynuo.github.io/Ruqyah.io/privacy.html) |

---

## 🛠️ Project Structure

```text
├── index.html                   # Home page & Ayat al-Kursi recitation player
├── quran.html                   # Complete 114-Surah Qur'an reader
├── quran-verses.html            # Searchable 108 Master Verses archive
├── end.html                     # The End (Al-Akhirah) visual reflection
├── thank-you.html               # Shukriya (Sanctuary of Gratitude)
├── videos.html                  # Curated media library
├── HadithQudsi.html             # Kinetic typography experience
├── Allah.html                   # Divine names tribute
├── Tawakkul.html                # Reliance on the Creator experience
├── animated-heart-emoji.html    # Standalone animated movie heart
├── about.html                   # Scholastic methodology & sanad
├── contact.html                 # Correspondence & feedback
├── privacy.html                 # Privacy policy & local storage details
├── 404.html                     # Custom 404 page
│
├── css/
│   ├── shared-layout.css        # Unified design system, shell, & theme tokens
│   ├── tailwind.generated.css   # Minified Tailwind utility classes
│   ├── tailwind.input.css       # Tailwind source stylesheet
│   ├── quran-light.css          # Quran light typography & ambient media styles
│   ├── animated-heart.css       # Keyframes & styles for the movie heart emoji
│   ├── thank-you.css            # Atmospheric styles for the gratitude sanctuary
│   └── allah-tribute.css        # Sacred names tribute animations
│
├── js/
│   ├── shared-layout.js         # Header, footer, and theme injector
│   ├── script.js                # Search dialog, keyboard shortcuts & site interactions
│   ├── home-page.js             # Homepage audio player controller
│   ├── quran-page.js            # Surah reader audio controller & navigation
│   ├── about-audio-player.js    # About page audio controller
│   ├── audio-reciter-data.js    # Verified reciters dataset
│   └── data/
│       └── master-verses-data.js# 108 Master Verses dataset with tafsir citations
│
├── assets/
│   ├── audio/                   # Master MP3 recitation tracks
│   ├── videos/                  # HD MP4 media & ambient loops
│   ├── banners/                 # OG cards & responsive banners
│   ├── icons/                   # Web app icons & vector assets
│   └── pdf/                     # Transliteration & master compilation PDFs
│
├── tools/
│   ├── validate-site.ps1        # Comprehensive link, attribute, & layout integrity checker
│   ├── check-css.ps1            # CSS structure verification script
│   ├── stamp-build.ps1          # Cache-busting stamp utility
│   ├── optimize-images.ps1      # Asset optimization utility
│   └── serve.ps1                # Local development server
│
├── manifest.json                # Web App Manifest (PWA support)
├── sw.js                        # Offline service worker cache controller
└── package.json                 # Tailwind CLI build scripts
```

---

## 💻 Local Development

### 1. Build CSS
Install dependencies and build the Tailwind CSS utilities:

```bash
npm ci
npm run build:css
```

### 2. Start a Local Server
Run with PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\serve.ps1
```

Or with Python:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/` in your browser.

### 3. Verify Site Integrity
Run the automated verification suite before committing:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\validate-site.ps1
powershell -ExecutionPolicy Bypass -File .\tools\check-css.ps1
```

### 4. Store heavy media in Cloudflare R2

Large video, audio, and PDF files can be stored in R2 and served through a Cloudflare custom domain. The media loader keeps local paths working during setup, then uses the R2 domain after a successful upload. Videos and PDFs are only requested as they approach the visible part of the page.

1. In Cloudflare, create an R2 bucket and connect a custom domain such as `media.example.com`. Add a Cache Rule for the media domain so video, audio, and PDF responses are cached. The `r2.dev` URL is intended for development use.
2. Revoke any Cloudflare API bearer token you pasted into a chat. Then create an R2 API token with **Object Read & Write** access scoped to this bucket. Copy its **Access Key ID** and **Secret Access Key**. The Cloudflare API bearer token is a different credential and must not be used here.
3. Copy `.env.r2.example` to `.env.r2` and fill in the account ID, bucket name, S3 credentials, and public custom-domain URL. `.env.r2` is ignored by Git.
4. Preview the upload with `npm run r2:upload -- --dry-run`, then run `npm run r2:upload`. This uploads `assets/videos`, `assets/allah-background-videos`, `assets/audio`, and `assets/pdf` with multipart uploads. On success, it writes the public URL to `js/r2-config.js`.
5. Commit and deploy the site, then open the video and PDF pages to confirm playback and downloads work from the custom domain.
6. After checking the deployed URLs, run `npm run r2:untrack` and commit the staged deletions. This removes uploaded media from Git tracking while keeping the local originals. Existing files are still tracked until this step; new files in the heavy-media folders are ignored by Git.

This keeps future commits and GitHub Pages deployments from including the media. Earlier Git commits still contain their historical copies; removing those requires a separate Git history rewrite.

For the Hadith Qudsi visualizer, allow `GET` from `https://heynuo.github.io` in the bucket's CORS policy so the Web Audio analyser can read the cross-origin video. Add your local development origin if you test that page locally.

In VS Code, open **Terminal → Run Task** and choose an `R2:` task to preview, upload, or stop tracking the media. Cloudflare recommends a custom domain for caching; the `r2.dev` URL is rate-limited and intended for non-production traffic. See [R2 S3 credentials](https://developers.cloudflare.com/r2/get-started/s3/), [R2 public buckets](https://developers.cloudflare.com/r2/buckets/public-buckets/), and [R2 caching](https://developers.cloudflare.com/cache/interaction-cloudflare-products/r2/).

### 5. Multi-Region Storage with IDrive e2

High-performance S3-compatible multi-region backup and storage across 4 regions:

1. Copy `.env.e2.example` to `.env.e2` and add your access keys and bucket names for each region. `.env.e2` is ignored by Git.
2. Run sync commands:
   ```powershell
   npm run e2:sync              # Singapore 2 (ap-southeast-2)
   npm run e2:sync:milan        # Milan (eu-south-1)
   npm run e2:sync:frankfurt    # Frankfurt (eu-central-2)
   npm run e2:sync:london       # London 2 (eu-west-3)
   npm run e2:sync:all          # Sync to all 4 regions simultaneously
   ```
3. Verify bucket contents:
   ```powershell
   npm run e2:sync:london -- --list
   ```

### 6. Media CDN Delivery & Optimization with ImageKit.io

Global real-time image, video, and audio optimization with global CDN caching:

1. In [ImageKit Developer Options](https://imagekit.io/dashboard/developer/api-keys), copy your **Private Key**, **Public Key**, and **URL-endpoint**.
2. Copy `.env.imagekit.example` to `.env.imagekit` and add your keys. `.env.imagekit` is ignored by Git.
3. Sync commands:
   ```powershell
   npm run imagekit:sync                 # Upload to Account 1 (fjx6vpmqa)
   npm run imagekit:sync:2               # Upload to Account 2 (6vyidckdo)
   npm run imagekit:sync:3               # Upload to Account 3 (wwj3gmj12)
   npm run imagekit:sync:4               # Upload to Account 4 (ofapqtlnv)
   npm run imagekit:sync:5               # Upload to Account 5 (dzq4rl4uto)
   npm run imagekit:sync:6               # Upload to Account 6 (yykzeurhf)
   npm run imagekit:sync:7               # Upload to Account 7 (pg7oyq2kd)
   npm run imagekit:sync:8               # Upload to Account 8 (bs7xykshf)
   npm run imagekit:sync:all             # Sync to all ImageKit accounts
   npm run imagekit:switch               # Switch site CDN to Account 1
   npm run imagekit:switch:2             # Switch site CDN to Account 2
   npm run imagekit:switch:3             # Switch site CDN to Account 3
   npm run imagekit:switch:4             # Switch site CDN to Account 4
   npm run imagekit:switch:5             # Switch site CDN to Account 5
   npm run imagekit:switch:6             # Switch site CDN to Account 6
   npm run imagekit:switch:7             # Switch site CDN to Account 7
   npm run imagekit:switch:8             # Switch site CDN to Account 8
   ```

### 7. Global Multi-Region Edge Storage with DBByte

Developer object storage with integrated global edge CDN caching across 4 multi-region accounts:

- **Account 1**: `ruqyah-media` (`us-west-1` — US West)
- **Account 2**: `ruqyah-social` (`ap-southeast-1` — Asia Pacific / Singapore)
- **Account 3**: `mo-vlogs` (`eu-west-1` — Europe / Ireland)
- **Account 4**: `ruqyah-op` (`us-east-1` — US East / N. Virginia)

1. Copy `.env.dbbyte.example` to `.env.dbbyte` and add your API keys. `.env.dbbyte` is protected by `.gitignore`.
2. Management & sync commands:
   ```powershell
   npm run dbbyte:list:all           # List files across all 4 accounts
   npm run dbbyte:sync               # Upload to Account 1 (ruqyah-media)
   npm run dbbyte:sync:2             # Upload to Account 2 (ruqyah-social)
   npm run dbbyte:sync:3             # Upload to Account 3 (mo-vlogs)
   npm run dbbyte:sync:4             # Upload to Account 4 (ruqyah-op)
   npm run dbbyte:sync:all           # Multi-region sync across all accounts (smart-skips existing)
   npm run dbbyte:switch             # Switch live website to Account 1 CDN
   npm run dbbyte:switch:2           # Switch live website to Account 2 CDN
   npm run dbbyte:switch:3           # Switch live website to Account 3 CDN
   npm run dbbyte:switch:4           # Switch live website to Account 4 CDN
   ```

---

## 📜 Scholastic Citations & Audio Sources

- **Sacred Scripture**: King Fahd Complex for the Printing of the Holy Qur'an, Tanzil Project, and Saheeh International translation.
- **Tafsir Concordance**: 62 classical works including Tafsir Ibn Kathir, Al-Tabari, Al-Qurtubi, Al-Baghawi, and Al-Sa'di.
- **Audio Recitations**: EveryAyah and Al-Islam scholarly archives (featuring Al-Hafiz Mishary Alafasy, Sheikh Abdulbasit Abdulsamad, Sheikh Mahmoud Khalil Al-Husary, and others).

---

## 📄 License

This repository is published under the [MIT License](LICENSE). Dedicated to open Islamic scholarship and timeless spiritual preservation.

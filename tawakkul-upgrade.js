/* Tawakkul video upgrade — adds ink/paper textures, bokeh dust, handheld camera,
   light-leak cuts, audio-reactive bloom, ambient Ambilight backdrop, glowing subtitles,
   and clean replay controls when voiceover ends. */
(function () {
  'use strict';

  const stage = document.getElementById('stage-wrapper');
  if (!stage) return;

  /* ---------- Dynamic CSS Injection ---------- */
  const css = document.createElement('style');
  css.textContent = `
  .np-big-head, .herald-headline, .np-top-title, .herald-masthead {
    filter: url(#ink);
    text-shadow: 0 0 1px rgba(18,18,17,.7), .6px .6px 0 rgba(18,18,17,.35), -.4px 0 0 rgba(80,20,10,.25);
  }
  .np-cols-2, .np-deck { filter: url(#inksoft); }
  .np-page, .herald-sheet {
    box-shadow: inset 0 0 70px rgba(120,90,50,.35), inset 0 0 6px rgba(0,0,0,.25), 0 30px 60px rgba(0,0,0,.55);
  }
  .np-photo-box { filter: contrast(1.25) saturate(.75) sepia(.3); }
  .glare {
    animation: sweep 8s linear infinite;
    background-size: 220% 100%, 100% 100%;
  }
  @keyframes sweep {
    0% { background-position: 130% 0, 0 0; }
    100% { background-position: -60% 0, 0 0; }
  }
  #fx-dust {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 703;
    pointer-events: none;
    mix-blend-mode: screen;
  }
  #fx-bloom {
    position: absolute;
    inset: 0;
    z-index: 704;
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: .35;
    background: radial-gradient(ellipse at 50% 45%, rgba(255,226,170,.32), transparent 64%);
    transition: opacity 0.15s ease;
  }
  #fx-leak {
    position: absolute;
    inset: 0;
    z-index: 705;
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: 0;
    background: linear-gradient(105deg, rgba(255,140,50,.9), rgba(255,70,140,.6) 38%, rgba(255,230,160,.95) 68%, transparent);
    transition: opacity 0.1s ease;
  }
  #fx-fade {
    position: absolute;
    inset: 0;
    z-index: 900;
    pointer-events: none;
    background: #000;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  #fx-bar {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 3.5px;
    z-index: 899;
    background: linear-gradient(90deg, #fde047, #f97316 50%, #38bdf8 100%);
    box-shadow: 0 0 12px #f59e0b;
    width: 0;
  }
  #subtitle-bar {
    border-color: rgba(253,224,71,.35) !important;
  }
  #subtitle-bar.pop {
    animation: subpop .38s cubic-bezier(.2,.9,.25,1.2);
  }
  @keyframes subpop {
    from { opacity: 0; transform: translateX(-50%) translateY(10px) scale(.96); filter: blur(3px); }
    to { opacity: 1; transform: translateX(-50%) scale(1); filter: none; }
  }
  #sub-urdu {
    text-shadow: 0 0 16px rgba(253,224,71,.65), 0 2px 6px rgba(0,0,0,.9);
  }
  .camera-rig {
    filter: drop-shadow(0 24px 34px rgba(0,0,0,.55));
  }
  .gcal-modal, .alttab-overlay, .ig-bubble, .sat-ribbon-yellow, .sat-ribbon-white {
    backdrop-filter: blur(14px) saturate(1.3);
  }
  `;
  document.head.appendChild(css);

  /* ---------- SVG ink-bleed filters ---------- */
  const svg = document.createElement('div');
  svg.innerHTML = `<svg width="0" height="0" style="position:absolute"><defs>
   <filter id="ink" x="-5%" y="-5%" width="110%" height="110%">
     <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n"/>
     <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6"/>
     <feGaussianBlur stdDeviation=".25"/>
   </filter>
   <filter id="inksoft">
     <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="9" result="n"/>
     <feDisplacementMap in="SourceGraphic" in2="n" scale=".7"/>
   </filter>
  </defs></svg>`;
  document.body.appendChild(svg);

  /* ---------- Overlays ---------- */
  const mk = (tag, id) => {
    let e = document.getElementById(id);
    if (!e) {
      e = document.createElement(tag);
      e.id = id;
      stage.appendChild(e);
    }
    return e;
  };

  const dust = mk('canvas', 'fx-dust');
  const bloom = mk('div', 'fx-bloom');
  const leak = mk('div', 'fx-leak');
  const fade = mk('div', 'fx-fade');
  const bar = mk('div', 'fx-bar');
  const dctx = dust.getContext('2d');

  // Stardust & ambient ember particles
  const P = Array.from({ length: 65 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 1 + Math.random() * 4.5,
    vx: (Math.random() - .5) * .022,
    vy: -.012 - Math.random() * .035,
    a: .08 + Math.random() * .28,
    ph: Math.random() * 6.28,
    hue: Math.random() > 0.6 ? 45 : 35
  }));

  function drawDust(e, n) {
    if (dust.width !== stage.clientWidth) dust.width = stage.clientWidth;
    if (dust.height !== stage.clientHeight) dust.height = stage.clientHeight;
    const w = dust.width, h = dust.height;
    if (!w || !h) return;
    dctx.clearRect(0, 0, w, h);

    const boost = 1 + e * 7;
    for (const p of P) {
      p.x += p.vx * boost * .016;
      p.y += p.vy * boost * .016;
      if (p.y < -.05) { p.y = 1.05; p.x = Math.random(); }
      if (p.x < -.05) p.x = 1.05;
      if (p.x > 1.05) p.x = -.05;

      const R = p.r * (1 + e * 2.2);
      const al = p.a * (.6 + .4 * Math.sin(n * .0025 + p.ph));
      const g = dctx.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, R * 3.8);
      g.addColorStop(0, `hsla(${p.hue}, 95%, 75%, ${al})`);
      g.addColorStop(1, `hsla(${p.hue}, 90%, 50%, 0)`);
      dctx.fillStyle = g;
      dctx.beginPath();
      dctx.arc(p.x * w, p.y * h, R * 3.8, 0, 6.283);
      dctx.fill();
    }
  }

  /* ---------- Per-frame FX & Ambilight ---------- */
  const CUT = [3.35, 8.45, 16.60, 23.45, 34.85, 37.35, 41.65, 46.25];
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  let lastSub = '', finished = false, hasStarted = false;

  function fx() {
    const n = performance.now();
    const e = typeof getAudioEnergy === 'function' ? getAudioEnergy() : 0;
    const T = TOTAL_DURATION || 50.83;
    const t = currentTime || 0;

    // Handheld camera subtle natural drift on the active scene
    const sc = document.querySelector('.scene.active');
    if (sc) {
      const shakeX = Math.sin(n * .0013) * 2.2 + e * 4.5 * Math.sin(n * .05);
      const shakeY = Math.cos(n * .0011) * 1.8;
      const shakeRot = Math.sin(n * .0009) * .22;
      sc.style.transform = `translate(${shakeX.toFixed(2)}px, ${shakeY.toFixed(2)}px) rotate(${shakeRot.toFixed(3)}deg)`;
    }

    drawDust(e, n);
    bloom.style.opacity = (.28 + e * .85).toFixed(2);

    // Light leak on scene transitions
    const tt = t * (BASE_DURATION / T);
    const d = Math.min(...CUT.map(c => Math.abs(tt - c)));
    leak.style.opacity = (cl(1 - d / .22) * .75).toFixed(2);
    leak.style.backgroundPosition = `${(n * .05) % 200}% 0`;

    // Ambient Ambilight Backlight
    const ambientEl = document.getElementById('stage-ambient');
    if (ambientEl) {
      let ambBg = 'radial-gradient(circle at center, rgba(59, 130, 246, 0.45), transparent 70%)';
      if (tt < 3.35) ambBg = 'radial-gradient(circle at center, rgba(59, 130, 246, 0.48), transparent 70%)';
      else if (tt < 8.45) ambBg = tt >= 6.85 ? 'radial-gradient(circle at center, rgba(239, 68, 68, 0.65), transparent 70%)' : 'radial-gradient(circle at center, rgba(56, 189, 248, 0.48), transparent 70%)';
      else if (tt < 16.60) ambBg = 'radial-gradient(circle at center, rgba(29, 185, 84, 0.5), rgba(7, 59, 102, 0.35) 50%, transparent 70%)';
      else if (tt < 23.45) ambBg = 'radial-gradient(circle at center, rgba(217, 70, 239, 0.48), rgba(249, 115, 22, 0.35) 50%, transparent 70%)';
      else if (tt < 34.85) ambBg = 'radial-gradient(circle at center, rgba(217, 119, 6, 0.48), transparent 70%)';
      else if (tt < 37.35) ambBg = 'radial-gradient(circle at center, rgba(202, 138, 4, 0.52), transparent 70%)';
      else if (tt < 41.65) ambBg = 'radial-gradient(circle at center, rgba(220, 38, 38, 0.62), transparent 70%)';
      else if (tt < 46.25) ambBg = 'radial-gradient(circle at center, rgba(249, 115, 22, 0.68), transparent 70%)';
      else ambBg = tt >= 48.0 ? 'radial-gradient(circle at center, rgba(234, 179, 8, 0.8), rgba(245, 158, 11, 0.45) 50%, transparent 70%)' : 'radial-gradient(circle at center, rgba(37, 99, 235, 0.52), transparent 70%)';

      ambientEl.style.background = ambBg;
      ambientEl.style.transform = `scale(${(1 + e * 0.28).toFixed(3)})`;
    }

    // Controls Equalizer visualizer
    const controlsEl = document.getElementById('controls');
    if (controlsEl) {
      controlsEl.classList.toggle('playing', isPlaying);
    }

    // Fade in at start and fade out at video end
    if (finished) {
      fade.style.opacity = '1';
    } else if (hasStarted) {
      fade.style.opacity = Math.max(cl(1 - t / .45), cl((t - (T - .7)) / .65)).toFixed(3);
    } else {
      fade.style.opacity = '0';
    }

    bar.style.width = (cl(t / T) * 100).toFixed(2) + '%';

    // Subtitle pop on line change
    const subEngEl = document.getElementById('sub-eng');
    if (subEngEl) {
      const s = subEngEl.textContent;
      if (s !== lastSub) {
        lastSub = s;
        const sb = document.getElementById('subtitle-bar');
        if (sb) {
          sb.classList.remove('pop');
          void sb.offsetWidth;
          sb.classList.add('pop');
        }
      }
    }
  }

  /* ---------- HARD STOP when voiceover ends ---------- */
  function finishVideo() {
    if (finished) return;
    finished = true;
    isPlaying = false;
    try { audio.pause(); } catch (_) {}
    currentTime = TOTAL_DURATION - 0.05;
    renderFrame(currentTime);
    fade.style.opacity = '1';
    playBtn.textContent = '↻ Replay';
    audioStatus.textContent = 'Completed (Replay)';
    const controlsEl = document.getElementById('controls');
    if (controlsEl) controlsEl.classList.remove('playing');
  }

  animate = function () {
    jitterGrain();
    if (isPlaying) {
      hasStarted = true;
      if (!useSynthClock && !audio.paused) currentTime = audio.currentTime;
      else if (useSynthClock) currentTime = (performance.now() - synthStart) / 1000;

      if (currentTime >= TOTAL_DURATION - 0.04 || (!useSynthClock && audio.ended)) {
        finishVideo();
      } else {
        renderFrame(currentTime);
      }
    }
    fx();
    requestAnimationFrame(animate);
  };

  audio.addEventListener('ended', finishVideo);

  playBtn.addEventListener('click', () => {
    hasStarted = true;
    if (finished) {
      finished = false;
      currentTime = 0;
      audio.currentTime = 0;
      synthStart = performance.now();
      isPlaying = false;
    }
  }, true);

  scrubber.addEventListener('input', () => {
    finished = false;
  });

  /* Audio filename fallback (dot vs underscore) */
  audio.addEventListener('error', () => {
    if (!audio.dataset.retry) {
      audio.dataset.retry = '1';
      audio.src = 'audio_6af41204e4ea39_02321364.mp3';
    }
  });
})();

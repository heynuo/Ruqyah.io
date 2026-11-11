/* Tawakkul video upgrade — add ONE line before </body> in your HTML, after your main <script>:
   <script src="tawakkul-upgrade.js"></script>
   Adds: ink/paper textures, bokeh dust, handheld camera, light-leak cuts, bloom, glowing subtitles,
   fade in/out, and a HARD STOP when the voiceover ends (no more looping, Replay button). */
(function () {
  const stage = document.getElementById('stage-wrapper');
  if (!stage) return;

  /* ---------- CSS ---------- */
  const css = document.createElement('style');
  css.textContent = `
  .np-big-head,.herald-headline,.np-top-title,.herald-masthead{filter:url(#ink);
    text-shadow:0 0 1px rgba(18,18,17,.7),.6px .6px 0 rgba(18,18,17,.35),-.4px 0 0 rgba(80,20,10,.25);}
  .np-cols-2,.np-deck{filter:url(#inksoft);}
  .np-page,.herald-sheet{box-shadow:inset 0 0 70px rgba(120,90,50,.35),inset 0 0 6px rgba(0,0,0,.25),0 30px 60px rgba(0,0,0,.55);}
  .np-photo-box{filter:contrast(1.25) saturate(.7) sepia(.35);}
  .glare{animation:sweep 7s linear infinite;background-size:220% 100%,100% 100%;}
  @keyframes sweep{0%{background-position:130% 0,0 0}100%{background-position:-60% 0,0 0}}
  #fx-dust{position:absolute;inset:0;width:100%;height:100%;z-index:703;pointer-events:none;mix-blend-mode:screen}
  #fx-bloom{position:absolute;inset:0;z-index:704;pointer-events:none;mix-blend-mode:screen;opacity:.35;
    background:radial-gradient(ellipse at 50% 45%,rgba(255,226,170,.28),transparent 62%)}
  #fx-leak{position:absolute;inset:0;z-index:705;pointer-events:none;mix-blend-mode:screen;opacity:0;
    background:linear-gradient(100deg,rgba(255,120,40,.85),rgba(255,60,120,.55) 40%,rgba(255,220,150,.9) 70%,transparent)}
  #fx-fade{position:absolute;inset:0;z-index:900;pointer-events:none;background:#000;opacity:0}
  #fx-bar{position:absolute;left:0;bottom:0;height:3px;z-index:899;background:linear-gradient(90deg,#fde047,#f97316);
    box-shadow:0 0 10px #f59e0b;width:0}
  #subtitle-bar{animation:none;border-color:rgba(253,224,71,.28)!important}
  #subtitle-bar.pop{animation:subpop .38s cubic-bezier(.2,.9,.25,1.2)}
  @keyframes subpop{from{opacity:0;transform:translateX(-50%) translateY(10px) scale(.96);filter:blur(3px)}to{opacity:1;transform:translateX(-50%) scale(1);filter:none}}
  #sub-urdu{text-shadow:0 0 14px rgba(253,224,71,.55),0 2px 4px rgba(0,0,0,.8)}
  .camera-rig{filter:drop-shadow(0 22px 30px rgba(0,0,0,.45))}
  .gcal-modal,.alttab-overlay,.ig-bubble,.sat-ribbon-yellow,.sat-ribbon-white{backdrop-filter:blur(14px) saturate(1.3)}
  `;
  document.head.appendChild(css);

  /* ---------- SVG ink-bleed filters ---------- */
  const svg = document.createElement('div');
  svg.innerHTML = `<svg width="0" height="0" style="position:absolute"><defs>
   <filter id="ink" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6"/><feGaussianBlur stdDeviation=".25"/></filter>
   <filter id="inksoft"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="1" seed="9" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale=".7"/></filter></defs></svg>`;
  document.body.appendChild(svg);

  /* ---------- Overlays ---------- */
  const mk = (tag, id) => { const e = document.createElement(tag); e.id = id; stage.appendChild(e); return e; };
  const dust = mk('canvas', 'fx-dust'); mk('div', 'fx-bloom');
  const leak = mk('div', 'fx-leak'), fade = mk('div', 'fx-fade'), bar = mk('div', 'fx-bar');
  const dctx = dust.getContext('2d');
  const P = Array.from({ length: 55 }, () => ({
    x: Math.random(), y: Math.random(), r: 1 + Math.random() * 5,
    vx: (Math.random() - .5) * .02, vy: -.01 - Math.random() * .03, a: .08 + Math.random() * .25, ph: Math.random() * 6.28
  }));
  function drawDust(e, n) {
    if (dust.width !== stage.clientWidth) dust.width = stage.clientWidth;
    if (dust.height !== stage.clientHeight) dust.height = stage.clientHeight;
    const w = dust.width, h = dust.height;
    dctx.clearRect(0, 0, w, h);
    for (const p of P) {
      p.x += p.vx * (1 + e * 8) * .016; p.y += p.vy * (1 + e * 8) * .016;
      if (p.y < -.05) { p.y = 1.05; p.x = Math.random(); }
      if (p.x < -.05) p.x = 1.05; if (p.x > 1.05) p.x = -.05;
      const R = p.r * (1 + e * 2), al = p.a * (.6 + .4 * Math.sin(n * .002 + p.ph));
      const g = dctx.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, R * 4);
      g.addColorStop(0, `rgba(255,225,170,${al})`); g.addColorStop(1, 'rgba(255,200,120,0)');
      dctx.fillStyle = g; dctx.beginPath(); dctx.arc(p.x * w, p.y * h, R * 4, 0, 6.283); dctx.fill();
    }
  }

  /* ---------- Per-frame FX ---------- */
  const CUT = [3.35, 8.45, 16.60, 23.45, 34.85, 37.35, 41.65, 46.25];
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  let lastSub = '', finished = false, hasStarted = false;
  function fx() {
    const n = performance.now(), e = getAudioEnergy();
    const T = TOTAL_DURATION, t = currentTime;
    // handheld camera on the active scene
    const sc = document.querySelector('.scene.active');
    if (sc) sc.style.transform =
      `translate(${Math.sin(n * .0013) * 2.2 + e * 5 * Math.sin(n * .05)}px,${Math.cos(n * .0011) * 1.8}px) rotate(${Math.sin(n * .0009) * .2}deg)`;
    drawDust(e, n);
    document.getElementById('fx-bloom').style.opacity = (.3 + e * .9).toFixed(2);
    // light leak on every cut (short burst after the cut)
    const tt = t * (BASE_DURATION / T);
    const d = Math.min(...CUT.map(c => Math.abs(tt - c)));
    leak.style.opacity = (cl(1 - d / .22) * .7).toFixed(2);
    leak.style.backgroundPosition = `${(n * .05) % 200}% 0`;
    // fade in at start (when playing), fade out right before the voiceover ends (or when finished)
    if (finished) {
      fade.style.opacity = '1';
    } else if (hasStarted) {
      fade.style.opacity = Math.max(cl(1 - t / .45), cl((t - (T - .8)) / .7)).toFixed(3);
    } else {
      fade.style.opacity = '0';
    }
    bar.style.width = (cl(t / T) * 100).toFixed(2) + '%';
    // subtitle pop
    const s = document.getElementById('sub-eng').textContent;
    if (s !== lastSub) {
      lastSub = s; const sb = document.getElementById('subtitle-bar');
      sb.classList.remove('pop'); void sb.offsetWidth; sb.classList.add('pop');
    }
  }

  /* ---------- HARD STOP when voiceover ends ---------- */
  function finishVideo() {
    if (finished) return;
    finished = true; isPlaying = false;
    try { audio.pause(); } catch (e) {}
    currentTime = TOTAL_DURATION - 0.05;
    renderFrame(currentTime);
    fade.style.opacity = 1;
    playBtn.textContent = '↻ Replay';
    audioStatus.textContent = 'Ended with voiceover';
  }
  animate = function () {
    jitterGrain();
    if (isPlaying) {
      hasStarted = true;
      if (!useSynthClock && !audio.paused) currentTime = audio.currentTime;
      else if (useSynthClock) currentTime = (performance.now() - synthStart) / 1000;
      if (currentTime >= TOTAL_DURATION - 0.04 || (!useSynthClock && audio.ended)) finishVideo();
      else renderFrame(currentTime);
    }
    fx();
    requestAnimationFrame(animate);
  };
  audio.addEventListener('ended', finishVideo);
  playBtn.addEventListener('click', () => {            // capture: runs before the original handler
    hasStarted = true;
    if (finished) { finished = false; currentTime = 0; audio.currentTime = 0; synthStart = performance.now(); isPlaying = false; }
  }, true);
  scrubber.addEventListener('input', () => { finished = false; });

  /* audio filename fallback (dot vs underscore) */
  audio.addEventListener('error', () => {
    if (!audio.dataset.retry) { audio.dataset.retry = 1; audio.src = 'audio_6af41204e4ea39_02321364.mp3'; }
  });
})();

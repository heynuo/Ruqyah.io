(function () {
  'use strict';

  const player = document.getElementById('audio-player-bar');
  if (!player) return;

  const audio = new Audio();
  audio.preload = 'none';

  const controls = {
    play: document.getElementById('player-main-play-btn'),
    playIcon: document.getElementById('player-play-icon'),
    title: document.getElementById('player-verse-title'),
    badge: document.getElementById('player-verse-badge'),
    currentTime: document.getElementById('player-time-curr'),
    totalTime: document.getElementById('player-time-total'),
    progress: document.getElementById('player-progress'),
    thumb: document.getElementById('player-thumb'),
    seek: document.getElementById('player-scrub-bar'),
    speed: document.getElementById('speed-toggle-btn'),
    repeat: document.getElementById('player-repeat-btn'),
    mute: document.getElementById('audio-mute-btn'),
    volume: document.getElementById('volume-track'),
    volumeFill: document.getElementById('volume-bar'),
    status: document.getElementById('player-status'),
    minimize: document.getElementById('minimize-player-btn'),
    minimizeMobile: document.getElementById('minimize-player-btn-mobile'),
    restore: document.getElementById('restore-audio-player-btn'),
    minimizeIcon: document.getElementById('minimize-icon'),
  };

  const speedSteps = [0.75, 1, 1.25, 1.5, 2];
  let ayah = 255;
  let repeat = false;
  let speed = 1;
  let volume = 0.75;
  let lastVolume = 0.75;
  let minimized = false;
  let playRequest = 0;

  function readPreference(key, fallback) {
    try {
      const value = localStorage.getItem(`about-audio-${key}`);
      return value === null ? fallback : value;
    } catch (_) {
      return fallback;
    }
  }

  function savePreference(key, value) {
    try { localStorage.setItem(`about-audio-${key}`, String(value)); } catch (_) {}
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  }

  function setStatus(message, isError = false, isBusy = false) {
    if (!controls.status) return;
    controls.status.textContent = message;
    controls.status.classList.toggle('hidden', !message);
    controls.status.classList.toggle('text-danger', isError);
    controls.status.classList.toggle('text-secondary', !isError);
    if (controls.play) controls.play.setAttribute('aria-busy', String(isBusy));
    player.setAttribute('aria-busy', String(isBusy));
  }

  function updatePlayState(playing) {
    if (controls.playIcon) {
      controls.playIcon.innerHTML = playing
        ? '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>'
        : '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
    }
    if (controls.play) {
      controls.play.setAttribute('aria-label', playing ? 'Pause recitation' : 'Play recitation');
      controls.play.setAttribute('aria-pressed', String(playing));
      controls.play.title = playing ? 'Pause recitation' : 'Play recitation';
    }
  }

  function updateTrackLabel() {
    if (controls.title) controls.title.textContent = `Al-Baqarah 2:${ayah}`;
    if (controls.badge) controls.badge.textContent = ayah === 255 ? 'Ayat al-Kursi' : `Verse ${ayah}`;
    const previous = document.getElementById('player-prev-btn');
    const next = document.getElementById('player-next-btn');
    if (previous) previous.title = `Previous verse (002:${ayah === 1 ? 286 : ayah - 1})`;
    if (next) next.title = `Next verse (002:${ayah === 286 ? 1 : ayah + 1})`;
  }

  function updateProgress() {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
    const percent = duration > 0 ? clamp((current / duration) * 100, 0, 100) : 0;
    if (controls.currentTime) controls.currentTime.textContent = formatTime(current);
    if (controls.totalTime) controls.totalTime.textContent = duration > 0 ? formatTime(duration) : '00:00';
    if (controls.progress) controls.progress.style.width = `${percent}%`;
    if (controls.thumb) controls.thumb.style.left = `${percent}%`;
    if (controls.seek) {
      controls.seek.setAttribute('aria-valuenow', String(Math.round(percent)));
      controls.seek.setAttribute('aria-valuetext', `${formatTime(current)} of ${formatTime(duration)}`);
    }
  }

  function setVolume(value) {
    volume = clamp(Number(value) || 0, 0, 1);
    audio.volume = volume;
    audio.muted = volume === 0;
    if (volume > 0) lastVolume = volume;
    if (controls.volumeFill) controls.volumeFill.style.width = `${Math.round(volume * 100)}%`;
    if (controls.volume) {
      controls.volume.setAttribute('aria-valuenow', String(Math.round(volume * 100)));
      controls.volume.setAttribute('aria-valuetext', `${Math.round(volume * 100)} percent`);
    }
    if (controls.mute) {
      controls.mute.setAttribute('aria-pressed', String(volume === 0));
      controls.mute.setAttribute('aria-label', volume === 0 ? 'Unmute audio' : 'Mute audio');
      controls.mute.title = volume === 0 ? 'Unmute audio' : 'Mute audio';
    }
    savePreference('volume', volume);
    if (volume > 0) savePreference('last-volume', lastVolume);
  }

  function setSpeed(value) {
    speed = value;
    audio.playbackRate = speed;
    if (controls.speed) controls.speed.textContent = `${speed.toFixed(speed % 1 === 0 ? 1 : 2)}x`;
    savePreference('speed', speed);
  }

  function play() {
    const request = ++playRequest;
    setStatus('', false, true);
    audio.play().then(() => {
      if (request === playRequest) setStatus('');
    }).catch(error => {
      if (request !== playRequest) return;
      updatePlayState(false);
      setStatus(error?.name === 'NotAllowedError'
        ? 'Tap play again to start recitation.'
        : 'Audio could not be loaded. Please try again.', true);
    });
  }

  function loadAyah(nextAyah, autoplay) {
    ayah = clamp(nextAyah, 1, 286);
    playRequest++;
    audio.pause();
    audio.src = `https://everyayah.com/data/Alafasy_128kbps/002${String(ayah).padStart(3, '0')}.mp3`;
    audio.playbackRate = speed;
    updateTrackLabel();
    updateProgress();
    setStatus('');
    if (autoplay) play();
    else updatePlayState(false);
  }

  function stepAyah(amount) {
    const wasPlaying = !audio.paused && Boolean(audio.src);
    const nextAyah = ayah + amount;
    loadAyah(nextAyah < 1 ? 286 : nextAyah > 286 ? 1 : nextAyah, wasPlaying);
  }

  function togglePlayback() {
    if (audio.paused || !audio.src) {
      if (!audio.src) audio.src = `https://everyayah.com/data/Alafasy_128kbps/002${String(ayah).padStart(3, '0')}.mp3`;
      play();
    } else {
      playRequest++;
      audio.pause();
      setStatus('');
      updatePlayState(false);
    }
  }

  function updateRepeatButton() {
    if (controls.repeat) {
      controls.repeat.setAttribute('aria-pressed', String(repeat));
      controls.repeat.setAttribute('aria-label', `Repeat current verse: ${repeat ? 'on' : 'off'}`);
      controls.repeat.classList.toggle('text-primary', repeat);
      controls.repeat.classList.toggle('bg-surface-container-low', repeat);
    }
  }

  function toggleRepeat() {
    repeat = !repeat;
    updateRepeatButton();
    savePreference('repeat', repeat);
  }

  function toggleMute() {
    setVolume(volume === 0 ? lastVolume : 0);
  }

  function cycleSpeed() {
    const currentIndex = speedSteps.indexOf(speed);
    setSpeed(speedSteps[(currentIndex + 1) % speedSteps.length]);
  }

  function setMinimized(next) {
    minimized = next;
    player.classList.toggle('hidden', minimized);
    if (controls.restore) {
      controls.restore.classList.toggle('hidden', !minimized);
      controls.restore.classList.toggle('inline-flex', minimized);
    }
    if (controls.minimize) {
      controls.minimize.setAttribute('aria-expanded', String(!minimized));
      controls.minimize.setAttribute('aria-label', minimized ? 'Restore audio player' : 'Minimize audio player');
      controls.minimize.title = controls.minimize.getAttribute('aria-label');
    }
    if (controls.minimizeMobile) {
      controls.minimizeMobile.setAttribute('aria-expanded', String(!minimized));
      controls.minimizeMobile.setAttribute('aria-label', minimized ? 'Restore audio player' : 'Minimize audio player');
      controls.minimizeMobile.title = controls.minimizeMobile.getAttribute('aria-label');
    }
    if (controls.minimizeIcon) {
      controls.minimizeIcon.innerHTML = minimized
        ? '<polyline points="6 9 12 15 18 9"></polyline>'
        : '<polyline points="18 15 12 9 6 15"></polyline>';
    }
  }

  function toggleMinimize() {
    setMinimized(!minimized);
  }

  function seekFromEvent(event) {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    const rect = controls.seek.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    audio.currentTime = ratio * audio.duration;
    updateProgress();
  }

  function setVolumeFromEvent(event) {
    const rect = controls.volume.getBoundingClientRect();
    setVolume((event.clientX - rect.left) / rect.width);
  }

  audio.addEventListener('play', () => updatePlayState(true));
  audio.addEventListener('pause', () => updatePlayState(false));
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('waiting', () => setStatus('Loading audio...', false, true));
  audio.addEventListener('playing', () => setStatus(''));
  audio.addEventListener('error', () => {
    playRequest++;
    updatePlayState(false);
    setStatus('Audio unavailable. Check your connection and try again.', true);
  });
  audio.addEventListener('ended', () => {
    if (repeat) {
      audio.currentTime = 0;
      play();
    } else if (ayah < 286) {
      loadAyah(ayah + 1, true);
    } else {
      updatePlayState(false);
    }
  });

  document.getElementById('player-prev-btn')?.addEventListener('click', () => stepAyah(-1));
  document.getElementById('player-next-btn')?.addEventListener('click', () => stepAyah(1));
  document.getElementById('player-main-play-btn')?.addEventListener('click', togglePlayback);
  document.getElementById('player-repeat-btn')?.addEventListener('click', toggleRepeat);
  document.getElementById('audio-mute-btn')?.addEventListener('click', toggleMute);
  document.getElementById('speed-toggle-btn')?.addEventListener('click', cycleSpeed);
  controls.minimize?.addEventListener('click', toggleMinimize);
  controls.minimizeMobile?.addEventListener('click', toggleMinimize);
  controls.restore?.addEventListener('click', () => setMinimized(false));

  controls.seek?.addEventListener('pointerdown', event => {
    seekFromEvent(event);
    controls.seek.setPointerCapture?.(event.pointerId);
  });
  controls.seek?.addEventListener('pointermove', event => {
    if (event.buttons === 1) seekFromEvent(event);
  });
  controls.seek?.addEventListener('keydown', event => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    if (event.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
    else if (event.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    else if (event.key === 'Home') audio.currentTime = 0;
    else if (event.key === 'End') audio.currentTime = audio.duration;
    else return;
    event.preventDefault();
    updateProgress();
  });

  controls.volume?.addEventListener('pointerdown', event => {
    setVolumeFromEvent(event);
    controls.volume.setPointerCapture?.(event.pointerId);
  });
  controls.volume?.addEventListener('pointermove', event => {
    if (event.buttons === 1) setVolumeFromEvent(event);
  });
  controls.volume?.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') setVolume(volume - 0.05);
    else if (event.key === 'ArrowUp' || event.key === 'ArrowRight') setVolume(volume + 0.05);
    else if (event.key === 'Home') setVolume(0);
    else if (event.key === 'End') setVolume(1);
    else return;
    event.preventDefault();
  });

  const savedSpeed = Number(readPreference('speed', '1'));
  setSpeed(speedSteps.includes(savedSpeed) ? savedSpeed : 1);
  repeat = readPreference('repeat', 'false') === 'true';
  updateRepeatButton();
  const savedVolume = clamp(Number(readPreference('volume', '0.75')) || 0, 0, 1);
  lastVolume = clamp(Number(readPreference('last-volume', '0.75')) || 0.75, 0.05, 1);
  setVolume(savedVolume);
  updateTrackLabel();
  updateProgress();
  updatePlayState(false);

  window.AboutAudioPlayer = {
    toggle: togglePlayback,
    toggleMinimize,
  };
})();

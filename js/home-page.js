(function () {
      'use strict';

      // 1. Audio Recitation Engine with EveryAyah verse streams
      const fallbackReciter = { id: 'alafasy', name: 'Sheikh Mishary Rashid Alafasy', shortName: 'Alafasy', folder: 'Alafasy_128kbps' };
      const configuredReciters = Array.isArray(window.RuqyahAudioReciters) ? window.RuqyahAudioReciters : [];
      const RECITERS = configuredReciters.length ? configuredReciters : [fallbackReciter];
      const DEFAULT_RECITER = RECITERS.find((reciter) => reciter.id === 'alafasy') || RECITERS[0];

      function readAudioPreference(key, fallback) {
        try {
          const value = localStorage.getItem(`heynuo-audio-${key}`);
          return value === null ? fallback : value;
        } catch (error) {
          return fallback;
        }
      }

      function saveAudioPreference(key, value) {
        try { localStorage.setItem(`heynuo-audio-${key}`, String(value)); } catch (error) { }
      }

      function resolveReciter(id) {
        return RECITERS.find((reciter) => reciter.id === id) || DEFAULT_RECITER;
      }

      function getTrackUrl(track, reciter) {
        const [surah, ayah] = track.verse.split(':').map(Number);
        const fileName = `${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`;
        return `https://everyayah.com/data/${reciter.folder}/${fileName}`;
      }

      const PLAYLIST = [
        {
          verse: '2:255',
          title: 'Al-Baqarah 2:255',
          badge: 'Ayat al-Kursi',
          tafsirTitle: 'Ayat al-Kursi · Al-Baqarah 2:255',
          tafsirContent: 'This verse affirms Allah’s eternal life, self-subsistence, supreme authority, infinite knowledge, and encompassing protection. Recited for divine protection and spiritual sanctuary.'
        },
        {
          verse: '20:114',
          title: 'Ta-Ha 20:114',
          badge: 'Reflection verse',
          tafsirTitle: 'Ta-Ha 20:114 · Tafsir note',
          tafsirContent: 'Teaches humility before divine knowledge and instructs the Prophet (peace be upon him) to pray: “My Lord, increase me in knowledge.” (Rabbi zidni \'ilma).'
        },
        {
          verse: '2:285',
          title: 'Al-Baqarah 2:285',
          badge: 'Amanar-Rasul',
          tafsirTitle: 'Amanar-Rasul · Al-Baqarah 2:285',
          tafsirContent: 'Affirms wholehearted belief in Allah, His angels, His books, and His messengers. Recited at night, these concluding verses of Al-Baqarah suffice the believer as protection.'
        },
        {
          verse: '112:1',
          title: 'Al-Ikhlas 112:1',
          badge: 'Surah Al-Ikhlas',
          tafsirTitle: 'Surah Al-Ikhlas · At-Tawhid',
          tafsirContent: 'The proclamation of Allah’s absolute oneness and eternal refuge (As-Samad). In authentic prophetic tradition, recitation of this surah is equal to one-third of the Qur’an.'
        },
        {
          verse: '113:1',
          title: 'Al-Falaq 113:1',
          badge: 'Al-Mu’awwidhat',
          tafsirTitle: 'Surah Al-Falaq · Daybreak Refuge',
          tafsirContent: 'One of the primary Ruqyah refuge surahs (Al-Mu’awwidhatayn), invoking Allah’s protection from created evil, descending darkness, witchcraft, and envy.'
        },
        {
          verse: '114:1',
          title: 'An-Nas 114:1',
          badge: 'Al-Mu’awwidhat',
          tafsirTitle: 'Surah An-Nas · Mankind Refuge',
          tafsirContent: 'The concluding sanctuary chapter of the Qur’an, seeking refuge with the Lord, Sovereign, and God of mankind against whisperers from jinn and humanity.'
        }
      ];

      const TRACK_KURSI = PLAYLIST[0];
      const TRACK_TAHA = PLAYLIST[1];
      let audio = null;
      let currentTrackIndex = 0;
      let currentTrack = PLAYLIST[0];
      let currentReciter = resolveReciter(readAudioPreference('reciter', 'alafasy'));
      let isPlaying = false;
      let isRepeat = readAudioPreference('repeat', 'false') === 'true';
      let autoAdvance = readAudioPreference('auto-next', 'true') !== 'false';
      const speeds = [1.0, 1.25, 1.5, 2.0, 0.75];
      const savedSpeed = Number(readAudioPreference('speed', '1'));
      let playbackSpeed = speeds.includes(savedSpeed) ? savedSpeed : 1.0;
      const initialVolume = Number(readAudioPreference('volume', '0.8'));
      let playerVolume = Number.isFinite(initialVolume) ? Math.max(0, Math.min(1, initialVolume)) : 0.8;
      let audioMuted = readAudioPreference('muted', 'false') === 'true' || playerVolume === 0;
      const savedLastVolume = Number(readAudioPreference('last-volume', String(playerVolume || 0.8)));
      let lastVolume = Number.isFinite(savedLastVolume) && savedLastVolume > 0 ? Math.min(1, savedLastVolume) : 0.8;
      let playRequestId = 0;
      let isScrubbing = false;
      let isDraggingVolume = false;

      const flagshipPlayBtn = document.getElementById('flagship-play-btn');
      const flagshipPlayIcon = document.getElementById('flagship-play-icon');
      const flagshipPlayLabel = document.getElementById('flagship-play-label');
      const playerMainPlayBtn = document.getElementById('player-main-play-btn');
      const playerPlayIcon = document.getElementById('player-play-icon');
      const playerVerseTitle = document.getElementById('player-verse-title');
      const playerVerseBadge = document.getElementById('player-verse-badge');
      const playerReciterName = document.getElementById('player-reciter-name');
      const playerReciterSelect = document.getElementById('player-reciter-select');
      const playerTimeCurr = document.getElementById('player-time-curr');
      const playerTimeTotal = document.getElementById('player-time-total');
      const playerProgress = document.getElementById('player-progress');
      const playerThumb = document.getElementById('player-thumb');
      const playerScrubBar = document.getElementById('player-scrub-bar');
      const speedToggleBtn = document.getElementById('speed-toggle-btn');
      const playerRepeatBtn = document.getElementById('player-repeat-btn');
      const playerPrevBtn = document.getElementById('player-prev-btn');
      const playerNextBtn = document.getElementById('player-next-btn');
      const audioMuteBtn = document.getElementById('audio-mute-btn');
      const volumeBar = document.getElementById('volume-bar');
      const volumeTrack = document.getElementById('volume-track');
      const minimizePlayerBtn = document.getElementById('minimize-player-btn');
      const minimizePlayerBtnMobile = document.getElementById('minimize-player-btn-mobile');
      const restorePlayerBtn = document.getElementById('restore-audio-player-btn');
      const minimizeIcon = document.getElementById('minimize-icon');
      const audioPlayerBar = document.getElementById('audio-player-bar');
      const playAyahOfDayBtn = document.getElementById('playAyahOfDayBtn');
      const playerStatus = document.getElementById('player-status');
      const playerAudioSettings = document.getElementById('player-audio-settings');
      const playerSettingsToggle = document.getElementById('player-settings-toggle');
      const playerAudioUtilities = document.getElementById('player-audio-utilities');

      /* Publish the docked player's real height so floating overlays (the AI
         companion) can sit above it instead of covering the reciter/volume
         controls. The compact mobile bar is much taller than the desktop one. */
      function syncAudioBarOffset() {
        if (!audioPlayerBar || !document.body) return;
        const hidden = audioPlayerBar.classList.contains('hidden');
        const height = hidden ? 0 : Math.ceil(audioPlayerBar.getBoundingClientRect().height || 0);
        document.body.classList.toggle('has-audio-player', !hidden);
        document.body.style.setProperty('--audio-player-height', height + 'px');
      }

      if (audioPlayerBar) {
        syncAudioBarOffset();
        if (typeof ResizeObserver === 'function') {
          new ResizeObserver(syncAudioBarOffset).observe(audioPlayerBar);
        } else {
          window.addEventListener('resize', syncAudioBarOffset);
        }
      }

      function setPlayerSettingsOpen(open) {
        if (!playerSettingsToggle || !playerAudioUtilities) return;
        playerSettingsToggle.setAttribute('aria-expanded', String(open));
        playerSettingsToggle.setAttribute('aria-label', open ? 'Close audio settings' : 'Open audio settings');
        playerAudioUtilities.classList.toggle('hidden', !open);
        document.body.classList.toggle('audio-settings-open', open);
      }

      playerSettingsToggle?.addEventListener('click', () => {
        setPlayerSettingsOpen(playerSettingsToggle.getAttribute('aria-expanded') !== 'true');
      });

      document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || playerSettingsToggle?.getAttribute('aria-expanded') !== 'true') return;
        setPlayerSettingsOpen(false);
        playerSettingsToggle?.focus();
      });

      document.addEventListener('pointerdown', (event) => {
        if (playerSettingsToggle?.getAttribute('aria-expanded') === 'true'
          && playerAudioSettings && !playerAudioSettings.contains(event.target)) {
          setPlayerSettingsOpen(false);
        }
      });

      const desktopPlayerLayout = window.matchMedia?.('(min-width: 1280px)');
      desktopPlayerLayout?.addEventListener?.('change', () => setPlayerSettingsOpen(false));

      function formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
      }

      function setPlayerStatus(message, isError = false, isBusy = false) {
        if (playerStatus) {
          playerStatus.textContent = message;
          playerStatus.classList.toggle('hidden', !message);
          playerStatus.classList.toggle('text-danger', isError);
          playerStatus.classList.toggle('text-secondary', !isError);
        }
        playerMainPlayBtn?.setAttribute('aria-busy', String(isBusy));
        audioPlayerBar?.setAttribute('aria-busy', String(isBusy));
      }

      function formatSpeed(speed) {
        return `${Number(speed.toFixed(2))}x`;
      }

      function updateNavButtons() {
        const prevIdx = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
        const nextIdx = (currentTrackIndex + 1) % PLAYLIST.length;
        const prevTrackItem = PLAYLIST[prevIdx];
        const nextTrackItem = PLAYLIST[nextIdx];

        if (playerPrevBtn) {
          playerPrevBtn.title = `Previous: ${prevTrackItem.title} (${prevTrackItem.badge})`;
          playerPrevBtn.setAttribute('aria-label', `Previous: ${prevTrackItem.title}`);
        }
        if (playerNextBtn) {
          playerNextBtn.title = `Next: ${nextTrackItem.title} (${nextTrackItem.badge})`;
          playerNextBtn.setAttribute('aria-label', `Next: ${nextTrackItem.title}`);
        }
      }

      function updateMediaSession() {
        if (!('mediaSession' in navigator)) return;
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: `${currentTrack.title} (${currentTrack.badge})`,
            artist: currentReciter.name,
            album: 'Ruqyah.io Sacred Recitations',
            artwork: [
              { src: 'assets/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
              { src: 'assets/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
            ]
          });
          navigator.mediaSession.setActionHandler('play', () => playAudio());
          navigator.mediaSession.setActionHandler('pause', () => pauseAudio());
          navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
          navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
          navigator.mediaSession.setActionHandler('seekto', (details) => {
            if (audio && Number.isFinite(audio.duration) && details.seekTime !== undefined) {
              audio.currentTime = Math.max(0, Math.min(audio.duration, details.seekTime));
            }
          });
          navigator.mediaSession.setActionHandler('seekbackward', (details) => {
            if (audio) audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 5));
          });
          navigator.mediaSession.setActionHandler('seekforward', (details) => {
            if (audio && Number.isFinite(audio.duration)) {
              audio.currentTime = Math.min(audio.duration, audio.currentTime + (details.seekOffset || 5));
            }
          });
        } catch (_) { }
      }

      function updateMediaSessionPosition() {
        if (!('mediaSession' in navigator) || !audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
        try {
          if (typeof navigator.mediaSession.setPositionState === 'function') {
            navigator.mediaSession.setPositionState({
              duration: audio.duration,
              playbackRate: audio.playbackRate || 1,
              position: Math.min(audio.currentTime, audio.duration)
            });
          }
        } catch (_) { }
      }

      function pauseAllPageVideos() {
        document.querySelectorAll('video').forEach((v) => {
          if (v.id !== 'atmosphere-video' && !v.paused) v.pause();
        });
      }

      function updateVolumeControls() {
        const volume = audio ? audio.volume : playerVolume;
        const isMuted = audioMuted || Boolean(audio && audio.muted) || volume === 0;
        const displayedVolume = isMuted ? 0 : volume;
        const percent = Math.round(displayedVolume * 100);
        if (volumeBar) volumeBar.style.width = `${percent}%`;
        if (volumeTrack) {
          volumeTrack.setAttribute('aria-valuenow', String(percent));
          volumeTrack.setAttribute('aria-valuetext', `${percent} percent`);
        }
        if (audioMuteBtn) {
          audioMuteBtn.setAttribute('aria-pressed', String(isMuted));
          audioMuteBtn.setAttribute('aria-label', isMuted ? 'Unmute audio' : 'Mute audio');
          audioMuteBtn.title = isMuted ? 'Unmute audio' : 'Mute audio';
          audioMuteBtn.innerHTML = isMuted
            ? '<svg class="w-4 h-4 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>'
            : (displayedVolume > 0.5
              ? '<svg class="w-4 h-4 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>'
              : '<svg class="w-4 h-4 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>');
        }
      }

      function initAudio() {
        if (!audio) {
          audio = new Audio();
          audio.preload = 'metadata';
          audio.playbackRate = playbackSpeed;
          audio.volume = playerVolume;
          audio.muted = audioMuted;

          audio.addEventListener('timeupdate', () => {
            if (isScrubbing) return;
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
              const pct = Math.max(0, Math.min(100, (audio.currentTime / audio.duration) * 100));
              if (playerProgress) playerProgress.style.width = pct + '%';
              if (playerThumb) playerThumb.style.left = pct + '%';
              if (playerTimeCurr) playerTimeCurr.textContent = formatTime(audio.currentTime);
              if (playerScrubBar) {
                playerScrubBar.setAttribute('aria-valuenow', String(Math.round(pct)));
                playerScrubBar.setAttribute('aria-valuetext', `${formatTime(audio.currentTime)} of ${formatTime(audio.duration)}`);
              }
              updateMediaSessionPosition();
            }
          });

          audio.addEventListener('loadedmetadata', () => {
            if (playerTimeTotal && Number.isFinite(audio.duration) && audio.duration > 0) {
              playerTimeTotal.textContent = formatTime(audio.duration);
            }
            if (playerScrubBar && Number.isFinite(audio.duration)) {
              playerScrubBar.setAttribute('aria-valuetext', `00:00 of ${formatTime(audio.duration)}`);
            }
            updateMediaSessionPosition();
          });

          audio.addEventListener('ended', () => {
            if (isRepeat) {
              audio.currentTime = 0;
              playAudio();
            } else if (autoAdvance) {
              nextTrack();
            } else {
              setPlayState(false);
            }
          });

          audio.addEventListener('play', () => {
            if (!audio.paused) {
              pauseAllPageVideos();
              setPlayState(true);
            }
          });
          audio.addEventListener('pause', () => {
            if (audio.paused) setPlayState(false);
          });
          audio.addEventListener('waiting', () => setPlayerStatus('Buffering audio...', false, true));
          audio.addEventListener('playing', () => setPlayerStatus(''));
          audio.addEventListener('volumechange', updateVolumeControls);
          audio.addEventListener('error', () => {
            playRequestId += 1;
            setPlayState(false);
            setPlayerStatus('Audio is unavailable. Check your connection and try again.', true, false);
          });

          document.querySelectorAll('video').forEach((v) => {
            v.addEventListener('play', () => {
              if (audio && !audio.paused) pauseAudio();
            });
          });
        }
      }

      function setPlayState(playing) {
        isPlaying = playing;
        const playSvg = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        const pauseSvg = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';

        if (playerPlayIcon) playerPlayIcon.innerHTML = isPlaying ? pauseSvg : playSvg;
        if (flagshipPlayIcon) flagshipPlayIcon.innerHTML = isPlaying && currentTrack.verse === TRACK_KURSI.verse ? pauseSvg : playSvg;
        if (flagshipPlayLabel) flagshipPlayLabel.textContent = isPlaying && currentTrack.verse === TRACK_KURSI.verse ? 'Pause' : `Play (${currentReciter.shortName})`;
        if (playerMainPlayBtn) {
          playerMainPlayBtn.setAttribute('aria-label', isPlaying ? 'Pause recitation' : 'Play recitation');
          playerMainPlayBtn.setAttribute('aria-pressed', String(isPlaying));
        }
        flagshipPlayBtn?.setAttribute('aria-pressed', String(isPlaying && currentTrack.verse === TRACK_KURSI.verse));
        playAyahOfDayBtn?.setAttribute('aria-pressed', String(isPlaying && currentTrack.verse === TRACK_TAHA.verse));
      }

      function loadTrack(track, autoPlay) {
        currentTrack = track;
        currentTrackIndex = PLAYLIST.findIndex((t) => t.verse === track.verse);
        if (currentTrackIndex === -1) currentTrackIndex = 0;

        initAudio();
        playRequestId += 1;
        audio.pause();
        audio.src = getTrackUrl(track, currentReciter);
        audio.load();
        audio.playbackRate = playbackSpeed;

        if (playerTimeCurr) playerTimeCurr.textContent = '00:00';
        if (playerTimeTotal) playerTimeTotal.textContent = '00:00';
        if (playerProgress) playerProgress.style.width = '0%';
        if (playerThumb) playerThumb.style.left = '0%';
        if (playerScrubBar) {
          playerScrubBar.setAttribute('aria-valuenow', '0');
          playerScrubBar.setAttribute('aria-valuetext', '00:00 of 00:00');
        }
        setPlayerStatus('');
        setPlayState(false);

        if (playerVerseTitle) playerVerseTitle.textContent = track.title;
        if (playerVerseBadge) playerVerseBadge.textContent = track.badge;
        if (playerReciterName) playerReciterName.textContent = currentReciter.shortName;

        updateNavButtons();
        updateMediaSession();

        if (autoPlay) {
          playAudio();
        } else {
          setPlayState(false);
        }
      }

      function playAudio() {
        initAudio();
        pauseAllPageVideos();
        if (!audio.src) audio.src = getTrackUrl(currentTrack, currentReciter);
        const requestId = ++playRequestId;
        setPlayerStatus('Loading audio...', false, true);
        audio.play().then(() => {
          if (requestId === playRequestId) {
            setPlayState(true);
            updateMediaSessionPosition();
          }
        }).catch((error) => {
          if (requestId !== playRequestId || error?.name === 'AbortError') return;
          setPlayState(false);
          setPlayerStatus(error?.name === 'NotAllowedError' ? 'Tap play again to start audio.' : 'Audio is unavailable. Check your connection and try again.', true, false);
        });
      }

      function pauseAudio() {
        playRequestId += 1;
        if (audio) audio.pause();
        setPlayState(false);
        setPlayerStatus('');
      }

      function toggleAudio() {
        if (audio && !audio.paused) pauseAudio();
        else playAudio();
      }

      function prevTrack() {
        if (audio && audio.currentTime > 3) {
          audio.currentTime = 0;
          if (audio.paused) playAudio();
        } else {
          const prevIdx = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
          loadTrack(PLAYLIST[prevIdx], true);
        }
      }

      function nextTrack() {
        const nextIdx = (currentTrackIndex + 1) % PLAYLIST.length;
        loadTrack(PLAYLIST[nextIdx], true);
      }

      function populateReciterSelector() {
        if (!playerReciterSelect || !RECITERS.length) return;
        playerReciterSelect.replaceChildren(...RECITERS.map((reciter) => new Option(reciter.shortName, reciter.id)));
        playerReciterSelect.value = currentReciter.id;
        if (playerReciterName) playerReciterName.textContent = currentReciter.shortName;
      }

      playerReciterSelect?.addEventListener('change', () => {
        const reciter = resolveReciter(playerReciterSelect.value);
        if (!reciter || reciter.id === currentReciter.id) return;
        const wasPlaying = Boolean(audio && !audio.paused);
        currentReciter = reciter;
        saveAudioPreference('reciter', currentReciter.id);
        if (playerReciterName) playerReciterName.textContent = currentReciter.shortName;
        if (flagshipPlayLabel) flagshipPlayLabel.textContent = isPlaying && currentTrack.verse === TRACK_KURSI.verse ? 'Pause' : `Play (${currentReciter.shortName})`;
        if (audio && audio.src) loadTrack(currentTrack, wasPlaying);
        else setPlayState(false);
      });

      populateReciterSelector();
      if (speedToggleBtn) speedToggleBtn.textContent = formatSpeed(playbackSpeed);
      speedToggleBtn?.setAttribute('aria-label', `Playback speed ${formatSpeed(playbackSpeed)}`);
      setPlayState(false);
      playerRepeatBtn?.setAttribute('aria-pressed', String(isRepeat));
      playerRepeatBtn?.setAttribute('aria-label', `Repeat current verse: ${isRepeat ? 'on' : 'off'}`);
      playerRepeatBtn?.classList.toggle('text-primary', isRepeat);
      playerRepeatBtn?.classList.toggle('bg-surface-container-low', isRepeat);
      updateVolumeControls();
      updateNavButtons();

      flagshipPlayBtn?.addEventListener('click', () => {
        if (currentTrack.verse !== TRACK_KURSI.verse) {
          loadTrack(TRACK_KURSI, true);
        } else {
          toggleAudio();
        }
      });

      playAyahOfDayBtn?.addEventListener('click', () => {
        if (currentTrack.verse !== TRACK_TAHA.verse) {
          loadTrack(TRACK_TAHA, true);
        } else {
          toggleAudio();
        }
      });

      playerMainPlayBtn?.addEventListener('click', toggleAudio);
      playerPrevBtn?.addEventListener('click', prevTrack);
      playerNextBtn?.addEventListener('click', nextTrack);

      function getScrubRatio(e) {
        if (!playerScrubBar) return 0;
        const rect = playerScrubBar.getBoundingClientRect();
        if (rect.width <= 0) return 0;
        return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      }

      function updateScrubVisual(pos, duration) {
        const pct = pos * 100;
        if (playerProgress) playerProgress.style.width = pct + '%';
        if (playerThumb) playerThumb.style.left = pct + '%';
        const currentTime = pos * duration;
        if (playerTimeCurr) playerTimeCurr.textContent = formatTime(currentTime);
        if (playerScrubBar) {
          playerScrubBar.setAttribute('aria-valuenow', String(Math.round(pct)));
          playerScrubBar.setAttribute('aria-valuetext', `${formatTime(currentTime)} of ${formatTime(duration)}`);
        }
      }

      playerScrubBar?.addEventListener('pointerdown', (e) => {
        if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
        isScrubbing = true;
        try { playerScrubBar.setPointerCapture(e.pointerId); } catch (_) { }
        const pos = getScrubRatio(e);
        updateScrubVisual(pos, audio.duration);
      });

      playerScrubBar?.addEventListener('pointermove', (e) => {
        if (!isScrubbing || !audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
        const pos = getScrubRatio(e);
        updateScrubVisual(pos, audio.duration);
      });

      function finishScrub(e) {
        if (!isScrubbing) return;
        isScrubbing = false;
        try { playerScrubBar?.releasePointerCapture(e.pointerId); } catch (_) { }
        if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
          const pos = getScrubRatio(e);
          audio.currentTime = pos * audio.duration;
          updateScrubVisual(pos, audio.duration);
          updateMediaSessionPosition();
        }
      }

      playerScrubBar?.addEventListener('pointerup', finishScrub);
      playerScrubBar?.addEventListener('pointercancel', finishScrub);

      playerScrubBar?.addEventListener('keydown', (e) => {
        if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
        let nextTime = audio.currentTime;
        if (e.key === 'ArrowLeft') nextTime -= 5;
        else if (e.key === 'ArrowRight') nextTime += 5;
        else if (e.key === 'Home') nextTime = 0;
        else if (e.key === 'End') nextTime = audio.duration;
        else return;
        e.preventDefault();
        audio.currentTime = Math.max(0, Math.min(audio.duration, nextTime));
        updateMediaSessionPosition();
      });

      speedToggleBtn?.addEventListener('click', () => {
        const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
        playbackSpeed = speeds[nextIdx];
        saveAudioPreference('speed', playbackSpeed);
        speedToggleBtn.textContent = formatSpeed(playbackSpeed);
        speedToggleBtn.setAttribute('aria-label', `Playback speed ${formatSpeed(playbackSpeed)}`);
        if (audio) {
          audio.playbackRate = playbackSpeed;
          updateMediaSessionPosition();
        }
      });

      playerRepeatBtn?.addEventListener('click', () => {
        isRepeat = !isRepeat;
        saveAudioPreference('repeat', isRepeat);
        playerRepeatBtn.setAttribute('aria-pressed', String(isRepeat));
        playerRepeatBtn.setAttribute('aria-label', `Repeat current verse: ${isRepeat ? 'on' : 'off'}`);
        playerRepeatBtn.classList.toggle('text-primary', isRepeat);
        playerRepeatBtn.classList.toggle('bg-surface-container-low', isRepeat);
      });

      // Volume & Mute
      audioMuteBtn?.addEventListener('click', () => {
        if (!audio) initAudio();
        if (audio.muted || audio.volume === 0) {
          audioMuted = false;
          audio.muted = false;
          playerVolume = lastVolume || 0.8;
          audio.volume = playerVolume;
          saveAudioPreference('volume', playerVolume);
        } else {
          lastVolume = audio.volume;
          saveAudioPreference('last-volume', lastVolume);
          audioMuted = true;
          audio.muted = true;
        }
        saveAudioPreference('muted', audioMuted);
        updateVolumeControls();
      });

      function getVolumeRatio(e) {
        if (!volumeTrack) return playerVolume;
        const rect = volumeTrack.getBoundingClientRect();
        if (rect.width <= 0) return playerVolume;
        return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      }

      function applyVolume(vol, persist) {
        if (!audio) initAudio();
        playerVolume = vol;
        audio.volume = vol;
        audioMuted = vol === 0;
        audio.muted = audioMuted;
        if (vol > 0) lastVolume = vol;
        updateVolumeControls();
        if (persist) {
          saveAudioPreference('volume', playerVolume);
          saveAudioPreference('muted', audioMuted);
          if (vol > 0) saveAudioPreference('last-volume', lastVolume);
        }
      }

      volumeTrack?.addEventListener('pointerdown', (e) => {
        isDraggingVolume = true;
        try { volumeTrack.setPointerCapture(e.pointerId); } catch (_) { }
        applyVolume(getVolumeRatio(e), false);
      });

      volumeTrack?.addEventListener('pointermove', (e) => {
        if (!isDraggingVolume) return;
        applyVolume(getVolumeRatio(e), false);
      });

      function finishVolumeDrag(e) {
        if (!isDraggingVolume) return;
        isDraggingVolume = false;
        try { volumeTrack?.releasePointerCapture(e.pointerId); } catch (_) { }
        applyVolume(getVolumeRatio(e), true);
      }

      volumeTrack?.addEventListener('pointerup', finishVolumeDrag);
      volumeTrack?.addEventListener('pointercancel', finishVolumeDrag);

      volumeTrack?.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') playerVolume -= 0.05;
        else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') playerVolume += 0.05;
        else if (e.key === 'Home') playerVolume = 0;
        else if (e.key === 'End') playerVolume = 1;
        else return;
        e.preventDefault();
        playerVolume = Math.max(0, Math.min(1, playerVolume));
        if (!audio) initAudio();
        audioMuted = false;
        saveAudioPreference('muted', false);
        audio.muted = false;
        audio.volume = playerVolume;
        saveAudioPreference('volume', playerVolume);
        if (playerVolume > 0) saveAudioPreference('last-volume', playerVolume);
        if (playerVolume > 0) lastVolume = playerVolume;
        updateVolumeControls();
      });

      // Minimize Floating Player Bar
      function toggleMinimize() {
        if (!audioPlayerBar) return;
        setPlayerSettingsOpen(false);
        const isMin = !audioPlayerBar.classList.contains('hidden');
        audioPlayerBar.classList.toggle('hidden', isMin);
        if (restorePlayerBtn) {
          restorePlayerBtn.classList.toggle('hidden', !isMin);
          restorePlayerBtn.classList.toggle('inline-flex', isMin);
        }
        if (minimizePlayerBtn) {
          minimizePlayerBtn.setAttribute('aria-label', isMin ? 'Minimize Player' : 'Expand Player');
          minimizePlayerBtn.setAttribute('aria-expanded', String(!isMin));
        }
        if (minimizePlayerBtnMobile) {
          minimizePlayerBtnMobile.setAttribute('aria-label', isMin ? 'Minimize Player' : 'Expand Player');
          minimizePlayerBtnMobile.setAttribute('aria-expanded', String(!isMin));
        }
        if (minimizeIcon) {
          minimizeIcon.innerHTML = isMin
            ? '<polyline points="6 9 12 15 18 9"></polyline>'
            : '<polyline points="18 15 12 9 6 15"></polyline>';
        }
        syncAudioBarOffset();
      }
      minimizePlayerBtn?.addEventListener('click', toggleMinimize);
      minimizePlayerBtnMobile?.addEventListener('click', toggleMinimize);
      restorePlayerBtn?.addEventListener('click', toggleMinimize);

      // Auto-Next Toggle
      const autoAdvBtn = document.getElementById('auto-adv-btn');
      const autoAdvLabel = document.getElementById('auto-adv-label');
      autoAdvBtn?.setAttribute('aria-pressed', String(autoAdvance));
      if (autoAdvLabel) autoAdvLabel.textContent = autoAdvance ? 'Auto-Next: On' : 'Auto-Next: Off';
      autoAdvBtn?.classList.toggle('opacity-70', !autoAdvance);
      autoAdvBtn?.addEventListener('click', () => {
        autoAdvance = !autoAdvance;
        saveAudioPreference('auto-next', autoAdvance);
        if (autoAdvLabel) autoAdvLabel.textContent = autoAdvance ? 'Auto-Next: On' : 'Auto-Next: Off';
        autoAdvBtn.setAttribute('aria-pressed', String(autoAdvance));
        autoAdvBtn.classList.toggle('opacity-70', !autoAdvance);
      });

      // 2. Copy Verse Action
      const copyVerseBtn = document.getElementById('copy-verse-btn');
      const copyVerseLabel = document.getElementById('copy-verse-label');
      copyVerseBtn?.addEventListener('click', () => {
        const textToCopy = "اللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ — [Surah Al-Baqarah 2:255]";
        const fallbackCopy = () => {
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          textarea.setAttribute('readonly', '');
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          let copied = false;
          try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
          textarea.remove();
          return copied;
        };
        const copyOperation = navigator.clipboard?.writeText
          ? navigator.clipboard.writeText(textToCopy).then(() => true).catch(fallbackCopy)
          : Promise.resolve(fallbackCopy());

        copyOperation.then((copied) => {
          if (copyVerseLabel) {
            copyVerseLabel.textContent = copied ? 'Copied!' : 'Copy failed';
            setTimeout(() => { copyVerseLabel.textContent = 'Copy'; }, 2000);
          }
        }).catch(() => {
          if (copyVerseLabel) {
            copyVerseLabel.textContent = 'Copy failed';
            setTimeout(() => { copyVerseLabel.textContent = 'Copy'; }, 2000);
          }
        });
      });

      // 3. Bookmarking Ayat al-Kursi
      const bookmarkVerseBtn = document.getElementById('bookmark-verse-btn');
      function updateBookmarkDisplay() {
        try {
          const bookmarks = JSON.parse(localStorage.getItem('heynuo-bookmarks') || '[]');
          const isSaved = bookmarks.includes('2:255');
          if (bookmarkVerseBtn) {
            bookmarkVerseBtn.classList.toggle('text-primary', isSaved);
            bookmarkVerseBtn.classList.toggle('bg-surface-container-low', isSaved);
            bookmarkVerseBtn.innerHTML = isSaved
              ? '<svg class="w-4 h-4 fill-current text-primary" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>'
              : '<svg class="w-4 h-4 stroke-current" fill="none" stroke-width="1.8" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>';
          }
          const savedCount = document.getElementById('savedCount');
          if (savedCount) savedCount.textContent = bookmarks.length;
        } catch (e) { }
      }

      bookmarkVerseBtn?.addEventListener('click', () => {
        try {
          let bookmarks = JSON.parse(localStorage.getItem('heynuo-bookmarks') || '[]');
          if (bookmarks.includes('2:255')) {
            bookmarks = bookmarks.filter(b => b !== '2:255');
          } else {
            bookmarks.push('2:255');
          }
          localStorage.setItem('heynuo-bookmarks', JSON.stringify(bookmarks));
          updateBookmarkDisplay();
        } catch (e) { }
      });
      updateBookmarkDisplay();

      // 4. Topic Filter Chips Interaction
      const topicChips = document.querySelectorAll('.topic-chip');
      const articleCards = document.querySelectorAll('.article-card');
      const filterEmptyState = document.getElementById('filterEmptyState');
      const filterResetBtn = document.getElementById('filterResetBtn');
      const articleResultCount = document.getElementById('articleResultCount');

      function applyTopicFilter(tag) {
        let visible = 0;
        articleCards.forEach(card => {
          const cat = card.getAttribute('data-category') || '';
          const matches = tag === 'all' || cat.split(/\s+/).includes(tag);
          card.style.display = matches ? 'flex' : 'none';
          if (matches) visible += 1;
        });

        if (filterEmptyState) filterEmptyState.classList.toggle('hidden', visible > 0);
        if (articleResultCount) articleResultCount.textContent = visible + (visible === 1 ? ' resource' : ' resources');

        topicChips.forEach(c => {
          const isActive = c.getAttribute('data-tag') === tag;
          c.classList.toggle('active', isActive);
          c.classList.toggle('bg-primary', isActive);
          c.classList.toggle('text-on-primary', isActive);
          c.classList.toggle('bg-bg-canvas', !isActive);
          c.classList.toggle('text-on-surface', !isActive);
          c.setAttribute('aria-pressed', String(isActive));
        });
      }

      topicChips.forEach(chip => {
        chip.addEventListener('click', () => applyTopicFilter(chip.getAttribute('data-tag')));
      });

      filterResetBtn?.addEventListener('click', () => applyTopicFilter('all'));

      // 5. Tafsir Triggers
      const tafsirDialog = document.getElementById('tafsir-dialog');
      const tafsirDialogTitle = document.getElementById('tafsir-dialog-title');
      const tafsirDialogContent = document.getElementById('tafsir-dialog-content');
      const tafsirDialogClose = document.getElementById('tafsir-dialog-close');
      function openTafsirDialog(title, content) {
        if (!tafsirDialog || typeof tafsirDialog.showModal !== 'function') {
          alert(content);
          return;
        }
        if (tafsirDialogTitle) tafsirDialogTitle.textContent = title;
        if (tafsirDialogContent) tafsirDialogContent.textContent = content;
        tafsirDialog.showModal();
      }

      tafsirDialogClose?.addEventListener('click', () => tafsirDialog?.close());
      tafsirDialog?.addEventListener('click', (event) => {
        if (event.target === tafsirDialog) tafsirDialog.close();
      });

      const tafsirKursiBtn = document.getElementById('tafsir-kursi-btn');
      tafsirKursiBtn?.addEventListener('click', () => {
        openTafsirDialog(currentTrack.tafsirTitle || 'Ayat al-Kursi · Al-Baqarah 2:255', currentTrack.tafsirContent || 'This verse affirms Allah’s life, self-subsistence, knowledge, authority, and protection.');
      });

      const tafsirAyahOfDayBtn = document.getElementById('tafsirAyahOfDayBtn');
      tafsirAyahOfDayBtn?.addEventListener('click', () => {
        openTafsirDialog('Ta-Ha 20:114 · Tafsir note', 'The verse teaches patience in receiving revelation and asks the Prophet to pray: “My Lord, increase me in knowledge.”');
      });

      // 7. Page-level transport keys (Space, V, Left, Right)
      document.addEventListener('keydown', (e) => {
        const target = e.target;
        if (target instanceof Element && target.closest('input, textarea, select, button, a, [role="slider"], [contenteditable="true"]')) return;
        if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;

        let singleKeyShortcuts = true;
        try {
          const saved = localStorage.getItem('heynuo-single-shortcuts');
          if (saved !== null) singleKeyShortcuts = saved === 'true';
        } catch (err) { }
        if (!singleKeyShortcuts) return;

        if (e.key === ' ') {
          e.preventDefault();
          toggleAudio();
        } else if (e.key === 'v' || e.key === 'V') {
          toggleMinimize();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          playerPrevBtn?.click();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          playerNextBtn?.click();
        }
      });

      // 8. Auto-adjust Gratitude Sanctuary iframe height dynamically
      window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'ruqyah-iframe-resize' && event.data.frame === 'thank-you') {
          const gratitudeIframe = document.querySelector('iframe[src*="thank-you"]');
          if (gratitudeIframe && typeof event.data.height === 'number') {
            const nextH = Math.max(260, event.data.height);
            gratitudeIframe.style.height = nextH + 'px';
          }
        }
      });

    })();

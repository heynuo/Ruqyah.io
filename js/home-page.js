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

      const TRACK_KURSI = {
        verse: '2:255',
        title: 'Al-Baqarah 2:255',
        badge: 'Ayat al-Kursi'
      };
      const TRACK_TAHA = {
        verse: '20:114',
        title: 'Ta-Ha 20:114',
        badge: 'Reflection verse'
      };

      let audio = null;
      let currentTrack = TRACK_KURSI;
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
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
              const pct = Math.max(0, Math.min(100, (audio.currentTime / audio.duration) * 100));
              if (playerProgress) playerProgress.style.width = pct + '%';
              if (playerThumb) playerThumb.style.left = pct + '%';
              if (playerTimeCurr) playerTimeCurr.textContent = formatTime(audio.currentTime);
              if (playerScrubBar) {
                playerScrubBar.setAttribute('aria-valuenow', String(Math.round(pct)));
                playerScrubBar.setAttribute('aria-valuetext', `${formatTime(audio.currentTime)} of ${formatTime(audio.duration)}`);
              }
            }
          });

          audio.addEventListener('loadedmetadata', () => {
            if (playerTimeTotal && Number.isFinite(audio.duration) && audio.duration > 0) {
              playerTimeTotal.textContent = formatTime(audio.duration);
            }
            if (playerScrubBar) playerScrubBar.setAttribute('aria-valuetext', `00:00 of ${formatTime(audio.duration)}`);
          });

          audio.addEventListener('ended', () => {
            if (isRepeat) {
              audio.currentTime = 0;
              playAudio();
            } else if (autoAdvance && currentTrack === TRACK_KURSI) {
              loadTrack(TRACK_TAHA, true);
            } else {
              setPlayState(false);
            }
          });

          audio.addEventListener('play', () => { if (!audio.paused) setPlayState(true); });
          audio.addEventListener('pause', () => { if (audio.paused) setPlayState(false); });
          audio.addEventListener('waiting', () => setPlayerStatus('Buffering audio...', false, true));
          audio.addEventListener('playing', () => setPlayerStatus(''));
          audio.addEventListener('volumechange', updateVolumeControls);
          audio.addEventListener('error', () => {
            playRequestId += 1;
            setPlayState(false);
            setPlayerStatus('Audio is unavailable. Check your connection and try again.', true, false);
          });
        }
      }

      function setPlayState(playing) {
        isPlaying = playing;
        const playSvg = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        const pauseSvg = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';

        if (playerPlayIcon) playerPlayIcon.innerHTML = isPlaying ? pauseSvg : playSvg;
        if (flagshipPlayIcon) flagshipPlayIcon.innerHTML = isPlaying && currentTrack === TRACK_KURSI ? pauseSvg : playSvg;
        if (flagshipPlayLabel) flagshipPlayLabel.textContent = isPlaying && currentTrack === TRACK_KURSI ? 'Pause' : `Play (${currentReciter.shortName})`;
        flagshipPlayBtn?.setAttribute('aria-label', `${isPlaying && currentTrack === TRACK_KURSI ? 'Pause' : 'Play'} recitation by ${currentReciter.name}`);
        if (playerMainPlayBtn) {
          playerMainPlayBtn.setAttribute('aria-label', isPlaying ? 'Pause recitation' : 'Play recitation');
          playerMainPlayBtn.setAttribute('aria-pressed', String(isPlaying));
        }
        flagshipPlayBtn?.setAttribute('aria-pressed', String(isPlaying && currentTrack === TRACK_KURSI));
        playAyahOfDayBtn?.setAttribute('aria-pressed', String(isPlaying && currentTrack === TRACK_TAHA));
      }

      function loadTrack(track, autoPlay) {
        currentTrack = track;
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

        if (autoPlay) {
          playAudio();
        } else {
          setPlayState(false);
        }
      }

      function playAudio() {
        initAudio();
        if (!audio.src) audio.src = getTrackUrl(currentTrack, currentReciter);
        const requestId = ++playRequestId;
        setPlayerStatus('Loading audio...', false, true);
        audio.play().then(() => {
          if (requestId === playRequestId) setPlayState(true);
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
        if (audio && audio.src) loadTrack(currentTrack, wasPlaying);
        else setPlayState(false);
      });

      populateReciterSelector();
      if (speedToggleBtn) speedToggleBtn.textContent = `${playbackSpeed.toFixed(playbackSpeed % 1 === 0 ? 1 : 2)}x`;
      speedToggleBtn?.setAttribute('aria-label', `Playback speed ${playbackSpeed.toFixed(playbackSpeed % 1 === 0 ? 1 : 2)}x`);
      setPlayState(false);
      playerRepeatBtn?.setAttribute('aria-pressed', String(isRepeat));
      playerRepeatBtn?.setAttribute('aria-label', `Repeat current verse: ${isRepeat ? 'on' : 'off'}`);
      playerRepeatBtn?.classList.toggle('text-primary', isRepeat);
      playerRepeatBtn?.classList.toggle('bg-surface-container-low', isRepeat);
      updateVolumeControls();

      flagshipPlayBtn?.addEventListener('click', () => {
        if (currentTrack !== TRACK_KURSI) {
          loadTrack(TRACK_KURSI, true);
        } else {
          toggleAudio();
        }
      });

      playAyahOfDayBtn?.addEventListener('click', () => {
        if (currentTrack !== TRACK_TAHA) {
          loadTrack(TRACK_TAHA, true);
        } else {
          toggleAudio();
        }
      });

      playerMainPlayBtn?.addEventListener('click', toggleAudio);

      playerPrevBtn?.addEventListener('click', () => {
        if (currentTrack === TRACK_TAHA) {
          loadTrack(TRACK_KURSI, true);
        } else if (audio) {
          audio.currentTime = 0;
        }
      });

      playerNextBtn?.addEventListener('click', () => {
        if (currentTrack === TRACK_KURSI) {
          loadTrack(TRACK_TAHA, true);
        } else if (audio) {
          audio.currentTime = 0;
        }
      });

      const seekPlayer = (e) => {
        if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
        const rect = playerScrubBar.getBoundingClientRect();
        if (rect.width <= 0) return;
        const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = pos * audio.duration;
      };
      playerScrubBar?.addEventListener('pointerdown', (e) => {
        seekPlayer(e);
        playerScrubBar.setPointerCapture?.(e.pointerId);
      });
      playerScrubBar?.addEventListener('pointermove', (e) => {
        if (e.buttons === 1) seekPlayer(e);
      });
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
      });

      speedToggleBtn?.addEventListener('click', () => {
        const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
        playbackSpeed = speeds[nextIdx];
        saveAudioPreference('speed', playbackSpeed);
        speedToggleBtn.textContent = playbackSpeed.toFixed(playbackSpeed % 1 === 0 ? 1 : 2) + 'x';
        speedToggleBtn.setAttribute('aria-label', `Playback speed ${playbackSpeed.toFixed(playbackSpeed % 1 === 0 ? 1 : 2)}x`);
        if (audio) audio.playbackRate = playbackSpeed;
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
          playerVolume = lastVolume;
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

      const setVolumeFromPointer = (e) => {
        if (!audio) initAudio();
        const rect = volumeTrack.getBoundingClientRect();
        if (rect.width <= 0) return;
        const vol = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.volume = playerVolume = vol;
        saveAudioPreference('volume', playerVolume);
        if (vol > 0) saveAudioPreference('last-volume', vol);
        if (vol > 0) lastVolume = vol;
        audioMuted = false;
        saveAudioPreference('muted', false);
        audio.muted = false;
        updateVolumeControls();
      };
      volumeTrack?.addEventListener('pointerdown', (e) => {
        setVolumeFromPointer(e);
        volumeTrack.setPointerCapture?.(e.pointerId);
      });
      volumeTrack?.addEventListener('pointermove', (e) => {
        if (e.buttons === 1) setVolumeFromPointer(e);
      });

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
        openTafsirDialog('Ayat al-Kursi · Al-Baqarah 2:255', 'This verse affirms Allah’s life, self-subsistence, knowledge, authority, and protection.');
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

    })();

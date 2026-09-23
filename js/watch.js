/**
 * AniWaveX - Video Streaming Player Controller (Jikan API Integrated)
 * Custom HTML5 video controls, keyboard hotkeys, playback progress persistence, and episode queue.
 */

let currentAnime = null;
let currentEpNumber = 1;
let currentEpisode = null;
let controlsTimeout = null;

document.addEventListener('DOMContentLoaded', () => {
  initWatchPage();
});

async function initWatchPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get('id') || '52991'; // Default: Frieren (52991)
  currentEpNumber = parseInt(urlParams.get('ep')) || 1;

  // 1. Fetch Anime from Jikan API or local database
  if (window.JikanAPI && typeof window.JikanAPI.getAnimeById === 'function') {
    try {
      currentAnime = await window.JikanAPI.getAnimeById(animeId);
    } catch (e) {
      console.warn('[Watch] Jikan anime fetch failed:', e);
    }
  }

  if (!currentAnime && window.ANIME_DATABASE) {
    currentAnime = window.ANIME_DATABASE.find(a => String(a.id) === String(animeId)) || window.ANIME_DATABASE[0];
  }

  if (!currentAnime) return;

  const safeId = String(currentAnime.id || currentAnime.mal_id);

  // 2. Fetch Episodes from Jikan API
  let fetchedEpisodes = [];
  if (window.JikanAPI && typeof window.JikanAPI.getAnimeEpisodes === 'function') {
    try {
      fetchedEpisodes = await window.JikanAPI.getAnimeEpisodes(safeId, 1, currentAnime.poster);
    } catch (e) {
      console.warn('[Watch] Episode list fetch failed:', e);
    }
  }

  if ((!fetchedEpisodes || fetchedEpisodes.length === 0) && currentAnime.episodes && currentAnime.episodes.length > 0) {
    fetchedEpisodes = currentAnime.episodes;
  }

  if (!fetchedEpisodes || fetchedEpisodes.length === 0) {
    fetchedEpisodes = [1, 2, 3, 4].map(num => ({
      id: `ep${num}`,
      number: num,
      title: `Episode ${num}`,
      duration: '24m',
      summary: `Episode ${num} of ${currentAnime.title}. Stream full episode in Ultra HD on AniWaveX.`,
      thumbnail: currentAnime.poster
    }));
  }

  currentAnime.episodes = fetchedEpisodes;

  // Find episode
  currentEpisode = currentAnime.episodes.find(e => e.number === currentEpNumber) || currentAnime.episodes[0];
  currentEpNumber = currentEpisode.number;

  // Set document title
  document.title = `Watching ${currentAnime.title} Ep ${currentEpisode.number} - AniWaveX`;

  // Populate Meta Info
  populateWatchMetadata();

  // Setup Custom Video Player
  setupVideoPlayer();

  // Setup Up Next & Episode Drawer
  populateSidebar();
}

function populateWatchMetadata() {
  const animeTitleEl = document.getElementById('watchAnimeTitle');
  const epTitleEl = document.getElementById('watchEpTitle');
  const summaryEl = document.getElementById('watchSummary');
  const prevEpBtn = document.getElementById('prevEpBtn');
  const nextEpBtn = document.getElementById('nextEpBtn');
  const watchlistBtn = document.getElementById('watchWatchlistBtn');
  const likeBtn = document.getElementById('watchLikeBtn');
  const likeCountEl = document.getElementById('watchLikeCount');

  const safeId = String(currentAnime.id || currentAnime.mal_id);

  if (animeTitleEl) animeTitleEl.textContent = currentAnime.title;
  if (epTitleEl) epTitleEl.textContent = `Episode ${currentEpisode.number}: ${currentEpisode.title}`;
  if (summaryEl) summaryEl.textContent = currentEpisode.summary;

  // Episode Nav Buttons
  if (prevEpBtn) {
    if (currentEpNumber > 1) {
      prevEpBtn.disabled = false;
      prevEpBtn.onclick = () => jumpToEpisode(currentEpNumber - 1);
    } else {
      prevEpBtn.disabled = true;
      prevEpBtn.style.opacity = '0.4';
    }
  }

  if (nextEpBtn) {
    const hasNext = currentAnime.episodes.some(e => e.number === currentEpNumber + 1);
    if (hasNext) {
      nextEpBtn.disabled = false;
      nextEpBtn.onclick = () => jumpToEpisode(currentEpNumber + 1);
    } else {
      nextEpBtn.disabled = true;
      nextEpBtn.style.opacity = '0.4';
    }
  }

  // Watchlist button
  if (watchlistBtn) {
    updateWatchlistBtn(watchlistBtn);
    watchlistBtn.onclick = () => {
      Storage.toggleWatchlist(safeId);
      updateWatchlistBtn(watchlistBtn);
    };
  }

  // Like button
  if (likeBtn) {
    updateLikeBtn(likeBtn, likeCountEl);
    likeBtn.onclick = () => {
      Storage.toggleLike(safeId);
      updateLikeBtn(likeBtn, likeCountEl);
    };
  }
}

function updateWatchlistBtn(btn) {
  const safeId = String(currentAnime.id || currentAnime.mal_id);
  const inList = Storage.isInWatchlist(safeId);
  const text = btn.querySelector('span');
  if (inList) {
    btn.classList.add('active');
    if (text) text.textContent = 'In Watchlist';
  } else {
    btn.classList.remove('active');
    if (text) text.textContent = 'Add to Watchlist';
  }
}

function updateLikeBtn(btn, countEl) {
  const safeId = String(currentAnime.id || currentAnime.mal_id);
  const isLiked = Storage.isLiked(safeId);
  const baseCount = Math.floor((currentAnime.ratingCount || 10000) * 0.4);
  if (isLiked) {
    btn.classList.add('active');
    if (countEl) countEl.textContent = (baseCount + 1).toLocaleString();
  } else {
    btn.classList.remove('active');
    if (countEl) countEl.textContent = baseCount.toLocaleString();
  }
}

// ==========================================================================
// VIDEO PLAYER CONTROLS IMPLEMENTATION
// ==========================================================================
function setupVideoPlayer() {
  const playerContainer = document.getElementById('playerContainer');
  const video = document.getElementById('mainVideo');
  const centerPlayBtn = document.getElementById('centerPlayBtn');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const volumeBtn = document.getElementById('volumeBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const progressBar = document.getElementById('progressBar');
  const progressFilled = document.getElementById('progressFilled');
  const progressBuffered = document.getElementById('progressBuffered');
  const timeDisplay = document.getElementById('timeDisplay');
  const speedBtn = document.getElementById('speedBtn');
  const speedDropdown = document.getElementById('speedDropdown');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const theaterBtn = document.getElementById('theaterBtn');

  if (!video || !playerContainer) return;

  // Use public domain educational streaming test video
  video.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  video.poster = currentEpisode.thumbnail || currentAnime.banner || currentAnime.poster;

  function togglePlay() {
    if (video.paused || video.ended) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  if (centerPlayBtn) centerPlayBtn.addEventListener('click', togglePlay);
  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  video.addEventListener('play', () => {
    playerContainer.classList.add('playing');
    updatePlayPauseIcons(true);
    resetControlsTimeout();
  });

  video.addEventListener('pause', () => {
    playerContainer.classList.remove('playing');
    playerContainer.classList.remove('controls-hidden');
    updatePlayPauseIcons(false);
  });

  function updatePlayPauseIcons(isPlaying) {
    if (!playPauseBtn) return;
    playPauseBtn.innerHTML = isPlaying
      ? `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
      : `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
  }

  // Time & Progress Updates
  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const percent = (video.currentTime / video.duration) * 100;
    if (progressFilled) progressFilled.style.width = `${percent}%`;
    if (timeDisplay) {
      timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }
    // Save history progress to localStorage
    if (Math.floor(video.currentTime) % 3 === 0) {
      const safeId = String(currentAnime.id || currentAnime.mal_id);
      Storage.saveHistory(safeId, currentEpisode.number, video.currentTime, video.duration);
    }
  });

  // Buffer bar
  video.addEventListener('progress', () => {
    if (video.buffered.length > 0 && video.duration) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const percent = (bufferedEnd / video.duration) * 100;
      if (progressBuffered) progressBuffered.style.width = `${percent}%`;
    }
  });

  // Seekbar
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickPos = (e.clientX - rect.left) / rect.width;
      if (video.duration) {
        video.currentTime = clickPos * video.duration;
      }
    });
  }

  // Volume
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      video.volume = parseFloat(e.target.value);
      video.muted = video.volume === 0;
      updateVolumeIcon();
    });
  }

  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (volumeSlider) {
        volumeSlider.value = video.muted ? 0 : (video.volume || 1);
      }
      updateVolumeIcon();
    });
  }

  function updateVolumeIcon() {
    if (!volumeBtn) return;
    if (video.muted || video.volume === 0) {
      volumeBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;
    } else if (video.volume < 0.5) {
      volumeBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>`;
    } else {
      volumeBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
    }
  }

  // Playback Speed Menu
  if (speedBtn && speedDropdown) {
    speedBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      speedDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => speedDropdown.classList.remove('active'));

    speedDropdown.querySelectorAll('.speed-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const speed = parseFloat(opt.getAttribute('data-speed'));
        video.playbackRate = speed;
        speedBtn.textContent = `${speed}x`;
        speedDropdown.querySelectorAll('.speed-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        speedDropdown.classList.remove('active');
      });
    });
  }

  // Fullscreen
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        playerContainer.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // Theater Mode
  if (theaterBtn) {
    theaterBtn.addEventListener('click', () => {
      playerContainer.classList.toggle('theater-mode');
    });
  }

  // Auto-hide controls
  playerContainer.addEventListener('mousemove', resetControlsTimeout);
  playerContainer.addEventListener('mouseleave', () => {
    if (!video.paused) playerContainer.classList.add('controls-hidden');
  });

  function resetControlsTimeout() {
    playerContainer.classList.remove('controls-hidden');
    clearTimeout(controlsTimeout);
    if (!video.paused) {
      controlsTimeout = setTimeout(() => {
        playerContainer.classList.add('controls-hidden');
      }, 3000);
    }
  }

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    switch (e.code) {
      case 'Space':
      case 'KeyK':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
        showToast('+5s forward', 'info');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 5);
        showToast('-5s backward', 'info');
        break;
      case 'ArrowUp':
        e.preventDefault();
        video.volume = Math.min(1, video.volume + 0.1);
        if (volumeSlider) volumeSlider.value = video.volume;
        updateVolumeIcon();
        break;
      case 'ArrowDown':
        e.preventDefault();
        video.volume = Math.max(0, video.volume - 0.1);
        if (volumeSlider) volumeSlider.value = video.volume;
        updateVolumeIcon();
        break;
      case 'KeyM':
        e.preventDefault();
        video.muted = !video.muted;
        updateVolumeIcon();
        break;
      case 'KeyF':
        e.preventDefault();
        fullscreenBtn && fullscreenBtn.click();
        break;
    }
  });
}

function formatTime(seconds) {
  if (isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

// ==========================================================================
// SIDEBAR POPULATION
// ==========================================================================
function populateSidebar() {
  const upNextCard = document.getElementById('upNextContainer');
  const epDrawer = document.getElementById('sidebarEpList');

  // Next Episode Card
  const nextEp = currentAnime.episodes.find(e => e.number === currentEpNumber + 1);
  if (upNextCard) {
    if (nextEp) {
      upNextCard.innerHTML = `
        <div class="up-next-card" onclick="jumpToEpisode(${nextEp.number})">
          <div class="up-next-thumb-wrap">
            <img class="up-next-thumb" src="${nextEp.thumbnail || currentAnime.poster}" alt="${nextEp.title}">
            <span class="up-next-badge">Up Next • EP ${nextEp.number}</span>
          </div>
          <div class="up-next-info">
            <div class="up-next-ep-num">Episode ${nextEp.number} (${nextEp.duration || '24m'})</div>
            <div class="up-next-title">${nextEp.title}</div>
          </div>
        </div>
      `;
    } else {
      upNextCard.innerHTML = `<div style="color: var(--text-muted); font-size: 0.88rem; padding: 10px;">You are currently watching the latest available episode.</div>`;
    }
  }

  // Complete Episode Drawer
  if (epDrawer) {
    epDrawer.innerHTML = currentAnime.episodes.map(ep => `
      <div class="sidebar-ep-item ${ep.number === currentEpNumber ? 'active' : ''}" onclick="jumpToEpisode(${ep.number})">
        <img class="sidebar-ep-thumb" src="${ep.thumbnail || currentAnime.poster}" alt="${ep.title}">
        <div class="sidebar-ep-details">
          <div class="sidebar-ep-num">Episode ${ep.number} • ${ep.duration || '24m'}</div>
          <div class="sidebar-ep-title">${ep.title}</div>
        </div>
      </div>
    `).join('');
  }
}

function jumpToEpisode(epNumber) {
  const safeId = String(currentAnime.id || currentAnime.mal_id);
  window.location.href = `watch.html?id=${encodeURIComponent(safeId)}&ep=${epNumber}`;
}

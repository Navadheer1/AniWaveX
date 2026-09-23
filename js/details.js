/**
 * AniWaveX - Details Page Script (Jikan API Integrated)
 * Dynamically loads and renders anime details, character cast, episode list, and related titles from Jikan v4.
 */

document.addEventListener('DOMContentLoaded', () => {
  loadAnimeDetails();
});

async function loadAnimeDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get('id') || '52991'; // Default: Frieren (MAL ID 52991)

  // Show loading indicator
  const titleEl = document.getElementById('detailsTitle');
  if (titleEl) titleEl.textContent = 'Loading Anime Details from Jikan API...';

  let anime = null;

  // 1. Fetch Anime Info from Jikan API
  if (window.JikanAPI && typeof window.JikanAPI.getAnimeById === 'function') {
    try {
      anime = await window.JikanAPI.getAnimeById(animeId);
    } catch (e) {
      console.warn('[Details] Jikan getAnimeById failed:', e);
    }
  }

  // 2. Fallback to local database if API returned null or was offline
  if (!anime && window.ANIME_DATABASE) {
    anime = window.ANIME_DATABASE.find(a => String(a.id) === String(animeId)) || window.ANIME_DATABASE[0];
  }

  if (!anime) {
    if (titleEl) titleEl.textContent = 'Anime Not Found';
    return;
  }

  const safeId = String(anime.id || anime.mal_id);

  // Set document title
  document.title = `${anime.title} - Stream HD on AniWaveX`;

  // Populate Hero Backdrop & Poster
  const backdropImg = document.getElementById('detailsBackdrop');
  const posterImg = document.getElementById('detailsPoster');
  if (backdropImg) backdropImg.src = anime.banner || anime.poster;
  if (posterImg) posterImg.src = anime.poster;

  // Titles & Metadata
  const jpTitleEl = document.getElementById('detailsJpTitle');
  const ratingEl = document.getElementById('detailsRating');
  const ratingCountEl = document.getElementById('detailsRatingCount');
  const yearEl = document.getElementById('detailsYear');
  const epCountEl = document.getElementById('detailsEpCount');
  const typeEl = document.getElementById('detailsType');
  const audioEl = document.getElementById('detailsAudio');
  const genresContainer = document.getElementById('detailsGenres');
  const synopsisEl = document.getElementById('detailsSynopsis');

  if (titleEl) titleEl.textContent = anime.title;
  if (jpTitleEl) jpTitleEl.textContent = anime.japaneseTitle || '';
  if (ratingEl) ratingEl.textContent = typeof anime.rating === 'number' ? anime.rating.toFixed(2) : '4.85';
  if (ratingCountEl) {
    const votes = anime.ratingCount || 10000;
    ratingCountEl.textContent = `(${(votes / 1000).toFixed(0)}k reviews)`;
  }
  if (yearEl) yearEl.textContent = anime.year || '2024';
  if (epCountEl) epCountEl.textContent = `${anime.episodesCount || 12} Episodes`;
  if (typeEl) typeEl.textContent = anime.type || 'TV Series';
  if (audioEl) audioEl.textContent = anime.language || 'Sub | Dub';
  if (synopsisEl) synopsisEl.textContent = anime.synopsis || 'No synopsis available.';

  if (genresContainer && Array.isArray(anime.genres)) {
    genresContainer.innerHTML = anime.genres.map(g => `
      <a href="browse.html?genre=${encodeURIComponent(g)}" class="details-genre-tag">${g}</a>
    `).join('');
  }

  // Action Buttons
  const watchBtn = document.getElementById('watchNowBtn');
  const watchlistBtn = document.getElementById('watchlistToggleBtn');
  const likeBtn = document.getElementById('likeToggleBtn');

  if (watchBtn) {
    watchBtn.href = `watch.html?id=${encodeURIComponent(safeId)}&ep=1`;
  }

  if (watchlistBtn) {
    updateWatchlistBtnState(watchlistBtn, safeId);
    watchlistBtn.onclick = () => {
      Storage.toggleWatchlist(safeId);
      updateWatchlistBtnState(watchlistBtn, safeId);
    };
  }

  if (likeBtn) {
    updateLikeBtnState(likeBtn, safeId);
    likeBtn.onclick = () => {
      Storage.toggleLike(safeId);
      updateLikeBtnState(likeBtn, safeId);
    };
  }

  // Populate Specs Grid
  const specStudio = document.getElementById('specStudio');
  const specStatus = document.getElementById('specStatus');
  const specType = document.getElementById('specType');
  const specYear = document.getElementById('specYear');
  const specAudio = document.getElementById('specAudio');

  if (specStudio) specStudio.textContent = anime.studio || 'Animation Studio';
  if (specStatus) specStatus.textContent = anime.status || 'Completed';
  if (specType) specType.textContent = anime.type || 'TV Series';
  if (specYear) specYear.textContent = anime.year || '2024';
  if (specAudio) specAudio.textContent = anime.language || 'Sub | Dub';

  // 3. Fetch & Render Episodes from Jikan API
  loadAndRenderEpisodes(anime);

  // 4. Fetch & Render Characters from Jikan API
  loadAndRenderCharacters(anime);

  // 5. Render Related / Recommended Anime
  loadAndRenderRelated(anime);
}

function updateWatchlistBtnState(btn, animeId) {
  const inList = Storage.isInWatchlist(animeId);
  const textEl = btn.querySelector('.btn-text');
  if (inList) {
    btn.classList.add('active');
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-primary');
    if (textEl) textEl.textContent = 'In Watchlist';
  } else {
    btn.classList.remove('active');
    btn.classList.add('btn-secondary');
    btn.classList.remove('btn-primary');
    if (textEl) textEl.textContent = 'Add to Watchlist';
  }
}

function updateLikeBtnState(btn, animeId) {
  const isLiked = Storage.isLiked(animeId);
  if (isLiked) {
    btn.classList.add('liked');
    btn.setAttribute('title', 'Unlike');
  } else {
    btn.classList.remove('liked');
    btn.setAttribute('title', 'Like Series');
  }
}

async function loadAndRenderEpisodes(anime) {
  const container = document.getElementById('episodesList');
  if (!container) return;

  container.innerHTML = `
    <div style="padding: 20px; color: var(--text-muted); text-align: center;">
      <svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
      </svg>
      Loading episodes from Jikan API...
    </div>
  `;

  let episodes = [];
  const safeId = String(anime.id || anime.mal_id);

  if (window.JikanAPI && typeof window.JikanAPI.getAnimeEpisodes === 'function') {
    try {
      episodes = await window.JikanAPI.getAnimeEpisodes(safeId, 1, anime.poster);
    } catch (e) {
      console.warn('[Details] Episode fetch failed:', e);
    }
  }

  // Fallback to local anime episodes if available
  if ((!episodes || episodes.length === 0) && anime.episodes && anime.episodes.length > 0) {
    episodes = anime.episodes;
  }

  if (!episodes || episodes.length === 0) {
    // Generate sample list
    episodes = [1, 2, 3, 4].map(num => ({
      id: `ep${num}`,
      number: num,
      title: `Episode ${num}`,
      duration: '24m',
      airDate: 'Broadcast Release',
      summary: `Episode ${num} of ${anime.title}. Stream full episode in Ultra HD on AniWaveX.`,
      thumbnail: anime.poster
    }));
  }

  container.innerHTML = episodes.map(ep => `
    <div class="episode-card" onclick="window.location.href='watch.html?id=${encodeURIComponent(safeId)}&ep=${ep.number}'">
      <div class="episode-thumb-wrap">
        <img class="episode-thumb-img" src="${ep.thumbnail || anime.poster}" alt="${ep.title}">
        <div class="episode-play-overlay">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      <div class="episode-info">
        <div class="episode-header-row">
          <div class="episode-num-title">Episode ${ep.number} — ${ep.title}</div>
          <div class="episode-duration">${ep.duration || '24m'} • ${ep.airDate || 'Aired'}</div>
        </div>
        <p class="episode-summary">${ep.summary || ''}</p>
      </div>
    </div>
  `).join('');
}

async function loadAndRenderCharacters(anime) {
  const container = document.getElementById('charactersGrid');
  if (!container) return;

  const safeId = String(anime.id || anime.mal_id);
  let characters = [];

  if (window.JikanAPI && typeof window.JikanAPI.getAnimeCharacters === 'function') {
    try {
      characters = await window.JikanAPI.getAnimeCharacters(safeId);
    } catch (e) {
      console.warn('[Details] Characters fetch failed:', e);
    }
  }

  if ((!characters || characters.length === 0) && anime.characters && anime.characters.length > 0) {
    characters = anime.characters;
  }

  if (!characters || characters.length === 0) {
    container.innerHTML = `<div style="color: var(--text-muted); font-size: 0.9rem;">Voice cast information is currently unavailable.</div>`;
    return;
  }

  container.innerHTML = characters.map(char => `
    <div class="character-card">
      <img class="character-avatar" src="${char.avatar}" alt="${char.name}">
      <div class="character-details">
        <div class="character-name">${char.name}</div>
        <div class="character-role">${char.role || 'Character'}</div>
        <div class="character-va">VA: ${char.voice || 'Japanese Cast'}</div>
      </div>
    </div>
  `).join('');
}

async function loadAndRenderRelated(currentAnime) {
  const container = document.getElementById('relatedShelf');
  if (!container) return;

  container.innerHTML = createSkeletonCardsHTML(6);

  let related = [];
  if (window.JikanAPI && typeof window.JikanAPI.getPopularAnime === 'function') {
    try {
      const topList = await window.JikanAPI.getPopularAnime(1);
      const safeId = String(currentAnime.id || currentAnime.mal_id);
      related = topList.filter(a => String(a.id) !== safeId).slice(0, 8);
    } catch (e) {
      console.warn('[Details] Related fetch failed:', e);
    }
  }

  if (related.length === 0 && window.ANIME_DATABASE) {
    const currentGenres = new Set(currentAnime.genres || []);
    related = window.ANIME_DATABASE
      .filter(a => a.id !== currentAnime.id && Array.isArray(a.genres) && a.genres.some(g => currentGenres.has(g)))
      .slice(0, 8);
  }

  if (related.length > 0) {
    container.innerHTML = related.map(createAnimeCardHTML).join('');
  } else {
    container.innerHTML = `<div class="api-error-card">Anime recommendations temporarily unavailable.</div>`;
  }
}

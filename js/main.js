/**
 * AniWaveX - Main Global Script
 * Manages global application state, localStorage, navigation, search, toasts, and UI utilities.
 */

// ==========================================================================
// STORAGE KEYS
// ==========================================================================
const STORAGE_KEYS = {
  WATCHLIST: 'aniwavex_watchlist',
  HISTORY: 'aniwavex_history',
  LIKES: 'aniwavex_likes',
  USER: 'aniwavex_user',
  ALL_USERS: 'aniwavex_registered_users'
};

// ==========================================================================
// LOCAL STORAGE WRAPPERS
// ==========================================================================
const Storage = {
  getWatchlist() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.WATCHLIST)) || [];
    } catch (e) {
      return [];
    }
  },

  setWatchlist(list) {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(list));
    updateWatchlistBadge();
  },

  isInWatchlist(animeId) {
    return this.getWatchlist().includes(animeId);
  },

  toggleWatchlist(animeId) {
    let list = this.getWatchlist();
    const exists = list.includes(animeId);
    if (exists) {
      list = list.filter(id => id !== animeId);
      this.setWatchlist(list);
      showToast('Removed from Watchlist', 'info');
      return false;
    } else {
      list.push(animeId);
      this.setWatchlist(list);
      showToast('Added to your Watchlist!', 'success');
      return true;
    }
  },

  getLikes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKES)) || [];
    } catch (e) {
      return [];
    }
  },

  toggleLike(animeId) {
    let likes = this.getLikes();
    const exists = likes.includes(animeId);
    if (exists) {
      likes = likes.filter(id => id !== animeId);
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes));
      showToast('Removed like', 'info');
      return false;
    } else {
      likes.push(animeId);
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes));
      showToast('Liked anime!', 'success');
      return true;
    }
  },

  isLiked(animeId) {
    return this.getLikes().includes(animeId);
  },

  getHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY)) || [];
    } catch (e) {
      return [];
    }
  },

  saveHistory(animeId, episodeNum, progress, duration) {
    let history = this.getHistory();
    // remove existing if present
    history = history.filter(item => item.animeId !== animeId);
    history.unshift({
      animeId,
      episodeNum: episodeNum || 1,
      progress: progress || 0,
      duration: duration || 1440,
      timestamp: Date.now()
    });
    // keep max 20 entries
    if (history.length > 20) history.pop();
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null;
    } catch (e) {
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    updateNavAuthState();
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
    updateNavAuthState();
    showToast('You have been logged out', 'info');
  }
};

// ==========================================================================
// TOAST SYSTEM
// ==========================================================================
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSvg = type === 'success' 
    ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="#2ecc71"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`
    : type === 'error'
    ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="#e63946"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`
    : `<svg class="toast-icon" viewBox="0 0 24 24" fill="#ff640a"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ==========================================================================
// NAVBAR & AUTH STATE
// ==========================================================================
function updateWatchlistBadge() {
  const count = Storage.getWatchlist().length;
  const badges = document.querySelectorAll('.watchlist-badge');
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

function updateNavAuthState() {
  const user = Storage.getUser();
  const guestContainers = document.querySelectorAll('.nav-guest-actions');
  const userContainers = document.querySelectorAll('.nav-user-actions');

  if (user && user.loggedIn) {
    guestContainers.forEach(el => el.style.display = 'none');
    userContainers.forEach(el => {
      el.style.display = 'flex';
      const nameEl = el.querySelector('.username');
      const emailEl = el.querySelector('.user-email');
      const avatarInitial = el.querySelector('.avatar-circle');
      if (nameEl) nameEl.textContent = user.username;
      if (emailEl) emailEl.textContent = user.email;
      if (avatarInitial) avatarInitial.textContent = user.username.charAt(0).toUpperCase();
    });
  } else {
    guestContainers.forEach(el => el.style.display = 'flex');
    userContainers.forEach(el => el.style.display = 'none');
  }
}

// ==========================================================================
// SKELETON LOADERS & REUSABLE CARD BUILDER
// ==========================================================================
function createSkeletonCardsHTML(count = 6) {
  return Array.from({ length: count }).map(() => `
    <div class="skeleton-card">
      <div class="skeleton-poster"></div>
      <div class="skeleton-info">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>
  `).join('');
}

function createAnimeCardHTML(anime) {
  if (!anime) return '';
  const animeId = String(anime.mal_id || anime.id || '');
  const inWatchlist = Storage.isInWatchlist(animeId);

  // Extract using Jikan v4 response structure
  const posterUrl = anime.images?.webp?.large_image_url
    || anime.images?.jpg?.large_image_url
    || anime.images?.webp?.image_url
    || anime.images?.jpg?.image_url
    || anime.poster
    || 'assets/icons/favicon.png';

  const displayTitle = anime.title_english || anime.title || 'Untitled Anime';

  const rawScore = anime.score !== undefined && anime.score !== null ? anime.score : anime.rating;
  const displayScore = (typeof rawScore === 'number' && rawScore > 0) ? rawScore.toFixed(1) : (rawScore || '8.5');

  const yearVal = anime.year || (anime.aired?.prop?.from?.year) || 2024;
  const epVal = (anime.episodes || anime.episodesCount) ? `${anime.episodes || anime.episodesCount} EPS` : 'HD';
  const typeVal = anime.type || 'TV';

  let genreList = ['Anime'];
  if (Array.isArray(anime.genres) && anime.genres.length > 0) {
    genreList = anime.genres.map(g => (typeof g === 'string' ? g : g.name || 'Anime'));
  }
  const genresStr = genreList.slice(0, 2).join(' • ');
  const synopsisClean = (anime.synopsis || '').replace(/"/g, '&quot;');

  return `
    <div class="anime-card" data-id="${animeId}" onclick="navigateToDetails('${animeId}')">
      <div class="anime-card-poster-wrap">
        <img class="anime-card-poster" src="${posterUrl}" alt="${displayTitle}" loading="lazy" onerror="this.src='https://cdn.myanimelist.net/images/anime/1015/138006l.jpg'">
        <span class="card-top-badge">${anime.language || 'Sub | Dub'}</span>
        <span class="card-rating-pill">
          <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          ★ ${displayScore}
        </span>
        
        <!-- Hover Overlay -->
        <div class="anime-card-overlay">
          <div class="card-overlay-top">
            <button class="card-action-btn ${inWatchlist ? 'active' : ''}" 
                    title="${inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}"
                    onclick="handleCardWatchlistClick(event, '${animeId}', this)">
              <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
            </button>
          </div>
          <div class="card-overlay-center">
            <div class="card-play-icon">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <div class="card-overlay-bottom">
            <span class="card-quick-genres">${genresStr}</span>
            <p class="card-quick-desc">${synopsisClean}</p>
          </div>
        </div>
      </div>

      <div class="anime-card-info">
        <h3 class="anime-card-title" title="${displayTitle}">${displayTitle}</h3>
        <div class="anime-card-meta">
          <span>${yearVal}</span>
          <span class="meta-dot"></span>
          <span>${epVal}</span>
          <span class="meta-dot"></span>
          <span>${typeVal}</span>
        </div>
      </div>
    </div>
  `;
}

function handleCardWatchlistClick(event, animeId, buttonEl) {
  event.stopPropagation();
  const added = Storage.toggleWatchlist(animeId);
  if (added) {
    buttonEl.classList.add('active');
    buttonEl.title = 'Remove from Watchlist';
  } else {
    buttonEl.classList.remove('active');
    buttonEl.title = 'Add to Watchlist';
  }
}

function navigateToDetails(animeId) {
  window.location.href = `details.html?id=${encodeURIComponent(animeId)}`;
}

// ==========================================================================
// SEARCH AUTOCOMPLETE ENGINE (WITH JIKAN API & DEBOUNCE)
// ==========================================================================
let searchDebounceTimer = null;

function initSearchAutocomplete() {
  const searchInputs = document.querySelectorAll('.site-search-input');
  const dropdowns = document.querySelectorAll('.search-results-dropdown');

  searchInputs.forEach((input, index) => {
    const dropdown = dropdowns[index] || dropdowns[0];
    if (!dropdown) return;

    input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      clearTimeout(searchDebounceTimer);

      if (!query) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }

      // Show instant loading state
      dropdown.innerHTML = `
        <div class="search-loading-state">
          <svg class="spin" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
          </svg>
          Searching anime on Jikan API...
        </div>
      `;
      dropdown.classList.add('active');

      // Debounce API call by 380ms
      searchDebounceTimer = setTimeout(async () => {
        try {
          let results = [];
          if (window.JikanAPI && typeof window.JikanAPI.searchAnime === 'function') {
            results = await window.JikanAPI.searchAnime(query);
          }

          // Fallback if API returned empty or offline
          if (results.length === 0 && window.ANIME_DATABASE) {
            results = window.ANIME_DATABASE.filter(a => 
              a.title.toLowerCase().includes(query.toLowerCase()) ||
              a.japaneseTitle.toLowerCase().includes(query.toLowerCase())
            );
          }

          const matches = results.slice(0, 6);

          if (matches.length === 0) {
            dropdown.innerHTML = `<div class="search-no-results">No anime found matching "<strong>${query}</strong>"</div>`;
            return;
          }

          dropdown.innerHTML = matches.map(anime => `
            <a class="search-result-item" href="details.html?id=${encodeURIComponent(anime.id || anime.mal_id)}">
              <img class="search-result-thumb" src="${anime.poster}" alt="${anime.title}">
              <div class="search-result-info">
                <div class="search-result-title">${anime.title}</div>
                <div class="search-result-meta">
                  <span class="rating">★ ${typeof anime.rating === 'number' ? anime.rating.toFixed(1) : '4.8'}</span>
                  <span>•</span>
                  <span>${anime.year || '2024'}</span>
                  <span>•</span>
                  <span>${anime.genres ? anime.genres[0] : 'Anime'}</span>
                </div>
              </div>
            </a>
          `).join('');
        } catch (err) {
          dropdown.innerHTML = `
            <div class="search-error-state">
              <svg viewBox="0 0 24 24" fill="#e63946"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              Anime data is temporarily unavailable. Please try again.
            </div>
          `;
        }
      }, 380);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Enter key to jump to browse
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query) {
          window.location.href = `browse.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
  });
}

// ==========================================================================
// HORIZONTAL SHELF SCROLLER
// ==========================================================================
function scrollShelf(containerId, direction) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const scrollDistance = 600;
  container.scrollBy({
    left: direction === 'left' ? -scrollDistance : scrollDistance,
    behavior: 'smooth'
  });
}

// ==========================================================================
// ==========================================================================
// HOME PAGE HERO CAROUSEL CONTROLLER (CRUNCHYROLL STREAMING STANDARD)
// ==========================================================================

/**
 * Curated list of the 5 Spotlight Anime Showcase Objects
 * Strictly using the user-provided images from the images/ folder:
 * 1. Demon Slayer: Kimetsu no Yaiba  -> images/demon-slayer.jpg
 * 2. Solo Leveling                   -> images/Sololeveling.jpg
 * 3. One Piece                       -> images/OnePiece.jpeg
 * 4. Naruto                          -> images/naruto.jpg
 * 5. Jujutsu Kaisen                  -> images/jujustu kaisen.webp
 */
const SPOTLIGHT_ANIME = [
  {
    id: "demon-slayer-kimetsu-no-yaiba",
    title: "Demon Slayer: Kimetsu no Yaiba",
    japaneseTitle: "鬼滅の刃",
    subtitle: "鬼滅の刃 • Hashira Training Arc",
    score: 4.92,
    ratingCount: "320k",
    episodesCount: 63,
    language: "Sub | Dub",
    genres: ["Action", "Fantasy", "Historical", "Shonen"],
    synopsis: "Tanjiro Kamado's peaceful life is shattered when demons slaughter his entire family, leaving only his sister Nezuko turned into a demon. Determined to find a cure and avenge his loved ones, Tanjiro joins the Demon Slayer Corps, mastering the breath of water and uncovering the ancient secret of the Sun Breathing technique.",
    banner: "images/demon-slayer.jpg"
  },
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    japaneseTitle: "俺だけレベルアップな件",
    subtitle: "俺だけレベルアップな件 • Season 1",
    score: 4.88,
    ratingCount: "189k",
    episodesCount: 12,
    language: "Sub | Dub",
    genres: ["Action", "Fantasy", "Adventure", "Supernatural"],
    synopsis: "In a world where mysterious gates connect modern Earth to dungeons crawling with monstrous beasts, awakened humans known as Hunters risk their lives for glory and wealth. Sung Jinwoo, notoriously mocked as the Weakest Hunter of All Mankind, is fatally wounded inside a deadly double dungeon—only to wake up as the sole player chosen by an enigmatic System.",
    banner: "images/Sololeveling.jpg"
  },
  {
    id: "one-piece",
    title: "One Piece",
    japaneseTitle: "ワンピース",
    subtitle: "ワンピース • Egghead Island Arc",
    score: 4.96,
    ratingCount: "540k",
    episodesCount: 1100,
    language: "Sub | Dub",
    genres: ["Action", "Adventure", "Fantasy", "Shonen"],
    synopsis: "Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become King of the Pirates. With a course charted for the treacherous waters of the Grand Line and beyond, Luffy and his loyal Straw Hat Pirates brave legendary warlords, tyrannical admirals, and the supreme mystery left behind by Gol D. Roger.",
    banner: "images/OnePiece.jpeg"
  },
  {
    id: "naruto-shippuden",
    title: "Naruto",
    japaneseTitle: "ナルト 疾風伝",
    subtitle: "ナルト 疾風伝 • Fourth Shinobi War",
    score: 4.87,
    ratingCount: "490k",
    episodesCount: 500,
    language: "Sub | Dub",
    genres: ["Action", "Adventure", "Martial Arts", "Shonen"],
    synopsis: "After two and a half years of rigorous training on the road with Master Jiraiya, Naruto Uzumaki returns to the Hidden Leaf Village stronger, wiser, and more driven than ever. But dangerous shadows loom on the horizon as the rogue criminal syndicate Akatsuki moves to seize the Nine-Tails sealed deep inside him.",
    banner: "images/naruto.jpg"
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    japaneseTitle: "呪術廻戦",
    subtitle: "呪術廻戦 • Shibuya Incident",
    score: 4.90,
    ratingCount: "295k",
    episodesCount: 47,
    language: "Sub | Dub",
    genres: ["Action", "Dark Fantasy", "Supernatural", "Shonen"],
    synopsis: "Yuji Itadori is an exceptionally athletic high school student who swallows a cursed talisman—the finger of the legendary King of Curses, Ryomen Sukuna—to protect his friends. Drawn into the secret, lethal society of Jujutsu Sorcerers at Tokyo Jujutsu High, Yuji must track down all twenty fingers while confronting terrifying special-grade curses.",
    banner: "images/jujustu kaisen.webp"
  }
];

let heroCurrentIndex = 0;
let heroAutoPlayInterval = null;
const HERO_AUTOPLAY_DELAY = 6000; // 6 seconds auto-advance

/**
 * Initializes the Hero Component:
 * 1. Uses strictly the 5 spotlight anime with user-provided artwork from images/.
 * 2. Injects semantic HTML markup with right-anchored artwork and multi-gradient vignette.
 * 3. Mounts pagination indicator dots and arrow navigation.
 * 4. Starts the 6-second auto-play loop with hover-pause listeners.
 */
async function initHeroCarousel() {
  const track = document.getElementById('heroTrack');
  const indicatorsContainer = document.getElementById('heroIndicators');
  if (!track || !indicatorsContainer) return;

  // Resolve dataset: strictly use the 5 user-specified spotlight anime and images
  const featuredAnime = SPOTLIGHT_ANIME.map(item => {
    const local = window.ANIME_DATABASE ? window.ANIME_DATABASE.find(a => a.id === item.id) : null;
    return {
      ...item,
      // Strictly use the specified banner from the images/ folder
      bannerImg: item.banner,
      rating: item.score || (local ? local.rating : 4.9),
      ratingCount: item.ratingCount || (local ? `${Math.round(local.ratingCount / 1000)}k` : '100k'),
      episodesCount: item.episodesCount || (local ? local.episodesCount : 24),
      language: item.language || 'Sub | Dub'
    };
  });

  if (featuredAnime.length === 0) return;

  // 1. Build Slides HTML Structure
  track.innerHTML = featuredAnime.map((anime, index) => {
    const animeId = String(anime.id);
    const inWatchlist = typeof Storage !== 'undefined' && typeof Storage.isInWatchlist === 'function' 
      ? Storage.isInWatchlist(animeId) 
      : false;
    const scoreVal = typeof anime.rating === 'number' ? anime.rating.toFixed(2) : String(anime.score || '4.90');

    return `
      <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}" role="group" aria-roledescription="slide" aria-label="${index + 1} of ${featuredAnime.length}">
        <!-- Right-anchored anime backdrop artwork -->
        <img class="hero-backdrop-img" src="${anime.bannerImg}" alt="${anime.title} Backdrop Artwork" loading="${index === 0 ? 'eager' : 'lazy'}">
        
        <!-- Multi-directional vignette overlay: dark left fade, bottom fade, top scrim -->
        <div class="hero-gradient-overlay" aria-hidden="true"></div>
        
        <!-- Left-aligned content container (max-width: 600px) -->
        <div class="container hero-content-wrapper">
          <div class="hero-content">
            
            <!-- Badge row -->
            <div class="hero-badge-row">
              <span class="hero-badge hero-badge-spotlight">SPOTLIGHT</span>
              <span class="hero-badge hero-badge-audio">${anime.language}</span>
              <span class="hero-badge hero-badge-episodes">${anime.episodesCount} Episodes</span>
              <div class="hero-badge hero-badge-rating">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <span>${scoreVal}</span>
                <span class="rating-votes">(${anime.ratingCount})</span>
              </div>
            </div>

            <!-- Large main title -->
            <h1 class="hero-title">${anime.title}</h1>

            <!-- Optional Japanese / Season Subtitle -->
            <h3 class="hero-subtitle">${anime.subtitle || anime.japaneseTitle || ''}</h3>

            <!-- Genre pill tags -->
            <div class="hero-genres">
              ${(anime.genres || []).map(g => `<span class="hero-genre-pill">${g}</span>`).join('')}
            </div>

            <!-- Synopsis clamped strictly to 3 lines -->
            <p class="hero-synopsis">${anime.synopsis}</p>

            <!-- Call-to-action buttons -->
            <div class="hero-actions">
              <a href="watch.html?id=${encodeURIComponent(animeId)}&ep=1" class="hero-btn hero-btn-primary" aria-label="Watch ${anime.title} Now">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Watch Now</span>
              </a>
              <button type="button" class="hero-btn hero-btn-secondary" onclick="handleHeroWatchlistToggle('${animeId}', this)" aria-label="${inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
                <span class="wl-text">${inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
              <a href="details.html?id=${encodeURIComponent(animeId)}" class="hero-btn hero-btn-glass" aria-label="View Details of ${anime.title}">
                <span>Details</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    `;
  }).join('');

  // 2. Build Bottom Carousel Navigation Indicators (Pagination Dots)
  indicatorsContainer.innerHTML = featuredAnime.map((_, index) => `
    <button type="button" 
      class="hero-dot ${index === 0 ? 'active' : ''}" 
      data-index="${index}" 
      aria-label="Navigate to spotlight slide ${index + 1} of ${featuredAnime.length}"
      onclick="goToHeroSlide(${index})">
    </button>
  `).join('');

  // 3. Connect Previous / Next Arrow Controls
  const prevBtn = document.querySelector('.hero-nav-arrow.prev');
  const nextBtn = document.querySelector('.hero-nav-arrow.next');

  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.preventDefault();
      prevHeroSlide();
      startHeroAutoplay();
    };
  }

  if (nextBtn) {
    nextBtn.onclick = (e) => {
      e.preventDefault();
      nextHeroSlide();
      startHeroAutoplay();
    };
  }

  // 4. Start 6-Second Auto-play with Pause on Hover
  startHeroAutoplay();

  const carouselSection = document.querySelector('.hero-carousel-section');
  if (carouselSection) {
    carouselSection.addEventListener('mouseenter', stopHeroAutoplay);
    carouselSection.addEventListener('mouseleave', startHeroAutoplay);
    // Keyboard accessibility for arrows
    carouselSection.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevHeroSlide();
        startHeroAutoplay();
      } else if (e.key === 'ArrowRight') {
        nextHeroSlide();
        startHeroAutoplay();
      }
    });
  }
}

/**
 * Handles Watchlist Toggle from Hero Secondary Button
 */
function handleHeroWatchlistToggle(animeId, btn) {
  if (typeof Storage !== 'undefined' && typeof Storage.toggleWatchlist === 'function') {
    const added = Storage.toggleWatchlist(animeId);
    const textEl = btn.querySelector('.wl-text');
    if (textEl) {
      textEl.textContent = added ? 'In Watchlist' : 'Add to Watchlist';
    }
  }
}

/**
 * Crossfades smoothly to the specified slide index
 * @param {number} targetIndex - The index of the slide to activate
 */
function goToHeroSlide(targetIndex) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (slides.length === 0) return;

  // Deactivate current slide & dot
  slides[heroCurrentIndex]?.classList.remove('active');
  dots[heroCurrentIndex]?.classList.remove('active');

  // Compute circular index bounds
  heroCurrentIndex = (targetIndex + slides.length) % slides.length;

  // Activate target slide & dot
  slides[heroCurrentIndex]?.classList.add('active');
  dots[heroCurrentIndex]?.classList.add('active');
}

/**
 * Advances to the next spotlight slide
 */
function nextHeroSlide() {
  goToHeroSlide(heroCurrentIndex + 1);
}

/**
 * Reverts to the previous spotlight slide
 */
function prevHeroSlide() {
  goToHeroSlide(heroCurrentIndex - 1);
}

/**
 * Starts or resets the 6-second auto-advance timer
 */
function startHeroAutoplay() {
  stopHeroAutoplay();
  heroAutoPlayInterval = setInterval(nextHeroSlide, HERO_AUTOPLAY_DELAY);
}

/**
 * Pauses the auto-advance timer (e.g. on mouse hover or touch)
 */
function stopHeroAutoplay() {
  if (heroAutoPlayInterval) {
    clearInterval(heroAutoPlayInterval);
    heroAutoPlayInterval = null;
  }
}

// ==========================================================================
// CONTINUE WATCHING SHELF CONTROLLER
// ==========================================================================
function renderContinueWatching() {
  const section = document.getElementById('continueWatchingSection');
  const shelf = document.getElementById('continueWatchingShelf');
  if (!section || !shelf) return;

  const history = Storage.getHistory();
  if (!history || history.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  shelf.innerHTML = history.map(item => {
    let title = 'Episode ' + item.episodeNum;
    let poster = 'assets/icons/favicon.png';

    if (window.JikanAPI && window.JikanAPI.MOCK_DATASET) {
      const all = [
        ...window.JikanAPI.MOCK_DATASET.trending,
        ...window.JikanAPI.MOCK_DATASET.popular,
        ...window.JikanAPI.MOCK_DATASET.topRated
      ];
      const match = all.find(a => String(a.mal_id) === String(item.animeId));
      if (match) {
        title = match.title_english || match.title;
        poster = match.images?.webp?.large_image_url || match.images?.jpg?.large_image_url || poster;
      }
    } else if (window.ANIME_DATABASE) {
      const match = window.ANIME_DATABASE.find(a => String(a.id) === String(item.animeId));
      if (match) {
        title = match.title;
        poster = match.poster;
      }
    }

    const percent = Math.min(100, Math.round(((item.progress || 0) / (item.duration || 1440)) * 100));

    return `
      <div class="continue-card" onclick="window.location.href='watch.html?id=${encodeURIComponent(item.animeId)}&ep=${item.episodeNum}'">
        <div class="continue-thumb-wrap">
          <img class="continue-thumb" src="${poster}" alt="${title}">
          <div class="continue-play-overlay">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <div class="continue-progress-bar">
            <div class="continue-progress-fill" style="width: ${percent}%;"></div>
          </div>
        </div>
        <div class="continue-info">
          <div class="continue-title" title="${title}">${title}</div>
          <div class="continue-meta">Episode ${item.episodeNum} • ${percent}% watched</div>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// POPULATE HOME SHELVES (SEQUENTIAL WITH JIKAN API & INSTANT FALLBACK)
// ==========================================================================
async function populateHomeShelves() {
  const shelfConfigs = [
    {
      id: 'trendingShelf',
      fetcher: () => window.JikanAPI.getTrendingAnime(),
      mockKey: 'trending',
      fallbackFilter: a => a.trending
    },
    {
      id: 'popularShelf',
      fetcher: () => window.JikanAPI.getPopularAnime(),
      mockKey: 'popular',
      fallbackFilter: a => a.popular
    },
    {
      id: 'recentShelf',
      fetcher: () => window.JikanAPI.getRecentlyAdded(),
      mockKey: 'recentlyAdded',
      fallbackFilter: a => a.recentlyAdded
    },
    {
      id: 'topRatedShelf',
      fetcher: () => window.JikanAPI.getTopAnime(),
      mockKey: 'topRated',
      fallbackFilter: a => a.topRated
    },
    {
      id: 'newEpisodesShelf',
      fetcher: () => window.JikanAPI.getNewEpisodes(),
      mockKey: 'newEpisodes',
      fallbackFilter: a => a.newEpisodes
    },
    {
      id: 'recommendedShelf',
      fetcher: () => window.JikanAPI.getPopularAnime(),
      mockKey: 'popular',
      fallbackFilter: a => a.featured
    }
  ];

  // 1. Render skeletons on all shelves immediately for instant responsiveness
  shelfConfigs.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = createSkeletonCardsHTML(8);
  });

  // 2. Fetch each shelf sequentially to respect Jikan 3 req/sec rate limit (NO Promise.all)
  for (const config of shelfConfigs) {
    const el = document.getElementById(config.id);
    if (!el) continue;

    try {
      let items = [];
      if (window.JikanAPI && typeof config.fetcher === 'function') {
        items = await config.fetcher();
      }

      // If empty or failed, fallback to built-in static mock dataset
      if (!items || items.length === 0) {
        if (window.JikanAPI && window.JikanAPI.MOCK_DATASET && window.JikanAPI.MOCK_DATASET[config.mockKey]) {
          items = window.JikanAPI.MOCK_DATASET[config.mockKey];
        } else if (window.ANIME_DATABASE) {
          items = window.ANIME_DATABASE.filter(config.fallbackFilter);
        }
      }

      if (items && items.length > 0) {
        el.innerHTML = items.map(createAnimeCardHTML).join('');
      } else {
        el.innerHTML = `<div class="api-error-card">Anime data is temporarily unavailable. Please try again.</div>`;
      }
    } catch (err) {
      console.warn(`[Shelf] Error loading ${config.id}:`, err);
      // Failover directly to static mock dataset
      let fallbackItems = [];
      if (window.JikanAPI && window.JikanAPI.MOCK_DATASET && window.JikanAPI.MOCK_DATASET[config.mockKey]) {
        fallbackItems = window.JikanAPI.MOCK_DATASET[config.mockKey];
      } else if (window.ANIME_DATABASE) {
        fallbackItems = window.ANIME_DATABASE.filter(config.fallbackFilter);
      }
      if (fallbackItems && fallbackItems.length > 0) {
        el.innerHTML = fallbackItems.map(createAnimeCardHTML).join('');
      }
    }
  }
}

// ==========================================================================
// USER DROPDOWN & MOBILE DRAWER HANDLERS
// ==========================================================================
function initUserDropdownAndDrawer() {
  // User dropdown toggle
  const userBtn = document.getElementById('userAvatarBtn');
  const userDropdown = document.getElementById('userDropdown');
  if (userBtn && userDropdown) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('active');
    });
    document.addEventListener('click', () => userDropdown.classList.remove('active'));
  }

  // Logout triggers
  document.querySelectorAll('.logout-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      Storage.logout();
    });
  });

  // Mobile hamburger
  const hamburger = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  if (hamburger && drawer && overlay) {
    const toggle = () => {
      hamburger.classList.toggle('open');
      drawer.classList.toggle('open');
      overlay.classList.toggle('active');
    };
    hamburger.addEventListener('click', toggle);
    overlay.addEventListener('click', toggle);
  }

  // Scroll listener for sticky header background
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

// ==========================================================================
// DOM READY INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  updateWatchlistBadge();
  updateNavAuthState();
  initSearchAutocomplete();
  initUserDropdownAndDrawer();

  // If on home page
  if (document.getElementById('heroTrack')) {
    initHeroCarousel();
    renderContinueWatching();
    populateHomeShelves();
  }
});

// Explicit window bindings for inline HTML handlers
window.scrollShelf = scrollShelf;
window.prevHeroSlide = prevHeroSlide;
window.nextHeroSlide = nextHeroSlide;
window.goToHeroSlide = goToHeroSlide;
window.navigateToDetails = navigateToDetails;
window.handleCardWatchlistClick = handleCardWatchlistClick;
window.handleHeroWatchlistToggle = handleHeroWatchlistToggle;
window.createAnimeCardHTML = createAnimeCardHTML;
window.populateHomeShelves = populateHomeShelves;
window.renderContinueWatching = renderContinueWatching;


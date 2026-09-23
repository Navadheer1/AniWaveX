/**
 * AniWaveX - Browse Page Logic
 * Handles interactive filtering, multi-parameter sorting, client-side pagination, and Jikan API integration.
 */

let allLoadedAnime = [];
let currentFilteredList = [];
let displayedCount = 12;
const ITEMS_PER_PAGE = 12;
let browseSearchDebounce = null;
let currentJikanPage = 1;
let isLoadingData = false;

document.addEventListener('DOMContentLoaded', () => {
  initBrowsePage();
});

async function initBrowsePage() {
  const searchInput = document.getElementById('browseSearchInput');
  const genreSelect = document.getElementById('genreFilter');
  const yearSelect = document.getElementById('yearFilter');
  const ratingSelect = document.getElementById('ratingFilter');
  const statusSelect = document.getElementById('statusFilter');
  const languageSelect = document.getElementById('languageFilter');
  const typeSelect = document.getElementById('typeFilter');
  const sortSelect = document.getElementById('sortFilter');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const resetBtn = document.getElementById('resetFiltersBtn');

  // Read URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q');
  const initialGenre = urlParams.get('genre');
  const initialSort = urlParams.get('sort');
  const initialWatchlist = urlParams.get('watchlist') === 'true';

  if (initialQuery && searchInput) searchInput.value = initialQuery;
  if (initialGenre && genreSelect) genreSelect.value = initialGenre;
  if (initialSort && sortSelect) {
    if (initialSort === 'popular') sortSelect.value = 'popular';
    else if (initialSort === 'recent') sortSelect.value = 'recent';
    else if (initialSort === 'rating') sortSelect.value = 'rating';
  }

  // If watchlist page view requested
  if (initialWatchlist) {
    const pageTitle = document.querySelector('.browse-page-title');
    const pageSubtitle = document.querySelector('.browse-page-subtitle');
    if (pageTitle) pageTitle.textContent = 'My Watchlist';
    if (pageSubtitle) pageSubtitle.textContent = 'Your saved anime shows and bookmarked favorites.';
  }

  // Show skeletons immediately
  const grid = document.getElementById('browseGrid');
  if (grid) grid.innerHTML = createSkeletonCardsHTML(12);

  // Fetch initial data from Jikan
  await loadBrowseData(initialQuery);

  // Populate genres dynamically in filter select
  populateGenreOptions(genreSelect);

  // Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(browseSearchDebounce);
      browseSearchDebounce = setTimeout(async () => {
        const query = searchInput.value.trim();
        if (query.length >= 2) {
          if (grid) grid.innerHTML = createSkeletonCardsHTML(6);
          await loadBrowseData(query);
        } else if (query.length === 0) {
          await loadBrowseData();
        }
        applyFilters(true);
      }, 400);
    });
  }

  if (genreSelect) genreSelect.addEventListener('change', () => applyFilters(true));
  if (yearSelect) yearSelect.addEventListener('change', () => applyFilters(true));
  if (ratingSelect) ratingSelect.addEventListener('change', () => applyFilters(true));
  if (statusSelect) statusSelect.addEventListener('change', () => applyFilters(true));
  if (languageSelect) languageSelect.addEventListener('change', () => applyFilters(true));
  if (typeSelect) typeSelect.addEventListener('change', () => applyFilters(true));
  if (sortSelect) sortSelect.addEventListener('change', () => applyFilters(true));

  if (resetBtn) {
    resetBtn.addEventListener('click', resetAllFilters);
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', async () => {
      // If we have remaining in current list
      if (displayedCount < currentFilteredList.length) {
        displayedCount += ITEMS_PER_PAGE;
        renderCards();
      } else {
        // Fetch next page from Jikan API
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = `
          <svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
          </svg> Loading More Titles...`;
        
        currentJikanPage++;
        try {
          const searchVal = searchInput ? searchInput.value.trim() : '';
          let moreAnime = [];
          if (searchVal && window.JikanAPI) {
            moreAnime = await window.JikanAPI.searchAnime(searchVal, currentJikanPage);
          } else if (window.JikanAPI) {
            moreAnime = await window.JikanAPI.getPopularAnime(currentJikanPage);
          }

          if (moreAnime && moreAnime.length > 0) {
            // Append unique
            const existingIds = new Set(allLoadedAnime.map(a => a.id));
            moreAnime.forEach(a => {
              if (!existingIds.has(a.id)) {
                allLoadedAnime.push(a);
              }
            });
            displayedCount += ITEMS_PER_PAGE;
            applyFilters(false);
          } else {
            showToast('No more anime found.', 'info');
            loadMoreBtn.style.display = 'none';
          }
        } catch (e) {
          showToast('Could not load more anime right now.', 'info');
        } finally {
          loadMoreBtn.disabled = false;
        }
      }
    });
  }

  // Initial Filter Run
  applyFilters(true, initialWatchlist);
}

async function loadBrowseData(searchQuery = '') {
  if (isLoadingData) return;
  isLoadingData = true;

  try {
    let items = [];
    if (searchQuery && window.JikanAPI) {
      items = await window.JikanAPI.searchAnime(searchQuery, 1);
    } else if (window.JikanAPI) {
      // Load both popular and top anime
      const popular = await window.JikanAPI.getPopularAnime(1);
      const top = await window.JikanAPI.getTopAnime(1);
      const combined = [...popular];
      const seen = new Set(popular.map(p => p.id));
      top.forEach(t => {
        if (!seen.has(t.id)) combined.push(t);
      });
      items = combined;
    }

    // Fallback if Jikan returned empty or is offline
    if (!items || items.length === 0) {
      items = window.ANIME_DATABASE || [];
    }

    allLoadedAnime = items;
  } catch (err) {
    console.warn('[Browse] Jikan load error, falling back:', err);
    allLoadedAnime = window.ANIME_DATABASE || [];
  } finally {
    isLoadingData = false;
  }
}

function populateGenreOptions(selectEl) {
  if (!selectEl) return;
  const genresSet = new Set([
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
    'Sci-Fi', 'Shonen', 'Sports', 'Supernatural', 'Mystery',
    'Psychological', 'Romance', 'School'
  ]);

  allLoadedAnime.forEach(anime => {
    if (Array.isArray(anime.genres)) {
      anime.genres.forEach(g => genresSet.add(g));
    }
  });

  const sortedGenres = Array.from(genresSet).sort();
  const currentVal = selectEl.value;

  selectEl.innerHTML = '<option value="all">All Genres</option>';
  sortedGenres.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    selectEl.appendChild(opt);
  });

  if (currentVal) selectEl.value = currentVal;
}

function applyFilters(resetPage = true, watchlistOnly = false) {
  const searchInput = document.getElementById('browseSearchInput');
  const genreSelect = document.getElementById('genreFilter');
  const yearSelect = document.getElementById('yearFilter');
  const ratingSelect = document.getElementById('ratingFilter');
  const statusSelect = document.getElementById('statusFilter');
  const languageSelect = document.getElementById('languageFilter');
  const typeSelect = document.getElementById('typeFilter');
  const sortSelect = document.getElementById('sortFilter');

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const genre = genreSelect ? genreSelect.value : 'all';
  const year = yearSelect ? yearSelect.value : 'all';
  const rating = ratingSelect ? ratingSelect.value : 'all';
  const status = statusSelect ? statusSelect.value : 'all';
  const language = languageSelect ? languageSelect.value : 'all';
  const type = typeSelect ? typeSelect.value : 'all';
  const sort = sortSelect ? sortSelect.value : 'popular';

  const userWatchlist = Storage.getWatchlist();

  let results = allLoadedAnime.filter(anime => {
    const animeId = String(anime.id || anime.mal_id);
    const isWlParam = new URLSearchParams(window.location.search).get('watchlist') === 'true' || watchlistOnly;
    if (isWlParam && !userWatchlist.includes(animeId)) {
      return false;
    }

    // Local client-side substring check if query wasn't API-fetched
    if (query) {
      const matchTitle = (anime.title || '').toLowerCase().includes(query);
      const matchJp = (anime.japaneseTitle || '').toLowerCase().includes(query);
      const matchGenre = Array.isArray(anime.genres) && anime.genres.some(g => g.toLowerCase().includes(query));
      const matchStudio = (anime.studio || '').toLowerCase().includes(query);
      if (!matchTitle && !matchJp && !matchGenre && !matchStudio) return false;
    }

    // Genre
    if (genre !== 'all' && (!Array.isArray(anime.genres) || !anime.genres.includes(genre))) {
      return false;
    }

    // Year
    if (year !== 'all') {
      const aYear = parseInt(anime.year) || 2024;
      if (year === '2024' && aYear !== 2024) return false;
      if (year === '2023' && aYear !== 2023) return false;
      if (year === '2022' && aYear !== 2022) return false;
      if (year === '2020-2021' && (aYear < 2020 || aYear > 2021)) return false;
      if (year === 'classic' && aYear >= 2020) return false;
    }

    // Rating
    if (rating !== 'all') {
      const minRating = parseFloat(rating);
      if ((anime.rating || 0) < minRating) return false;
    }

    // Status
    if (status !== 'all') {
      const aStatus = (anime.status || '').toLowerCase();
      if (!aStatus.includes(status.toLowerCase())) return false;
    }

    // Type
    if (type !== 'all') {
      const aType = (anime.type || '').toLowerCase();
      if (!aType.includes(type.toLowerCase())) return false;
    }

    return true;
  });

  // Sorting
  results.sort((a, b) => {
    if (sort === 'popular') return (b.ratingCount || 0) - (a.ratingCount || 0);
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sort === 'recent') return (b.year || 0) - (a.year || 0);
    if (sort === 'az') return (a.title || '').localeCompare(b.title || '');
    if (sort === 'za') return (b.title || '').localeCompare(a.title || '');
    return 0;
  });

  currentFilteredList = results;
  if (resetPage) displayedCount = ITEMS_PER_PAGE;
  renderCards();
}

function renderCards() {
  const grid = document.getElementById('browseGrid');
  const counter = document.getElementById('resultsCounter');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (!grid) return;

  const total = currentFilteredList.length;
  const itemsToShow = currentFilteredList.slice(0, displayedCount);

  if (counter) {
    counter.innerHTML = `Showing <strong>${itemsToShow.length}</strong> of <strong>${total}</strong> anime`;
  }

  if (total === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <h3 class="empty-state-title">No Anime Found</h3>
        <p class="empty-state-text">We couldn't find any anime matching your current filters or search query. Try resetting your filters to discover more titles.</p>
        <button class="btn btn-primary" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }

  grid.innerHTML = itemsToShow.map(createAnimeCardHTML).join('');

  if (loadMoreBtn) {
    loadMoreBtn.style.display = 'inline-flex';
    loadMoreBtn.textContent = displayedCount >= total
      ? 'Fetch More From Jikan API'
      : `Load More Titles (${total - displayedCount} remaining)`;
  }
}

async function resetAllFilters() {
  const searchInput = document.getElementById('browseSearchInput');
  const genreSelect = document.getElementById('genreFilter');
  const yearSelect = document.getElementById('yearFilter');
  const ratingSelect = document.getElementById('ratingFilter');
  const statusSelect = document.getElementById('statusFilter');
  const languageSelect = document.getElementById('languageFilter');
  const typeSelect = document.getElementById('typeFilter');
  const sortSelect = document.getElementById('sortFilter');

  if (searchInput) searchInput.value = '';
  if (genreSelect) genreSelect.value = 'all';
  if (yearSelect) yearSelect.value = 'all';
  if (ratingSelect) ratingSelect.value = 'all';
  if (statusSelect) statusSelect.value = 'all';
  if (languageSelect) languageSelect.value = 'all';
  if (typeSelect) typeSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'popular';

  // Clear query params in address bar without reload
  const newUrl = window.location.pathname;
  window.history.pushState({}, '', newUrl);

  const pageTitle = document.querySelector('.browse-page-title');
  const pageSubtitle = document.querySelector('.browse-page-subtitle');
  if (pageTitle) pageTitle.textContent = 'Explore All Anime';
  if (pageSubtitle) pageSubtitle.textContent = 'Discover full series, trending hits, and all-time anime classics.';

  const grid = document.getElementById('browseGrid');
  if (grid) grid.innerHTML = createSkeletonCardsHTML(12);

  await loadBrowseData();
  applyFilters(true);
}

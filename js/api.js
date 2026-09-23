/**
 * AniWaveX - Jikan API v4 Service Layer
 * Implements strict rate-limiting (400ms queue, retry on 429), 24-hour localStorage caching,
 * and high-fidelity static mock fallback with real MAL CDN images.
 */

const JikanAPI = (function() {
  const BASE_URL = 'https://api.jikan.moe/v4';
  const CACHE_PREFIX = 'aniwavex_jikan_24h_';
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24-hour localStorage expiration
  const REQUEST_INTERVAL_MS = 400; // Enforced 400ms delay between API calls

  // ========================================================================
  // 1. BUILT-IN STATIC MOCK DATASET (REAL MAL TITLES, SCORES & CDN IMAGES)
  // ========================================================================
  const MOCK_DATASET = {
    trending: [
      {
        mal_id: 52991,
        title: "Sousou no Frieren",
        title_english: "Frieren: Beyond Journey's End",
        score: 9.14,
        episodes: 28,
        year: 2023,
        status: "Finished Airing",
        genres: [{ name: "Adventure" }, { name: "Drama" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1015/138006l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg" }
        },
        synopsis: "After defeating the Demon King with her hero party, the elven mage Frieren embarks on a peaceful journey to understand human mortality and fleeting connections."
      },
      {
        mal_id: 52299,
        title: "Ore dake Level Up na Ken",
        title_english: "Solo Leveling",
        score: 8.28,
        episodes: 12,
        year: 2024,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Adventure" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1429/140237l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1429/140237l.jpg" }
        },
        synopsis: "In a world where hunters battle monstrous beasts inside dimensional gates, Sung Jinwoo awakes from a lethal double dungeon raid with a mysterious System."
      },
      {
        mal_id: 40748,
        title: "Jujutsu Kaisen 2nd Season",
        title_english: "Jujutsu Kaisen Season 2",
        score: 8.79,
        episodes: 23,
        year: 2023,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Fantasy" }, { name: "Supernatural" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1792/138022l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1792/138022l.jpg" }
        },
        synopsis: "The past connection between Satoru Gojo and Suguru Geto during their Jujutsu High days, followed by the catastrophic Shibuya Incident."
      },
      {
        mal_id: 38000,
        title: "Kimetsu no Yaiba",
        title_english: "Demon Slayer: Kimetsu no Yaiba",
        score: 8.49,
        episodes: 26,
        year: 2019,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Fantasy" }, { name: "Historical" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1286/99889l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg" }
        },
        synopsis: "Tanjiro Kamado sets out on a quest to avenge his slaughtered family and find a cure to restore his demon-turned sister Nezuko back into a human."
      },
      {
        mal_id: 21,
        title: "One Piece",
        title_english: "One Piece",
        score: 8.73,
        episodes: 1100,
        year: 1999,
        status: "Currently Airing",
        genres: [{ name: "Action" }, { name: "Adventure" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1244/138851l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1244/138851l.jpg" }
        },
        synopsis: "Monkey D. Luffy and his Straw Hat crew sail across the treacherous Grand Line in search of Gol D. Roger's legendary treasure to become the next Pirate King."
      },
      {
        mal_id: 52588,
        title: "Kaijuu 8-gou",
        title_english: "Kaiju No. 8",
        score: 8.16,
        episodes: 12,
        year: 2024,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Sci-Fi" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1565/142277l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1565/142277l.jpg" }
        },
        synopsis: "Kafka Hibino aspires to join the elite Defense Force. When an unexpected miniature parasite grants him monster powers, he becomes Kaiju No. 8."
      }
    ],
    popular: [
      {
        mal_id: 16498,
        title: "Shingeki no Kyojin",
        title_english: "Attack on Titan",
        score: 8.55,
        episodes: 25,
        year: 2013,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Drama" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/10/47347l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg" }
        },
        synopsis: "Eren Jaeger vows to eliminate all Titans after the destruction of his hometown leaves him determined to explore the world beyond the enormous walls."
      },
      {
        mal_id: 5114,
        title: "Fullmetal Alchemist: Brotherhood",
        title_english: "Fullmetal Alchemist: Brotherhood",
        score: 9.09,
        episodes: 64,
        year: 2009,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Adventure" }, { name: "Drama" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1208/94745l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg" }
        },
        synopsis: "Two brothers search for the Philosopher's Stone after a failed alchemical ritual strips them of their physical bodies."
      },
      {
        mal_id: 1535,
        title: "Death Note",
        title_english: "Death Note",
        score: 8.62,
        episodes: 37,
        year: 2006,
        status: "Finished Airing",
        genres: [{ name: "Supernatural" }, { name: "Suspense" }, { name: "Psychological" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1079/138100l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1079/138100l.jpg" }
        },
        synopsis: "A high school genius discovers a supernatural notebook that allows him to eliminate anyone whose name he writes within it."
      },
      {
        mal_id: 11061,
        title: "Hunter x Hunter (2011)",
        title_english: "Hunter x Hunter",
        score: 9.04,
        episodes: 148,
        year: 2011,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Adventure" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1337/99013l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1337/99013l.jpg" }
        },
        synopsis: "Gon Freecss strives to become an exceptional licensed Hunter to track down the legendary father he never knew."
      },
      {
        mal_id: 50265,
        title: "Spy x Family",
        title_english: "Spy x Family",
        score: 8.50,
        episodes: 12,
        year: 2022,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Comedy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1441/122795l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1441/122795l.jpg" }
        },
        synopsis: "A spy on an undercover assignment assembles a counterfeit family, unaware that his adopted daughter is a telepath and his wife is a deadly assassin."
      },
      {
        mal_id: 49596,
        title: "Blue Lock",
        title_english: "Blue Lock",
        score: 8.26,
        episodes: 24,
        year: 2022,
        status: "Finished Airing",
        genres: [{ name: "Sports" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1258/126926l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1258/126926l.jpg" }
        },
        synopsis: "Three hundred elite high school strikers are locked inside the Blue Lock training facility to forge the ultimate selfish striker for Japan's national team."
      }
    ],
    topRated: [
      {
        mal_id: 52991,
        title: "Sousou no Frieren",
        title_english: "Frieren: Beyond Journey's End",
        score: 9.14,
        episodes: 28,
        year: 2023,
        status: "Finished Airing",
        genres: [{ name: "Adventure" }, { name: "Drama" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1015/138006l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg" }
        }
      },
      {
        mal_id: 5114,
        title: "Fullmetal Alchemist: Brotherhood",
        title_english: "Fullmetal Alchemist: Brotherhood",
        score: 9.09,
        episodes: 64,
        year: 2009,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Adventure" }, { name: "Drama" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1208/94745l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg" }
        }
      },
      {
        mal_id: 9253,
        title: "Steins;Gate",
        title_english: "Steins;Gate",
        score: 9.07,
        episodes: 24,
        year: 2011,
        status: "Finished Airing",
        genres: [{ name: "Drama" }, { name: "Sci-Fi" }, { name: "Suspense" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1935/127974l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1935/127974l.jpg" }
        }
      },
      {
        mal_id: 41467,
        title: "Bleach: Sennen Kessen-hen",
        title_english: "Bleach: Thousand-Year Blood War",
        score: 9.01,
        episodes: 13,
        year: 2022,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Adventure" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1764/126627l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1764/126627l.jpg" }
        }
      },
      {
        mal_id: 20583,
        title: "Haikyuu!!",
        title_english: "Haikyu!!",
        score: 8.44,
        episodes: 25,
        year: 2014,
        status: "Finished Airing",
        genres: [{ name: "Sports" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/11/82310l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/11/82310l.jpg" }
        }
      },
      {
        mal_id: 37521,
        title: "Vinland Saga Season 2",
        title_english: "Vinland Saga Season 2",
        score: 8.81,
        episodes: 24,
        year: 2023,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Adventure" }, { name: "Drama" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1170/124312l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1170/124312l.jpg" }
        }
      }
    ],
    recentlyAdded: [
      {
        mal_id: 52701,
        title: "Dungeon Meshi",
        title_english: "Delicious in Dungeon",
        score: 8.58,
        episodes: 24,
        year: 2024,
        status: "Finished Airing",
        genres: [{ name: "Adventure" }, { name: "Comedy" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1561/140811l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1561/140811l.jpg" }
        }
      },
      {
        mal_id: 31964,
        title: "Boku no Hero Academia",
        title_english: "My Hero Academia",
        score: 7.87,
        episodes: 13,
        year: 2016,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Sci-Fi" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/10/78745l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/10/78745l.jpg" }
        }
      },
      {
        mal_id: 30276,
        title: "One Punch Man",
        title_english: "One Punch Man",
        score: 8.50,
        episodes: 12,
        year: 2015,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Comedy" }, { name: "Sci-Fi" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/12/76049l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/12/76049l.jpg" }
        }
      },
      {
        mal_id: 38691,
        title: "Dr. Stone",
        title_english: "Dr. Stone",
        score: 8.27,
        episodes: 24,
        year: 2019,
        status: "Finished Airing",
        genres: [{ name: "Adventure" }, { name: "Comedy" }, { name: "Sci-Fi" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1279/134440l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1279/134440l.jpg" }
        }
      },
      {
        mal_id: 32182,
        title: "Mob Psycho 100",
        title_english: "Mob Psycho 100",
        score: 8.49,
        episodes: 12,
        year: 2016,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Comedy" }, { name: "Supernatural" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1228/125011l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1228/125011l.jpg" }
        }
      },
      {
        mal_id: 34572,
        title: "Black Clover",
        title_english: "Black Clover",
        score: 7.96,
        episodes: 170,
        year: 2017,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Comedy" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/2/88336l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/2/88336l.jpg" }
        }
      }
    ],
    newEpisodes: [
      {
        mal_id: 21,
        title: "One Piece",
        title_english: "One Piece",
        score: 8.73,
        episodes: 1100,
        year: 1999,
        status: "Currently Airing",
        genres: [{ name: "Action" }, { name: "Adventure" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1244/138851l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1244/138851l.jpg" }
        }
      },
      {
        mal_id: 52588,
        title: "Kaijuu 8-gou",
        title_english: "Kaiju No. 8",
        score: 8.16,
        episodes: 12,
        year: 2024,
        status: "Currently Airing",
        genres: [{ name: "Action" }, { name: "Sci-Fi" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1565/142277l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1565/142277l.jpg" }
        }
      },
      {
        mal_id: 52299,
        title: "Solo Leveling",
        title_english: "Solo Leveling",
        score: 8.28,
        episodes: 12,
        year: 2024,
        status: "Currently Airing",
        genres: [{ name: "Action" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1429/140237l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1429/140237l.jpg" }
        }
      },
      {
        mal_id: 52991,
        title: "Sousou no Frieren",
        title_english: "Frieren: Beyond Journey's End",
        score: 9.14,
        episodes: 28,
        year: 2023,
        status: "Finished Airing",
        genres: [{ name: "Adventure" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1015/138006l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg" }
        }
      },
      {
        mal_id: 40748,
        title: "Jujutsu Kaisen Season 2",
        title_english: "Jujutsu Kaisen Season 2",
        score: 8.79,
        episodes: 23,
        year: 2023,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1792/138022l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1792/138022l.jpg" }
        }
      },
      {
        mal_id: 38000,
        title: "Demon Slayer: Kimetsu no Yaiba",
        title_english: "Demon Slayer: Kimetsu no Yaiba",
        score: 8.49,
        episodes: 26,
        year: 2019,
        status: "Finished Airing",
        genres: [{ name: "Action" }, { name: "Fantasy" }],
        images: {
          webp: { large_image_url: "https://cdn.myanimelist.net/images/anime/1286/99889l.webp" },
          jpg: { large_image_url: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg" }
        }
      }
    ]
  };

  // ========================================================================
  // 2. ASYNC FETCH QUEUE WITH 400MS DELAY & RETRY ON 429
  // ========================================================================
  let requestQueue = [];
  let isQueueProcessing = false;

  function scheduleThrottledFetch(url, retries = 2) {
    return new Promise((resolve, reject) => {
      requestQueue.push({ url, retries, resolve, reject });
      triggerQueue();
    });
  }

  async function triggerQueue() {
    if (isQueueProcessing || requestQueue.length === 0) return;
    isQueueProcessing = true;

    const task = requestQueue.shift();

    try {
      const response = await fetch(task.url);

      if (response.status === 429) {
        console.warn(`[JikanAPI] 429 Rate limited on ${task.url}. Backing off...`);
        if (task.retries > 0) {
          await new Promise(r => setTimeout(r, 1500)); // 1.5s backoff
          requestQueue.unshift({ ...task, retries: task.retries - 1 });
        } else {
          task.reject(new Error('Rate limit exceeded (HTTP 429)'));
        }
      } else if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      } else {
        const payload = await response.json();
        // Check if payload contains Jikan status error (e.g. MAL 504)
        if (payload && payload.status && payload.status >= 400) {
          if (payload.status === 429 && task.retries > 0) {
            await new Promise(r => setTimeout(r, 1500));
            requestQueue.unshift({ ...task, retries: task.retries - 1 });
            return;
          }
          throw new Error(payload.message || `Jikan status ${payload.status}`);
        }
        task.resolve(payload);
      }
    } catch (err) {
      if (task.retries > 0) {
        await new Promise(r => setTimeout(r, 1000));
        requestQueue.unshift({ ...task, retries: task.retries - 1 });
      } else {
        task.reject(err);
      }
    } finally {
      setTimeout(() => {
        isQueueProcessing = false;
        triggerQueue();
      }, REQUEST_INTERVAL_MS);
    }
  }

  // ========================================================================
  // 3. LOCALSTORAGE 24-HOUR CACHING LAYER
  // ========================================================================
  async function fetchWith24hCache(endpoint) {
    const storageKey = CACHE_PREFIX + endpoint;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.data) {
          return parsed.data;
        }
      }
    } catch (e) {
      // LocalStorage access issue, continue to network
    }

    const url = `${BASE_URL}${endpoint}`;
    const result = await scheduleThrottledFetch(url);

    try {
      localStorage.setItem(storageKey, JSON.stringify({
        timestamp: Date.now(),
        data: result
      }));
    } catch (e) {
      // Storage might be full, safe to ignore
    }

    return result;
  }

  // ========================================================================
  // 4. DATA EXTRACTION & SFW FILTER
  // ========================================================================
  function isSafeForWork(item) {
    if (!item) return false;
    const rating = item.rating || '';
    if (rating.includes('Rx') || rating.includes('Hentai') || rating.includes('R+ - Mild Nudity')) {
      return false;
    }
    const explicitGenres = ['Hentai', 'Erotica', 'Ecchi'];
    if (item.genres && item.genres.some(g => explicitGenres.includes(g.name))) {
      return false;
    }
    return true;
  }

  function normalizeAnime(item) {
    if (!item) return null;

    // Use Jikan v4 paths as specified
    const poster = item.images?.webp?.large_image_url
      || item.images?.jpg?.large_image_url
      || item.images?.jpg?.image_url
      || item.poster
      || 'assets/images/placeholder.jpg';

    const banner = item.trailer?.images?.maximum_image_url
      || item.trailer?.images?.large_image_url
      || poster;

    const title = item.title_english || item.title || 'Untitled Anime';
    const japaneseTitle = item.title_japanese || item.title || '';

    const score = typeof item.score === 'number' && item.score > 0
      ? item.score
      : (typeof item.rating === 'number' ? item.rating : 8.5);

    const genres = (item.genres && item.genres.length > 0)
      ? item.genres.map(g => (typeof g === 'string' ? g : g.name))
      : ['Anime'];

    let year = item.year;
    if (!year && item.aired?.prop?.from?.year) {
      year = item.aired.prop.from.year;
    }
    if (!year) year = 2024;

    return {
      id: String(item.mal_id || item.id),
      mal_id: item.mal_id || item.id,
      title: title,
      japaneseTitle: japaneseTitle,
      synopsis: item.synopsis || 'No synopsis provided.',
      poster: poster,
      banner: banner,
      rating: score,
      score: score,
      ratingCount: item.scored_by || item.members || 25000,
      year: year,
      episodesCount: item.episodes || 12,
      genres: genres,
      studio: item.studios?.[0]?.name || item.studio || 'Studio',
      status: item.status || 'Finished Airing',
      language: 'Sub | Dub',
      type: item.type || 'TV',
      images: item.images,
      title_english: item.title_english,
      raw: item
    };
  }

  // ========================================================================
  // 5. PUBLIC API METHODS
  // ========================================================================
  return {
    /**
     * Get Trending Anime (/top/anime?filter=airing) with 24h cache & mock fallback
     */
    async getTrendingAnime() {
      try {
        const res = await fetchWith24hCache('/top/anime?filter=airing');
        const items = (res.data || []).filter(isSafeForWork).map(normalizeAnime);
        return items.length > 0 ? items : MOCK_DATASET.trending.map(normalizeAnime);
      } catch (err) {
        console.warn('[JikanAPI] getTrendingAnime failed, using static mock data:', err.message);
        return MOCK_DATASET.trending.map(normalizeAnime);
      }
    },

    /**
     * Get Popular Anime (/top/anime?filter=bypopularity) with 24h cache & mock fallback
     */
    async getPopularAnime() {
      try {
        const res = await fetchWith24hCache('/top/anime?filter=bypopularity');
        const items = (res.data || []).filter(isSafeForWork).map(normalizeAnime);
        return items.length > 0 ? items : MOCK_DATASET.popular.map(normalizeAnime);
      } catch (err) {
        console.warn('[JikanAPI] getPopularAnime failed, using static mock data:', err.message);
        return MOCK_DATASET.popular.map(normalizeAnime);
      }
    },

    /**
     * Get Top Rated Anime (/top/anime) with 24h cache & mock fallback
     */
    async getTopAnime() {
      try {
        const res = await fetchWith24hCache('/top/anime');
        const items = (res.data || []).filter(isSafeForWork).map(normalizeAnime);
        return items.length > 0 ? items : MOCK_DATASET.topRated.map(normalizeAnime);
      } catch (err) {
        console.warn('[JikanAPI] getTopAnime failed, using static mock data:', err.message);
        return MOCK_DATASET.topRated.map(normalizeAnime);
      }
    },

    /**
     * Get Recently Added / Season Anime (/seasons/now) with 24h cache & mock fallback
     */
    async getRecentlyAdded() {
      try {
        const res = await fetchWith24hCache('/seasons/now');
        const items = (res.data || []).filter(isSafeForWork).map(normalizeAnime);
        return items.length > 0 ? items : MOCK_DATASET.recentlyAdded.map(normalizeAnime);
      } catch (err) {
        console.warn('[JikanAPI] getRecentlyAdded failed, using static mock data:', err.message);
        return MOCK_DATASET.recentlyAdded.map(normalizeAnime);
      }
    },

    /**
     * Get New Episodes / Airing Anime with 24h cache & mock fallback
     */
    async getNewEpisodes() {
      try {
        const res = await fetchWith24hCache('/top/anime?filter=airing&page=2');
        const items = (res.data || []).filter(isSafeForWork).map(normalizeAnime);
        return items.length > 0 ? items : MOCK_DATASET.newEpisodes.map(normalizeAnime);
      } catch (err) {
        console.warn('[JikanAPI] getNewEpisodes failed, using static mock data:', err.message);
        return MOCK_DATASET.newEpisodes.map(normalizeAnime);
      }
    },

    /**
     * Search Anime (/anime?q=QUERY&sfw=true)
     */
    async searchAnime(query) {
      if (!query || !query.trim()) return [];
      try {
        const clean = encodeURIComponent(query.trim());
        const res = await fetchWith24hCache(`/anime?q=${clean}&sfw=true&order_by=popularity&sort=asc`);
        const items = (res.data || []).filter(isSafeForWork).map(normalizeAnime);
        if (items.length > 0) return items;
      } catch (err) {
        console.warn(`[JikanAPI] searchAnime("${query}") failed, searching static mock:`, err.message);
      }

      // Fallback search across all mock categories
      const allMocks = [
        ...MOCK_DATASET.trending,
        ...MOCK_DATASET.popular,
        ...MOCK_DATASET.topRated,
        ...MOCK_DATASET.recentlyAdded
      ];
      const q = query.toLowerCase();
      return allMocks
        .filter(a => a.title.toLowerCase().includes(q) || (a.title_english && a.title_english.toLowerCase().includes(q)))
        .map(normalizeAnime);
    },

    /**
     * Get Anime Details by ID (/anime/{id}/full)
     */
    async getAnimeById(id) {
      try {
        const cleanId = String(id).trim();
        const res = await fetchWith24hCache(`/anime/${cleanId}/full`);
        if (res.data && isSafeForWork(res.data)) {
          return normalizeAnime(res.data);
        }
      } catch (err) {
        console.warn(`[JikanAPI] getAnimeById(${id}) failed, checking mock:`, err.message);
      }

      // Check mock dataset
      const allMocks = [
        ...MOCK_DATASET.trending,
        ...MOCK_DATASET.popular,
        ...MOCK_DATASET.topRated
      ];
      const match = allMocks.find(a => String(a.mal_id) === String(id));
      return match ? normalizeAnime(match) : null;
    },

    /**
     * Get Anime Episodes by ID (/anime/{id}/episodes)
     */
    async getAnimeEpisodes(id, posterFallback = '') {
      try {
        const cleanId = String(id).trim();
        const res = await fetchWith24hCache(`/anime/${cleanId}/episodes`);
        const list = res.data || [];
        if (list.length > 0) {
          return list.map(ep => ({
            id: `ep${ep.mal_id}`,
            number: ep.mal_id,
            title: ep.title || ep.title_romanji || `Episode ${ep.mal_id}`,
            duration: ep.duration || '24m',
            airDate: ep.aired ? new Date(ep.aired).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Broadcast',
            summary: ep.synopsis || `Episode ${ep.mal_id}. Stream in full HD on AniWaveX.`,
            thumbnail: posterFallback
          }));
        }
      } catch (err) {
        console.warn(`[JikanAPI] getAnimeEpisodes(${id}) failed:`, err.message);
      }

      // Fallback sample episodes
      return [1, 2, 3, 4, 5, 6].map(num => ({
        id: `ep${num}`,
        number: num,
        title: `Episode ${num}`,
        duration: '24m',
        airDate: 'Broadcast',
        summary: `Episode ${num}. Stream in full HD on AniWaveX.`,
        thumbnail: posterFallback
      }));
    },

    normalizeAnime,
    MOCK_DATASET
  };
})();

// Attach to window
window.JikanAPI = JikanAPI;

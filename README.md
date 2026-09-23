# AniWaveX - Modern Anime Streaming Frontend

AniWaveX is a high-fidelity, educational anime streaming web application inspired by the layout, user experience, content organization, and design of modern streaming platforms like Crunchyroll.

AniWaveX features a completely original brand identity, sleek dark obsidian aesthetics with energetic orange accents, 32 mainstream family-friendly anime titles, dynamic hero carousels, instant search autocomplete, multi-criteria filtering and sorting, dynamic anime detail guides, simulated localStorage authentication, watchlist persistence, and a custom HTML5 video player with interactive controls.

---

## Technology Stack

- **HTML5**: Semantic tags, accessible structure, responsive viewport.
- **CSS3**: CSS Custom Properties (variables), Flexbox, CSS Grid, Glassmorphism, smooth cubic-bezier transitions, custom scrollbars, and mobile-friendly media queries.
- **Vanilla JavaScript (ES6+)**: Zero external frameworks, zero Node.js dependencies, pure client-side data querying and DOM manipulation.
- **Client-Side Persistence**: `localStorage` for user accounts, watchlist bookmarks, likes, and playback progress tracking.

---

## Project Structure

```text
CrunchyRool_Clone/
│
├── index.html            # Homepage with Hero Carousel, Continue Watching & Shelf Sliders
├── browse.html           # Catalog discovery with search, multi-filter & responsive grid
├── details.html          # Detailed anime profile, characters, episode list & recommendations
├── watch.html            # Custom HTML5 streaming player with playback controls & queue
├── login.html            # Simulated login with instant demo access
├── signup.html           # Account registration with real-time password strength meter
├── README.md             # Project documentation and quick start guide
│
├── css/
│   ├── style.css         # Global design system, variables, navbar, footer, cards & toasts
│   ├── browse.css        # Filter toolbar, grid styling, load more & empty states
│   ├── details.css       # Banner backdrop, synopsis, episode cards & cast grid
│   ├── watch.css         # Custom video player layout, controls bar & Up Next sidebar
│   └── auth.css          # Glassmorphic auth cards, inputs & strength meter
│
├── js/
│   ├── data.js           # 32 mainstream family-friendly anime dataset & vector artwork
│   ├── main.js           # Global state, search autocomplete, watchlist, navbar & toasts
│   ├── browse.js         # Multi-parameter filter engine, sort algorithms & pagination
│   ├── details.js        # Dynamic URL query loader, episode selector & cast renderer
│   ├── watch.js          # Custom video player controller, hotkeys & history tracking
│   └── auth.js           # Client-side validation, password strength meter & auth logic
│
└── assets/
    ├── icons/            # Original brand logo and vector icons
    ├── images/           # Generated anime posters and artwork
    └── banners/          # Cinematic wide hero banners
```

---

## Key Features

1. **Original Visual Identity**:
   - Distinct brand mark **AniWaveX**
   - Obsidian base (`#0a0b0e`), slate panels (`#121319`), and vibrant orange accents (`#ff640a`)
   - High-contrast, clean typography and smooth micro-interactions

2. **32 Family-Friendly Anime Dataset**:
   - Mainstream titles: *Frieren: Beyond Journey's End, Solo Leveling, Demon Slayer, Jujutsu Kaisen, One Piece, Attack on Titan, Spy x Family, My Hero Academia, Naruto Shippuden, Dragon Ball Z, Haikyuu!!, Blue Lock, Dr. Stone, Death Note, Fullmetal Alchemist: Brotherhood, Vinland Saga, and more.*
   - Vector-generated SVG posters and banners ensuring 100% link reliability, zero copyright infringement, and retina-crisp rendering.

3. **Homepage**:
   - Full-width hero carousel with 5 featured anime, 6-second auto-cycle, pause on hover, next/previous buttons, and dot indicators.
   - Dynamic "Continue Watching" shelf that surfaces in-progress episodes automatically.
   - Horizontal carousels with smooth left/right arrow scrolling:
     - *Trending Now*
     - *Popular This Week*
     - *Recently Added*
     - *Top Rated Masterpieces*
     - *New Episodes This Season*
     - *Recommended For You*
   - Cards with hover scale, rating pill, audio badge, and quick watchlist bookmarking.

4. **Browse & Discovery**:
   - Live search input + filters: Genre, Release Year, Minimum Rating, Status, Audio, and Format.
   - Multi-option sorting: Most Popular, Highest Rated, Recently Added, A-Z, Z-A.
   - Dynamic counter ("Showing X of Y anime") and "Load More" pagination.
   - Watchlist shortcut (`?watchlist=true`) to view bookmarked titles.

5. **Anime Details Page**:
   - Deep cinematic banner backdrop with gradient fade.
   - Poster, synopsis, rating, studio, audio format, and genre pills.
   - Episode guide with episode numbers, titles, durations, and summaries.
   - Character and voice actor cast cards.
   - Dynamic "You Might Also Like" recommendation shelf based on genres.

6. **Custom HTML5 Video Player**:
   - Play/Pause toggle (center button and bottom bar).
   - Seekbar with buffered progress, filled progress, and click-to-seek.
   - Volume slider with mute toggle and volume icon state changes.
   - Time display (`MM:SS / MM:SS`).
   - Playback speed selector (`0.5x`, `0.75x`, `1x`, `1.25x`, `1.5x`, `2x`).
   - Fullscreen and Theater mode toggles.
   - Auto-hiding control bar after 3 seconds of inactivity.
   - Keyboard shortcuts:
     - `Space` / `K`: Play / Pause
     - `Left` / `Right`: Seek -/+ 5 seconds
     - `Up` / `Down`: Volume -/+ 10%
     - `M`: Mute / Unmute
     - `F`: Fullscreen toggle
   - Side panel with "Up Next" card and complete interactive episode queue.

7. **Simulated Authentication**:
   - Login page with instant 1-click **Instant Demo Login** for reviewers.
   - Registration page with live visual **Password Strength Meter** (Weak, Fair, Good, Strong).
   - Validation for email formats, passwords, and matching confirmation.
   - Persisted session state in `localStorage` that updates the top navbar in real time.

---

## How to Run Locally in VS Code

### Option 1: Using VS Code "Live Server" Extension (Recommended)

1. Open **Visual Studio Code**.
2. Go to **File -> Open Folder...** and select the folder:
   ```text
   CrunchyRool_Clone
   ```
3. Install the **Live Server** extension (by *Ritwick Dey*) from the Extensions panel (`Ctrl+Shift+X` or `Cmd+Shift+X`).
4. Right-click on `index.html` in the file explorer and click **"Open with Live Server"** (or click **"Go Live"** in the bottom-right status bar).
5. Your browser will automatically open:
   ```text
   http://127.0.0.1:5500/index.html
   ```

### Option 2: Using Any Built-in Local HTTP Server

You can also run any standard local server from the project directory:

**Using Python:**
```bash
python -m http.server 8000
```
Then visit: `http://localhost:8000`

**Using Node.js (`npx serve`):**
```bash
npx serve .
```

**Direct Browser Opening:**
You can double-click `index.html` directly in File Explorer to launch it in any modern web browser.

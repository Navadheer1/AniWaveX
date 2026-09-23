/**
 * AniWaveX - Anime Dataset
 * Comprehensive dataset of 32 family-friendly mainstream anime titles.
 * Each entry includes rich metadata, episodes, characters, and vector visual artwork.
 */

// Helper to generate premium anime artwork SVG data URLs
function generateAnimeArt(primaryColor, secondaryColor, accentColor, title, japaneseTitle, genre, iconType) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="60%" stop-color="${secondaryColor}"/>
        <stop offset="100%" stop-color="#08090c"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="35%" r="60%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.6"/>
        <stop offset="60%" stop-color="${accentColor}" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <filter id="blurFilter">
        <feGaussianBlur stdDeviation="25" />
      </filter>
    </defs>
    <!-- Background -->
    <rect width="600" height="900" fill="url(#bgGrad)"/>
    <!-- Glow Effect -->
    <circle cx="300" cy="360" r="260" fill="url(#glow)"/>
    
    <!-- Geometric Anime Style Motifs -->
    <g opacity="0.15">
      <circle cx="300" cy="400" r="220" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="8 6"/>
      <circle cx="300" cy="400" r="180" fill="none" stroke="${accentColor}" stroke-width="3"/>
      <polygon points="300,200 450,460 150,460" fill="none" stroke="#ffffff" stroke-width="1.5"/>
      <polygon points="300,600 150,340 450,340" fill="none" stroke="${accentColor}" stroke-width="1"/>
      <line x1="100" y1="100" x2="500" y2="700" stroke="#ffffff" stroke-width="0.5"/>
      <line x1="500" y1="100" x2="100" y2="700" stroke="#ffffff" stroke-width="0.5"/>
    </g>

    <!-- Japanese Kanji Backdrop -->
    <text x="300" y="380" font-family="'Noto Sans JP', 'Segoe UI', sans-serif" font-weight="900" font-size="110" fill="#ffffff" fill-opacity="0.07" text-anchor="middle" letter-spacing="15">${japaneseTitle}</text>
    
    <!-- Central Sigil / Icon Motif -->
    <g transform="translate(300, 360)">
      <circle cx="0" cy="0" r="90" fill="${primaryColor}" fill-opacity="0.4" stroke="${accentColor}" stroke-width="3"/>
      <circle cx="0" cy="0" r="75" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1"/>
      <!-- Dynamic Icon Shapes based on iconType -->
      ${iconType === 'blade' ? `
        <path d="M-5,-60 L5,-60 L8,30 L0,50 L-8,30 Z" fill="${accentColor}"/>
        <path d="M-25,10 L25,10 L20,18 L-20,18 Z" fill="#ffffff"/>
        <circle cx="0" cy="45" r="7" fill="#ffffff"/>
      ` : iconType === 'energy' ? `
        <polygon points="0,-50 15,-10 45,-5 20,20 28,55 0,35 -28,55 -20,20 -45,-5 -15,-10" fill="${accentColor}"/>
        <circle cx="0" cy="8" r="14" fill="#ffffff"/>
      ` : iconType === 'shield' ? `
        <path d="M0,-45 Q40,-45 40,0 Q40,45 0,60 Q-40,45 -40,0 Q-40,-45 0,-45 Z" fill="none" stroke="${accentColor}" stroke-width="5"/>
        <path d="M0,-30 Q25,-30 25,0 Q25,30 0,42 Q-25,30 -25,0 Q-25,-30 0,-30 Z" fill="${accentColor}" fill-opacity="0.5"/>
      ` : iconType === 'magic' ? `
        <polygon points="0,-45 40,0 0,45 -40,0" fill="none" stroke="${accentColor}" stroke-width="4"/>
        <circle cx="0" cy="0" r="20" fill="${accentColor}" fill-opacity="0.6"/>
        <line x1="0" y1="-55" x2="0" y2="55" stroke="#ffffff" stroke-width="2"/>
        <line x1="-55" y1="0" x2="55" y2="0" stroke="#ffffff" stroke-width="2"/>
      ` : `
        <circle cx="0" cy="0" r="40" fill="none" stroke="${accentColor}" stroke-width="5"/>
        <polygon points="-12,-20 25,0 -12,20" fill="${accentColor}"/>
      `}
    </g>

    <!-- Genre Badge -->
    <rect x="220" y="520" width="160" height="32" rx="16" fill="${accentColor}" fill-opacity="0.2" stroke="${accentColor}" stroke-width="1.5"/>
    <text x="300" y="541" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="14" fill="#ffffff" text-anchor="middle" letter-spacing="3">${genre.toUpperCase()}</text>

    <!-- Bottom Dark Gradient for Text Contrast -->
    <rect x="0" y="600" width="600" height="300" fill="url(#bottomFade)"/>
    <defs>
      <linearGradient id="bottomFade" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="40%" stop-color="#090a0d" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#050608" stop-opacity="0.98"/>
      </linearGradient>
    </defs>

    <!-- Series Titles -->
    <text x="300" y="700" font-family="'Noto Sans JP', 'Segoe UI', sans-serif" font-weight="700" font-size="20" fill="${accentColor}" text-anchor="middle" letter-spacing="4">${japaneseTitle}</text>
    <text x="300" y="760" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="34" fill="#ffffff" text-anchor="middle">${title.length > 22 ? title.substring(0, 20) + '...' : title}</text>

    <!-- AniWaveX Watermark / Brand Accent -->
    <rect x="50" y="810" width="500" height="1" fill="#ffffff" fill-opacity="0.15"/>
    <text x="300" y="845" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="12" fill="#8890a0" text-anchor="middle" letter-spacing="5">ANIWAVEX ORIGINAL STREAM</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function generateBannerArt(primaryColor, secondaryColor, accentColor, title, japaneseTitle, iconType) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 800" width="100%" height="100%">
    <defs>
      <linearGradient id="bannerBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="40%" stop-color="${secondaryColor}"/>
        <stop offset="100%" stop-color="#060709"/>
      </linearGradient>
      <linearGradient id="darkFadeLeft" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#08090c" stop-opacity="0.95"/>
        <stop offset="50%" stop-color="#08090c" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#08090c" stop-opacity="0.1"/>
      </linearGradient>
      <linearGradient id="darkFadeBottom" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#08090c" stop-opacity="0"/>
        <stop offset="100%" stop-color="#08090c" stop-opacity="1"/>
      </linearGradient>
      <radialGradient id="bannerGlow" cx="75%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1920" height="800" fill="url(#bannerBg)"/>
    <circle cx="1400" cy="350" r="450" fill="url(#bannerGlow)"/>

    <!-- Ambient Graphics on Right -->
    <g transform="translate(1380, 360)" opacity="0.25">
      <circle cx="0" cy="0" r="280" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="12 10"/>
      <circle cx="0" cy="0" r="200" fill="none" stroke="${accentColor}" stroke-width="4"/>
      <polygon points="0,-180 160,110 -160,110" fill="none" stroke="#ffffff" stroke-width="2"/>
      <text x="0" y="30" font-family="'Noto Sans JP', sans-serif" font-weight="900" font-size="140" fill="#ffffff" fill-opacity="0.2" text-anchor="middle">${japaneseTitle}</text>
    </g>

    <!-- Fades -->
    <rect width="1920" height="800" fill="url(#darkFadeLeft)"/>
    <rect width="1920" height="800" fill="url(#darkFadeBottom)"/>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function generateEpisodeThumb(primaryColor, accentColor, epNum, title) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" width="100%" height="100%">
    <defs>
      <linearGradient id="thumbBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="100%" stop-color="#0a0b0e"/>
      </linearGradient>
    </defs>
    <rect width="400" height="225" fill="url(#thumbBg)"/>
    <circle cx="200" cy="100" r="60" fill="${accentColor}" fill-opacity="0.25"/>
    <circle cx="200" cy="100" r="28" fill="#ffffff" fill-opacity="0.9"/>
    <polygon points="194,88 212,100 194,112" fill="#0b0c0f"/>
    <!-- Episode Badge -->
    <rect x="15" y="15" width="60" height="24" rx="4" fill="#000000" fill-opacity="0.75"/>
    <text x="45" y="31" font-family="'Segoe UI', sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">EP ${epNum}</text>
    <!-- Title gradient strip -->
    <rect x="0" y="165" width="400" height="60" fill="#000000" fill-opacity="0.8"/>
    <text x="20" y="195" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="14" fill="#ffffff">${title.length > 36 ? title.substring(0, 33) + '...' : title}</text>
    <text x="20" y="212" font-family="'Segoe UI', sans-serif" font-weight="400" font-size="11" fill="#ff7a29">AniWaveX HD Stream</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function generateAvatar(name, color) {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%">
    <rect width="120" height="120" rx="60" fill="${color}"/>
    <text x="60" y="70" font-family="'Segoe UI', sans-serif" font-weight="800" font-size="40" fill="#ffffff" text-anchor="middle">${initials}</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// 32 Curated Mainstream, Family-Friendly Titles
const ANIME_DATABASE = [
  {
    id: "frieren-beyond-journeys-end",
    title: "Frieren: Beyond Journey's End",
    japaneseTitle: "葬送のフリーレン",
    synopsis: "After an epic ten-year quest, the heroic mage Frieren and her party defeated the Demon King, bringing peace to the realm. As an elf with an immense lifespan, Frieren watches her human companions age and pass away. Driven by regret over not truly understanding her former allies, she embarks on a contemplative new odyssey across the continent.",
    rating: 4.95,
    ratingCount: 142000,
    year: 2023,
    episodesCount: 28,
    genres: ["Fantasy", "Adventure", "Drama", "Shonen"],
    studio: "Madhouse",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: true,
    trending: true,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#1b2f33", secondary: "#0d1a1c", accent: "#2ee6a8" },
    iconType: "magic",
    characters: [
      { name: "Frieren", role: "Protagonist / Mage", voice: "Atsumi Tanezaki", avatar: generateAvatar("Frieren", "#2ee6a8") },
      { name: "Fern", role: "Apprentice Mage", voice: "Kana Ichinose", avatar: generateAvatar("Fern", "#6c5ce7") },
      { name: "Stark", role: "Warrior", voice: "Chiaki Kobayashi", avatar: generateAvatar("Stark", "#e17055") },
      { name: "Himmel", role: "Hero of Legend", voice: "Nobuhiko Okamoto", avatar: generateAvatar("Himmel", "#74b9ff") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "The Journey's End", duration: "24m", summary: "The hero's party returns victorious after a decade-long crusade against the Demon King." },
      { id: "ep2", number: 2, title: "It Didn't Have to Be Magic...", duration: "24m", summary: "Frieren accepts Fern as her student and teaches her patience and spell mastery." },
      { id: "ep3", number: 3, title: "Killing Magic", duration: "23m", summary: "Frieren unseals an ancient demon specializing in devastating soul-piercing sorcery." },
      { id: "ep4", number: 4, title: "The Land Where Souls Rest", duration: "24m", summary: "Frieren and Fern begin their long journey north toward Aureole, where souls reside." },
      { id: "ep5", number: 5, title: "Phantoms of the Dead", duration: "24m", summary: "The duo encounters mysterious illusions conjured by a phantom beast in the mountain pass." },
      { id: "ep6", number: 6, title: "The Hero of the Village", duration: "24m", summary: "Frieren recruits Stark, a cowardly yet immensely powerful young warrior." }
    ]
  },
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    japaneseTitle: "俺だけレベルアップな件",
    synopsis: "In a world where mysterious gates connect modern Earth to dungeons crawling with monstrous beasts, awakened humans known as Hunters risk their lives for glory and wealth. Sung Jinwoo, notoriously mocked as the 'Weakest Hunter of All Mankind', is fatally wounded inside a deadly double dungeon—only to wake up as the sole player chosen by an enigmatic System.",
    rating: 4.88,
    ratingCount: 189000,
    year: 2024,
    episodesCount: 12,
    genres: ["Action", "Fantasy", "Adventure", "Supernatural"],
    studio: "A-1 Pictures",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: true,
    trending: true,
    popular: true,
    topRated: true,
    recentlyAdded: true,
    newEpisodes: true,
    colors: { primary: "#191136", secondary: "#0d091e", accent: "#9d4edd" },
    iconType: "blade",
    characters: [
      { name: "Sung Jinwoo", role: "Shadow Monarch", voice: "Taito Ban", avatar: generateAvatar("Sung Jinwoo", "#9d4edd") },
      { name: "Cha Hae-In", role: "S-Rank Hunter", voice: "Reina Ueda", avatar: generateAvatar("Cha Hae In", "#f72585") },
      { name: "Go Gunhee", role: "Hunters Assoc Chairman", voice: "Banjou Ginga", avatar: generateAvatar("Go Gunhee", "#4cc9f0") },
      { name: "Yoo Jinho", role: "Raid Partner", voice: "Genta Nakamura", avatar: generateAvatar("Yoo Jinho", "#fca311") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "I'm Used to It", duration: "24m", summary: "Jinwoo barely survives another routine E-rank gate raid with severe injuries." },
      { id: "ep2", number: 2, title: "If I Had One More Chance", duration: "24m", summary: "Trapped inside the Cartenon Temple, the hunters face the terrifying stone statues." },
      { id: "ep3", number: 3, title: "It's Like a Game", duration: "23m", summary: "Jinwoo wakes up in a hospital and realizes a floating gaming interface controls his stats." },
      { id: "ep4", number: 4, title: "I've Gotta Get Stronger", duration: "24m", summary: "Venturing into an instant subway dungeon alone, Jinwoo tests his new strength." },
      { id: "ep5", number: 5, title: "A Pretty Good Deal", duration: "24m", summary: "Jinwoo teams up with a shady strike squad led by Hwang Dongsuk." },
      { id: "ep6", number: 6, title: "The Real Hunt Begins", duration: "24m", summary: "Betrayed inside a dungeon boss chamber, Jinwoo awakens his cold survival instinct." }
    ]
  },
  {
    id: "demon-slayer-kimetsu-no-yaiba",
    title: "Demon Slayer: Kimetsu no Yaiba",
    japaneseTitle: "鬼滅の刃",
    synopsis: "Tanjiro Kamado's peaceful life is shattered when demons slaughter his entire family, leaving only his sister Nezuko, who has been turned into a demon. Determined to find a cure and avenge his loved ones, Tanjiro joins the Demon Slayer Corps, mastering the breath of water and uncovering the ancient secret of the Sun Breathing technique.",
    rating: 4.92,
    ratingCount: 320000,
    year: 2024,
    episodesCount: 63,
    genres: ["Action", "Fantasy", "Historical", "Shonen"],
    studio: "ufotable",
    status: "Ongoing",
    language: "Sub | Dub",
    type: "TV Series",
    featured: true,
    trending: true,
    popular: true,
    topRated: true,
    recentlyAdded: true,
    newEpisodes: true,
    colors: { primary: "#0b2b26", secondary: "#051613", accent: "#25a18e" },
    iconType: "blade",
    characters: [
      { name: "Tanjiro Kamado", role: "Demon Slayer", voice: "Natsuki Hanae", avatar: generateAvatar("Tanjiro Kamado", "#25a18e") },
      { name: "Nezuko Kamado", role: "Demon Sister", voice: "Akari Kito", avatar: generateAvatar("Nezuko Kamado", "#f72585") },
      { name: "Zenitsu Agatsuma", role: "Thunder Breathing", voice: "Hiro Shimono", avatar: generateAvatar("Zenitsu Agatsuma", "#ffb703") },
      { name: "Inosuke Hashibira", role: "Beast Breathing", voice: "Yoshitsugu Matsuoka", avatar: generateAvatar("Inosuke Hashibira", "#219ebc") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Cruelty", duration: "24m", summary: "Tanjiro returns from town to discover tragedy and makes a promise to save his sister." },
      { id: "ep2", number: 2, title: "Trainer Sakonji Urokodaki", duration: "24m", summary: "Tanjiro and Nezuko travel to Mt. Sagiri to undergo grueling physical training." },
      { id: "ep3", number: 3, title: "Sabito and Makomo", duration: "23m", summary: "Mysterious masked children challenge Tanjiro to slice an enormous boulder in half." },
      { id: "ep4", number: 4, title: "Final Selection", duration: "24m", summary: "Tanjiro enters Mt. Fujikasane to survive seven days surrounded by captured demons." }
    ]
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    japaneseTitle: "呪術廻戦",
    synopsis: "Yuji Itadori is a high school student with astounding physical prowess. To save his friends from a deadly curse lurking within their school, he swallows a rotting talisman: the desiccated finger of Ryomen Sukuna, the undisputed King of Curses. Enrolling in the Tokyo Prefectural Jujutsu High School under Satoru Gojo, Yuji enters a harrowing war against malevolent spirits.",
    rating: 4.89,
    ratingCount: 295000,
    year: 2023,
    episodesCount: 47,
    genres: ["Action", "Supernatural", "Fantasy", "Shonen"],
    studio: "MAPPA",
    status: "Ongoing",
    language: "Sub | Dub",
    type: "TV Series",
    featured: true,
    trending: true,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#1c1228", secondary: "#0c0812", accent: "#ff4d6d" },
    iconType: "energy",
    characters: [
      { name: "Yuji Itadori", role: "Sukuna Vessel", voice: "Junya Enoki", avatar: generateAvatar("Yuji Itadori", "#ff4d6d") },
      { name: "Satoru Gojo", role: "Special Grade Sorcerer", voice: "Yuichi Nakamura", avatar: generateAvatar("Satoru Gojo", "#48cae4") },
      { name: "Megumi Fushiguro", role: "Ten Shadows Sorcerer", voice: "Yuma Uchida", avatar: generateAvatar("Megumi Fushiguro", "#2b2d42") },
      { name: "Nobara Kugisaki", role: "Straw Doll Sorcerer", voice: "Asami Seto", avatar: generateAvatar("Nobara Kugisaki", "#ffb703") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Ryomen Sukuna", duration: "24m", summary: "Yuji encounters Megumi searching for a dangerous special-grade cursed object." },
      { id: "ep2", number: 2, title: "For Myself", duration: "24m", summary: "Gojo assesses Yuji's ability to maintain control over Sukuna's chaotic soul." },
      { id: "ep3", number: 3, title: "Girl of Steel", duration: "24m", summary: "The first-year trio travels to Roppongi to exorcise a curse inside an abandoned building." },
      { id: "ep4", number: 4, title: "Curse Womb Must Die", duration: "24m", summary: "A special grade curse emerges at a detention center, threatening the students." }
    ]
  },
  {
    id: "one-piece",
    title: "One Piece",
    japaneseTitle: "ワンピース",
    synopsis: "Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become King of the Pirates. With a course charted for the treacherous waters of the Grand Line and beyond, Luffy and his loyal Straw Hat Pirates brave legendary warlords, tyrannical admirals, and the supreme mystery left behind by Gol D. Roger.",
    rating: 4.96,
    ratingCount: 540000,
    year: 2024,
    episodesCount: 1100,
    genres: ["Action", "Adventure", "Comedy", "Shonen", "Fantasy"],
    studio: "Toei Animation",
    status: "Ongoing",
    language: "Sub | Dub",
    type: "TV Series",
    featured: true,
    trending: true,
    popular: true,
    topRated: true,
    recentlyAdded: true,
    newEpisodes: true,
    colors: { primary: "#2c1a0e", secondary: "#130b06", accent: "#ff640a" },
    iconType: "blade",
    characters: [
      { name: "Monkey D. Luffy", role: "Captain", voice: "Mayumi Tanaka", avatar: generateAvatar("Monkey D Luffy", "#ff640a") },
      { name: "Roronoa Zoro", role: "Master Swordsman", voice: "Kazuya Nakai", avatar: generateAvatar("Roronoa Zoro", "#2a9d8f") },
      { name: "Nami", role: "Navigator", voice: "Akemi Okamura", avatar: generateAvatar("Nami", "#f4a261") },
      { name: "Sanji", role: "Chef", voice: "Hiroaki Hirata", avatar: generateAvatar("Sanji", "#e76f51") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "I'm Luffy! The Man Who Will Become the Pirate King!", duration: "24m", summary: "Luffy pops out of a barrel aboard a cruise ship under attack by Alvida's pirates." },
      { id: "ep2", number: 2, title: "Enter the Great Swordsman! Pirate Hunter Roronoa Zoro!", duration: "24m", summary: "Luffy and Koby arrive at Shells Town where the dreaded swordsman Zoro is held captive." },
      { id: "ep3", number: 3, title: "Morgan versus Luffy! Who's the Mysterious Pretty Girl?", duration: "24m", summary: "Captain Morgan faces off against Luffy and Zoro in the Marine base courtyard." }
    ]
  },
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    japaneseTitle: "進撃の巨人",
    synopsis: "For centuries, humanity has taken refuge inside three concentric walls to protect themselves from colossal man-eating Titans. When a 60-meter Colossal Titan breaches the outermost barrier, young Eren Jaeger witnesses the destruction of his hometown and swears a blood oath to eradicate every single Titan from the face of the earth.",
    rating: 4.93,
    ratingCount: 480000,
    year: 2023,
    episodesCount: 89,
    genres: ["Action", "Drama", "Mystery", "Fantasy"],
    studio: "MAPPA / Wit Studio",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: true,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#291d17", secondary: "#140e0b", accent: "#d4a373" },
    iconType: "blade",
    characters: [
      { name: "Eren Jaeger", role: "Survey Corps Soldier", voice: "Yuki Kaji", avatar: generateAvatar("Eren Jaeger", "#d4a373") },
      { name: "Mikasa Ackerman", role: "Elite Scout", voice: "Yui Ishikawa", avatar: generateAvatar("Mikasa Ackerman", "#e63946") },
      { name: "Armin Arlert", role: "Tactician", voice: "Marina Inoue", avatar: generateAvatar("Armin Arlert", "#f1faee") },
      { name: "Levi Ackerman", role: "Captain", voice: "Hiroshi Kamiya", avatar: generateAvatar("Levi Ackerman", "#457b9d") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "To You, in 2000 Years", duration: "24m", summary: "A century of peace comes to an apocalyptic end in the district of Shiganshina." },
      { id: "ep2", number: 2, title: "That Day", duration: "24m", summary: "Survivors flee toward Wall Rose while Eren vows to join the Scout Regiment." }
    ]
  },
  {
    id: "spy-x-family",
    title: "Spy x Family",
    japaneseTitle: "スパイファミリー",
    synopsis: "Master spy 'Twilight' is tasked with his most intricate mission yet: Operation Strix. To infiltrate an elite political circle, he creates the fake identity of psychiatrist Loid Forger and adopts an orphan girl named Anya—unaware she is a telepath! To complete the family unit, he marries Yor Briar, a soft-spoken clerk who secretly works as the deadly Thorn Princess assassin.",
    rating: 4.86,
    ratingCount: 220000,
    year: 2023,
    episodesCount: 37,
    genres: ["Comedy", "Action", "Slice of Life", "Shonen"],
    studio: "CloverWorks / Wit Studio",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: true,
    popular: true,
    topRated: false,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#152c24", secondary: "#0a1713", accent: "#52b788" },
    iconType: "shield",
    characters: [
      { name: "Loid Forger", role: "Agent Twilight", voice: "Takuya Eguchi", avatar: generateAvatar("Loid Forger", "#52b788") },
      { name: "Anya Forger", role: "Telepathic Daughter", voice: "Atsumi Tanezaki", avatar: generateAvatar("Anya Forger", "#ffafcc") },
      { name: "Yor Forger", role: "Thorn Princess", voice: "Saori Hayami", avatar: generateAvatar("Yor Forger", "#e63946") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Operation Strix", duration: "24m", summary: "Twilight must procure a child and enroll her in Eden Academy within seven days." },
      { id: "ep2", number: 2, title: "Secure a Wife", duration: "24m", summary: "Loid encounters Yor Briar at a tailor shop while seeking a suitable spouse." }
    ]
  },
  {
    id: "my-hero-academia",
    title: "My Hero Academia",
    japaneseTitle: "僕のヒーローアカデミア",
    synopsis: "In a civilization where 80 percent of people are born with superpowers called 'Quirks', Izuku Midoriya was born utterly ordinary. Despite this, he dreams of becoming the greatest hero. When he courageously rushes in to save a classmate, the world's champion, All Might, chooses Izuku to inherit his legendary power: One For All.",
    rating: 4.79,
    ratingCount: 340000,
    year: 2024,
    episodesCount: 150,
    genres: ["Action", "Superhero", "Shonen", "School"],
    studio: "Bones",
    status: "Ongoing",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: true,
    popular: true,
    topRated: false,
    recentlyAdded: true,
    newEpisodes: true,
    colors: { primary: "#112e20", secondary: "#081710", accent: "#00b4d8" },
    iconType: "energy",
    characters: [
      { name: "Izuku Midoriya", role: "Deku", voice: "Daiki Yamashita", avatar: generateAvatar("Izuku Midoriya", "#2dc653") },
      { name: "Katsuki Bakugo", role: "Dynamight", voice: "Nobuhiko Okamoto", avatar: generateAvatar("Katsuki Bakugo", "#f77f00") },
      { name: "Shoto Todoroki", role: "Half-Cold Half-Hot", voice: "Yuki Kaji", avatar: generateAvatar("Shoto Todoroki", "#00b4d8") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Izuku Midoriya: Origin", duration: "24m", summary: "A powerless boy refuses to give up his dream in a world filled with superhumans." }
    ]
  },
  {
    id: "naruto-shippuden",
    title: "Naruto Shippuden",
    japaneseTitle: "ナルト 疾風伝",
    synopsis: "After two and a half years of rigorous training on the road with Master Jiraiya, Naruto Uzumaki returns to the Hidden Leaf Village stronger, wiser, and more driven than ever. But dangerous shadows loom on the horizon as the rogue criminal syndicate Akatsuki moves to seize the Nine-Tails sealed deep inside him.",
    rating: 4.87,
    ratingCount: 490000,
    year: 2017,
    episodesCount: 500,
    genres: ["Action", "Adventure", "Martial Arts", "Shonen"],
    studio: "Studio Pierrot",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: true,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#2c190a", secondary: "#150c05", accent: "#ff7b00" },
    iconType: "blade",
    characters: [
      { name: "Naruto Uzumaki", role: "Nine-Tails Jinchuriki", voice: "Junko Takeuchi", avatar: generateAvatar("Naruto Uzumaki", "#ff7b00") },
      { name: "Sasuke Uchiha", role: "Avenger", voice: "Noriaki Sugiyama", avatar: generateAvatar("Sasuke Uchiha", "#3a0ca3") },
      { name: "Kakashi Hatake", role: "Copy Ninja", voice: "Kazuhiko Inoue", avatar: generateAvatar("Kakashi Hatake", "#6c757d") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Homecoming", duration: "24m", summary: "Naruto returns to the Hidden Leaf Village and reunites with his childhood friends." }
    ]
  },
  {
    id: "dragon-ball-z",
    title: "Dragon Ball Z",
    japaneseTitle: "ドラゴンボールZ",
    synopsis: "Five years after winning the World Martial Arts tournament, Son Goku is visited by Raditz, an extraterrestrial warrior who reveals Goku is actually a Saiyan. To protect Earth and his young son Gohan from planetary conquerors like Frieza, Cell, and Majin Buu, Goku must transcend his limits to attain the mythical Super Saiyan transformation.",
    rating: 4.88,
    ratingCount: 510000,
    year: 1996,
    episodesCount: 291,
    genres: ["Action", "Sci-Fi", "Martial Arts", "Shonen"],
    studio: "Toei Animation",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#33160a", secondary: "#180a04", accent: "#ffaa00" },
    iconType: "energy",
    characters: [
      { name: "Goku", role: "Earth's Champion", voice: "Masako Nozawa", avatar: generateAvatar("Goku", "#ffaa00") },
      { name: "Vegeta", role: "Prince of Saiyans", voice: "Ryo Horikawa", avatar: generateAvatar("Vegeta", "#3f37c9") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "The New Threat", duration: "24m", summary: "A strange space pod crashes on Earth carrying an extraterrestrial warrior." }
    ]
  },
  {
    id: "hunter-x-hunter",
    title: "Hunter x Hunter",
    japaneseTitle: "ハンター×ハンター",
    synopsis: "Gon Freecss discovers that the father he believed to be dead is alive and well, renowned as one of the world's most accomplished licensed Hunters. Inspired to follow in his footsteps, twelve-year-old Gon embarks on a dangerous expedition to take the lethal Hunter Examination alongside Killua, Kurapika, and Leorio.",
    rating: 4.93,
    ratingCount: 380000,
    year: 2014,
    episodesCount: 148,
    genres: ["Action", "Adventure", "Fantasy", "Shonen"],
    studio: "Madhouse",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#102e1c", secondary: "#08170e", accent: "#38b000" },
    iconType: "energy",
    characters: [
      { name: "Gon Freecss", role: "Rookie Hunter", voice: "Megumi Han", avatar: generateAvatar("Gon Freecss", "#38b000") },
      { name: "Killua Zoldyck", role: "Assassin Prodigy", voice: "Mariya Ise", avatar: generateAvatar("Killua Zoldyck", "#b5179e") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Departure x And x Friends", duration: "24m", summary: "Gon leaves Whale Island to register for the official Hunter Examination." }
    ]
  },
  {
    id: "haikyuu",
    title: "Haikyuu!!",
    japaneseTitle: "ハイキュー!!",
    synopsis: "Shoyo Hinata is inspired to play volleyball after seeing Karasuno High's legendary 'Little Giant' dominate the court. Despite his modest height, Hinata's astounding leaping ability and unyielding spirit earn the respect of genius setter Tobio Kageyama, forming an unstoppable quick-attack duo determined to reach the National Tournament.",
    rating: 4.89,
    ratingCount: 260000,
    year: 2020,
    episodesCount: 85,
    genres: ["Sports", "Comedy", "Drama", "Shonen"],
    studio: "Production I.G",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: true,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#331f0a", secondary: "#170e04", accent: "#f77f00" },
    iconType: "energy",
    characters: [
      { name: "Shoyo Hinata", role: "Middle Blocker", voice: "Ayumu Murase", avatar: generateAvatar("Shoyo Hinata", "#f77f00") },
      { name: "Tobio Kageyama", role: "Setter", voice: "Kaito Ishikawa", avatar: generateAvatar("Tobio Kageyama", "#0077b6") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "The End and The Beginning", duration: "24m", summary: "Hinata plays in his first official junior high volleyball tournament." }
    ]
  },
  {
    id: "blue-lock",
    title: "Blue Lock",
    japaneseTitle: "ブルーロック",
    synopsis: "Following the Japanese national team's disastrous exit at the World Cup, the eccentric coach Jinpachi Ego is hired to revolutionize Japanese football. He creates 'Blue Lock': an ultra-competitive prison-like training facility locking 300 gifted high-school strikers together, where 299 careers will be ruthlessly terminated to forge one ultimate egoist striker.",
    rating: 4.82,
    ratingCount: 165000,
    year: 2023,
    episodesCount: 24,
    genres: ["Sports", "Drama", "Psychological", "Shonen"],
    studio: "Eight Bit",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: true,
    popular: true,
    topRated: false,
    recentlyAdded: true,
    newEpisodes: false,
    colors: { primary: "#0b2545", secondary: "#051323", accent: "#00b4d8" },
    iconType: "shield",
    characters: [
      { name: "Yoichi Isagi", role: "Forward", voice: "Kazuki Ura", avatar: generateAvatar("Yoichi Isagi", "#00b4d8") },
      { name: "Meguru Bachira", role: "Dribbler", voice: "Tasuku Kaito", avatar: generateAvatar("Meguru Bachira", "#ffb703") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Dream", duration: "24m", summary: "Yoichi receives a mysterious invitation letter from the Japan Football Union." }
    ]
  },
  {
    id: "dr-stone",
    title: "Dr. Stone",
    japaneseTitle: "ドクターストーン",
    synopsis: "A blinding flash of emerald light sweeps across the Earth, instantly petrifying all of humanity into solid stone. Roughly 3,700 years later, scientific prodigy Senku Ishigami awakens to find the planet reclaimed by nature. Armed with boundless scientific curiosity, Senku vows to rebuild civilization from the Stone Age back to modern spaceflight.",
    rating: 4.81,
    ratingCount: 198000,
    year: 2023,
    episodesCount: 58,
    genres: ["Sci-Fi", "Adventure", "Comedy", "Shonen"],
    studio: "TMS Entertainment",
    status: "Ongoing",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: false,
    recentlyAdded: true,
    newEpisodes: true,
    colors: { primary: "#0f2e1b", secondary: "#07170d", accent: "#52b788" },
    iconType: "magic",
    characters: [
      { name: "Senku Ishigami", role: "Chief of Science", voice: "Yusuke Kobayashi", avatar: generateAvatar("Senku Ishigami", "#52b788") },
      { name: "Chrome", role: "Sorcerer / Scientist", voice: "Gen Sato", avatar: generateAvatar("Chrome", "#f39c12") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Stone World", duration: "24m", summary: "Senku revives from the stone state and immediately begins formulating a revival fluid." }
    ]
  },
  {
    id: "black-clover",
    title: "Black Clover",
    japaneseTitle: "ブラッククローバー",
    synopsis: "In the Clover Kingdom where magical aptitude dictates social standing, Asta was born with not a single drop of mana. Undeterred, he trains his physical body to superhuman heights. During the annual grimoire ceremony, Asta is bestowed a mysterious five-leaf clover grimoire housing an ancient Anti-Magic blade, setting him on a direct path to rival his prodigy foster brother Yuno.",
    rating: 4.83,
    ratingCount: 230000,
    year: 2021,
    episodesCount: 170,
    genres: ["Action", "Fantasy", "Comedy", "Shonen"],
    studio: "Studio Pierrot",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: false,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#2b1810", secondary: "#130a07", accent: "#d90429" },
    iconType: "blade",
    characters: [
      { name: "Asta", role: "Magic Knight", voice: "Gakuto Kajiwara", avatar: generateAvatar("Asta", "#d90429") },
      { name: "Yuno", role: "Golden Dawn Mage", voice: "Nobunaga Shimazaki", avatar: generateAvatar("Yuno", "#48cae4") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Asta and Yuno", duration: "24m", summary: "Two orphan boys make a sacred vow to compete for the title of Wizard King." }
    ]
  },
  {
    id: "one-punch-man",
    title: "One Punch Man",
    japaneseTitle: "ワンパンマン",
    synopsis: "Saitama began hero work as an ordinary hobby. After three years of intensive training (100 pushups, 100 situps, 100 squats, and a 10km run every single day), he became so overpowered that he can disintegrate any celestial menace, titan, or monster with a single punch—plunging him into an existential crisis of boredom.",
    rating: 4.87,
    ratingCount: 410000,
    year: 2019,
    episodesCount: 24,
    genres: ["Action", "Comedy", "Superhero", "Parody"],
    studio: "Madhouse / J.C.Staff",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: true,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#33220a", secondary: "#170f04", accent: "#ffb703" },
    iconType: "energy",
    characters: [
      { name: "Saitama", role: "Hero for Fun", voice: "Makoto Furukawa", avatar: generateAvatar("Saitama", "#ffb703") },
      { name: "Genos", role: "Demon Cyborg", voice: "Kaito Ishikawa", avatar: generateAvatar("Genos", "#00b4d8") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "The Strongest Man", duration: "24m", summary: "A colossal monster attacks City Z, testing Saitama's casual punch." }
    ]
  },
  {
    id: "mob-psycho-100",
    title: "Mob Psycho 100",
    japaneseTitle: "モブサイコ100",
    synopsis: "Eighth-grader Shigeo 'Mob' Kageyama possesses catastrophic psychic potential, but all he wants is an unexceptional high school life, good grades, and the attention of his crush. Working for con-artist psychic Reigen Arataka, Mob keeps his emotional reservoir under a strict 100% lock to keep his psychic storm from breaking loose.",
    rating: 4.90,
    ratingCount: 275000,
    year: 2022,
    episodesCount: 37,
    genres: ["Action", "Comedy", "Supernatural", "Slice of Life"],
    studio: "Bones",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#19172f", secondary: "#0c0b17", accent: "#7209b7" },
    iconType: "magic",
    characters: [
      { name: "Shigeo Kageyama", role: "Mob", voice: "Setsuo Ito", avatar: generateAvatar("Shigeo Kageyama", "#7209b7") },
      { name: "Reigen Arataka", role: "Spirits Counselor", voice: "Takahiro Sakurai", avatar: generateAvatar("Reigen Arataka", "#f77f00") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Self-Proclaimed Psychic", duration: "24m", summary: "Reigen accepts a lucrative exorcism case and brings Mob along to clean up." }
    ]
  },
  {
    id: "death-note",
    title: "Death Note",
    japaneseTitle: "デスノート",
    synopsis: "Light Yagami, a brilliant high school prodigy, stumbles upon a discarded supernatural notebook dropped by the Shinigami Ryuk. The rules are concise: the human whose name is written in this note shall die. Vowing to eradicate all criminals and govern as the god of a pristine new realm, Light finds his godhood challenged by the reclusive master detective known only as L.",
    rating: 4.91,
    ratingCount: 520000,
    year: 2007,
    episodesCount: 37,
    genres: ["Mystery", "Psychological", "Supernatural", "Thriller"],
    studio: "Madhouse",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#171a21", secondary: "#0a0c10", accent: "#e63946" },
    iconType: "blade",
    characters: [
      { name: "Light Yagami", role: "Kira", voice: "Mamoru Miyano", avatar: generateAvatar("Light Yagami", "#e63946") },
      { name: "L Lawliet", role: "Master Detective", voice: "Kappei Yamaguchi", avatar: generateAvatar("L Lawliet", "#457b9d") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Rebirth", duration: "24m", summary: "Light tests the Death Note's validity on a hostage-taker televised on local news." }
    ]
  },
  {
    id: "fullmetal-alchemist-brotherhood",
    title: "Fullmetal Alchemist: Brotherhood",
    japaneseTitle: "鋼の錬金術師 FULLMETAL ALCHEMIST",
    synopsis: "Alchemy operates under the sacred law of Equivalent Exchange: to obtain something, something of equal value must be lost. When young brothers Edward and Alphonse Elric commit the ultimate taboo of Human Transmutation to resurrect their mother, the catastrophe robs Alphonse of his body and Edward of two limbs. To recover what was lost, the brothers set off in search of the Philosopher's Stone.",
    rating: 4.97,
    ratingCount: 560000,
    year: 2010,
    episodesCount: 64,
    genres: ["Action", "Adventure", "Fantasy", "Drama"],
    studio: "Bones",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#291b10", secondary: "#130d07", accent: "#e05600" },
    iconType: "magic",
    characters: [
      { name: "Edward Elric", role: "Fullmetal Alchemist", voice: "Romi Park", avatar: generateAvatar("Edward Elric", "#e05600") },
      { name: "Alphonse Elric", role: "Soul in Armor", voice: "Rie Kugimiya", avatar: generateAvatar("Alphonse Elric", "#adb5bd") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Fullmetal Alchemist", duration: "24m", summary: "The Elric brothers are dispatched to Central to apprehend the Freezing Alchemist." }
    ]
  },
  {
    id: "vinland-saga",
    title: "Vinland Saga",
    japaneseTitle: "ヴィンランド・サガ",
    synopsis: "Raised among Viking raiders after the tragic death of his father Thors, young Thorfinn dedicates his entire childhood to gaining vengeance against the mercenary leader Askeladd. Trapped in a vicious cycle of brutal warfare and royal intrigue, Thorfinn must ultimately discover the true meaning of being a warrior.",
    rating: 4.92,
    ratingCount: 230000,
    year: 2023,
    episodesCount: 48,
    genres: ["Action", "Adventure", "Historical", "Drama"],
    studio: "MAPPA / Wit Studio",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#1f1d16", secondary: "#0d0c09", accent: "#d4a373" },
    iconType: "blade",
    characters: [
      { name: "Thorfinn", role: "Warrior", voice: "Yuto Uemura", avatar: generateAvatar("Thorfinn", "#d4a373") },
      { name: "Askeladd", role: "Mercenary Captain", voice: "Naoya Uchida", avatar: generateAvatar("Askeladd", "#6c757d") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Somewhere Not Here", duration: "24m", summary: "In an Icelandic village, young Thorfinn listens to tales of a green paradise." }
    ]
  },
  {
    id: "tokyo-revengers",
    title: "Tokyo Revengers",
    japaneseTitle: "東京卍リベンジャーズ",
    synopsis: "Takemichi Hanagaki's life hits absolute rock bottom when he discovers his only middle-school girlfriend was killed by the notorious Tokyo Manji Gang. After an accident on a train platform, he abruptly leaps twelve years backwards into his delinquent junior high days. To save the girl he loved, Takemichi resolves to climb the ranks of Toman.",
    rating: 4.77,
    ratingCount: 180000,
    year: 2023,
    episodesCount: 50,
    genres: ["Action", "Drama", "Supernatural", "Shonen"],
    studio: "LIDENFILMS",
    status: "Ongoing",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: true,
    popular: true,
    topRated: false,
    recentlyAdded: true,
    newEpisodes: false,
    colors: { primary: "#1c1c1f", secondary: "#0d0d0e", accent: "#e63946" },
    iconType: "blade",
    characters: [
      { name: "Takemichi Hanagaki", role: "Time Leaper", voice: "Yuki Shin", avatar: generateAvatar("Takemichi Hanagaki", "#e63946") },
      { name: "Manjiro Sano", role: "Mikey / Leader", voice: "Yu Hayashi", avatar: generateAvatar("Mikey", "#ffb703") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Reborn", duration: "24m", summary: "Takemichi discovers he can travel back twelve years by shaking Naoto's hand." }
    ]
  },
  {
    id: "jojos-bizarre-adventure",
    title: "JoJo's Bizarre Adventure",
    japaneseTitle: "ジョジョの奇妙な冒険",
    synopsis: "Spanning multiple generations, the heroic Joestar bloodline battles supernatural horrors, ancient Aztec stone masks, and psychic manifestations known as 'Stands'. From Victorian England to modern Japan, each Joestar protagonist inherits an indomitable fighting spirit and distinctive flamboyant resolve.",
    rating: 4.88,
    ratingCount: 290000,
    year: 2022,
    episodesCount: 190,
    genres: ["Action", "Adventure", "Supernatural", "Shonen"],
    studio: "David Production",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#2a122e", secondary: "#140816", accent: "#b5179e" },
    iconType: "energy",
    characters: [
      { name: "Jotaro Kujo", role: "Stand User", voice: "Daisuke Ono", avatar: generateAvatar("Jotaro Kujo", "#b5179e") },
      { name: "Joseph Joestar", role: "Hamon Master", voice: "Tomokazu Sugita", avatar: generateAvatar("Joseph Joestar", "#4cc9f0") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Dio the Invader", duration: "24m", summary: "Jonathan Joestar meets Dio Brando, his newly adopted foster brother." }
    ]
  },
  {
    id: "fire-force",
    title: "Fire Force",
    japaneseTitle: "炎炎ノ消防隊",
    synopsis: "In a world terrorized by spontaneous human combustion turning ordinary citizens into blazing living infernos called Infernals, the Special Fire Force defends humanity. Shinra Kusakabe, an energetic youth with the power to ignite his feet and rocket at blinding speeds, joins Company 8 to uncover the dark conspiracy behind his family's burning.",
    rating: 4.80,
    ratingCount: 175000,
    year: 2020,
    episodesCount: 48,
    genres: ["Action", "Sci-Fi", "Supernatural", "Shonen"],
    studio: "David Production",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: false,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#331508", secondary: "#190a04", accent: "#ff5400" },
    iconType: "energy",
    characters: [
      { name: "Shinra Kusakabe", role: "Devil's Footprints", voice: "Gakuto Kajiwara", avatar: generateAvatar("Shinra Kusakabe", "#ff5400") },
      { name: "Arthur Boyle", role: "Knight King", voice: "Yusuke Kobayashi", avatar: generateAvatar("Arthur Boyle", "#48cae4") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Shinra Kusakabe Enlists", duration: "24m", summary: "Shinra joins Special Fire Force Company 8 on his first emergency dispatch." }
    ]
  },
  {
    id: "the-rising-of-the-shield-hero",
    title: "The Rising of the Shield Hero",
    japaneseTitle: "盾の勇者の成り上がり",
    synopsis: "Naofumi Iwatani is summoned to the fantasy realm of Melromarc alongside three other youths to serve as the Cardinal Heroes. Denied any offensive weaponry and equipped only with a legendary shield, Naofumi is falsely accused of treason and ostracized by the kingdom. He must fight from absolute zero to protect the realm from interdimensional Waves.",
    rating: 4.76,
    ratingCount: 205000,
    year: 2023,
    episodesCount: 50,
    genres: ["Fantasy", "Adventure", "Action", "Drama"],
    studio: "Kinema Citrus",
    status: "Ongoing",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: false,
    recentlyAdded: true,
    newEpisodes: false,
    colors: { primary: "#11261a", secondary: "#08130d", accent: "#2a9d8f" },
    iconType: "shield",
    characters: [
      { name: "Naofumi Iwatani", role: "Shield Hero", voice: "Kaito Ishikawa", avatar: generateAvatar("Naofumi Iwatani", "#2a9d8f") },
      { name: "Raphtalia", role: "Sword of the Shield", voice: "Asami Seto", avatar: generateAvatar("Raphtalia", "#e76f51") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "The Shield Hero", duration: "48m", summary: "Naofumi arrives in Melromarc and finds himself abandoned without allies." }
    ]
  },
  {
    id: "sword-art-online",
    title: "Sword Art Online",
    japaneseTitle: "ソードアート・オンライン",
    synopsis: "In 2022, thousands of gamers log into Sword Art Online, the premier Virtual Reality Massively Multiplayer Online Role-Playing Game, only to learn they cannot log out. The game's creator informs them that death in the game means immediate death in the real world. Solo swordsman Kirito sets out to conquer all 100 floors of the floating iron castle Aincrad.",
    rating: 4.74,
    ratingCount: 390000,
    year: 2020,
    episodesCount: 96,
    genres: ["Action", "Adventure", "Fantasy", "Sci-Fi"],
    studio: "A-1 Pictures",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: false,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#102336", secondary: "#08111a", accent: "#00b4d8" },
    iconType: "blade",
    characters: [
      { name: "Kirito", role: "The Black Swordsman", voice: "Yoshitsugu Matsuoka", avatar: generateAvatar("Kirito", "#00b4d8") },
      { name: "Asuna Yuuki", role: "The Flash", voice: "Haruka Tomatsu", avatar: generateAvatar("Asuna Yuuki", "#e63946") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "The World of Swords", duration: "24m", summary: "Players enter the full-dive NerveGear and encounter the grim reality of SAO." }
    ]
  },
  {
    id: "assassination-classroom",
    title: "Assassination Classroom",
    japaneseTitle: "暗殺教室",
    synopsis: "A bizarre yellow tentacled entity destroys 70% of the Moon and announces he will annihilate the Earth in one year—unless the misfit students of Kunugigaoka Junior High's Class 3-E can successfully assassinate him before graduation. Dubbed 'Koro-sensei', the otherworldly teacher proves to be the most caring, encouraging mentor the students have ever known.",
    rating: 4.86,
    ratingCount: 245000,
    year: 2016,
    episodesCount: 47,
    genres: ["Comedy", "Action", "School", "Shonen"],
    studio: "Lerche",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#332a0c", secondary: "#171305", accent: "#ffdd00" },
    iconType: "energy",
    characters: [
      { name: "Koro-sensei", role: "Unkillable Teacher", voice: "Jun Fukuyama", avatar: generateAvatar("Koro-sensei", "#ffdd00") },
      { name: "Nagisa Shiota", role: "Student Assassin", voice: "Mai Fuchigami", avatar: generateAvatar("Nagisa Shiota", "#48cae4") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Assassination Time", duration: "24m", summary: "Class 3-E launches an all-out firing squad ambush on their morning roll call." }
    ]
  },
  {
    id: "your-lie-in-april",
    title: "Your Lie in April",
    japaneseTitle: "四月は君の嘘",
    synopsis: "Kosei Arima was a piano prodigy until his mother's death robbed him of his ability to hear the sound of his own piano. Two years later, living in emotional monochrome, he meets Kaori Miyazono, an eccentric and free-spirited violinist whose vibrant, passionate style forces Kosei back into the spotlight of music and life.",
    rating: 4.88,
    ratingCount: 310000,
    year: 2015,
    episodesCount: 22,
    genres: ["Drama", "Romance", "Music", "School"],
    studio: "A-1 Pictures",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#2b1c2b", secondary: "#140c14", accent: "#ffafcc" },
    iconType: "magic",
    characters: [
      { name: "Kosei Arima", role: "Pianist", voice: "Natsuki Hanae", avatar: generateAvatar("Kosei Arima", "#48cae4") },
      { name: "Kaori Miyazono", role: "Violinist", voice: "Risa Taneda", avatar: generateAvatar("Kaori Miyazono", "#ffafcc") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Monotone / Colorful", duration: "24m", summary: "Kosei meets an energetic girl playing a melodica beneath cherry blossoms." }
    ]
  },
  {
    id: "steins-gate",
    title: "Steins;Gate",
    japaneseTitle: "シュタインズ・ゲート",
    synopsis: "Eccentric self-proclaimed mad scientist Rintaro Okabe accidentally discovers that his modified microwave oven can transmit text messages back in time. As Okabe and his lab companions tamper with the fabric of causality to alter history, they discover that changing the past incurs catastrophic unintended consequences.",
    rating: 4.95,
    ratingCount: 360000,
    year: 2011,
    episodesCount: 24,
    genres: ["Sci-Fi", "Mystery", "Thriller", "Psychological"],
    studio: "White Fox",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: true,
    recentlyAdded: false,
    newEpisodes: false,
    colors: { primary: "#13232b", secondary: "#081014", accent: "#00b4d8" },
    iconType: "magic",
    characters: [
      { name: "Rintaro Okabe", role: "Hououin Kyouma", voice: "Mamoru Miyano", avatar: generateAvatar("Rintaro Okabe", "#00b4d8") },
      { name: "Kurisu Makise", role: "Neuroscientist", voice: "Asami Imai", avatar: generateAvatar("Kurisu Makise", "#e63946") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Turning Point", duration: "24m", summary: "Okabe attends a time machine lecture in Akihabara and witnesses an anomaly." }
    ]
  },
  {
    id: "bleach-thousand-year-blood-war",
    title: "Bleach: Thousand-Year Blood War",
    japaneseTitle: "BLEACH 千年血戦篇",
    synopsis: "The tranquil peace between the Soul Society and the World of the Living is shattered when hollows vanish in unprecedented numbers. Yhwach, the ancient father of all Quincies, awakens from a 1,000-year slumber to wage the final extermination war against the Soul Reapers. Substitute Soul Reaper Ichigo Kurosaki must draw his Zanpakuto to protect both worlds.",
    rating: 4.91,
    ratingCount: 210000,
    year: 2024,
    episodesCount: 26,
    genres: ["Action", "Adventure", "Supernatural", "Shonen"],
    studio: "Studio Pierrot",
    status: "Ongoing",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: true,
    popular: true,
    topRated: true,
    recentlyAdded: true,
    newEpisodes: true,
    colors: { primary: "#1a162b", secondary: "#0d0a16", accent: "#4cc9f0" },
    iconType: "blade",
    characters: [
      { name: "Ichigo Kurosaki", role: "Substitute Soul Reaper", voice: "Masakazu Morita", avatar: generateAvatar("Ichigo Kurosaki", "#ff7a29") },
      { name: "Yhwach", role: "Father of the Quincies", voice: "Takayuki Sugo", avatar: generateAvatar("Yhwach", "#4cc9f0") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "The Blood Warfare", duration: "24m", summary: "Shadow infiltrators deliver a fatal declaration of war to Head Captain Yamamoto." }
    ]
  },
  {
    id: "delicious-in-dungeon",
    title: "Delicious in Dungeon",
    japaneseTitle: "ダンジョン飯",
    synopsis: "After his sister is swallowed whole by a red dragon in the lowest depths of a sprawling dungeon, knight Laios and his comrades must mount a desperate rescue mission before she is digested. Penniless and without supplies, they turn to an unconventional culinary survival tactic: cooking and eating the monsters they defeat!",
    rating: 4.84,
    ratingCount: 135000,
    year: 2024,
    episodesCount: 24,
    genres: ["Fantasy", "Comedy", "Adventure", "Gourmet"],
    studio: "Trigger",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: true,
    popular: true,
    topRated: false,
    recentlyAdded: true,
    newEpisodes: true,
    colors: { primary: "#2c2214", secondary: "#140f09", accent: "#f39c12" },
    iconType: "shield",
    characters: [
      { name: "Laios Touden", role: "Party Leader / Knight", voice: "Kentaro Kumagai", avatar: generateAvatar("Laios Touden", "#f39c12") },
      { name: "Marcille Donato", role: "Elven Mage", voice: "Sayaka Senbongi", avatar: generateAvatar("Marcille Donato", "#e74c3c") },
      { name: "Senshi", role: "Dwarf Monster Chef", voice: "Hiroshi Naka", avatar: generateAvatar("Senshi", "#27ae60") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Hot Pot / Tart", duration: "24m", summary: "Running low on funds, the adventuring party prepares giant scorpion hot pot." }
    ]
  },
  {
    id: "kaiju-no-8",
    title: "Kaiju No. 8",
    japaneseTitle: "怪獣8号",
    synopsis: "In a modern Japan besieged by grotesque Kaiju monsters, Kafka Hibino works for a cleanup company disposing of gigantic beast carcasses. Having abandoned his childhood dream of joining the elite Defense Force, Kafka's life takes a wild supernatural turn when a parasitic miniature kaiju flies down his throat, granting him monstrous shape-shifting power.",
    rating: 4.82,
    ratingCount: 148000,
    year: 2024,
    episodesCount: 12,
    genres: ["Action", "Sci-Fi", "Comedy", "Shonen"],
    studio: "Production I.G",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: true,
    popular: true,
    topRated: false,
    recentlyAdded: true,
    newEpisodes: true,
    colors: { primary: "#152a24", secondary: "#0a1713", accent: "#00f5d4" },
    iconType: "energy",
    characters: [
      { name: "Kafka Hibino", role: "Kaiju No. 8", voice: "Masaya Fukunishi", avatar: generateAvatar("Kafka Hibino", "#00f5d4") },
      { name: "Mina Ashiro", role: "Captain", voice: "Asami Seto", avatar: generateAvatar("Mina Ashiro", "#7b2cbf") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "The Man Who Became a Kaiju", duration: "24m", summary: "Kafka encounters an unexpected catastrophe while completing monster sanitation duty." }
    ]
  },
  {
    id: "classroom-of-the-elite",
    title: "Classroom of the Elite",
    japaneseTitle: "ようこそ実力至上主義の教室へ",
    synopsis: "Tokyo Metropolitan Advanced Nurturing High School is a state-funded institution established to cultivate elite leaders, granting students complete freedom and point-based currency. Kiyotaka Ayanokoji intentionally scores precisely 50 on every exam to place in Class 1-D, the dumping ground for defective students, where he navigates cold psychological battles from the shadows.",
    rating: 4.80,
    ratingCount: 215000,
    year: 2024,
    episodesCount: 38,
    genres: ["Psychological", "Drama", "School", "Mystery"],
    studio: "Lerche",
    status: "Completed",
    language: "Sub | Dub",
    type: "TV Series",
    featured: false,
    trending: false,
    popular: true,
    topRated: false,
    recentlyAdded: true,
    newEpisodes: false,
    colors: { primary: "#201428", secondary: "#0e0912", accent: "#9d4edd" },
    iconType: "shield",
    characters: [
      { name: "Kiyotaka Ayanokoji", role: "Mastermind", voice: "Shoya Chiba", avatar: generateAvatar("Kiyotaka Ayanokoji", "#9d4edd") },
      { name: "Suzune Horikita", role: "Class Representative", voice: "Akari Kito", avatar: generateAvatar("Suzune Horikita", "#e63946") }
    ],
    episodes: [
      { id: "ep1", number: 1, title: "What is Evil?", duration: "24m", summary: "Students discover that classroom points can be converted directly into real currency." }
    ]
  }
];

const MAL_ID_MAP = {
  "frieren-beyond-journeys-end": 52991,
  "solo-leveling": 52299,
  "demon-slayer-kimetsu-no-yaiba": 38000,
  "jujutsu-kaisen": 40748,
  "one-piece": 21,
  "attack-on-titan": 16498,
  "spy-x-family": 50265,
  "my-hero-academia": 31964,
  "naruto-shippuden": 1735,
  "dragon-ball-z": 813,
  "hunter-x-hunter": 11061,
  "haikyuu": 20583,
  "blue-lock": 49596,
  "dr-stone": 38691,
  "black-clover": 34572,
  "one-punch-man": 30276,
  "mob-psycho-100": 32182,
  "death-note": 1535,
  "fullmetal-alchemist-brotherhood": 5114,
  "vinland-saga": 37521,
  "tokyo-revengers": 42249,
  "jojos-bizarre-adventure": 14719,
  "fire-force": 38671,
  "the-rising-of-the-shield-hero": 35790,
  "sword-art-online": 11757,
  "assassination-classroom": 24833,
  "your-lie-in-april": 23273,
  "steins-gate": 9253,
  "bleach-thousand-year-blood-war": 41467,
  "delicious-in-dungeon": 52701,
  "kaiju-no-8": 52588,
  "classroom-of-the-elite": 35507
};

// Enrich each anime with generated high-resolution vector artwork & thumbnails
ANIME_DATABASE.forEach(anime => {
  anime.mal_id = MAL_ID_MAP[anime.id] || 0;
  anime.poster = generateAnimeArt(
    anime.colors.primary,
    anime.colors.secondary,
    anime.colors.accent,
    anime.title,
    anime.japaneseTitle,
    anime.genres[0],
    anime.iconType
  );
  anime.banner = generateBannerArt(
    anime.colors.primary,
    anime.colors.secondary,
    anime.colors.accent,
    anime.title,
    anime.japaneseTitle,
    anime.iconType
  );
  anime.episodes.forEach(ep => {
    ep.thumbnail = generateEpisodeThumb(
      anime.colors.primary,
      anime.colors.accent,
      ep.number,
      ep.title
    );
  });
});

// Provide access to datasets
window.ANIME_DATABASE = ANIME_DATABASE;

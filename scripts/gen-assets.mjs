/**
 * 本地素材生成器：生成头像、友链头像、照片墙配图与文章封面（全部为原创 SVG）。
 * 用真实照片时，直接把图片放进 public/photos、public/covers 覆盖同名文件即可。
 *
 * 运行： npm run assets
 */
import fs from "node:fs";
import path from "node:path";

const PUB = path.join(process.cwd(), "public");

function write(rel, content) {
  const file = path.join(PUB, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content.trim() + "\n", "utf8");
}

/** 固定种子的伪随机，保证每次生成结果一致 */
function makeRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const PALETTES = [
  ["#f6d365", "#fda085", "#f7b267"],
  ["#a1c4fd", "#c2e9fb", "#8ec5fc"],
  ["#fbc2eb", "#a6c1ee", "#f8b8dc"],
  ["#c2e9fb", "#a1c4fd", "#dbeafe"],
  ["#fdcbf1", "#e6dee9", "#c7d2fe"],
  ["#84fab0", "#8fd3f4", "#a6e3e9"],
  ["#fbc2eb", "#a18cd1", "#c3a6f5"],
  ["#fddb92", "#d1fdff", "#ffd6a5"],
  ["#e0c3fc", "#8ec5fc", "#b8c0ff"],
  ["#f093fb", "#f5576c", "#ff9a9e"],
  ["#4facfe", "#00f2fe", "#5ee7df"],
  ["#d4fc79", "#96e6a1", "#c9f0a3"],
];

const stroke = (extra = "") => `stroke="rgba(255,255,255,${0.18})" ${extra}`;

/** 场景：山峦日出 */
function sceneMountains(w, h, [a, b, c], seed) {
  const rand = makeRandom(seed);
  const layers = [0.35, 0.5, 0.68, 0.9];
  const ridges = layers
    .map((opacity, i) => {
      const base = h * (0.52 + i * 0.1);
      const peak = base - h * (0.14 + rand() * 0.12);
      const mid = base - h * (0.05 + rand() * 0.08);
      return `
    <path d="M0 ${base} L${w * 0.22} ${peak} L${w * 0.42} ${mid} L${w * 0.62} ${peak + 20} L${w * 0.82} ${mid - 10} L${w} ${base - 30} L${w} ${h} L0 ${h} Z"
      fill="rgba(30,27,64,${opacity})" />`;
    })
    .join("");
  return `
  <rect width="${w}" height="${h}" fill="url(#sky)" />
  <circle cx="${w * 0.72}" cy="${h * 0.28}" r="${h * 0.09}" fill="#fff6e0" opacity="0.92" />
  <circle cx="${w * 0.72}" cy="${h * 0.28}" r="${h * 0.16}" fill="#ffe9b8" opacity="0.22" />
  ${ridges}
  <rect y="${h * 0.86}" width="${w}" height="${h * 0.14}" fill="rgba(18,16,40,0.55)" />`;
}

/** 场景：城市天际线 */
function sceneCity(w, h, [a, b, c], seed) {
  const rand = makeRandom(seed);
  let buildings = "";
  let windows = "";
  let x = -20;
  while (x < w + 20) {
    const bw = 40 + rand() * 60;
    const bh = h * (0.2 + rand() * 0.42);
    const top = h - bh;
    buildings += `<rect x="${x}" y="${top}" width="${bw}" height="${bh}" fill="rgba(24,22,52,${0.6 + rand() * 0.3})" rx="3" />`;
    for (let wy = top + 14; wy < h - 16; wy += 20) {
      for (let wx = x + 8; wx < x + bw - 10; wx += 16) {
        if (rand() > 0.45) {
          windows += `<rect x="${wx}" y="${wy}" width="5" height="8" rx="1.5" fill="rgba(255,232,170,${0.35 + rand() * 0.5})" />`;
        }
      }
    }
    x += bw + 6 + rand() * 10;
  }
  return `
  <rect width="${w}" height="${h}" fill="url(#sky)" />
  <circle cx="${w * 0.3}" cy="${h * 0.32}" r="${h * 0.12}" fill="#ffd9a0" opacity="0.55" />
  ${buildings}
  ${windows}
  <rect y="${h - h * 0.16}" width="${w}" height="${h * 0.16}" fill="rgba(12,14,36,0.75)" />
  <rect y="${h - h * 0.16}" width="${w}" height="${h * 0.16}" fill="url(#sky)" opacity="0.15" />`;
}

/** 场景：海边 */
function sceneSea(w, h, [a, b, c], seed) {
  const rand = makeRandom(seed);
  let waves = "";
  for (let i = 0; i < 7; i++) {
    const y = h * (0.58 + i * 0.055);
    const amp = 6 + rand() * 12;
    waves += `<path d="M0 ${y} Q ${w * 0.25} ${y - amp} ${w * 0.5} ${y} T ${w} ${y - amp * 0.6} L ${w} ${h} L0 ${h} Z"
      fill="rgba(255,255,255,${0.06 + i * 0.03})" />`;
  }
  return `
  <rect width="${w}" height="${h}" fill="url(#sky)" />
  <circle cx="${w * 0.5}" cy="${h * 0.45}" r="${h * 0.1}" fill="#fff3d6" opacity="0.85" />
  <rect y="${h * 0.52}" width="${w}" height="${h * 0.48}" fill="rgba(20,32,72,0.45)" />
  <path d="M${w * 0.42} ${h * 0.53} L${w * 0.58} ${h * 0.53} L${w * 0.62} ${h * 0.72} L${w * 0.38} ${h * 0.72} Z" fill="rgba(255,240,200,0.35)" />
  ${waves}`;
}

/** 场景：星空 */
function sceneStars(w, h, [a, b, c], seed) {
  const rand = makeRandom(seed);
  let stars = "";
  for (let i = 0; i < 150; i++) {
    const r = rand() * 1.8 + 0.4;
    stars += `<circle cx="${(rand() * w).toFixed(1)}" cy="${(rand() * h * 0.8).toFixed(1)}" r="${r.toFixed(2)}" fill="#fff" opacity="${(0.25 + rand() * 0.7).toFixed(2)}" />`;
  }
  return `
  <rect width="${w}" height="${h}" fill="url(#night)" />
  <ellipse cx="${w * 0.55}" cy="${h * 0.32}" rx="${w * 0.6}" ry="${h * 0.14}" fill="rgba(255,255,255,0.09)" transform="rotate(-14 ${w * 0.55} ${h * 0.32})" />
  ${stars}
  <path d="M0 ${h * 0.78} L${w * 0.3} ${h * 0.66} L${w * 0.55} ${h * 0.8} L${w} ${h * 0.62} L${w} ${h} L0 ${h} Z" fill="rgba(8,10,28,0.92)" />`;
}

/** 场景：隧道 */
function sceneTunnel(w, h, [a, b, c], seed) {
  const rand = makeRandom(seed);
  const rings = Array.from({ length: 9 }, (_, i) => {
    const t = i / 9;
    const rw = w * (0.75 - t * 0.62);
    const rh = h * (0.78 - t * 0.66);
    return `<ellipse cx="${w / 2}" cy="${h * 0.55}" rx="${rw / 2}" ry="${rh / 2}" fill="none" stroke="rgba(255,255,255,${(0.28 - t * 0.26).toFixed(2)})" stroke-width="${(10 - i).toFixed(1)}" />`;
  }).join("");
  return `
  <rect width="${w}" height="${h}" fill="url(#tunnel)" />
  ${rings}
  <ellipse cx="${w / 2}" cy="${h * 0.55}" rx="${w * 0.07}" ry="${h * 0.07}" fill="#fffdf4" opacity="0.95" />
  <ellipse cx="${w / 2}" cy="${h * 0.55}" rx="${w * 0.2}" ry="${h * 0.2}" fill="#fff6d8" opacity="0.18" />
  <path d="M0 ${h} L${w * 0.34} ${h * 0.72} L${w * 0.66} ${h * 0.72} L${w} ${h} Z" fill="rgba(14,14,34,0.8)" />`;
}

/** 场景：咖啡馆桌面 */
function sceneCafe(w, h, [a, b, c], seed) {
  const rand = makeRandom(seed);
  return `
  <rect width="${w}" height="${h}" fill="url(#warm)" />
  <rect x="${w * 0.08}" y="${h * 0.06}" width="${w * 0.84}" height="${h * 0.5}" rx="18" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.4)" />
  <line x1="${w * 0.5}" y1="${h * 0.06}" x2="${w * 0.5}" y2="${h * 0.56}" stroke="rgba(255,255,255,0.35)" stroke-width="6" />
  <line x1="${w * 0.08}" y1="${h * 0.31}" x2="${w * 0.92}" y2="${h * 0.31}" stroke="rgba(255,255,255,0.32)" stroke-width="6" />
  <rect y="${h * 0.58}" width="${w}" height="${h * 0.42}" fill="rgba(60,36,24,0.5)" />
  <ellipse cx="${w * 0.42}" cy="${h * 0.78}" rx="${w * 0.13}" ry="${h * 0.03}" fill="rgba(255,255,255,0.18)" />
  <path d="M${w * 0.33} ${h * 0.68} L${w * 0.51} ${h * 0.68} L${w * 0.485} ${h * 0.82} L${w * 0.355} ${h * 0.82} Z" fill="rgba(255,252,244,0.9)" />
  <ellipse cx="${w * 0.42}" cy="${h * 0.68}" rx="${w * 0.09}" ry="${h * 0.022}" fill="rgba(120,72,40,0.85)" />
  <path d="M${w * 0.51} ${h * 0.72} q${w * 0.05} 0 ${w * 0.05} ${h * 0.03} q0 ${h * 0.03} -${w * 0.05} ${h * 0.03}" fill="none" stroke="rgba(255,252,244,0.85)" stroke-width="6" />
  <path d="M${w * 0.6} ${h * 0.62} q0 -${h * 0.04} ${w * 0.02} -${h * 0.055}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="4" />
  <path d="M${w * 0.66} ${h * 0.62} q0 -${h * 0.05} ${w * 0.02} -${h * 0.07}" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="4" />`;
}

/** 场景：窗台上的猫 */
function sceneCat(w, h, [a, b, c], seed) {
  return `
  <rect width="${w}" height="${h}" fill="url(#warm)" />
  <rect x="${w * 0.1}" y="${h * 0.08}" width="${w * 0.8}" height="${h * 0.62}" rx="16" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.38)" />
  <line x1="${w * 0.5}" y1="${h * 0.08}" x2="${w * 0.5}" y2="${h * 0.7}" stroke="rgba(255,255,255,0.3)" stroke-width="7" />
  <rect y="${h * 0.78}" width="${w}" height="${h * 0.22}" fill="rgba(48,32,60,0.55)" />
  <path d="M${w * 0.36} ${h * 0.78} q0 -${h * 0.14} ${w * 0.06} -${h * 0.16} l${w * 0.02} -${h * 0.05} l${w * 0.03} ${h * 0.05} q${w * 0.06} ${h * 0.02} ${w * 0.06} ${h * 0.16} Z" fill="rgba(38,30,46,0.92)" />
  <circle cx="${w * 0.42}" cy="${h * 0.56}" r="${w * 0.055}" fill="rgba(38,30,46,0.92)" />
  <circle cx="${w * 0.4}" cy="${h * 0.555}" r="3" fill="#ffe9a8" />
  <circle cx="${w * 0.445}" cy="${h * 0.555}" r="3" fill="#ffe9a8" />
  <path d="M${w * 0.6} ${h * 0.78} q0 -${h * 0.13} ${w * 0.04} -${h * 0.2} q${w * 0.01} -${h * 0.05} ${w * 0.03} 0 q${w * 0.04} ${h * 0.07} ${w * 0.04} ${h * 0.2} Z" fill="rgba(255,255,255,0.16)" />`;
}

/** 场景：雾气中的山 */
function sceneFog(w, h, [a, b, c], seed) {
  const rand = makeRandom(seed);
  let bands = "";
  for (let i = 0; i < 5; i++) {
    const base = h * (0.42 + i * 0.12);
    bands += `<path d="M0 ${base} Q ${w * 0.3} ${base - h * (0.06 + rand() * 0.08)} ${w * 0.55} ${base} T ${w} ${base - 20} L ${w} ${h} L0 ${h} Z" fill="rgba(38,44,78,${(0.16 + i * 0.14).toFixed(2)})" />`;
  }
  return `
  <rect width="${w}" height="${h}" fill="url(#mist)" />
  <circle cx="${w * 0.26}" cy="${h * 0.24}" r="${h * 0.06}" fill="#fffaf0" opacity="0.75" />
  ${bands}
  <rect y="${h * 0.86}" width="${w}" height="${h * 0.14}" fill="rgba(255,255,255,0.12)" />`;
}

const SCENES = {
  mountains: sceneMountains,
  city: sceneCity,
  sea: sceneSea,
  stars: sceneStars,
  tunnel: sceneTunnel,
  cafe: sceneCafe,
  cat: sceneCat,
  fog: sceneFog,
};

const DEFS_LIGHT = `
  <linearGradient id="sky" x1="0" y1="0" x2="0.4" y2="1">
    <stop offset="0%" stop-color="__A__" />
    <stop offset="55%" stop-color="__B__" />
    <stop offset="100%" stop-color="__C__" />
  </linearGradient>`;

const DEFS_EXTRA = `
  <linearGradient id="night" x1="0" y1="0" x2="0.6" y2="1">
    <stop offset="0%" stop-color="#1b1a45" />
    <stop offset="55%" stop-color="#2c2566" />
    <stop offset="100%" stop-color="#101433" />
  </linearGradient>
  <linearGradient id="tunnel" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3a3564" />
    <stop offset="100%" stop-color="#15132e" />
  </linearGradient>
  <linearGradient id="warm" x1="0" y1="0" x2="0.5" y2="1">
    <stop offset="0%" stop-color="__A__" />
    <stop offset="100%" stop-color="__C__" />
  </linearGradient>
  <linearGradient id="mist" x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0%" stop-color="__B__" />
    <stop offset="100%" stop-color="__C__" />
  </linearGradient>
  <radialGradient id="glow" cx="50%" cy="50%">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55" />
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
  </radialGradient>`;

function svgBase(w, h, palette, sceneName, seed, body) {
  const [a, b, c] = palette;
  const defs = (DEFS_LIGHT + DEFS_EXTRA).replaceAll("__A__", a).replaceAll("__B__", b).replaceAll("__C__", c);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
  <defs>${defs}</defs>
  ${body}
</svg>`;
}

/* ---------------- 照片墙 ---------------- */
const PHOTO_PLAN = [
  ["p1", "mountains", 900, 1200, 0],
  ["p2", "city", 1200, 800, 1],
  ["p3", "mountains", 1400, 800, 2],
  ["p4", "city", 900, 1100, 3],
  ["p5", "sea", 900, 1200, 4],
  ["p6", "cafe", 900, 1000, 5],
  ["p7", "cat", 1100, 900, 6],
  ["p8", "stars", 1400, 800, 7],
  ["p9", "tunnel", 900, 1200, 8],
  ["p10", "fog", 1000, 1000, 9],
  ["p11", "cafe", 1000, 900, 10],
  ["p12", "fog", 1400, 800, 11],
];

for (const [id, scene, w, h, paletteIdx] of PHOTO_PLAN) {
  const palette = PALETTES[paletteIdx % PALETTES.length];
  const body = SCENES[scene](w, h, palette, paletteIdx * 97 + 11);
  write(`photos/${id}.svg`, svgBase(w, h, palette, scene, paletteIdx, body));
}

/* ---------------- 文章封面 ---------------- */
const COVER_PLAN = [
  ["c1", 0],
  ["c2", 6],
  ["c3", 10],
  ["c4", 4],
  ["c5", 1],
  ["c6", 8],
];

for (const [id, paletteIdx] of COVER_PLAN) {
  const w = 1200;
  const h = 630;
  const palette = PALETTES[paletteIdx % PALETTES.length];
  const [a, b, c] = palette;
  const rand = makeRandom(paletteIdx * 31 + 7);
  let blobs = "";
  for (let i = 0; i < 5; i++) {
    blobs += `<circle cx="${(rand() * w).toFixed(0)}" cy="${(rand() * h).toFixed(0)}" r="${(90 + rand() * 190).toFixed(0)}" fill="rgba(255,255,255,${(0.08 + rand() * 0.14).toFixed(2)})" />`;
  }
  let dots = "";
  for (let x = 40; x < w; x += 40) {
    for (let y = 40; y < h; y += 40) {
      dots += `<circle cx="${x}" cy="${y}" r="1.6" fill="rgba(255,255,255,0.14)" />`;
    }
  }
  const body = `
  <rect width="${w}" height="${h}" fill="url(#sky)" />
  ${blobs}
  ${dots}
  <g transform="translate(${w * 0.1} ${h * 0.28})">
    <rect x="0" y="0" width="${w * 0.34}" height="${h * 0.42}" rx="24" fill="rgba(255,255,255,0.26)" stroke="rgba(255,255,255,0.5)" stroke-width="2" />
    <rect x="26" y="34" width="${w * 0.2}" height="12" rx="6" fill="rgba(255,255,255,0.75)" />
    <rect x="26" y="64" width="${w * 0.26}" height="10" rx="5" fill="rgba(255,255,255,0.5)" />
    <rect x="26" y="90" width="${w * 0.16}" height="10" rx="5" fill="rgba(255,255,255,0.4)" />
    <circle cx="${w * 0.28}" cy="${h * 0.3}" r="${h * 0.1}" fill="rgba(255,255,255,0.35)" />
  </g>
  <circle cx="${w * 0.82}" cy="${h * 0.36}" r="${h * 0.16}" fill="url(#glow)" />
  <path d="M0 ${h} L${w * 0.35} ${h * 0.72} L${w * 0.58} ${h * 0.88} L${w} ${h * 0.66} L${w} ${h} Z" fill="rgba(24,20,52,0.42)" />`;
  write(`covers/${id}.svg`, svgBase(w, h, palette, "cover", paletteIdx, body));
}

/* ---------------- 头像 ---------------- */
{
  const size = 400;
  const palette = PALETTES[6];
  const [a, b, c] = palette;
  const body = `
  <rect width="${size}" height="${size}" fill="url(#sky)" />
  <circle cx="${size * 0.72}" cy="${size * 0.3}" r="${size * 0.3}" fill="rgba(255,255,255,0.25)" />
  <g transform="translate(0 ${size * 0.04})">
    <path d="M118 168 L134 96 L196 140 Z" fill="rgba(56,42,92,0.9)" />
    <path d="M282 168 L266 96 L204 140 Z" fill="rgba(56,42,92,0.9)" />
    <circle cx="200" cy="200" r="102" fill="rgba(58,44,96,0.92)" />
    <circle cx="168" cy="190" r="11" fill="#fff7e6" />
    <circle cx="232" cy="190" r="11" fill="#fff7e6" />
    <path d="M180 232 q20 18 40 0" stroke="#fff7e6" stroke-width="7" fill="none" stroke-linecap="round" />
    <path d="M120 176 h34 M246 176 h34" stroke="rgba(255,255,255,0.55)" stroke-width="5" stroke-linecap="round" />
    <circle cx="150" cy="216" r="12" fill="rgba(255,160,180,0.4)" />
    <circle cx="250" cy="216" r="12" fill="rgba(255,160,180,0.4)" />
  </g>`;
  write("avatar.svg", svgBase(size, size, palette, "avatar", 3, body));
}

/* ---------------- 友链头像 ---------------- */
const FRIEND_LETTERS = ["星", "云", "夜", "夏", "像", "风", "零", "南"];
FRIEND_LETTERS.forEach((letter, index) => {
  const size = 200;
  const palette = PALETTES[index % PALETTES.length];
  const body = `
  <rect width="${size}" height="${size}" fill="url(#sky)" />
  <circle cx="${size * 0.7}" cy="${size * 0.26}" r="${size * 0.28}" fill="rgba(255,255,255,0.28)" />
  <circle cx="${size * 0.26}" cy="${size * 0.78}" r="${size * 0.24}" fill="rgba(255,255,255,0.18)" />
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
    font-family="PingFang SC, Microsoft YaHei, sans-serif" font-size="86" font-weight="700"
    fill="rgba(255,255,255,0.94)">${letter}</text>`;
  write(`avatars/f${index + 1}.svg`, svgBase(size, size, palette, "avatar", index, body));
});

/* ---------------- 站点图标 ---------------- */
write(
  "favicon.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#a18cd1" />
      <stop offset="100%" stop-color="#a1c4fd" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#g)" />
  <circle cx="32" cy="30" r="13" fill="rgba(255,255,255,0.9)" />
  <path d="M27 40 h10 l-1.5 14 h-7 Z" fill="rgba(255,255,255,0.75)" />
</svg>`,
);

console.log("✅ 素材生成完成：public/photos、public/covers、public/avatars、public/avatar.svg、public/favicon.svg");

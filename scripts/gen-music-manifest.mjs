/**
 * 扫描 public/music/ 下真实存在的音频，生成 data/music-files.json。
 *
 * 播放器只对「清单里存在」的音频发起请求，所以没放 mp3 时不会产生 404 请求，
 * 控制台也干净。放好文件后跑一次 npm run assets，或者直接 npm run dev
 * （package.json 里的 predev / prebuild 会自动执行本脚本）。
 */
import fs from "node:fs";
import path from "node:path";

const MUSIC_DIR = path.join(process.cwd(), "public", "music");
const OUT = path.join(process.cwd(), "data", "music-files.json");
const EXTENSIONS = new Set([".mp3", ".wav", ".flac", ".m4a", ".aac", ".ogg"]);

const files = fs.existsSync(MUSIC_DIR)
  ? fs
      .readdirSync(MUSIC_DIR)
      .filter((file) => EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort()
  : [];

const manifest = files.map((file) => `/music/${file}`);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n", "utf8");

console.log(`音乐清单已更新：public/music/ 下找到 ${files.length} 个音频文件 → data/music-files.json`);

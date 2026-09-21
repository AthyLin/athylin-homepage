/**
 * 项目自检脚本：检查资源引用、页面路由、敏感信息与遗留文案。
 *
 * 用法：
 *   npm run audit
 *   npm run audit -- --forbid=拾光,Shigure    # 额外检查这些词有没有残留
 *
 * 只读，不会修改任何文件。
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const skipDirs = new Set(["node_modules", ".next", ".git", ".data"]);
const textExt = new Set([".ts", ".tsx", ".css", ".md", ".json", ".mjs", ".sql", ".txt"]);
/** 脚本自身含有示例路径与关键词，扫描时跳过，避免误报 */
const SELF = "scripts/audit.mjs";

const forbidArg = process.argv.find((arg) => arg.startsWith("--forbid="));
const forbidden = forbidArg ? forbidArg.slice("--forbid=".length).split(",").filter(Boolean) : [];

const problems = [];
const notices = [];

function walk(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else list.push(full);
  }
  return list;
}

const files = walk(root);
const rel = (file) => file.slice(root.length + 1).replace(/\\/g, "/");
console.log(`\n项目目录: ${root}`);
console.log(`扫描文件: ${files.length} 个\n`);

/* ---------- 1. 收集页面路由 ---------- */
const routes = new Set();
function collectRoutes(dir, prefix = "") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) collectRoutes(path.join(dir, entry.name), `${prefix}/${entry.name}`);
    else if (/^(page|route)\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      routes.add(prefix === "" ? "/" : prefix.replace(/\[[^\]]+\]/g, "[slug]"));
    }
  }
}
if (fs.existsSync(path.join(root, "app"))) collectRoutes(path.join(root, "app"));
console.log(`页面路由 ${routes.size} 个: ${[...routes].sort().join(", ")}\n`);

/* ---------- 2. 检查引用 ---------- */
const publicDir = path.join(root, "public");
const assets = new Map();
const links = new Map();
const audios = new Set();

for (const file of files) {
  const ext = path.extname(file);
  if (!textExt.has(ext) || rel(file).startsWith("public/") || rel(file) === SELF) continue;
  if (rel(file).endsWith("package-lock.json")) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/["'`(](\/[A-Za-z0-9_\-./\[\]]+)["'`)]/g)) {
    const ref = match[1];
    if (ref.includes("..") || ref.startsWith("/_next") || ref.startsWith("/api")) continue;
    const ext2 = path.extname(ref).toLowerCase();
    // 文档里的示例路径（/covers/xxx.jpg）不参与检查
    if (/xxx|你的|示例|your-/.test(ref)) continue;
    if (ext2 === ".mp3" || ext2 === ".wav" || ext2 === ".flac") {
      audios.add(ref);
      continue;
    }
    if (ext2 && ext2 !== ".xml") {
      if (!assets.has(ref)) assets.set(ref, { exists: fs.existsSync(path.join(publicDir, ref.slice(1))), from: rel(file) });
    } else if (!ext2 || ext2 === ".xml") {
      if (!links.has(ref)) links.set(ref, rel(file));
    }
  }
}

console.log(`静态资源引用 ${assets.size} 个`);
for (const [ref, meta] of assets) {
  if (!meta.exists) problems.push(`资源不存在: ${ref}（引用位置 ${meta.from}）`);
}

console.log(`站内链接引用 ${links.size} 个`);
const specialRoutes = new Set(["/feed.xml", "/sitemap.xml", "/robots.txt"]);
for (const [ref, from] of links) {
  if (ref === "/") continue;
  const clean = ref.replace(/\/$/, "");
  const seg = clean.split("/")[1];
  const known =
    specialRoutes.has(clean) ||
    routes.has(clean) ||
    [...routes].some((route) => route.split("/")[1] === seg);
  if (!known) problems.push(`站内链接没有对应页面: ${ref}（引用位置 ${from}）`);
}

if (audios.size > 0) {
  const missing = [...audios].filter((ref) => !fs.existsSync(path.join(publicDir, ref.slice(1))));
  if (missing.length > 0) {
    notices.push(`播放器有 ${missing.length} 首音频还没放文件，当前是演示模式: ${missing.join(", ")}`);
  }
}

/* ---------- 3. 敏感信息 ---------- */
const secretPattern = /eyJhbGciOi[A-Za-z0-9_-]{20,}|SUPABASE_SERVICE_ROLE_KEY\s*=\s*ey[A-Za-z0-9._-]{20,}/;
for (const file of files) {
  // .env.local / .env 本来就该放密钥，且已被 .gitignore 忽略，不参与扫描
  if (rel(file).endsWith("package-lock.json") || rel(file) === SELF || path.basename(file).startsWith(".env")) continue;
  if (secretPattern.test(fs.readFileSync(file, "utf8"))) problems.push(`疑似把密钥写进了文件: ${rel(file)}`);
}
if (fs.existsSync(path.join(root, ".env.local"))) {
  notices.push(".env.local 存在（本地开发正常），提交代码前别把它提交上去");
}
const gitignorePath = path.join(root, ".gitignore");
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, "utf8");
  if (!/^\.env$/m.test(gitignore) || !/\.env\*\.local/m.test(gitignore)) {
    problems.push(".gitignore 没有完整忽略 .env / .env*.local");
  }
}

/* ---------- 4. 遗留文案 ---------- */
for (const word of forbidden) {
  for (const file of files) {
    if (!textExt.has(path.extname(file)) || rel(file).endsWith("package-lock.json") || rel(file) === SELF) continue;
    fs.readFileSync(file, "utf8")
      .split(/\r?\n/)
      .forEach((line, index) => {
        if (line.includes(word)) problems.push(`遗留文案「${word}」: ${rel(file)}:${index + 1} → ${line.trim().slice(0, 70)}`);
      });
  }
}

/* ---------- 结论 ---------- */
console.log("\n===================== 自检结果 =====================");
if (problems.length === 0) console.log("没有发现问题。");
else {
  console.log(`发现 ${problems.length} 个问题：`);
  problems.forEach((line) => console.log("  ✗ " + line));
}
if (notices.length > 0) {
  console.log(`\n提示 ${notices.length} 条：`);
  notices.forEach((line) => console.log("  · " + line));
}
console.log("");
process.exitCode = problems.length > 0 ? 1 : 0;

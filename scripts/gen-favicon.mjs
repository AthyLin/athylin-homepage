/**
 * 生成真正的 public/favicon.ico（16×16 + 32×32，32 位带透明通道）。
 *
 * 浏览器即使看到 <link rel="icon" href="/favicon.svg">，仍会额外请求 /favicon.ico，
 * 没有这个文件就会在控制台留下 "Failed to load resource: 404"。这个脚本把它补上。
 *
 * 运行： npm run assets   （或单独 node scripts/gen-favicon.mjs）
 */
import fs from "node:fs";
import path from "node:path";

const PUB = path.join(process.cwd(), "public");

/* ---------- 绘制：圆角方形渐变底 + 白色圆头 + 光柱 ---------- */

const START = [0xa1, 0x8c, 0xd1]; // #a18cd1
const END = [0xa1, 0xc4, 0xfd]; // #a1c4fd

function insideRoundedRect(x, y, radius) {
  const r = radius;
  if (x >= r && x <= 1 - r) return y >= 0 && y <= 1;
  if (y >= r && y <= 1 - r) return x >= 0 && x <= 1;
  const cx = x < r ? r : 1 - r;
  const cy = y < r ? r : 1 - r;
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
}

/** 返回该采样点的 RGBA（0-255），不在图形内则返回 null */
function sampleColor(x, y) {
  if (!insideRoundedRect(x, y, 0.26)) return null;

  const t = Math.max(0, Math.min(1, (x + y) / 2));
  let r = START[0] + (END[0] - START[0]) * t;
  let g = START[1] + (END[1] - START[1]) * t;
  let b = START[2] + (END[2] - START[2]) * t;

  // 圆头
  const headDistance = Math.hypot(x - 0.5, y - 0.47);
  if (headDistance <= 0.205) {
    const edge = Math.min(1, (0.205 - headDistance) / 0.02);
    const alpha = 0.95 * edge;
    r = r * (1 - alpha) + 255 * alpha;
    g = g * (1 - alpha) + 255 * alpha;
    b = b * (1 - alpha) + 255 * alpha;
  }

  // 下方光柱（梯形）
  if (y >= 0.625 && y <= 0.86) {
    const progress = (y - 0.625) / 0.235;
    const halfWidth = 0.08 - 0.02 * progress;
    if (Math.abs(x - 0.5) <= halfWidth) {
      const alpha = 0.78;
      r = r * (1 - alpha) + 255 * alpha;
      g = g * (1 - alpha) + 255 * alpha;
      b = b * (1 - alpha) + 255 * alpha;
    }
  }

  return [Math.round(r), Math.round(g), Math.round(b), 255];
}

/** 用 4×4 超采样渲染成 RGBA 像素数组 */
function render(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const SS = 4;
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = (px + (sx + 0.5) / SS) / size;
          const y = (py + (sy + 0.5) / SS) / size;
          const color = sampleColor(x, y);
          if (!color) continue;
          r += color[0];
          g += color[1];
          b += color[2];
          a += color[3];
        }
      }
      const samples = SS * SS;
      const offset = (py * size + px) * 4;
      if (a === 0) continue;
      const cover = a / (255 * samples); // 覆盖率
      pixels[offset] = Math.round(r / samples / cover);
      pixels[offset + 1] = Math.round(g / samples / cover);
      pixels[offset + 2] = Math.round(b / samples / cover);
      pixels[offset + 3] = Math.round(a / samples);
    }
  }
  return pixels;
}

/* ---------- 打包成 ICO ---------- */

function buildIcoImage(size) {
  const rgba = render(size);
  const headerSize = 40;
  const xorSize = size * size * 4;
  const andRowSize = Math.ceil(size / 32) * 4; // 1bpp，按 4 字节对齐
  const andSize = andRowSize * size;
  const image = Buffer.alloc(headerSize + xorSize + andSize);

  // BITMAPINFOHEADER
  image.writeUInt32LE(40, 0); // biSize
  image.writeInt32LE(size, 4); // biWidth
  image.writeInt32LE(size * 2, 8); // biHeight（XOR + AND）
  image.writeUInt16LE(1, 12); // biPlanes
  image.writeUInt16LE(32, 14); // biBitCount
  image.writeUInt32LE(0, 16); // biCompression = BI_RGB

  // 像素数据：BGRA，自下而上
  for (let y = 0; y < size; y++) {
    const srcRow = size - 1 - y;
    for (let x = 0; x < size; x++) {
      const src = (srcRow * size + x) * 4;
      const dst = headerSize + (y * size + x) * 4;
      image[dst] = rgba[src + 2]; // B
      image[dst + 1] = rgba[src + 1]; // G
      image[dst + 2] = rgba[src]; // R
      image[dst + 3] = rgba[src + 3]; // A
    }
  }
  // AND 掩码留全 0（32 位图标靠 alpha 通道）
  return image;
}

const sizes = [16, 32];
const images = sizes.map((size) => buildIcoImage(size));

const directory = Buffer.alloc(6 + 16 * images.length);
directory.writeUInt16LE(0, 0); // reserved
directory.writeUInt16LE(1, 2); // type = icon
directory.writeUInt16LE(images.length, 4); // count

let offset = directory.length;
images.forEach((image, index) => {
  const size = sizes[index];
  const entry = 6 + index * 16;
  directory[entry] = size === 256 ? 0 : size; // width
  directory[entry + 1] = size === 256 ? 0 : size; // height
  directory[entry + 2] = 0; // 调色板数
  directory[entry + 3] = 0; // reserved
  directory.writeUInt16LE(1, entry + 4); // planes
  directory.writeUInt16LE(32, entry + 6); // bit count
  directory.writeUInt32LE(image.length, entry + 8); // 数据长度
  directory.writeUInt32LE(offset, entry + 12); // 数据偏移
  offset += image.length;
});

const ico = Buffer.concat([directory, ...images]);
fs.mkdirSync(PUB, { recursive: true });
fs.writeFileSync(path.join(PUB, "favicon.ico"), ico);

// 自检：读回来解析一遍，确认结构正确
const check = fs.readFileSync(path.join(PUB, "favicon.ico"));
const count = check.readUInt16LE(4);
console.log(`已生成 public/favicon.ico：${(ico.length / 1024).toFixed(1)} KB，包含 ${count} 个尺寸（${sizes.join("、")}px）`);

/**
 * 浏览器端直接调用 GitHub API 的小封装（发布后台用）。
 *
 * 为什么可以没有后端：所有写操作都通过 GitHub Contents API 完成，
 * 提交进仓库后由 GitHub Actions 自动重新构建部署。
 * Token 只保存在你自己的浏览器 localStorage 里，不会上传到任何第三方。
 */

export const ADMIN_REPO = {
  owner: "AthyLin",
  repo: "athylin-homepage",
  branch: "main",
};

const API = `https://api.github.com/repos/${ADMIN_REPO.owner}/${ADMIN_REPO.repo}`;

function headers(token: string, extra: Record<string, string> = {}) {
  return {
    authorization: `Bearer ${token}`,
    accept: "application/vnd.github+json",
    "content-type": "application/json",
    ...extra,
  };
}

async function request<T>(token: string, url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: headers(token, (init?.headers as Record<string, string>) ?? {}) });
  const text = await response.text();
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const parsed = JSON.parse(text) as { message?: string };
      if (parsed.message) message = parsed.message;
    } catch {
      /* 忽略 */
    }
    throw new Error(message);
  }
  return (text ? JSON.parse(text) : {}) as T;
}

/** 校验 token 是否可用，返回登录名 */
export async function verifyToken(token: string) {
  const user = await request<{ login: string }>(token, "https://api.github.com/user");
  return user.login;
}

/** 读取仓库里的文本文件，返回内容与 sha（更新时需要带上 sha） */
export async function readTextFile(token: string, path: string) {
  const data = await request<{ content: string; sha: string }>(
    token,
    `${API}/contents/${path}?ref=${ADMIN_REPO.branch}`,
  );
  return { text: base64ToText(data.content), sha: data.sha };
}

/** 写入（或新建）文本文件 */
export async function writeTextFile(token: string, path: string, text: string, message: string, sha?: string) {
  return request(token, `${API}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: textToBase64(text),
      branch: ADMIN_REPO.branch,
      ...(sha ? { sha } : {}),
    }),
  });
}

/** 上传二进制文件（图片） */
export async function uploadBinaryFile(token: string, path: string, blob: Blob, message: string) {
  const base64 = await blobToBase64(blob);
  return request(token, `${API}/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: base64, branch: ADMIN_REPO.branch }),
  });
}

/** 删除文件 */
export async function deleteFile(token: string, path: string, sha: string, message: string) {
  return request(token, `${API}/contents/${path}`, {
    method: "DELETE",
    body: JSON.stringify({ message, sha, branch: ADMIN_REPO.branch }),
  });
}

/** 看看文件是否存在（拿它的 sha） */
export async function getFileSha(token: string, path: string) {
  try {
    const data = await request<{ sha: string }>(token, `${API}/contents/${path}?ref=${ADMIN_REPO.branch}`);
    return data.sha;
  } catch {
    return null;
  }
}

/* ---------------- 编码工具 ---------------- */

export function textToBase64(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function base64ToText(base64: string) {
  const binary = atob(base64.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("读取文件失败"));
    reader.readAsDataURL(blob);
  });
}

/** 浏览器端压缩图片：最长边缩到 maxSize，转成 JPEG（大幅减小仓库体积） */
export async function compressImage(file: File, maxSize = 1600, quality = 0.82): Promise<Blob> {
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    return blob ?? file;
  } catch {
    return file;
  }
}

/** 生成安全的文件名：20260921-203012-a1b2.jpg */
export function makeFileName(extension = "jpg") {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(
    now.getMinutes(),
  )}${pad(now.getSeconds())}`;
  const random = Math.random().toString(16).slice(2, 6);
  return `${stamp}-${random}.${extension}`;
}

/** 根据图片尺寸给出照片墙用的 height 字段 */
export async function detectPhotoHeight(file: File): Promise<"tall" | "wide" | "normal"> {
  try {
    const bitmap = await createImageBitmap(file);
    const ratio = bitmap.height / bitmap.width;
    if (ratio > 1.25) return "tall";
    if (ratio < 0.8) return "wide";
    return "normal";
  } catch {
    return "normal";
  }
}

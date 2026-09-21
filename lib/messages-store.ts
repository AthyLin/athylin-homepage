import fs from "node:fs";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 留言数据存储层 —— 两种后端自动切换：
 *
 * 1. 配了 SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY → 走 Supabase 云端
 *    （部署到 Vercel / Netlify 这类无状态环境必须用这个，否则写不进文件）
 * 2. 没配 → 回落到本地 JSON 文件 .data/messages.json，本地开发够用
 *
 * 安全提醒：service_role key 是服务端密钥，只能出现在服务端文件里，
 * 不要加 NEXT_PUBLIC_ 前缀，也不要 import 进任何 "use client" 组件。
 *
 * 建表 SQL 见 supabase/messages-schema.sql。
 */

export type Message = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  likes: number;
  avatarColor: string;
};

/** 数据库行（snake_case）→ 前端使用的结构（camelCase） */
type Row = {
  id: string;
  name: string;
  content: string;
  likes: number;
  created_at: string;
};

const COLORS = ["#8b5cf6", "#ec4899", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e"];
const TABLE = "messages";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

/** 当前实际使用的后端：supabase | local-json */
export const MESSAGE_STORE: "supabase" | "local-json" = supabase ? "supabase" : "local-json";

/** 点赞结果：区分「这条留言不存在」和「后端出错了」，方便接口返回正确的状态码 */
export type LikeResult =
  | { ok: true; message: Message }
  | { ok: false; reason: "not-found" | "backend-error" };

/** 用 id 算一个稳定的头像底色，换后端也不会让颜色乱跳 */
function colorFor(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return COLORS[hash % COLORS.length];
}

function toMessage(row: Row): Message {
  return {
    id: row.id,
    name: row.name,
    content: row.content,
    createdAt: row.created_at,
    likes: row.likes,
    avatarColor: colorFor(row.id),
  };
}

/* ---------------- 本地 JSON 兜底 ---------------- */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "messages.json");

/**
 * 创建本地数据文件。
 * 有些环境（例如 Vercel 的 Serverless 函数）文件系统是只读的，这里必须容忍失败，
 * 否则会直接抛异常把接口打成 500。
 */
function ensureFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf8");
  } catch (error) {
    console.error(
      "[messages] 无法创建本地数据文件（部署环境通常是只读文件系统，请配置 SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY）:",
      error instanceof Error ? error.message : error,
    );
  }
}

function readLocal(): Message[] {
  try {
    ensureFile();
    const list = JSON.parse(fs.readFileSync(FILE, "utf8")) as Message[];
    return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    // 文件不存在、内容损坏或文件系统只读：当作空列表，不让接口崩掉
    return [];
  }
}

/** 返回是否写入成功 */
function writeLocal(list: Message[]): boolean {
  try {
    ensureFile();
    fs.writeFileSync(FILE, JSON.stringify(list, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error(
      "[messages] 本地写入失败（部署环境请改用 Supabase 云端存储）:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}

/* ---------------- 对外接口（两种后端共用同一组签名） ---------------- */

/** 读取留言（最新在前，最多 200 条） */
export async function readMessages(): Promise<Message[]> {
  if (!supabase) return readLocal();

  const { data, error } = await supabase
    .from(TABLE)
    .select("id, name, content, likes, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[messages] Supabase 读取失败:", error.message);
    return [];
  }
  return ((data ?? []) as Row[]).map(toMessage);
}

/** 新增留言，失败返回 null */
export async function addMessage(name: string, content: string): Promise<Message | null> {
  const payload = {
    name: name.trim().slice(0, 20) || "匿名访客",
    content: content.trim().slice(0, 500),
  };

  if (!supabase) {
    const list = readLocal();
    const message: Message = {
      id: `${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
      likes: 0,
      avatarColor: COLORS[list.length % COLORS.length],
    };
    return writeLocal([message, ...list]) ? message : null;
  }

  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) {
    console.error("[messages] Supabase 写入失败:", error.message);
    return null;
  }
  return toMessage(data as Row);
}

/** 点赞 +1，走数据库函数做原子自增 */
export async function likeMessage(id: string): Promise<LikeResult> {
  if (!supabase) {
    const list = readLocal();
    const target = list.find((item) => item.id === id);
    if (!target) return { ok: false, reason: "not-found" };
    target.likes += 1;
    return writeLocal(list) ? { ok: true, message: target } : { ok: false, reason: "backend-error" };
  }

  const { data, error } = await supabase.rpc("like_message", { msg_id: id });
  if (error) {
    console.error("[messages] Supabase 点赞失败:", error.message);
    return { ok: false, reason: "backend-error" };
  }
  // 函数返回单行，PostgREST 可能给对象或数组，两种都兼容
  const row = (Array.isArray(data) ? data[0] : data) as Row | null;
  if (!row) return { ok: false, reason: "not-found" };
  return { ok: true, message: toMessage(row) };
}

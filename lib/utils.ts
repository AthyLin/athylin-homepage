import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** 合并 Tailwind 类名，后面的类会覆盖前面的冲突类 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 站点统一时区。
 * 日期一律按这个时区展示，不受访客本地时区影响 ——
 * 否则服务端（构建机器/服务器）与浏览器可能算出不同的日期，导致水合报错。
 */
export const SITE_TIME_ZONE = "Asia/Shanghai";

/** 按站点时区取出年/月/日 */
function datePartsInSiteTimeZone(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const pick = (type: "year" | "month" | "day") =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");
  return { year: pick("year"), month: pick("month"), day: pick("day") };
}

/** 2026-03-08 -> 2026 年 3 月 8 日（按站点时区，服务端与浏览器结果一致） */
export function formatDate(input: string, withYear = true) {
  const parts = datePartsInSiteTimeZone(input);
  if (!parts) return input;
  return withYear
    ? `${parts.year} 年 ${parts.month} 月 ${parts.day} 日`
    : `${parts.month} 月 ${parts.day} 日`;
}

/** 2026-03-08T21:40:00 -> 2026 年 3 月 8 日 21:40（同样固定时区，避免水合不一致） */
export function formatDateTime(input: string) {
  const date = new Date(input);
  const parts = datePartsInSiteTimeZone(input);
  if (Number.isNaN(date.getTime()) || !parts) return input;
  const time = new Intl.DateTimeFormat("zh-CN", {
    timeZone: SITE_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
  return `${parts.year} 年 ${parts.month} 月 ${parts.day} 日 ${time}`;
}

/** 计算从某个时间到今天过了多少天（至少 1 天） */
export function daysSince(input: string) {
  const start = new Date(input).getTime();
  if (Number.isNaN(start)) return 1;
  return Math.max(1, Math.floor((Date.now() - start) / 86400000));
}

/**
 * 相对时间：3 天前 / 刚刚。
 * 依赖「当前时间」，在客户端组件里请只在挂载后渲染它，
 * 否则服务端构建时的结果和浏览器算出来的会不一样，触发水合报错。
 */
export function timeAgo(input: string) {
  const diff = Date.now() - new Date(input).getTime();
  if (Number.isNaN(diff)) return input;
  const minute = 60000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "刚刚";
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`;
  return formatDate(input, false);
}

/** 中文友好的阅读时长估算 */
export function estimateReadingTime(text: string) {
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = (text.replace(/[\u4e00-\u9fa5]/g, " ").match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 350 + words / 200));
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINES = [
  "欢迎来到小站，随便逛逛吧～",
  "今天也要好好吃饭哦。",
  "点一下导航栏的 Logo 七次试试？",
  "文章里的代码块是可以选中的～",
  "右下角有播放器，要不要听首歌？",
  "把鼠标放在卡片上，它们会轻轻浮起来。",
  "夜里看博客记得开深色模式。",
];

/**
 * 轻量看板娘：纯 CSS 动画的小家伙，点击会说话。
 * 想换成 Live2D，只需把这里替换成 live2d 的 canvas 容器即可。
 */
export default function Mascot() {
  const [open, setOpen] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);
  const [bubbleOpen, setBubbleOpen] = useState(true);

  const line = useMemo(() => LINES[lineIndex % LINES.length], [lineIndex]);

  // 每隔一段时间自动换一句话
  useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => setLineIndex((prev) => prev + 1), 9000);
    return () => window.clearInterval(timer);
  }, [open]);

  if (!open) {
    return (
      <button
        type="button"
        data-no-effect
        onClick={() => setOpen(true)}
        aria-label="召唤看板娘"
        className="glass-card fixed bottom-24 left-4 z-40 hidden h-10 w-10 place-items-center rounded-full sm:grid"
      >
        <Sparkles className="h-4 w-4 text-brand-500" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 left-4 z-40 hidden items-end gap-2 sm:flex">
      {/* 对话气泡 */}
      <div
        className={cn(
          "glass-card relative mb-6 max-w-[13rem] px-3 py-2 text-xs text-gray-700 transition-all duration-300 dark:text-gray-200",
          bubbleOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        {line}
        <span className="absolute -right-1 -bottom-1 h-3 w-3 rotate-45 border-r border-b border-white/50 bg-white/45 dark:border-white/10 dark:bg-slate-700/60" />
        <button
          type="button"
          onClick={() => setBubbleOpen(false)}
          aria-label="收起对话"
          data-no-effect
          className="absolute -top-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-white/80 text-gray-500 shadow dark:bg-slate-800/80"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      {/* 小家伙本体 */}
      <button
        type="button"
        data-no-effect
        onClick={() => {
          setLineIndex((prev) => prev + 1);
          setBubbleOpen(true);
        }}
        aria-label="和看板娘打招呼"
        className="group relative h-28 w-24 rounded-2xl transition-transform hover:scale-105"
      >
        <span className="absolute inset-x-4 bottom-0 h-3 rounded-full bg-black/10 blur-sm dark:bg-black/30" />
        <svg viewBox="0 0 120 140" className="animate-float h-full w-full drop-shadow-lg">
          <defs>
            <linearGradient id="mascot-body" x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="mascot-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="100%" stopColor="#e0e7ff" />
            </linearGradient>
          </defs>
          <ellipse cx="60" cy="132" rx="26" ry="5" fill="rgba(31,38,135,0.18)" />
          <path d="M34 58 L28 30 L52 44 Z" fill="url(#mascot-glow)" />
          <path d="M86 58 L92 30 L68 44 Z" fill="url(#mascot-glow)" />
          <circle cx="60" cy="70" r="40" fill="url(#mascot-body)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
          <circle cx="45" cy="64" r="5" fill="#3b3660" />
          <circle cx="75" cy="64" r="5" fill="#3b3660" />
          <circle cx="46.6" cy="62" r="1.7" fill="#fff" />
          <circle cx="76.6" cy="62" r="1.7" fill="#fff" />
          <path d="M50 82 q10 9 20 0" stroke="#3b3660" strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <circle cx="34" cy="78" r="6" fill="rgba(251,194,235,0.65)" />
          <circle cx="86" cy="78" r="6" fill="rgba(251,194,235,0.65)" />
          <path d="M60 40 q6 -10 14 -12" stroke="rgba(161,140,209,0.8)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="78" cy="26" r="4" fill="#818cf8" />
          <g className="group-hover:animate-pulse-ring">
            <circle cx="60" cy="70" r="42" fill="none" stroke="rgba(161,140,209,0.35)" strokeWidth="1.5" />
          </g>
        </svg>
      </button>
    </div>
  );
}

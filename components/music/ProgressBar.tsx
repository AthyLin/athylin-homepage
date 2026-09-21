"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  max: number;
  onSeek: (seconds: number) => void;
  className?: string;
};

/** 可点击 / 拖拽的播放进度条 */
export default function ProgressBar({ value, max, onSeek, className }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  const seekByEvent = (clientX: number) => {
    const bar = barRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onSeek(ratio * max);
  };

  return (
    <div
      ref={barRef}
      role="slider"
      tabIndex={0}
      aria-label="播放进度"
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
      aria-valuenow={Math.round(value)}
      data-no-effect
      onClick={(event) => seekByEvent(event.clientX)}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") onSeek(Math.min(max, value + 5));
        if (event.key === "ArrowLeft") onSeek(Math.max(0, value - 5));
      }}
      className={cn("group relative h-1.5 w-full cursor-pointer rounded-full bg-white/40 dark:bg-white/15", className)}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-400 to-sky-400"
        style={{ width: `${percent}%` }}
      />
      <span
        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md transition-opacity group-hover:opacity-100 sm:opacity-0"
        style={{ left: `${percent}%` }}
      />
    </div>
  );
}

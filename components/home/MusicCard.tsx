"use client";

import Image from "next/image";
import { Disc3, ListMusic, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { formatDuration, useMusic } from "@/components/providers/MusicProvider";
import ProgressBar from "@/components/music/ProgressBar";
import { cn } from "@/lib/utils";

export default function MusicCard() {
  const { tracks, track, index, playing, progress, demo, toggle, next, prev, select, seek } = useMusic();

  return (
    <section className="glass-card glass-sheen flex w-full flex-col gap-4 p-5">
      <header className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <ListMusic className="h-4 w-4 text-brand-500" />
          正在听
        </h2>
        <span className="text-[11px] text-gray-500 dark:text-gray-400">
          {index + 1} / {tracks.length}
        </span>
      </header>

      {/* 唱片 */}
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0">
          <div
            className={cn(
              "relative h-full w-full overflow-hidden rounded-full border-4 border-white/70 shadow-xl",
              playing && "animate-[spin_9s_linear_infinite]",
            )}
          >
            <Image src={track.cover} alt={track.title} fill sizes="96px" className="object-cover" />
            <span className="absolute inset-[38%] rounded-full bg-white/85 shadow-inner dark:bg-slate-800/90" />
          </div>
          <Disc3
            className={cn(
              "absolute inset-0 h-full w-full text-white/40",
              playing ? "animate-[spin_9s_linear_infinite]" : "",
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-gray-800 dark:text-gray-100">{track.title}</p>
          <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{track.artist}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] tabular-nums text-gray-500 dark:text-gray-400">{formatDuration(progress)}</span>
            <ProgressBar value={progress} max={track.duration} onSeek={seek} />
            <span className="text-[10px] tabular-nums text-gray-500 dark:text-gray-400">{formatDuration(track.duration)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button type="button" onClick={prev} aria-label="上一首" data-no-effect className="glass-button grid h-9 w-9 place-items-center">
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "暂停" : "播放"}
          data-no-effect
          className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-sky-400 text-white shadow-lg transition-transform hover:scale-105"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <button type="button" onClick={next} aria-label="下一首" data-no-effect className="glass-button grid h-9 w-9 place-items-center">
          <SkipForward className="h-4 w-4" />
        </button>
      </div>

      {/* 简版歌单 */}
      <ul className="space-y-1">
        {tracks.slice(0, 3).map((item, itemIndex) => (
          <li key={item.id}>
            <button
              type="button"
              data-no-effect
              onClick={() => select(itemIndex)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                itemIndex === index
                  ? "bg-brand-500/15 text-brand-600 dark:text-brand-200"
                  : "text-gray-600 hover:bg-white/60 dark:text-gray-300 dark:hover:bg-white/10",
              )}
            >
              <span className="w-3 text-center text-[10px] text-gray-400">{itemIndex + 1}</span>
              <span className="flex-1 truncate">{item.title}</span>
              <span className="text-[10px] text-gray-400">{formatDuration(item.duration)}</span>
            </button>
          </li>
        ))}
      </ul>

      {demo ? <p className="text-center text-[10px] text-gray-500 dark:text-gray-400">演示模式（未检测到音频文件）</p> : null}
    </section>
  );
}

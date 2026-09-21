"use client";

import { useState } from "react";
import Image from "next/image";
import { ListMusic, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { formatDuration, useMusic } from "@/components/providers/MusicProvider";
import ProgressBar from "@/components/music/ProgressBar";
import { cn } from "@/lib/utils";

/** 底部固定的迷你播放器：全站可见，可展开歌单 */
export default function MusicPlayer() {
  const { tracks, track, index, playing, progress, demo, toggle, next, prev, select, seek } = useMusic();
  const [listOpen, setListOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3 sm:px-6 sm:pb-4">
      <div className="glass-card glass-sheen pointer-events-auto relative w-full max-w-3xl overflow-hidden px-3 py-2.5 sm:px-4">
        {/* 歌单弹层 */}
        <div
          className={cn(
            "absolute right-2 left-2 bottom-[4.4rem] origin-bottom rounded-2xl border border-white/40 bg-white/75 p-2 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/75",
            listOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
          )}
        >
          <p className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">播放列表（{tracks.length}）</p>
          <ul className="max-h-56 overflow-y-auto">
            {tracks.map((item, itemIndex) => (
              <li key={item.id}>
                <button
                  type="button"
                  data-no-effect
                  onClick={() => {
                    select(itemIndex);
                    setListOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm transition-colors",
                    itemIndex === index
                      ? "bg-brand-500/15 text-brand-600 dark:text-brand-200"
                      : "text-gray-600 hover:bg-white/70 dark:text-gray-300 dark:hover:bg-white/10",
                  )}
                >
                  <span className="w-5 text-center text-xs text-gray-400">{itemIndex + 1}</span>
                  <span className="flex-1 truncate">{item.title}</span>
                  <span className="text-xs text-gray-400">{formatDuration(item.duration)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl shadow-md">
            <Image src={track.cover} alt={track.title} fill sizes="44px" className={cn("object-cover", playing && "animate-float-slow")} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">{track.title}</p>
              <p className="hidden truncate text-xs text-gray-500 sm:block dark:text-gray-400">{track.artist}</p>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="hidden text-[10px] tabular-nums text-gray-500 sm:block dark:text-gray-400">
                {formatDuration(progress)}
              </span>
              <ProgressBar value={progress} max={track.duration} onSeek={seek} />
              <span className="hidden text-[10px] tabular-nums text-gray-500 sm:block dark:text-gray-400">
                {formatDuration(track.duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button type="button" onClick={prev} aria-label="上一首" className="glass-button grid h-9 w-9 place-items-center" data-no-effect>
              <SkipBack className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "暂停" : "播放"}
              data-no-effect
              className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-sky-400 text-white shadow-lg transition-transform hover:scale-105"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button type="button" onClick={next} aria-label="下一首" className="glass-button grid h-9 w-9 place-items-center" data-no-effect>
              <SkipForward className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setListOpen((open) => !open)}
              aria-label="播放列表"
              data-no-effect
              className={cn("glass-button hidden h-9 w-9 place-items-center sm:grid", listOpen && "text-brand-500")}
            >
              <ListMusic className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {demo ? (
          <p className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
            <Volume2 className="h-3 w-3" />
            演示模式：把音频放到 public/music/ 下同名文件即可真实播放
          </p>
        ) : null}
      </div>
    </div>
  );
}

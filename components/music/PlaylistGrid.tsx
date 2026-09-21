"use client";

import Image from "next/image";
import { Music2, Pause, Play } from "lucide-react";
import { formatDuration, useMusic } from "@/components/providers/MusicProvider";
import { isAudioAvailable } from "@/lib/music-files";
import { cn } from "@/lib/utils";

/** 音乐页歌单：点击任意一首即可播放（全站播放器同步） */
export default function PlaylistGrid() {
  const { tracks, index, playing, select, toggle } = useMusic();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tracks.map((track, trackIndex) => {
        const isCurrent = trackIndex === index;
        const isPlaying = isCurrent && playing;
        return (
          <article
            key={track.id}
            className={cn(
              "glass-card glass-card-hover glass-sheen group flex items-center gap-4 p-4",
              isCurrent && "ring-2 ring-brand-400/60",
            )}
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl shadow-md">
              <Image
                src={track.cover}
                alt={track.title}
                fill
                sizes="64px"
                className={cn("object-cover", isPlaying && "animate-[spin_9s_linear_infinite]")}
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">{track.title}</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{track.artist}</p>
              <p className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                {formatDuration(track.duration)}
                {!isAudioAvailable(track.src) ? (
                  <span className="rounded-full bg-white/50 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-white/10 dark:text-gray-400">
                    未上传
                  </span>
                ) : null}
              </p>
            </div>

            <button
              type="button"
              data-no-effect
              aria-label={isPlaying ? "暂停" : "播放"}
              onClick={() => (isCurrent ? toggle() : select(trackIndex))}
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-all",
                isCurrent
                  ? "bg-gradient-to-br from-brand-500 to-sky-400 text-white shadow-lg"
                  : "glass-button text-gray-700 dark:text-gray-200",
              )}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </article>
        );
      })}

      <article className="glass-card flex flex-col items-center justify-center gap-2 p-6 text-center">
        <Music2 className="h-5 w-5 text-brand-500" />
        <p className="text-xs text-gray-600 dark:text-gray-300">把自己喜欢的音乐放进 public/music/</p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">并在 site.config.ts 的 playlist 里登记即可</p>
      </article>
    </div>
  );
}

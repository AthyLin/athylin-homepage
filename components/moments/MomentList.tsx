"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, ImageIcon, MessageCircle } from "lucide-react";
import type { Moment } from "@/data/moments";
import { cn, formatDate, formatDateTime, timeAgo } from "@/lib/utils";

/** 说说时间线：点赞状态保存在本地 */
export default function MomentList({ moments }: { moments: Moment[] }) {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  /**
   * 相对时间（"3 天前"）依赖运行时刻，服务端构建时的结果和浏览器算出来的会不一样。
   * 所以首屏先用固定日期，挂载后再切换成相对时间，避免水合报错。
   */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setLiked(JSON.parse(localStorage.getItem("moment-likes") ?? "{}") as Record<string, boolean>);
    } catch {
      setLiked({});
    }
  }, []);

  const toggle = (id: string) => {
    setLiked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem("moment-likes", JSON.stringify(next));
      return next;
    });
  };

  return (
    <ol className="relative flex flex-col gap-4 border-l border-white/50 pl-5 sm:pl-7 dark:border-white/10">
      {moments.map((moment) => {
        const isLiked = Boolean(liked[moment.id]);
        return (
          <li key={moment.id} className="relative">
            <span className="absolute top-6 -left-[1.42rem] grid h-3 w-3 place-items-center sm:-left-[2.02rem]">
              <span className="h-3 w-3 rounded-full border-2 border-white bg-gradient-to-br from-brand-400 to-sky-400 shadow dark:border-slate-800" />
            </span>

            <article className="glass-card glass-card-hover glass-sheen p-4 sm:p-5">
              <header className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="glass-pill px-2.5 py-0.5 text-[11px] text-gray-600 dark:text-gray-300">
                  {moment.mood}
                </span>
                <time dateTime={moment.date}>{mounted ? timeAgo(moment.date) : formatDate(moment.date)}</time>
                <time className="hidden sm:inline" dateTime={moment.date}>
                  · {formatDateTime(moment.date)}
                </time>
              </header>

              <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-200">{moment.content}</p>

              {moment.images?.length ? (
                <div className={cn("mt-3 grid gap-2", moment.images.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
                  {moment.images.map((src) => (
                    <a
                      key={src}
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      className="relative block aspect-[4/3] overflow-hidden rounded-xl"
                    >
                      <Image
                        src={src}
                        alt="说说配图"
                        fill
                        sizes="(max-width:640px) 100vw, 420px"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <span className="absolute right-2 bottom-2 rounded-full bg-black/40 p-1 text-white">
                        <ImageIcon className="h-3.5 w-3.5" />
                      </span>
                    </a>
                  ))}
                </div>
              ) : null}

              <footer className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <button
                  type="button"
                  data-no-effect
                  onClick={() => toggle(moment.id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all",
                    isLiked
                      ? "bg-pink-400/25 text-pink-600 dark:text-pink-200"
                      : "hover:bg-white/50 dark:hover:bg-white/10",
                  )}
                >
                  <Heart className={cn("h-3.5 w-3.5", isLiked && "fill-current")} />
                  {moment.likes + (isLiked ? 1 : 0)}
                </button>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {moment.comments}
                </span>
              </footer>
            </article>
          </li>
        );
      })}
    </ol>
  );
}

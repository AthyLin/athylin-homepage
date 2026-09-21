"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "@/components/ui/AppImage";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Photo } from "@/lib/content";
import { cn, formatDate } from "@/lib/utils";

/** 照片墙：相册筛选 + 瀑布流 + 灯箱（支持键盘左右切换与 Esc 关闭） */
export default function PhotoGallery({ photos, albums }: { photos: Photo[]; albums: string[] }) {
  const [album, setAlbum] = useState("全部");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (album === "全部" ? photos : photos.filter((photo) => photo.album === album)),
    [photos, album],
  );

  const current = activeIndex === null ? null : filtered[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((index) => ((index ?? 0) + 1) % filtered.length);
      if (event.key === "ArrowLeft") setActiveIndex((index) => ((index ?? 0) - 1 + filtered.length) % filtered.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, filtered.length]);

  return (
    <div className="flex flex-col gap-4">
      <div className="glass-card glass-sheen flex flex-wrap items-center gap-2 p-3">
        {["全部", ...albums].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setAlbum(name);
              setActiveIndex(null);
            }}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs transition-all",
              album === name
                ? "bg-brand-600 text-white shadow-md"
                : "glass-pill text-gray-600 hover:text-brand-500 dark:text-gray-300",
            )}
          >
            {name}
          </button>
        ))}
        <span className="ml-auto pr-1 text-[11px] text-gray-500 dark:text-gray-400">共 {filtered.length} 张</span>
      </div>

      <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
        {filtered.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            data-no-effect
            onClick={() => setActiveIndex(index)}
            className="group relative block w-full overflow-hidden rounded-2xl border border-white/45 shadow-lg transition-transform duration-300 hover:-translate-y-1 dark:border-white/10"
          >
            <Image
              src={photo.src}
              alt={photo.title}
              width={900}
              height={photo.height === "tall" ? 1200 : photo.height === "wide" ? 620 : 1000}
              sizes="(max-width:640px) 50vw, 320px"
              className="h-auto w-full object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="absolute inset-x-0 bottom-0 p-3 text-left opacity-0 transition-opacity group-hover:opacity-100">
              <span className="block text-xs font-medium text-white">{photo.title}</span>
              <span className="mt-0.5 block text-[10px] text-white/80">
                {photo.album} · {formatDate(photo.date)}
              </span>
            </span>
          </button>
        ))}
      </div>

      {current ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            aria-label="关闭"
            className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
            onClick={() => setActiveIndex(null)}
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="上一张"
            className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex((index) => ((index ?? 0) - 1 + filtered.length) % filtered.length);
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <figure className="max-h-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <div className="relative max-h-[76vh] overflow-hidden rounded-2xl border border-white/25 shadow-2xl">
              <Image
                src={current.src}
                alt={current.title}
                width={1200}
                height={900}
                className="h-auto max-h-[76vh] w-auto object-contain"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm text-white/90">
              {current.title}
              <span className="mt-1 block text-xs text-white/60">
                {current.album} · {formatDate(current.date)} · {(activeIndex ?? 0) + 1} / {filtered.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            aria-label="下一张"
            className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex((index) => ((index ?? 0) + 1) % filtered.length);
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

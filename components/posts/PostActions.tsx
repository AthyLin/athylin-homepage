"use client";

import { useEffect, useState } from "react";
import { Check, Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** 点赞（本地存储）+ 复制链接分享 */
export default function PostActions({ slug }: { slug: string }) {
  const storageKey = `post-like:${slug}`;
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(storageKey) === "1");
    setLikes(18 + slug.length * 4);
  }, [storageKey]);

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikes((count) => count + (next ? 1 : -1));
    localStorage.setItem(storageKey, next ? "1" : "0");
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggleLike}
        data-no-effect
        className={cn(
          "glass-button flex items-center gap-2 px-4 py-2 text-sm transition-all",
          liked && "bg-pink-400/25 text-pink-600 dark:text-pink-200",
        )}
      >
        <Heart className={cn("h-4 w-4", liked && "fill-current")} />
        {liked ? "已喜欢" : "喜欢"}
        <span className="tabular-nums opacity-70">{likes}</span>
      </button>

      <button type="button" onClick={share} data-no-effect className="glass-button flex items-center gap-2 px-4 py-2 text-sm">
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
        {copied ? "链接已复制" : "分享"}
      </button>
    </div>
  );
}

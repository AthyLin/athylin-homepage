"use client";

import { useMemo, useState } from "react";
import { LayoutList, Search, X } from "lucide-react";
import PostCard from "@/components/posts/PostCard";
import type { PostMeta } from "@/lib/posts";
import { cn } from "@/lib/utils";

type PostExplorerProps = {
  posts: PostMeta[];
  categories: { name: string; count: number }[];
  tags: { name: string; count: number }[];
};

/** 文章列表：搜索 + 分类 + 标签筛选（全部在客户端完成） */
export default function PostExplorer({ posts, categories, tags }: PostExplorerProps) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("全部");
  const [tag, setTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const lower = keyword.trim().toLowerCase();
    return posts.filter((post) => {
      if (category !== "全部" && post.category !== category) return false;
      if (tag && !post.tags.includes(tag)) return false;
      if (!lower) return true;
      return (
        post.title.toLowerCase().includes(lower) ||
        post.excerpt.toLowerCase().includes(lower) ||
        post.tags.some((item) => item.toLowerCase().includes(lower))
      );
    });
  }, [posts, keyword, category, tag]);

  const hasFilter = keyword.trim() !== "" || category !== "全部" || tag !== null;

  return (
    <div className="flex flex-col gap-4">
      {/* 搜索与筛选 */}
      <div className="glass-card glass-sheen flex flex-col gap-3 p-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索标题、摘要或标签…"
            className="glass-input pl-10"
          />
          {keyword ? (
            <button
              type="button"
              onClick={() => setKeyword("")}
              aria-label="清空搜索"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["全部", ...categories.map((item) => item.name)].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition-all",
                category === name
                  ? "bg-brand-600 text-white shadow-md"
                  : "glass-pill text-gray-600 hover:text-brand-500 dark:text-gray-300",
              )}
            >
              {name}
              {name !== "全部" ? (
                <span className="ml-1 opacity-70">{categories.find((item) => item.name === name)?.count}</span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-white/40 pt-3 dark:border-white/10">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">标签</span>
          {tags.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setTag((prev) => (prev === item.name ? null : item.name))}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] transition-all",
                tag === item.name
                  ? "bg-brand-500/90 text-white"
                  : "glass-pill text-gray-600 hover:text-brand-500 dark:text-gray-300",
              )}
            >
              #{item.name}
            </button>
          ))}
          {hasFilter ? (
            <button
              type="button"
              onClick={() => {
                setKeyword("");
                setCategory("全部");
                setTag(null);
              }}
              className="ml-auto flex items-center gap-1 text-[11px] text-gray-500 hover:text-brand-500 dark:text-gray-400"
            >
              <X className="h-3 w-3" />
              清除筛选
            </button>
          ) : null}
        </div>
      </div>

      <p className="flex items-center gap-2 px-1 text-xs text-gray-500 dark:text-gray-400">
        <LayoutList className="h-3.5 w-3.5" />
        共 {filtered.length} 篇文章
        {hasFilter ? `（从 ${posts.length} 篇中筛选）` : ""}
      </p>

      {/* 列表 */}
      {filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center gap-2 p-12 text-center">
          <p className="text-3xl">🍃</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">没有找到符合条件的文章</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">换个关键词或标签试试</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

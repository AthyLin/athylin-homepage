import Image from "next/image";
import Link from "next/link";
import { Clock3, Eye, Heart } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

/** 文章卡片（列表用） */
export default function PostCard({ post, compact = false }: { post: PostMeta; compact?: boolean }) {
  // 用标题长度做一个稳定的「阅读量」占位数字，替换成真实统计即可
  const views = 200 + post.title.length * 37;

  return (
    <article className="glass-card glass-card-hover glass-sheen group overflow-hidden">
      <Link href={`/posts/${post.slug}`} className="flex flex-col sm:flex-row">
        <div className={`relative overflow-hidden ${compact ? "h-40 sm:h-auto sm:w-52" : "h-44 sm:h-auto sm:w-60"} sm:shrink-0`}>
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(max-width:640px) 100vw, 240px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 rounded-full bg-black/35 px-2.5 py-0.5 text-[10px] text-white backdrop-blur">
            {post.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
          <h2 className="text-base font-semibold text-gray-800 transition-colors group-hover:text-brand-600 sm:text-lg dark:text-gray-50 dark:group-hover:text-brand-200">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{post.excerpt}</p>

          <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span>{formatDate(post.date)}</span>
            <span className="flex items-center gap-1">
              <Clock3 className="h-3 w-3" />
              {post.readingTime} 分钟
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {post.readingTime * 7}
            </span>
            <span className="ml-auto flex gap-1.5">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="glass-pill px-2 py-0.5">
                  #{tag}
                </span>
              ))}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

import Image from "@/components/ui/AppImage";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export default function LatestPostsCard({ posts }: { posts: PostMeta[] }) {
  return (
    <section className="glass-card glass-sheen flex h-full w-full flex-col gap-3 p-5">
      <header className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <span className="h-2 w-2 rounded-full bg-brand-400" />
          最近在写
        </h2>
        <Link href="/posts" className="flex items-center gap-0.5 text-[11px] text-gray-500 transition-colors hover:text-brand-500 dark:text-gray-400">
          全部文章
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </header>

      <ul className="flex flex-1 flex-col gap-2">
        {posts.slice(0, 3).map((post, index) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/55 dark:hover:bg-white/10"
            >
              <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                <Image src={post.cover} alt={post.title} fill sizes="80px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="glass-pill px-2 py-0.5 text-[10px] text-gray-600 dark:text-gray-300">{post.category}</span>
                  {index === 0 ? (
                    <span className="rounded-full bg-brand-500/90 px-2 py-0.5 text-[10px] text-white">最新</span>
                  ) : null}
                </span>
                <span className="mt-1 block truncate text-sm font-medium text-gray-800 group-hover:text-brand-600 dark:text-gray-100 dark:group-hover:text-brand-200">
                  {post.title}
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                  <span>{formatDate(post.date)}</span>
                  <span className="flex items-center gap-0.5">
                    <Clock3 className="h-3 w-3" />
                    {post.readingTime} 分钟
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

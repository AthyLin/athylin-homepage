import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Tag } from "lucide-react";
import TableOfContents from "@/components/posts/TableOfContents";
import PostActions from "@/components/posts/PostActions";
import PostComments from "@/components/posts/PostComments";
import FadeIn from "@/components/ui/FadeIn";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "文章不存在" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.cover], type: "article" },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const currentIndex = all.findIndex((item) => item.slug === post.slug);
  const prev = all[currentIndex + 1];
  const next = all[currentIndex - 1];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
      <FadeIn>
        <header className="glass-card glass-sheen overflow-hidden">
          <div className="relative h-44 w-full sm:h-60">
            <Image src={post.cover} alt={post.title} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <span className="rounded-full bg-white/25 px-3 py-1 text-[11px] text-white backdrop-blur">{post.category}</span>
              <h1 className="mt-3 text-xl font-bold text-white drop-shadow sm:text-3xl">{post.title}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4 text-xs text-gray-600 sm:p-5 dark:text-gray-300">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              约 {post.readingTime} 分钟
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              {post.tags.join(" · ")}
            </span>
          </div>
        </header>
      </FadeIn>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="flex flex-col gap-4">
          <FadeIn delay={0.05}>
            <article className="glass-card glass-sheen p-5 sm:p-8">
              <p className="mb-6 rounded-xl border-l-4 border-brand-400 bg-brand-500/10 px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                {post.excerpt}
              </p>
              <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
            </article>
          </FadeIn>

          <FadeIn delay={0.1}>
            <PostActions slug={post.slug} />
          </FadeIn>

          <FadeIn delay={0.12}>
            <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {prev ? (
                <Link href={`/posts/${prev.slug}`} className="glass-card glass-card-hover flex flex-col gap-1 p-4">
                  <span className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                    <ArrowLeft className="h-3 w-3" />
                    上一篇
                  </span>
                  <span className="line-clamp-1 text-sm font-medium text-gray-800 dark:text-gray-100">{prev.title}</span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {next ? (
                <Link href={`/posts/${next.slug}`} className="glass-card glass-card-hover flex flex-col gap-1 p-4 sm:text-right">
                  <span className="flex items-center gap-1 text-[11px] text-gray-500 sm:justify-end dark:text-gray-400">
                    下一篇
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="line-clamp-1 text-sm font-medium text-gray-800 dark:text-gray-100">{next.title}</span>
                </Link>
              ) : null}
            </nav>
          </FadeIn>

          <FadeIn delay={0.14}>
            <PostComments slug={post.slug} />
          </FadeIn>
        </div>

        <TableOfContents headings={post.headings} />
      </div>
    </div>
  );
}

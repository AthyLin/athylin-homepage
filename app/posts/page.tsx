import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import PostExplorer from "@/components/posts/PostExplorer";
import FadeIn from "@/components/ui/FadeIn";
import { getAllPosts, getCategories, getTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "文章",
  description: "技术笔记、生活记录与一些没用的浪漫。",
};

export default function PostsPage() {
  const posts = getAllPosts();
  const categories = getCategories();
  const tags = getTags();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-8">
      <FadeIn>
        <PageHeader
          title="文章"
          description="技术笔记、生活记录，以及一些没用的浪漫。"
          icon={BookOpen}
          breadcrumb="文章"
        />
      </FadeIn>
      <FadeIn delay={0.06}>
        <PostExplorer
          posts={posts.map(({ html: _html, raw: _raw, ...meta }) => meta)}
          categories={categories}
          tags={tags}
        />
      </FadeIn>
    </div>
  );
}

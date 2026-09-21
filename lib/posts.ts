import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { estimateReadingTime } from "@/lib/utils";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  cover: string;
  excerpt: string;
  readingTime: number;
};

export type Heading = { id: string; text: string; level: number };

export type Post = PostMeta & { html: string; raw: string; headings: Heading[] };

marked.setOptions({ gfm: true, breaks: false });

/** 把标题文字转成稳定的锚点 id */
function slugifyHeading(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]/g, "");
}

/** 给渲染后的 h2/h3 补上 id，并顺带收集目录数据 */
export function withHeadingIds(html: string) {
  const headings: Heading[] = [];
  const output = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_match, level: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const id = slugifyHeading(text);
    headings.push({ id, text, level: Number(level) });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  return { html: output, headings };
}

function readPostFiles() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(POSTS_DIR, file));
}

/** 读取全部文章（按日期倒序） */
export function getAllPosts(): Post[] {
  const posts = readPostFiles().map((filePath) => {
    const slug = path.basename(filePath, ".md");
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const { html, headings } = withHeadingIds(marked.parse(content) as string);
    return {
      slug,
      title: data.title ?? slug,
      date: String(data.date ?? "2026-01-01"),
      category: data.category ?? "随笔",
      tags: (data.tags as string[]) ?? [],
      cover: data.cover ?? "/covers/c1.svg",
      excerpt: data.excerpt ?? content.replace(/[#>*`\-\n]/g, " ").slice(0, 90),
      readingTime: estimateReadingTime(content),
      html,
      raw: content,
      headings,
    } satisfies Post;
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** 读取单篇文章 */
export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const { html, headings } = withHeadingIds(marked.parse(content) as string);
  return {
    slug,
    title: data.title ?? slug,
    date: String(data.date ?? "2026-01-01"),
    category: data.category ?? "随笔",
    tags: (data.tags as string[]) ?? [],
    cover: data.cover ?? "/covers/c1.svg",
    excerpt: data.excerpt ?? "",
    readingTime: estimateReadingTime(content),
    html,
    raw: content,
    headings,
  };
}

/** 分类 -> 文章数量 */
export function getCategories() {
  const counter = new Map<string, number>();
  for (const post of getAllPosts()) {
    counter.set(post.category, (counter.get(post.category) ?? 0) + 1);
  }
  return [...counter.entries()].map(([name, count]) => ({ name, count }));
}

/** 标签 -> 出现次数（按次数倒序） */
export function getTags() {
  const counter = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) counter.set(tag, (counter.get(tag) ?? 0) + 1);
  }
  return [...counter.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

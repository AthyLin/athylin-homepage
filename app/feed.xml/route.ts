import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/site.config";

// 静态导出（GitHub Pages）要求路由显式声明为静态
export const dynamic = "force-static";

/** RSS 订阅：/feed.xml */
export function GET() {
  const posts = getAllPosts();
  const base = siteConfig.url.replace(/\/$/, "");

  const items = posts
    .map(
      (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${base}/posts/${post.slug}</link>
      <guid>${base}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.title}</title>
    <link>${base}</link>
    <description><![CDATA[${siteConfig.bio}]]></description>
    <language>zh-CN</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}

import Link from "next/link";
import { Lock, Mail, Rss } from "lucide-react";
import { BrandIcon } from "@/components/icons/Brand";
import { siteConfig } from "@/site.config";

export default function Footer() {
  const year = new Date().getFullYear();
  const { github, email, bilibili, x } = siteConfig.social;

  return (
    <footer className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-4 pb-10 sm:px-8">
      <div className="glass-card glass-sheen flex flex-col items-center gap-4 px-6 py-6 text-sm text-gray-600 sm:flex-row sm:justify-between dark:text-gray-300">
        <div className="text-center sm:text-left">
          <p className="font-medium text-gray-800 dark:text-gray-100">
            © {year} {siteConfig.title}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {siteConfig.bio}
            {siteConfig.icp.name ? (
              <>
                {" · "}
                <a href={siteConfig.icp.link} className="hover:text-brand-500" target="_blank" rel="noreferrer">
                  {siteConfig.icp.name}
                </a>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {github ? (
            <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub" className="glass-button grid h-9 w-9 place-items-center">
              <BrandIcon name="github" className="h-4 w-4" />
            </a>
          ) : null}
          {email ? (
            <a href={`mailto:${email}`} aria-label="邮箱" className="glass-button grid h-9 w-9 place-items-center">
              <Mail className="h-4 w-4" />
            </a>
          ) : null}
          {bilibili ? (
            <a href={bilibili} target="_blank" rel="noreferrer" className="glass-button px-3 py-2 text-xs">
              bilibili
            </a>
          ) : null}
          {x ? (
            <a href={x} target="_blank" rel="noreferrer" className="glass-button px-3 py-2 text-xs">
              X
            </a>
          ) : null}
          <Link href="/feed.xml" aria-label="RSS" className="glass-button grid h-9 w-9 place-items-center">
            <Rss className="h-4 w-4" />
          </Link>
          {/* 发布后台入口（需要 GitHub Token 才能使用，放页脚只是为了自己好找） */}
          <Link
            href="/admin"
            aria-label="发布后台"
            className="glass-button grid h-9 w-9 place-items-center text-gray-500"
          >
            <Lock className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Built with Next.js + Tailwind CSS · 玻璃拟态个人博客模板
      </p>
    </footer>
  );
}

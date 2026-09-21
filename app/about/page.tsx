import type { Metadata } from "next";
import Image from "@/components/ui/AppImage";
import { Coffee, Cpu, Mail, MapPin, Sparkles, User } from "lucide-react";
import { BrandIcon } from "@/components/icons/Brand";
import PageHeader from "@/components/layout/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import { siteConfig } from "@/site.config";
import { skills, timeline } from "@/data/timeline";
import { daysSince, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "关于",
  description: "关于这个站点和它的主人。",
};

const STACK = [
  { name: "Next.js 16", desc: "App Router + 服务端组件" },
  { name: "React 19", desc: "并发特性与客户端交互" },
  { name: "Tailwind CSS 4", desc: "CSS 优先的主题配置" },
  { name: "Markdown", desc: "文章以 .md 文件写作" },
  { name: "TypeScript", desc: "全站类型安全" },
  { name: "lucide-react", desc: "统一的图标系统" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-8">
      <FadeIn>
        <PageHeader title="关于" description="关于这个站点，以及它背后的那个人。" icon={User} />
      </FadeIn>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 个人名片 */}
        <FadeIn className="lg:col-span-1">
          <section className="glass-card glass-sheen flex flex-col items-center gap-3 p-6 text-center">
            <span className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/70 shadow-lg">
              <Image src={siteConfig.avatarUrl} alt={siteConfig.authorName} fill sizes="96px" className="object-cover" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-50">{siteConfig.authorName}</h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{siteConfig.jobTitle}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center justify-center gap-1">
                <MapPin className="h-3 w-3" />
                {siteConfig.location}
              </span>
            </p>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{siteConfig.description}</p>
            <div className="flex gap-2">
              {siteConfig.social.github ? (
                <a href={siteConfig.social.github} target="_blank" rel="noreferrer" className="glass-button grid h-9 w-9 place-items-center" aria-label="GitHub">
                  <BrandIcon name="github" className="h-4 w-4" />
                </a>
              ) : null}
              {siteConfig.social.email ? (
                <a href={`mailto:${siteConfig.social.email}`} className="glass-button grid h-9 w-9 place-items-center" aria-label="邮箱">
                  <Mail className="h-4 w-4" />
                </a>
              ) : null}
            </div>
            <div className="mt-1 grid w-full grid-cols-2 gap-2">
              <div className="rounded-xl bg-white/35 px-3 py-2 dark:bg-white/5">
                <p className="text-base font-semibold text-gray-800 tabular-nums dark:text-gray-100">
                  {daysSince(siteConfig.buildDate)}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">运行天数</p>
              </div>
              <div className="rounded-xl bg-white/35 px-3 py-2 dark:bg-white/5">
                <p className="text-base font-semibold text-gray-800 tabular-nums dark:text-gray-100">
                  {new Date().getFullYear() - 2022}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">写作年数</p>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* 技能 + 关于本站 */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <FadeIn delay={0.06}>
            <section className="glass-card glass-sheen p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Cpu className="h-4 w-4 text-brand-500" />
                技能与兴趣
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {skills.map((skill) => (
                  <li key={skill.name}>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-gray-700 dark:text-gray-200">{skill.name}</span>
                      <span className="text-gray-500 tabular-nums dark:text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/40 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-400 to-sky-400"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </FadeIn>

          <FadeIn delay={0.1}>
            <section className="glass-card glass-sheen p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Sparkles className="h-4 w-4 text-brand-500" />
                本站技术栈
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {STACK.map((item) => (
                  <div key={item.name} className="rounded-xl bg-white/35 px-3.5 py-2.5 dark:bg-white/5">
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-100">{item.name}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                <Coffee className="h-3.5 w-3.5" />
                建站于 {formatDate(siteConfig.buildDate)} · 内容以 Markdown 存放在 content/posts/
              </p>
            </section>
          </FadeIn>
        </div>
      </div>

      {/* 时间轴 */}
      <FadeIn delay={0.14}>
        <section className="glass-card glass-sheen mt-4 p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">我的时间轴</h2>
          <ol className="mt-5 flex flex-col gap-5 border-l border-white/50 pl-5 dark:border-white/10">
            {timeline.map((item) => (
              <li key={item.year} className="relative">
                <span className="absolute top-1.5 -left-[1.55rem] h-3 w-3 rounded-full border-2 border-white bg-gradient-to-br from-brand-400 to-sky-400 shadow dark:border-slate-800" />
                <p className="text-xs font-semibold text-brand-600 dark:text-brand-200">{item.year}</p>
                <p className="mt-0.5 text-sm font-medium text-gray-800 dark:text-gray-100">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-300">{item.description}</p>
              </li>
            ))}
          </ol>
        </section>
      </FadeIn>
    </div>
  );
}

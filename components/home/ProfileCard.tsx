import Image from "@/components/ui/AppImage";
import Link from "next/link";
import { Camera, FileText, Mail, MapPin, MessageSquare, Tv } from "lucide-react";
import { BrandIcon } from "@/components/icons/Brand";
import { siteConfig } from "@/site.config";
import { daysSince } from "@/lib/utils";

type ProfileCardProps = {
  postCount: number;
  momentCount: number;
  photoCount: number;
};

export default function ProfileCard({ postCount, momentCount, photoCount }: ProfileCardProps) {
  const stats = [
    { label: "文章", value: postCount, icon: FileText, href: "/posts" },
    { label: "说说", value: momentCount, icon: MessageSquare, href: "/moments" },
    { label: "照片", value: photoCount, icon: Camera, href: "/photowall" },
  ];

  return (
    <section className="glass-card glass-sheen flex w-full flex-col gap-5 p-5 sm:p-6">
      <div className="flex items-start gap-5">
        <div className="relative shrink-0">
          <span className="absolute -inset-1.5 animate-pulse-ring rounded-full border border-brand-400/50" />
          <Link href={siteConfig.websiteUrl || "/about"} className="relative block h-20 w-20 overflow-hidden rounded-full border-2 border-white/70 shadow-lg sm:h-24 sm:w-24">
            <Image src={siteConfig.avatarUrl} alt={siteConfig.authorName} fill sizes="96px" className="object-cover" priority />
          </Link>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl dark:text-gray-50">
              {siteConfig.authorName}
            </h1>
            <span className="glass-pill px-2.5 py-0.5 text-[11px] text-gray-600 dark:text-gray-300">
              {siteConfig.jobTitle}
            </span>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {siteConfig.location}
            </span>
            <span>已运行 {daysSince(siteConfig.buildDate)} 天</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{siteConfig.bio}</p>

          <div className="mt-3 flex items-center gap-2">
            {siteConfig.social.github ? (
              <a href={siteConfig.social.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="glass-button grid h-8 w-8 place-items-center">
                <BrandIcon name="github" className="h-3.5 w-3.5" />
              </a>
            ) : null}
            {siteConfig.social.bilibili ? (
              <a href={siteConfig.social.bilibili} target="_blank" rel="noreferrer" aria-label="bilibili" className="glass-button grid h-8 w-8 place-items-center">
                <Tv className="h-3.5 w-3.5" />
              </a>
            ) : null}
            {siteConfig.social.email ? (
              <a href={`mailto:${siteConfig.social.email}`} aria-label="邮箱" className="glass-button grid h-8 w-8 place-items-center">
                <Mail className="h-3.5 w-3.5" />
              </a>
            ) : null}
            <Link href="/messages" className="glass-button px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200">
              给我留言
            </Link>
          </div>
        </div>
      </div>

      {/* 统计区 */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="glass-button flex flex-col items-center gap-1 py-3 text-center"
          >
            <stat.icon className="h-4 w-4 text-brand-500" />
            <span className="text-lg font-semibold text-gray-800 tabular-nums dark:text-gray-100">{stat.value}</span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">{stat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

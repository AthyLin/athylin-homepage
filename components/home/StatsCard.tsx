import { Activity, Hash, Sparkles } from "lucide-react";
import { siteConfig } from "@/site.config";
import { daysSince } from "@/lib/utils";

type StatsCardProps = {
  postCount: number;
  momentCount: number;
  photoCount: number;
  friendCount: number;
  tags: { name: string; count: number }[];
};

export default function StatsCard({ postCount, momentCount, photoCount, friendCount, tags }: StatsCardProps) {
  const metrics = [
    { label: "文章", value: postCount },
    { label: "说说", value: momentCount },
    { label: "照片", value: photoCount },
    { label: "友链", value: friendCount },
    { label: "运行天数", value: daysSince(siteConfig.buildDate) },
  ];

  return (
    <section className="glass-card glass-sheen flex w-full flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex items-center gap-2 sm:flex-col sm:items-start">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <Activity className="h-4 w-4 text-brand-500" />
          站点小数据
        </h2>
        <p className="hidden text-[11px] text-gray-500 sm:block dark:text-gray-400">数字会随内容增长</p>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-3 sm:grid-cols-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl bg-white/35 px-3 py-2.5 text-center dark:bg-white/5">
            <p className="text-lg font-semibold text-gray-800 tabular-nums dark:text-gray-100">{metric.value}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="sm:w-64">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
          <Hash className="h-3 w-3" />
          常用标签
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 8).map((tag) => (
            <span key={tag.name} className="glass-pill flex items-center gap-1 px-2.5 py-1 text-[11px] text-gray-600 dark:text-gray-300">
              {tag.name}
              <span className="text-gray-400">{tag.count}</span>
            </span>
          ))}
          <span className="glass-pill flex items-center gap-1 px-2.5 py-1 text-[11px] text-gray-500 dark:text-gray-400">
            <Sparkles className="h-3 w-3" />
            更多
          </span>
        </div>
      </div>
    </section>
  );
}

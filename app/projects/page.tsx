import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FolderGit2, Star } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import FadeIn from "@/components/ui/FadeIn";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "项目",
  description: "做过的一些小东西。",
};

const STATUS_STYLE: Record<string, string> = {
  维护中: "bg-brand-500/15 text-brand-700 dark:text-brand-200",
  已完成: "bg-brand-500/15 text-brand-700 dark:text-brand-200",
  开发中: "bg-brand-400/20 text-brand-700 dark:text-brand-200",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-8">
      <FadeIn>
        <PageHeader title="项目" description={`${projects.length} 个在做或做过的小东西。`} icon={FolderGit2} />
      </FadeIn>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((project, index) => (
          <FadeIn key={project.id} delay={index * 0.05}>
            <article className="glass-card glass-card-hover glass-sheen flex h-full flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-sm">
                    {project.name.slice(0, 1)}
                  </span>
                  <h2 className="text-base font-semibold text-gray-800 dark:text-gray-50">{project.name}</h2>
                </div>
                <span className={cn("rounded-full px-2.5 py-0.5 text-[11px]", STATUS_STYLE[project.status])}>
                  {project.status}
                </span>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{project.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span key={tag} className="glass-pill px-2.5 py-1 text-[11px] text-gray-600 dark:text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 border-t border-white/40 pt-3 text-xs dark:border-white/10">
                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Star className="h-3.5 w-3.5" />
                  {project.stars}
                </span>
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto flex items-center gap-1 text-gray-600 transition-colors hover:text-brand-500 dark:text-gray-300"
                >
                  源码
                  <ArrowUpRight className="h-3 w-3" />
                </a>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-gray-600 transition-colors hover:text-brand-500 dark:text-gray-300"
                >
                  演示
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.2}>
        <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          想了解我的技术栈？
          <Link href="/about" className="ml-1 text-brand-500 hover:underline">
            看看关于页
          </Link>
        </p>
      </FadeIn>
    </div>
  );
}

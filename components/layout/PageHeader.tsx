import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  /** 右上角额外内容，比如筛选按钮 */
  extra?: React.ReactNode;
  breadcrumb?: string;
};

export default function PageHeader({ title, description, icon: Icon, extra, breadcrumb }: PageHeaderProps) {
  return (
    <header className="glass-card glass-sheen mb-4 flex flex-col gap-3 p-5 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {Icon ? (
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-sky-400 text-white shadow-md">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        <div>
          <nav className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
            <Link href="/" className="transition-colors hover:text-brand-500">
              首页
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span>{breadcrumb ?? title}</span>
          </nav>
          <h1 className="mt-0.5 text-xl font-bold text-gray-800 sm:text-2xl dark:text-gray-50">{title}</h1>
          {description ? <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p> : null}
        </div>
      </div>
      {extra ? <div className="flex items-center gap-2">{extra}</div> : null}
    </header>
  );
}

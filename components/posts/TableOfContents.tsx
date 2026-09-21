"use client";

import { useEffect, useState } from "react";
import { ListTree } from "lucide-react";
import type { Heading } from "@/lib/posts";
import { cn } from "@/lib/utils";

/** 文章目录：滚动时高亮当前章节 */
export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: [0, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden lg:block">
      <div className="glass-card glass-sheen sticky top-28 p-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
          <ListTree className="h-3.5 w-3.5 text-brand-500" />
          本页目录
        </p>
        <ul className="space-y-1 border-l border-white/50 dark:border-white/10">
          {headings.map((heading) => (
            <li key={heading.id} style={{ paddingLeft: heading.level === 3 ? "1.1rem" : 0 }}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "-ml-px block border-l-2 py-1 pl-3 text-xs transition-all",
                  activeId === heading.id
                    ? "border-brand-500 font-medium text-brand-600 dark:text-brand-200"
                    : "border-transparent text-gray-500 hover:border-brand-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

import Link from "next/link";
import { ArrowUpRight, Heart, MessageCircle, Quote } from "lucide-react";
import type { Moment } from "@/data/moments";
import { timeAgo } from "@/lib/utils";

export default function MomentsCard({ moments }: { moments: Moment[] }) {
  return (
    <section className="glass-card glass-sheen flex h-full w-full flex-col gap-3 p-5">
      <header className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <Quote className="h-4 w-4 text-brand-500" />
          碎碎念
        </h2>
        <Link href="/moments" className="flex items-center gap-0.5 text-[11px] text-gray-500 transition-colors hover:text-brand-500 dark:text-gray-400">
          全部说说
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </header>

      <ul className="flex flex-1 flex-col gap-3">
        {moments.slice(0, 3).map((moment) => (
          <li key={moment.id} className="rounded-xl bg-white/35 p-3 dark:bg-white/5">
            <p className="line-clamp-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200">{moment.content}</p>
            <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
              <span className="glass-pill px-2 py-0.5">{moment.mood}</span>
              <span>{timeAgo(moment.date)}</span>
              <span className="ml-auto flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {moment.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {moment.comments}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { Coffee } from "lucide-react";
import { nowList } from "@/data/timeline";

export default function NowCard() {
  return (
    <section className="glass-card glass-sheen flex h-full w-full flex-col gap-3 p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
        <Coffee className="h-4 w-4 text-brand-500" />
        在忙什么
      </h2>
      <ul className="flex flex-1 flex-col justify-center gap-2.5">
        {nowList.map((item) => (
          <li key={item.label} className="flex items-baseline gap-3 text-sm">
            <span className="w-10 shrink-0 text-[11px] text-gray-500 dark:text-gray-400">{item.label}</span>
            <span className="flex-1 text-gray-700 dark:text-gray-200">{item.value}</span>
          </li>
        ))}
      </ul>
      <p className="rounded-xl bg-brand-500/10 px-3 py-2 text-[11px] leading-relaxed text-brand-700 dark:text-brand-200">
        这个卡片适合写「现在进行时」：正在读的书、在学的技术、在做的事情。
      </p>
    </section>
  );
}

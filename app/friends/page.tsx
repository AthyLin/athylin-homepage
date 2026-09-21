import type { Metadata } from "next";
import Image from "@/components/ui/AppImage";
import { ArrowUpRight, Users } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import FriendApply from "@/components/friends/FriendApply";
import FadeIn from "@/components/ui/FadeIn";
import { friends } from "@/data/friends";

export const metadata: Metadata = {
  title: "友链",
  description: "一些有趣的邻居。",
};

export default function FriendsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-8">
      <FadeIn>
        <PageHeader title="友链" description={`${friends.length} 位邻居，都是认真在写字的人。`} icon={Users} />
      </FadeIn>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {friends.map((friend, index) => (
          <FadeIn key={friend.id} delay={index * 0.04}>
            <a
              href={friend.url}
              target="_blank"
              rel="noreferrer"
              className="glass-card glass-card-hover glass-sheen group flex h-full items-start gap-4 p-4"
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/60 shadow-md">
                <Image src={friend.avatar} alt={friend.name} fill sizes="56px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-semibold text-gray-800 dark:text-gray-50">{friend.name}</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0 text-gray-400 transition-colors group-hover:text-brand-500" />
                </span>
                <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                  {friend.description}
                </span>
                <span
                  className="mt-2 inline-block h-1 w-10 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${friend.color}, transparent)` }}
                />
              </span>
            </a>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.2}>
        <div className="mt-5">
          <FriendApply />
        </div>
      </FadeIn>
    </div>
  );
}

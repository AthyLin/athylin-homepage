import type { Metadata } from "next";
import { Music } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import PlaylistGrid from "@/components/music/PlaylistGrid";
import FadeIn from "@/components/ui/FadeIn";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "音乐",
  description: "写代码时单曲循环的那些歌。",
};

export default function MusicPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-8">
      <FadeIn>
        <PageHeader
          title="音乐"
          description={`${siteConfig.playlist.length} 首歌，底部播放器会跟随这里的点击同步播放。`}
          icon={Music}
        />
      </FadeIn>
      <FadeIn delay={0.06}>
        <PlaylistGrid />
      </FadeIn>
    </div>
  );
}

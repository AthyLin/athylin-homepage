import FadeIn from "@/components/ui/FadeIn";
import ProfileCard from "@/components/home/ProfileCard";
import MusicCard from "@/components/home/MusicCard";
import PhotoWallPreview from "@/components/home/PhotoWallPreview";
import LatestPostsCard from "@/components/home/LatestPostsCard";
import MomentsCard from "@/components/home/MomentsCard";
import NowCard from "@/components/home/NowCard";
import StatsCard from "@/components/home/StatsCard";
import { getAllPosts, getTags } from "@/lib/posts";
import { moments, photos } from "@/lib/content";
import { friends } from "@/data/friends";

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getTags();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 sm:gap-5 sm:px-8">
      {/* 第一行：个人信息 + 播放器 */}
      <FadeIn>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          <div className="md:col-span-8">
            <ProfileCard postCount={posts.length} momentCount={moments.length} photoCount={photos.length} />
          </div>
          <div className="md:col-span-4">
            <MusicCard />
          </div>
        </div>
      </FadeIn>

      {/* 第二行：照片墙 + 最近文章 */}
      <FadeIn delay={0.08}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          <div className="md:col-span-4">
            <PhotoWallPreview />
          </div>
          <div className="md:col-span-8">
            <LatestPostsCard posts={posts} />
          </div>
        </div>
      </FadeIn>

      {/* 第三行：碎碎念 + 在忙什么 */}
      <FadeIn delay={0.14}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          <div className="md:col-span-8">
            <MomentsCard moments={moments} />
          </div>
          <div className="md:col-span-4">
            <NowCard />
          </div>
        </div>
      </FadeIn>

      {/* 第四行：站点数据 */}
      <FadeIn delay={0.2}>
        <StatsCard
          postCount={posts.length}
          momentCount={moments.length}
          photoCount={photos.length}
          friendCount={friends.length}
          tags={tags}
        />
      </FadeIn>
    </div>
  );
}

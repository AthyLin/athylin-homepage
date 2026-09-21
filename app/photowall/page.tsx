import type { Metadata } from "next";
import { Camera } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import PhotoGallery from "@/components/photos/PhotoGallery";
import FadeIn from "@/components/ui/FadeIn";
import { photoAlbums, photos } from "@/lib/content";

export const metadata: Metadata = {
  title: "照片墙",
  description: "随手拍下的光与影。",
};

export default function PhotoWallPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-8">
      <FadeIn>
        <PageHeader title="照片墙" description="拍得不算好，但都是真的光。点击照片可以放大查看。" icon={Camera} />
      </FadeIn>
      <FadeIn delay={0.06}>
        <PhotoGallery photos={photos} albums={photoAlbums} />
      </FadeIn>
    </div>
  );
}

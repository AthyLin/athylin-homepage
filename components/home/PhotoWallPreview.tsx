import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Camera } from "lucide-react";
import { photos } from "@/data/photos";

/** 首页照片墙预览：拼贴式布局 */
export default function PhotoWallPreview() {
  const preview = photos.slice(0, 5);

  return (
    <section className="glass-card glass-sheen flex h-full w-full flex-col gap-3 p-5">
      <header className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <Camera className="h-4 w-4 text-brand-500" />
          照片墙
        </h2>
        <Link href="/photowall" className="flex items-center gap-0.5 text-[11px] text-gray-500 transition-colors hover:text-brand-500 dark:text-gray-400">
          全部
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </header>

      <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-2">
        <Link
          href="/photowall"
          className="group relative col-span-2 aspect-[16/10] overflow-hidden rounded-xl"
        >
          <Image src={preview[0].src} alt={preview[0].title} fill sizes="(max-width:768px) 100vw, 380px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-xs font-medium text-white">
            {preview[0].title}
          </span>
        </Link>
        {preview.slice(1, 5).map((photo) => (
          <Link key={photo.id} href="/photowall" className="group relative aspect-square overflow-hidden rounded-xl">
            <Image src={photo.src} alt={photo.title} fill sizes="180px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
          </Link>
        ))}
      </div>

      <p className="text-[11px] text-gray-500 dark:text-gray-400">共 {photos.length} 张照片 · 随手拍下的光</p>
    </section>
  );
}

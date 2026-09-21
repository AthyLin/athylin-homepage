import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-4 sm:px-8">
      <div className="glass-card glass-sheen flex w-full flex-col items-center gap-4 p-10 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-500 text-white shadow-lg">
          <Compass className="h-7 w-7" />
        </span>
        <h1 className="gradient-text text-4xl font-bold">404</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">这条路好像通向了一片迷雾，页面可能被移动或删除了。</p>
        <div className="flex gap-3">
          <Link href="/" className="glass-button px-4 py-2 text-sm">
            回到首页
          </Link>
          <Link href="/posts" className="glass-button px-4 py-2 text-sm">
            看看文章
          </Link>
        </div>
      </div>
    </div>
  );
}

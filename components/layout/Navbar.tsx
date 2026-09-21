"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Camera,
  FolderGit2,
  Home,
  Mail,
  Menu,
  MessageSquare,
  Music,
  Moon,
  Sparkles,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import { siteConfig } from "@/site.config";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "首页", icon: Home },
  { href: "/posts", label: "文章", icon: BookOpen },
  { href: "/moments", label: "说说", icon: MessageSquare },
  { href: "/photowall", label: "照片墙", icon: Camera },
  { href: "/music", label: "音乐", icon: Music },
  { href: "/projects", label: "项目", icon: FolderGit2 },
  { href: "/friends", label: "友链", icon: Users },
  { href: "/messages", label: "留言", icon: Mail },
  { href: "/about", label: "关于", icon: User },
];

/** 连点 Logo 的彩蛋：撒一把彩色纸屑 */
function fireConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;z-index:9999;pointer-events:none";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const colors = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff", "#312e81"];
  const particles = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 160,
    vx: (Math.random() - 0.5) * 5,
    vy: 1.6 + Math.random() * 3.4,
    size: 5 + Math.random() * 9,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.2,
    round: Math.random() > 0.6,
  }));

  let frame = 0;
  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.045;
      p.rotation += p.spin;
      const opacity = Math.max(0, 1 - frame / 260);
      if (opacity <= 0 || p.y > canvas.height + 30) continue;
      alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = p.color;
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
    }
    frame += 1;
    if (alive) requestAnimationFrame(tick);
    else canvas.remove();
  };
  tick();
}

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const clickTimes = useRef<number[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogoClick = () => {
    const now = Date.now();
    clickTimes.current = [...clickTimes.current, now].filter((t) => now - t < 1800);
    if (clickTimes.current.length >= 7) {
      clickTimes.current = [];
      fireConfetti();
    }
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        className={cn(
          "glass-card glass-sheen flex w-full max-w-6xl items-center gap-2 rounded-2xl px-3 py-2 transition-all duration-300 sm:px-4",
          scrolled ? "shadow-[0_10px_36px_rgba(31,38,135,0.18)]" : "",
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="group flex shrink-0 items-center gap-2 pr-1 pl-1 sm:pr-3"
          title="点我 7 次有惊喜"
        >
          <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-brand-500 text-white shadow-md">
            <Sparkles className="h-4 w-4" />
            <span className="absolute inset-0 rounded-xl border border-white/60" />
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{siteConfig.title}</span>
            <span className="text-[10px] tracking-widest text-gray-500 uppercase dark:text-gray-400">
              {siteConfig.subtitle}
            </span>
          </span>
        </Link>

        {/* 桌面导航 */}
        <ul className="mx-auto hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-white/70 font-medium text-brand-600 shadow-sm dark:bg-white/15 dark:text-brand-200"
                      : "text-gray-600 hover:bg-white/45 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 右侧操作区 */}
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="切换深色模式"
            className="glass-button grid h-9 w-9 place-items-center text-gray-700 dark:text-gray-200"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="打开菜单"
            className="glass-button grid h-9 w-9 place-items-center text-gray-700 lg:hidden dark:text-gray-200"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* 移动端抽屉 */}
      <div
        className={cn(
          "glass-card absolute top-[4.6rem] right-3 left-3 origin-top overflow-hidden p-2 transition-all duration-300 lg:hidden sm:right-6 sm:left-6",
          menuOpen ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <ul className="grid grid-cols-2 gap-1.5">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  isActive(link.href)
                    ? "bg-white/70 font-medium text-brand-600 dark:bg-white/15 dark:text-brand-200"
                    : "text-gray-700 hover:bg-white/50 dark:text-gray-200 dark:hover:bg-white/10",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

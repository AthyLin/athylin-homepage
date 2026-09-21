import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/site.config";
import { asset } from "@/lib/asset";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { MusicProvider } from "@/components/providers/MusicProvider";
import Background from "@/components/layout/Background";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientEffects from "@/components/layout/ClientEffects";
import MusicPlayer from "@/components/music/MusicPlayer";
import Mascot from "@/components/layout/Mascot";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.title} · ${siteConfig.bio}`,
    template: `%s · ${siteConfig.title}`,
  },
  description: siteConfig.description,
  icons: { icon: asset("/favicon.svg") },
  alternates: { types: { "application/rss+xml": asset("/feed.xml") } },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.bio,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1026" },
  ],
};

/** 首屏渲染前就决定主题，避免闪白 */
const themeScript = `
try {
  var saved = localStorage.getItem("theme");
  var dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <MusicProvider>
            <Background />
            <ClientEffects />
            <Navbar />
            {/* 顶部留出导航高度，底部留出播放器高度 */}
            <main className="relative z-10 pt-24 pb-32 sm:pt-28">{children}</main>
            <Footer />
            <Mascot />
            <MusicPlayer />
          </MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { NextConfig } from "next";

/**
 * 部署形态由环境变量控制，一份代码同时支持两种托管：
 *
 * - 默认（什么都不设）：正常运行 / 部署到 Vercel，图片走 Next 优化
 * - 静态导出（GitHub Pages / Netlify 静态托管）：
 *     STATIC_EXPORT=1
 *     NEXT_PUBLIC_BASE_PATH=/仓库名     ← 部署在子路径时才需要（用户站点不填）
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 子路径部署（例如 https://用户名.github.io/仓库名/）时要带上前缀
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  ...(isStaticExport
    ? {
        output: "export" as const,
        // 静态导出必须关掉图片优化（没有服务端）
        images: { unoptimized: true },
        // GitHub Pages 需要目录形式的 URL（/about/ 而不是 /about）
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;

"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, MessageSquare, Settings2 } from "lucide-react";
import { siteConfig } from "@/site.config";
import { useTheme } from "@/components/providers/ThemeProvider";

/**
 * 留言板：用 Giscus 接入 GitHub Discussions。
 *
 * 为什么用它：不需要服务器、不需要数据库、不需要任何密钥，
 * 部署到 Vercel / 静态托管都能用，留言直接存进你自己的 GitHub 仓库。
 *
 * 配置步骤见 README 的「留言板（Giscus）」一节；
 * siteConfig.giscus.categoryId 为空时，页面会显示配置引导而不是空白。
 */
export default function GiscusComments() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const { repo, repoId, category, categoryId, mapping, reactionsEnabled, inputPosition } = siteConfig.giscus;
  const configured = Boolean(repo && repoId && categoryId);

  // 注入 giscus 客户端脚本
  useEffect(() => {
    const container = containerRef.current;
    if (!configured || !container) return;

    container.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", mapping);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", reactionsEnabled ? "1" : "0");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", inputPosition);
    script.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
    // theme 单独用一个 effect 同步，避免切换主题时重新加载评论
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured, repo, repoId, category, categoryId, mapping, reactionsEnabled, inputPosition]);

  // 跟随站点的深浅色主题
  useEffect(() => {
    const frame = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    frame?.contentWindow?.postMessage({ giscus: { setConfig: { theme: theme === "dark" ? "dark" : "light" } } }, "https://giscus.app");
  }, [theme]);

  if (!configured) {
    return (
      <section className="glass-card glass-sheen flex flex-col gap-4 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <Settings2 className="h-4 w-4 text-brand-500" />
          留言板还需要 3 步配置
        </h2>
        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
          留言板已改成 Giscus（基于 GitHub Discussions）：不需要服务器、不需要数据库、不需要任何密钥，
          留言会存进你自己的 GitHub 仓库，部署在 Vercel 或静态托管都能用。填好下面两个值就会自动显示评论区。
        </p>

        <ol className="flex flex-col gap-3 text-sm text-gray-700 dark:text-gray-200">
          <li className="rounded-xl bg-white/40 p-3 dark:bg-white/5">
            <p className="font-medium">① 开启 Discussions</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              仓库 → Settings → General → Features → 勾选 <b>Discussions</b>
            </p>
          </li>
          <li className="rounded-xl bg-white/40 p-3 dark:bg-white/5">
            <p className="font-medium">② 安装 giscus App</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              打开{" "}
              <a
                href="https://github.com/apps/giscus"
                target="_blank"
                rel="noreferrer"
                className="text-brand-500 hover:underline"
              >
                github.com/apps/giscus
              </a>{" "}
              → Install → 只授权这一个仓库
            </p>
          </li>
          <li className="rounded-xl bg-white/40 p-3 dark:bg-white/5">
            <p className="font-medium">③ 复制两个值填进 site.config.ts</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              打开{" "}
              <a href="https://giscus.app/zh-CN" target="_blank" rel="noreferrer" className="text-brand-500 hover:underline">
                giscus.app/zh-CN
              </a>{" "}
              填写仓库名，选一个分类（推荐 Announcements），页面下方会生成一段脚本，
              把其中的 <code className="rounded bg-black/5 px-1 dark:bg-white/10">data-category</code> 和{" "}
              <code className="rounded bg-black/5 px-1 dark:bg-white/10">data-category-id</code> 填到：
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-black/80 p-3 text-[11px] leading-relaxed text-gray-100">
{`giscus: {
  repo: "${repo}",
  repoId: "${repoId}",
  category: "Announcements",   // ← 换成你选的分类名
  categoryId: "DIC_kwDO...",   // ← 换成对应的一长串 ID
},`}
            </pre>
          </li>
        </ol>

        <p className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
          <ExternalLink className="h-3 w-3" />
          改完保存、刷新页面即可（本地 npm run dev 会自动热更新）
        </p>
      </section>
    );
  }

  return (
    <section className="glass-card glass-sheen p-4 sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
        <MessageSquare className="h-4 w-4 text-brand-500" />
        留言
      </h2>
      <div ref={containerRef} className="giscus" />
      <p className="mt-4 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
        留言需要登录 GitHub 账号，评论会以 Discussion 的形式保存在本站仓库的 Discussions 里，随时可以删除。
      </p>
    </section>
  );
}

"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";

type LocalComment = { id: string; name: string; content: string; createdAt: string };

const SEED: LocalComment[] = [
  {
    id: "seed-1",
    name: "路过的小猫",
    content: "写得很清楚，尤其是关于边界那一节，帮我解决了困扰半天的报错。",
    createdAt: "2026-09-19T10:24:00",
  },
  {
    id: "seed-2",
    name: "Luna",
    content: "玻璃质感那段有被治愈到，回去就改一下我的站点配色。",
    createdAt: "2026-09-18T22:41:00",
  },
];

/** 文章评论：演示版（只存在浏览器本地），接后端时把 submit 改成接口请求即可 */
export default function PostComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<LocalComment[]>(SEED);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;
    const next: LocalComment[] = [
      {
        id: `${Date.now()}`,
        name: name.trim() || "匿名访客",
        content: content.trim(),
        createdAt: new Date().toISOString(),
      },
      ...comments,
    ];
    setComments(next);
    localStorage.setItem(`post-comments:${slug}`, JSON.stringify(next));
    setContent("");
  };

  return (
    <section className="glass-card glass-sheen p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
        <MessageCircle className="h-4 w-4 text-brand-500" />
        评论（{comments.length}）
      </h2>

      <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="你的昵称（可留空）"
          className="glass-input"
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={3}
          placeholder="说点什么吧…"
          className="glass-input resize-none"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-gray-500 dark:text-gray-400">演示模式下评论只保存在你的浏览器里</p>
          <button
            type="submit"
            data-no-effect
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-sky-400 px-4 py-2 text-sm text-white shadow-md transition-transform hover:scale-[1.02]"
          >
            <Send className="h-3.5 w-3.5" />
            发表评论
          </button>
        </div>
      </form>

      <ul className="mt-5 space-y-3">
        {comments.map((comment) => (
          <li key={comment.id} className="rounded-xl bg-white/35 p-3 dark:bg-white/5">
            <div className="flex items-center gap-2 text-xs">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-sky-400 text-[11px] text-white">
                {comment.name.slice(0, 1)}
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-200">{comment.name}</span>
              <span className="text-gray-400">{formatDate(comment.createdAt)}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-200">{comment.content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Check, ClipboardCopy, Send } from "lucide-react";

const TEMPLATE = `站点名称：Athy的小屋
站点地址：https://example.com
头像地址：https://example.com/avatar.svg
站点描述：且将新火试旧茶，诗酒趁年华。`;

/** 友链申请表单（演示版：只做前端反馈，接后端时把 submit 换成接口请求） */
export default function FriendApply() {
  const [form, setForm] = useState({ name: "", url: "", avatar: "", description: "" });
  const [status, setStatus] = useState<"idle" | "copied" | "sent">("idle");

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(TEMPLATE);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("idle");
    }
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.url.trim()) return;
    setStatus("sent");
    setForm({ name: "", url: "", avatar: "", description: "" });
    window.setTimeout(() => setStatus("idle"), 3000);
  };

  return (
    <section className="glass-card glass-sheen p-5">
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">申请友链</h2>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        先把本站加到你的友链里，然后填写下面的信息（演示模式不会真的发送）。
      </p>

      <form onSubmit={submit} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input value={form.name} onChange={update("name")} placeholder="站点名称 *" className="glass-input" required />
        <input value={form.url} onChange={update("url")} placeholder="站点地址（https://）*" className="glass-input" required />
        <input value={form.avatar} onChange={update("avatar")} placeholder="头像地址" className="glass-input" />
        <input value={form.description} onChange={update("description")} placeholder="一句话描述" className="glass-input" />

        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            data-no-effect
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm text-white shadow-md transition-transform hover:scale-[1.02]"
          >
            <Send className="h-3.5 w-3.5" />
            提交申请
          </button>
          <button type="button" onClick={copyTemplate} data-no-effect className="glass-button flex items-center gap-2 px-4 py-2 text-sm">
            {status === "copied" ? <Check className="h-3.5 w-3.5 text-brand-500" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
            {status === "copied" ? "已复制" : "复制本站信息"}
          </button>
          {status === "sent" ? <span className="text-xs text-brand-600 dark:text-brand-300">已收到，我会尽快回复～</span> : null}
        </div>
      </form>
    </section>
  );
}

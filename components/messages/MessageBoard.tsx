"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2, RefreshCw, Send } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  likes: number;
  avatarColor: string;
};

type MessageListResponse = { messages: Message[]; store?: string };

/** 留言板：数据来自 /api/messages，服务端可能是 Supabase 或本地 JSON 文件 */
export default function MessageBoard() {
  const [messages, setMessages] = useState<Message[]>([]);
  /** 当前后端：supabase | local-json，由接口返回 */
  const [store, setStore] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/messages", { cache: "no-store" });
      const data = (await response.json()) as MessageListResponse;
      setMessages(data.messages ?? []);
      setStore(data.store ?? "");
    } catch {
      setError("留言加载失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    try {
      setLiked(JSON.parse(localStorage.getItem("message-likes") ?? "{}") as Record<string, boolean>);
    } catch {
      setLiked({});
    }
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, content }),
      });
      const data = (await response.json()) as { message?: Message; store?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "发送失败");
      setMessages((prev) => [data.message as Message, ...prev]);
      if (data.store) setStore(data.store);
      setContent("");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "发送失败");
    } finally {
      setSending(false);
    }
  };

  const like = async (id: string) => {
    if (liked[id]) return;
    const next = { ...liked, [id]: true };
    setLiked(next);
    localStorage.setItem("message-likes", JSON.stringify(next));
    setMessages((prev) => prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item)));
    await fetch("/api/messages/like", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    }).catch(() => undefined);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 发布框 */}
      <section className="glass-card glass-sheen p-5">
        <form onSubmit={submit} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[10rem_1fr]">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="昵称（可留空）"
              className="glass-input"
            />
            <input
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="写点什么吧，比如你路过的心情～"
              className="glass-input"
              maxLength={500}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {store === ""
                ? "存储：读取中…"
                : store === "supabase"
                  ? "存储：Supabase 云端"
                  : "存储：本地 JSON（.data/messages.json）"}
              {" · "}
              共 {content.length}/500 字
            </p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={load} data-no-effect className="glass-button flex items-center gap-1.5 px-3 py-2 text-xs">
                <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                刷新
              </button>
              <button
                type="submit"
                data-no-effect
                disabled={sending}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-sky-400 px-4 py-2 text-sm text-white shadow-md transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                发送
              </button>
            </div>
          </div>
        </form>
        {error ? <p className="mt-2 text-xs text-rose-500">{error}</p> : null}
      </section>

      {/* 留言列表 */}
      <section className="glass-card glass-sheen p-5">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">全部留言（{messages.length}）</h2>

        {loading && messages.length === 0 ? (
          <p className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            正在加载…
          </p>
        ) : messages.length === 0 ? (
          <div className="mt-4 rounded-xl bg-white/35 p-6 text-center dark:bg-white/5">
            <p className="text-2xl">🌱</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">还没有留言，来做第一个吧</p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {messages.map((message) => (
              <li key={message.id} className="flex gap-3 rounded-xl bg-white/35 p-3.5 dark:bg-white/5">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-medium text-white shadow-sm"
                  style={{ background: message.avatarColor }}
                >
                  {message.name.slice(0, 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-medium text-gray-700 dark:text-gray-200">{message.name}</span>
                    <span className="text-gray-400">{timeAgo(message.createdAt)}</span>
                    <button
                      type="button"
                      data-no-effect
                      onClick={() => like(message.id)}
                      className={cn(
                        "ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 transition-all",
                        liked[message.id] ? "bg-pink-400/25 text-pink-600 dark:text-pink-200" : "hover:bg-white/60 dark:hover:bg-white/10",
                      )}
                    >
                      <Heart className={cn("h-3 w-3", liked[message.id] && "fill-current")} />
                      {message.likes}
                    </button>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-700 dark:text-gray-200">{message.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

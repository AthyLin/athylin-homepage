"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { AlertCircle, Loader2, MessageSquare, RefreshCw, Send } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

type Comment = {
  id: number;
  nickname: string;
  content: string;
  created_at: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const configured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabase = configured ? createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!) : null;

export default function SupabaseComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setError("留言服务尚未配置，请稍后再试。");
      return;
    }

    setLoading(true);
    const { data, error: queryError } = await supabase
      .from("comments")
      .select("id,nickname,content,created_at")
      .eq("page", "messages")
      .eq("is_visible", true)
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(`留言加载失败：${queryError.message}`);
    } else {
      setComments((data ?? []) as Comment[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanNickname = nickname.trim();
    const cleanContent = content.trim();

    if (!supabase) {
      setError("留言服务尚未配置，请稍后再试。");
      return;
    }
    if (!cleanNickname || !cleanContent) {
      setError("请填写昵称和留言内容。");
      return;
    }
    if (cleanNickname.length > 30 || cleanContent.length > 2000) {
      setError("昵称不能超过 30 字，留言不能超过 2000 字。");
      return;
    }

    setSubmitting(true);
    setMessage(null);
    setError(null);

    const { error: insertError } = await supabase.from("comments").insert({
      page: "messages",
      nickname: cleanNickname,
      content: cleanContent,
    });

    if (insertError) {
      setError(`留言提交失败：${insertError.message}`);
    } else {
      setContent("");
      setMessage("留言已发布");
      await loadComments();
    }
    setSubmitting(false);
  };

  return (
    <section className="glass-card glass-sheen flex flex-col gap-5 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <MessageSquare className="h-4 w-4 text-brand-500" />
          留言
          <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400">（{comments.length}）</span>
        </h2>
        <button
          type="button"
          onClick={() => void loadComments()}
          disabled={loading}
          data-no-effect
          className="glass-button flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] text-gray-600 disabled:opacity-50 dark:text-gray-300"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          刷新
        </button>
      </div>

      <form onSubmit={submitComment} className="flex flex-col gap-3">
        <input
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          maxLength={30}
          placeholder="你的昵称"
          aria-label="昵称"
          className="glass-input text-sm"
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="写下你想说的话…"
          aria-label="留言内容"
          className="glass-input resize-none text-sm"
        />
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">{content.length}/2000</span>
          <button
            type="submit"
            disabled={submitting}
            data-no-effect
            className="ml-auto flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm text-white shadow-sm transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {submitting ? "发布中…" : "发布留言"}
          </button>
        </div>
      </form>

      {message ? <p className="rounded-xl bg-brand-500/10 px-3 py-2 text-xs text-brand-700 dark:text-brand-200">{message}</p> : null}
      {error ? (
        <p className="flex items-center gap-2 rounded-xl bg-rose-500/10 px-3 py-2 text-xs text-rose-600 dark:text-rose-300">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : null}

      <div className="border-t border-white/40 pt-4 dark:border-white/10">
        {loading && comments.length === 0 ? (
          <p className="flex items-center justify-center gap-2 py-8 text-xs text-gray-500 dark:text-gray-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            正在加载留言…
          </p>
        ) : comments.length === 0 ? (
          <p className="py-8 text-center text-xs text-gray-500 dark:text-gray-400">还没有留言，来写第一条吧</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {comments.map((comment) => (
              <li key={comment.id} className="rounded-xl bg-white/35 p-3 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-500/15 text-xs font-semibold text-brand-600 dark:text-brand-200">
                    {comment.nickname.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-gray-700 dark:text-gray-200">
                    {comment.nickname}
                  </span>
                  <time className="shrink-0 text-[10px] text-gray-400" dateTime={comment.created_at}>
                    {formatDateTime(comment.created_at)}
                  </time>
                </div>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-gray-200">
                  {comment.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

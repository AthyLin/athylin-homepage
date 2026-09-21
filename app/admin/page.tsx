"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Camera,
  Check,
  ExternalLink,
  ImagePlus,
  Loader2,
  LogOut,
  MessageSquare,
  Rocket,
  Send,
  Trash2,
} from "lucide-react";
import type { Moment, Photo } from "@/lib/content";
import {
  ADMIN_REPO,
  compressImage,
  deleteFile,
  detectPhotoHeight,
  getFileSha,
  makeFileName,
  readTextFile,
  uploadBinaryFile,
  verifyToken,
  writeTextFile,
} from "@/lib/github-admin";
import { cn } from "@/lib/utils";

const TOKEN_KEY = "shiguang-admin-token";
const MOMENTS_PATH = "data/moments.json";
const PHOTOS_PATH = "data/photos.json";
const MOODS = ["日常", "开心", "平静", "满足", "疲惫", "期待", "感慨"];

type Status = { type: "ok" | "err" | "busy"; text: string } | null;

function today() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [login, setLogin] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [status, setStatus] = useState<Status>(null);

  const [tab, setTab] = useState<"moments" | "photos">("moments");

  // 说说表单
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("日常");
  const [momentImages, setMomentImages] = useState<File[]>([]);

  // 照片表单
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [album, setAlbum] = useState("日常");
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoDate, setPhotoDate] = useState(today());

  // 列表
  const [moments, setMoments] = useState<Moment[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);

  /** 读取仓库里的两个 JSON（以仓库为准，而不是已部署的页面） */
  const loadLists = useCallback(async (activeToken: string) => {
    try {
      const [momentsFile, photosFile] = await Promise.all([
        readTextFile(activeToken, MOMENTS_PATH),
        readTextFile(activeToken, PHOTOS_PATH),
      ]);
      setMoments(JSON.parse(momentsFile.text) as Moment[]);
      setPhotos(JSON.parse(photosFile.text) as Photo[]);
    } catch (error) {
      setStatus({ type: "err", text: `读取数据失败：${(error as Error).message}` });
    }
  }, []);

  // 记住登录状态
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (!saved) return;
    verifyToken(saved)
      .then((name) => {
        setToken(saved);
        setLogin(name);
        void loadLists(saved);
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY));
  }, [loadLists]);

  const handleLogin = async () => {
    const value = tokenInput.trim();
    if (!value) return;
    setStatus({ type: "busy", text: "正在验证…" });
    try {
      const name = await verifyToken(value);
      localStorage.setItem(TOKEN_KEY, value);
      setToken(value);
      setLogin(name);
      setStatus({ type: "ok", text: `已登录：${name}` });
      await loadLists(value);
    } catch (error) {
      setStatus({ type: "err", text: `验证失败：${(error as Error).message}` });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setLogin("");
    setMoments([]);
    setPhotos([]);
    setStatus({ type: "ok", text: "已退出登录" });
  };

  /** 上传若干图片，返回仓库里的路径 */
  const uploadImages = async (files: File[]) => {
    const paths: string[] = [];
    for (const [index, file] of files.entries()) {
      setStatus({ type: "busy", text: `正在压缩并上传图片 ${index + 1}/${files.length}…` });
      const blob = await compressImage(file);
      const name = makeFileName("jpg");
      await uploadBinaryFile(token, `public/photos/${name}`, blob, `上传图片 ${name}`);
      paths.push(`/photos/${name}`);
    }
    return paths;
  };

  /** 发表说说 */
  const publishMoment = async () => {
    if (!content.trim()) {
      setStatus({ type: "err", text: "先写点内容吧" });
      return;
    }
    try {
      const images = momentImages.length ? await uploadImages(momentImages) : undefined;
      setStatus({ type: "busy", text: "正在提交说说…" });
      const file = await readTextFile(token, MOMENTS_PATH);
      const list = JSON.parse(file.text) as Moment[];
      const next: Moment = {
        id: `mo-${Date.now()}`,
        date: new Date().toISOString().slice(0, 19),
        content: content.trim(),
        mood: mood.trim() || "日常",
        ...(images ? { images } : {}),
        likes: 0,
        comments: 0,
      };
      await writeTextFile(token, MOMENTS_PATH, JSON.stringify([next, ...list], null, 2) + "\n", "新增一条说说", file.sha);
      setMoments([next, ...list]);
      setContent("");
      setMomentImages([]);
      setStatus({ type: "ok", text: "说说已发布！1-2 分钟后自动上线" });
    } catch (error) {
      setStatus({ type: "err", text: `发布失败：${(error as Error).message}` });
    }
  };

  /** 发布照片 */
  const publishPhotos = async () => {
    if (!photoFiles.length) {
      setStatus({ type: "err", text: "先选照片吧" });
      return;
    }
    try {
      const newPhotos: Photo[] = [];
      for (const [index, file] of photoFiles.entries()) {
        setStatus({ type: "busy", text: `正在压缩并上传照片 ${index + 1}/${photoFiles.length}…` });
        const height = await detectPhotoHeight(file);
        const blob = await compressImage(file);
        const name = makeFileName("jpg");
        await uploadBinaryFile(token, `public/photos/${name}`, blob, `上传照片 ${name}`);
        newPhotos.push({
          id: `p-${Date.now()}-${index}`,
          src: `/photos/${name}`,
          title: photoFiles.length === 1 && photoTitle.trim() ? photoTitle.trim() : file.name.replace(/\.[^.]+$/, ""),
          date: photoDate,
          album: album.trim() || "日常",
          height,
        });
      }
      setStatus({ type: "busy", text: "正在写入照片墙数据…" });
      const file = await readTextFile(token, PHOTOS_PATH);
      const list = JSON.parse(file.text) as Photo[];
      await writeTextFile(
        token,
        PHOTOS_PATH,
        JSON.stringify([...newPhotos, ...list], null, 2) + "\n",
        `新增 ${newPhotos.length} 张照片`,
        file.sha,
      );
      setPhotos([...newPhotos, ...list]);
      setPhotoFiles([]);
      setPhotoTitle("");
      setStatus({ type: "ok", text: `已发布 ${newPhotos.length} 张照片！1-2 分钟后自动上线` });
    } catch (error) {
      setStatus({ type: "err", text: `发布失败：${(error as Error).message}` });
    }
  };

  /** 删除仓库里上传的图片（只删 jpg/png/webp，不动原始素材） */
  const removeUploadedImages = async (paths: string[] = []) => {
    for (const path of paths) {
      if (!/\.(jpe?g|png|webp)$/i.test(path)) continue;
      const sha = await getFileSha(token, `public${path}`);
      if (sha) await deleteFile(token, `public${path}`, sha, `删除图片 ${path}`);
    }
  };

  const deleteMoment = async (moment: Moment) => {
    if (!window.confirm("确定删除这条说说吗？（会同时删除它的配图）")) return;
    try {
      setStatus({ type: "busy", text: "正在删除…" });
      const file = await readTextFile(token, MOMENTS_PATH);
      const list = (JSON.parse(file.text) as Moment[]).filter((item) => item.id !== moment.id);
      await writeTextFile(token, MOMENTS_PATH, JSON.stringify(list, null, 2) + "\n", "删除一条说说", file.sha);
      await removeUploadedImages(moment.images);
      setMoments(list);
      setStatus({ type: "ok", text: "已删除" });
    } catch (error) {
      setStatus({ type: "err", text: `删除失败：${(error as Error).message}` });
    }
  };

  const deletePhoto = async (photo: Photo) => {
    if (!window.confirm("确定删除这张照片吗？")) return;
    try {
      setStatus({ type: "busy", text: "正在删除…" });
      const file = await readTextFile(token, PHOTOS_PATH);
      const list = (JSON.parse(file.text) as Photo[]).filter((item) => item.id !== photo.id);
      await writeTextFile(token, PHOTOS_PATH, JSON.stringify(list, null, 2) + "\n", "删除一张照片", file.sha);
      await removeUploadedImages([photo.src]);
      setPhotos(list);
      setStatus({ type: "ok", text: "已删除" });
    } catch (error) {
      setStatus({ type: "err", text: `删除失败：${(error as Error).message}` });
    }
  };

  const albums = [...new Set(photos.map((photo) => photo.album))];

  /* ---------------- 未登录：显示登录卡片 ---------------- */
  if (!token) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 sm:px-8">
        <section className="glass-card glass-sheen flex flex-col gap-4 p-6">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-50">发布后台</h1>
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">
            在这里可以直接发布说说和照片：页面会调用 GitHub API 把内容提交进仓库，
            然后由 GitHub Actions 自动重新部署，1–2 分钟后线上生效。
            <br />
            需要一个 GitHub 令牌（Token），它只保存在你本机浏览器里，不会外传。
          </p>

          <ol className="flex flex-col gap-2 rounded-xl bg-white/50 p-4 text-xs text-gray-600 dark:bg-white/5 dark:text-gray-300">
            <li>
              1. 打开{" "}
              <a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 text-brand-600 hover:underline dark:text-brand-300"
              >
                github.com/settings/personal-access-tokens/new
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              2. Token name 随便填（例如 <code className="rounded bg-black/5 px-1 dark:bg-white/10">blog-admin</code>）
            </li>
            <li>3. Expiration 建议 90 天，过期后重新生成一个就行</li>
            <li>
              4. Repository access 选 <b>Only select repositories</b> → 勾选{" "}
              <code className="rounded bg-black/5 px-1 dark:bg-white/10">
                {ADMIN_REPO.owner}/{ADMIN_REPO.repo}
              </code>
            </li>
            <li>
              5. Permissions → Repository permissions → <b>Contents</b> 选 <b>Read and write</b>
            </li>
            <li>6. 点最下面的 Generate token，复制那串 ghp_ 开头的令牌，粘贴到下面</li>
          </ol>

          <input
            type="password"
            value={tokenInput}
            onChange={(event) => setTokenInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleLogin()}
            placeholder="粘贴 GitHub Token（ghp_… 或 github_pat_…）"
            className="glass-input font-mono text-xs"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogin}
              data-no-effect
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm text-white shadow-sm transition-transform hover:scale-[1.02]"
            >
              <Check className="h-3.5 w-3.5" />
              保存并登录
            </button>
            {status ? (
              <span className={cn("text-xs", status.type === "err" ? "text-rose-500" : "text-gray-500 dark:text-gray-400")}>
                {status.text}
              </span>
            ) : null}
          </div>
        </section>
      </div>
    );
  }

  /* ---------------- 已登录：发布界面 ---------------- */
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 sm:px-8">
      {/* 顶部状态条 */}
      <section className="glass-card glass-sheen flex flex-wrap items-center gap-3 p-4">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white">
          <Rocket className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-50">发布后台</p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            已登录 <b>@{login}</b> · 提交到 <b>{ADMIN_REPO.owner}/{ADMIN_REPO.repo}</b>
          </p>
        </div>
        <a
          href={`https://github.com/${ADMIN_REPO.owner}/${ADMIN_REPO.repo}/actions`}
          target="_blank"
          rel="noreferrer"
          className="glass-button px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200"
        >
          看部署进度
        </a>
        <button type="button" onClick={handleLogout} data-no-effect className="glass-button flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200">
          <LogOut className="h-3.5 w-3.5" />
          退出
        </button>
      </section>

      {status ? (
        <p
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs",
            status.type === "err"
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-300"
              : "bg-brand-500/10 text-brand-700 dark:text-brand-200",
          )}
        >
          {status.type === "busy" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          {status.text}
        </p>
      ) : null}

      {/* 切换 */}
      <div className="glass-card glass-sheen flex gap-1 p-1.5">
        {[
          { key: "moments" as const, label: "发说说", icon: MessageSquare },
          { key: "photos" as const, label: "发照片", icon: Camera },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            data-no-effect
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-colors",
              tab === item.key ? "bg-brand-600 text-white shadow-sm" : "text-gray-600 hover:bg-white/60 dark:text-gray-300 dark:hover:bg-white/10",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      {tab === "moments" ? (
        <>
          <section className="glass-card glass-sheen flex flex-col gap-3 p-4 sm:p-5">
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              placeholder="写点什么…（支持换行）"
              className="glass-input resize-none"
            />
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={mood}
                onChange={(event) => setMood(event.target.value)}
                list="mood-options"
                placeholder="心情标签"
                className="glass-input w-32 text-sm"
              />
              <datalist id="mood-options">
                {MOODS.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>

              <label className="glass-button flex cursor-pointer items-center gap-2 px-3 py-2 text-xs text-gray-700 dark:text-gray-200">
                <ImagePlus className="h-3.5 w-3.5" />
                配图（可多选）
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => setMomentImages(Array.from(event.target.files ?? []))}
                />
              </label>
              {momentImages.length ? (
                <span className="text-[11px] text-gray-500 dark:text-gray-400">已选 {momentImages.length} 张</span>
              ) : null}

              <button
                type="button"
                onClick={publishMoment}
                data-no-effect
                className="ml-auto flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm text-white shadow-sm transition-transform hover:scale-[1.02]"
              >
                <Send className="h-3.5 w-3.5" />
                发布
              </button>
            </div>
            {momentImages.length ? (
              <div className="flex flex-wrap gap-2">
                {momentImages.map((file) => (
                  <span key={file.name} className="rounded-lg bg-white/60 px-2 py-1 text-[11px] text-gray-600 dark:bg-white/10 dark:text-gray-300">
                    {file.name}
                  </span>
                ))}
              </div>
            ) : null}
          </section>

          <section className="glass-card glass-sheen flex flex-col gap-2 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">已有说说（{moments.length}）</h2>
            <ul className="flex flex-col gap-2">
              {moments.slice(0, 12).map((moment) => (
                <li key={moment.id} className="flex items-start gap-3 rounded-xl bg-white/45 p-3 dark:bg-white/5">
                  <span className="glass-pill shrink-0 px-2 py-0.5 text-[11px] text-gray-600 dark:text-gray-300">{moment.mood}</span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs text-gray-700 dark:text-gray-200">{moment.content}</p>
                    <p className="mt-1 text-[10px] text-gray-400">
                      {moment.date.slice(0, 10)}
                      {moment.images?.length ? ` · ${moment.images.length} 张图` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteMoment(moment)}
                    data-no-effect
                    aria-label="删除"
                    className="glass-button grid h-8 w-8 shrink-0 place-items-center text-gray-500 hover:text-rose-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <>
          <section className="glass-card glass-sheen flex flex-col gap-3 p-4 sm:p-5">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/70 bg-white/40 py-8 text-center transition-colors hover:bg-white/60 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10">
              <ImagePlus className="h-6 w-6 text-brand-500" />
              <span className="text-sm text-gray-700 dark:text-gray-200">点这里选照片（可多选）</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">会自动压缩到最长边 1600px，节省空间</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => setPhotoFiles(Array.from(event.target.files ?? []))}
              />
            </label>

            {photoFiles.length ? (
              <div className="flex flex-wrap gap-2">
                {photoFiles.map((file) => (
                  <span key={file.name} className="rounded-lg bg-white/60 px-2 py-1 text-[11px] text-gray-600 dark:bg-white/10 dark:text-gray-300">
                    {file.name}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                value={album}
                onChange={(event) => setAlbum(event.target.value)}
                list="album-options"
                placeholder="相册"
                className="glass-input text-sm"
              />
              <datalist id="album-options">
                {albums.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
              <input
                value={photoTitle}
                onChange={(event) => setPhotoTitle(event.target.value)}
                placeholder="标题（只选一张时生效，可留空用文件名）"
                className="glass-input text-sm"
              />
              <input type="date" value={photoDate} onChange={(event) => setPhotoDate(event.target.value)} className="glass-input text-sm" />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={publishPhotos}
                data-no-effect
                className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm text-white shadow-sm transition-transform hover:scale-[1.02]"
              >
                <Send className="h-3.5 w-3.5" />
                发布照片
              </button>
            </div>
          </section>

          <section className="glass-card glass-sheen flex flex-col gap-3 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">已有照片（{photos.length}）</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {photos.slice(0, 15).map((photo) => (
                <div key={photo.id} className="group relative">
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <Image src={photo.src} alt={photo.title} fill sizes="120px" className="object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => deletePhoto(photo)}
                    data-no-effect
                    aria-label="删除照片"
                    className="absolute -top-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-gray-500 shadow transition-colors hover:text-rose-500 dark:bg-slate-800/90"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <p className="mt-1 truncate text-[10px] text-gray-500 dark:text-gray-400">{photo.title}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

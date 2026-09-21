"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { siteConfig } from "@/site.config";
import { isAudioAvailable } from "@/lib/music-files";

export type Track = (typeof siteConfig.playlist)[number];

type MusicContextValue = {
  tracks: Track[];
  track: Track;
  index: number;
  playing: boolean;
  /** 当前进度（秒） */
  progress: number;
  /** true 表示音频文件不存在，处于「演示模式」：进度用计时器模拟 */
  demo: boolean;
  /** 当前这首歌的音频文件是否存在于 public/music/ */
  available: boolean;
  select: (index: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const tracks = siteConfig.playlist as Track[];
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [demo, setDemo] = useState(() => !isAudioAvailable(siteConfig.playlist[0]?.src ?? ""));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const track = tracks[index] ?? tracks[0];
  const available = isAudioAvailable(track.src);
  /** 供 toggle 读取当前曲目的可用状态（避免把 track 塞进依赖里） */
  const trackSrcRef = useRef(track.src);

  useEffect(() => {
    trackSrcRef.current = track.src;
  }, [track.src]);

  // 创建 audio 元素并挂载事件
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onTime = () => setProgress(audio.currentTime);
    const onEnded = () => {
      setIndex((prev) => (prev + 1) % tracks.length);
    };
    const onError = () => setDemo(true);
    const onLoaded = () => setDemo(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("loadedmetadata", onLoaded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [tracks.length]);

  // 切歌：更新 src（没有文件时不设置 src，避免浏览器请求 404）
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(0);

    if (!available) {
      audio.removeAttribute("src");
      setDemo(true);
      return;
    }

    setDemo(false);
    audio.src = track.src;
    if (playing) {
      audio.play().catch(() => setDemo(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, track.src, available]);

  // 演示模式：没有音频文件（或加载失败）时用计时器模拟播放进度
  useEffect(() => {
    if (!playing || !demo) return;
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev + 1 >= track.duration) {
          setIndex((current) => (current + 1) % tracks.length);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing, demo, track.duration, tracks.length]);

  const toggle = useCallback(() => {
    setPlaying((prev) => {
      const next = !prev;
      const audio = audioRef.current;
      if (audio && isAudioAvailable(trackSrcRef.current)) {
        if (next) audio.play().catch(() => setDemo(true));
        else audio.pause();
      }
      return next;
    });
  }, []);

  const select = useCallback((nextIndex: number) => {
    setIndex(nextIndex);
    setPlaying(true);
  }, []);

  const next = useCallback(() => setIndex((prev) => (prev + 1) % tracks.length), [tracks.length]);
  const prev = useCallback(() => setIndex((prev) => (prev - 1 + tracks.length) % tracks.length), [tracks.length]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (audio && !Number.isNaN(audio.duration)) audio.currentTime = seconds;
    setProgress(seconds);
  }, []);

  const value = useMemo<MusicContextValue>(
    () => ({ tracks, track, index, playing, progress, demo, available, select, toggle, next, prev, seek }),
    [tracks, track, index, playing, progress, demo, available, select, toggle, next, prev, seek],
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic 必须在 MusicProvider 内使用");
  return context;
}

/** 秒 -> 3:24 */
export function formatDuration(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

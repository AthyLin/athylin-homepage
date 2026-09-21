import manifest from "@/data/music-files.json";

/**
 * 实际存在的音频文件清单（由 scripts/gen-music-manifest.mjs 生成）。
 * 播放器只对清单里的文件发起请求，避免没放 mp3 时控制台刷 404。
 */
const AVAILABLE = new Set<string>(manifest as string[]);

export function isAudioAvailable(src: string) {
  return AVAILABLE.has(src);
}

/** 当前清单里的音频数量，用于提示 */
export const AVAILABLE_AUDIO_COUNT = AVAILABLE.size;

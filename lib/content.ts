import momentsJson from "@/data/moments.json";
import photosJson from "@/data/photos.json";

/**
 * 说说 / 照片的数据都放在 data/*.json 里 ——
 * 这样网页版发布后台（/admin）可以直接读写这两个文件，
 * 不需要动 TypeScript 源码。
 */

export type Moment = {
  id: string;
  date: string;
  content: string;
  mood: string;
  images?: string[];
  likes: number;
  comments: number;
};

export type Photo = {
  id: string;
  src: string;
  title: string;
  date: string;
  album: string;
  height: "tall" | "wide" | "normal";
};

export const moments = momentsJson as Moment[];
export const photos = photosJson as Photo[];

/** 照片墙顶部的相册筛选（按数据里的 album 自动汇总） */
export const photoAlbums = [...new Set(photos.map((photo) => photo.album))];

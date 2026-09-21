export type Photo = {
  id: string;
  src: string;
  title: string;
  date: string;
  album: string;
  height: "tall" | "wide" | "normal";
};

/** 照片墙数据：把真实照片放进 public/photos/ 后替换 src 即可 */
export const photos: Photo[] = [
  { id: "p1", src: "/photos/p1.svg", title: "清晨的第一缕光", date: "2026-09-16", album: "风光", height: "tall" },
  { id: "p2", src: "/photos/p2.svg", title: "城市天际线", date: "2026-09-12", album: "城市", height: "normal" },
  { id: "p3", src: "/photos/p3.svg", title: "橘子味晚霞", date: "2026-09-14", album: "风光", height: "wide" },
  { id: "p4", src: "/photos/p4.svg", title: "雨后的街道", date: "2026-08-27", album: "城市", height: "normal" },
  { id: "p5", src: "/photos/p5.svg", title: "海边的下午", date: "2026-08-21", album: "旅行", height: "tall" },
  { id: "p6", src: "/photos/p6.svg", title: "书桌一角", date: "2026-08-18", album: "日常", height: "normal" },
  { id: "p7", src: "/photos/p7.svg", title: "窗台上的猫", date: "2026-08-19", album: "日常", height: "normal" },
  { id: "p8", src: "/photos/p8.svg", title: "夏夜的星空", date: "2026-08-09", album: "风光", height: "wide" },
  { id: "p9", src: "/photos/p9.svg", title: "隧道尽头", date: "2026-07-30", album: "城市", height: "tall" },
  { id: "p10", src: "/photos/p10.svg", title: "旧胶片里的夏天", date: "2026-08-03", album: "回忆", height: "normal" },
  { id: "p11", src: "/photos/p11.svg", title: "午后咖啡馆", date: "2026-08-03", album: "日常", height: "normal" },
  { id: "p12", src: "/photos/p12.svg", title: "山间的雾", date: "2026-07-22", album: "旅行", height: "wide" },
];

export const photoAlbums = [...new Set(photos.map((photo) => photo.album))];

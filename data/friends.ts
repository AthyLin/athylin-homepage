export type Friend = {
  id: string;
  name: string;
  url: string;
  avatar: string;
  description: string;
  color: string;
};

/** 友情链接：把这里换成你朋友的信息即可 */
export const friends: Friend[] = [
  {
    id: "f1",
    name: "星屑工房",
    url: "https://example.com",
    avatar: "/avatars/f1.svg",
    description: "把每个夜晚都做成一颗星星。",
    color: "#4f46e5",
  },
  {
    id: "f2",
    name: "云上笔记",
    url: "https://example.com",
    avatar: "/avatars/f2.svg",
    description: "一个前端工程师的技术与生活记录。",
    color: "#6366f1",
  },
  {
    id: "f3",
    name: "深夜食堂",
    url: "https://example.com",
    avatar: "/avatars/f3.svg",
    description: "写代码，也写食谱。",
    color: "#818cf8",
  },
  {
    id: "f4",
    name: "第七个夏天",
    url: "https://example.com",
    avatar: "/avatars/f4.svg",
    description: "摄影 / 旅行 / 一些没用的浪漫。",
    color: "#a5b4fc",
  },
  {
    id: "f5",
    name: "像素花园",
    url: "https://example.com",
    avatar: "/avatars/f5.svg",
    description: "在这里种一些会发光的像素。",
    color: "#6366f1",
  },
  {
    id: "f6",
    name: "风与纸飞机",
    url: "https://example.com",
    avatar: "/avatars/f6.svg",
    description: "随手写点东西，随手发点牢骚。",
    color: "#6366f1",
  },
  {
    id: "f7",
    name: "二进制诗社",
    url: "https://example.com",
    avatar: "/avatars/f7.svg",
    description: "用代码写诗的奇怪组织。",
    color: "#4f46e5",
  },
  {
    id: "f8",
    name: "南风知我意",
    url: "https://example.com",
    avatar: "/avatars/f8.svg",
    description: "生活记录与一点点碎碎念。",
    color: "#14b8a6",
  },
];

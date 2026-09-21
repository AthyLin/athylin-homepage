export type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

/** 关于页的时间轴 */
export const timeline: TimelineItem[] = [
  {
    year: "2026",
    title: "开始认真打理自己的小站",
    description: "重写了整个站点，用玻璃拟态重新铺开自己的数字花园。",
  },
  {
    year: "2025",
    title: "成为一名前端工程师",
    description: "正式进入职场，开始在高频迭代里学习工程化与协作。",
  },
  {
    year: "2024",
    title: "第一次把项目开源",
    description: "收获了几十个 star，也第一次体会到「被使用」的责任感。",
  },
  {
    year: "2023",
    title: "拿起相机",
    description: "从手机随手拍，到开始研究中焦与光线，照片墙就是这两年攒下的光。",
  },
  {
    year: "2022",
    title: "写下第一篇文章",
    description: "为了搞懂一个 bug 而写笔记，后来发现写字本身就是一种思考方式。",
  },
];

/** 关于页的技能条 */
export const skills = [
  { name: "TypeScript / JavaScript", level: 92 },
  { name: "React / Next.js", level: 88 },
  { name: "CSS / 动效与可视化", level: 84 },
  { name: "Node.js / 后端接口", level: 74 },
  { name: "摄影与后期", level: 66 },
];

/** 首页「在忙什么」卡片 */
export const nowList = [
  { label: "在读", value: "《设计中的设计》" },
  { label: "在学", value: "WebGL 与着色器" },
  { label: "在写", value: "本站的看板娘模块" },
  { label: "在听", value: "夏夜的风 · 循环中" },
];

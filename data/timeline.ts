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
  }
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
  { label: "在读", value: "《追风筝的人》" },
  { label: "在学", value: "MySQL" },
  { label: "在写", value: "本站的整体文字介绍" },
  { label: "在听", value: "雨爱" },
];

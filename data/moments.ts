export type Moment = {
  id: string;
  date: string;
  content: string;
  mood: string;
  images?: string[];
  likes: number;
  comments: number;
};

/** 说说 / 碎碎念，按时间倒序 */
export const moments: Moment[] = [
  {
    id: "mo-12",
    date: "2026-09-18T21:40:00",
    content:
      "终于把站点的玻璃质感调到自己满意的程度了。原来「一点点模糊 + 一点点高光」就能让界面变得很温柔。",
    mood: "满足",
    likes: 42,
    comments: 6,
  },
  {
    id: "mo-11",
    date: "2026-09-14T18:05:00",
    content: "下班路上遇到一整片橘子色晚霞，掏出手机拍照的时候公交刚好开走。值得。",
    mood: "快乐",
    images: ["/photos/p3.svg"],
    likes: 88,
    comments: 12,
  },
  {
    id: "mo-10",
    date: "2026-09-09T23:12:00",
    content:
      "写代码写到一半去泡了杯茶，回来发现思路断了。所以现在我的原则是：想清楚了再起身。",
    mood: "平静",
    likes: 31,
    comments: 4,
  },
  {
    id: "mo-9",
    date: "2026-09-02T10:30:00",
    content: "九月计划：早睡 20 天、读完两本书、把照片墙整理完。目前进度 0%。",
    mood: "立志",
    likes: 57,
    comments: 9,
  },
  {
    id: "mo-8",
    date: "2026-08-27T15:48:00",
    content: "雨天 + 空调 + 白噪音 + 一杯冰美式 = 效率最高的下午。",
    mood: "专注",
    likes: 46,
    comments: 3,
  },
  {
    id: "mo-7",
    date: "2026-08-19T20:16:00",
    content: "给站点加了一个看板娘。她不会说话，但每次点她都会动一下，莫名安心。",
    mood: "可爱",
    images: ["/photos/p7.svg"],
    likes: 73,
    comments: 15,
  },
  {
    id: "mo-6",
    date: "2026-08-11T09:02:00",
    content: "早八的地铁里有个小朋友一直在看我屏幕上的代码，然后说「好多字母呀」。",
    mood: "好笑",
    likes: 64,
    comments: 8,
  },
  {
    id: "mo-5",
    date: "2026-08-03T22:35:00",
    content: "整理硬盘翻到三年前的照片，那时候的自己对什么都好奇。希望现在也还是。",
    mood: "怀旧",
    images: ["/photos/p10.svg", "/photos/p11.svg"],
    likes: 92,
    comments: 11,
  },
];

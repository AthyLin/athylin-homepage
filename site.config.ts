/**
 * 全站配置中心 —— 想换成自己的信息，只改这个文件即可。
 */
export const siteConfig = {
  /** 站点标题（浏览器标签页 / 导航栏） */
  title: "Athy的小屋",
  /** 站点副标题 */
  subtitle: "Athy",
  /** 一句话简介 */
  bio: "且将新火试旧茶，诗酒趁年华。",
  /** 详细自我介绍（关于页顶部） */
  description:
    "你好，我是这个站点的博主。平时喜欢拍拍照片、记一点乱七八糟的念头。这个站点是我的数字花园，欢迎随便逛逛。",
  /** 站点域名（用于 RSS、分享卡片里的绝对地址） */
  url: "https://athylin.cyou",

  /** 博主信息 */
  authorName: "AthyLin",
  /** 头像（放在 public/ 下，或改成外链） */
  avatarUrl: "/avatar.jpg",
  /** 点击头像跳转的链接，留空则不跳转 */
  websiteUrl: "",
  /** 所在地 */
  location: "中国 · 郑州",
  /** 职业标签 */
  jobTitle: "摄影爱好者",

  /** 主题色：同一色系（靛蓝）的四个深浅，用于背景光斑与高亮 */
  themeColors: ["#c7d2fe", "#e0e7ff", "#a5b4fc", "#eef2ff"],
  /** 是否使用渐变动效背景（false 则使用 themeColors 的静态渐变） */
  useGradient: true,

  /** 社交链接，留空则自动隐藏对应图标 */
  social: {
    github: "https://github.com",
    bilibili: "",
    email: "hello@example.com",
    x: "",
    youtube: "",
  },

  /** 建站时间（用于首页“运行天数”统计） */
  buildDate: "2026-01-01T00:00:00",
  /** 备案信息，留空隐藏 */
  icp: { name: "", link: "" },

  /** 首页文案 */
  postSectionTitle: "最近在写",
  momentSectionTitle: "碎碎念",

  /**
   * 音乐播放器歌单。
   * 音频文件放在 public/music/ 下，src 写 "/music/文件名"；duration 是秒数。
   * 想换歌：把 mp3 放进 public/music/，再改这里的 title / artist / src / duration。
   */
  playlist: [
    { id: "m1", title: "烟花易冷", artist: "周杰伦", cover: "/covers/c3.svg", src: "/music/fireworks-cold.mp3", duration: 263 },
    { id: "m2", title: "去年夏天", artist: "王大毛", cover: "/covers/c5.svg", src: "/music/去年夏天.mp3", duration: 245 },
    { id: "m3", title: "周杰伦串烧", artist: "周杰伦", cover: "/covers/c6.svg", src: "/music/周杰伦.mp3", duration: 2318 },
    { id: "m4", title: "串烧", artist: "屈家伟", cover: "/covers/c7.svg", src: "/music/串烧.mp3", duration: 2065 },
  ],
};

export type SiteConfig = typeof siteConfig;

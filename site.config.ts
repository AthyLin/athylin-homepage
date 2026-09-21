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
    "你好，我是这个站点的博主。平时写写代码、拍拍照片、记一点乱七八糟的念头。这个站点是我的数字花园，欢迎随便逛逛。",
  /** 站点域名 */
  url: "https://example.com",

  /** 博主信息 */
  authorName: "AthyLin",
  /** 头像（放在 public/ 下，或改成外链） */
  avatarUrl: "/avatar.svg",
  /** 点击头像跳转的链接，留空则不跳转 */
  websiteUrl: "",
  /** 所在地 */
  location: "中国 · 杭州",
  /** 职业标签 */
  jobTitle: "前端开发 / 摄影爱好者",

  /** 主题色：用于渐变背景与高亮 */
  themeColors: ["#a18cd1", "#fbc2eb", "#a1c4fd", "#c2e9fb"],
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

  /** 音乐播放器歌单（把音频放到 public/music/ 下即可真实播放，缺文件时为演示模式） */
  playlist: [
    { id: "m1", title: "夏夜的风", artist: "Demo Artist", cover: "/covers/c1.svg", src: "/music/summer-wind.mp3", duration: 254 },
    { id: "m2", title: "玻璃与星星", artist: "Demo Artist", cover: "/covers/c2.svg", src: "/music/glass-stars.mp3", duration: 218 },
    { id: "m3", title: "云端散步", artist: "Demo Artist", cover: "/covers/c3.svg", src: "/music/cloud-walk.mp3", duration: 197 },
    { id: "m4", title: "旧胶片", artist: "Demo Artist", cover: "/covers/c4.svg", src: "/music/old-film.mp3", duration: 231 },
  ],
};

export type SiteConfig = typeof siteConfig;

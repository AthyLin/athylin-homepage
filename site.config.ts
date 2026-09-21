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

  /**
   * 留言板：Giscus（基于 GitHub Discussions）
   *
   * 不需要服务器、数据库和密钥，留言存在你自己的 GitHub 仓库里，
   * Vercel / 静态托管的站点都能用。
   *
   * 配置步骤（详见 README「留言板（Giscus）」）：
   * 1. 仓库 Settings → General → Features 勾选 Discussions
   * 2. 到 https://github.com/apps/giscus 安装 App，只授权这个仓库
   * 3. 打开 https://giscus.app/zh-CN 填仓库名、选分类，把生成脚本里的
   *    data-category 与 data-category-id 填到下面两项
   */
  giscus: {
    /** 仓库全名 */
    repo: "AthyLin/athylin-homepage",
    /** 仓库 ID（已帮你填好，取自 GitHub API） */
    repoId: "R_kgDOT-Qaeg",
    /** 讨论分类名，例如 Announcements */
    category: "Announcements",
    /** 分类 ID，形如 DIC_kwDOxxxxxx（去 giscus.app 复制）。留空时页面会显示配置引导 */
    categoryId: "DIC_kwDOT-Qaes4DGDmU",
    /** 评论与页面的对应关系：pathname | url | title | og:title | specific */
    mapping: "pathname",
    /** 是否显示表情回应 */
    reactionsEnabled: true,
    /** 输入框位置：top | bottom */
    inputPosition: "top",
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

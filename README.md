# Athy的小屋 · 玻璃拟态个人博客

一个玻璃拟态（Glassmorphism）风格的个人博客站点：Bento 网格首页 + 动态渐变背景 + 深色模式，
包含文章、说说、照片墙、音乐、项目、友链、留言板与关于页。

> 参考了 GitHub 上同类玻璃拟态博客的设计语言（布局思路、玻璃质感、动效氛围），
> 代码与素材全部为本项目原创实现，未复制他仓库的源码与图片。

## 技术栈

- **框架**：Next.js 16（App Router）+ React 19
- **语言**：TypeScript
- **样式**：Tailwind CSS 4（CSS 优先配置）+ 自定义玻璃拟态组件类
- **图标**：lucide-react（品牌图标自行维护在 `components/icons/Brand.tsx`）
- **内容**：Markdown 文件（`gray-matter` + `marked` 解析）
- **留言板**：Giscus（基于 GitHub Discussions，无需服务器与密钥）
- **动效**：CSS 动画 + IntersectionObserver + Canvas（点击星光 / 鼠标拖尾 / 彩蛋）

## 快速开始

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器 → http://localhost:3000
npm run build        # 生产构建（含 TypeScript 检查与静态生成）
npm start            # 启动生产服务器
npm run assets       # 重新生成占位素材（头像 / 照片 / 封面 / favicon.ico / 音乐清单）
npm run audit        # 自检：资源引用、站内链接、敏感信息（只读）
```

Node.js 建议 20 以上（开发时使用 24）。

## 目录结构

```
athy-cottage/
├─ app/                      # App Router 页面
│  ├─ page.tsx               # 首页（Bento 网格）
│  ├─ layout.tsx             # 全局布局：背景、导航、页脚、播放器、看板娘
│  ├─ globals.css            # 设计系统：玻璃拟态、渐变背景、Markdown 排版
│  ├─ posts/                 # 文章列表 + 文章详情（含目录、点赞、评论）
│  ├─ moments/ photowall/ music/ projects/ friends/ messages/ about/
│  └─ feed.xml/route.ts      # RSS 订阅
├─ components/
│  ├─ layout/                # Navbar、Footer、Background、ClientEffects、Mascot
│  ├─ home/                  # 首页各张卡片
│  ├─ posts/ moments/ photos/ music/ messages/ friends/
│  ├─ providers/             # ThemeProvider、MusicProvider
│  └─ ui/                    # FadeIn 等通用组件
├─ content/posts/            # 文章 Markdown（写文章只改这里）
├─ data/                     # 说说、照片、友链、项目、时间轴、音乐清单
├─ lib/                      # 文章读取、日期工具、音乐清单判断
├─ public/                   # 头像、照片、封面、favicon（SVG/ICO 占位素材）
├─ scripts/                  # 素材生成、favicon 生成、音乐清单、自检
└─ site.config.ts            # 全站配置中心
```

## 换成你自己的内容

| 想改什么 | 改哪里 |
| --- | --- |
| 站点标题、简介、头像、社交链接、备案、歌单 | `site.config.ts` |
| 留言板（Giscus） | `site.config.ts` 的 `giscus` 字段 |
| 文章 | 在 `content/posts/` 新建 `xxx.md`，frontmatter 字段：`title / date / category / tags / cover / excerpt` |
| 说说 | `data/moments.ts` |
| 照片墙 | 把图片放进 `public/photos/`，再改 `data/photos.ts` 的 `src` |
| 友链 | `data/friends.ts` |
| 项目 | `data/projects.ts` |
| 关于页时间轴与技能条 | `data/timeline.ts` |
| 真实音乐播放 | 音频放进 `public/music/`，并在 `site.config.ts` 的 `playlist` 里登记 |
| 配色 | `site.config.ts` 的 `themeColors`，以及 `app/globals.css` 里的 `--color-brand-*` |

关于占位素材：`public/photos/*.svg`、`public/covers/*.svg`、`public/avatar.svg` 都是脚本生成的
抽象渐变插画，换真实照片时直接覆盖同名文件即可。

## 导入自己的音乐（MP3）

播放器是全站共用的：底部常驻播放条、首页「正在听」卡片、`/music` 页面读的都是
`site.config.ts` 里的同一个 `playlist` 数组，改一处三处都生效。

**第一步：放文件**

把 mp3 复制到 `public/music/`，例如 `public/music/summer-wind.mp3`。

**第二步：登记到 `site.config.ts`**

```ts
playlist: [
  { id: "m1", title: "夏夜的风", artist: "歌手名", cover: "/covers/c1.svg", src: "/music/summer-wind.mp3", duration: 254 },
  { id: "m2", title: "第二首", artist: "歌手名", cover: "/covers/c2.svg", src: "/music/song-2.mp3", duration: 218 },
],
```

- `src` 写 `/music/文件名.mp3`，以斜杠开头，**不要**写 `public`
- `duration` 填秒数（254 = 4 分 14 秒），只影响时长显示与进度条换算
- `cover` 是封面图，放 `public/covers/` 下，写 `/covers/xxx.jpg`
- 文件名建议英文小写加连字符，避免空格与中文

**第三步：重启 / 重新构建**

`npm run dev` 与 `npm run build` 之前会自动执行 `scripts/gen-music-manifest.mjs`，
扫描 `public/music/` 生成 `data/music-files.json`。

**为什么要有这个清单**：播放器只对清单里真实存在的文件发起请求，所以没放音频时
不会产生 404 请求，控制台保持干净；`/music` 页面会给未上传的曲目显示「未上传」标签。

## 留言板（Giscus）

留言板用 [Giscus](https://giscus.app/zh-CN)：**不需要服务器、不需要数据库、不需要任何密钥**，
留言直接存进你自己的 GitHub 仓库的 Discussions 里，部署在 Vercel 或静态托管都能用。

唯一的代价：访客需要登录 GitHub 账号才能留言。如果你需要「匿名留言」，
可以换成 Waline / Twikoo（需要额外部署一个服务端）。

### 三步配置

1. **开启 Discussions**：仓库 → Settings → General → Features → 勾选 `Discussions`
2. **安装 giscus App**：打开 https://github.com/apps/giscus → Install → 只授权这一个仓库
3. **填两个值**：打开 https://giscus.app/zh-CN ，填写仓库名 `AthyLin/athylin-homepage`，
   选一个分类（推荐新建 `Announcements`），页面下方会生成一段脚本，把其中的
   `data-category` 和 `data-category-id` 填到 `site.config.ts`：

   ```ts
   giscus: {
     repo: "AthyLin/athylin-homepage",
     repoId: "R_kgDOT-Qaeg",       // 已经帮你填好
     category: "Announcements",     // ← 换成你选的分类名
     categoryId: "DIC_kwDO...",     // ← 换成对应的一长串 ID
   },
   ```

填好之前，`/messages` 页面会显示一份带步骤的引导卡片（不会空白）；填好后刷新即可看到评论区。

留言会以 Discussion 的形式出现在仓库的 Discussions 里，你可以随时删除、加锁或设成公告。

## 控制台出现 404

| 报错 | 原因 | 说明 |
| --- | --- | --- |
| `Failed to load resource: 404` 指向 `/favicon.ico` | 浏览器会额外请求 `.ico` | 项目已提供 `public/favicon.ico`（`npm run assets` 生成）；缺失就重跑一次该命令 |
| `Failed to load resource: 404` 指向 `/music/xxx.mp3` | 还没放音频文件 | 正常情况不会出现（播放器只请求清单里的文件）；放好 mp3 后重启即可 |

## 功能说明

- **主题**：首屏内联脚本读取 `localStorage` / 系统偏好，避免深色模式闪白；导航栏可切换。
- **留言板**：Giscus 组件见 `components/messages/GiscusComments.tsx`，会跟随站点深浅色主题。
- **文章**：Markdown 存 `content/posts/`，构建期解析；详情页有目录高亮、点赞、评论演示、
  上一篇/下一篇；列表页支持搜索 + 分类 + 标签筛选。
- **音乐播放器**：全站底部常驻，`/music` 页可点播；没有音频文件时进入演示模式。
- **特效**：点击星光、鼠标拖尾（仅桌面端）、阅读进度条、回到顶部、连点 Logo 7 次的彩蛋。
- **看板娘**：`components/layout/Mascot.tsx` 里的轻量 SVG 小人，点击会换台词，可替换成 Live2D。
- **日期**：统一按 `Asia/Shanghai` 时区格式化（`lib/utils.ts`），避免服务端与浏览器渲染不一致。

## 部署

静态页面与文章在构建期生成，可以部署到 Vercel / Netlify / 自有服务器：

```bash
npm run build     # 构建
npm start         # 自有服务器启动
```

因为留言板走 Giscus（纯前端 + GitHub），**不需要配置任何环境变量**，
纯静态托管（如 GitHub Pages）也能完整使用。

### 部署到 Vercel

1. **把完整项目推上去**（这一步最容易出错）

   ```bash
   cd athy-cottage
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

   用 GitHub 网页上传时，**必须把 `app`、`components`、`content`、`data`、`lib`、
   `public`、`scripts` 这些文件夹一起拖进去**。只选根目录的散落文件会导致仓库里
   只有文件没有目录，Vercel 构建时报 `Couldn't find any `pages` or `app` directory`。

   上传后自查：仓库首页应该能看到 `app` `components` `content` `data` `lib`
   `public` `scripts` 这些目录，且没有 `node_modules/`、`.next/`。

2. **在 Vercel 导入**：vercel.com/new → Import Git Repository → 选中仓库
   （私有仓库要先给 Vercel 的 GitHub App 授权）

3. **Root Directory 留空** —— 项目文件在仓库根目录。只有当项目被放在子目录里
   （例如 `athy-cottage/`）才需要填子目录名。

4. **Deploy**。不需要环境变量。

5. **访问不到时检查域名**：Vercel 项目的正式域名在 Settings → Domains 里；
   团队（team）下的项目域名通常形如 `项目名-团队名.vercel.app`。
   如果站点要求登录才能访问，去 Settings → Deployment Protection 关闭
   「Vercel Authentication」。

### 部署到 GitHub Pages（不用服务器、不用密钥）

仓库里已经带了一份工作流 `.github/workflows/deploy-pages.yml`，推送到 `main` 就会自动：
装依赖 → 静态导出（`STATIC_EXPORT=1`）→ 发布到 GitHub Pages。

启用方法（只需一次）：仓库 **Settings → Pages → Build and deployment → Source 选「GitHub Actions」**。

之后访问：**https://用户名.github.io/仓库名/**

几点说明：

- 项目站点在子路径下（`/仓库名/`），所以工作流里设了 `NEXT_PUBLIC_BASE_PATH=/仓库名`；
  如果你改用「用户名.github.io」这种用户站点（部署在根路径），把工作流里那一行删掉。
- 静态导出时 `next.config.ts` 会自动打开 `output: "export"`、关闭图片优化、启用尾部斜杠。
- 本地预览静态产物：

  ```bash
  STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/仓库名 npm run build   # 产物在 out/
  npx serve out                                                  # 或任意静态服务器
  ```

- GitHub Pages 不需要任何环境变量，留言板走 Giscus（浏览器直连 GitHub）。

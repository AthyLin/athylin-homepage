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
- **数据**：留言板走 Route Handler 写入本地 JSON；其余为本地 TS 数据文件
- **动效**：CSS 动画 + IntersectionObserver + Canvas（点击星光 / 鼠标拖尾 / 彩蛋）

## 快速开始

```bash
cd athy-cottage      # 进入项目目录（目录名以你实际使用的为准）
npm install          # 安装依赖
npm run dev          # 启动开发服务器 → http://localhost:3000
npm run build        # 生产构建（会做 TypeScript 检查与静态生成）
npm start            # 启动生产服务器
npm run assets       # 重新生成占位素材（头像 / 照片 / 封面 SVG）
npm run doctor       # 检查留言板 Supabase 配置（只读）
npm run audit        # 检查资源引用、站内链接、敏感信息（只读）
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
│  ├─ api/messages/          # 留言板接口（GET / POST / 点赞）
│  └─ feed.xml/route.ts      # RSS 订阅
├─ components/
│  ├─ layout/                # Navbar、Footer、Background、ClientEffects、Mascot
│  ├─ home/                  # 首页各张卡片
│  ├─ posts/ moments/ photos/ music/ messages/ friends/
│  ├─ providers/             # ThemeProvider、MusicProvider
│  └─ ui/                    # FadeIn 等通用组件
├─ content/posts/            # 文章 Markdown（写文章只改这里）
├─ data/                     # 说说、照片、友链、项目、时间轴数据
├─ lib/                      # 文章读取、留言存储、工具函数
├─ public/                   # 头像、照片、封面、favicon（SVG 占位素材）
├─ scripts/gen-assets.mjs    # 占位素材生成脚本
└─ site.config.ts            # 全站配置中心
```

## 换成你自己的内容

| 想改什么 | 改哪里 |
| --- | --- |
| 站点标题、简介、头像、社交链接、备案、歌单 | `site.config.ts` |
| 文章 | 在 `content/posts/` 新建 `xxx.md`，frontmatter 字段：`title / date / category / tags / cover / excerpt` |
| 说说 | `data/moments.ts` |
| 照片墙 | 把图片放进 `public/photos/`，再改 `data/photos.ts` 的 `src` |
| 友链 | `data/friends.ts` |
| 项目 | `data/projects.ts` |
| 关于页时间轴与技能条 | `data/timeline.ts` |
| 真实音乐播放 | 音频放进 `public/music/`，并在 `site.config.ts` 的 `playlist` 里登记（见下方「导入自己的音乐」） |
| 配色 | `site.config.ts` 的 `themeColors`，以及 `app/globals.css` 里的 `--color-brand-*` |
| 留言板后端 | 在 `.env.local` 里填 Supabase 变量即可切到云端（见下方「留言板接入 Supabase」） |

关于占位素材：`public/photos/*.svg`、`public/covers/*.svg`、`public/avatar.svg` 都是脚本生成的
抽象渐变插画，换真实照片时直接覆盖同名文件即可。

## 导入自己的音乐（MP3）

播放器是全站共用的：底部常驻播放条、首页「正在听」卡片、`/music` 页面读的都是
`site.config.ts` 里的同一个 `playlist` 数组，改一处三处都生效。

**第一步：放文件**

把 mp3 复制到 `public/music/` 目录，例如 `public/music/summer-wind.mp3`。

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
- 文件名建议英文小写加连字符，避免空格与中文，省得 URL 转义出问题

**第三步：刷新页面**

保存后刷新即可播放。若某个 `src` 对应的文件不存在，播放器会自动进入「演示模式」
（进度条照走但不出声），底部会提示；补上文件再刷新就正常了。

**常见问题**

- **格式**：mp3 兼容性最好；`.wav` / `.flac` 主流浏览器也能播，Safari 对 flac 支持有限。
- **文件大小**：建议 192–320 kbps。音频会随 `public/` 一起打包部署，太大就放到对象存储/CDN，
  然后把 `src` 写成完整外链（如 `https://cdn.example.com/a.mp3`）。
- **外链封面图**：`next/image` 需要白名单，得在 `next.config.ts` 里加
  `images: { remotePatterns: [{ protocol: "https", hostname: "cdn.example.com" }] }`。
- **标签信息**：播放器取的是 `site.config.ts` 里手写的标题/歌手，不读 mp3 的 ID3 标签。
- **顺序**：数组顺序就是播放顺序，`next` / `prev` 会按顺序循环。

## 留言板接入 Supabase（云端持久化）

默认的本地 JSON 存储只能在自己电脑上跑；部署到 Vercel / Netlify 之后没有可写的磁盘，
留言会写失败。接上 Supabase 就能云端持久化，改动只在配置和一个存储文件里。

**第一步：建表**

在 Supabase 控制台 → SQL Editor 里执行 [supabase/messages-schema.sql](./supabase/messages-schema.sql)
（已包含建表、索引、RLS 策略、点赞函数）。脚本里 RLS 只开「读」权限，
写入全部走服务端，所以即使 anon key 公开也灌不进数据。

**第二步：配置密钥**

控制台 → Project Settings → API，复制 `Project URL` 和 `service_role` 密钥，然后：

```powershell
Copy-Item .env.example .env.local
```

编辑 `.env.local`：

```
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

`.env.local` 已被 `.gitignore` 忽略，不会提交；改完**要重启 `npm run dev`** 才生效。

**第三步：验证**

打开 `/messages`，表单下方会显示「存储：Supabase 云端」；发一条留言后，
去 Supabase 的 Table Editor 里应该能看到这行数据。

**原理**

`lib/messages-store.ts` 里两条路并存，三个函数签名一致（`readMessages` / `addMessage` / `likeMessage`），
接口与界面完全不用改：

```ts
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY ? createClient(...) : null;
export const MESSAGE_STORE = supabase ? "supabase" : "local-json";
```

想换回本地文件：把 `.env.local` 里那两个变量清空或删掉文件，重启即可。

**注意**

- `service_role` 能绕过 RLS，只能在服务端使用，**不要**加 `NEXT_PUBLIC_` 前缀
- Supabase 免费项目闲置 7 天会被暂停，需要进控制台手动恢复
- 点赞目前只防同一浏览器重复点，要严格防刷得自己加 IP/指纹去重或人机验证
- 想本地留言迁移到云端，用 SQL 脚本末尾注释里的 `insert` 语句补数据

### 跑不起来？先跑自查脚本

```bash
npm run doctor      # 等价于 node scripts/check-supabase.mjs
```

它会依次检查：依赖是否安装、`.env.local` 是否填对、密钥到底是 anon 还是 service_role、
能否连上 Supabase、`messages` 表是否存在、`like_message` 函数是否可用、3000 端口是否被占用。
全程只读，不会写入或修改你的数据。

常见报错对照：

| 报错信息 | 原因 | 解决 |
| --- | --- | --- |
| `'next' 不是内部或外部命令` / `Cannot find module '@supabase/supabase-js'` | 没装依赖 | 项目目录执行 `npm install` |
| 自查脚本显示「解析结果是 anon」 | 填的是 anon 公钥 | 到 Project Settings → API 复制 **service_role** 密钥 |
| `new row violates row-level security policy for table "messages"` | 同上，anon 受 RLS 限制无法写入 | 换成 service_role 密钥 |
| `Invalid API key` | 密钥复制不全或被轮换 | 重新复制完整密钥 |
| `relation "public.messages" does not exist`（42P01） | 建表脚本没执行 | SQL Editor 里跑 `supabase/messages-schema.sql` |
| `permission denied for function like_message`（42501） | 用 anon 密钥，或函数没建 | 换 service_role；重跑 SQL 脚本 |
| `fetch failed` / `ETIMEDOUT` | URL 写错或网络不通 | 检查 `.env.local` 里的 URL，确认能访问 supabase.com |
| 页面显示「存储：本地 JSON」 | `.env.local` 没生效，或打开了另一个 dev 实例的端口 | 改完环境变量必须重启 `npm run dev`；看终端里实际打印的 Local 地址 |

## 功能说明

- **主题**：首屏内联脚本读取 `localStorage` / 系统偏好，避免深色模式闪白；导航栏可切换。
- **留言板**：`GET/POST /api/messages` 读写留言，点赞走 `POST /api/messages/like`。
  后端由 `lib/messages-store.ts` 决定：配置了 Supabase 就走云端，没配则写本地 `.data/messages.json`，
  页面底部会显示当前用的是哪种存储。
- **文章评论**：演示实现，保存在浏览器 `localStorage`；接后端时改 `components/posts/PostComments.tsx` 里的 `submit`。
- **音乐播放器**：全站底部常驻。检测不到音频文件时进入「演示模式」，用计时器模拟播放进度。
- **特效**：点击星光、鼠标拖尾（仅桌面端）、阅读进度条、回到顶部、连续点击 Logo 7 次的彩蛋。
- **看板娘**：`components/layout/Mascot.tsx` 里的轻量 SVG 小人，点击会换台词，可替换成 Live2D。

## 部署

静态页面与文章在构建期生成，直接部署到 Vercel / Netlify / 自有服务器均可：

```bash
npm run build && npm start        # 自有服务器（Node 环境，需可写 .data/ 目录）
```

注意：留言板依赖服务端文件写入，纯静态托管（如 GitHub Pages）下留言接口不可用，
其余页面不受影响。

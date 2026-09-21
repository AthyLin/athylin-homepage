export type Project = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  url: string;
  repo: string;
  stars: number;
  status: "维护中" | "已完成" | "开发中";
  color: string;
};

export const projects: Project[] = [
  {
    id: "pr1",
    name: "Athy的小屋",
    description: "你现在看到的这个站点。Next.js + Tailwind 实现的玻璃拟态个人博客，含文章、说说、照片墙与留言板。",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    url: "https://example.com",
    repo: "https://github.com",
    stars: 128,
    status: "维护中",
    color: "#8b5cf6",
  },
  {
    id: "pr2",
    name: "GlassUI",
    description: "一套玻璃拟态风格的 React 组件库，提供卡片、按钮、输入框与弹窗，支持深浅色主题。",
    tags: ["React", "组件库", "CSS"],
    url: "https://example.com",
    repo: "https://github.com",
    stars: 96,
    status: "维护中",
    color: "#0ea5e9",
  },
  {
    id: "pr3",
    name: "Markdown Studio",
    description: "在线 Markdown 编辑器，支持分屏预览、代码高亮、目录大纲与一键导出图片。",
    tags: ["Vue", "Markdown", "编辑器"],
    url: "https://example.com",
    repo: "https://github.com",
    stars: 74,
    status: "已完成",
    color: "#10b981",
  },
  {
    id: "pr4",
    name: "Pixel Weather",
    description: "像素风格的天气小组件，右下角会下起和当日天气一致的雨或雪。",
    tags: ["Canvas", "动效", "天气 API"],
    url: "https://example.com",
    repo: "https://github.com",
    stars: 52,
    status: "开发中",
    color: "#f59e0b",
  },
  {
    id: "pr5",
    name: "PhotoFlow",
    description: "为摄影师做的瀑布流相册生成器，拖入文件夹即可生成可部署的静态站点。",
    tags: ["Node.js", "静态生成", "相册"],
    url: "https://example.com",
    repo: "https://github.com",
    stars: 41,
    status: "维护中",
    color: "#ec4899",
  },
];

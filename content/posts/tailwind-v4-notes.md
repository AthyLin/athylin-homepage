---
title: "Tailwind CSS 4 迁移笔记：配置写进 CSS 里"
date: "2026-08-28"
category: "技术"
tags: ["Tailwind CSS", "CSS", "工程化"]
cover: "/covers/c4.svg"
excerpt: "Tailwind 4 用 @theme 取代了 tailwind.config.js，类名式暗色模式也要重新声明。这篇记录实际改动点。"
---

Tailwind CSS 4 最大的变化是：配置文件不再是必需的，主题定义直接写进 CSS。

## 1. 入口文件只留一行 import

```css
@import "tailwindcss";
```

PostCSS 插件也变了，`tailwindcss` 换成 `@tailwindcss/postcss`：

```js
// postcss.config.mjs
export default { plugins: { "@tailwindcss/postcss": {} } };
```

如果你还留着 `@tailwind base; @tailwind components; @tailwind utilities;` 三行，构建会直接报错。

## 2. 主题用 @theme 定义

以前写在 `tailwind.config.js` 的 `theme.extend`，现在写成 CSS 变量：

```css
@theme {
  --color-brand-500: #8b5cf6;
  --font-sans: "PingFang SC", system-ui, sans-serif;
  --animate-float: float 6s ease-in-out infinite;
}
```

定义完之后，`bg-brand-500`、`animate-float` 这些类名就能直接用了。命名规则要遵守 `--color-*`、`--font-*`、`--animate-*` 这样的前缀。

## 3. 暗色模式要自己声明变体

4 版本默认用 `prefers-color-scheme`，想继续用 class 控制，需要显式声明：

```css
@custom-variant dark (&:where(.dark, .dark *));
```

这行的意思是：当祖先节点带 `.dark` 时，`dark:` 前缀才生效。

## 4. 几个被删掉的类

- `flex-shrink-*` / `flex-grow-*`：统一成 `shrink-*` / `grow-*`；
- `bg-opacity-50` 这类修饰：改用 `bg-black/50`；
- 阴影默认颜色从 `rgba(0,0,0,.1)` 变成了带透明度的 `currentColor` 混合，视觉上偏深，需要时手动指定颜色。

## 5. 迁移建议

1. 先保证 `postcss.config.mjs` 换掉插件；
2. 把 `tailwind.config.js` 里的 `theme.extend` 一条条搬到 `@theme`；
3. 全局搜索 `bg-opacity-`、`flex-shrink-`，批量替换；
4. 最后跑一次 `next build`，重点看自定义动画是否还生效。

整体迁移花了我一个下午，换来的好处是：主题变量和组件样式在同一个文件里，改配色的时候不用来回跳文件。

---
title: "Next.js App Router 踩坑笔记"
date: "2026-09-05"
category: "技术"
tags: ["Next.js", "React", "服务端组件"]
cover: "/covers/c3.svg"
excerpt: "服务端组件、水合报错、图片优化、metadata 生成——把这次重写站点时踩到的坑整理成一份清单。"
---

这次重写站点把 Pages Router 换成了 App Router，过程中遇到的坑比想象中多。整理一份清单，也算给以后的自己省点时间。

## 1. 默认就是服务端组件

`app/` 目录下的组件默认在服务端渲染，不能直接用 `useState`。需要交互的文件必须在第一行写：

```tsx
"use client";
```

我的习惯是：**页面骨架（page.tsx）保持服务端**，只把需要交互的叶子组件抽成客户端组件。文章列表、数据统计这类纯展示内容完全不需要进入客户端包。

## 2. 水合报错几乎都来自「时间」

在服务端渲染时输出当前时间、随机数、`window` 宽度，客户端再渲染一次就对不上了。三种解法：

1. 把这类内容放进 `useEffect`，首屏渲染占位；
2. 给根节点加 `suppressHydrationWarning`；
3. 干脆让父级页面 `export const dynamic = "force-dynamic"`。

我这次用的是第 1 种，还顺手避开了「运行天数」在静态导出时被冻结的问题。

## 3. 读文件必须留在服务端

博客文章用 Markdown 存放，读取时用 `node:fs`：

```ts
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "content", "posts");
export const slugs = fs.readdirSync(dir).map((f) => f.replace(/\.md$/, ""));
```

注意：一旦某个客户端组件间接 import 了这个文件，构建就会因为 `fs` 无法打包而失败。所以我把 `lib/posts.ts` 只提供给服务端组件使用。

## 4. metadata 要跟着内容走

文章详情页用 `generateMetadata` 把标题、摘要、封面写进 `<head>`，分享到社交平台时才有正确的预览卡片：

```ts
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return { title: post?.title, description: post?.excerpt };
}
```

注意 Next 15 之后 `params` 是 Promise，需要 `await`，这一点和早期文档不一致，很容易写错。

## 5. 构建期报错优先看 eslint 之外的输出

有一次 `next build` 失败，报错行号指向一个完全无关的组件。实际原因是我在客户端组件里用了 `path`。这类报错要往「模块边界」的方向想，而不是盯着那一行代码。

整理完这份清单，最大的感受是：App Router 的心智负担主要在**边界**上——服务端与客户端的边界、静态与动态的边界。想清楚边界，剩下的写法都很直接。

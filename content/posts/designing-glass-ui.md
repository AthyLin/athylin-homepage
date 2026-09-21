---
title: "玻璃拟态的实践笔记：如何让界面显得温柔"
date: "2026-09-12"
category: "设计"
tags: ["设计", "CSS", "玻璃拟态"]
cover: "/covers/c2.svg"
excerpt: "玻璃拟态不是加个 blur 就完事。透明度、描边、阴影、背景层次，这四件事决定了它是高级还是廉价。"
---

玻璃拟态（Glassmorphism）流行过，也被批评过。批评的理由通常很实在：对比度低、可读性差、看久了眼睛累。

但这些问题的解决方案并不是「不用玻璃」，而是**把玻璃放在对的地方**。

## 一、玻璃必须压在「有内容」的背景上

玻璃的透感来自背景。如果背景是一大片纯色，你得到的就是一块灰蒙蒙的方块。

所以我在页面底部铺了两层东西：

- 一层缓慢流动的渐变色块；
- 一层上下漂移的模糊光斑（blob）。

```tsx
<div className="fixed inset-0 -z-10 overflow-hidden">
  <div className="absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-purple-400/40 blur-3xl animate-blob" />
  <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-sky-400/35 blur-3xl animate-blob" />
</div>
```

光斑的位移速度要慢，`20s` 以上比较舒服。太快会让人分心。

## 二、透明度不要低于 0.4

浅色模式下我把卡片设成 `rgba(255,255,255,0.45)`，暗色模式是 `rgba(30,41,59,0.45)`。

低于 `0.4` 时，背后的文字和色块会渗上来，正文立刻变糊；高于 `0.7` 又完全没有玻璃的感觉。

## 三、描边与阴影是「厚度」的来源

| 属性 | 作用 | 我的取值 |
| --- | --- | --- |
| border | 制造玻璃边缘反光 | `1px solid rgba(255,255,255,0.55)` |
| box-shadow | 让卡片浮起来 | `0 8px 32px rgba(31,38,135,0.12)` |
| backdrop-filter | 让背后画面虚化 | `blur(16px) saturate(160%)` |

`saturate(160%)` 这一步很容易被忽略，但它能让透出来的背景色更鲜活，否则整块玻璃会发灰。

## 四、给卡片一点高光

最后加一层从左上角到右下角、由白到透明的渐变叠加，模拟玻璃的反射：

```css
.glass-sheen::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(140deg, rgba(255,255,255,.5), rgba(255,255,255,0) 42%);
  pointer-events: none;
}
```

这一层几乎不占视觉注意力，但会让卡片在移动鼠标 hover 时显得「有实体」。

## 五、什么时候不要用玻璃

正文阅读区、表单提交结果、报错提示，这三类地方我一律不给玻璃。它们需要最高的对比度，透气反而有害。所以文章详情页的正文是实底的，玻璃只出现在它的容器外框上。

设计上的克制，往往比技巧更能决定最终观感。

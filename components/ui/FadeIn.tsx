"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type FadeInProps = {
  children: React.ReactNode;
  /** 延迟秒数 */
  delay?: number;
  /** 起始偏移方向 */
  from?: "bottom" | "left" | "right" | "none";
  className?: string;
};

/** 元素进入视口时淡入上浮，用 IntersectionObserver 实现，不依赖第三方动画库 */
export default function FadeIn({ children, delay = 0, from = "bottom", className }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform =
    from === "bottom"
      ? "translate-y-6"
      : from === "left"
        ? "-translate-x-6"
        : from === "right"
          ? "translate-x-6"
          : "";

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        visible ? "translate-x-0 translate-y-0 opacity-100" : cn("opacity-0", hiddenTransform),
        className,
      )}
    >
      {children}
    </div>
  );
}

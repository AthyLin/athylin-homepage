"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

/** 顶部阅读进度条 */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max <= 0 ? 0 : Math.min(1, window.scrollY / max));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-brand-400 via-pink-400 to-sky-400 transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

/** 点击时的星光 / 爱心迸发 */
function ClickSparkle() {
  useEffect(() => {
    const symbols = ["✨", "⭐", "💜", "🌸", "💫"];
    const onPointerUp = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      // 输入框、按钮等交互区不打扰
      if (target?.closest("input, textarea, select, [data-no-effect]")) return;

      const host = document.createElement("div");
      host.className = "pointer-events-none fixed z-[9998]";
      host.style.left = `${event.clientX}px`;
      host.style.top = `${event.clientY}px`;

      const count = 6;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const distance = 26 + Math.random() * 34;
        const span = document.createElement("span");
        span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        span.style.cssText = `
          position:absolute; left:0; top:0; font-size:${10 + Math.random() * 8}px;
          transform:translate(-50%,-50%); transition:transform .72s cubic-bezier(.2,.8,.3,1), opacity .72s ease;
          opacity:1;
        `;
        host.appendChild(span);
        requestAnimationFrame(() => {
          span.style.transform = `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(.4) rotate(${(Math.random() - 0.5) * 180}deg)`;
          span.style.opacity = "0";
        });
      }
      document.body.appendChild(host);
      window.setTimeout(() => host.remove(), 800);
    };

    window.addEventListener("pointerup", onPointerUp);
    return () => window.removeEventListener("pointerup", onPointerUp);
  }, []);

  return null;
}

/** 鼠标拖尾：用 canvas 画一串逐渐淡出的圆点 */
function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 触屏设备不启用
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener("resize", resize);

    const points: { x: number; y: number; life: number; hue: number }[] = [];
    let pointer = { x: width / 2, y: height / 2 };

    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      points.push({ x: pointer.x, y: pointer.y, life: 1, hue: 250 + Math.random() * 60 });
      if (points.length > 26) points.shift();
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        point.life -= 0.024;
        if (point.life <= 0) continue;
        const radius = 3 + i * 0.28;
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius * 2.4);
        gradient.addColorStop(0, `hsla(${point.hue}, 90%, 75%, ${point.life * 0.5})`);
        gradient.addColorStop(1, "hsla(260, 90%, 75%, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = points.length - 1; i >= 0; i--) {
        if (points[i].life <= 0) points.splice(i, 1);
      }
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[45] hidden md:block" />;
}

/** 回到顶部，带一圈进度 */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max <= 0 ? 0 : Math.min(1, window.scrollY / max));
      setVisible(window.scrollY > 420);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const circumference = 2 * Math.PI * 20;

  return (
    <button
      type="button"
      aria-label="回到顶部"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      data-no-effect
      className={`glass-card fixed right-4 bottom-24 z-50 grid h-12 w-12 place-items-center rounded-full transition-all duration-300 sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(139,92,246,0.18)" strokeWidth="2.5" />
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="url(#totop)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
        <defs>
          <linearGradient id="totop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
      <ArrowUp className="h-4 w-4 text-gray-700 dark:text-gray-200" />
    </button>
  );
}

export default function ClientEffects() {
  return (
    <>
      <ScrollProgress />
      <ClickSparkle />
      <MouseTrail />
      <BackToTop />
    </>
  );
}

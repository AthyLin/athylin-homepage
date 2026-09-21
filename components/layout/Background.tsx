import { siteConfig } from "@/site.config";

/** 用固定种子生成星星位置，保证服务端与客户端渲染一致 */
function makeStars(count: number) {
  const stars: { top: number; left: number; size: number; delay: number; duration: number }[] = [];
  let seed = 20260921;
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  for (let i = 0; i < count; i++) {
    stars.push({
      top: random() * 100,
      left: random() * 100,
      size: 1 + random() * 2.4,
      delay: random() * 4,
      duration: 2.4 + random() * 3.2,
    });
  }
  return stars;
}

const STARS = makeStars(60);

/**
 * 全站背景：流动渐变 + 漂浮光斑 + 星点。
 * 放在 -z-10，让上层玻璃卡片有可模糊的内容。
 */
export default function Background() {
  const [c1, c2, c3, c4] = siteConfig.themeColors;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 底色：极淡的同色系渐变 */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `linear-gradient(180deg, ${c4}66 0%, ${c2}3d 45%, ${c1}2e 100%)`,
        }}
      />

      {/* 两枚同色光斑（不再用多色块） */}
      <div
        className="animate-blob absolute -top-48 left-1/4 h-[36rem] w-[36rem] rounded-full opacity-40 blur-3xl dark:opacity-25"
        style={{ background: `radial-gradient(circle at 40% 40%, ${c3}, transparent 70%)` }}
      />
      <div
        className="animate-blob absolute top-1/3 -right-48 h-[30rem] w-[30rem] rounded-full opacity-35 blur-3xl dark:opacity-20"
        style={{ background: `radial-gradient(circle at 60% 40%, ${c1}, transparent 70%)`, animationDelay: "-8s" }}
      />

      {/* 星点（暗色模式下更明显） */}
      <div className="absolute inset-0 hidden dark:block">
        {STARS.map((star, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-white"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* 顶部提亮，让玻璃卡片的高光更自然 */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/50 to-transparent dark:from-white/[0.04]" />
    </div>
  );
}

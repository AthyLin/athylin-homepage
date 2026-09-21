import NextImage, { type ImageProps } from "next/image";
import { asset } from "@/lib/asset";

/**
 * 包一层 next/image：自动给本地图片补上 basePath 前缀。
 *
 * 为什么需要：部署到子路径（GitHub Pages 的 /仓库名/）时，
 * next/image 不会自动加前缀，图片会 404。basePath 为空时它就是原样传递，
 * 所以对 Vercel 等根路径部署没有任何影响。
 */
export default function AppImage({ src, ...rest }: ImageProps) {
  return <NextImage src={typeof src === "string" ? asset(src) : src} {...rest} />;
}

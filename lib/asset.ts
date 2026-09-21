/**
 * 资源路径前缀工具。
 *
 * 部署在子路径时（例如 GitHub Pages 的 https://用户名.github.io/仓库名/），
 * 浏览器直接请求的资源（音频、图片链接等）需要带上 basePath 前缀。
 *
 * next/image、next/link 会自动处理前缀，但 <a href>、new Audio(src) 这类
 * 手写的路径不会，所以统一用 asset() 包一层。
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}

import type { Metadata } from "next";
import type { ReactNode } from "react";

// 后台不进搜索引擎
export const metadata: Metadata = {
  title: "发布后台",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}

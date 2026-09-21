import type { Metadata } from "next";
import { Mail } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import GiscusComments from "@/components/messages/GiscusComments";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "留言",
  description: "欢迎在这里留下足迹。",
};

export default function MessagesPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-8">
      <FadeIn>
        <PageHeader title="留言" description="不管是打个招呼还是提个建议，都会认真看。" icon={Mail} />
      </FadeIn>

      <FadeIn delay={0.06}>
        <GiscusComments />
      </FadeIn>

      <FadeIn delay={0.12}>
        <p className="mt-4 px-2 text-center text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
          留言需要登录 GitHub 账号（评论会保存在本站的 GitHub Discussions 里，你随时可以删除）。
        </p>
      </FadeIn>
    </div>
  );
}

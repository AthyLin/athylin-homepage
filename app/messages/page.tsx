import type { Metadata } from "next";
import { Mail } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import MessageBoard from "@/components/messages/MessageBoard";
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
        <MessageBoard />
      </FadeIn>
    </div>
  );
}

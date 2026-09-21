import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import MomentList from "@/components/moments/MomentList";
import FadeIn from "@/components/ui/FadeIn";
import { moments } from "@/lib/content";

export const metadata: Metadata = {
  title: "说说",
  description: "记录生活、技术与随想，想到什么写什么。",
};

export default function MomentsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-8">
      <FadeIn>
        <PageHeader
          title="说说"
          description={`${moments.length} 条碎碎念，记录生活、技术与随想。`}
          icon={MessageSquare}
        />
      </FadeIn>
      <FadeIn delay={0.06}>
        <MomentList moments={moments} />
      </FadeIn>
    </div>
  );
}

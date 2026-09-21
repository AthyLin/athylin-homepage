import { NextResponse } from "next/server";
import { likeMessage } from "@/lib/messages-store";

export const dynamic = "force-dynamic";

/** POST /api/messages/like —— 给某条留言点赞 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  if (!body?.id) return NextResponse.json({ error: "缺少留言 id" }, { status: 400 });

  const result = await likeMessage(body.id);

  if (!result.ok) {
    return result.reason === "not-found"
      ? NextResponse.json({ error: "留言不存在" }, { status: 404 })
      : NextResponse.json({ error: "点赞失败，请稍后再试" }, { status: 500 });
  }

  return NextResponse.json({ message: result.message });
}

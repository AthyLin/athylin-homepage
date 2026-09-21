import { NextResponse } from "next/server";
import { addMessage, MESSAGE_STORE, readMessages } from "@/lib/messages-store";

export const dynamic = "force-dynamic";

/** GET /api/messages —— 获取留言列表（store 字段告诉前端当前用的是哪个后端） */
export async function GET() {
  const messages = await readMessages();
  return NextResponse.json({ messages, store: MESSAGE_STORE });
}

/** POST /api/messages —— 发表留言 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { name?: string; content?: string } | null;
  const content = body?.content?.trim();

  if (!content) {
    return NextResponse.json({ error: "留言内容不能为空" }, { status: 400 });
  }
  if (content.length > 500) {
    return NextResponse.json({ error: "留言太长了（最多 500 字）" }, { status: 400 });
  }

  const message = await addMessage(body?.name ?? "", content);
  if (!message) {
    return NextResponse.json({ error: "留言保存失败，请稍后再试" }, { status: 500 });
  }
  return NextResponse.json({ message, store: MESSAGE_STORE }, { status: 201 });
}

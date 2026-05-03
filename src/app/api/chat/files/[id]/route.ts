import { readFile, rm } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { canAccessChannel, canAccessDirectThread, type ChatUser } from "@/lib/chat";

const uploadDir = path.join(process.cwd(), "storage", "chat-uploads");

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = session.user as ChatUser;
  const { id } = await params;
  const attachment = await prisma.chatAttachment.findUnique({
    where: { id },
    include: {
      message: {
        select: {
          channelId: true,
          directThreadId: true,
        },
      },
    },
  });

  if (!attachment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (attachment.expiresAt.getTime() <= Date.now()) {
    await rm(path.join(uploadDir, attachment.storedName), { force: true });
    await prisma.chatAttachment.delete({ where: { id: attachment.id } });
    return NextResponse.json({ error: "File expired" }, { status: 410 });
  }

  const canAccess = attachment.message.directThreadId
    ? await canAccessDirectThread(currentUser.id, attachment.message.directThreadId)
    : attachment.message.channelId
      ? await canAccessChannel(currentUser, attachment.message.channelId)
      : false;

  if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const file = await readFile(path.join(uploadDir, attachment.storedName));

  return new Response(file, {
    headers: {
      "Content-Type": attachment.mimeType,
      "Content-Length": attachment.size.toString(),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(attachment.originalName)}`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import {
  canAccessChannel,
  canAccessDirectThread,
  ensureGeneralChannel,
  type ChatUser,
} from "@/lib/chat";

const uploadDir = path.join(process.cwd(), "storage", "chat-uploads");
const maxFileSize = 20 * 1024 * 1024;
const retentionDays = 30;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = session.user as ChatUser;
  const formData = await req.formData();
  const file = formData.get("file");
  const type = formData.get("type") === "dm" ? "dm" : "channel";
  const id = formData.get("id")?.toString();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (file.size > maxFileSize) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const general = await ensureGeneralChannel();
  const conversationId = type === "dm" ? id : id ?? general.id;

  if (!conversationId) {
    return NextResponse.json({ error: "Missing conversation" }, { status: 400 });
  }

  const canAccess = type === "dm"
    ? await canAccessDirectThread(currentUser.id, conversationId)
    : await canAccessChannel(currentUser, conversationId);

  if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await mkdir(uploadDir, { recursive: true });

  const storedName = randomUUID();
  const bytes = await file.arrayBuffer();
  await writeFile(path.join(uploadDir, storedName), Buffer.from(bytes));

  const expiresAt = new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000);
  const message = await prisma.message.create({
    data: {
      text: file.name,
      userId: currentUser.id,
      ...(type === "dm" ? { directThreadId: conversationId } : { channelId: conversationId }),
      attachments: {
        create: {
          originalName: file.name,
          storedName,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          expiresAt,
        },
      },
    },
    include: {
      user: { select: { username: true, realName: true } },
      attachments: true,
    },
  });

  return NextResponse.json(message);
}

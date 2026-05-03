import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import {
  canAccessChannel,
  canAccessDirectThread,
  ensureGeneralChannel,
  getOrCreateDirectThread,
  type ChatUser,
} from "@/lib/chat";

function getConversationParams(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type") === "dm" ? "dm" : "channel";
  const id = url.searchParams.get("id");

  return { type, id };
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = session.user as ChatUser;
  const { type, id } = getConversationParams(req);
  const general = await ensureGeneralChannel();
  const conversationId = id ?? general.id;

  if (type === "dm") {
    const canAccess = await canAccessDirectThread(currentUser.id, conversationId);
    if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } else {
    const canAccess = await canAccessChannel(currentUser, conversationId);
    if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: type === "dm"
      ? { directThreadId: conversationId }
      : { channelId: conversationId },
    take: 50,
    orderBy: { createdAt: 'asc' },
    include: {
      user: { select: { username: true, realName: true } },
      attachments: { where: { expiresAt: { gt: new Date() } } },
    }
  });

  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = session.user as ChatUser;
  const { text, type = "channel", id, recipientId } = await req.json();
  if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

  const general = await ensureGeneralChannel();
  let conversationId = type === "dm" ? id : id ?? general.id;

  if (type === "dm") {
    if (!conversationId && !recipientId) {
      return NextResponse.json({ error: "Missing DM target" }, { status: 400 });
    }

    if (!conversationId && recipientId) {
      const thread = await getOrCreateDirectThread(currentUser.id, recipientId);
      conversationId = thread.id;
    }

    const canAccess = await canAccessDirectThread(currentUser.id, conversationId);
    if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } else {
    const canAccess = await canAccessChannel(currentUser, conversationId);
    if (!canAccess) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: {
      text,
      userId: currentUser.id,
      ...(type === "dm" ? { directThreadId: conversationId } : { channelId: conversationId }),
    },
    include: {
      user: { select: { username: true, realName: true } },
      attachments: { where: { expiresAt: { gt: new Date() } } },
    }
  });

  return NextResponse.json(message);
}

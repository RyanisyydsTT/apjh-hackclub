import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getOrCreateDirectThread, type ChatUser } from "@/lib/chat";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = session.user as ChatUser;
  const { recipientId } = await req.json();

  if (!recipientId || recipientId === currentUser.id) {
    return NextResponse.json({ error: "Invalid recipient" }, { status: 400 });
  }

  const recipient = await prisma.user.findUnique({
    where: { id: recipientId },
    select: { id: true },
  });

  if (!recipient) {
    return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
  }

  const thread = await getOrCreateDirectThread(currentUser.id, recipientId);

  return NextResponse.json({ id: thread.id });
}

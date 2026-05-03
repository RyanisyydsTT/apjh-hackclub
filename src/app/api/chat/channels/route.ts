import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getAccessibleChannels, isLeader, type ChatUser } from "@/lib/chat";

function toSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const channels = await getAccessibleChannels(session.user as ChatUser);
  return NextResponse.json(channels);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = session.user as ChatUser;
  if (!isLeader(currentUser)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, description, memberIds = [] } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Missing channel name" }, { status: 400 });
  }

  const slugBase = toSlug(name) || "channel";
  let slug = slugBase;
  let suffix = 1;

  while (await prisma.chatChannel.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${slugBase}-${suffix}`;
  }

  const allowedMemberIds = Array.from(new Set<string>([currentUser.id, ...memberIds]));
  const isLimitedToMembers = memberIds.length > 0;

  const channel = await prisma.chatChannel.create({
    data: {
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      isPrivate: isLimitedToMembers,
      createdById: currentUser.id,
      members: isLimitedToMembers
        ? {
            create: allowedMemberIds.map((userId) => ({ userId })),
          }
        : undefined,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              realName: true,
              role: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(channel);
}

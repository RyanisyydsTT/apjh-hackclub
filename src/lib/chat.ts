import { prisma } from "@/lib/prisma";

export type ChatUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string;
};

export function isLeader(user: ChatUser) {
  return user.role === "LEADER";
}

export async function ensureGeneralChannel() {
  return prisma.chatChannel.upsert({
    where: { slug: "general" },
    update: {},
    create: {
      id: "general",
      name: "general",
      slug: "general",
      description: "全體社員聊天頻道",
      isPrivate: false,
    },
  });
}

export async function getAccessibleChannels(user: ChatUser) {
  await ensureGeneralChannel();

  return prisma.chatChannel.findMany({
    where: isLeader(user)
      ? {}
      : {
          OR: [
            { isPrivate: false },
            { members: { some: { userId: user.id } } },
          ],
        },
    orderBy: [{ isPrivate: "asc" }, { createdAt: "asc" }],
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
}

export async function canAccessChannel(user: ChatUser, channelId: string) {
  const channel = await prisma.chatChannel.findUnique({
    where: { id: channelId },
    include: { members: { select: { userId: true } } },
  });

  if (!channel) return false;
  if (isLeader(user) || !channel.isPrivate) return true;

  return channel.members.some((member) => member.userId === user.id);
}

export async function getOrCreateDirectThread(currentUserId: string, peerUserId: string) {
  const targetMemberIds = [currentUserId, peerUserId].sort();
  const existingThreads = await prisma.directThread.findMany({
    where: {
      members: {
        some: { userId: currentUserId },
      },
    },
    include: {
      members: {
        select: { userId: true },
      },
    },
  });

  const existingThread = existingThreads.find((thread) => {
    const memberIds = thread.members.map((member) => member.userId).sort();
    return memberIds.length === 2 && memberIds[0] === targetMemberIds[0] && memberIds[1] === targetMemberIds[1];
  });

  if (existingThread) return existingThread;

  return prisma.directThread.create({
    data: {
      members: {
        create: [
          { userId: currentUserId },
          { userId: peerUserId },
        ],
      },
    },
    include: {
      members: {
        select: { userId: true },
      },
    },
  });
}

export async function canAccessDirectThread(userId: string, threadId: string) {
  const member = await prisma.directThreadMember.findUnique({
    where: {
      threadId_userId: {
        threadId,
        userId,
      },
    },
  });

  return Boolean(member);
}

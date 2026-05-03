import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ChatRoom } from "@/components/ChatRoom";
import { prisma } from "@/lib/prisma";
import { ensureGeneralChannel, getAccessibleChannels, type ChatUser } from "@/lib/chat";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/chat");
  }

  const currentUser = session.user as ChatUser;
  const generalChannel = await ensureGeneralChannel();
  const channels = await getAccessibleChannels(currentUser);
  const users = await prisma.user.findMany({
    where: { id: { not: currentUser.id } },
    orderBy: [{ role: 'asc' }, { realName: 'asc' }, { username: 'asc' }],
    select: {
      id: true,
      username: true,
      realName: true,
      role: true,
    },
  });
  const directThreads = await prisma.directThread.findMany({
    where: {
      members: {
        some: { userId: currentUser.id },
      },
    },
    orderBy: { updatedAt: 'desc' },
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

  const initialMessages = await prisma.message.findMany({
    where: { channelId: generalChannel.id },
    take: 50,
    orderBy: { createdAt: 'asc' },
    include: {
      user: { select: { username: true, realName: true } },
      attachments: { where: { expiresAt: { gt: new Date() } } },
    }
  });

  return (
    <div className="flex h-screen flex-col">
      <Navbar initialTheme="light" />
      <main className="flex flex-1 flex-col overflow-hidden pt-20">
        <ChatRoom 
          channels={channels}
          users={users}
          directThreads={directThreads}
          initialMessages={initialMessages} 
          currentUser={currentUser} 
        />
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { UserManagement } from "@/components/admin/UserManagement";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { Users, FileText } from "lucide-react";
import type { ChatUser } from "@/lib/chat";

export const metadata: Metadata = {
  title: "管理面板",
  description: "APJH Hack Club 管理面板。",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as ChatUser).role !== 'LEADER') {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    orderBy: { username: 'asc' }
  });

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const articles = await prisma.knowledgebase.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar initialTheme="light" />
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 pb-4 pt-28 md:px-8 md:pb-8 md:pt-32">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800">管理面板 (Admin Panel)</h1>
          <p className="text-slate-600 mt-2">歡迎回來，{session.user?.name}。在這裡管理社團成員與內容。</p>
        </header>

        <div className="space-y-16">
          <section id="users">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-8 h-8 text-[#ec3750]" />
              <h2 className="text-2xl font-bold text-slate-800">成員管理</h2>
            </div>
            <UserManagement initialUsers={users} />
          </section>

          <section id="content">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-8 h-8 text-[#ec3750]" />
              <h2 className="text-2xl font-bold text-slate-800">內容管理</h2>
            </div>
            <ContentManagement 
              initialAnnouncements={announcements} 
              initialArticles={articles} 
            />
          </section>
        </div>
      </main>
    </div>
  );
}

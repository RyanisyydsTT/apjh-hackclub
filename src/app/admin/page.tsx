import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { FileText } from "lucide-react";
import { isAdminSession } from "@/lib/admin";
import { ObsCourseEditor } from "@/components/admin/ObsCourseEditor";

export const metadata: Metadata = {
  title: "管理面板",
  description: "APJHIRC 安平國中資訊研究社管理面板。",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!isAdminSession(session)) {
    redirect("/");
  }

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const articles = await prisma.knowledgebase.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  const obsCourse = await prisma.obsCourse.findUnique({
    where: { id: "default" },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar initialTheme="light" />
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 pb-4 pt-28 md:px-8 md:pb-8 md:pt-32">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800">管理面板 (Admin Panel)</h1>
          <p className="text-slate-600 mt-2">歡迎回來，{session.user?.name}。在這裡管理公開內容與 OBS 課程畫面。</p>
        </header>

        <div className="space-y-16">
          <section id="obs-course">
            <ObsCourseEditor
              initialValue={{
                period: obsCourse?.period ?? "目前課程",
                title: obsCourse?.title ?? "雲端開發環境啟動",
                detail: obsCourse?.detail ?? "建立 GitHub 帳號、開啟 Codespaces，完成第一個測試網站",
              }}
            />
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

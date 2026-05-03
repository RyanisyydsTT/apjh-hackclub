import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bell, Lock, Calendar, Globe, Megaphone } from "lucide-react";

export default async function AnnouncementsPage() {
  const session = await getServerSession(authOptions);
  
  const publicAnnouncements = await prisma.announcement.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' }
  });

  const privateAnnouncements = session ? await prisma.announcement.findMany({
    where: { isPublic: false },
    orderBy: { createdAt: 'desc' }
  }) : [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Page Header */}
      <header className="bg-slate-900 pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex p-4 rounded-3xl bg-[#ec3750]/10 text-[#ec3750] mb-6">
            <Megaphone className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">社團公告</h1>
          <p className="text-xl text-slate-400 font-medium">獲取最新活動資訊與工作坊安排</p>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 pb-4 pt-12 md:px-8 md:pb-8 md:pt-16 relative z-10">
        <div className="grid gap-12">
          {session && privateAnnouncements.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8 px-4">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-slate-800">內部公告</h2>
              </div>
              <div className="space-y-8">
                {privateAnnouncements.map((ann) => (
                  <AnnouncementCard key={ann.id} announcement={ann} isPrivate />
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center gap-3 mb-8 px-4">
              <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-slate-800">公開公告</h2>
            </div>
            {publicAnnouncements.length > 0 ? (
              <div className="space-y-8">
                {publicAnnouncements.map((ann) => (
                  <AnnouncementCard key={ann.id} announcement={ann} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center shadow-xl shadow-slate-200/50">
                <p className="text-slate-400 text-lg font-bold italic">目前沒有公開公告。</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function AnnouncementCard({ announcement, isPrivate = false }: { announcement: any, isPrivate?: boolean }) {
  return (
    <article className={`group relative bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border transition-all hover:-translate-y-1 hover:shadow-2xl ${
      isPrivate ? 'border-amber-100 hover:border-amber-300' : 'border-slate-100 hover:border-[#ec3750]/20'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
               isPrivate ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
             }`}>
               {isPrivate ? 'Internal' : 'Public'}
             </span>
          </div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{announcement.title}</h3>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-bold bg-slate-50 px-4 py-2 rounded-2xl whitespace-nowrap">
          <Calendar className="w-5 h-5" />
          {new Date(announcement.createdAt).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <div className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#ec3750] prose-img:rounded-3xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {announcement.content}
        </ReactMarkdown>
      </div>
      
      {/* Decorative side bar */}
      <div className={`absolute left-0 top-12 bottom-12 w-1.5 rounded-r-full transition-colors ${
        isPrivate ? 'bg-amber-400' : 'bg-[#ec3750]'
      }`} />
    </article>
  );
}

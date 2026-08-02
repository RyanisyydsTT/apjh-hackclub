import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, Megaphone } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "社團公告",
  description: "查看 APJHIRC 安平國中資訊研究社最新活動資訊、工作坊安排與社團公告。",
  alternates: {
    canonical: "/announcements",
  },
  openGraph: {
    title: "社團公告 | APJHIRC",
    description: "APJHIRC 安平國中資訊研究社最新活動資訊與工作坊安排。",
    url: absoluteUrl("/announcements"),
  },
};

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <header className="relative overflow-hidden bg-slate-950 px-4 pb-16 pt-32 text-center">
        <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#ec3750]/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-black text-[#ff7185]">
            <Megaphone className="h-4 w-4" />
            WHAT&apos;S NEW
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">社團公告</h1>
          <p className="mt-4 text-lg font-medium text-slate-400">活動資訊、工作坊安排與重要提醒，都在這裡。</p>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-grow px-4 py-14 md:px-8 md:py-16">
        <div className="grid gap-12">
          <section>
            {announcements.length > 0 ? (
              <div className="space-y-8">
                {announcements.map((ann) => (
                  <AnnouncementCard key={ann.id} announcement={ann} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center shadow-xl shadow-slate-200/50">
                <p className="text-slate-400 text-lg font-bold italic">目前沒有公告。</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

type AnnouncementItem = {
  title: string;
  content: string;
  createdAt: Date | string;
};

function AnnouncementCard({ announcement }: { announcement: AnnouncementItem }) {
  return (
    <article className="group relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-[#ec3750]/30 hover:shadow-xl md:p-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="px-3 py-1 rounded-full bg-blue-100 text-xs font-black uppercase tracking-widest text-blue-600">
               APJHIRC
             </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">{announcement.title}</h2>
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
      
      <div className="absolute bottom-8 left-0 top-8 w-1 rounded-r-full bg-[#ec3750]" />
    </article>
  );
}

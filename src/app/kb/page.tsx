import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { Book, ChevronRight } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "社團知識庫",
  description: "APJH Hack Club 知識庫：AI 輔助開發、資安、網頁開發與駭客文化學習資源。",
  alternates: {
    canonical: "/kb",
  },
  openGraph: {
    title: "社團知識庫 | APJH Hack Club",
    description: "閱讀 APJH Hack Club 的課程大綱、資安觀念與程式創作學習筆記。",
    url: absoluteUrl("/kb"),
  },
};

export default async function KBPage() {
  const articles = await prisma.knowledgebase.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar initialTheme="light" />
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 pb-4 pt-28 md:px-8 md:pb-8 md:pt-32">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
            <Book className="w-10 h-10 text-[#ec3750]" />
            社團知識庫
          </h1>
          <p className="text-slate-600 mt-2">在這裡學習程式設計、硬體與駭客文化的知識。</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/kb/${article.slug}`}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-[#ec3750] transition-all flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#ec3750] transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  最後更新: {new Date(article.updatedAt).toLocaleDateString('zh-TW')}
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-[#ec3750] transform group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
          {articles.length === 0 && (
            <p className="text-slate-500 italic">目前沒有知識庫文章。</p>
          )}
        </div>
      </main>
    </div>
  );
}

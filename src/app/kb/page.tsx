import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { ChevronRight, Clock3 } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "社團知識庫",
  description: "APJHIRC 知識庫：AI 輔助開發、資安、網頁開發與 Vibe Coding 學習資源。",
  alternates: {
    canonical: "/kb",
  },
  openGraph: {
    title: "社團知識庫 | APJHIRC",
    description: "閱讀 APJHIRC 的課程大綱、資安觀念與程式創作學習筆記。",
    url: absoluteUrl("/kb"),
  },
};

export default async function KBPage() {
  const articles = await prisma.knowledgebase.findMany({
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />
      <header className="graph border-b-2 border-line px-4 pb-14 pt-28">
        <div className="mx-auto max-w-6xl">
          <h1 className="display text-4xl text-ink sm:text-5xl">社團知識庫</h1>
          <p className="mt-5 max-w-2xl border-l-4 border-line pl-5 text-lg font-medium leading-8 text-ink-soft">
            課程筆記、程式開發與資訊安全資源，讓你下課後也能繼續探索。
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-grow px-4 py-14 md:px-8 md:py-16">
        {articles.length === 0 ? (
          <p className="brut-flat p-12 text-center font-medium text-ink-soft">
            文章正在準備中，敬請期待。
          </p>
        ) : (
          <div className="grid gap-0.5 border-2 border-line bg-line md:grid-cols-2">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/kb/${article.slug}`}
                className="group flex min-h-44 flex-col justify-between bg-paper p-7 transition-colors hover:bg-ink"
              >
                <h2 className="display text-xl text-ink group-hover:text-paper">
                  {article.title}
                </h2>
                <div className="mt-7 flex items-center justify-between">
                  <span className="stencil flex items-center gap-2 text-ink-soft group-hover:text-paper">
                    <Clock3 className="h-4 w-4" />
                    {new Date(article.updatedAt).toLocaleDateString('zh-TW')}
                  </span>
                  <ChevronRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

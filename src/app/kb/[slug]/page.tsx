import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl, excerptMarkdown } from "@/lib/seo";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.knowledgebase.findUnique({
    where: { slug },
    select: {
      title: true,
      content: true,
      updatedAt: true,
    },
  });

  if (!article) {
    return {
      title: "找不到文章",
      robots: { index: false, follow: false },
    };
  }

  const description = excerptMarkdown(article.content);

  return {
    title: article.title,
    description,
    alternates: {
      canonical: `/kb/${slug}`,
    },
    openGraph: {
      type: "article",
      title: `${article.title} | APJH Hack Club`,
      description,
      url: absoluteUrl(`/kb/${slug}`),
      modifiedTime: article.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary",
      title: article.title,
      description,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await prisma.knowledgebase.findUnique({
    where: { slug }
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar initialTheme="light" />
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 pb-4 pt-28 md:px-8 md:pb-8 md:pt-32">
        <Link
          href="/kb"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-[#ec3750] mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-all" />
          返回知識庫
        </Link>

        <article className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
          <header className="mb-10 pb-10 border-b border-slate-100">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-4">{article.title}</h1>
            <p className="text-slate-400 flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4" />
              最後更新於 {new Date(article.updatedAt).toLocaleDateString('zh-TW')}
            </p>
          </header>

          <div className="prose prose-slate prose-red max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
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
      title: `${article.title} | APJHIRC`,
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
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar initialTheme="light" />
      <main className="mx-auto w-full max-w-4xl flex-grow px-4 pb-16 pt-28 md:px-8 md:pt-32">
        <Link
          href="/kb"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          返回知識庫
        </Link>

        <article className="brut-flat p-7 md:p-12">
          <header className="mb-10 border-b-2 border-line pb-9">
            <h1 className="display mb-5 text-3xl text-ink md:text-5xl">{article.title}</h1>
            <p className="stencil text-ink-soft">
              最後更新於 {new Date(article.updatedAt).toLocaleDateString('zh-TW')}
            </p>
          </header>

          <div className="prose prose-brut prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}

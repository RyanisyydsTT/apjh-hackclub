"use client";

import { useState } from "react";
import { FileUp, Trash2 } from "lucide-react";

type AnnouncementItem = {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
};

type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export const ContentManagement = ({ initialAnnouncements, initialArticles }: { initialAnnouncements: AnnouncementItem[], initialArticles: ArticleItem[] }) => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [articles, setArticles] = useState(initialArticles);
  
  const [newAnn, setNewAnn] = useState({ title: "", content: "" });
  const [newArt, setNewArt] = useState({ title: "", slug: "", content: "" });

  const readMarkdownFile = async (file: File, onRead: (content: string) => void) => {
    if (!file.name.endsWith(".md") && !file.name.endsWith(".markdown")) return;
    onRead(await file.text());
  };

  const handleCreateAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      body: JSON.stringify(newAnn),
    });
    if (res.ok) {
      const created = await res.json();
      setAnnouncements([created, ...announcements]);
      setNewAnn({ title: "", content: "" });
    }
  };

  const handleCreateArt = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/kb", {
      method: "POST",
      body: JSON.stringify(newArt),
    });
    if (res.ok) {
      const created = await res.json();
      setArticles([created, ...articles]);
      setNewArt({ title: "", slug: "", content: "" });
    }
  };

  const handleDeleteAnn = async (id: string) => {
    if (!confirm("確定要刪除這則公告嗎？")) return;

    const res = await fetch("/api/admin/announcements", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setAnnouncements(announcements.filter(ann => ann.id !== id));
    }
  };

  const handleDeleteArt = async (id: string) => {
    if (!confirm("確定要刪除這篇文章嗎？")) return;

    const res = await fetch("/api/admin/kb", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setArticles(articles.filter(art => art.id !== id));
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Announcements Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-4">發布新公告</h3>
          <form onSubmit={handleCreateAnn} className="space-y-4">
            <input
              placeholder="公告標題"
              value={newAnn.title}
              onChange={e => setNewAnn({...newAnn, title: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ec3750] outline-none"
              required
            />
            <textarea
              placeholder="內容 (支援 Markdown)"
              value={newAnn.content}
              onChange={e => setNewAnn({...newAnn, content: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ec3750] outline-none h-32"
              required
            />
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 hover:border-[#ec3750] hover:text-[#ec3750]">
              <FileUp className="w-4 h-4" />
              上傳 Markdown 檔填入內容
              <input
                type="file"
                accept=".md,.markdown,text/markdown,text/plain"
                className="hidden"
                onChange={e => {
                  const file = e.currentTarget.files?.[0];
                  if (file) readMarkdownFile(file, content => setNewAnn({...newAnn, content}));
                  e.currentTarget.value = "";
                }}
              />
            </label>
            <button type="submit" className="w-full bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors">
              發布公告
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {announcements.map(ann => (
            <div key={ann.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center gap-4">
              <div>
                <h4 className="font-bold text-slate-800">{ann.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400">{new Date(ann.createdAt).toLocaleDateString('zh-TW')}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteAnn(ann.id)}
                className="flex-none rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                aria-label="刪除公告"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* KB Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-4">新增知識庫文章</h3>
          <form onSubmit={handleCreateArt} className="space-y-4">
            <input
              placeholder="文章標題"
              value={newArt.title}
              onChange={e => setNewArt({...newArt, title: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ec3750] outline-none"
              required
            />
            <input
              placeholder="網址路徑 (slug, 例如: nextjs-tutorial)"
              value={newArt.slug}
              onChange={e => setNewArt({...newArt, slug: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ec3750] outline-none"
              required
            />
            <textarea
              placeholder="內容 (支援 Markdown)"
              value={newArt.content}
              onChange={e => setNewArt({...newArt, content: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#ec3750] outline-none h-32"
              required
            />
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 hover:border-[#ec3750] hover:text-[#ec3750]">
              <FileUp className="w-4 h-4" />
              上傳 Markdown 檔填入內容
              <input
                type="file"
                accept=".md,.markdown,text/markdown,text/plain"
                className="hidden"
                onChange={e => {
                  const file = e.currentTarget.files?.[0];
                  if (file) readMarkdownFile(file, content => setNewArt({...newArt, content}));
                  e.currentTarget.value = "";
                }}
              />
            </label>
            <button type="submit" className="w-full bg-[#ec3750] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#ff4d66] transition-colors">
              新增文章
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {articles.map(art => (
            <div key={art.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center gap-4">
              <div>
                <h4 className="font-bold text-slate-800">{art.title}</h4>
                <span className="text-xs text-slate-400">Slug: /{art.slug}</span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteArt(art.id)}
                className="flex-none rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                aria-label="刪除文章"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

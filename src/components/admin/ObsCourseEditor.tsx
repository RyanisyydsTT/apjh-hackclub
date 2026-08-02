"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink, LoaderCircle, MonitorPlay } from "lucide-react";

type ObsCourseValue = {
  period: string;
  title: string;
  detail: string;
};

export function ObsCourseEditor({ initialValue }: { initialValue: ObsCourseValue }) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const response = await fetch("/api/admin/obs-course", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "套用失敗");
      setValue(result);
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "套用失敗");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-950 px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <MonitorPlay className="h-7 w-7 text-[#ec3750]" />
          <div>
            <h2 className="text-xl font-black">OBS 課程畫面</h2>
            <p className="text-sm font-medium text-slate-400">儲存後會立即套用到固定 OBS 網址</p>
          </div>
        </div>
        <a
          href="/obs/course"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-black transition hover:bg-white/15"
        >
          開啟顯示頁
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <form onSubmit={save} className="grid gap-6 p-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">上方標籤</span>
            <input
              value={value.period}
              maxLength={30}
              required
              onChange={(event) => setValue({ ...value, period: event.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-[#ec3750] focus:ring-4 focus:ring-red-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">課程名稱</span>
            <input
              value={value.title}
              maxLength={80}
              required
              onChange={(event) => setValue({ ...value, title: event.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-[#ec3750] focus:ring-4 focus:ring-red-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">課程說明</span>
            <textarea
              value={value.detail}
              maxLength={160}
              required
              rows={4}
              onChange={(event) => setValue({ ...value, detail: event.target.value })}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-[#ec3750] focus:ring-4 focus:ring-red-100"
            />
          </label>

          {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
          {saved && (
            <p className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              已套用到 OBS 顯示頁
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ec3750] px-5 py-3 font-black text-white transition hover:bg-[#d92942] disabled:opacity-50"
          >
            {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
            儲存並套用
          </button>
        </div>

        <div className="flex min-h-72 items-center rounded-2xl border border-slate-200 bg-[#fafafa] p-8">
          <div className="w-full border-l-[7px] border-[#ec3750] pl-7">
            <p className="mb-3 text-sm font-black tracking-[0.25em] text-[#ec3750]">{value.period || "目前課程"}</p>
            <p className="text-4xl font-black leading-tight tracking-tight text-slate-950">{value.title || "課程名稱"}</p>
            <p className="mt-4 text-lg font-bold leading-relaxed text-slate-500">{value.detail || "課程說明"}</p>
          </div>
        </div>
      </form>
    </div>
  );
}

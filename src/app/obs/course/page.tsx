import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "目前課程",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CourseOverlay() {
  const course = await prisma.obsCourse.findUnique({
    where: { id: "default" },
  });
  const title = course?.title ?? "雲端開發環境啟動";
  const detail = course?.detail ?? "建立 GitHub 帳號、開啟 Codespaces，完成第一個測試網站";
  const period = course?.period ?? "目前課程";

  return (
    <main
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden text-slate-950"
      style={{ backgroundColor: "#fafafa" }}
    >
      <div className="absolute left-12 top-10 flex items-center gap-5">
        <Image
          src="/apjhirc-logo.svg"
          alt=""
          width={104}
          height={104}
          priority
          className="h-20 w-20 object-contain"
        />
        <div>
          <p className="text-2xl font-black tracking-tight">APJHIRC</p>
          <p className="text-base font-bold tracking-[0.16em] text-slate-500">安平國中資訊研究社</p>
        </div>
      </div>

      <section className="w-[86vw] max-w-[1500px] border-l-[14px] border-[#ec3750] pl-14">
        <p className="mb-7 text-3xl font-black tracking-[0.3em] text-[#ec3750]">{period}</p>
        <h1 className="text-[clamp(4rem,7.4vw,8.5rem)] font-black leading-[1.02] tracking-[-0.055em]">
          {title}
        </h1>
        <p className="mt-10 max-w-[1250px] text-[clamp(2rem,3vw,3.6rem)] font-bold leading-[1.35] tracking-tight text-slate-600">
          {detail}
        </p>
      </section>

      <div className="absolute bottom-10 right-12 flex items-center gap-3 text-xl font-bold text-slate-400">
        <span className="h-3 w-3 rounded-full bg-emerald-500" />
        LIVE CLASS
      </div>
    </main>
  );
}

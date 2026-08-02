import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  Banknote,
  Check,
  ChevronDown,
  ExternalLink,
  Leaf,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { absoluteUrl } from "@/lib/seo";
import { PayPalSponsor } from "@/components/PayPalSponsor";

export const metadata: Metadata = {
  title: "贊助我們",
  description:
    "每月新台幣 200 元支持安平國中資訊研究社，讓更多學生接觸程式設計與科技創作。",
  alternates: { canonical: "/sponsor" },
  openGraph: {
    title: "贊助安平國中資訊研究社",
    description: "每月新台幣 200 元，支持學生免費學習程式設計與科技創作。",
    url: absoluteUrl("/sponsor"),
  },
};

const bankDetails = [
  ["Account number", "663052837342682"],
  ["Routing number", "121145307"],
  ["SWIFT/BIC Code", "CLNOUS66"],
  ["Company Name", "Anping Hack Forge C/O Hack Club"],
  ["Company Address", "8605 Santa Monica Blvd #86294\nWest Hollywood, CA 90069"],
  ["Bank Name", "Column N.A."],
  ["Bank Address", "1110 Gorgas Avenue, Suite A4-700\nSan Francisco, CA 94129"],
];

const questions = [
  {
    question: "贊助款會用在哪裡？",
    answer:
      "贊助款將用於舉辦程式設計課程、工作坊、黑客松、購置教學設備，以及提供更多學生免費學習與實作的機會。",
  },
  {
    question: "資金流向可以查詢嗎？",
    answer:
      "可以。我們的資金由 Hack Club Bank（HCB）管理，收入與支出紀錄完全公開透明，任何人都可以隨時查閱。",
  },
  {
    question: "可以隨時取消每月贊助嗎？",
    answer: "可以。定期贊助沒有綁約，您可以隨時在 PayPal 帳戶中取消。",
  },
  {
    question: "贊助可以抵稅嗎？",
    answer:
      "無法。管理本計畫的非營利組織登記地址不在中華民國境內，因此贊助不具中華民國稅務減免功能，敬請見諒。",
  },
  {
    question: "贊助後會收到什麼？",
    answer: "每位贊助者都可以領取電子感謝狀；相關領取方式可再與我們聯繫。",
  },
];

export default function SponsorPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar initialTheme="light" />

      <main>
        <section className="graph border-b-2 border-line px-4 pb-16 pt-28">
          <div className="mx-auto max-w-5xl">
            <h1 className="display text-[clamp(2.5rem,7vw,4.5rem)] text-ink">
              一個月 NT$200，
              <span className="mt-2 block text-accent">讓一個點子有機會被做出來。</span>
            </h1>
            <p className="mt-8 max-w-3xl border-l-4 border-line pl-5 text-lg font-medium leading-8 text-ink-soft">
              支持安平國中資訊研究社，讓更多學生接觸程式設計與科技創作。您的每一筆贊助，都會成為學生免費學習與動手實作的機會。
            </p>

            <div className="mt-10 grid gap-0.5 border-2 border-line bg-line sm:grid-cols-3">
              <Benefit icon={<Sparkles />} text="支持課程、工作坊與黑客松" />
              <Benefit icon={<ShieldCheck />} text="每一筆資金完全透明" />
              <Benefit icon={<Award />} text="可領取電子感謝狀" />
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <h2 className="display text-3xl text-ink sm:text-4xl">
                幫助學生把「我想試試看」變成真正的作品
              </h2>
              <div className="mt-7 space-y-5 text-lg font-medium leading-8 text-ink-soft">
                <p>
                  贊助將用於舉辦程式設計課程、工作坊、黑客松、購置教學設備，以及提供更多學生免費學習與實作的機會。
                </p>
                <p>感謝您與我們一起推動科技教育。</p>
              </div>

              <div className="mt-9 grid gap-0.5 border-2 border-line bg-line sm:grid-cols-2">
                <InfoCard
                  icon={<Leaf className="h-6 w-6" />}
                  title="為氣候多做一點"
                  text="我們會捐出您贊助款的 1%，協助減少碳排放。"
                />
                <InfoCard
                  icon={<RefreshCcw className="h-6 w-6" />}
                  title="隨時可以取消"
                  text="定期贊助沒有綁約，您可以隨時停止。"
                />
              </div>

              <Link
                href="https://hcb.hackclub.com/anping-hack-forge"
                target="_blank"
                rel="noreferrer"
                className="brut-flat mt-7 flex items-center justify-between gap-4 p-5 font-bold text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                <span className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-accent" />
                  查看完全公開的資金紀錄
                </span>
                <ExternalLink className="h-5 w-5" />
              </Link>
            </div>

            <aside className="brut self-start p-6 sm:p-8">
              <p className="stencil text-ink-soft">每月贊助</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="display text-5xl text-ink">NT$200</span>
                <span className="pb-1 font-bold text-ink-soft">/ 月</span>
              </div>
              <ul className="mt-7 space-y-3 text-sm font-bold text-ink-soft">
                <CheckItem text="PayPal 安全定期付款" />
                <CheckItem text="隨時可以取消" />
                <CheckItem text="可領取電子感謝狀" />
              </ul>
              <PayPalSponsor
                clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? ""}
                planId={process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID ?? ""}
              />
              <p className="mt-3 text-center text-xs font-medium text-ink-soft">
                定期付款服務由 PayPal 提供；授權視窗會在此頁開啟。
              </p>
            </aside>
          </div>
        </section>

        <div className="mx-auto flex max-w-6xl items-center gap-5 px-4" aria-label="其他贊助方式">
          <div className="h-0.5 flex-1 bg-line" />
          <span className="stencil border-2 border-line px-4 py-2 text-ink-soft">或</span>
          <div className="h-0.5 flex-1 bg-line" />
        </div>

        {/* Inverted plate — --line flips to paper so every rule inside follows */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl border-2 border-line bg-ink p-6 text-paper [--line:var(--paper)] sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <h2 className="display flex items-center gap-3 text-3xl">
                  <Banknote className="h-7 w-7 text-accent" />
                  國際電匯贊助
                </h2>
                <p className="mt-4 font-medium leading-7 opacity-80">
                  洽詢您的銀行，並提供右方國際電匯資訊進行轉帳贊助。
                </p>
              </div>
              <dl className="border-2 border-paper">
                {bankDetails.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid gap-1 border-b-2 border-paper px-5 py-4 last:border-b-0 sm:grid-cols-[170px_1fr] sm:gap-5"
                  >
                    <dt className="stencil pt-1 opacity-70">{label}</dt>
                    <dd className="whitespace-pre-line break-words font-mono text-sm font-bold leading-6">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="border-y-2 border-line px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="display text-3xl text-ink sm:text-4xl">常見問題</h2>
            <div className="mt-10 grid gap-0.5 border-2 border-line bg-line">
              {questions.map((item) => (
                <details key={item.question} className="group bg-paper">
                  <summary className="display flex cursor-pointer list-none items-center justify-between gap-4 p-6 text-lg text-ink [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <ChevronDown className="h-5 w-5 shrink-0 text-accent transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="border-t-2 border-line p-6 font-medium leading-7 text-ink-soft">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto max-w-4xl text-center text-sm font-medium leading-7 text-ink-soft">
            <p>
              本計畫由美國 Hack Club（The Hack Foundation）非營利組織支持，資金於 Hack Club Bank（HCB）管理。
            </p>
            <p className="mt-2">
              因非營利組織登記地址不在中華民國境內，贊助無法作為中華民國所得稅減免使用，敬請見諒。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function Benefit({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 bg-paper p-5 font-bold text-ink">
      <span className="text-accent [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      {text}
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-paper p-6">
      <span className="text-accent">{icon}</span>
      <h3 className="display mt-4 text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-6 text-ink-soft">{text}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <Check className="h-4 w-4 flex-none text-accent" />
      {text}
    </li>
  );
}

import { Navbar } from "@/components/Navbar";
import { CountdownCard } from "@/components/CountdownCard";
import Image from "next/image";
import {
  ArrowRight,
  Brain,
  ClipboardCheck,
  Code,
  Globe,
  Handshake,
  Lightbulb,
  SearchCheck,
  Shield,
  Star,
  Trophy,
  Users,
  WandSparkles,
  Zap,
  Clock3,
} from "lucide-react";
import Link from "next/link";
import { absoluteUrl, siteDescription, siteName } from "@/lib/seo";

type CourseWeek = {
  week: number;
  title: string;
  seventh: string;
  eighth: string;
  note: string;
};

const courseWeeks: CourseWeek[] = [
  {
    week: 1,
    title: "雲端開發環境啟動",
    seventh: "自我介紹、課程介紹、Hack Club 介紹、展示 AI 製作網站 Demo",
    eighth: "帶領學生建立 GitHub 帳號，開啟 GitHub Codespaces，建立第一個測試網站",
    note: "此週只把 GitHub 當作「雲端寫網站的地方」，不深入講 Git 與版本控制",
  },
  {
    week: 2,
    title: "網站基礎與 Codespaces",
    seventh: "什麼是網站？HTML、CSS、JavaScript 分別負責什麼",
    eighth: "使用 Codespaces 修改測試網站內容，熟悉雲端編輯環境",
    note: "重點是讓學生知道換電腦也能繼續做，不怕學校電腦還原",
  },
  {
    week: 3,
    title: "Vibe Coding 發想",
    seventh: "Vibe Coding 介紹：如何把想法變成網站需求",
    eighth: "學生發想自己的網站主題，完成主題表單",
    note: "可提供範例：個人介紹、遊戲介紹、班級網站、作品集、興趣網站、抽籤工具、小遊戲等",
  },
  {
    week: 4,
    title: "AI 產生第一版網站",
    seventh: "使用 AI 撰寫第一版網站，學習如何描述需求與修改 Prompt",
    eighth: "將 AI 產生的程式碼放入 Codespaces，完成第一版網站預覽",
    note: "使用表單紀錄學生的網站主題與 Prompt",
  },
  {
    week: 5,
    title: "HTML 基礎修改",
    seventh: "HTML 基礎語法講解：標題、段落、圖片、連結、按鈕、區塊",
    eighth: "修改自己的網站內容，讓學生看懂 AI 產生的基本結構",
    note: "重點不是背語法，而是能看懂並修改自己的網站",
  },
  {
    week: 6,
    title: "CSS 視覺設計",
    seventh: "CSS 基礎：顏色、字體、排版、卡片、按鈕樣式",
    eighth: "使用 AI 協助美化網站，完成第一版視覺設計",
    note: "讓學生學會用「我想要什麼風格」來指揮 AI 修改網站",
  },
  {
    week: 7,
    title: "JavaScript 互動功能",
    seventh: "JavaScript 基礎概念：按鈕互動、顯示/隱藏、簡單計算、切換內容",
    eighth: "加入網站新功能 1",
    note: "例如：抽籤、計分器、主題切換、互動問答、圖片切換等",
  },
  {
    week: 8,
    title: "GitHub 儲存與 Commit",
    seventh: "GitHub 儲存觀念：Commit 是什麼？為什麼每次修改都要留下紀錄",
    eighth: "帶學生完成第一次正式 Commit，並確認網站檔案已保存到 GitHub",
    note: "這週才正式講 Git 觀念，前面只把 GitHub 當作雲端工作區",
  },
  {
    week: 9,
    title: "功能延伸與版本紀錄",
    seventh: "加入網站新功能 2，並使用 GitHub 保存更新",
    eighth: "發想網站新功能 3，整理下一步修改方向",
    note: "開始要求每次更新都要 Commit",
  },
  {
    week: 10,
    title: "完成主要網站內容",
    seventh: "加入網站新功能 3，完成主要網站內容",
    eighth: "網站測試、錯誤修正、版面調整",
    note: "引導學生檢查手機版、連結、圖片、按鈕是否正常",
  },
  {
    week: 11,
    title: "正式部署與子網域",
    seventh: "正式部署介紹：測試網站與正式網站的差別",
    eighth: "將網站部署成正式網址，學生可選擇領取 xxx.apjh.lol 子網域",
    note: "Hack Club 表單可於本週開始整理與填寫",
  },
  {
    week: 12,
    title: "作品整理與分享",
    seventh: "作品整理：網站名稱、網站介紹、使用說明、特色功能",
    eighth: "抽選或安排同學分享自己的網站作品",
    note: "可同時票選食物、紀念品或優秀作品獎項",
  },
  {
    week: 13,
    title: "資訊安全觀念",
    seventh: "資訊安全觀念介紹：網站常見風險、密碼、資料外洩、惡意連結",
    eighth: "作為網頁維護者如何修正問題：不要公開敏感資料、檢查輸入、確認權限",
    note: "以生活化案例說明，不進入過度技術細節",
  },
  {
    week: 14,
    title: "Break My Website! 準備",
    seventh: "Break My Website! 比賽介紹、規則說明、分組",
    eighth: "小組各自測試同一網站，紀錄發現的問題與改善建議",
    note: "重點放在「找出問題並幫對方變好」，避免變成破壞性攻擊",
  },
  {
    week: 15,
    title: "Break My Website! 實作",
    seventh: "執行 Break My Website! 比賽計畫，小組持續測試與修正",
    eighth: "整理發現問題、修正方式與小組簡報",
    note: "要求每組整理：發現了什麼、影響是什麼、如何修正",
  },
  {
    week: 16,
    title: "成果展示與回顧",
    seventh: "小組報告發現內容、作品展示、小組自評",
    eighth: "公告比賽結果、課程回顧、美食享用或影片欣賞、場地整理",
    note: "可頒發最佳網站、最佳創意、最佳修復、最佳報告等獎項",
  },
];

const competitionAwards = [
  { name: "漏洞獵人獎", icon: <SearchCheck className="h-5 w-5" /> },
  { name: "團隊合作獎", icon: <Handshake className="h-5 w-5" /> },
  { name: "邏輯推理獎", icon: <Lightbulb className="h-5 w-5" /> },
  { name: "資安之星獎", icon: <Star className="h-5 w-5" /> },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteName,
    alternateName: ["APJHIRC", "安平國中資訊研究社"],
    url: absoluteUrl("/"),
    description: siteDescription,
    educationalCredentialAwarded: "Student club learning experience",
    knowsAbout: ["AI 輔助開發", "Vibe Coding", "GitHub Codespaces", "網頁開發", "資安", "Hack Club"],
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-grow">
        <section className="graph border-b-2 border-line px-4 pb-16 pt-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr]">
              <div>
                <p className="text-base font-bold text-accent">2026 秋季 · Vibe Coding × AI 網站創作</p>

                <h1 className="display mt-5 text-[clamp(2.75rem,8vw,5rem)] text-ink">
                  不只學程式，
                  <span className="mt-2 block text-accent">把你的點子做上線。</span>
                </h1>

                <p className="mt-8 max-w-2xl border-l-4 border-line pl-5 text-lg font-medium leading-8 text-ink-soft">
                  APJHIRC 是安平國中資訊研究社。每週一第七、八節，用 AI、GitHub Codespaces 與網頁技術，完成一個真正可以分享的作品。
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="https://cloud.shin-her.com.tw/Auth/Auth/CloudLogin"
                    target="_blank"
                    rel="noreferrer"
                    className="brut-press display inline-flex items-center justify-center gap-2 border-2 border-line bg-accent px-7 py-4 text-xl text-on-accent shadow-[6px_6px_0_0_var(--line)]"
                  >
                    前往安平國中社團選填
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/#course"
                    className="brut-press display inline-flex items-center justify-center border-2 border-line px-7 py-4 text-xl text-ink"
                  >
                    看看這學期學什麼
                  </Link>
                </div>

                <p className="mt-5 text-sm font-medium text-ink-soft">
                  選填系統由安平國中提供，將於新分頁開啟。
                </p>
              </div>

              <div className="mx-auto w-full max-w-md">
                <div className="brut-flat bg-[#fffdf7] p-8">
                  <Image
                    src="/apjhirc-logo.svg"
                    alt="APJHIRC 安平國中資訊研究社標誌"
                    width={320}
                    height={320}
                    priority
                    className="aspect-square w-full object-contain"
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {["AI 創作", "網站開發", "GitHub", "資訊安全"].map((tag) => (
                    <span key={tag} className="stencil border-2 border-line px-2.5 py-2 text-center text-ink">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b-2 border-line px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <CountdownCard />
          </div>
        </section>

        <section className="border-b-2 border-line px-4 py-14">
          <div className="mx-auto max-w-6xl">
            {/* gap-0.5 over a bg-line container draws the hairline rules between cells */}
            <div className="grid grid-cols-2 gap-0.5 border-2 border-line bg-line md:grid-cols-4">
              <StatCell icon={<Users className="h-5 w-5" />} label="社團名稱" value="APJHIRC" />
              <StatCell icon={<Zap className="h-5 w-5" />} label="學期專題" value="Vibe Coding" />
              <StatCell icon={<Clock3 className="h-5 w-5" />} label="上課時間" value="週一 7-8 節" />
              <StatCell icon={<Globe className="h-5 w-5" />} label="外部資源" value="Hack Club" />
            </div>
          </div>
        </section>

        <section className="border-b-2 border-line px-4 py-20">
          <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <h2 className="display text-4xl text-ink md:text-5xl">
              研究資訊，也把想法做成真的作品。
            </h2>
            <div className="space-y-6 text-lg font-medium leading-relaxed text-ink-soft">
              <p>
                APJHIRC 是安平國中資訊研究社。我們不只背語法，而是學會把一個網站需求說清楚、做出來、修到能用，最後部署成真正可以分享的網址。
              </p>
              <p>
                本學期的主軸是 AI 輔助網頁創作。所有進度原則上在課堂完成，讓每位社員都能帶著自己的作品前進。
              </p>
              <p className="border-2 border-line bg-signal p-5 font-bold text-ink">
                專題為 Vibe Coding，部分資源由 Hack Club 提供。
              </p>
            </div>
          </div>
        </section>

        <section className="border-b-2 border-line px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
              <h2 className="display text-4xl text-ink md:text-5xl">本學期核心學習</h2>
              <p className="text-lg font-medium text-ink-soft">
                從想法、程式、部署到資安檢查，完整走過一次網站製作流程。
              </p>
            </div>

            <div className="grid gap-0.5 border-2 border-line bg-line md:grid-cols-3">
              <FeatureCard
                icon={<Brain className="h-8 w-8" />}
                title="AI 輔助開發"
                description="學習如何描述需求、修改 Prompt、審查 AI 產生的程式碼，讓 AI 成為可靠的創作助手。"
              />
              <FeatureCard
                icon={<Code className="h-8 w-8" />}
                title="Codespaces 雲端開發"
                description="使用 GitHub Codespaces 當作雲端寫網站的地方，換電腦也能繼續做，不怕學校電腦還原。"
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8" />}
                title="資安與白帽思維"
                description="從生活化案例理解網站風險，練習找出問題、說明影響，並提出能讓作品更安全的修正方式。"
              />
            </div>
          </div>
        </section>

        <section id="course" className="scroll-mt-24 border-b-2 border-line px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
              <h2 className="display text-4xl text-ink md:text-5xl">課程排程</h2>
              <p className="text-lg font-medium leading-relaxed text-ink-soft">
                課程以 16 週規劃，前半段完成個人網站，後半段進入部署、資安與 Break My Website! 白帽競賽。
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="grid gap-4 self-start lg:sticky lg:top-24">
                <InfoBlock icon={<Clock3 className="h-5 w-5" />} title="上課時間">
                  <p>每週一</p>
                  <p>第七節、第八節</p>
                </InfoBlock>
                <InfoBlock icon={<ClipboardCheck className="h-5 w-5" />} title="課程目標">
                  使所有社員運用人工智慧製作出自己的網站，並使用 GitHub Codespaces 作為雲端開發環境完成部署。
                </InfoBlock>
                <InfoBlock icon={<WandSparkles className="h-5 w-5" />} title="專題與教材">
                  Vibe Coding。教材包含自製簡報、AI Prompt 範例、GitHub Codespaces 操作範例，部分資源由 Hack Club 提供。
                </InfoBlock>
                <InfoBlock icon={<Code className="h-5 w-5" />} title="作業">
                  無。所有進度原則上於課堂完成。
                </InfoBlock>
              </div>

              <div className="grid gap-3">
                {courseWeeks.map((week) => (
                  <ScheduleWeekCard key={week.week} week={week} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Inverted plate — --line flips to paper so every rule inside follows */}
        <section className="border-b-2 border-line bg-ink px-4 py-20 text-paper [--line:var(--paper)]">
          <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <h2 className="display mb-8 text-4xl md:text-5xl">Break My Website! 資安競賽</h2>
              <blockquote className="border-l-4 border-accent pl-6 text-2xl font-bold leading-relaxed">
                <p>我故意做了一個「很爛」的網站。</p>
                <p className="mt-4">你的任務不是破壞它，而是找出所有設計上的問題，幫它變得更安全。</p>
              </blockquote>
            </div>

            <div className="grid gap-8">
              <div className="border-2 border-paper p-7">
                <h3 className="display mb-4 flex items-center gap-3 text-2xl text-paper">
                  <SearchCheck className="h-6 w-6 text-mint" />
                  比賽方式
                </h3>
                <p className="text-lg font-medium leading-relaxed opacity-80">
                  由 Ryan 社長平均分配每組組員，利用課程中教的資安觀念與漏洞，作為一個友善的「白帽」，找出漏洞並上台報告。
                </p>
              </div>

              <div>
                <h3 className="display mb-4 flex items-center gap-3 text-2xl">
                  <Trophy className="h-6 w-6 text-signal" />
                  比賽獎項
                </h3>
                <div className="grid gap-0.5 border-2 border-paper bg-paper sm:grid-cols-2">
                  {competitionAwards.map((award) => (
                    <div
                      key={award.name}
                      className="flex items-center gap-3 bg-ink px-5 py-4 font-bold text-paper"
                    >
                      <span className="text-signal">{award.icon}</span>
                      {award.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b-2 border-line px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="display mb-10 text-4xl text-ink md:text-5xl">關於課程規劃</h2>
            <div className="grid gap-0.5 border-2 border-line bg-line">
              <FAQItem
                question="一開始就會教 Git 嗎？"
                answer="不會急著講版本控制。前幾週先把 GitHub 當成雲端工作區，等大家能做出網站後，第 8 週再正式介紹 Commit 與保存紀錄。"
              />
              <FAQItem
                question="AI 會幫我們寫完全部的程式嗎？"
                answer="AI 是創作助手，但社員需要學會提出清楚需求、看懂基本結構、修改內容，並判斷程式是否真的符合自己的作品目標。"
              />
              <FAQItem
                question="Break My Website! 會不會是在攻擊網站？"
                answer="不是破壞性攻擊。競賽目標是用白帽角度找出問題、說明影響、提出修正，讓網站變得更安全。"
              />
            </div>
          </div>
        </section>

        <section className="bg-accent px-4 py-24 text-center text-on-accent [--line:#14110f]">
          <div className="mx-auto max-w-3xl">
            <h2 className="display text-[clamp(2.5rem,7vw,4.25rem)]">下一個作品，從這裡開始。</h2>
            <p className="mx-auto mb-10 mt-6 max-w-2xl text-lg font-bold leading-8 md:text-xl">
              選填安平國中資訊研究社，和我們一起把想法變成網站、部署上線，再學會讓它更安全。
            </p>
            <Link
              href="https://cloud.shin-her.com.tw/Auth/Auth/CloudLogin"
              target="_blank"
              rel="noreferrer"
              className="brut-press display inline-flex items-center gap-3 border-2 border-line bg-[#fffdf7] px-8 py-4 text-2xl text-ink shadow-[7px_7px_0_0_var(--line)]"
            >
              前往社團選填 <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 bg-paper p-6 md:p-7">
      <span className="text-accent">{icon}</span>
      <span className="display text-2xl text-ink md:text-3xl">{value}</span>
      <span className="stencil text-ink-soft">{label}</span>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col bg-paper p-8">
      <span className="mb-7 text-accent">{icon}</span>
      <h3 className="display mb-4 text-2xl text-ink">{title}</h3>
      <p className="font-medium leading-relaxed text-ink-soft">{description}</p>
    </div>
  );
}

function InfoBlock({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) {
  return (
    <div className="brut-flat p-6">
      <h3 className="display mb-3 flex items-center gap-3 text-xl text-ink">
        <span className="text-accent">{icon}</span>
        {title}
      </h3>
      <div className="font-medium leading-relaxed text-ink-soft">{children}</div>
    </div>
  );
}

function ScheduleWeekCard({ week }: { week: CourseWeek }) {
  return (
    <details className="brut-flat group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-5">
          <span className="stencil flex h-10 w-10 flex-none items-center justify-center border-2 border-line text-ink">
            {week.week.toString().padStart(2, "0")}
          </span>
          <h3 className="display text-xl text-ink md:text-2xl">{week.title}</h3>
        </div>
        <span className="display flex-none text-2xl text-ink-soft transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="grid gap-4 border-t-2 border-line p-5 text-ink-soft">
        <ScheduleLine label="日期" value="待公告" />
        <ScheduleLine label="第七節" value={week.seventh} />
        <ScheduleLine label="第八節" value={week.eighth} />
        <ScheduleLine label="備註" value={week.note} />
      </div>
    </details>
  );
}

function ScheduleLine({ label, value }: { label: string, value: string }) {
  return (
    <div className="grid gap-1 md:grid-cols-[5.5rem_1fr] md:gap-4">
      <div className="stencil pt-1 text-ink">{label}</div>
      <div className="font-medium leading-relaxed">{value}</div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="bg-paper p-7">
      <h3 className="display mb-3 text-xl text-ink">{question}</h3>
      <p className="font-medium leading-relaxed text-ink-soft">{answer}</p>
    </div>
  );
}

import { Navbar } from "@/components/Navbar";
import { CountdownCard } from "@/components/CountdownCard";
import { Terminal, Cpu, Code, Globe, ArrowRight, Bell, Book, Sparkles, Zap, Users, Shield, Rocket, Heart, Brain } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-slate-900 pt-32 pb-24 px-4">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#ec3750] rounded-full blur-[120px]" />
            <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-600 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-[#ff4d66] text-sm font-bold mb-8 animate-bounce">
              <Sparkles className="w-4 h-4" />
              <span>2026 年 9 月 - AI 驅動的創作實驗室</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 text-white tracking-tight">
              APJH <span className="brand-font bg-gradient-to-r from-[#ec3750] via-[#ff4d66] to-[#ec3750] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Hack Club</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              第一學期目標：利用 AI 技術與現代開發工具，打造符合資安規範、有用且實用的網頁專案。
            </p>

            <CountdownCard />
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/announcements"
                className="group relative px-10 py-5 bg-[#ec3750] text-white rounded-2xl font-bold text-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-900/20"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2">
                  查看公告 <Bell className="w-6 h-6" />
                </span>
              </Link>
              <Link
                href="/kb"
                className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 border border-slate-200 shadow-xl shadow-slate-900/10 flex items-center gap-2"
              >
                學習知識庫 <Book className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>

        {/* PRE-LAUNCH INFO */}
        <section className="py-20 px-4 bg-white border-b border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard icon={<Users className="w-6 h-6" />} label="創始社員" value="招募中" color="bg-blue-500" />
              <StatCard icon={<Zap className="w-6 h-6" />} label="專案聚焦" value="AI + Web" color="bg-[#ec3750]" />
              <StatCard icon={<Terminal className="w-6 h-6" />} label="正式社課" value="九月啟動" color="bg-amber-500" />
              <StatCard icon={<Globe className="w-6 h-6" />} label="全球連結" value={<span className="brand-font">Hack Club</span>} color="bg-indigo-500" />
            </div>
          </div>
        </section>

        {/* HACK CLUB MEANING */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-12 items-start">
            <div>
              <div className="pixel-label inline-flex items-center gap-2 text-[#ec3750] font-black text-sm mb-5">
                <Terminal className="w-5 h-5" />
                What Hack Means
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                我們說的 Hack，不是破壞。
              </h2>
            </div>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium">
              <p>
                「Hacker」這個字有兩種意思。我們指的是：熟悉電腦，或擅長用工具想出新方法的人。
              </p>
              <p>
                當我們說「hack」，意思是聰明地解決問題，就像生活駭客一樣，只是我們使用的是電腦。
              </p>
              <p className="text-slate-900 font-bold">
                所以 Hack Club 代表的是：一起做出 app、網站、遊戲，以及任何你想像得到的創作。
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">本學期核心學習</h2>
              <p className="text-slate-500 text-lg font-medium">從第一學期開始，我們專注於最前沿且實用的開發技術。</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Brain className="w-12 h-12" />}
                title="AI 輔助開發"
                description="學習如何與 AI 協作，從生成程式碼、Debug 到優化效能，全面提升你的創作效率。"
              />
              <FeatureCard
                icon={<Shield className="w-12 h-12" />}
                title="資安與安全編碼"
                description="了解網路安全基礎，學習如何撰寫防範攻擊、保護使用者資料的安全網頁。"
              />
              <FeatureCard
                icon={<Code className="w-12 h-12" />}
                title="實用網頁創作"
                description="不只是練習，我們要做出真正解決校園或生活問題的實用 Web 應用程式。"
              />
            </div>
          </div>
        </section>

        {/* FUTURE VISION */}
        <section className="py-24 px-4 bg-slate-100/50">
          <div className="max-w-5xl mx-auto">
             <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-slate-200/60 border border-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Rocket className="w-64 h-64" />
                </div>
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                  <h2 className="text-4xl font-black mb-6 text-slate-900">未來展望 (Roadmap)</h2>
                  <p className="text-slate-500 text-lg mb-12 font-medium">
                    在打好穩定的 Web 與資安基礎後，我們計畫在未來學期加入更多有趣的內容。
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-3 text-slate-800 font-bold">
                        <Cpu className="w-6 h-6 text-[#ec3750]" /> 硬體駭客計劃
                      </div>
                      <p className="text-slate-500">Arduino, ESP32 與感測器整合，讓你的網頁能控制現實世界的裝置。</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-3 text-slate-800 font-bold">
                        <Rocket className="w-6 h-6 text-[#ec3750]" /> 進階軟體工程
                      </div>
                      <p className="text-slate-500">深入研究後端架構、自動化部署與更複雜的大型軟體設計。</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* SHOWCASE SECTION */}
        <section className="py-24 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 px-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">首波計畫專案</h2>
                <p className="text-slate-500 text-lg font-medium">預計在九月開始後，帶領大家完成的實用作品。</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <ShowcaseCard 
                title="AI 智慧學習助理" 
                category="AI + Web"
                image="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
                description="利用 AI API 打造的專屬讀書計畫產生器，並具備安全的用戶資料保護機制。"
              />
              <ShowcaseCard 
                title="校園安全報修系統" 
                category="Practical Utility"
                image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
                description="一個實用的資安範例：打造加密且匿名、符合隱私規範的校園設施報修平台。"
              />
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 px-4 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-16 tracking-tight">關於課程規劃...</h2>
            <div className="grid gap-6">
              <FAQItem 
                question="為什麼第一學期不直接做硬體？" 
                answer="我們希望先讓大家建立穩定的程式邏輯與 Web 基礎，這對於後續理解硬體通訊與雲端整合非常重要。同時，學習資安觀念能確保你的專案是安全的。"
              />
              <FAQItem 
                question="AI 會幫我們寫完全部的程式嗎？" 
                answer="AI 是我們的強力助手，但我們更強調「如何下正確的指令」以及「如何審查 AI 生成的代碼」，這才是未來必備的競爭力。"
              />
              <FAQItem 
                question="之後真的會有硬體課嗎？" 
                answer="絕對會！只要大家掌握了基礎的 Web 開發與邏輯，我們就會在第二學期後引入 Arduino 等硬體開發計劃。"
              />
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32 px-4 bg-[#ec3750] text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <Terminal className="w-full h-full scale-150 rotate-12" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="pixel-heading text-5xl md:text-7xl font-black mb-8">CODE WITH AI.</h2>
            <p className="text-xl md:text-2xl mb-12 font-bold opacity-90">
              九月正式展開！現在就準備好與我們一起探索 AI 程式創作的無限可能。
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-4 bg-white text-[#ec3750] px-12 py-6 rounded-3xl font-black text-3xl hover:bg-slate-50 transition-all hover:scale-110 active:scale-95 shadow-2xl"
            >
              馬上登入 <ArrowRight className="w-10 h-10" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white py-16 px-4 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="brand-font flex items-center gap-3 text-2xl font-black text-slate-900">
            <div className="bg-[#ec3750] p-2 rounded-xl">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <span>APJH Hack Club</span>
          </div>
          <div className="flex gap-8 text-slate-500 font-bold">
            <Link href="/announcements" className="hover:text-[#ec3750]">公告</Link>
            <Link href="/kb" className="hover:text-[#ec3750]">知識庫</Link>
            <Link href="/chat" className="hover:text-[#ec3750]">聊天室</Link>
          </div>
          <p className="text-slate-400 font-medium flex items-center gap-1">
            © 2026 Made with <Heart className="w-4 h-4 text-[#ec3750] fill-[#ec3750]" /> by Ryan.
          </p>
        </div>
      </footer>
    </div>
  );
}

// COMPONENTS

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: React.ReactNode, color: string }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className={`${color} p-4 rounded-2xl text-white mb-6 shadow-lg shadow-inherit/20 transform group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{value}</div>
      <div className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-[#ec3750]/30 transition-all hover:-translate-y-2">
      <div className="mb-8 p-4 bg-slate-50 rounded-2xl inline-block text-[#ec3750] group-hover:bg-[#ec3750] group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-slate-800 tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-sm hover:shadow-md transition-all hover:bg-slate-800">
      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
        <div className="w-1.5 h-6 bg-[#ec3750] rounded-full" />
        {question}
      </h3>
      <p className="text-slate-400 leading-relaxed font-medium pl-4.5">{answer}</p>
    </div>
  );
}

function ShowcaseCard({ title, category, image, description }: { title: string, category: string, image: string, description: string }) {
  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-[#ec3750]/20 transition-all hover:-translate-y-2">
      <div className="aspect-video overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-4 left-4">
          <span className="pixel-label px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-black text-[#ec3750] shadow-lg">
            {category}
          </span>
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-[#ec3750] transition-colors">{title}</h3>
        <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

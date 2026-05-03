"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Terminal, LogIn, LogOut, MessageSquare, Book, Bell, Settings, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

type NavbarProps = {
  initialTheme?: "dark" | "light";
};

export const Navbar = ({ initialTheme = "dark" }: NavbarProps) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [colorMode, setColorMode] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const isLight = initialTheme === "light" || scrolled;
  const isDarkMode = colorMode === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", colorMode === "dark");
  }, [colorMode]);

  const toggleColorMode = () => {
    const nextMode = colorMode === "dark" ? "light" : "dark";
    setColorMode(nextMode);
    window.localStorage.setItem("theme", nextMode);
    document.documentElement.classList.toggle("dark", nextMode === "dark");
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isLight
        ? isDarkMode
          ? "bg-slate-950/85 backdrop-blur-md shadow-lg border-b border-slate-800 py-2"
          : "bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200 py-2"
        : "bg-transparent py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-3">
              <div className="bg-[#ec3750] p-2 rounded-xl shadow-lg shadow-red-500/20">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <span className={`brand-font font-black text-xl tracking-tight transition-colors ${isLight ? isDarkMode ? "text-white" : "text-slate-900" : "text-white md:text-white text-slate-900"}`}>
                APJH <span className="text-[#ec3750]">Hack Club</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center gap-1">
              <NavLink href="/announcements" icon={<Bell className="w-4 h-4" />} label="公告" isLight={isLight} isDarkMode={isDarkMode} />
              <NavLink href="/kb" icon={<Book className="w-4 h-4" />} label="知識庫" isLight={isLight} isDarkMode={isDarkMode} />
              <NavLink href="/chat" icon={<MessageSquare className="w-4 h-4" />} label="聊天室" isLight={isLight} isDarkMode={isDarkMode} />
              
              {session?.user?.role === 'LEADER' && (
                <NavLink href="/admin" icon={<Settings className="w-4 h-4" />} label="管理" isLight={isLight} isDarkMode={isDarkMode} />
              )}
              
              <button
                type="button"
                onClick={toggleColorMode}
                className={`ml-3 flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95 ${
                  isLight
                    ? isDarkMode ? "text-slate-200 hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
                aria-label={isDarkMode ? "切換至淺色模式" : "切換至深色模式"}
                title={isDarkMode ? "切換至淺色模式" : "切換至深色模式"}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className={`ml-1 pl-4 border-l ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
                {session ? (
                  <button
                    onClick={() => signOut()}
                    className="group bg-[#ec3750] text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-[#ff4d66] flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
                  >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> 
                    {session.user?.name}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className={`${isDarkMode ? "bg-slate-800 text-white hover:bg-slate-700 border-slate-700" : "bg-white text-slate-900 hover:bg-slate-50 border-slate-200"} px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border shadow-xl shadow-slate-900/5`}
                  >
                    <LogIn className="w-4 h-4" /> 登入
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          <div className="md:hidden">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleColorMode}
                className={`p-2 rounded-xl transition-colors ${isLight ? isDarkMode ? "text-white hover:bg-white/10" : "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/10"}`}
                aria-label={isDarkMode ? "切換至淺色模式" : "切換至深色模式"}
              >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-xl transition-colors ${isLight ? isDarkMode ? "text-white hover:bg-white/10" : "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/10"}`}
              >
                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={`md:hidden absolute top-full left-0 w-full border-b shadow-2xl p-4 animate-in slide-in-from-top duration-300 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
          <div className="space-y-2">
            <MobileNavLink href="/announcements" icon={<Bell className="w-5 h-5" />} label="公告" />
            <MobileNavLink href="/kb" icon={<Book className="w-5 h-5" />} label="知識庫" />
            <MobileNavLink href="/chat" icon={<MessageSquare className="w-5 h-5" />} label="聊天室" />
            {session?.user?.role === 'LEADER' && (
              <MobileNavLink href="/admin" icon={<Settings className="w-5 h-5" />} label="管理面板" />
            )}
            <div className="pt-4 border-t border-slate-100 mt-4">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="w-full bg-[#ec3750] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-xl shadow-red-500/20"
                >
                  <LogOut className="w-5 h-5" /> 登出 ({session.user?.name})
                </button>
              ) : (
                <Link
                  href="/login"
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" /> 登入成員帳號
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

function NavLink({ href, icon, label, isLight, isDarkMode }: { href: string, icon: React.ReactNode, label: string, isLight: boolean, isDarkMode: boolean }) {
  return (
    <Link 
      href={href} 
      className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
        isLight
          ? isDarkMode ? "text-slate-300 hover:bg-white/10 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon} {label}
    </Link>
  );
}

function MobileNavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-4 px-4 py-4 rounded-2xl font-black text-slate-700 hover:bg-slate-50 hover:text-[#ec3750] transition-colors"
    >
      {icon} {label}
    </Link>
  );
}

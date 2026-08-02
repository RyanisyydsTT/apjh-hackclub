"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ExternalLink, LogOut, Book, Bell, Settings, Sun, Moon, CalendarDays, Heart } from "lucide-react";
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
  const isDarkMode = colorMode === "dark";
  // Pages that render on a plain background want the bar detached from the
  // start; the home page earns its shadow once you scroll off the hero.
  const raised = initialTheme === "light" || scrolled;

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
    <nav
      className={`fixed top-0 z-50 w-full border-b-2 border-line bg-paper transition-shadow duration-200 ${
        raised ? "shadow-[0_5px_0_0_var(--line)]" : "shadow-none"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex flex-shrink-0 items-center gap-3">
            {/* Explicit hex, not bg-white: the legacy dark overrides repaint bg-white. */}
            <span className="brut-flat flex h-10 w-10 items-center justify-center bg-[#fffdf7] p-1 shadow-[3px_3px_0_0_var(--line)]">
              <Image
                src="/apjhirc-logo.svg"
                alt="APJHIRC 標誌"
                width={40}
                height={40}
                priority
                className="h-full w-full object-contain"
              />
            </span>
            <span className="display text-xl leading-none text-ink">
              <span className="text-accent">APJHIRC</span>
              <span className="hidden lg:inline"> 安平國中資訊研究社</span>
            </span>
          </Link>

          <div className="hidden md:block">
            <div className="flex items-center gap-1">
              <NavLink href="/#course" icon={<CalendarDays className="h-4 w-4" />} label="課程" />
              <NavLink href="/announcements" icon={<Bell className="h-4 w-4" />} label="公告" />
              <NavLink href="/kb" icon={<Book className="h-4 w-4" />} label="知識庫" />
              <NavLink href="/sponsor" icon={<Heart className="h-4 w-4" />} label="贊助我們" />

              {session?.user?.isAdmin && (
                <NavLink href="/admin" icon={<Settings className="h-4 w-4" />} label="管理" />
              )}

              <button
                type="button"
                onClick={toggleColorMode}
                className="brut-flat brut-press ml-3 flex h-9 w-9 items-center justify-center bg-transparent text-ink transition-colors hover:bg-ink hover:text-paper"
                aria-label={isDarkMode ? "切換至淺色模式" : "切換至深色模式"}
                title={isDarkMode ? "切換至淺色模式" : "切換至深色模式"}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <div className="ml-3 border-l-2 border-line pl-3">
                {session ? (
                  <button
                    onClick={() => signOut()}
                    className="brut-press stencil flex items-center gap-2 border-2 border-line bg-accent px-4 py-2.5 text-on-accent shadow-[3px_3px_0_0_var(--line)]"
                  >
                    <LogOut className="h-4 w-4" />
                    {session.user?.name}
                  </button>
                ) : (
                  <Link
                    href="https://cloud.shin-her.com.tw/Auth/Auth/CloudLogin"
                    target="_blank"
                    rel="noreferrer"
                    className="brut-press stencil flex items-center gap-2 border-2 border-line bg-accent px-4 py-2.5 text-on-accent shadow-[3px_3px_0_0_var(--line)]"
                  >
                    社團選填 <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleColorMode}
              className="brut-flat brut-press flex h-10 w-10 items-center justify-center bg-transparent text-ink"
              aria-label={isDarkMode ? "切換至淺色模式" : "切換至深色模式"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="brut-flat brut-press flex h-10 w-10 items-center justify-center bg-transparent text-ink"
              aria-label={isOpen ? "關閉選單" : "開啟選單"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full w-full border-b-2 border-line bg-paper p-4 shadow-[0_6px_0_0_var(--line)] md:hidden">
          <div className="grid gap-2">
            <MobileNavLink href="/#course" icon={<CalendarDays className="h-5 w-5" />} label="課程排程" />
            <MobileNavLink href="/announcements" icon={<Bell className="h-5 w-5" />} label="公告" />
            <MobileNavLink href="/kb" icon={<Book className="h-5 w-5" />} label="知識庫" />
            <MobileNavLink href="/sponsor" icon={<Heart className="h-5 w-5" />} label="贊助我們" />
            {session?.user?.isAdmin && (
              <MobileNavLink href="/admin" icon={<Settings className="h-5 w-5" />} label="管理面板" />
            )}
            <div className="mt-2 border-t-2 border-line pt-4">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="stencil flex w-full items-center justify-center gap-2 border-2 border-line bg-accent py-4 text-on-accent shadow-[4px_4px_0_0_var(--line)]"
                >
                  <LogOut className="h-5 w-5" /> 登出 ({session.user?.name})
                </button>
              ) : (
                <Link
                  href="https://cloud.shin-her.com.tw/Auth/Auth/CloudLogin"
                  target="_blank"
                  rel="noreferrer"
                  className="stencil flex w-full items-center justify-center gap-2 border-2 border-line bg-accent py-4 text-on-accent shadow-[4px_4px_0_0_var(--line)]"
                >
                  前往安平國中社團選填 <ExternalLink className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link
      href={href}
      className="stencil flex items-center gap-2 border-2 border-transparent px-3 py-2 text-ink transition-colors hover:border-line hover:bg-ink hover:text-paper"
    >
      {icon} {label}
    </Link>
  );
}

function MobileNavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link
      href={href}
      className="stencil flex items-center gap-4 border-2 border-line bg-panel px-4 py-4 text-ink transition-colors hover:bg-ink hover:text-paper"
    >
      {icon} {label}
    </Link>
  );
}

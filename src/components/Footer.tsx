import Image from "next/image";
import Link from "next/link";
import { Camera, ExternalLink, Heart } from "lucide-react";

const clubSelectionUrl = "https://cloud.shin-her.com.tw/Auth/Auth/CloudLogin";

export function Footer() {
  return (
    <footer className="border-t-2 border-line bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-0 border-2 border-line md:grid-cols-[1.3fr_0.85fr_0.85fr]">
          <div className="border-b-2 border-line p-8 md:border-b-0 md:border-r-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="brut-flat flex h-12 w-12 items-center justify-center bg-[#fffdf7] p-1">
                <Image
                  src="/apjhirc-logo.svg"
                  alt="APJHIRC 標誌"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </span>
              <span>
                <span className="display block text-2xl leading-none">APJHIRC</span>
                <span className="stencil mt-1.5 block text-ink-soft">安平國中資訊研究社</span>
              </span>
            </Link>
            <p className="mt-6 max-w-md text-sm font-medium leading-6 text-ink-soft">
              用程式、AI 與創意，把腦中的點子做成真正能分享的作品。
            </p>
          </div>

          <div className="border-b-2 border-line p-8 md:border-b-0 md:border-r-2">
            <p className="stencil text-ink-soft">站內導覽</p>
            <nav className="mt-5 grid gap-3 text-sm font-bold">
              <FooterLink href="/#course">課程排程</FooterLink>
              <FooterLink href="/announcements">社團公告</FooterLink>
              <FooterLink href="/kb">學習知識庫</FooterLink>
              <FooterLink href="/sponsor">贊助我們</FooterLink>
            </nav>
          </div>

          <div className="p-8">
            <p className="stencil text-ink-soft">聯絡我們</p>
            <div className="mt-5 grid gap-3 text-sm font-bold">
              <Link
                href="https://www.instagram.com/apjhirc/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 border-b-2 border-transparent transition-colors hover:border-line"
              >
                <Camera className="h-4 w-4" />
                @apjhirc
              </Link>
              <Link
                href={clubSelectionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 border-b-2 border-transparent transition-colors hover:border-line"
              >
                安平國中社團選填
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="stencil flex items-center gap-1.5 text-ink-soft">
            © 2026 APJHIRC · Made with
            <Heart className="h-3.5 w-3.5 fill-accent text-accent" />
            in Tainan
          </p>
          <Link href="/login" className="stencil text-ink-soft transition-colors hover:text-ink">
            管理員登入
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center border-b-2 border-transparent transition-colors hover:border-line"
    >
      {children}
    </Link>
  );
}

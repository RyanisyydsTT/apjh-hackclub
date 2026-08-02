import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登入",
  description: "登入 APJHIRC 安平國中資訊研究社成員帳號。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

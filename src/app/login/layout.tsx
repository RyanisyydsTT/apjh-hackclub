import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登入",
  description: "登入 APJH Hack Club 成員帳號。",
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

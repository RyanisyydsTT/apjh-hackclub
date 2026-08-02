export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hack.apjh.lol";

export const siteName = "APJHIRC 安平國中資訊研究社";

export const siteDescription =
  "APJHIRC 安平國中資訊研究社：以 AI、GitHub Codespaces 與 Vibe Coding 製作網站，學習網頁開發、資安觀念與專題實作。";

export const seoKeywords = [
  "APJHIRC",
  "安平國中",
  "安平國中資訊研究社",
  "程式創作",
  "程式設計",
  "Vibe Coding",
  "GitHub Codespaces",
  "AI 輔助開發",
  "網頁開發",
  "資安",
  "Hack Club",
  "學生社團",
  "台南",
];

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function excerptMarkdown(markdown: string, maxLength = 150) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`~\-[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

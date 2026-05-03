export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apjh-hackclub.vercel.app";

export const siteName = "APJH Hack Club";

export const siteDescription =
  "安平國中程式創作工作坊 Hack Club：學習 AI 輔助開發、資安觀念與實用網頁專案，打造 apps、websites、games 與校園工具。";

export const seoKeywords = [
  "APJH Hack Club",
  "安平國中",
  "Hack Club",
  "程式創作",
  "程式設計",
  "AI 輔助開發",
  "網頁開發",
  "資安",
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

import 'dotenv/config';
import { PrismaClient } from './generated/client/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import bcrypt from 'bcryptjs';

const adapter = new PrismaBetterSqlite3({ url: 'file:dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD must be set before running the seed script.');
  }

  const adminUsername = process.env.ADMIN_USERNAME || 'ryan';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.deleteMany({
    where: {
      username: {
        not: adminUsername,
      },
    },
  });
  
  const admin = await prisma.user.upsert({
    where: { username: adminUsername },
    update: {
      password: hashedPassword,
      realName: 'Ryan',
    },
    create: {
      username: adminUsername,
      password: hashedPassword,
      realName: 'Ryan',
    },
  });

  console.log('Seeded admin user:', admin.username);

  await prisma.announcement.deleteMany({});
  await prisma.knowledgebase.deleteMany({});

  // Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: '✨ 創社公告：九月正式啟動！第一學期聚焦 AI 與實用網頁開發',
        content: `大家好！APJHIRC 安平國中資訊研究社將於九月正式成立。
        
我們第一學期的核心目標非常明確：**「用 AI 打造實用且安全的網頁」**。

在第一學期中，我們將學習：
1. **AI 協作**：利用 AI 工具輔助編寫高品質程式碼，大幅提升開發速度。
2. **資安意識**：從第一行程式碼開始，就學習如何防範常見的安全威脅，建立正確的開發規範。
3. **實用導向**：我們不只是做練習題，我們要做出真正對生活「有用、實用」的網站工具。

至於硬體與其他進階軟體計劃，我們將在打好網頁基礎後，於後續學期逐步展開！`,
      }
    ]
  });

  // Knowledgebase Articles
  await prisma.knowledgebase.createMany({
    data: [
      {
        title: '第一學期課程大綱：AI、資安與 Web',
        slug: 'semester-1-outline',
        content: `# 2026 第一學期課程規劃

本學期我們將專注於現代網頁開發的核心技能，並結合最新的 AI 技術，同時確保產品的安全性。

### 核心三大支柱
1. **AI Powered**: 學會如何與 AI 協作，這不是抄襲，而是更聰明地使用工具。
2. **Security First**: 了解常見的漏洞（如 SQL Injection, XSS），並學習如何防護。
3. **Utility focused**: 解決現實生活中的小問題。

### 階段性目標
- **9月**: 環境設定、Github 協作與 AI 溝通技巧。
- **10月**: 前端 UI/UX 設計與資安基礎觀念。
- **11-12月**: 期末專案實作與發布。

---
*關於硬體與機器人計劃：預計於下學期（2027年初）視大家進度展開。*`,
      },
      {
        title: '為什麼資安對新手開發者很重要？',
        slug: 'why-security-matters',
        content: `# 安全性：程式設計師的職業道德

在 APJHIRC，我們不只教你怎麼寫會動的程式，還要教你寫「安全」的程式。

### 為什麼新手要學資安？
1. **保護使用者**: 即使是一個小型的工具，如果洩漏了同學的個資也是嚴重的問題。
2. **建立專業素養**: 安全的編碼習慣是從第一天就開始養成的。
3. **深入了解運作原理**: 當你了解一個系統如何被攻破，你才會真正理解它如何運作。

我們會學習如何撰寫防護代碼，並使用 AI 工具來協助我們檢測潛在的安全漏洞。`,
      }
    ]
  });

  console.log('Database re-seeded with AI & Security focus!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

CREATE TABLE "ObsCourse" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "period" TEXT NOT NULL DEFAULT '目前課程',
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "ObsCourse" ("id", "period", "title", "detail", "updatedAt")
VALUES (
    'default',
    '目前課程',
    '雲端開發環境啟動',
    '建立 GitHub 帳號、開啟 Codespaces，完成第一個測試網站',
    CURRENT_TIMESTAMP
);

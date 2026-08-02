CREATE TABLE "SponsorIntent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "certificateEmail" TEXT NOT NULL,
    "paypalSubscriptionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "SponsorIntent_paypalSubscriptionId_key"
ON "SponsorIntent"("paypalSubscriptionId");

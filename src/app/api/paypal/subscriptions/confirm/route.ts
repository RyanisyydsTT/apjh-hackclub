import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPayPalAccessToken, paypalApiBase } from "@/lib/paypal";

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const body = await request.json();
  const intentId = typeof body.intentId === "string" ? body.intentId : "";
  const subscriptionId = typeof body.subscriptionId === "string" ? body.subscriptionId : "";
  const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID;
  if (!intentId || !subscriptionId || !planId) {
    return NextResponse.json({ error: "缺少訂閱資料" }, { status: 400 });
  }

  const intent = await prisma.sponsorIntent.findUnique({ where: { id: intentId } });
  if (!intent) {
    return NextResponse.json({ error: "找不到贊助資料" }, { status: 404 });
  }

  try {
    const accessToken = await getPayPalAccessToken();
    const response = await fetch(`${paypalApiBase}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
    const subscription = await response.json();

    if (
      !response.ok ||
      subscription.plan_id !== planId ||
      subscription.custom_id !== intentId ||
      !["ACTIVE", "APPROVAL_PENDING", "APPROVED"].includes(subscription.status)
    ) {
      return NextResponse.json({ error: "PayPal 訂閱驗證失敗" }, { status: 400 });
    }

    await prisma.sponsorIntent.update({
      where: { id: intentId },
      data: {
        paypalSubscriptionId: subscriptionId,
        status: subscription.status,
      },
    });

    return NextResponse.json({ ok: true, status: subscription.status });
  } catch {
    return NextResponse.json({ error: "暫時無法向 PayPal 確認訂閱" }, { status: 502 });
  }
}

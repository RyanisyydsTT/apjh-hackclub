import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

function normalize(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const body = await request.json();
  const message = normalize(body.message, 1000);
  const certificateEmail = normalize(body.certificateEmail, 254).toLowerCase();

  if (!message) {
    return NextResponse.json({ error: "請填寫想給社團的訊息" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(certificateEmail)) {
    return NextResponse.json({ error: "請填寫有效的 Email" }, { status: 400 });
  }

  const intent = await prisma.sponsorIntent.create({
    data: { message, certificateEmail },
    select: { id: true },
  });
  return NextResponse.json(intent, { status: 201 });
}

import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { isAdminSession } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

function clean(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const period = clean(body.period, 30);
  const title = clean(body.title, 80);
  const detail = clean(body.detail, 160);

  if (!period || !title || !detail) {
    return NextResponse.json({ error: "三個欄位都必須填寫" }, { status: 400 });
  }

  const course = await prisma.obsCourse.upsert({
    where: { id: "default" },
    create: { id: "default", period, title, detail },
    update: { period, title, detail },
  });

  return NextResponse.json({
    period: course.period,
    title: course.title,
    detail: course.detail,
  });
}

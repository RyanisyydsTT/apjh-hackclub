import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, slug, content } = await req.json();
  
  try {
    const article = await prisma.knowledgebase.create({
      data: { title, slug, content },
    });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdminSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.knowledgebase.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

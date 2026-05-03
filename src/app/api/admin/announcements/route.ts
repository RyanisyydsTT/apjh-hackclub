import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

type AdminSessionUser = {
  role?: string;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as AdminSessionUser).role !== 'LEADER') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content, isPublic } = await req.json();
  
  const announcement = await prisma.announcement.create({
    data: { title, content, isPublic },
  });

  return NextResponse.json(announcement);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as AdminSessionUser).role !== 'LEADER') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.announcement.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'LEADER') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username, password, realName, gradeClass, role } = await req.json();
  
  const data: any = {
    username,
    realName,
    gradeClass,
    role,
  };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

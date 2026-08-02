import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const username = process.env.ADMIN_USERNAME || "ryan";
  const user = await prisma.user.findUnique({
    where: { username },
    select: { securitySetupComplete: true },
  });

  return NextResponse.json({ setupRequired: !user?.securitySetupComplete });
}

import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/server";
import { prisma } from "@/lib/prisma";
import { authFlowExpiry, relyingParty } from "@/lib/security";

export async function POST() {
  const username = process.env.ADMIN_USERNAME || "ryan";
  const user = await prisma.user.findUnique({ where: { username }, include: { passkeys: true } });
  if (!user?.securitySetupComplete || user.passkeys.length === 0) {
    return NextResponse.json({ error: "尚未設定 Passkey" }, { status: 400 });
  }

  const { rpID } = relyingParty();
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "required",
    allowCredentials: user.passkeys.map((passkey) => ({
      id: passkey.credentialId,
      transports: passkey.transports
        ? (passkey.transports.split(",") as AuthenticatorTransportFuture[])
        : undefined,
    })),
  });
  const flowId = randomUUID();
  await prisma.authFlow.deleteMany({ where: { OR: [{ kind: "login" }, { expiresAt: { lt: new Date() } }] } });
  await prisma.authFlow.create({
    data: {
      id: flowId,
      kind: "login",
      challenge: options.challenge,
      expiresAt: authFlowExpiry(),
      userId: user.id,
    },
  });
  return NextResponse.json({ flowId, options });
}

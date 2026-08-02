import { NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import type { RegistrationResponseJSON } from "@simplewebauthn/server";
import { authenticator } from "otplib";
import { prisma } from "@/lib/prisma";
import { decryptSecret, encryptSecret, relyingParty } from "@/lib/security";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (typeof body.flowId !== "string" || typeof body.totpCode !== "string" || !body.registrationResponse) {
    return NextResponse.json({ error: "設定資料不完整" }, { status: 400 });
  }

  const flow = await prisma.authFlow.findUnique({ where: { id: body.flowId }, include: { user: true } });
  if (!flow || flow.kind !== "setup" || flow.expiresAt < new Date() || !flow.encryptedTotpSecret) {
    return NextResponse.json({ error: "設定工作階段已過期，請重新開始" }, { status: 400 });
  }
  if (flow.user.securitySetupComplete) {
    return NextResponse.json({ error: "安全設定已完成" }, { status: 409 });
  }

  const totpSecret = decryptSecret(flow.encryptedTotpSecret);
  if (!authenticator.verify({ token: body.totpCode.replace(/\s/g, ""), secret: totpSecret })) {
    return NextResponse.json({ error: "Authenticator 驗證碼不正確" }, { status: 401 });
  }

  const { origin, rpID } = relyingParty();
  const verification = await verifyRegistrationResponse({
    response: body.registrationResponse as RegistrationResponseJSON,
    expectedChallenge: flow.challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
  });

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: "Passkey 驗證失敗" }, { status: 401 });
  }

  const credential = verification.registrationInfo.credential;
  const transports = body.registrationResponse.response?.transports;

  await prisma.$transaction([
    prisma.passkey.create({
      data: {
        credentialId: credential.id,
        publicKey: Buffer.from(credential.publicKey).toString("base64url"),
        counter: credential.counter,
        transports: Array.isArray(transports) ? transports.join(",") : "",
        userId: flow.userId,
      },
    }),
    prisma.user.update({
      where: { id: flow.userId },
      data: {
        password: null,
        totpSecretEncrypted: encryptSecret(totpSecret),
        securitySetupComplete: true,
      },
    }),
    prisma.authFlow.deleteMany({ where: { userId: flow.userId } }),
  ]);

  return NextResponse.json({ success: true });
}

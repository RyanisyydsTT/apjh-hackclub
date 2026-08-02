import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { authFlowExpiry, encryptSecret, relyingParty, safeSecretEqual } from "@/lib/security";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const receivedSecret = typeof body.secret === "string" ? body.secret : "";
  const setupSecret = process.env.INITIAL_SETUP_SECRET || "";

  if (!setupSecret || !safeSecretEqual(receivedSecret, setupSecret)) {
    return NextResponse.json({ error: "設定密鑰不正確" }, { status: 401 });
  }

  const username = process.env.ADMIN_USERNAME || "ryan";
  const user = await prisma.user.findUnique({ where: { username }, include: { passkeys: true } });
  if (!user) return NextResponse.json({ error: "管理員帳號不存在" }, { status: 404 });
  if (user.securitySetupComplete) {
    return NextResponse.json({ error: "安全設定已完成，此密鑰已停用" }, { status: 409 });
  }

  const { origin: _origin, ...rp } = relyingParty();
  const options = await generateRegistrationOptions({
    ...rp,
    userID: new TextEncoder().encode(user.id),
    userName: user.username,
    userDisplayName: user.realName || user.username,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "required",
    },
    excludeCredentials: user.passkeys.map((passkey) => ({ id: passkey.credentialId })),
  });

  const totpSecret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri(user.username, "APJHIRC", totpSecret);
  const flowId = randomUUID();

  await prisma.authFlow.deleteMany({ where: { OR: [{ userId: user.id }, { expiresAt: { lt: new Date() } }] } });
  await prisma.authFlow.create({
    data: {
      id: flowId,
      kind: "setup",
      challenge: options.challenge,
      encryptedTotpSecret: encryptSecret(totpSecret),
      expiresAt: authFlowExpiry(),
      userId: user.id,
    },
  });

  return NextResponse.json({
    flowId,
    registrationOptions: options,
    qrCode: await QRCode.toDataURL(otpauthUrl, { width: 240, margin: 1 }),
    manualKey: totpSecret,
  });
}

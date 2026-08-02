import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { authenticator } from "otplib";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type { AuthenticationResponseJSON, AuthenticatorTransportFuture } from "@simplewebauthn/server";
import { decryptSecret, relyingParty } from "@/lib/security";

const adminUsername = process.env.ADMIN_USERNAME || "ryan";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        method: { label: "Method", type: "text" },
        token: { label: "Token", type: "text" },
        flowId: { label: "Flow", type: "text" },
        response: { label: "Response", type: "text" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { username: adminUsername },
          include: { passkeys: true },
        });
        if (!user?.securitySetupComplete) return null;

        if (credentials?.method === "totp") {
          if (!credentials.token || !user.totpSecretEncrypted) return null;
          const valid = authenticator.verify({
            token: credentials.token.replace(/\s/g, ""),
            secret: decryptSecret(user.totpSecretEncrypted),
          });
          if (!valid) return null;
        } else if (credentials?.method === "passkey") {
          if (!credentials.flowId || !credentials.response) return null;
          const flow = await prisma.authFlow.findUnique({ where: { id: credentials.flowId } });
          if (!flow || flow.kind !== "login" || flow.userId !== user.id || flow.expiresAt < new Date()) return null;

          const response = JSON.parse(credentials.response) as AuthenticationResponseJSON;
          const passkey = user.passkeys.find((item) => item.credentialId === response.id);
          if (!passkey) return null;

          const { origin, rpID } = relyingParty();
          const verification = await verifyAuthenticationResponse({
            response,
            expectedChallenge: flow.challenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            requireUserVerification: true,
            credential: {
              id: passkey.credentialId,
              publicKey: new Uint8Array(Buffer.from(passkey.publicKey, "base64url")),
              counter: passkey.counter,
              transports: passkey.transports
                ? (passkey.transports.split(",") as AuthenticatorTransportFuture[])
                : undefined,
            },
          });
          await prisma.authFlow.delete({ where: { id: flow.id } });
          if (!verification.verified) return null;
          await prisma.passkey.update({
            where: { credentialId: passkey.credentialId },
            data: { counter: verification.authenticationInfo.newCounter },
          });
        } else {
          return null;
        }

        return {
          id: user.id,
          name: user.realName,
          email: user.username,
          username: user.username,
          isAdmin: user.username === adminUsername,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.username = String(token.username ?? "");
        session.user.isAdmin = token.isAdmin === true;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

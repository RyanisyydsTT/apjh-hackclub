"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/browser";
import { AlertCircle, CheckCircle2, KeyRound, LoaderCircle, ShieldCheck, Smartphone } from "lucide-react";
import { Navbar } from "@/components/Navbar";

type SetupData = {
  flowId: string;
  registrationOptions: PublicKeyCredentialCreationOptionsJSON;
  qrCode: string;
  manualKey: string;
};

export default function LoginPage() {
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);
  const [setupSecret, setSetupSecret] = useState("");
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/security/status", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setSetupRequired(Boolean(data.setupRequired)))
      .catch(() => setError("無法讀取安全設定狀態"));
  }, []);

  const beginSetup = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/security/setup/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: setupSecret }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "無法開始設定");
      setSetupData(data);
      setSetupSecret("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "無法開始設定");
    } finally {
      setLoading(false);
    }
  };

  const finishSetup = async () => {
    if (!setupData || totpCode.replace(/\s/g, "").length !== 6) {
      setError("請先輸入 Authenticator 的 6 位數驗證碼");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const registrationResponse = await startRegistration({
        optionsJSON: setupData.registrationOptions,
      });
      const response = await fetch("/api/security/setup/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flowId: setupData.flowId,
          totpCode,
          registrationResponse,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "無法完成安全設定");
      setSetupComplete(true);
      setSetupRequired(false);
      setSetupData(null);
      setTotpCode("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Passkey 設定被取消或失敗");
    } finally {
      setLoading(false);
    }
  };

  const loginWithTotp = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      method: "totp",
      token: loginCode,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Authenticator 驗證碼不正確");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  const loginWithPasskey = async () => {
    setLoading(true);
    setError("");
    try {
      const optionsResponse = await fetch("/api/security/passkey/options", { method: "POST" });
      const data = await optionsResponse.json();
      if (!optionsResponse.ok) throw new Error(data.error || "無法使用 Passkey");
      const authenticationResponse = await startAuthentication({
        optionsJSON: data.options as PublicKeyCredentialRequestOptionsJSON,
      });
      const result = await signIn("credentials", {
        method: "passkey",
        flowId: data.flowId,
        response: JSON.stringify(authenticationResponse),
        redirect: false,
      });
      if (result?.error) throw new Error("Passkey 驗證失敗");
      router.push("/admin");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Passkey 驗證被取消或失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Navbar initialTheme="light" />
      <main className="flex flex-grow items-center justify-center px-4 pb-16 pt-28">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40">
          <div className="bg-slate-950 p-8 text-center text-white">
            <Image
              src="/apjhirc-logo.svg"
              alt="APJHIRC 標誌"
              width={64}
              height={64}
              className="mx-auto mb-4 h-16 w-16 rounded-xl bg-white object-contain"
            />
            <h1 className="text-2xl font-black">{setupRequired ? "首次安全設定" : "管理員登入"}</h1>
            <p className="mt-2 text-sm font-medium text-slate-400">
              {setupRequired ? "設定 Passkey 與 Authenticator，正式停用密碼登入" : "使用 Passkey 或 Authenticator 登入"}
            </p>
          </div>

          <div className="p-7 sm:p-8">
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            {setupComplete && (
              <div className="mb-5 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                設定完成。一次性設定密鑰已永久停用，現在可選擇任一方式登入。
              </div>
            )}

            {setupRequired === null ? (
              <div className="flex justify-center py-12 text-slate-400">
                <LoaderCircle className="h-7 w-7 animate-spin" />
              </div>
            ) : setupRequired && !setupData ? (
              <form onSubmit={beginSetup} className="space-y-5">
                <SecurityIntro />
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">一次性設定密鑰</span>
                  <input
                    type="password"
                    value={setupSecret}
                    onChange={(event) => setSetupSecret(event.target.value)}
                    autoComplete="off"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-mono outline-none transition focus:border-[#ec3750] focus:ring-4 focus:ring-red-100"
                  />
                </label>
                <PrimaryButton loading={loading}>開始安全設定</PrimaryButton>
              </form>
            ) : setupRequired && setupData ? (
              <div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-6 w-6 text-[#ec3750]" />
                    <div>
                      <h2 className="font-black text-slate-900">1. 加入 Authenticator</h2>
                      <p className="text-sm font-medium text-slate-500">使用驗證器 App 掃描 QR Code</p>
                    </div>
                  </div>
                  <Image
                    src={setupData.qrCode}
                    alt="Authenticator 設定 QR Code"
                    width={240}
                    height={240}
                    unoptimized
                    className="mx-auto my-5 rounded-xl"
                  />
                  <details className="text-sm">
                    <summary className="cursor-pointer font-bold text-slate-500">無法掃描？顯示手動設定碼</summary>
                    <code className="mt-3 block break-all rounded-lg bg-white p-3 text-xs font-bold text-slate-700">
                      {setupData.manualKey}
                    </code>
                  </details>
                  <input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={totpCode}
                    onChange={(event) => setTotpCode(event.target.value.replace(/\D/g, ""))}
                    placeholder="輸入 6 位數驗證碼"
                    className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-center font-mono text-xl font-black tracking-[0.3em] outline-none focus:border-[#ec3750] focus:ring-4 focus:ring-red-100"
                  />
                </div>
                <div className="my-5 rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center gap-3">
                    <KeyRound className="h-6 w-6 text-[#ec3750]" />
                    <div>
                      <h2 className="font-black text-slate-900">2. 建立 Passkey</h2>
                      <p className="text-sm font-medium text-slate-500">按下方按鈕後依裝置提示完成</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={finishSetup}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ec3750] py-4 text-lg font-black text-white transition hover:bg-[#d92942] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                  驗證並完成設定
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  type="button"
                  onClick={loginWithPasskey}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-slate-950 py-4 text-lg font-black text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  <KeyRound className="h-5 w-5" />
                  使用 Passkey 登入
                </button>
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs font-black text-slate-400">或</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <form onSubmit={loginWithTotp} className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-black text-slate-700">Authenticator 驗證碼</span>
                    <input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={loginCode}
                      onChange={(event) => setLoginCode(event.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-center font-mono text-xl font-black tracking-[0.3em] outline-none focus:border-[#ec3750] focus:ring-4 focus:ring-red-100"
                    />
                  </label>
                  <PrimaryButton loading={loading}>使用 Authenticator 登入</PrimaryButton>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SecurityIntro() {
  return (
    <div className="rounded-xl bg-blue-50 p-4 text-sm font-medium leading-6 text-blue-900">
      首次設定需要同時完成 Passkey 與 Authenticator。完成後，設定密鑰與傳統密碼都無法再用於登入。
    </div>
  );
}

function PrimaryButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ec3750] py-4 text-lg font-black text-white transition hover:bg-[#d92942] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading && <LoaderCircle className="h-5 w-5 animate-spin" />}
      {children}
    </button>
  );
}

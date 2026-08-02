"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, Mail, MessageSquareText, ShieldAlert } from "lucide-react";

type PayPalActions = {
  subscription: {
    create: (options: {
      plan_id: string;
      custom_id: string;
      application_context: {
        shipping_preference: "NO_SHIPPING";
        user_action: "SUBSCRIBE_NOW";
      };
    }) => Promise<string>;
  };
};

type PayPalButtons = {
  render: (container: HTMLElement) => Promise<void>;
  close: () => Promise<void>;
};

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: {
        style: Record<string, string | number>;
        onClick: () => boolean | Promise<boolean>;
        createSubscription: (_data: unknown, actions: PayPalActions) => Promise<string>;
        onApprove: (data: { subscriptionID: string }) => Promise<void>;
        onCancel: () => void;
        onError: (error: unknown) => void;
      }) => PayPalButtons;
    };
  }
}

export function PayPalSponsor({ clientId, planId }: { clientId: string; planId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<PayPalButtons | null>(null);
  const formRef = useRef({ message: "", certificateEmail: "" });
  const intentIdRef = useRef("");
  const [message, setMessage] = useState("");
  const [certificateEmail, setCertificateEmail] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    formRef.current = { message, certificateEmail };
  }, [message, certificateEmail]);

  useEffect(() => {
    if (!clientId || !planId) return;

    const existing = document.querySelector<HTMLScriptElement>('script[data-apjh-paypal="true"]');
    const load = () => setSdkReady(true);
    if (existing) {
      if (window.paypal) load();
      else existing.addEventListener("load", load, { once: true });
      return () => existing.removeEventListener("load", load);
    }

    const script = document.createElement("script");
    script.dataset.apjhPaypal = "true";
    script.src =
      `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}` +
      "&components=buttons&currency=TWD&vault=true&intent=subscription&locale=zh_TW";
    script.async = true;
    script.onload = load;
    script.onerror = () => setError("PayPal 付款元件載入失敗，請稍後再試。");
    document.head.appendChild(script);

    return () => script.removeEventListener("load", load);
  }, [clientId, planId]);

  useEffect(() => {
    if (!sdkReady || !window.paypal || !containerRef.current || buttonsRef.current) return;

    const buttons = window.paypal.Buttons({
      style: {
        shape: "rect",
        color: "gold",
        layout: "vertical",
        label: "subscribe",
        height: 52,
      },
      onClick: () => {
        setError("");
        const current = formRef.current;
        if (!current.message.trim()) {
          setError("請填寫想給安平國中資訊研究社的訊息。");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current.certificateEmail.trim())) {
          setError("請填寫有效的電子感謝狀寄發 Email。");
          return false;
        }
        return true;
      },
      createSubscription: async (_data, actions) => {
        setProcessing(true);
        setError("");
        const response = await fetch("/api/paypal/sponsor-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formRef.current),
        });
        const result = await response.json();
        if (!response.ok) {
          setProcessing(false);
          throw new Error(result.error || "無法建立贊助資料");
        }
        intentIdRef.current = result.id;
        return actions.subscription.create({
          plan_id: planId,
          custom_id: result.id,
          application_context: {
            shipping_preference: "NO_SHIPPING",
            user_action: "SUBSCRIBE_NOW",
          },
        });
      },
      onApprove: async (data) => {
        const response = await fetch("/api/paypal/subscriptions/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            intentId: intentIdRef.current,
            subscriptionId: data.subscriptionID,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "無法確認 PayPal 訂閱");
        setComplete(true);
        setProcessing(false);
      },
      onCancel: () => {
        setProcessing(false);
        setError("您已取消 PayPal 授權，尚未建立定期贊助。");
      },
      onError: (cause) => {
        setProcessing(false);
        setError(cause instanceof Error ? cause.message : "PayPal 發生錯誤，請稍後再試。");
      },
    });

    buttonsRef.current = buttons;
    buttons.render(containerRef.current).catch(() => {
      buttonsRef.current = null;
      setError("PayPal 付款按鈕無法顯示，請稍後再試。");
    });

    return () => {
      buttons.close().catch(() => undefined);
      buttonsRef.current = null;
    };
  }, [sdkReady, planId]);

  if (!clientId || !planId) {
    return (
      <div className="mt-8 flex items-start gap-3 border-2 border-line bg-signal p-4 text-sm font-bold text-ink">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
        PayPal 付款設定尚未完成，請稍後再試。
      </div>
    );
  }

  if (complete) {
    return (
      <div className="mt-8 border-2 border-line p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-mint" />
        <h3 className="display mt-3 text-lg text-ink">感謝您的每月贊助！</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-ink-soft">
          PayPal 訂閱已完成。我們會使用您填寫的 Email 寄發電子感謝狀。
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
          <MessageSquareText className="h-4 w-4 text-accent" />
          您想給安平國中資訊研究社的訊息
        </span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={1000}
          rows={4}
          disabled={processing}
          placeholder="寫下想對我們說的話"
          className="w-full resize-none border-2 border-line bg-paper px-4 py-3 text-sm font-medium text-ink outline-none transition focus:shadow-[4px_4px_0_0_var(--line)] disabled:opacity-60"
        />
      </label>

      <label className="block">
        <span className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
          <Mail className="h-4 w-4 text-accent" />
          電子感謝狀寄發 Email
        </span>
        <input
          type="email"
          value={certificateEmail}
          onChange={(event) => setCertificateEmail(event.target.value)}
          maxLength={254}
          disabled={processing}
          placeholder="name@example.com"
          autoComplete="email"
          className="w-full border-2 border-line bg-paper px-4 py-3 text-sm font-medium text-ink outline-none transition focus:shadow-[4px_4px_0_0_var(--line)] disabled:opacity-60"
        />
      </label>

      {error && (
        <p className="border-2 border-accent bg-accent p-3 text-sm font-bold text-on-accent">{error}</p>
      )}
      {processing && (
        <p className="flex items-center justify-center gap-2 text-sm font-bold text-ink-soft">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          正在確認 PayPal 訂閱
        </p>
      )}
      <div className={processing ? "pointer-events-none opacity-60" : ""} ref={containerRef} />
    </div>
  );
}

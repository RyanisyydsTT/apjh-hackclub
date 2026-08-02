"use client";

import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";

const launchDate = new Date("2026-09-01T00:00:00+08:00");

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(): TimeLeft {
  const distance = Math.max(0, launchDate.getTime() - Date.now());

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

function formatTime(value: number) {
  return value.toString().padStart(2, "0");
}

export function CountdownCard() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setTimeLeft(getTimeLeft()));
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(timer);
    };
  }, []);

  const units = [
    { label: "Days", value: timeLeft?.days.toString() ?? "---" },
    { label: "Hours", value: timeLeft ? formatTime(timeLeft.hours) : "--" },
    { label: "Mins", value: timeLeft ? formatTime(timeLeft.minutes) : "--" },
    { label: "Secs", value: timeLeft ? formatTime(timeLeft.seconds) : "--" },
  ];

  return (
    <div className="brut-flat mx-auto grid max-w-5xl gap-6 p-6 text-left md:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <h2 className="display text-2xl text-ink md:text-3xl">距離 2026 秋季社課啟動</h2>
        <p className="mt-3 max-w-2xl font-medium leading-relaxed text-ink-soft">
          每週一第七、八節，一起用 AI 與 GitHub Codespaces 做出自己的網站。
        </p>
        <p className="mt-4 flex items-center gap-2 text-sm font-bold text-ink-soft">
          <CalendarDays className="h-4 w-4 text-accent" />
          2026 年 9 月 1 日
        </p>
      </div>

      <div className="grid grid-cols-4 gap-0.5 border-2 border-line bg-line">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="flex h-24 min-w-0 flex-col items-center justify-center bg-ink px-2 text-paper sm:h-28 sm:w-24"
          >
            <span className="display text-3xl tabular-nums sm:text-4xl" suppressHydrationWarning>
              {unit.value}
            </span>
            <span className="stencil mt-2 text-[0.6rem] opacity-70 sm:text-xs">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

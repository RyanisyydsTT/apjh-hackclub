"use client";

import { CalendarDays, Clock3, Rocket } from "lucide-react";
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
    <div className="relative mx-auto mb-12 max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-4 text-left shadow-2xl shadow-black/30 backdrop-blur-xl md:p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#ec3750]/30 blur-3xl" />
      <div className="absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />

      <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-[#ec3750] text-white shadow-lg shadow-red-900/30">
            <Rocket className="h-6 w-6" />
          </div>
          <div>
            <div className="pixel-label mb-2 flex items-center gap-2 text-xs font-black text-[#ff8c37]">
              <Clock3 className="h-4 w-4" />
              Launch Countdown
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
              距離 2026 秋季正式啟動
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-300 md:text-base">
              第一批社員、第一批作品、第一個真正上線的校園專案，正在倒數。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="flex h-24 min-w-0 flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-950/55 px-2 shadow-inner shadow-black/40 sm:h-28 sm:w-24"
            >
              <div className="pixel-heading text-2xl font-black text-white sm:text-4xl">
                {unit.value}
              </div>
              <div className="pixel-label mt-2 text-[0.65rem] font-black text-slate-400 sm:text-xs">
                {unit.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-xs font-bold text-slate-300 sm:text-sm">
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[#ec3750]" />
          目標日期：2026 / 09 / 01
        </span>
        <span className="hidden text-[#33d6a6] sm:inline">Asia/Taipei</span>
      </div>
    </div>
  );
}

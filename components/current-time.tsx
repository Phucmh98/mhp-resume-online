"use client";

import { useEffect, useState } from "react";
import { Doto } from "next/font/google";

const doto = Doto({
  subsets: ["latin"],
  weight: ["700"],
});

function TwoDots() {
  return (
    <div className="mx-0.5 sm:mx-1 flex flex-col gap-2 -translate-x-0.5 sm:-translate-x-0.75">
      <div className="w-0.5 h-0.5 bg-zinc-400 dark:bg-zinc-500"></div>
      <div className="w-0.5 h-0.5 bg-zinc-400 dark:bg-zinc-500"></div>
    </div>
  );
}

export function CurrentTime() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setTime(new Date()), 0);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      window.clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);

  if (!time) {
    return (
      <div className="flex items-center opacity-0">
        <div
          className={`${doto.className} text-[20px] sm:text-[24px] tracking-[0.15em] text-zinc-400 dark:text-zinc-500 font-bold`}
        >
          00.00.00
        </div>
      </div>
    );
  }

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className="flex items-center h-6">
      <div
        className={`${doto.className} text-[20px] sm:text-[24px] tracking-[0.15em] flex items-center text-zinc-400 dark:text-zinc-500 h-full font-bold`}
      >
        <span>{hours}</span>
        <TwoDots />
        <span>{minutes}</span>
        <TwoDots />
        <span>{seconds}</span>
      </div>
    </div>
  );
}

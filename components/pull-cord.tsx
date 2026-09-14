"use client";

import { PullCord } from "pullcord";
import "pullcord/pullcord.css";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export default function PullCordSection() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    audioRef.current = new Audio("/asset/sounds/toggle.mp3");
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const handlePull = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <>
      {/* Hint text & curved arrow pointing to the knob */}
      <div className="fixed top-29.5 right-[calc(clamp(1.5rem,5vw,4rem)+46px)] z-50 pointer-events-none select-none hidden sm:flex items-center gap-1.5 opacity-85 dark:opacity-80">
        <div className="flex flex-col items-end text-right font-handwriting text-[18px] sm:text-[20px] leading-[1.05] font-semibold text-zinc-500 dark:text-zinc-400 -rotate-6">
          <span>pull to</span>
          <span>{isDark ? "light mode!" : "dark mode!"}</span>
        </div>
        <svg
          width="52"
          height="40"
          viewBox="0 0 52 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-zinc-400 dark:text-zinc-500 shrink-0 transform -translate-y-1"
        >
          <path
            d="M 6 36 C 10 18, 22 10, 42 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M 30 3 L 45 10 L 32 18 Z" fill="currentColor" />
        </svg>
      </div>

      <div
        style={
          {
            "--pullcord-top": "-55px",
            "--pullcord-right": "clamp(1.5rem, 5vw, 4rem)",
            "--pullcord-z": "60",
            "--pullcord-ink": isDark
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(0, 0, 0, 0.55)",
          } as React.CSSProperties
        }
      >
        <PullCord
          onPull={handlePull}
          pulled={!isDark}
          ariaLabel="Toggle theme"
        />
      </div>
    </>
  );
}

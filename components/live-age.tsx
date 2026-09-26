"use client";

import React, { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { HyperText } from "@/components/ui/hyper-text";

export interface LiveAgeProps extends React.HTMLAttributes<HTMLParagraphElement> {
  birthDate?: string | Date;
  prefix?: string;
  decimals?: number;
}

const NUMBER_CHAR_SET = Object.freeze([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
]);

// Lấy tuổi ban đầu trên client qua useSyncExternalStore (không gây cascading render, không gọi setState trong effect)
const emptySubscribe = () => () => {};

export function LiveAge({
  birthDate = "1998-10-02T00:00:00",
  prefix = "Unlocked for",
  decimals = 8,
  className,
  ...props
}: LiveAgeProps) {
  const birthTimestamp = useMemo(
    () => new Date(birthDate).getTime(),
    [birthDate],
  );
  const msInYear = 365.2425 * 24 * 60 * 60 * 1000;

  // Trả về tuổi trên client, rỗng trên server (SSR)
  const initialAge = useSyncExternalStore(
    emptySubscribe,
    () => ((Date.now() - birthTimestamp) / msInYear).toFixed(decimals),
    () => "",
  );

  const [isIntroComplete, setIsIntroComplete] = useState<boolean>(false);
  const [liveAge, setLiveAge] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroComplete(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Chạy live counter sau khi giải mã xong
  useEffect(() => {
    if (!isIntroComplete) return;

    let frameId: number;
    const updateAge = () => {
      const now = Date.now();
      const currentAge = (now - birthTimestamp) / msInYear;
      setLiveAge(currentAge.toFixed(decimals));
      frameId = requestAnimationFrame(updateAge);
    };

    frameId = requestAnimationFrame(updateAge);
    return () => cancelAnimationFrame(frameId);
  }, [birthTimestamp, decimals, isIntroComplete, msInYear]);

  return (
    <p
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] 2xl:text-[13px] text-zinc-500 dark:text-zinc-400 font-normal leading-none whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {prefix && <span className="shrink-0 leading-none">{prefix}</span>}
      <span className="inline-flex items-center gap-1 font-mono tabular-nums text-zinc-700 dark:text-zinc-300 font-medium whitespace-nowrap leading-none shrink-0">
        {!initialAge ? (
          <span className="inline-flex items-center h-3.5 w-[10.5ch] sm:w-[11ch] rounded-xs bg-zinc-200 dark:bg-zinc-800 animate-pulse self-center" />
        ) : !isIntroComplete ? (
          <HyperText
            as="span"
            className="inline-flex items-center text-inherit font-inherit font-mono tabular-nums leading-none tracking-normal whitespace-nowrap"
            duration={1000}
            animateOnHover={false}
            characterSet={NUMBER_CHAR_SET}
          >
            {initialAge}
          </HyperText>
        ) : (
          <span className="leading-none whitespace-nowrap">
            {liveAge || initialAge}
          </span>
        )}
        <Star
          className="size-3 sm:size-3.5 shrink-0 -translate-y-px"
          color="#fbbf24"
          fill="#fbbf24"
        />
      </span>
    </p>
  );
}

export default LiveAge;

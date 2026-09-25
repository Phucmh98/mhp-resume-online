"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export interface LiveAgeProps extends React.HTMLAttributes<HTMLParagraphElement> {
  birthDate?: string | Date;
  prefix?: string;
  decimals?: number;
}

export function LiveAge({
  birthDate = "1998-10-02T00:00:00",
  prefix = "Unlocked for",
  decimals = 8,
  className,
  ...props
}: LiveAgeProps) {
  const [age, setAge] = useState<string>("");

  useEffect(() => {
    const birthTimestamp = new Date(birthDate).getTime();
    // Average Gregorian year accounting for leap years (365.2425 days in milliseconds)
    const msInYear = 365.2425 * 24 * 60 * 60 * 1000;

    let frameId: number;
    const updateAge = () => {
      const now = Date.now();
      const currentAge = (now - birthTimestamp) / msInYear;
      setAge(currentAge.toFixed(decimals));
      frameId = requestAnimationFrame(updateAge);
    };

    frameId = requestAnimationFrame(updateAge);

    return () => cancelAnimationFrame(frameId);
  }, [birthDate, decimals]);

  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] sm:text-[12px] 2xl:text-[13px] text-zinc-500 dark:text-zinc-400 font-normal leading-tight",
        className,
      )}
      {...props}
    >
      {prefix && <span className="shrink-0 leading-none">{prefix}</span>}
      <span
        suppressHydrationWarning
        className="inline-flex items-center gap-1 font-mono tabular-nums text-zinc-700 dark:text-zinc-300 font-medium whitespace-nowrap leading-none"
      >
        <span className="leading-none">{age || "27.98000000"}</span>
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

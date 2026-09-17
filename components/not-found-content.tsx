"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";
import HorizontalLine from "@/components/horizontal-line";

export default function NotFoundContent() {
  const router = useRouter();

  return (
    <div className="w-full flex-1 flex flex-col justify-between">
      {/* 404 Hero Section - vertically centered in available space */}
      <div className="relative px-4 sm:px-6 my-auto flex flex-col items-center text-center overflow-hidden">
        {/* Subtle decorative target / crosshair background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 dark:opacity-20">
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-dashed border-zinc-400 dark:border-zinc-50" />
          <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-zinc-300 dark:border-zinc-100" />
          <div className="absolute w-full h-px bg-linear-to-r from-transparent via-zinc-400 dark:via-zinc-50 to-transparent" />
          <div className="absolute h-full w-px bg-linear-to-b from-transparent via-zinc-400 dark:via-zinc-50 to-transparent" />
        </div>

        {/* Status Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono font-medium mb-4 backdrop-blur-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span>SIGNAL_LOST // ERROR 404</span>
        </div>

        {/* Big 404 Graphic with chromatic aberration glow */}
        <div className="relative z-10 select-none">
          <h1 className="text-7xl sm:text-9xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 [text-shadow:-2px_0_0_rgba(0,200,255,0.4),2px_0_0_rgba(255,80,0,0.4)] dark:[text-shadow:-3px_0_0_rgba(0,200,255,0.7),3px_0_0_rgba(255,80,0,0.7)] font-mono">
            404
          </h1>
        </div>

        {/* Handwritten humorous note */}
        <p className="relative z-10 font-handwriting text-xl sm:text-2xl text-zinc-500 dark:text-zinc-400 -rotate-2 mt-1 mb-3">
          &ldquo;It looks like you&apos;ve gone wrong way...&rdquo;
        </p>

        {/* Title and Explanation */}
        <h2 className="relative z-10 text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          OPPS! Page not found
        </h2>
        {/* Cat Fix GIF */}
        <div className="relative z-10 my-4 flex items-center justify-center">
          <Image
            src="/asset/images/cat_fix.gif"
            alt="Cat fixing"
            width={187}
            height={187}
            unoptimized
            className="rounded-lg object-contain"
          />
        </div>

        {/* Primary Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go back</span>
          </button>
        </div>
      </div>

      {/* Diagnostic System Info Footer - Always pinned at bottom */}
      <div className="w-full mt-auto shrink-0">
        <HorizontalLine bleed />
        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-500">
          <div className="flex items-center gap-2">
            <FileQuestion className="w-3.5 h-3.5" />
            <span>STATUS: 404_NOT_FOUND</span>
          </div>
          <div className="flex items-center gap-3">
            <span>HOST: mhp-portfolio</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400">SYSTEM: ONLINE</span>
          </div>
        </div>
        <HorizontalLine bleed />
        <div className="h-8 shrink-0" />
      </div>
    </div>
  );
}

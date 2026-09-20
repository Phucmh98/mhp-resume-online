import type { Metadata } from "next";
import { CurrentTime } from "@/components/current-time";
import HorizontalLine from "@/components/horizontal-line";
import NotFoundContent from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "404 - Page not found",
  description: "404 - Page not found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header with clock and system tag */}
      <div className="h-40 sm:h-48 relative shrink-0 flex items-end justify-between px-4 pb-3">
        <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500/80 animate-pulse" />
          <span>SYS://ERROR_DISPATCH</span>
        </div>
        <CurrentTime />
      </div>

      <HorizontalLine bleed />

      {/* Main 404 Content with bottom pinned footer */}
      <NotFoundContent />
    </div>
  );
}

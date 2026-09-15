"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CurrentTime } from "@/components/current-time";
import HorizontalLine from "@/components/horizontal-line";

export default function CommonSubpageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 20);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-56 relative shrink-0">
        <div className="absolute bottom-0 right-0 px-4 py-2">
          <CurrentTime />
        </div>
      </div>
      <HorizontalLine bleed />
      <div className="flex-1 w-full">{children}</div>
      <HorizontalLine bleed />
      <div className="h-16 shrink-0" />
    </div>
  );
}

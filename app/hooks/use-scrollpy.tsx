"use client";

import { useEffect, useMemo, useState } from "react";

export default function useScrollSpy(
  ids: string[],
  options?: IntersectionObserverInit,
): string[] {
  const cleanIds = useMemo(
    () => ids.map((id) => id.replace(/^#/, "")),
    [ids],
  );
  const [activeId, setActiveId] = useState<string>(cleanIds[0] || "");

  const rootMargin = options?.rootMargin ?? "-10% 0px -40% 0px";

  useEffect(() => {
    if (typeof window === "undefined" || cleanIds.length === 0) return;

    // Track intersection positions of sections
    const visibleSections = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.boundingClientRect.top);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        if (visibleSections.size > 0) {
          // Find the section whose top is closest to the natural reading line (150px from top)
          let bestId = "";
          let minDistance = Infinity;

          visibleSections.forEach((top, id) => {
            const distance = Math.abs(top - 150);
            if (distance < minDistance) {
              minDistance = distance;
              bestId = id;
            }
          });

          if (bestId) {
            setActiveId(bestId);
          }
        } else {
          // Fallback when scrolling fast between sections
          let lastAbove = cleanIds[0];
          for (const id of cleanIds) {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top <= 250) {
              lastAbove = id;
            }
          }
          setActiveId(lastAbove);
        }
      },
      {
        rootMargin,
        threshold: options?.threshold ?? [0, 0.25, 0.5, 0.75, 1],
      },
    );

    cleanIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    // Backup scroll listener for instant top/bottom snaps
    const handleScroll = () => {
      const scrollY =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        0;

      // At top of page: snap to first section
      if (scrollY < 80) {
        setActiveId(cleanIds[0]);
        return;
      }

      // At bottom of page: snap to last section
      if (
        window.innerHeight + scrollY >=
        document.documentElement.scrollHeight - 30
      ) {
        setActiveId(cleanIds[cleanIds.length - 1]);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [cleanIds, rootMargin, options?.threshold]);

  return activeId ? [activeId] : [cleanIds[0] || ""];
}

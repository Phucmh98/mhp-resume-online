"use client";

import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import useScrollSpy from "@/app/hooks/use-scrollpy";

export interface TocItem {
  title: string;
  url: string;
  items?: TocItem[];
}

export const defaultResumeSections: TocItem[] = [
  { title: "About", url: "#about" },
  { title: "Experience", url: "#experience" },
  { title: "Projects", url: "#projects" },
  { title: "GitHub Activity", url: "#github" },
  { title: "Technologies", url: "#technologies" },
  { title: "Blogs", url: "#blog" },
  { title: "Gallery", url: "#gallery" },
];

export interface TableOfContentDesktopProps {
  items?: TocItem[];
  toc?: TocItem[];
  post?: { toc?: TocItem[] };
  className?: string;
}

/**
 * Utility to extract all URLs from TocItem tree
 */
function extractUrls(toc: TocItem[]): string[] {
  const urls: string[] = [];
  const traverse = (items: TocItem[] = []) => {
    items.forEach((item) => {
      if (item.url) {
        urls.push(item.url.replace(/^#/, ""));
      }
      if (item.items && item.items.length > 0) {
        traverse(item.items);
      }
    });
  };
  traverse(toc);
  return urls;
}

/**
 * Utility to flatten TocItem tree into a flat array with levels
 */
function flattenToc(
  toc: TocItem[],
): { url: string; title: string; level: number }[] {
  const flat: { url: string; title: string; level: number }[] = [];
  const flatten = (items: TocItem[], level: number = 0) => {
    items.forEach((item) => {
      flat.push({ url: item.url, title: item.title, level });
      if (item.items && item.items.length > 0) {
        flatten(item.items, level + 1);
      }
    });
  };
  flatten(toc);
  return flat;
}

export function TableOfContentDesktop({
  items,
  toc,
  post,
  className,
}: TableOfContentDesktopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgPath, setSvgPath] = useState("");
  const [activeDot, setActiveDot] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [containerHeight, setContainerHeight] = useState(0);

  const [direction, setDirection] = useState<"up" | "down">("down");
  const prevYRef = useRef<number | null>(null);

  const tocItems = useMemo(
    () => items ?? toc ?? post?.toc ?? defaultResumeSections,
    [items, toc, post],
  );

  const urls = useMemo(() => extractUrls(tocItems), [tocItems]);
  const activeIds = useScrollSpy(urls);
  const flatTocArray = useMemo(() => flattenToc(tocItems), [tocItems]);

  // Position the single running active dot & detect motion direction
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || flatTocArray.length === 0) {
      setActiveDot(null);
      return;
    }

    const itemElements = container.querySelectorAll(".toc-item");
    if (itemElements.length === 0) return;

    const currentActiveId = activeIds[0];
    let activeIndex = -1;

    if (currentActiveId) {
      activeIndex = flatTocArray.findIndex(
        (t) => t.url.replace(/^#/, "") === currentActiveId,
      );
    }

    // Default to first item if none active yet
    if (activeIndex === -1) {
      activeIndex = 0;
    }

    const activeEl = itemElements[activeIndex] as HTMLElement;
    if (activeEl) {
      const data = flatTocArray[activeIndex];
      const y = activeEl.offsetTop + activeEl.offsetHeight / 2;
      const x = data.level * 8 + 4;

      if (prevYRef.current !== null) {
        if (y > prevYRef.current) {
          setDirection("down");
        } else if (y < prevYRef.current) {
          setDirection("up");
        }
      }
      prevYRef.current = y;

      setActiveDot((prev) => {
        if (prev && prev.x === x && prev.y === y) return prev;
        return { x, y };
      });
    }
  }, [activeIds, flatTocArray]);

  // Build the vertical SVG connecting path
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updatePath = () => {
      const itemElements = container.querySelectorAll(".toc-item");
      let path = "";
      itemElements.forEach((item, index) => {
        const element = item as HTMLElement;
        const data = flatTocArray[index];
        const styles = getComputedStyle(element);
        const x = data.level * 8 + 4;
        const top = element.offsetTop + parseFloat(styles.paddingTop);
        const bottom =
          element.offsetTop +
          element.offsetHeight -
          parseFloat(styles.paddingBottom);

        if (index === 0) {
          path += `M ${x} ${top} L ${x} ${bottom}`;
        } else {
          const prevElement = itemElements[index - 1] as HTMLElement;
          const prevData = flatTocArray[index - 1];
          const prevYEnd =
            prevElement.offsetTop +
            prevElement.offsetHeight -
            parseFloat(getComputedStyle(prevElement).paddingBottom);
          const prevX = prevData.level * 8 + 4;

          if (prevX === x) {
            path += ` L ${x} ${top}`;
          } else {
            const gap = top - prevYEnd;
            const radius = Math.min(4, gap / 2);
            path += ` C ${prevX} ${prevYEnd + radius} ${x} ${top - radius} ${x} ${top}`;
          }
          path += ` L ${x} ${bottom}`;
        }
      });
      setSvgPath(path);
      setContainerHeight(container.offsetHeight);
    };

    updatePath();
    const observer = new ResizeObserver(updatePath);
    observer.observe(container);
    return () => observer.disconnect();
  }, [flatTocArray]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    if (url.startsWith("#")) {
      e.preventDefault();
      const targetId = url.slice(1);
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", url);
      }
    }
  };

  if (flatTocArray.length === 0) return null;

  return (
    <nav className={cn("relative flex flex-col gap-2 select-none", className)}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 pl-4 mb-1">
        On this page
      </div>
      <ScrollArea className="flex max-h-[calc(100vh-12rem)] flex-col overflow-auto pt-1 pr-2">
        <div ref={containerRef} className="relative flex flex-col">
          {/* Vertical track line */}
          <svg className="absolute left-0 top-0 h-full w-full overflow-visible pointer-events-none">
            <path
              d={svgPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-zinc-300/60 dark:text-zinc-700/60"
            />
          </svg>

          {/* Trailing comet tail behind the dot */}
          {activeDot && (
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-0 top-0 w-[1.5px] rounded-full pointer-events-none transition-transform duration-500 ease-out z-10",
                direction === "down"
                  ? "bg-linear-to-t from-zinc-900 dark:from-zinc-100 to-transparent"
                  : "bg-linear-to-b from-zinc-900 dark:from-zinc-100 to-transparent",
              )}
              style={{
                height: 18,
                transform: `translate3d(${activeDot.x - 0.75}px, ${direction === "down" ? activeDot.y - 18 : activeDot.y}px, 0)`,
              }}
            />
          )}

          {/* Main head dot (compact 5px, no shadow, smooth GPU translate3d motion) */}
          {activeDot && (
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 size-1.25 rounded-full bg-zinc-900 dark:bg-zinc-100 transition-transform duration-400 ease-out z-20 pointer-events-none"
              style={{
                transform: `translate3d(${activeDot.x - 2.5}px, ${activeDot.y - 2.5}px, 0)`,
              }}
            />
          )}

          {/* Section Items (no static dots) */}
          {flatTocArray.map((toc, index) => {
            const cleanUrl = toc.url.replace(/^#/, "");
            const isActive = activeIds.includes(cleanUrl);

            return (
              <div
                key={index}
                className="toc-item relative z-10 py-1.5 flex items-center"
                style={{ paddingLeft: toc.level * 8 + 16 }}
              >
                <Link
                  className={cn(
                    "text-[12px] font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-100",
                    isActive
                      ? "text-zinc-900 dark:text-zinc-100 font-semibold"
                      : "text-zinc-500 dark:text-zinc-400",
                  )}
                  href={toc.url}
                  onClick={(e) => handleLinkClick(e, toc.url)}
                >
                  {toc.title}
                </Link>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </nav>
  );
}

export default TableOfContentDesktop;

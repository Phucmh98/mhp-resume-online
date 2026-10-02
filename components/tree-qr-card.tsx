"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { MorphIcon } from "morphicons/react";
import { Aperture, Check } from "lucide";
import { cn } from "@/lib/utils";
import Spinner from "@/components/ui/spinner";

interface TreeQRCardProps {
  className?: string;
  /**
   * Query string slug or custom URL encoded query for the tree
   * Default is LinkedIn QR code
   */
  query?: string;
  /**
   * Link hoặc nội dung sẽ được copy vào clipboard khi click
   */
  copyText?: string;
  /**
   * Hỗ trợ truyền qua href nếu có
   */
  href?: string;
}

// Target URL dự phòng nếu không truyền qua prop
export const TREE_QR_TARGET_URL = "https://your-link-here.com";

type FollowerPhase = "spinning" | "checked" | "exiting";

interface FollowerState {
  id: number;
  phase: FollowerPhase;
}

export function TreeQRCard({
  className = "",
  query = "MDNodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vbWhwaHVjOTgv",
  copyText,
  href,
}: TreeQRCardProps) {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(!!query);
  const [hasError, setHasError] = useState(!query);
  const [prevQuery, setPrevQuery] = useState(query);

  // State đếm số lần click (0 = ban đầu, 1 = lẻ hiển thị xoay, 2 = chẵn ẩn xoay...)
  const [clickCount, setClickCount] = useState(0);
  const [follower, setFollower] = useState<FollowerState | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 850, damping: 45 });
  const springY = useSpring(mouseY, { stiffness: 850, damping: 45 });
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  if (query !== prevQuery) {
    setPrevQuery(query);
    setIsLoading(!!query);
    setHasError(!query);
  }

  // Lắng nghe chuột di chuyển trên trang để icon bám theo chuột
  useEffect(() => {
    if (!follower) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [follower, mouseX, mouseY]);

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  // Hàm kích hoạt hiệu ứng khi click
  const triggerAction = (clientX: number, clientY: number) => {
    setClickCount((prev) => {
      const nextCount = prev + 1;

      // Số lẻ (1, 3, 5, ...): hiển thị xoay Aperture -> Check và copy link
      if (nextCount % 2 !== 0) {
        const textToCopy = copyText || href || TREE_QR_TARGET_URL;
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          navigator.clipboard.writeText(textToCopy).catch(() => {});
        }

        clearAllTimers();

        // Định vị trí chuột ngay tức thì tại vị trí click (jump để không bị lướt từ góc)
        mouseX.set(clientX);
        mouseY.set(clientY);
        springX.jump(clientX);
        springY.jump(clientY);

        const newId = Date.now();
        setFollower({ id: newId, phase: "spinning" });

        // 1. Xoay Aperture 1s ("Copying link...")
        const timerCheck = setTimeout(() => {
          setFollower((p) =>
            p?.id === newId ? { ...p, phase: "checked" } : p,
          );
        }, 1000);

        // 2. Sang Check 1s ("Link copied!")
        const timerExit = setTimeout(() => {
          setFollower((p) =>
            p?.id === newId ? { ...p, phase: "exiting" } : p,
          );
        }, 2000);

        // 3. Biến mất hoàn toàn và gỡ bỏ khỏi DOM
        const timerFinish = setTimeout(() => {
          setFollower((p) => (p?.id === newId ? null : p));
          setClickCount(0); // Reset về 0 để lần click kế tiếp luôn là 1 (số lẻ)
        }, 2300);

        timersRef.current.push(timerCheck, timerExit, timerFinish);
      } else {
        // Số chẵn (2, 4, 6, ...): hủy xoay
        clearAllTimers();
        setFollower(null);
        setClickCount(0);
      }

      return nextCount;
    });
  };

  // Khi iframe tải xong: gắn listener nội bộ để vừa xoay 3D được, vừa bắt được click
  const handleIframeLoad = () => {
    setIsLoading(false);
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        let startX = 0;
        let startY = 0;
        let isDown = false;

        doc.addEventListener("pointerdown", (e: PointerEvent) => {
          startX = e.clientX;
          startY = e.clientY;
          isDown = true;
        });

        doc.addEventListener("pointerup", (e: PointerEvent) => {
          if (!isDown) return;
          isDown = false;
          const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
          // Khoảng cách kéo < 8px thì là click thực thụ (không phải kéo xoay cây 3D)
          if (dist < 8) {
            const rect = iframeRef.current?.getBoundingClientRect();
            const cx = rect ? rect.left + e.clientX * 0.7 : e.clientX;
            const cy = rect ? rect.top + e.clientY * 0.7 : e.clientY;
            triggerAction(cx, cy);
          }
        });

        doc.addEventListener("pointermove", (e: PointerEvent) => {
          const rect = iframeRef.current?.getBoundingClientRect();
          const cx = rect ? rect.left + e.clientX * 0.7 : e.clientX;
          const cy = rect ? rect.top + e.clientY * 0.7 : e.clientY;
          mouseX.set(cx);
          mouseY.set(cy);
        });
      }
    } catch {
      // Không can thiệp nếu gặp lỗi sandbox
    }
  };

  return (
    <>
      <div
        onClick={(e) => triggerAction(e.clientX, e.clientY)}
        role="button"
        tabIndex={0}
        className={cn(
          "w-37.5 h-42.5 rounded overflow-hidden relative flex items-center justify-center bg-[#f6f1e7] dark:bg-[#1a1918] border border-zinc-200/60 dark:border-zinc-800/60 shadow-md cursor-pointer select-none outline-none",
          isLoading && !hasError && "animate-pulse",
          className,
        )}
      >
        {hasError ? (
          <div className="size-full flex items-center justify-center text-muted-foreground">
            <span className="text-xs font-medium">Failed to load</span>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={`/api/treeqr?q=${encodeURIComponent(query)}`}
            title="Magic Tree QR"
            className={cn(
              "w-70 h-70 shrink-0 border-0 bg-transparent scale-[0.7] origin-center translate-y-2 pointer-events-auto",
              isLoading && "scale-[0.68] blur-xl grayscale",
            )}
            style={{
              transition: "filter 700ms ease, transform 300ms ease",
            }}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            onLoad={handleIframeLoad}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        )}

        {isLoading && !hasError && (
          <div
            className={cn(
              "absolute left-0 top-0 flex size-full items-center justify-center backdrop-blur-md bg-white/20 dark:bg-black/20",
            )}
          >
            <Spinner className="size-6 text-zinc-600 dark:text-zinc-300" />
          </div>
        )}
      </div>

      {/* Mouse follower badge: cách chuột bottom right 10px, gắn vào body */}
      {mounted &&
        follower &&
        typeof document !== "undefined" &&
        createPortal(
          <motion.div
            layout
            style={{
              x: springX,
              y: springY,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              follower.phase === "exiting"
                ? { scale: 0.7, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "fixed top-0 left-0 translate-x-[7px] translate-y-[7px] pointer-events-none z-9999",
              "flex items-center gap-2 pl-2.5 pr-3.5 py-1 h-7.5 rounded-full",
              "bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md",
              "border shadow-lg transition-colors duration-300",
              follower.phase === "checked"
                ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                : "border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200",
            )}
          >
            <motion.div
              animate={
                follower.phase === "spinning" ? { rotate: 360 } : { rotate: 0 }
              }
              transition={
                follower.phase === "spinning"
                  ? { repeat: Infinity, duration: 0.8, ease: "linear" }
                  : { duration: 0.35, ease: "easeOut" }
              }
              className="flex items-center justify-center shrink-0"
            >
              <MorphIcon
                icon={follower.phase === "spinning" ? Aperture : Check}
                spring="smooth"
                size={16}
                strokeWidth={2.4}
              />
            </motion.div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={follower.phase === "spinning" ? "copying" : "copied"}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
                className="text-xs font-medium tracking-tight whitespace-nowrap select-none"
              >
                {follower.phase === "spinning"
                  ? "Copying link..."
                  : "Link copied!"}
              </motion.span>
            </AnimatePresence>
          </motion.div>,
          document.body,
        )}
    </>
  );
}

export default TreeQRCard;

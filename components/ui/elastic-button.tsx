"use client";

import React, { useRef, useState, useEffect } from "react";
import Image, { type StaticImageData } from "next/image";
import {
  motion,
  useAnimation,
  AnimatePresence,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

export type ElasticButtonVariant =
  "default" | "primary" | "secondary" | "outline" | "ghost" | "unstyled";

export type ElasticButtonSize = "sm" | "md" | "lg" | "icon" | "custom";

export interface ElasticButtonProps extends Omit<
  HTMLMotionProps<"button">,
  "ref" | "children"
> {
  children?: React.ReactNode;
  /** Đường dẫn ảnh thứ nhất */
  src1?: string | StaticImageData;
  /** Đường dẫn ảnh thứ hai (ấn vào sẽ đổi qua lại giữa ảnh 1 và ảnh 2) */
  src2?: string | StaticImageData;
  /** Text alt mô tả ảnh */
  alt?: string;
  /** Class tùy biến riêng cho thẻ img */
  imageClassName?: string;
  /** Ảnh hiển thị (1 hoặc 2) nếu muốn điều khiển từ state ngoài */
  activeImage?: 1 | 2;
  /** Callback khi đổi ảnh giữa 1 và 2 */
  onImageToggle?: (nextImage: 1 | 2) => void;

  /** Scale khi ấn và giữ chuột. Mặc định là 0.90 (thu nhỏ lại) */
  pressedScale?: number;
  /** Scale khi nhả chuột. Mặc định là 1.10 (phóng to ra tý kèm nảy spring) */
  popScale?: number;
  /** Scale khi hover bình thường. Mặc định là 1.03 */
  hoverScale?: number;
  /** Bật hiệu ứng outline lan tỏa ra ngoài khi ấn chuột (mặc định: true) */
  enableOutlineRipple?: boolean;
  /** Tùy biến class cho outline lan tỏa (màu sắc, border, shadow glow...) */
  rippleClassName?: string;
  /** Số lượng vòng outline lan tỏa ra ngoài (mặc định: 6 vòng) */
  rippleCount?: number;
  /** Khoảng trễ giữa các vòng outline (giây, mặc định tự tính = rippleDuration / 3 để khi vòng 1 mất thì vòng 4 chen vô) */
  rippleDelayStep?: number;
  /** Độ thụt vào bên trong của outline khi bắt đầu lan tỏa (pixel, mặc định: 4px để chạy từ dưới ảnh bung ra) */
  rippleInset?: number;
  /** Khoảng cách lan tỏa đều ra 4 cạnh (pixel, mặc định: 18px) */
  rippleSpread?: number;
  /** Thời gian lan tỏa của mỗi vòng outline (giây, mặc định: 0.28s để thấy rõ nét) */
  rippleDuration?: number;
  /** Biến thể giao diện */
  variant?: ElasticButtonVariant;
  /** Kích thước nút */
  size?: ElasticButtonSize;
  /** Cho phép render dạng thẻ div thay vì button khi cần bọc component phức tạp */
  asDiv?: boolean;

  /** Bật viền khi đang hiển thị ảnh 2 (mặc định: true) */
  enableImg2Border?: boolean;
  /** Tùy biến class cho viền ảnh 2 (mặc định: "border-emerald-500 dark:border-emerald-400") */
  img2BorderClassName?: string;
  /** Độ dày viền khi ở ảnh 2 (pixel, mặc định: 2) */
  img2BorderWidth?: number;
  /** Khoảng cách offset ra ngoài của viền ảnh 2 (pixel, mặc định: 3) */
  img2BorderOffset?: number;
  /** Bật text gợi ý kèm mũi tên uốn cong chỉ vào nút (mặc định: false) */
  showHint?: boolean;
  /** Nội dung text gợi ý ở hình 1 (mặc định: "psst, click me!") */
  hintText?: string;
  /** Nội dung text gợi ý ở hình 2 (mặc định: "you found me!") */
  hintTextImg2?: string;
  /** Class tùy biến cho container gợi ý */
  hintClassName?: string;
  /** Bật âm thanh bubble-pop khi chuyển sang hình 2 (mặc định: true) */
  enablePopSound?: boolean;
  /** Đường dẫn file âm thanh khi chuyển sang hình 2 (mặc định: "/asset/sounds/bubble-pop.mp3") */
  popSoundSrc?: string;
  /** Thời gian trễ trước khi phát âm thanh sau khi chuyển ảnh (ms, mặc định: 350ms khớp khi hình 2 hiện xong) */
  popSoundDelay?: number;
  /** Bật âm thanh whoosh khi chuyển từ hình 2 về hình 1 (mặc định: true) */
  enableWhooshSound?: boolean;
  /** Đường dẫn file âm thanh khi chuyển về hình 1 (mặc định: "/asset/sounds/whoosh-effect.mp3") */
  whooshSoundSrc?: string;
}

const variantStyles: Record<ElasticButtonVariant, string> = {
  default:
    "bg-zinc-900 text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-md border border-zinc-700/50 dark:border-zinc-300/50",
  primary:
    "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20 border border-emerald-500/40",
  secondary:
    "bg-[#f6f1e7] text-zinc-800 hover:bg-[#ece6db] dark:bg-[#1f1e1d] dark:text-zinc-200 dark:hover:bg-[#282725] border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm",
  outline:
    "bg-transparent text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/60",
  ghost:
    "bg-transparent text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/40",
  unstyled: "",
};

const sizeStyles: Record<ElasticButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
  md: "px-5 py-2.5 text-sm font-medium rounded-lg gap-2",
  lg: "px-6 py-3.5 text-base font-semibold rounded-xl gap-2.5",
  icon: "w-10 h-10 p-0 rounded-lg justify-center",
  custom: "",
};

const defaultRippleStyles: Record<ElasticButtonVariant, string> = {
  primary: "border-emerald-500 dark:border-emerald-400",
  secondary: "border-zinc-400 dark:border-zinc-400",
  default: "border-zinc-700 dark:border-zinc-300",
  outline: "border-zinc-400 dark:border-zinc-500",
  ghost: "border-zinc-300 dark:border-zinc-600",
  unstyled: "border-emerald-500 dark:border-emerald-400",
};

interface RippleItem {
  id: number;
}

export const ElasticButton = React.forwardRef<
  HTMLButtonElement,
  ElasticButtonProps
>(
  (
    {
      children,
      className,
      src1,
      src2,
      alt,
      imageClassName,
      activeImage,
      onImageToggle,
      pressedScale = 0.9,
      popScale = 1.1,
      hoverScale = 1.03,
      enableOutlineRipple = true,
      rippleClassName,
      rippleCount = 6,
      rippleDelayStep,
      rippleInset = 4,
      rippleSpread = 18,
      rippleDuration = 0.28,
      variant = "default",
      size = "md",
      asDiv = false,
      enableImg2Border = true,
      img2BorderClassName,
      img2BorderWidth = 2,
      img2BorderOffset = 3,
      showHint = false,
      hintText = "psst, click me!",
      hintTextImg2 = "you found me!",
      hintClassName,
      enablePopSound = true,
      popSoundSrc = "/asset/sounds/bubble-pop.mp3",
      popSoundDelay = 0,
      enableWhooshSound = true,
      whooshSoundSrc = "/asset/sounds/whoosh-effect.mp3",
      disabled,
      onClick,
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      onPointerEnter,
      onPointerCancel,
      ...props
    },
    ref,
  ) => {
    const controls = useAnimation();
    const isHoveredRef = useRef(false);
    const isPressedRef = useRef(false);
    const [isHolding, setIsHolding] = useState(false);
    const [ripples, setRipples] = useState<RippleItem[]>([]);

    // Quản lý trạng thái chuyển đổi giữa ảnh 1 và ảnh 2
    const [internalImage, setInternalImage] = useState<1 | 2>(1);
    const currentImage = activeImage ?? internalImage;
    const hasImages = Boolean(src1);
    const lastTriggerRef = useRef(0);

    const popAudioRef = useRef<HTMLAudioElement | null>(null);
    const whooshAudioRef = useRef<HTMLAudioElement | null>(null);
    const soundTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastSoundPlayedRef = useRef(0);
    const lastClickTimeRef = useRef(0);
    const isFirstMountRef = useRef(true);
    const prevImageRef = useRef<1 | 2>(currentImage);

    // Dừng âm thanh đang phát để tránh bị chồng chéo
    const stopAllSounds = () => {
      if (popAudioRef.current) {
        popAudioRef.current.pause();
        popAudioRef.current.currentTime = 0;
      }
      if (whooshAudioRef.current) {
        whooshAudioRef.current.pause();
        whooshAudioRef.current.currentTime = 0;
      }
    };

    // Khởi tạo audio một lần ở client
    useEffect(() => {
      if (typeof window !== "undefined") {
        if (enablePopSound && popSoundSrc) {
          popAudioRef.current = new Audio(popSoundSrc);
          popAudioRef.current.preload = "auto";
        }
        if (enableWhooshSound && whooshSoundSrc) {
          whooshAudioRef.current = new Audio(whooshSoundSrc);
          whooshAudioRef.current.preload = "auto";
        }
      }
      return () => {
        if (soundTimerRef.current) {
          clearTimeout(soundTimerRef.current);
          soundTimerRef.current = null;
        }
        if (popAudioRef.current) {
          popAudioRef.current.pause();
          popAudioRef.current = null;
        }
        if (whooshAudioRef.current) {
          whooshAudioRef.current.pause();
          whooshAudioRef.current = null;
        }
      };
    }, [enablePopSound, popSoundSrc, enableWhooshSound, whooshSoundSrc]);

    const playBubblePop = () => {
      stopAllSounds();
      lastSoundPlayedRef.current = Date.now();
      if (popAudioRef.current) {
        popAudioRef.current.play().catch(() => {});
      }
    };

    const playWhoosh = () => {
      stopAllSounds();
      lastSoundPlayedRef.current = Date.now();
      if (whooshAudioRef.current) {
        whooshAudioRef.current.play().catch(() => {});
      }
    };

    // Theo dõi đổi ảnh: 1 -> 2 phát pop, 2 -> 1 phát whoosh (không delay), chống spam
    useEffect(() => {
      if (isFirstMountRef.current) {
        isFirstMountRef.current = false;
        prevImageRef.current = currentImage;
        return;
      }

      if (soundTimerRef.current) {
        clearTimeout(soundTimerRef.current);
        soundTimerRef.current = null;
      }

      // Hình 1 -> Hình 2: Bubble Pop
      if (prevImageRef.current === 1 && currentImage === 2) {
        if (enablePopSound) {
          if (popSoundDelay > 0) {
            soundTimerRef.current = setTimeout(() => {
              playBubblePop();
            }, popSoundDelay);
          } else {
            playBubblePop();
          }
        }
      }
      // Hình 2 -> Hình 1: Whoosh effect (ngay tức thì, không delay)
      else if (prevImageRef.current === 2 && currentImage === 1) {
        if (enableWhooshSound) {
          playWhoosh();
        }
      }

      prevImageRef.current = currentImage;
    }, [currentImage, enablePopSound, popSoundDelay, enableWhooshSound]);

    const triggerRipple = () => {
      const now = Date.now();
      // Chặn spam nhấp chuột siêu tốc (< 140ms)
      if (now - lastTriggerRef.current < 140) return;
      lastTriggerRef.current = now;

      // Kích hoạt đợt sóng mới (tối đa 1 đợt sóng cũ đang mờ + 1 đợt sóng mới)
      setRipples((prev) => [...prev.slice(-1), { id: now }]);
    };

    const removeRipple = (id: number) => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const now = Date.now();
      // Chặn click spam / nhấp đúp quá nhanh (< 400ms)
      if (now - lastClickTimeRef.current < 400) {
        e.preventDefault();
        return;
      }
      lastClickTimeRef.current = now;

      if (src1 && src2) {
        setInternalImage((prev) => {
          const next = prev === 1 ? 2 : 1;
          onImageToggle?.(next);
          return next;
        });
      }
      onClick?.(e);
    };

    const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
      isHoveredRef.current = true;
      if (!isPressedRef.current && !disabled) {
        controls.start({
          scale: hoverScale,
          transition: { type: "spring", stiffness: 400, damping: 20 },
        });
      }
      onPointerEnter?.(e);
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
      isHoveredRef.current = false;
      isPressedRef.current = false;
      setIsHolding(false);
      if (!disabled) {
        controls.start({
          scale: 1,
          transition: { type: "spring", stiffness: 400, damping: 22 },
        });
      }
      onPointerLeave?.(e);
    };

    // Ấn chuột xuống: thu nhỏ lại (scale: pressedScale) và GIỮ NGUYÊN SCALE NHỎ chừng nào còn đè chuột.
    // Trong suốt lúc giữ: KHÔNG phát sóng lan tỏa, giữ trạng thái tĩnh.
    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (e.button !== undefined && e.button !== 0) return;

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}

      isPressedRef.current = true;
      setIsHolding(true);

      // Thu nhỏ và giữ nguyên kích thước nhỏ
      controls.stop();
      controls.start({
        scale: pressedScale,
        transition: {
          type: "spring",
          stiffness: 600,
          damping: 25,
        },
      });

      onPointerDown?.(e);
    };

    // Nhả chuột: kích hoạt 6 vòng outline lan tỏa, bung nảy to (popScale) và chuyển về settleScale
    const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {}

      const wasHolding = isPressedRef.current;
      isPressedRef.current = false;
      setIsHolding(false);

      if (wasHolding) {
        // Kích hoạt 6 vòng outline lan tỏa ngay khi nhả chuột
        if (enableOutlineRipple) {
          triggerRipple();
        }

        const settleScale = isHoveredRef.current ? hoverScale : 1;
        controls.start({
          scale: [pressedScale, popScale, settleScale],
          transition: {
            duration: 0.36,
            times: [0, 0.38, 1],
            ease: ["easeOut", "easeInOut"],
          },
        });
      }

      onPointerUp?.(e);
    };

    const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {}
      isPressedRef.current = false;
      setIsHolding(false);
      controls.start({
        scale: 1,
        transition: { type: "spring", stiffness: 400, damping: 20 },
      });
      onPointerCancel?.(e);
    };

    const baseClass = cn(
      "relative inline-flex items-center justify-center select-none cursor-pointer outline-none transition-colors",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
      hasImages ? "p-0 overflow-visible" : sizeStyles[size],
      hasImages && variant === "default"
        ? "bg-transparent border-0 shadow-none"
        : variantStyles[variant],
      className,
    );

    const innerContent = (
      <>
        {/* Chuỗi 6 outline gối đầu liên tục: nằm DƯỚI ảnh (z-0), bung từ phía trong dưới ảnh ra ngoài */}
        {enableOutlineRipple &&
          ripples.map((ripple) =>
            Array.from({ length: rippleCount }).map((_, index) => {
              // Khoảng trễ gối đầu nhịp nhàng giữa 6 vòng
              const step = rippleDelayStep ?? 0.055;
              const delay = index * step;

              return (
                <motion.span
                  key={`${ripple.id}-${index}`}
                  className={cn(
                    "absolute pointer-events-none rounded-[inherit] border z-0",
                    rippleClassName || defaultRippleStyles[variant],
                  )}
                  initial={{
                    top: rippleInset,
                    left: rippleInset,
                    right: rippleInset,
                    bottom: rippleInset,
                    opacity: 0.85,
                  }}
                  animate={{
                    top: -rippleSpread,
                    left: -rippleSpread,
                    right: -rippleSpread,
                    bottom: -rippleSpread,
                    opacity: [0.85, 0.85, 0.55, 0.2, 0],
                  }}
                  transition={{
                    duration: rippleDuration,
                    delay,
                    ease: "easeOut",
                    opacity: {
                      duration: rippleDuration,
                      delay,
                      times: [0, 0.28, 0.62, 0.88, 1],
                      ease: "easeOut",
                    },
                  }}
                  onAnimationComplete={() => {
                    if (index === rippleCount - 1) {
                      removeRipple(ripple.id);
                    }
                  }}
                />
              );
            }),
          )}

        {hasImages ? (
          <motion.div
            animate={
              currentImage === 2
                ? {
                    rotate: [0, -2.2, 1.8, -0.8, 0.3, 0],
                    x: [0, -2, 1.6, -0.6, 0.2, 0],
                    skewX: [0, 1.2, -1, 0.5, -0.2, 0],
                    scale: [1, 0.985, 1.018, 0.996, 1.002, 1],
                  }
                : {
                    rotate: 0,
                    x: 0,
                    skewX: 0,
                    scale: 1,
                  }
            }
            transition={{
              duration: 0.45,
              ease: "easeOut",
              times: [0, 0.22, 0.48, 0.72, 0.88, 1],
            }}
            className="relative z-10 size-full overflow-hidden rounded-[inherit] pointer-events-none select-none"
          >
            {src1 && (
              <Image
                src={src1}
                alt={alt || "Image 1"}
                fill
                unoptimized
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className={cn(
                  "size-full object-cover transition-all duration-400 ease-in-out rounded-[inherit] pointer-events-none select-none",
                  currentImage === 1
                    ? "opacity-100 scale-100 z-10 filter-none"
                    : "opacity-0 scale-95 z-0 filter blur-[2px]",
                  imageClassName,
                )}
              />
            )}
            {src2 && (
              <Image
                src={src2}
                alt={alt || "Image 2"}
                fill
                unoptimized
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className={cn(
                  "size-full object-cover transition-all duration-400 ease-in-out rounded-[inherit] pointer-events-none select-none",
                  currentImage === 2
                    ? "opacity-100 scale-100 z-10 filter-none"
                    : "opacity-0 scale-95 z-0 filter blur-[2px]",
                  imageClassName,
                )}
              />
            )}
            {children}
          </motion.div>
        ) : (
          <div className="relative z-10 size-full flex items-center justify-center pointer-events-none select-none">
            {children}
          </div>
        )}

        {/* Viền 2px xanh offset ra 3px/5px khi qua ảnh 2 (sắc nét, không có shadow) */}
        {hasImages && enableImg2Border && (
          <motion.span
            initial={false}
            animate={{
              opacity: currentImage === 2 ? 1 : 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            style={{
              top: -img2BorderOffset,
              left: -img2BorderOffset,
              right: -img2BorderOffset,
              bottom: -img2BorderOffset,
              borderWidth: img2BorderWidth,
            }}
            className={cn(
              "absolute rounded-[inherit] border-solid pointer-events-none z-20",
              img2BorderClassName ||
                "border-emerald-500 dark:border-emerald-400",
            )}
          />
        )}
      </>
    );

    const hintElement = showHint ? (
      <div
        className={cn(
          "absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 pointer-events-none select-none hidden md:flex items-center gap-1.5 whitespace-nowrap opacity-85 dark:opacity-80 z-30",
          hintClassName,
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, y: 4, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -3, scale: 0.94 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex items-center gap-1.5"
          >
            <span className="font-handwriting text-[18px] sm:text-[20px] font-semibold text-zinc-500 dark:text-zinc-400 -rotate-3 leading-none inline-block">
              {currentImage === 2 ? hintTextImg2 : hintText}
            </span>
            <svg
              width="44"
              height="24"
              viewBox="0 0 44 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-zinc-400 dark:text-zinc-500 shrink-0 transform -translate-y-1.5"
            >
              <path
                d="M 2 18 C 12 6, 26 4, 38 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 30 1 L 39 6 L 31 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </motion.div>
        </AnimatePresence>
      </div>
    ) : null;

    const buttonElement = asDiv ? (
      <motion.div
        ref={ref as unknown as React.Ref<HTMLDivElement>}
        animate={controls}
        initial={{ scale: 1 }}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        data-holding={isHolding}
        onClick={
          handleClick as unknown as React.MouseEventHandler<HTMLDivElement>
        }
        onPointerEnter={
          handlePointerEnter as unknown as React.PointerEventHandler<HTMLDivElement>
        }
        onPointerLeave={
          handlePointerLeave as unknown as React.PointerEventHandler<HTMLDivElement>
        }
        onPointerDown={
          handlePointerDown as unknown as React.PointerEventHandler<HTMLDivElement>
        }
        onPointerUp={
          handlePointerUp as unknown as React.PointerEventHandler<HTMLDivElement>
        }
        onPointerCancel={
          handlePointerCancel as unknown as React.PointerEventHandler<HTMLDivElement>
        }
        className={baseClass}
        {...(props as HTMLMotionProps<"div">)}
      >
        {innerContent}
      </motion.div>
    ) : (
      <motion.button
        ref={ref}
        animate={controls}
        initial={{ scale: 1 }}
        disabled={disabled}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        data-holding={isHolding}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className={baseClass}
        {...props}
      >
        {innerContent}
      </motion.button>
    );

    if (showHint) {
      return (
        <div className="relative inline-flex items-center justify-center">
          {hintElement}
          {buttonElement}
        </div>
      );
    }

    return buttonElement;
  },
);

ElasticButton.displayName = "ElasticButton";

export default ElasticButton;

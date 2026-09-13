import React from "react";
import { cn } from "@/lib/utils";

interface HorizontalLineProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  /**
   * Khi đặt bên trong container hẹp (như VerticalLines),
   * bật bleed={true} sẽ bung đường kẻ tràn ra toàn màn hình (vượt ra ngoài 2 đường dọc).
   */
  bleed?: boolean;
  /**
   * Hiển thị ô hình vuông nhỏ xoay 45 độ tại giao điểm với các đường kẻ dọc (mặc định: true).
   */
  showDiamonds?: boolean;
  /**
   * Tùy biến thêm class cho các ô vuông tại giao điểm.
   */
  diamondClassName?: string;
}

export function HorizontalLine({
  className,
  style,
  bleed = false,
  showDiamonds = true,
  diamondClassName,
  ...props
}: HorizontalLineProps) {
  return (
    <div
      className={cn("w-full relative pointer-events-none z-30", className)}
      {...props}
    >
      {/* Đường kẻ ngang có mask micro-dots */}
      <div
        className={cn(
          "h-0 border-b border-black/30 dark:border-white/25",
          bleed
            ? "w-screen absolute left-1/2 -translate-x-1/2 top-0"
            : "w-full",
        )}
        style={{
          maskImage:
            "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
          WebkitMaskImage:
            "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
          ...style,
        }}
      />

      {/* Các ô vuông nhỏ xoay 45 độ tại điểm giao với 2 đường kẻ dọc */}
      {showDiamonds && (
        <>
          {/* Giao điểm đường dọc bên trái */}
          <div
            className={cn(
              "absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rotate-45",
              "w-2 h-2 border border-black/30 dark:border-white/25 bg-white dark:bg-black z-40 hidden md:block",
              diamondClassName,
            )}
          />
          {/* Giao điểm đường dọc bên phải */}
          <div
            className={cn(
              "absolute top-0 left-full -translate-x-1/2 -translate-y-1/2 rotate-45",
              "w-2 h-2 border border-black/30 dark:border-white/25 bg-white dark:bg-black z-40 hidden md:block",
              diamondClassName,
            )}
          />
        </>
      )}
    </div>
  );
}

export default HorizontalLine;

import React from "react";
import { cn } from "@/lib/utils";

interface VerticalLinesProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export function VerticalLines({
  children,
  className,
  style,
  ...props
}: VerticalLinesProps) {
  const lineMaskStyle: React.CSSProperties = {
    maskImage:
      "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
    WebkitMaskImage:
      "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
  };

  return (
    <div
      className={cn("relative w-full min-h-screen", className)}
      style={style}
      {...props}
    >
      {/* Vùng chứa children: z-20 để các thành phần như HorizontalLine/diamond đè lên được đường dọc */}
      <div className="relative w-full md:mx-auto md:w-[40%] min-h-screen z-20">
        {/* Đường kẻ dọc bên trái - bám đúng mép trái của cột 40% */}
        <div
          className="absolute inset-y-0 left-0 w-0 border-r border-black/30 dark:border-white/25 pointer-events-none hidden md:block z-10"
          style={lineMaskStyle}
        />

        {/* Đường kẻ dọc bên phải - bám đúng mép phải của cột 40% */}
        <div
          className="absolute inset-y-0 right-0 w-0 border-r border-black/30 dark:border-white/25 pointer-events-none hidden md:block z-10"
          style={lineMaskStyle}
        />

        {children}
      </div>
    </div>
  );
}

export default VerticalLines;

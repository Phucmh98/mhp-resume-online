import React from "react";
import { cn } from "@/lib/utils";

export interface DottedLineProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  position?: "top" | "bottom" | "middle" | "relative";
  borderSide?: "top" | "bottom";
}

export function DottedLine({
  className,
  style,
  position,
  borderSide = "top",
  ...props
}: DottedLineProps) {
  const positionClasses = {
    top: "absolute inset-x-0 top-0",
    bottom: "absolute inset-x-0 bottom-0",
    middle: "absolute inset-x-0 top-1/2",
    relative: "block w-full",
  };

  return (
    <span
      className={cn(
        "pointer-events-none h-0",
        borderSide === "top" ? "border-t" : "border-b",
        "border-black/30 dark:border-white/25",
        position ? positionClasses[position] : "",
        className,
      )}
      style={{
        maskImage:
          "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
        WebkitMaskImage:
          "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
        ...style,
      }}
      {...props}
    />
  );
}

export default DottedLine;

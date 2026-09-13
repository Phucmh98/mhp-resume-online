"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import DotField from "./ui/dot-field";

export default function FooterGridSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <div className="h-75 w-full relative overflow-hidden">
      <DotField
        dotRadius={1.5}
        dotSpacing={14}
        bulgeStrength={67}
        sparkle={false}
        waveAmplitude={0}
        cursorRadius={260}
        cursorForce={0.1}
        bulgeOnly
        gradientFrom={
          isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(24, 24, 27, 0.4)"
        }
        gradientTo={
          isDark ? "rgba(161, 161, 170, 0.15)" : "rgba(113, 113, 122, 0.12)"
        }
        glowColor={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"}
      />
    </div>
  );
}

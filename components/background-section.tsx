"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

interface BackgroundSectionProps {
  className?: string;
  videoSrc?: string;
}

export default function BackgroundSection({
  className = "",
  videoSrc = "/asset/videos/mhp_background_opt.mp4",
}: BackgroundSectionProps) {
  const { resolvedTheme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInitializedRef = useRef(false);
  const lastThemeRef = useRef<string | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Stop any ongoing playback or reverse animation loop
  const stopAll = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  // Play forward towards the end of the video (Dark mode)
  const playForward = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    stopAll();

    const maxTime = Math.max(0, (video.duration || 2.04) - 0.001);
    if (video.currentTime >= maxTime) {
      video.currentTime = maxTime;
      return;
    }

    video.playbackRate = 1.0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("Video forward error:", err);
        }
      });
    }

    const checkEnd = () => {
      if (!video) return;
      if (video.currentTime >= maxTime || video.ended) {
        video.pause();
        video.currentTime = maxTime;
        rafIdRef.current = null;
        return;
      }
      rafIdRef.current = requestAnimationFrame(checkEnd);
    };

    rafIdRef.current = requestAnimationFrame(checkEnd);
  }, [stopAll]);

  // Play backward towards 0 (Light mode)
  const playBackward = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    stopAll();

    if (video.currentTime <= 0) {
      video.currentTime = 0;
      return;
    }

    let lastTime = performance.now();
    let targetTime = video.currentTime;
    const speed = 1.0;

    const step = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      targetTime = Math.max(0, targetTime - delta * speed);

      if (!video.seeking) {
        video.currentTime = targetTime;
      }

      if (targetTime <= 0) {
        video.currentTime = 0;
        video.pause();
        rafIdRef.current = null;
        return;
      }

      rafIdRef.current = requestAnimationFrame(step);
    };

    rafIdRef.current = requestAnimationFrame(step);
  }, [stopAll]);

  // Handle initialization once metadata is loaded
  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video || !resolvedTheme) return;

    if (!isInitializedRef.current) {
      const maxTime = Math.max(0, (video.duration || 2.04) - 0.001);
      if (resolvedTheme === "dark") {
        video.currentTime = maxTime;
      } else {
        video.currentTime = 0;
      }
      video.pause();
      isInitializedRef.current = true;
      lastThemeRef.current = resolvedTheme;
    }
  }, [resolvedTheme]);

  // React to theme changes (including rapid spamming)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !resolvedTheme) return;

    // If metadata is not loaded yet, handleLoadedMetadata will initialize
    if (isNaN(video.duration) || video.duration === 0) {
      return;
    }

    if (!isInitializedRef.current) {
      const maxTime = Math.max(0, (video.duration || 2.04) - 0.001);
      if (resolvedTheme === "dark") {
        video.currentTime = maxTime;
      } else {
        video.currentTime = 0;
      }
      video.pause();
      isInitializedRef.current = true;
      lastThemeRef.current = resolvedTheme;
      return;
    }

    // Only transition if theme actually changed
    if (lastThemeRef.current === resolvedTheme) return;
    lastThemeRef.current = resolvedTheme;

    if (resolvedTheme === "dark") {
      playForward();
    } else {
      playBackward();
    }
  }, [resolvedTheme, playForward, playBackward]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  // Tự động nhận diện video có 2 vệt đen đóng sẵn (như mhp_background_2.mp4) để bù chiều cao
  const isLetterboxed = videoSrc.includes("mhp_background_2");

  return (
    <div
      className={`relative h-56 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900  ${className}`}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        className={`absolute left-0 w-full object-cover pointer-events-none ${isLetterboxed ? "top-[-17.5%] h-[135%]" : "inset-0 h-full"
          }`}
        style={{
          transform: "translateZ(0)",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Left side fade (ultra slim edge feathering) */}
      <div className="absolute inset-y-0 left-0 w-2 bg-linear-to-r from-white to-transparent dark:from-black/90 dark:to-transparent pointer-events-none transition-colors duration-300" />

      {/* Right side fade (ultra slim edge feathering) */}
      <div className="absolute inset-y-0 right-0 w-2 bg-linear-to-l from-white to-transparent dark:from-black/90 dark:to-transparent pointer-events-none transition-colors duration-300" />
    </div>
  );
}

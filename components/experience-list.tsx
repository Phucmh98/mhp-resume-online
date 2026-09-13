"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ExperienceData = {
  title: string;
  role: string;
  dates: string;
  location: string;
  src: string;
  type?: string;
  imageFit?: "contain" | "cover";
  imageZoom?: number;
  description: string;
  tech: string[];
  metrics?: { label: string; value: string }[];
  screenshot?: string;
};

const experiences: ExperienceData[] = [
  {
    title: "DP-Unity Company",
    role: "Front-End Developer, R&D Department",
    dates: "2024 - Present",
    location: "Full time",
    src: "/asset/images/work_experience/logo-dpu.png",
    imageFit: "cover",
    imageZoom: 1,
    description: `
      Built responsive web apps for construction digital transformation using Next.js and TypeScript.
  Integrated Bryntum Gantt to deliver interactive, enterprise-grade project scheduling interfaces.
  Engineered high-performance web 3D/BIM viewers using Cesium and Xeokit with optimized load speeds.
  Packaged core 3D visualization and interaction modules into reusable internal libraries.
  Researched 4D BIM integrations by connecting schedule timelines directly with 3D models.
    `,
    tech: [
      "Next.js",
      "React",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "Cesium",
      "Xeokit",
      "Bryntum Gantt",
      "Autodesk Forge",
      "Webpack",
    ],
    metrics: [
      { label: "Core Projects", value: "3" },
      { label: "3D Engines Integrated", value: "4" },
      { label: "Active 3D Users", value: "50+" },
      { label: "Internal Packages", value: "5+" },
    ],
  },
  {
    title: "Central Construction Joint Stock Company",
    role: "BIM Engineer, BIM Developer",
    dates: "2021 - 2023",
    location: "Full time",
    src: "/asset/images/work_experience/logo-central.png",
    imageFit: "cover",
    imageZoom: 1,
    description: `
      Developed custom add-ins for Revit to help engineering teams work faster and more accurately in design and construction tasks.
      Researched and built prototypes for new tools in 3D visualization, automation, and data processing for construction workflows.
      Created internal tools that saved time for engineers, including automated data exports, report generation, model checks, and BIM model interactions.
      Worked closely with technical teams and project managers to understand their needs and deliver software that fits real construction use cases.
      Provided development support to construction teams by identifying common issues and building tools to solve them efficiently.
      Learned 3D modeling and BIM workflows from construction experts to make sure the software tools matched real-world field requirements.
    `,
    tech: [
      "Revit",
      "Autocad",
      "Enscape",
      "Twinmotion",
      "Revit Api",
      "C#",
      "Python",
    ],
    metrics: [
      { label: "Add-ins & Tools", value: "15+" },
      { label: "Projects Supported", value: "5+" },
      { label: "Time Saved", value: "40%" },
      { label: "Models Checked", value: "20+" },
    ],
  },
];

export function ExperienceList() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="w-full">
      {experiences.map((item, idx) => {
        const isOpen = openIdx === idx;
        const isLast = idx === experiences.length - 1;

        return (
          <div key={idx} className="group relative">
            <div
              className="flex items-start justify-between gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer relative z-20 sm:gap-3 sm:py-4 2xl:flex-row 2xl:items-center 2xl:justify-between"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
            >
              <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="size-10 shrink-0 rounded-[10px] border border-black/10 bg-zinc-50 p-0.5 shadow-sm shadow-black/15 dark:border-zinc-800 dark:bg-[#111111] dark:shadow-md dark:shadow-black/50">
                  <div className="w-full h-full rounded-[7px] border border-black/5 dark:border-black/20 bg-white flex items-center justify-center overflow-hidden relative">
                    <Image
                      src={item.src}
                      alt={item.title}
                      width={40}
                      height={40}
                      sizes="40px"
                      quality={75}
                      style={
                        item.imageZoom
                          ? { transform: `scale(${item.imageZoom})` }
                          : undefined
                      }
                      className={`${item.imageFit === "contain" ? "object-contain" : "object-cover"} w-full h-full`}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1 pr-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-bold leading-tight text-zinc-900 dark:text-zinc-100 sm:text-[17px]">
                      {item.title}
                    </span>
                    {item.type && (
                      <span className="self-center px-1.5 py-px rounded-sm text-[11px] font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-700/50 whitespace-nowrap">
                        {item.type}
                      </span>
                    )}
                  </div>
                  <span className=" text-[14px] sm:text-[15px] text-zinc-600 dark:text-zinc-400 truncate">
                    {item.role}
                  </span>

                  {/* Khi responsive (< 2xl), cụm dates + location nhảy xuống dưới title + role */}
                  <div className="flex flex-col items-start mt-2.5 sm:mt-3 2xl:hidden">
                    <span className="text-[13px] sm:text-[14px] font-medium text-zinc-900 dark:text-zinc-100 leading-tight">
                      {item.dates}
                    </span>
                    <span className="text-[13px] sm:text-[14px] text-zinc-500 dark:text-zinc-400">
                      {item.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bên phải: desktop hiển thị dates + location, và Arrow LUÔN bám top */}
              <div className="flex items-start gap-2 shrink-0 ">
                <div className="hidden 2xl:flex flex-col items-end text-right">
                  <span className="text-[13px] sm:text-[14px] font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap leading-tight">
                    {item.dates}
                  </span>
                  <span className="text-[13px] sm:text-[14px] text-zinc-500 dark:text-zinc-400 mt-1 whitespace-nowrap leading-tight">
                    {item.location}
                  </span>
                </div>
                <div className="shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    className={cn(
                      "w-3.5 h-3.5 text-zinc-500 origin-center transition-transform duration-300 ease-in-out",
                      isOpen ? "rotate-180" : "rotate-0",
                    )}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* Expandable Details Section */}
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`${
                    isOpen
                      ? "pb-4  opacity-100 translate-y-0"
                      : "pb-0 pt-0 opacity-0 -translate-y-2"
                  } transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] px-4 text-[13px] sm:text-[14px] text-zinc-600 dark:text-zinc-400`}
                >
                  {item.metrics && (
                    <div className="relative -mx-4 ">
                      <div className="grid max-w-full grid-cols-2 2xl:grid-cols-4 px-4">
                        {item.metrics.map((metric, mIdx) => {
                          const isLastMetric =
                            mIdx === item.metrics!.length - 1;
                          const isRowBreak = (mIdx + 1) % 2 === 0;

                          return (
                            <div
                              key={metric.label}
                              className={cn(
                                "relative min-w-0 px-3 py-2",
                                !isLastMetric &&
                                  "after:absolute after:bottom-0 after:right-0 after:top-0 after:w-0 after:border-r after:border-black/30 after:mask-[repeating-linear-gradient(to_bottom,black_0,black_1px,transparent_1px,transparent_6px)] dark:after:border-white/25",
                                !isLastMetric &&
                                  isRowBreak &&
                                  "after:hidden 2xl:after:block",
                              )}
                            >
                              <p className="text-[14px] sm:text-[16px] font-bold leading-none text-zinc-900 dark:text-zinc-100">
                                {metric.value}
                              </p>
                              <p className="mt-1 text-[10px] font-medium uppercase text-zinc-400 dark:text-zinc-600">
                                {metric.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Đường kẻ ngang trên chạm viền dọc */}
                      <span
                        className="pointer-events-none absolute inset-x-0 top-0 h-0 border-t border-black/30 dark:border-white/25"
                        style={{
                          maskImage:
                            "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                          WebkitMaskImage:
                            "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                        }}
                      />

                      {/* Đường kẻ ngang giữa khi hiển thị 2 cột */}
                      <span
                        className="pointer-events-none absolute inset-x-0 top-1/2 h-0 border-t border-black/30 dark:border-white/25 2xl:hidden"
                        style={{
                          maskImage:
                            "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                          WebkitMaskImage:
                            "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                        }}
                      />

                      {/* Đường kẻ ngang dưới chạm viền dọc */}
                      <span
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-0 border-b border-black/30 dark:border-white/25"
                        style={{
                          maskImage:
                            "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                          WebkitMaskImage:
                            "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                        }}
                      />

                      {/* Các điểm dot tại giao điểm với 2 đường kẻ dọc */}
                      <span className="pointer-events-none absolute left-0 top-0 h-0.5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/25" />
                      <span className="pointer-events-none absolute right-0 top-0 h-0.5 w-0.5 translate-x-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/25" />
                      <span className="pointer-events-none absolute left-0 top-1/2 h-0.5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/25 2xl:hidden" />
                      <span className="pointer-events-none absolute right-0 top-1/2 h-0.5 w-0.5 translate-x-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/25 2xl:hidden" />
                      <span className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0.5 -translate-x-1/2 translate-y-1/2 bg-black/50 dark:bg-white/25" />
                      <span className="pointer-events-none absolute bottom-0 right-0 h-0.5 w-0.5 translate-x-1/2 translate-y-1/2 bg-black/50 dark:bg-white/25" />
                    </div>
                  )}

                  {isOpen && item.screenshot && (
                    <div className="relative my-3 overflow-hidden rounded-md bg-black">
                      <Image
                        src={item.screenshot}
                        alt={`${item.title} analytics screenshot`}
                        width={1400}
                        height={1050}
                        sizes="(min-width: 768px) 40vw, calc(100vw - 3rem)"
                        quality={75}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  )}

                  <ul className="my-3 space-y-2 text-[13px] leading-relaxed">
                    {item.description
                      .split("\n")
                      .filter((line) => line.trim() !== "")
                      .map((point, i) => {
                        const [label, ...detail] = point.trim().split(":");

                        return (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-zinc-400 dark:text-zinc-500 mt-0.5 text-[14px] leading-none shrink-0">
                              •
                            </span>
                            <span>
                              {detail.length > 0 ? (
                                <>
                                  <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
                                    {label}:
                                  </strong>
                                  {" " + detail.join(":")}
                                </>
                              ) : (
                                point.trim()
                              )}
                            </span>
                          </li>
                        );
                      })}
                  </ul>

                  {item.tech && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {item.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-sm border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-[#111111] text-[11px] font-medium text-zinc-500 dark:text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dashed line divider between items */}
            {!isLast && (
              <div
                className="w-full h-0 border-b border-black/20 dark:border-white/25 pointer-events-none"
                style={{
                  maskImage:
                    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                  WebkitMaskImage:
                    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

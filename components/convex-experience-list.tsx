"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type ExperienceMetric = {
  label: string;
  value: string;
};

type ExperienceProject = {
  title: string;
  period?: string;
  status?: string;
  responsibilities?: string[];
  techStack?: string[];
};

export type ConvexExperienceRecord = {
  _id: string;
  _creationTime: number;
  id?: string;
  title?: string;
  company?: string;
  name?: string;
  role?: string;
  position?: string;
  period?: string;
  dates?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  type?: string;
  logo?: string;
  image?: string;
  src?: string;
  imageFit?: "contain" | "cover";
  imageZoom?: number;
  description?: string;
  content?: string;
  tech?: string[] | string;
  metrics?: ExperienceMetric[] | string;
  projects?: ExperienceProject[];
  screenshot?: string;
  order?: number;
  isPinned?: boolean;
};

export type ExperienceData = {
  key: string;
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
  metrics?: ExperienceMetric[];
  projects: ExperienceProject[];
  screenshot?: string;
};

const fallbackLogo = "/asset/images/work_experience/logo-dpu.png";
const convexApi = api as typeof api & {
  experiences: {
    getAll: typeof api.projectManage.getAll;
  };
};

function parseStringArray(value: ConvexExperienceRecord["tech"]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => (typeof item === "string" ? item : item?.label))
        .filter(Boolean);
    }
  } catch {}

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseMetrics(
  value: ConvexExperienceRecord["metrics"],
): ExperienceMetric[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {}

  return [];
}

function normalizeLogoPath(src?: string) {
  if (!src) return fallbackLogo;
  if (src.startsWith("/image/work_experience/")) {
    return src.replace(
      "/image/work_experience/",
      "/asset/images/work_experience/",
    );
  }
  return src;
}

function normalizeExperience(item: ConvexExperienceRecord): ExperienceData {
  const projects = Array.isArray(item.projects) ? item.projects : [];
  const startEndDates =
    item.startDate && item.endDate
      ? `${item.startDate} - ${item.endDate}`
      : item.startDate || item.endDate || "";
  const projectTech = projects.flatMap((project) => project.techStack || []);
  const tech = parseStringArray(item.tech);
  const activeProjects = projects.filter(
    (project) => project.status?.toLowerCase() === "active",
  ).length;
  const metrics = parseMetrics(item.metrics);

  return {
    key: item.id || item._id,
    title: item.company || item.title || item.name || "Untitled Company",
    role:
      item.role ||
      item.position ||
      (projects.length > 0 ? `${projects.length} projects` : "Experience"),
    dates: item.period || item.dates || startEndDates || "Timeline not set",
    location: item.location || item.type || "Experience",
    src: normalizeLogoPath(item.logo || item.image || item.src),
    type: item.type,
    imageFit: item.imageFit || "cover",
    imageZoom: item.imageZoom,
    description: item.description || item.content || "",
    tech: tech.length > 0 ? tech : [...new Set(projectTech)],
    metrics:
      metrics.length > 0
        ? metrics
        : projects.length > 0
          ? [
              { label: "Projects", value: String(projects.length) },
              { label: "Active", value: String(activeProjects) },
              { label: "Tech Used", value: String(new Set(projectTech).size) },
            ]
          : [],
    projects,
    screenshot: item.screenshot,
  };
}

function ExperienceListSkeleton() {
  return (
    <div className="w-full">
      {[0, 1].map((item) => (
        <div key={item} className="relative">
          <div className="flex items-start justify-between gap-3 p-4">
            <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
              <Skeleton className="size-10 shrink-0 rounded-[10px] bg-zinc-200/70 dark:bg-zinc-800/70" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-44 bg-zinc-200/80 dark:bg-zinc-800/80" />
                <Skeleton className="h-4 w-64 max-w-full bg-zinc-200/60 dark:bg-zinc-800/60" />
                <Skeleton className="h-3.5 w-28 bg-zinc-200/60 dark:bg-zinc-800/60 2xl:hidden" />
              </div>
            </div>
            <Skeleton className="h-4 w-24 bg-zinc-200/60 dark:bg-zinc-800/60" />
          </div>
          {item === 0 && (
            <div
              className="h-0 w-full border-b border-black/20 dark:border-white/25"
              style={{
                maskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                WebkitMaskImage:
                  "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function ExperienceTimeline({
  experiences,
}: {
  experiences: ExperienceData[];
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (experiences.length === 0) {
    return (
      <div className="w-full p-6 text-center text-[13px] text-zinc-500 dark:text-zinc-400">
        No experiences found.
      </div>
    );
  }

  return (
    <div className="w-full">
      {experiences.map((item, idx) => {
        const isOpen = openIdx === idx;
        const isLast = idx === experiences.length - 1;

        return (
          <div key={item.key} className="group relative">
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
                  {item.metrics && item.metrics.length > 0 && (
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

                  {item.projects.length > 0 ? (
                    <div className="my-3 space-y-3">
                      {item.projects.map((project) => {
                        const status = project.status || "Project";
                        const isActive = status.toLowerCase() === "active";

                        return (
                          <div
                            key={`${item.key}-${project.title}`}
                            className="rounded-md border border-zinc-200/60 bg-zinc-50/80 p-3 dark:border-zinc-800/60 dark:bg-[#111111]"
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <p className="text-[13px] font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
                                  {project.title}
                                </p>
                                {project.period && (
                                  <p className="mt-1 text-[12px] text-zinc-500 dark:text-zinc-400">
                                    {project.period}
                                  </p>
                                )}
                              </div>
                              <span
                                className={cn(
                                  "w-fit shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                                  isActive
                                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "border-zinc-300/60 bg-white text-zinc-500 dark:border-zinc-700/60 dark:bg-black dark:text-zinc-400",
                                )}
                              >
                                {status}
                              </span>
                            </div>

                            {project.responsibilities &&
                              project.responsibilities.length > 0 && (
                                <ul className="mt-3 space-y-2 text-[13px] leading-relaxed">
                                  {project.responsibilities.map(
                                    (responsibility) => (
                                      <li
                                        key={responsibility}
                                        className="flex items-start gap-2"
                                      >
                                        <span className="mt-0.5 shrink-0 text-[14px] leading-none text-zinc-400 dark:text-zinc-500">
                                          •
                                        </span>
                                        <span>{responsibility}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}

                            {project.techStack &&
                              project.techStack.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {project.techStack.map((tech) => (
                                    <span
                                      key={`${project.title}-${tech}`}
                                      className="rounded-sm border border-zinc-200/60 bg-white px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:border-zinc-800/60 dark:bg-black dark:text-zinc-400"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <ul className="my-3 space-y-2 text-[13px] leading-relaxed">
                      {item.description
                        .split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((point, i) => {
                          const [label, ...detail] = point.trim().split(":");

                          return (
                            <li key={i} className="flex items-start gap-2">
                              <span className="mt-0.5 shrink-0 text-[14px] leading-none text-zinc-400 dark:text-zinc-500">
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
                  )}

                  {item.projects.length === 0 && item.tech.length > 0 && (
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

export default function ConvexExperienceList() {
  const convexExperiences = useQuery(convexApi.experiences.getAll) as
    ConvexExperienceRecord[] | undefined;

  const experiences = useMemo(() => {
    if (!convexExperiences) return [];
    return [...convexExperiences]
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return (a.order ?? 0) - (b.order ?? 0);
      })
      .map(normalizeExperience);
  }, [convexExperiences]);

  if (convexExperiences === undefined) {
    return <ExperienceListSkeleton />;
  }

  return <ExperienceTimeline experiences={experiences} />;
}

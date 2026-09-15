"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { HorizontalLine } from "@/components/horizontal-line";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getProjectTech,
  type ConvexProjectRecord,
} from "@/components/project-list";
import {
  iconMap,
  techNames,
  TechKey,
  TechItem,
} from "@/app/utils/data/projects-data";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";

type ContentDetailBlock = {
  typeContent?: "title" | "heading" | "text" | "paragraph" | "image" | "list";
  content?: string;
  contentList?: string[];
};

// Blueprint Dashed Divider with crosshair dots
function BlueprintDivider({ className = "mt-8 mb-6" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none"
        style={{
          maskImage:
            "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
          WebkitMaskImage:
            "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
        }}
      />
      <div className="absolute left-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
      <div className="absolute right-0 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
    </div>
  );
}

function parseContentDetail(contentDetail?: string): ContentDetailBlock[] {
  if (!contentDetail) return [];
  try {
    const parsed =
      typeof contentDetail === "string"
        ? JSON.parse(contentDetail)
        : contentDetail;
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse contentDetail:", e);
    return [];
  }
}

function getAdditionalSections(detailBlocks: ContentDetailBlock[]) {
  const sections: {
    title: string;
    items: ContentDetailBlock[];
  }[] = [];

  let activeSection: { title: string; items: ContentDetailBlock[] } | null = null;

  for (const block of detailBlocks) {
    const isHeading =
      block.typeContent === "title" || block.typeContent === "heading";

    if (isHeading) {
      const headingTitle = block.content || "";
      // Nếu là Tech Stack thì bỏ qua vì đã được render ở "Stack used"
      if (/tech\s*stack/i.test(headingTitle)) {
        activeSection = null;
        continue;
      }
      activeSection = { title: headingTitle, items: [] };
      sections.push(activeSection);
    } else if (activeSection) {
      activeSection.items.push(block);
    } else {
      // Nếu không có title trước đó (hoặc block đơn lẻ)
      sections.push({ title: "", items: [block] });
    }
  }

  return sections;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const id =
    typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : "";

  const convexProjects = useQuery(api.projectManage.getAll);

  const project = useMemo(() => {
    if (!convexProjects || !id) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return convexProjects.find((p: any) => p.id === id || p._id === id);
  }, [convexProjects, id]);

  const detailBlocks = parseContentDetail(project?.contentDetail);

  // Loading skeleton matching blueprint style
  if (convexProjects === undefined) {
    return (
      <div className="min-h-[70vh] flex flex-col">
        <div className="px-4 h-28 flex items-center">
          <div className="flex items-center gap-5">
            <Skeleton className="w-8 h-8 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        </div>
        <HorizontalLine bleed />
        <div className="pb-16 px-4 flex flex-col z-10 relative">
          <Skeleton className="w-full aspect-video rounded-lg mt-8" />
          <BlueprintDivider className="mt-8 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 py-4">
            <Skeleton className="h-4 w-20 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto hidden md:block" />
          </div>
          <BlueprintDivider className="mb-6" />
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  // Not found state
  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col">
        <div className="px-4 h-28 flex items-center">
          <Link
            href="/projects"
            className="group flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>
        </div>
        <HorizontalLine bleed />
        <div className="max-w-md mx-auto my-auto text-center py-20 px-4">
          <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
            Project Not Found
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            The project you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const title =
    project.name ||
    ("title" in project ? project.title : "") ||
    project.id ||
    "Untitled Project";

  const description =
    project.description ||
    ("content" in project ? project.content : "") ||
    "";

  const imageSrc =
    project.image ||
    ("src" in project ? project.src : "") ||
    "/placeholder.png";

  const liveUrl =
    project.urlDemo ||
    ("live" in project ? project.live : "") ||
    "";

  const githubUrl =
    project.urlGithub ||
    ("github" in project ? project.github : "") ||
    "";

  const statusStr = (project.status || "").toLowerCase();
  const isNotStarted = statusStr === "not started" || statusStr === "planning";
  const isBuilding =
    statusStr === "building" ||
    statusStr === "in progress" ||
    statusStr === "in development";

  const statusColor = isNotStarted
    ? "bg-zinc-500"
    : isBuilding
      ? "bg-red-500"
      : "bg-emerald-500";
  const pingColor = isNotStarted
    ? "bg-zinc-400"
    : isBuilding
      ? "bg-red-400"
      : "bg-emerald-400";
  const statusTextColor = isNotStarted
    ? "text-zinc-500"
    : isBuilding
      ? "text-red-500 dark:text-red-400"
      : "text-emerald-600 dark:text-emerald-400";
  const statusLabel = project.status || "Live";

  // Lấy tech stack đầy đủ từ helper function
  const techList = getProjectTech(project);

  // Nhóm contentDetail thành các section riêng biệt để render dưới phần Tech Stack
  const additionalSections = getAdditionalSections(detailBlocks);

  return (
    <>
      {/* Top Banner Header */}
      <div className="px-4 h-28 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link
            href="/projects"
            className="group flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>
          <div className="flex flex-col justify-center">
            <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
              {title}
            </h1>
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
              Project Details
            </p>
          </div>
        </div>
      </div>

      <HorizontalLine bleed />

      {/* Main Blueprint Column Container */}
      <div className="pb-16 px-4 flex flex-col z-10 relative">
        {/* Media (Video or Image) right at the top */}
        <div className="w-full aspect-video relative mt-8 rounded-lg overflow-hidden border border-black/10 dark:border-white/[0.15] shadow-sm bg-black z-20">
          {project.video ? (
            project.video.includes("youtube") ? (
              <iframe
                src={project.video}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <video
                src={project.video}
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                loop
                playsInline
              />
            )
          ) : (
            <Image
              src={imageSrc}
              alt={title}
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              quality={75}
              className="object-cover"
            />
          )}
        </div>

        {/* Top Dashed Divider (Blueprint system) */}
        <BlueprintDivider className="mt-8" />

        {/* Action Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 items-center justify-between py-4 relative">
          {githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <SiGithub className="w-4 h-4" /> Github
            </a>
          ) : (
            <div />
          )}

          {/* Vertical Divider 1 */}
          <div
            className="hidden md:block absolute left-1/3 top-0 bottom-0 w-0 border-l border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage:
                "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />

          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Website
            </a>
          ) : (
            <div />
          )}

          {/* Vertical Divider 2 */}
          <div
            className="hidden md:block absolute left-2/3 top-0 bottom-0 w-0 border-l border-black/30 dark:border-white/[0.15] pointer-events-none"
            style={{
              maskImage:
                "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
              WebkitMaskImage:
                "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
            }}
          />

          <Link
            href="/projects"
            className="hidden md:flex items-center justify-center gap-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Projects
          </Link>
        </div>

        {/* Bottom Dashed Divider */}
        <BlueprintDivider className="mb-6" />

        {/* Title and Status */}
        <div className="flex items-center justify-between w-full mb-4">
          <h1 className="text-[24px] sm:text-[28px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
            {title}
          </h1>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pingColor}`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${statusColor}`}
              />
            </span>
            <span className={`text-[13px] font-medium ${statusTextColor}`}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-[14px] sm:text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">
            {description}
          </p>
        )}

        {/* Dashed Divider before Stack */}
        {techList.length > 0 && (
          <>
            <BlueprintDivider className="mt-8 mb-6" />

            {/* Tech Stack */}
            <div>
              <h2 className="text-[16px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
                Stack used
              </h2>
              <div className="flex flex-wrap gap-2">
                {techList.map((t: TechItem, i: number) => {
                  const isKey = typeof t === "string";
                  const label = isKey ? techNames[t as TechKey] || t : t.label;
                  const Icon =
                    isKey && t in iconMap ? iconMap[t as TechKey] : null;

                  return (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/5 rounded-md text-[12px] font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Additional Sections from ContentDetail (Features, Screenshots, Goals, etc.) */}
        {additionalSections.map((sec, sIdx) => {
          // Bỏ qua nếu là overview mà text giống description
          if (
            /overview/i.test(sec.title) &&
            sec.items.length === 1 &&
            sec.items[0].content === description
          ) {
            return null;
          }

          return (
            <div key={sIdx}>
              <BlueprintDivider className="mt-8 mb-6" />

              {sec.title && (
                <h2 className="text-[16px] font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
                  {sec.title}
                </h2>
              )}

              <div className="space-y-4">
                {sec.items.map((item, iIdx) => {
                  const type = item.typeContent;

                  if (type === "text" || type === "paragraph") {
                    return (
                      <p
                        key={iIdx}
                        className="text-[14px] sm:text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300"
                      >
                        {item.content}
                      </p>
                    );
                  }

                  if (type === "image") {
                    return (
                      <div
                        key={iIdx}
                        className="w-full aspect-video relative rounded-lg overflow-hidden border border-black/10 dark:border-white/[0.15] shadow-sm bg-black z-20"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.content}
                          alt={sec.title || "Screenshot"}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    );
                  }

                  if (type === "list") {
                    return (
                      <div key={iIdx} className="space-y-2.5">
                        {item.contentList?.map((text, lIdx) => {
                          const colonIndex = text.indexOf(":");
                          const hasPrefix =
                            colonIndex > 0 && colonIndex < 40;
                          const prefix = hasPrefix
                            ? text.slice(0, colonIndex + 1)
                            : null;
                          const rest = hasPrefix
                            ? text.slice(colonIndex + 1)
                            : text;

                          return (
                            <div
                              key={lIdx}
                              className="flex items-start gap-2.5 text-[13.5px] sm:text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 mt-2 shrink-0" />
                              <div>
                                {hasPrefix ? (
                                  <>
                                    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                                      {prefix}
                                    </strong>
                                    <span>{rest}</span>
                                  </>
                                ) : (
                                  <span>{text}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

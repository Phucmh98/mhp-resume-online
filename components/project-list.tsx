"use client";

import { useState, useMemo, useEffect, Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useProjectStore } from "@/hooks/use-project-store";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getTechItem,
  iconMap,
  Project,
  TechIcon,
  TechItem,
  TechKey,
  techNames,
} from "@/app/utils/data/projects-data";

export {
  type TechIcon,
  type TechKey,
  type TechItem,
  type Project,
  iconMap,
  techNames,
};

export type ConvexProjectRecord = {
  _id: string;
  _creationTime: number;
  id?: string;
  name?: string;
  description?: string;
  content?: string;
  contentDetail?: string;
  image?: string;
  backgroundColor?: string;
  client?: string;
  order?: number;
  role?: string;
  startDate?: string;
  status?: string;
  type?: string;
  urlDemo?: string;
  urlGithub?: string;
  video?: string;
  backgroundImage?: string;
  hasPin?: boolean;
  isPinned?: boolean;
  tech?: (TechItem | string)[];
};

// Chuẩn hóa tech stack từ ConvexProjectRecord
export function getProjectTech(project: ConvexProjectRecord | Project): TechItem[] {
  if (Array.isArray(project.tech) && project.tech.length > 0) {
    return project.tech.map((t) =>
      typeof t === "string" ? getTechItem(t) : t,
    );
  }
  if ("contentDetail" in project && project.contentDetail) {
    try {
      const details =
        typeof project.contentDetail === "string"
          ? JSON.parse(project.contentDetail)
          : project.contentDetail;
      if (Array.isArray(details)) {
        for (let i = 0; i < details.length; i++) {
          const item = details[i];
          if (
            (item.typeContent === "title" || item.typeContent === "heading") &&
            /tech\s*stack/i.test(item.content || "")
          ) {
            const next = details[i + 1];
            if (next && Array.isArray(next.contentList)) {
              return next.contentList.map((name: string) => getTechItem(name));
            }
          }
        }
      }
    } catch {}
  }
  if ("type" in project && project.type) {
    return [{ label: project.type }];
  }
  return [];
}

// Chuyển đổi dữ liệu Convex sang interface Project (phục vụ Zustand store & tương thích ngược)
export function formatConvexProject(p: ConvexProjectRecord): Project {
  return {
    slug: p.id || p._id,
    title: p.name || "",
    imageTitle: p.name || "",
    src: p.image || "/placeholder.png",
    video: p.video || "",
    description: p.description || p.content || "",
    tech: getProjectTech(p),
    github: p.urlGithub || "",
    live: p.urlDemo || "",
    status: p.status || "Completed",
    backgroundImage: p.backgroundImage,
  };
}

export const ProjectCard = ({
  project,
  isPriority = false,
  index = 0,
}: {
  project: ConvexProjectRecord | Project;
  isPriority?: boolean;
  index?: number;
}) => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  // Lấy dữ liệu chuẩn từ ConvexProjectRecord (có fallback tương thích Project)
  const title =
    ("name" in project ? project.name : "") ||
    ("title" in project ? project.title : "") ||
    "Untitled";

  const description =
    project.description ||
    ("content" in project ? project.content : "") ||
    "";

  const imageSrc =
    ("image" in project ? project.image : "") ||
    ("src" in project ? project.src : "") ||
    "/placeholder.png";

  const liveUrl =
    ("urlDemo" in project ? project.urlDemo : "") ||
    ("live" in project ? project.live : "") ||
    "";

  const githubUrl =
    ("urlGithub" in project ? project.urlGithub : "") ||
    ("github" in project ? project.github : "") ||
    "";

  const targetUrl = liveUrl || githubUrl;

  const statusStr = (project.status || "").toLowerCase();
  const isNotStarted = statusStr === "not started" || statusStr === "planning";
  const isBuilding =
    statusStr === "building" ||
    statusStr === "in progress" ||
    statusStr === "in development";

  const statusColor = isNotStarted
    ? "bg-zinc-400"
    : isBuilding
      ? "bg-red-500"
      : "bg-emerald-500";

  const statusLabel = project.status || "Live";

  // Lấy danh sách tech
  const techList = getProjectTech(project);

  const router = useRouter();

  const projectSlug =
    ("id" in project && project.id ? project.id : "") ||
    ("_id" in project && project._id ? project._id : "") ||
    ("slug" in project && project.slug ? project.slug : "");

  const handleCardClick = () => {
    if (projectSlug) {
      router.push(`/projects/${projectSlug}`);
    } else if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleOpenLive = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className="flex flex-col group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Outer Wrapper */}
      <motion.div
        className="relative w-full aspect-[1.25] rounded-xl border border-black/5 dark:border-white/5 bg-zinc-50/80 dark:bg-[#09090b]/80 shadow-sm p-3.5 pb-0 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md hover:border-black/10 dark:hover:border-white/10 sm:aspect-[1.4] sm:p-4 sm:pb-0"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        {/* Ambient Hover Background */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: `url('${project.backgroundImage || `/asset/images/bg-retro-${(index % 4) + 1}.jpg`}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          variants={{
            rest: { opacity: 0, scale: 1 },
            hover: { opacity: 1, scale: 1.05 },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Floating screenshot sitting directly at the bottom */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-[85%] rounded-t-[10px] bg-white dark:bg-[#0a0a0a] p-0 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] z-20 border border-black/5 dark:border-white/15 border-b-0"
          variants={{
            rest: { height: "78%", y: 0, x: "-50%" },
            hover: { height: "72%", y: 4, x: "-50%" },
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="size-full overflow-hidden rounded-t-[9px]">
            <Image
              src={imageSrc}
              alt={`${title} preview`}
              width={600}
              height={400}
              preload={isPriority}
              sizes="(min-width: 768px) 17vw, calc(100vw - 2rem)"
              quality={70}
              className="size-full object-cover"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Content Area */}
      <div className="mt-4 flex flex-col px-0.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
            {title}
          </h3>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/50 w-fit shrink-0">
            <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              {statusLabel}
            </span>
          </div>
        </div>

        {description && (
          <p className="mt-2 sm:mt-1.5 text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed pr-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 mt-3">
          <div className="flex gap-2 flex-wrap">
            {techList.map((item: TechItem) => {
              const key = typeof item === "string" ? item : item.label;
              const isIconItem = typeof item === "string";
              const isKnownTech = typeof item === "string" && item in techNames;
              const tooltipText = isKnownTech
                ? techNames[item as TechKey]
                : typeof item === "string"
                  ? item
                  : item.tooltip || item.label;
              const uniqueId = `${title}-${key}`;

              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setHoveredTech(uniqueId)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  {isIconItem ? (
                    (() => {
                      const TechIconComponent =
                        item in iconMap ? iconMap[item as TechKey] : null;
                      if (!TechIconComponent) {
                        return (
                          <span className="px-1.5 py-0.5 rounded border border-black/30 dark:border-white/15 text-[9px] text-zinc-500 dark:text-zinc-400 leading-none">
                            {item}
                          </span>
                        );
                      }
                      return (
                        <TechIconComponent className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" />
                      );
                    })()
                  ) : (
                    <span className="px-1.5 py-0.5 rounded border border-black/30 dark:border-white/15 text-[9px] text-zinc-500 dark:text-zinc-400 leading-none">
                      {item.label}
                    </span>
                  )}
                  <AnimatePresence>
                    {hoveredTech === uniqueId && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                      >
                        <div className="bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[10px] px-2 py-0.5 rounded shadow-xl whitespace-nowrap">
                          {tooltipText}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {targetUrl && (
            <div
              className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors cursor-pointer group-hover:text-zinc-800 dark:group-hover:text-zinc-200 sm:text-[12px]"
              onClick={handleOpenLive}
            >
              View Project
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Outer Wrapper Skeleton */}
      <div className="relative w-full aspect-[1.25] rounded-xl border border-black/5 dark:border-white/5 bg-zinc-50/80 dark:bg-[#09090b]/80 shadow-sm p-3.5 pb-0 flex flex-col overflow-hidden sm:aspect-[1.4] sm:p-4 sm:pb-0">
        {/* Floating Screenshot Skeleton */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[78%] rounded-t-[10px] bg-zinc-100/70 dark:bg-zinc-900/70 border border-black/5 dark:border-white/15 border-b-0 overflow-hidden p-1.5 pb-0">
          <Skeleton className="size-full rounded-t-[8px] bg-zinc-200/70 dark:bg-zinc-800/70" />
        </div>
      </div>

      {/* Content Area Skeleton */}
      <div className="mt-4 flex flex-col px-0.5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36 bg-zinc-200/80 dark:bg-zinc-800/80" />
          <Skeleton className="h-5 w-16 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60" />
        </div>

        <div className="mt-2.5 space-y-1.5 pr-2">
          <Skeleton className="h-3.5 w-full bg-zinc-200/60 dark:bg-zinc-800/60" />
          <Skeleton className="h-3.5 w-3/4 bg-zinc-200/60 dark:bg-zinc-800/60" />
        </div>

        <div className="flex items-center justify-between gap-3 mt-3">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-4 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            <Skeleton className="h-4 w-4 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            <Skeleton className="h-4 w-12 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
          </div>

          <Skeleton className="h-3.5 w-20 bg-zinc-200/60 dark:bg-zinc-800/60" />
        </div>
      </div>
    </div>
  );
}

export function ProjectsListSkeleton() {
  return (
    <div className="flex flex-col relative z-10 w-full">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 md:gap-y-0 pb-10 md:pb-6">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>

      {/* Middle Horizontal Line Container */}
      <div className="relative w-full h-0 hidden md:block">
        <div
          className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/25 pointer-events-none"
          style={{
            maskImage:
              "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
            WebkitMaskImage:
              "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
          }}
        />
        <div className="absolute top-0 -left-4 w-0.5 h-0.5 bg-black/40 dark:bg-white/25 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute top-0 -right-4 w-0.5 h-0.5 bg-black/40 dark:bg-white/25 translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute top-0 left-1/2 w-0.5 h-0.5 bg-black/40 dark:bg-white/25 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 md:gap-y-0 pt-0 md:pt-6">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </div>
  );
}

export function ProjectsList({ limit }: { limit?: number } = {}) {
  // Lấy dữ liệu từ bảng projectManage trên Convex
  const convexProjects = useQuery(api.projectManage.getAll);

  // Zustand Store
  const setProjects = useProjectStore((state) => state.setProjects);
  const setRawProjects = useProjectStore((state) => state.setRawProjects);

  // Sắp xếp: Ưu tiên isPinned, sau đó theo thứ tự order
  const projects = useMemo(() => {
    if (!convexProjects) return [];
    return [...convexProjects].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }, [convexProjects]);

  // Lưu toàn bộ dữ liệu vào Zustand store khi dữ liệu Convex cập nhật
  useEffect(() => {
    if (convexProjects && convexProjects.length > 0) {
      setRawProjects(convexProjects);
      setProjects(projects.map(formatConvexProject));
    }
  }, [convexProjects, projects, setProjects, setRawProjects]);

  // Đang tải dữ liệu từ Convex -> Hiển thị Skeleton
  if (convexProjects === undefined) {
    return <ProjectsListSkeleton />;
  }

  // Không có dự án
  if (projects.length === 0) {
    return null;
  }

  // Nếu có giới hạn (limit) thì cắt số lượng, ngược lại hiển thị đầy đủ
  const displayProjects =
    typeof limit === "number" ? projects.slice(0, limit) : projects;

  // Chia danh sách thành từng hàng, mỗi hàng tối đa 2 dự án
  const rows: ConvexProjectRecord[][] = [];
  for (let i = 0; i < displayProjects.length; i += 2) {
    rows.push(displayProjects.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col relative z-10 w-full">
      {rows.map((rowProjects, rowIndex) => {
        const isFirst = rowIndex === 0;
        const isLast = rowIndex === rows.length - 1;

        let paddingClass = "";
        if (isFirst && isLast) {
          paddingClass = "";
        } else if (isFirst) {
          paddingClass = "pb-10 md:pb-6";
        } else if (isLast) {
          paddingClass = "pt-0 md:pt-6";
        } else {
          paddingClass = "pt-0 md:pt-6 pb-10 md:pb-6";
        }

        return (
          <Fragment key={`row-${rowIndex}`}>
            {rowIndex > 0 && (
              <div className="relative w-full h-0 hidden md:block">
                <div
                  className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/25 pointer-events-none"
                  style={{
                    maskImage:
                      "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                    WebkitMaskImage:
                      "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                  }}
                />
                {/* Intersections */}
                <div className="absolute top-0 -left-4 w-0.5 h-0.5 bg-black/40 dark:bg-white/25 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
                <div className="absolute top-0 -right-4 w-0.5 h-0.5 bg-black/40 dark:bg-white/25 translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
                <div className="absolute top-0 left-1/2 w-0.5 h-0.5 bg-black/40 dark:bg-white/25 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
              </div>
            )}

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 md:gap-y-0 ${paddingClass}`}
            >
              {rowProjects.map((project, idx) => {
                const globalIndex = rowIndex * 2 + idx;
                return (
                  <ProjectCard
                    key={project.id || project._id || globalIndex}
                    index={globalIndex}
                    project={project}
                    isPriority={globalIndex === 0}
                  />
                );
              })}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
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

export const ProjectCard = ({
  project,
  isPriority = false,
  index = 0,
}: {
  project: Project;
  isPriority?: boolean;
  index?: number;
}) => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [shouldLoadHoverImage, setShouldLoadHoverImage] = useState(false);
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const router = useRouter();

  const imageSrc =
    mounted && resolvedTheme === "light" && project.lightModeSrc
      ? project.lightModeSrc
      : project.src;

  const statusStr = (project.status || "").toLowerCase();
  const isNotStarted =
    project.title === "Inquiro" || statusStr === "not started";
  const isBuilding =
    project.title === "Blueprint" ||
    project.title === "Scribble3D" ||
    statusStr === "building" ||
    statusStr === "in progress";

  const statusColor = isNotStarted
    ? "bg-zinc-400"
    : isBuilding
      ? "bg-red-500"
      : "bg-emerald-500";
  const statusLabel = project.status
    ? project.status
    : isNotStarted
      ? "Not Started"
      : isBuilding
        ? "Building"
        : "Live";

  return (
    <div
      className="flex flex-col group cursor-pointer"
      onClick={() => {
        if (project.live) window.open(project.live, "_blank");
        else if (project.github) window.open(project.github, "_blank");
        else router.push(`/projects/${project.slug}`);
      }}
      onMouseEnter={() => setShouldLoadHoverImage(true)}
      onFocus={() => setShouldLoadHoverImage(true)}
      onTouchStart={() => setShouldLoadHoverImage(true)}
    >
      {/* Outer Wrapper exactly like screenshot */}
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

        {/* Floating screenshot sitting directly at the bottom of the outer wrapper */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-[85%] rounded-t-[10px] bg-white dark:bg-[#0a0a0a] p-0 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] z-20 border border-black/5 dark:border-white/[0.15] border-b-0"
          variants={{
            rest: { height: "78%", y: 0, x: "-50%" },
            hover: { height: "72%", y: 4, x: "-50%" },
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="size-full overflow-hidden rounded-t-[9px]">
            <Image
              src={imageSrc}
              alt={`${project.title} preview`}
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

      {/* Content Area directly below the wrapper */}
      <div className="mt-4 flex flex-col px-0.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
            {project.title}
          </h3>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/50 w-fit shrink-0">
            <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              {statusLabel}
            </span>
          </div>
        </div>

        <p className="mt-2 sm:mt-1.5 text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed pr-2">
          {project.description}
        </p>

        <div className="flex items-center justify-between gap-3 mt-3">
          <div className="flex gap-2 flex-wrap">
            {project.tech.map((item) => {
              const key = typeof item === "string" ? item : item.label;
              const isIconItem = typeof item === "string";
              const tooltipText = isIconItem
                ? techNames[item]
                : item.tooltip || item.label;
              const uniqueId = `${project.title}-${key}`;

              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setHoveredTech(uniqueId)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  {isIconItem ? (
                    (() => {
                      const TechIcon = iconMap[item];
                      return (
                        <TechIcon className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" />
                      );
                    })()
                  ) : (
                    <span className="px-1.5 py-0.5 rounded border border-black/30 dark:border-white/[0.15] text-[9px] text-zinc-500 dark:text-zinc-400 leading-none">
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

          <div
            className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors cursor-pointer group-hover:text-zinc-800 dark:group-hover:text-zinc-200 sm:text-[12px]"
            onClick={(e) => {
              e.stopPropagation();
              if (project.live) window.open(project.live, "_blank");
              else if (project.github) window.open(project.github, "_blank");
            }}
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
        </div>
      </div>
    </div>
  );
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

// Chuyển đổi dữ liệu record từ bảng projectManage (Convex) sang interface Project
export function formatConvexProject(p: ConvexProjectRecord): Project {
  let tech: TechItem[] = [];

  if (Array.isArray(p.tech)) {
    tech = p.tech.map((t) => (typeof t === "string" ? getTechItem(t) : t));
  } else if (p.contentDetail) {
    try {
      const details = (
        typeof p.contentDetail === "string"
          ? JSON.parse(p.contentDetail)
          : p.contentDetail
      ) as Array<{
        typeContent?: string;
        content?: string;
        contentList?: string[];
      }>;

      if (Array.isArray(details)) {
        for (let i = 0; i < details.length; i++) {
          const item = details[i];
          const isTechTitle =
            (item.typeContent === "title" || item.typeContent === "heading") &&
            /tech\s*stack/i.test(item.content || "");

          if (isTechTitle) {
            const next = details[i + 1];
            if (next && Array.isArray(next.contentList)) {
              tech = next.contentList.map((techName: string) =>
                getTechItem(techName),
              );
              break;
            }
          }
        }
      }
    } catch (e) {
      console.error("Error parsing contentDetail:", e);
    }
  }

  if (tech.length === 0 && p.type) {
    tech = [{ label: p.type }];
  }

  const slug =
    p.id ||
    (p.name
      ? p.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      : p._id);

  return {
    slug,
    title: p.name || "",
    imageTitle: p.name || "",
    src: p.image || "/placeholder.png",
    lightModeSrc: p.image || "/placeholder.png",
    video: p.video || "",
    description: p.description || p.content || "",
    tech,
    github: p.urlGithub || "",
    live: p.urlDemo || "",
    status: p.status || "Completed",
    backgroundImage: p.backgroundImage,
  };
}

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Outer Wrapper Skeleton */}
      <div className="relative w-full aspect-[1.25] rounded-xl border border-black/5 dark:border-white/5 bg-zinc-50/80 dark:bg-[#09090b]/80 shadow-sm p-3.5 pb-0 flex flex-col overflow-hidden sm:aspect-[1.4] sm:p-4 sm:pb-0">
        {/* Floating Screenshot Skeleton */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[78%] rounded-t-[10px] bg-zinc-100/70 dark:bg-zinc-900/70 border border-black/5 dark:border-white/[0.15] border-b-0 overflow-hidden p-1.5 pb-0">
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
        <div className="absolute top-0 -left-4 w-[2px] h-[2px] bg-black/40 dark:bg-white/25 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute top-0 -right-4 w-[2px] h-[2px] bg-black/40 dark:bg-white/25 translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute top-0 left-1/2 w-[2px] h-[2px] bg-black/40 dark:bg-white/25 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 md:gap-y-0 pt-0 md:pt-6">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </div>
  );
}

export function ProjectsList() {
  // Lấy dữ liệu từ bảng projectManage trên Convex
  const convexProjects = useQuery(api.projectManage.getAll);

  // Zustand Store
  const setProjects = useProjectStore((state) => state.setProjects);
  const setRawProjects = useProjectStore((state) => state.setRawProjects);

  // Map dữ liệu Convex theo thứ tự từ trên xuống dưới (KHÔNG dùng mockup data)
  const projects: Project[] = useMemo(() => {
    if (!convexProjects) return [];
    return convexProjects.map(formatConvexProject);
  }, [convexProjects]);

  // Lưu toàn bộ dữ liệu vào Zustand store khi dữ liệu Convex cập nhật
  useEffect(() => {
    if (convexProjects && convexProjects.length > 0) {
      setRawProjects(convexProjects);
      setProjects(projects);
    }
  }, [convexProjects, projects, setProjects, setRawProjects]);

  // Đang tải dữ liệu từ Convex -> Hiển thị Skeleton, không dùng mockup
  if (convexProjects === undefined) {
    return <ProjectsListSkeleton />;
  }

  // Không có dự án
  if (projects.length === 0) {
    return null;
  }

  // Chỉ hiển thị tối đa 4 dự án tại màn hình này
  const displayProjects = projects.slice(0, 4);

  return (
    <div className="flex flex-col relative z-10 w-full">
      {/* Row 1: 2 dự án đầu tiên */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 md:gap-y-0 pb-10 md:pb-6">
        {displayProjects.slice(0, 2).map((project, idx) => (
          <ProjectCard
            key={project.slug || project.title || idx}
            index={idx}
            project={project}
            isPriority={idx === 0}
          />
        ))}
      </div>

      {/* Middle Horizontal Line Container */}
      {displayProjects.length > 2 && (
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

      {/* Row 2: 2 dự án tiếp theo (tối đa 4 cái) */}
      {displayProjects.length > 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 md:gap-y-0 pt-0 md:pt-6">
          {displayProjects.slice(2, 4).map((project, idx) => (
            <ProjectCard
              key={project.slug || project.title || idx}
              index={idx + 2}
              project={project}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const techIconMap: Record<string, string> = {
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  python: "python",
  dart: "dart",
  react: "react",
  "react.js": "react",
  next: "nextdotjs",
  "next.js": "nextdotjs",
  nextjs: "nextdotjs",
  zustand:
    "https://raw.githubusercontent.com/pmndrs/zustand/main/docs/favicon.ico",
  "tanstack query": "reactquery",
  "react query": "reactquery",
  tailwind: "tailwindcss",
  "tailwind css": "tailwindcss",
  tailwindcss: "tailwindcss",
  shadcn: "shadcnui",
  "shadcn/ui": "shadcnui",
  mui: "mui",
  "ant design": "antdesign",
  threejs: "threedotjs",
  "three.js": "threedotjs",
  flutter: "flutter",
  blazor: "blazor",
  node: "nodedotjs",
  "node.js": "nodedotjs",
  mongodb: "mongodb",
  prisma: "prisma",
  convex: "convex",
  clerk: "clerk",
  pusher: "pusher",
  cesium: "cesium",
  ceisum: "cesium",
  arcgis: "arcgis",
  autodesk: "autodesk",
  "autodesk forge": "autodesk",
  "autodesk viewer": "autodesk",
  figma: "figma",
  webpack: "webpack",
  npm: "npm",
  postman: "postman",
  github: "github",
  git: "git",
  "source tree": "sourcetree",
  sourcetree: "sourcetree",
  vercel: "vercel",
  cloudinary: "cloudinary",
  "c#": "dotnet",
  csharp: "dotnet",
  dotnet: "dotnet",
  ".net": "dotnet",
  revit: "autodeskrevit",
  "revit api": "autodeskrevit",
  autocad: "autocad",
  enscape: "enscape",
  twinmotion: "twinmotion",
  "microsoft office": "https://cdn.simpleicons.org/microsoft/71717a",
  "microsoft office add-ins": "https://cdn.simpleicons.org/microsoft/71717a",
  docker: "docker",
  html: "html5",
  html5: "html5",
  css: "css3",
  css3: "css3",
};

export function getTechIcon(name: string): string | null {
  const normalized = name.toLowerCase().trim();
  const icon = techIconMap[normalized];
  if (icon) {
    return icon.startsWith("http")
      ? icon
      : `https://cdn.simpleicons.org/${icon}/71717a`;
  }
  return null;
}

export interface TechBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  tech: string;
  className?: string;
}

export function TechBadge({ tech, className, ...props }: TechBadgeProps) {
  const iconSrc = getTechIcon(tech);

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 px-2 py-1 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#0a0a0a] dark:hover:bg-[#121214] border border-black/30 dark:border-white/15 rounded transition-colors duration-200 cursor-default",
        className,
      )}
      {...props}
    >
      {iconSrc && (
        <Image
          src={iconSrc}
          alt={tech}
          width={14}
          height={14}
          unoptimized
          className={`size-3 opacity-80 shrink-0 ${
            iconSrc.startsWith("http") && !iconSrc.includes("simpleicons.org")
              ? "rounded-sm grayscale"
              : ""
          }`}
        />
      )}
      <span className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400">
        {tech}
      </span>
    </div>
  );
}

export default TechBadge;

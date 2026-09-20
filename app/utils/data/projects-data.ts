import type { ComponentType } from "react";
import { Network, Search } from "lucide-react";
import {
  SiNextdotjs,
  SiTypescript,
  SiReact,
  SiThreedotjs,
  SiPrisma,
  SiCloudflare,
  SiLangchain,
  SiNodedotjs,
  SiFramer,
  SiTailwindcss,
  SiBun,
  SiEslint,
  SiRadixui,
  SiChartdotjs,
  SiGithub,
  SiFastapi,
  SiRedis,
  SiCelery,
  SiTldraw,
  SiCss,
  SiPython,
  SiAnthropic,
  SiClaude,
  SiGooglegemini,
  SiMeta,
  SiWebpack,
  SiConvex,
  SiMongodb,
  SiClerk,
  SiPusher,
  SiShadcnui,
  SiDart,
  SiFlutter,
  SiAntdesign,
  SiRedux,
  SiAxios,
} from "react-icons/si";
import { FaFilePdf } from "react-icons/fa";
import { TbBrandThreejs } from "react-icons/tb";
export type TechIcon = ComponentType<{ className?: string }>;
export type TechKey =
  | "next"
  | "ts"
  | "react"
  | "three"
  | "prisma"
  | "cloud"
  | "langchain"
  | "langgraph"
  | "rag"
  | "node"
  | "motion"
  | "tailwind"
  | "bun"
  | "eslint"
  | "radixui"
  | "charts"
  | "github"
  | "fastapi"
  | "redis"
  | "celery"
  | "tldraw"
  | "css3"
  | "python"
  | "anthropic"
  | "claude"
  | "gemini"
  | "llama"
  | "webpack"
  | "tiptap"
  | "mongodb"
  | "convex"
  | "clerk"
  | "pusher"
  | "shadcn"
  | "pdf"
  | "dart"
  | "flutter"
  | "antdesign"
  | "redux"
  | "axios"
  | "threejs";

export type TechItem = TechKey | { label: string; tooltip?: string };

export interface Project {
  slug: string;
  title: string;
  imageTitle: string;
  src: string;
  lightModeSrc?: string;
  video: string;
  description: string;
  tech: TechItem[];
  github: string;
  live: string;
  starsText?: string;
  backgroundImage?: string;
  hasPin?: boolean;
  status?: string;
}

export const iconMap: Record<TechKey, TechIcon> = {
  next: SiNextdotjs,
  ts: SiTypescript,
  react: SiReact,
  three: SiThreedotjs,
  prisma: SiPrisma,
  cloud: SiCloudflare,
  langchain: SiLangchain,
  langgraph: Network,
  rag: Search,
  node: SiNodedotjs,
  motion: SiFramer,
  tailwind: SiTailwindcss,
  bun: SiBun,
  eslint: SiEslint,
  radixui: SiRadixui,
  charts: SiChartdotjs,
  github: SiGithub,
  fastapi: SiFastapi,
  redis: SiRedis,
  celery: SiCelery,
  tldraw: SiTldraw,
  css3: SiCss,
  python: SiPython,
  anthropic: SiAnthropic,
  claude: SiClaude,
  gemini: SiGooglegemini,
  llama: SiMeta,
  webpack: SiWebpack,
  tiptap: SiTldraw,
  mongodb: SiMongodb,
  clerk: SiClerk,
  convex: SiConvex,
  pusher: SiPusher,
  shadcn: SiShadcnui,
  pdf: FaFilePdf,
  dart: SiDart,
  flutter: SiFlutter,
  antdesign: SiAntdesign,
  redux: SiRedux,
  axios: SiAxios,
  threejs: TbBrandThreejs,
};

export const techNames: Record<TechKey, string> = {
  next: "Next.js",
  ts: "TypeScript",
  react: "React",
  three: "Three.js",
  prisma: "Prisma",
  cloud: "Cloudflare",
  langchain: "LangChain",
  langgraph: "LangGraph",
  rag: "RAG",
  node: "Node.js",
  motion: "Framer Motion",
  tailwind: "Tailwind CSS",
  bun: "Bun",
  eslint: "ESLint",
  radixui: "Radix UI",
  charts: "Charts",
  github: "GitHub API",
  fastapi: "FastAPI",
  redis: "Redis",
  celery: "Celery",
  tldraw: "tldraw",
  css3: "CSS3",
  python: "Python",
  anthropic: "Anthropic",
  claude: "Claude",
  gemini: "Gemini",
  llama: "LLaMA",
  webpack: "Webpack",
  tiptap: "Tiptap",
  mongodb: "MongoDB",
  clerk: "Clerk",
  convex: "Convex",
  pusher: "Pusher",
  shadcn: "Shadcn UI",
  pdf: "PDF",
  dart: "Dart",
  flutter: "Flutter",
  antdesign: "Ant Design",
  redux: "Redux",
  axios: "Axios",
  threejs: "Threejs",
};

/**
 * Tự động tìm TechKey phù hợp từ tên công nghệ bất kỳ dựa trên iconMap và techNames
 */
export function getTechItem(name: string): TechItem {
  const cleanInput = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  if (!cleanInput) return { label: name.trim() };

  // 1. Kiểm tra trực tiếp theo TechKey trong iconMap
  if (cleanInput in iconMap) {
    return cleanInput as TechKey;
  }

  // 2. So sánh thông minh với key và full name trong techNames
  for (const [key, fullName] of Object.entries(techNames) as [
    TechKey,
    string,
  ][]) {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanFull = fullName.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (
      cleanInput === cleanKey ||
      cleanInput === cleanFull ||
      cleanInput === `${cleanKey}js` ||
      cleanInput === `${cleanFull}js` ||
      (cleanFull.length > 3 && cleanFull.startsWith(cleanInput)) ||
      (cleanInput.length > 3 && cleanInput.startsWith(cleanKey))
    ) {
      return key;
    }
  }

  // Nếu không có icon phù hợp thì hiển thị dạng badge
  return { label: name.trim() };
}

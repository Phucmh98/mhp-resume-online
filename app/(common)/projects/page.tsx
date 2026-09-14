import type { Metadata } from "next";
import { HorizontalLine } from "@/components/horizontal-line";
import { ProjectsList } from "@/components/project-list";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects | Phuc's Blog",
  description: "Personal and professional development projects.",
};

export default function ProjectsPage() {
  return (
    <>
      <div className="px-4  h-28 flex items-center">
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="group flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>
          <div className="flex flex-col justify-center">
            <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
              All Projects
            </h1>
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
              Full Project Archive
            </p>
          </div>
        </div>
      </div>

      <HorizontalLine bleed />
      <div className="relative pt-6 pb-12 px-4">
        {/* Center Vertical Line */}
        <div
          className="absolute inset-y-0 left-1/2 w-0 border-r border-black/30 dark:border-white/25 pointer-events-none hidden md:block"
          style={{
            maskImage:
              "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
            WebkitMaskImage:
              "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
          }}
        />
        <ProjectsList />
      </div>
    </>
  );
}

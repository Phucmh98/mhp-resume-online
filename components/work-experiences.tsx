import Link from "next/link";
import { ExperienceList } from "./experience-list";
import HorizontalLine from "./horizontal-line";

export default function WorkExperiences() {
  return (
    <>
      <h2 className="px-4 py-2 text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Experiences
      </h2>
      <HorizontalLine bleed />
      <ExperienceList />
      <HorizontalLine bleed />
      <div className="py-4 px-4 flex justify-center relative hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer rounded-b-lg mt-0 z-20">
        <Link href="/experience" className="relative group block mt-0">
          <div className="absolute -inset-1.25 border border-black/5 dark:border-white/15 rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/20" />
          <div className="relative flex items-center gap-1.5 px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[6px] text-[13px] font-medium transition-all duration-300 border border-black/5 dark:border-white/10 shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80">
            View All
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        </Link>
      </div>
    </>
  );
}

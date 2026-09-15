'use client'
import HorizontalLine from "./horizontal-line";
import { blogsData } from "@/app/utils/data/blogs-data";
import { ArrowRight, ArrowUpRight, Calendar } from "lucide-react";
import { useState } from "react";
import OppsDialog from "./dialog/opps-dialog";

export default function BlogSection() {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <h2 className="px-4 py-2 text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Blogs
      </h2>
      <HorizontalLine bleed />
      <div className="relative  mx-4">
        {blogsData.map((blog, idx) => {
          const isLast = idx === blogsData.length - 1;

          return (
            <div
              key={blog.title || idx}
              role="button"
              tabIndex={0}
              onClick={() => setOpenDialog(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenDialog(true);
                }
              }}
              className="group relative block -mx-4 px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer select-none"
            >
              {/* Dashed bottom border for all items except the last one */}
              {!isLast && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0 border-b border-black/30 dark:border-white/25 pointer-events-none z-10"
                  style={{
                    maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                    WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                  }}
                />
              )}

              {/* Special full-width dashed line and intersection dots for the last item */}
              {isLast && (
                <>
                  <div
                    className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/25 pointer-events-none z-10"
                    style={{
                      maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                      WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                    }}
                  />
                  <div className="absolute bottom-0 left-0 w-0.5 h-0.5 bg-black/40 dark:bg-white/25 -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
                  <div className="absolute bottom-0 right-0 w-0.5 h-0.5 bg-black/40 dark:bg-white/25 translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
                </>
              )}

              <div className="flex items-start sm:items-center justify-between w-full">
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-[14px] md:text-[15px] font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-6">
                    {blog.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-[12px] text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{blog.date}</span>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden sm:block w-px h-3 bg-zinc-300 dark:bg-zinc-700" />

                    <div className="flex flex-wrap items-center gap-2">
                      {blog.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2 py-0.5 rounded-[4px] border border-black/30 dark:border-white/25 text-[11px] text-zinc-600 dark:text-zinc-400 bg-white/50 dark:bg-black/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="ml-4 shrink-0 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                  {blog.isExternal ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* View All Button */}
      <div className="py-4 px-4 flex justify-center relative hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer rounded-b-lg mt-0 z-20">
        <button
          type="button"
          onClick={() => setOpenDialog(true)}
          className="relative group block mt-0 cursor-pointer"
        >
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
        </button>
      </div>
      {openDialog && <OppsDialog open={openDialog} onClose={() => setOpenDialog(false)} />}

    </>
  );
}

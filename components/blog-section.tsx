import { Wrench } from "lucide-react";
import HorizontalLine from "./horizontal-line";

export default function BlogSection() {
  return (
    <>
      <h2 className="px-4 py-2 text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Blogs
      </h2>
      <HorizontalLine bleed />
      <div className="relative py-10 mx-4">
        <div className="flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 animate-pulse">
          <Wrench className="h-4 w-4 shrink-0" />
          <p className="text-sm font-medium tracking-wide">
            Currently under maintenance...
          </p>
        </div>
      </div>
    </>
  );
}

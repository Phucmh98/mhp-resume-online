"use client";

import * as React from "react";
import Image from "next/image";
import {
  gallerys,
  type Gallery as GalleryItem,
} from "@/app/utils/data/gallerys-data";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <div className="relative group flex h-full w-70 shrink-0 p-1 sm:w-75">
      {/* Outer subtle double-border frame matching portfolio design language */}
      <div className="absolute inset-0 border border-black/5 dark:border-white/5 rounded-[10px] pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />

      {/* Main Card Body */}
      <div className="relative flex h-full w-full flex-col rounded-[6px] overflow-hidden bg-zinc-50 dark:bg-[#09090b] border border-black/5 dark:border-white/5 shadow-sm shadow-black/5 dark:shadow-lg dark:shadow-black/80 transition-all duration-300 group-hover:bg-zinc-100/80 dark:group-hover:bg-[#121214]">
        {/* Screenshot Image Container */}
        <div className="relative w-full aspect-video bg-zinc-100 dark:bg-[#0a0a0a] overflow-hidden pb-0.5">
          <Image
            src={item.url}
            alt={item.title}
            className="h-full w-full scale-[1.01] transform-gpu object-cover object-top grayscale transition-[filter,transform] duration-300 will-change-transform group-hover:scale-[1.03] group-hover:grayscale-0"
            width={500}
            height={500 * (9 / 16)}
            sizes="(min-width: 640px) 300px, 280px"
            quality={70}
            decoding="async"
          />
        </div>

        {/* Signature Dashed Divider Motif */}
        <div
          className="h-px bg-black/30 dark:bg-white/25"
          style={{
            maskImage:
              "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
            WebkitMaskImage:
              "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
          }}
        />

        {/* Info Content Section */}
        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <p className="wrap-break-word text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 leading-snug transition-colors group-hover:text-zinc-900 dark:group-hover:text-white">
            {item.title}
          </p>
          <p className="wrap-break-word text-[12px] text-zinc-500 dark:text-zinc-400 leading-snug">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Gallery() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [isVisible, setIsVisible] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!api || !isVisible) return;

    const interval = window.setInterval(() => {
      api.scrollNext();
    }, 2500);

    return () => window.clearInterval(interval);
  }, [api, isVisible]);

  return (
    <div ref={rootRef} className="relative py-4">
      {/* Left fade mask */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-white dark:from-black to-transparent z-10 pointer-events-none" />
      {/* Right fade mask */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-white dark:from-black to-transparent z-10 pointer-events-none" />

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="items-stretch">
          {gallerys.map((item) => (
            <CarouselItem
              key={item.url}
              className="flex basis-auto self-stretch"
            >
              <GalleryCard item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default Gallery;

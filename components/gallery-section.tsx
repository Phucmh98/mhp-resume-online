import Gallery from "./gallery";
import HorizontalLine from "./horizontal-line";

export default function GallerySection() {
  return (
    <>
      <h2 className="px-4 py-2 text-[18px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
        Gallery
      </h2>
      <HorizontalLine bleed />
      <div className="relative px-4">
        <Gallery />
      </div>
    </>
  );
}

import { CurrentTime } from "@/components/current-time";
import HorizontalLine from "@/components/horizontal-line";

export default function CommonSubpageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-80 relative shrink-0">
        <div className="absolute bottom-0 right-0 px-4 py-2">
          <CurrentTime />
        </div>
      </div>
      <HorizontalLine bleed />
      <div className="flex-1 w-full">{children}</div>
      <HorizontalLine bleed />
      <div className="h-16 shrink-0" />
    </div>
  );
}

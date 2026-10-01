import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HorizontalLine } from "@/components/horizontal-line";
import { ElasticButton } from "@/components/ui/elastic-button";

export const metadata: Metadata = {
    title: "Magic Tree QR | Phuc's Blog",
    description: "Interactive 3D Magic Tree QR Code",
};

export default function TreeQRPage() {
    return (
        <>
            <div className="px-4 h-28 flex items-center">
                <div className="flex items-center gap-5">
                    <Link
                        href="/"
                        className="group flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
                            Magic Tree QR
                        </h1>
                        <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                            Interactive 3D Canvas
                        </p>
                    </div>
                </div>
            </div>

            <HorizontalLine bleed />

            <div className="w-full flex-1 flex flex-col items-center justify-center p-6 min-h-95 gap-6 relative">
                {/* Image switcher with 3-outline ripple and hold-to-shrink */}
                <div className="flex flex-col items-center gap-3">
                    <ElasticButton
                        src1="/asset/images/bg-retro-1.jpg"
                        src2="/asset/images/bg-retro-2.jpg"
                        alt="Switch Image Demo"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded border border-black/15 dark:border-white/15"
                        pressedScale={0.90}
                        popScale={1.06}
                        hoverScale={1.02}
                        rippleClassName="border-emerald-500 dark:border-emerald-400"
                        img2BorderOffset={5}
                        img2BorderWidth={2}
                        rippleDuration={0.5}
                    >

                    </ElasticButton>


                    <span className="text-[12px] text-zinc-500 dark:text-zinc-400 select-none">
                        Ấn chuột: lan tỏa 6 vòng outline • Nhả chuột: nảy lò xo & đổi ảnh
                    </span>
                </div>
            </div>
        </>
    );
}

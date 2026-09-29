import { TreeQRCard } from "@/components/tree-qr-card";
import { FaRegHandPointLeft } from "react-icons/fa6";
import ShineText from "./smoothui/shine-text";

interface SubpageFooterProps {
    className?: string;
}

export function SubpageFooter({ className = "" }: SubpageFooterProps) {
    return (
        <footer
            className={`w-full py-3 px-4 flex items-center justify-between gap-4 shrink-0 ${className}`}
        >
            <div className="flex items-center gap-4">
                <div className="border-[1.5px] p-1 rounded dark:border-zinc-200/30 border-black/10">

                    <TreeQRCard />
                </div>
                <div className="flex flex-col justify-center text-left">
                    <span className="text-[14px] font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight mb-1">
                        Contact me
                    </span>
                    <div className="relative flex items-center ml-2 sm:ml-2.5">
                        {/* Icon bàn tay chỉ ngón sang trái dạng nét viền outline thanh thoát */}
                        <div className="absolute -left-6 sm:-left-5.5 flex items-center justify-center animate-point-left pointer-events-none select-none text-zinc-400 dark:text-zinc-500">
                            <FaRegHandPointLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </div>
                        <ShineText className="text-zinc-400 dark:text-zinc-500 font-handwriting text-[18px] sm:text-[20px] leading-[1.05] font-bold -rotate-4" duration={3}>
                            Click to scan QR.
                        </ShineText>
                    </div>
                </div>
            </div>

            {/* Copyright nằm sát dưới bên phải */}
            <div className="self-end flex flex-col items-end text-right   pb-0.5">
                <span className="text-zinc-800 dark:text-zinc-100 text-[11.5px]">© {new Date().getFullYear()} Blah blah blah</span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500">This is a footer.</span>
            </div>
        </footer>
    );
}

export default SubpageFooter;


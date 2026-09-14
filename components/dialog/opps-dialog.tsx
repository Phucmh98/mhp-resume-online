import Image from "next/image"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Wrench } from "lucide-react"

interface OppsDialogProps {
    open?: boolean
    onClose?: () => void
}

export default function OppsDialog({ open, onClose }: OppsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose?.() }}>
            <DialogContent className={'rounded-md pb-0'}>
                <DialogHeader>
                    <DialogTitle className="font-bold text-zinc-900 dark:text-zinc-100 ">
                        Oops! Still working on it...
                    </DialogTitle>
                    <DialogDescription className="h-40 relative flex items-center justify-center text-center">

                        <div className="z-10 px-4 text-center  text-zinc-600 dark:text-zinc-300 leading-relaxed mb-10 flex items-center gap-1.5 ">
                            <Wrench className="size-4.5 text-zinc-600 dark:text-zinc-300" strokeWidth={1.5} />
                            I&apos;m currently trying to fix it.
                        </div>
                        <div className="absolute bottom-0 right-0 pointer-events-none">
                            <Image
                                src="/asset/images/over-it-done.gif"
                                alt="Over it done"
                                width={170}
                                height={200}
                                unoptimized
                            />
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}



"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Spinner from "@/components/ui/spinner";

interface TreeQRCardProps {
    className?: string;
    /**
     * Query string slug or custom URL encoded query for the tree
     * Default is LinkedIn QR code
     */
    query?: string;
}

export function TreeQRCard({
    className = "",
    query = "MDNodHRwczovL3d3dy5saW5rZWRpbi5jb20vaW4vbWhwaHVjOTgv",
}: TreeQRCardProps) {
    const [isLoading, setIsLoading] = useState(!!query);
    const [hasError, setHasError] = useState(!query);
    const [prevQuery, setPrevQuery] = useState(query);

    if (query !== prevQuery) {
        setPrevQuery(query);
        setIsLoading(!!query);
        setHasError(!query);
    }

    return (
        <div
            className={cn(
                "w-37.5 h-42.5 rounded overflow-hidden relative flex items-center justify-center bg-[#f6f1e7] dark:bg-[#1a1918] border border-zinc-200/60 dark:border-zinc-800/60 shadow-md",
                isLoading && !hasError && "animate-pulse",
                className
            )}
        >
            {hasError ? (
                <div className="size-full flex items-center justify-center text-muted-foreground">
                    <span className="text-xs font-medium">Failed to load</span>
                </div>
            ) : (
                <iframe
                    src={`/api/treeqr?q=${encodeURIComponent(query)}`}
                    title="Magic Tree QR"
                    className={cn(
                        "w-70 h-70 shrink-0 border-0 bg-transparent scale-[0.7] origin-center pointer-events-auto translate-y-2",
                        isLoading && "scale-[0.68] blur-xl grayscale"
                    )}
                    style={{
                        transition: "filter 700ms ease, transform 300ms ease",
                    }}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    onLoad={() => {
                        setIsLoading(false);
                    }}
                    onError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                />
            )}

            {isLoading && !hasError && (
                <div
                    className={cn(
                        "absolute left-0 top-0 flex size-full items-center justify-center backdrop-blur-md bg-white/20 dark:bg-black/20"
                    )}
                >
                    <Spinner className="size-6 text-zinc-600 dark:text-zinc-300" />
                </div>
            )}
        </div>
    );
}

export default TreeQRCard;



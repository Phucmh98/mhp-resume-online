

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
    return (
        <div
            className={`w-37.5 h-42.5 rounded  overflow-hidden relative flex items-center justify-center bg-[#f6f1e7] dark:bg-[#1a1918] border border-zinc-200/60 dark:border-zinc-800/60 shadow-md ${className}`}
        >
            <iframe
                src={`/api/treeqr?q=${encodeURIComponent(query)}`}
                title="Magic Tree QR"
                className="w-70 h-70 shrink-0 border-0 bg-transparent scale-[0.7] origin-center pointer-events-auto translate-y-2"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            />
        </div>
    );
}

export default TreeQRCard;

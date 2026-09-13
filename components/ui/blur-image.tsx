"use client";

import Image from "next/image";

import { forwardRef, useState } from "react";

import { cn } from "@/lib/utils";
import Spinner from "./spinner";

type ImageProps = {
  description?: string | React.ReactNode;
  imageClassName?: string;
  lazy?: boolean;
} & React.ComponentPropsWithoutRef<typeof Image>;

const BlurImage = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const { alt, src, className, imageClassName, lazy = true, ...rest } = props;
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(!src);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoading(!!src);
    setHasError(!src);
  }

  return (
    <div
      className={cn(
        "group relative flex w-full h-full items-center justify-center overflow-hidden bg-secondary/20",
        isLoading && !hasError && "animate-pulse",
        className,
      )}
      data-description={props.description}
    >
      {hasError ? (
        <div
          className={cn(
            "size-full flex items-center justify-center bg-secondary/50 text-muted-foreground",
            imageClassName,
          )}
        >
          <span className="text-xs font-medium">No Image</span>
        </div>
      ) : (
        <Image
          unoptimized
          ref={ref}
          className={cn(
            "size-full object-cover",
            isLoading && "scale-[1.02] object-cover blur-xl grayscale",
            imageClassName,
          )}
          style={{
            transition: "filter 700ms ease, transform 150ms ease",
          }}
          src={src as string}
          alt={alt || "Image"}
          loading={lazy ? "lazy" : undefined}
          priority={!lazy}
          quality={100}
          onLoad={() => {
            setIsLoading(false);
          }}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          {...rest}
        />
      )}
      {isLoading && !hasError && (
        <div
          className={cn(
            "absolute left-0 top-0 flex size-full items-center justify-center backdrop-blur-md",
          )}
        >
          <Spinner className="size-6 text-mist-800" />
        </div>
      )}
    </div>
  );
});

BlurImage.displayName = "BlurImage";

export { BlurImage };

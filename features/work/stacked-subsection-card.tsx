"use client";

import Image from "next/image";
import Link from "next/link";

import { HoverLift } from "@/components/motion/hover-lift";
import { cn } from "@/lib/utils";
import type { WorkSubsection } from "@/types/work-tree";

type StackedSubsectionCardProps = {
  categorySlug: string;
  subsection: WorkSubsection;
  className?: string;
};

export function StackedSubsectionCard({
  categorySlug,
  subsection,
  className,
}: StackedSubsectionCardProps) {
  const layers = [
    subsection.cover,
    ...subsection.stackPreview.slice(0, 3),
  ].filter(
    (item, index, arr) => arr.findIndex((x) => x.src === item.src) === index,
  );

  return (
    <HoverLift className={cn("block", className)}>
      <Link
        href={`/projects/${categorySlug}/${subsection.slug}`}
        className="group block"
      >
        <div className="relative aspect-[4/5] w-full">
          {layers.map((layer, index) => {
            const fromBack = layers.length - 1 - index;
            const offset = fromBack * 10;
            const rotate =
              fromBack % 2 === 0 ? -fromBack * 2.5 : fromBack * 2.5;
            const isFront = index === 0;
            const src = layer.thumbSrc ?? layer.src;

            return (
              <div
                key={`${layer.src}-${index}`}
                className={cn(
                  "bg-muted absolute inset-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.65)] transition-transform duration-300 ease-out",
                  isFront
                    ? "z-20 group-hover:-translate-y-2 group-hover:scale-[1.02]"
                    : "z-10 opacity-90 group-hover:opacity-100",
                )}
                style={
                  isFront
                    ? undefined
                    : {
                        transform: `translate(${offset}px, ${offset * 0.6}px) rotate(${rotate}deg) scale(${1 - fromBack * 0.04})`,
                        zIndex: 20 - fromBack,
                      }
                }
              >
                {layer.kind === "video" ? (
                  <video
                    src={layer.src}
                    muted
                    playsInline
                    className="size-full object-cover"
                  />
                ) : (
                  <Image
                    src={src}
                    alt={layer.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 90vw, 30vw"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-5 space-y-1 px-1">
          <h2 className="font-display text-2xl font-semibold tracking-tight transition-opacity duration-200 group-hover:opacity-80">
            {subsection.title}
          </h2>
          {subsection.subtitle ? (
            <p className="text-muted-foreground text-sm">
              {subsection.subtitle}
            </p>
          ) : (
            <p className="text-muted-foreground text-xs tracking-[0.14em] uppercase">
              {subsection.stacks.length > 0
                ? `${subsection.stacks.length} collections`
                : `${Math.max(subsection.media.length, 1)} pieces`}
            </p>
          )}
        </div>
      </Link>
    </HoverLift>
  );
}

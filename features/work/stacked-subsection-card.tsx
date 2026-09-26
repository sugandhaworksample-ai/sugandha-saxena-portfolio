"use client";

import Image from "next/image";
import Link from "next/link";

import { HoverLift } from "@/components/motion/hover-lift";
import { cn } from "@/lib/utils";
import type { WorkMedia, WorkStackNode, WorkSubsection } from "@/types/work-tree";

type StackedSubsectionCardProps = {
  className?: string;
} & (
  | {
      categorySlug: string;
      subsection: WorkSubsection;
      stack?: never;
      onOpen?: never;
    }
  | {
      stack: WorkStackNode;
      onOpen: () => void;
      categorySlug?: never;
      subsection?: never;
    }
);

export function StackedSubsectionCard(props: StackedSubsectionCardProps) {
  const { className } = props;
  const layers = (
    "subsection" in props && props.subsection
      ? [props.subsection.cover, ...props.subsection.stackPreview.slice(0, 3)]
      : props.stack.items.slice(0, 4)
  ).filter(
    (item, index, arr) => arr.findIndex((x) => x.src === item.src) === index,
  );
  const title =
    "subsection" in props && props.subsection
      ? props.subsection.title
      : props.stack.title;
  const meta =
    "subsection" in props && props.subsection
      ? props.subsection.subtitle
        ? props.subsection.subtitle
        : props.subsection.stacks.length > 0
          ? `${props.subsection.stacks.length} collections`
          : `${Math.max(props.subsection.media.length, 1)} pieces`
      : `${props.stack.items.length} images`;

  const frame = (
    <>
      <StackFrame layers={layers} />
      <div className="mt-5 space-y-1 px-1">
        <h2 className="font-display text-2xl font-semibold tracking-tight transition-opacity duration-200 group-hover:opacity-80">
          {title}
        </h2>
        <p
          className={
            "subsection" in props && props.subsection?.subtitle
              ? "text-muted-foreground text-sm"
              : "text-muted-foreground text-xs tracking-[0.14em] uppercase"
          }
        >
          {meta}
        </p>
      </div>
    </>
  );

  return (
    <HoverLift className={cn("block", className)}>
      {"onOpen" in props && props.onOpen ? (
        <button
          type="button"
          onClick={props.onOpen}
          className="group block w-full cursor-pointer text-left"
        >
          {frame}
        </button>
      ) : (
        <Link
          href={`/projects/${props.categorySlug}/${props.subsection.slug}`}
          className="group block"
        >
          {frame}
        </Link>
      )}
    </HoverLift>
  );
}

function StackFrame({ layers }: { layers: WorkMedia[] }) {
  return (
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
  );
}

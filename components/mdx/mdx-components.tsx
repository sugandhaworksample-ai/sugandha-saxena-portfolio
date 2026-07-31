import type { ComponentPropsWithoutRef } from "react";

type HeadingProps = ComponentPropsWithoutRef<"h2">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type AnchorProps = ComponentPropsWithoutRef<"a">;

export const mdxComponents = {
  h2: (props: HeadingProps) => (
    <h2
      className="font-display mt-10 mb-4 text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props: HeadingProps) => (
    <h3
      className="font-display mt-8 mb-3 text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  p: (props: ParagraphProps) => (
    <p className="text-muted-foreground mb-4 text-base leading-7" {...props} />
  ),
  ul: (props: ListProps) => (
    <ul
      className="text-muted-foreground mb-4 list-disc space-y-2 pl-5"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="text-muted-foreground mb-4 list-decimal space-y-2 pl-5"
      {...props}
    />
  ),
  a: (props: AnchorProps) => (
    <a
      className="text-foreground hover:text-accent font-medium underline-offset-4 transition-colors duration-200 hover:underline"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="text-foreground font-semibold" {...props} />
  ),
};

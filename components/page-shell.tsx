import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
      <div className="max-w-3xl space-y-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground text-lg text-pretty">
            {description}
          </p>
        ) : null}
      </div>
      {children ? <div className="mt-12">{children}</div> : null}
    </section>
  );
}

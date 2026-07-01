import { ReactNode } from "react";

interface SectionCardProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
}

export default function SectionCard({ eyebrow, title, children }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/30 sm:p-7">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

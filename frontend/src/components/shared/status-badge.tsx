import clsx from "clsx";

type StatusBadgeTone = "positivo" | "alerta" | "neutro";

type StatusBadgeProps = {
  tone: StatusBadgeTone;
  children: string;
};

const TONE_CLASSES: Record<StatusBadgeTone, string> = {
  positivo: "bg-emerald-100 text-emerald-800",
  alerta: "bg-accent-soft text-accent-strong",
  neutro: "bg-stone-200 text-stone-700",
};

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <span className={clsx("inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold", TONE_CLASSES[tone])}>
      {children}
    </span>
  );
}

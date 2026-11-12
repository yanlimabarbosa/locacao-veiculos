import clsx from "clsx";
import { type SelectHTMLAttributes, useId } from "react";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

export function SelectField({ label, error, className, children, ...props }: SelectFieldProps) {
  const id = useId();
  const selectClasses = clsx(
    "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition-colors",
    "focus:border-ink focus:ring-2 focus:ring-accent/30",
    error ? "border-red-500" : "border-line",
  );

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </label>
      <select id={id} aria-invalid={Boolean(error)} className={selectClasses} {...props}>
        {children}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

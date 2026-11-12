import clsx from "clsx";
import { type InputHTMLAttributes, useId } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export function TextField({ label, error, hint, className, ...props }: TextFieldProps) {
  const id = useId();
  const descricao = error ?? hint;
  const inputClasses = clsx(
    "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition-colors",
    "focus:border-ink focus:ring-2 focus:ring-accent/30",
    error ? "border-red-500" : "border-line",
  );

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </label>
      <input id={id} aria-invalid={Boolean(error)} aria-describedby={`${id}-descricao`} className={inputClasses} {...props} />
      {descricao && (
        <p id={`${id}-descricao`} className={clsx("text-xs", error ? "text-red-600" : "text-muted")}>
          {descricao}
        </p>
      )}
    </div>
  );
}

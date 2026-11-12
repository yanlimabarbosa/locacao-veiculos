import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import { Spinner } from "./spinner";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-ink text-paper hover:bg-stone-700",
  secondary: "border border-line bg-white text-ink hover:border-stone-400",
  ghost: "text-muted hover:bg-stone-200/60 hover:text-ink",
};

export function Button({ variant = "primary", loading = false, disabled, className, children, ...props }: ButtonProps) {
  const classes = clsx(
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    "disabled:cursor-not-allowed disabled:opacity-50",
    VARIANT_CLASSES[variant],
    className,
  );

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}

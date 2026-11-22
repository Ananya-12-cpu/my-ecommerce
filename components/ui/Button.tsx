import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

type Variant = "primary" | "outline" | "ghost" | "danger-ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center text-center font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "bg-black text-white hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-black",
  outline: "border border-zinc-300 hover:border-zinc-500 dark:border-zinc-700",
  ghost:
    "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white",
  "danger-ghost": "text-zinc-400 hover:text-red-500",
};

const sizes: Record<Size, string> = {
  sm: "rounded-full px-3 py-1 text-xs",
  md: "rounded-full px-6 py-3 text-sm",
};

type StyleProps = { variant?: Variant; size?: Size; fullWidth?: boolean };

export function buttonClass({
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
}: StyleProps & { className?: string } = {}) {
  return `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`.trim();
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}

export function LinkButton({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: StyleProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={buttonClass({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}

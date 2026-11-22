import type { InputHTMLAttributes } from "react";

export const inputClass =
  "w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700";

export default function FormField({
  label,
  id,
  className = "",
  ...props
}: { label: string; id: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={props.name ?? id}
        className={`${inputClass} ${className}`}
        {...props}
      />
    </div>
  );
}

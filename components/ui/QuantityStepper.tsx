const btn =
  "h-8 w-8 rounded-full border border-zinc-300 hover:border-zinc-500 dark:border-zinc-700";

export default function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className={btn}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span key={value} className="animate-bump inline-block w-6 text-center">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className={btn}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

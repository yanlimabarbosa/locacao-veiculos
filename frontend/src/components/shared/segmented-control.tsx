import clsx from "clsx";

type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({ label, value, options, onChange }: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg border border-line bg-white p-1">
      {options.map((option) => {
        const ativo = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => onChange(option.value)}
            className={clsx(
              "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
              ativo ? "bg-ink text-paper" : "text-muted hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

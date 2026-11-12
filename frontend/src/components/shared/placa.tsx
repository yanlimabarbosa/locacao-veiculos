type PlacaProps = {
  value: string;
};

export function Placa({ value }: PlacaProps) {
  return (
    <span className="inline-flex w-fit rounded border border-stone-400 bg-white px-1.5 py-0.5 font-mono text-xs tracking-widest">
      {value}
    </span>
  );
}

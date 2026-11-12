const LINHAS = [1, 2, 3];

export function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-busy>
      {LINHAS.map((linha) => (
        <div key={linha} className="h-24 animate-pulse rounded-xl border border-line bg-white" />
      ))}
    </div>
  );
}

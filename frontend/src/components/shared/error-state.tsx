import { Button } from "./button";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5">
      <p className="text-sm text-red-800">{message}</p>
      <Button variant="secondary" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  );
}

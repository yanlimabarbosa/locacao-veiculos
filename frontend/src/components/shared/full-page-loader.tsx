import { Spinner } from "./spinner";

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted">
      <Spinner />
    </div>
  );
}

import { Outlet } from "react-router";
import { AppHeader } from "./app-header";

export function AppLayout() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

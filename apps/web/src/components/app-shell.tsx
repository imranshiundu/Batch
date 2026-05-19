import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode; title?: string; eyebrow?: string }) {
  return <>{children}</>;
}

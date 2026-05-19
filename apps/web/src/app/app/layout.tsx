import type { ReactNode } from "react";
import { UnifiedAppLayout } from "@/components/unified-app-layout";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <UnifiedAppLayout>{children}</UnifiedAppLayout>;
}

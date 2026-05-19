import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export default function SupplierLayout({ children }: { children: ReactNode }) {
  void children;
  redirect("/app/batches");
}

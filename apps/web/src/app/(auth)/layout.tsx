import * as React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-surface rounded-[12px] p-[40px] shadow-modal border border-border">
        {children}
      </div>
    </main>
  );
}

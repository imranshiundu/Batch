"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/button";

export default function RegisterPage() {
  const [role, setRole] = React.useState<"buyer" | "supplier" | null>(null);

  return (
    <div className="flex flex-col items-center">
      <div className="font-display font-bold text-[32px] tracking-tight mb-6">Batch</div>
      <h2 className="text-[24px] font-medium text-ink-primary w-full text-center mb-8">
        Create your account
      </h2>

      <form className="w-full flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <label 
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all",
              role === "buyer" 
                ? "border-border-focus bg-semantic-escrowLight text-brand-action" 
                : "border-line bg-surface hover:bg-surface-raised text-ink-secondary"
            )}
            onClick={() => setRole("buyer")}
          >
            <input type="radio" name="role" value="buyer" className="hidden" />
            <span className="font-medium">Buyer</span>
          </label>
          <label 
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all",
              role === "supplier" 
                ? "border-border-focus bg-semantic-escrowLight text-brand-action" 
                : "border-line bg-surface hover:bg-surface-raised text-ink-secondary"
            )}
            onClick={() => setRole("supplier")}
          >
            <input type="radio" name="role" value="supplier" className="hidden" />
            <span className="font-medium">Supplier</span>
          </label>
        </div>

        <Input 
          label="Full Legal Name" 
          placeholder="Jane Doe" 
          required 
        />
        <Input 
          label="Email address" 
          type="email" 
          placeholder="name@example.com" 
          required 
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          required 
        />
        
        <div className="mt-2">
          <Link href="/verify" className="w-full block">
            <Button variant="primary" className="w-full" disabled={!role}>
              Continue
            </Button>
          </Link>
        </div>
      </form>

      <p className="mt-6 text-[14px] text-ink-secondary text-center">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-action hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

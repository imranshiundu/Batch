import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="font-display font-bold text-[32px] tracking-tight mb-6">Batch</div>
      <h2 className="text-[24px] font-medium text-ink-primary w-full text-center mb-8">
        Welcome back
      </h2>

      <form className="w-full flex flex-col gap-5">
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
          <Link href="/app" className="w-full block">
            <Button variant="primary" className="w-full">
              Log in
            </Button>
          </Link>
        </div>
      </form>

      <p className="mt-6 text-[14px] text-ink-secondary text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-brand-action hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}

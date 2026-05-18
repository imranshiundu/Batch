"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.value.length === 1 && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && index > 0 && !e.currentTarget.value) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="font-display font-bold text-[32px] tracking-tight mb-6">Batch</div>
      <h2 className="text-[24px] font-medium text-ink-primary w-full text-center mb-2">
        Check your email
      </h2>
      <p className="text-[14px] text-ink-secondary text-center mb-8">
        We sent a 6-digit verification code to your email.
      </p>

      <form className="w-full flex flex-col gap-8 items-center">
        <div className="flex gap-2 justify-center">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              className="w-[52px] h-[52px] text-center text-[20px] font-medium border border-line rounded-[6px] focus:outline-none focus:border-border-focus focus:ring-[3px] focus:ring-border-focus/20 transition-all bg-white"
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
        
        <div className="w-full">
          <Link href="/app" className="w-full block">
            <Button variant="primary" className="w-full">
              Verify Email
            </Button>
          </Link>
        </div>
      </form>

      <p className="mt-6 text-[14px] text-ink-secondary text-center">
        Didn&apos;t receive it?{" "}
        <button className="font-medium text-brand-action hover:underline">
          Resend code
        </button>
      </p>
    </div>
  );
}

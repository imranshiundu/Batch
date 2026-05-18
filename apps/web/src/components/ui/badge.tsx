import * as React from "react";
import { cn } from "./button";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "neutral";
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center h-[24px] px-[8px] rounded-[4px] text-[12px] font-semibold tracking-wide uppercase whitespace-nowrap",
        
        variant === "success" && "bg-semantic-clearedLight text-semantic-cleared",
        variant === "warning" && "bg-semantic-warningLight text-semantic-warning",
        variant === "danger" && "bg-rose-50 text-rose-700",
        variant === "default" && "bg-semantic-escrowLight text-semantic-escrow",
        variant === "neutral" && "bg-surface-raised text-ink-secondary",
        
        className
      )}
      {...props}
    />
  );
}

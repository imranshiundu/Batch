import * as React from "react";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  // Simple cn function, would usually use tailwind-merge too
  return clsx(inputs);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "secondary" | "danger";
  size?: "default" | "large" | "sm";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-[6px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-semantic-escrow focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none",
          
          // Variants
          variant === "primary" && 
            "bg-brand-action text-white hover:bg-brand-hover hover:-translate-y-[1px] hover:shadow-ui active:bg-brand-active active:translate-y-0",
          variant === "secondary" &&
            "bg-surface text-ink-primary border border-line hover:bg-surface-raised",
          variant === "ghost" &&
            "bg-transparent text-ink-secondary hover:bg-surface-raised hover:text-ink-primary",
          variant === "danger" &&
            "bg-semantic-warning text-white hover:opacity-90",

          // Sizes
          size === "default" && "h-[44px] px-[16px] text-[14px]",
          size === "large" && "h-[56px] px-[24px] text-[16px] font-semibold",
          size === "sm" && "h-[32px] px-[12px] text-[12px]",
          
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

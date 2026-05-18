import * as React from "react";
import { cn } from "./button";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, ...props }, ref) => {
    // Generate a stable ID if label is provided but no ID
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col w-full">
        {label && (
          <label 
            htmlFor={inputId} 
            className="text-[14px] font-medium text-ink-primary mb-[6px]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "h-[44px] w-full rounded-[6px] border border-line bg-white px-3 py-2 text-[14px]",
            "transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-secondary",
            "focus:outline-none focus:border-line-focus focus:ring-[3px] focus:ring-line-focus/20",
            "disabled:cursor-not-allowed disabled:bg-surface-raised disabled:text-ink-disabled",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

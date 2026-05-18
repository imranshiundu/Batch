import * as React from "react";
import { cn } from "./button";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[4px] bg-surface-raised", // Basic tailwind pulse, we can customize if strict 1.5s ease-in-out is strictly needed over default pulse
        className
      )}
      {...props}
    />
  );
}

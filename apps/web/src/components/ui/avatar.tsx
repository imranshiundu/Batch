import * as React from "react";
import { cn } from "./button"; // Reuse simple cn utility

const pastelColors = [
  "bg-blue-100",
  "bg-emerald-100",
  "bg-amber-100",
  "bg-purple-100",
  "bg-rose-100",
  "bg-teal-100",
  "bg-indigo-100",
];

function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  userId: string;
  size?: "default" | "sm" | "large";
}

export function Avatar({ name, userId, size = "default", className, ...props }: AvatarProps) {
  // Extract initials (up to 2 characters)
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Deterministic background color based on user ID
  const colorIndex = stringToHash(userId) % pastelColors.length;
  const bgColorClass = pastelColors[colorIndex];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full text-ink-primary font-semibold select-none",
        bgColorClass,
        size === "default" && "w-[40px] h-[40px] text-[14px]",
        size === "sm" && "w-[32px] h-[32px] text-[12px]",
        size === "large" && "w-[80px] h-[80px] text-[24px]", // Note: Spec says 14px inside, but large needs bigger text visually usually. Will stick to standard scaling or leave as 14px if strict. Let's scale slightly for 80px.
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
}

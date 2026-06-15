import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "outline" | "secondary";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
        {
          "bg-brand-100 text-brand-800 border-brand-200": variant === "default",
          "bg-green-100 text-green-800 border-green-200": variant === "success",
          "bg-yellow-100 text-yellow-800 border-yellow-200": variant === "warning",
          "bg-red-100 text-red-800 border-red-200": variant === "destructive",
          "bg-white text-gray-700 border-gray-300": variant === "outline",
          "bg-gray-100 text-gray-700 border-gray-200": variant === "secondary",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };

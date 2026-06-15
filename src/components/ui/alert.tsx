import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "warning" | "destructive" | "success" | "info";
}

function Alert({ className, variant = "default", ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-lg border p-4 text-sm",
        {
          "border-gray-200 bg-gray-50 text-gray-800": variant === "default",
          "border-yellow-300 bg-yellow-50 text-yellow-900": variant === "warning",
          "border-red-300 bg-red-50 text-red-900": variant === "destructive",
          "border-green-300 bg-green-50 text-green-900": variant === "success",
          "border-brand-200 bg-brand-50 text-brand-900": variant === "info",
        },
        className
      )}
      {...props}
    />
  );
}

function AlertIcon({ variant }: { variant?: AlertProps["variant"] }) {
  const icons: Record<NonNullable<AlertProps["variant"]>, string> = {
    default: "ℹ️",
    warning: "⚠️",
    destructive: "🚫",
    success: "✅",
    info: "ℹ️",
  };
  return (
    <span className="flex-shrink-0 text-base" aria-hidden="true">
      {icons[variant ?? "default"]}
    </span>
  );
}

export { Alert, AlertIcon };

import { cn } from "@/lib/cn";

// stand-in for illustrations that haven't been drawn yet
export function SvgPlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "rounded-lg border border-dashed",
        "text-xs text-subtle",
        className,
      )}
    >
      {label}
    </div>
  );
}

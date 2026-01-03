import { cn } from "@/lib/utils";

export type ComplianceStatus = "compliant" | "due-soon" | "overdue";

interface StatusIndicatorProps {
  status: ComplianceStatus;
  title: string;
  subtitle: string;
  className?: string;
}

const statusConfig = {
  compliant: {
    dotClass: "bg-neon-green status-pulse-green",
    textClass: "text-neon-green text-glow-green",
    label: "System Operational / Compliant",
  },
  "due-soon": {
    dotClass: "bg-neon-orange status-pulse-orange",
    textClass: "text-neon-orange text-glow-orange",
    label: "Warning: Filing Due Soon",
  },
  overdue: {
    dotClass: "bg-neon-red status-pulse-red",
    textClass: "text-neon-red text-glow-red",
    label: "Critical Error: Filing Overdue",
  },
};

export function StatusIndicator({ status, title, subtitle, className }: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg border border-border bg-card transition-all hover:border-primary/30",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative mt-1">
          <div className={cn("w-3 h-3 rounded-full", config.dotClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground text-sm truncate">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          <p className={cn("text-xs font-mono mt-2", config.textClass)}>
            {config.label}
          </p>
        </div>
      </div>
    </div>
  );
}

import { StatusIndicator, ComplianceStatus } from "./StatusIndicator";
import { Activity } from "lucide-react";

interface ComplianceArea {
  id: string;
  title: string;
  subtitle: string;
  status: ComplianceStatus;
}

const complianceAreas: ComplianceArea[] = [
  {
    id: "gst",
    title: "GST Compliance",
    subtitle: "Quarterly Returns",
    status: "compliant",
  },
  {
    id: "income-tax",
    title: "Income Tax",
    subtitle: "Annual Filing",
    status: "due-soon",
  },
  {
    id: "local-license",
    title: "Local License",
    subtitle: "Trade Registration",
    status: "compliant",
  },
  {
    id: "professional-tax",
    title: "Professional Tax",
    subtitle: "Monthly Deductions",
    status: "overdue",
  },
];

export function HealthMatrix() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Compliance Health Matrix
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {complianceAreas.map((area) => (
          <StatusIndicator
            key={area.id}
            status={area.status}
            title={area.title}
            subtitle={area.subtitle}
          />
        ))}
      </div>
    </div>
  );
}

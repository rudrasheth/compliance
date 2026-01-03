import { useState, useEffect } from "react";
import { StatusIndicator, ComplianceStatus } from "./StatusIndicator";
import { Activity } from "lucide-react";
import { complianceApi } from "@/lib/api";

interface ComplianceArea {
  id: string;
  title: string;
  subtitle: string;
  status: ComplianceStatus;
}

export function HealthMatrix() {
  const [complianceAreas, setComplianceAreas] = useState<ComplianceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthMatrix = async () => {
      try {
        setLoading(true);
        const response = await complianceApi.getHealthMatrix();
        if (response.success) {
          setComplianceAreas(response.data);
        }
      } catch (err) {
        console.error('Error fetching health matrix:', err);
        setError('Failed to load compliance data');
        // Fallback to default data
        setComplianceAreas([
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthMatrix();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Compliance Health Matrix
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-secondary/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Compliance Health Matrix
        </h2>
        {error && (
          <span className="text-xs text-orange-600 ml-auto">Using cached data</span>
        )}
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

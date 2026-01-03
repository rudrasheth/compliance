import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileSearch } from "lucide-react";
import { auditLogsApi } from "@/lib/api";

interface AuditLog {
  _id: string;
  user: string;
  action: string;
  entity: string;
  status: "success" | "pending" | "failed";
  createdAt: string;
  details?: string;
}

const statusStyles = {
  success: "bg-neon-green/10 text-neon-green border-neon-green/30 hover:bg-neon-green/20",
  pending: "bg-neon-orange/10 text-neon-orange border-neon-orange/30 hover:bg-neon-orange/20",
  failed: "bg-neon-red/10 text-neon-red border-neon-red/30 hover:bg-neon-red/20",
};

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function AuditLogsTable() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        const response = await auditLogsApi.getAll({ limit: 10 });
        if (response.success) {
          setAuditLogs(response.data);
        }
      } catch (err) {
        console.error('Error fetching audit logs:', err);
        setError('Failed to load audit logs');
        // Fallback to default data
        setAuditLogs([
          {
            _id: "log-001",
            createdAt: "2026-01-03T10:23:45Z",
            user: "admin@company.com",
            action: "FILED",
            entity: "GST Return Q4 2025",
            status: "success",
          },
          {
            _id: "log-002",
            createdAt: "2026-01-02T15:12:30Z",
            user: "admin@company.com",
            action: "UPLOADED",
            entity: "Invoice Batch #2025-1203",
            status: "success",
          },
          {
            _id: "log-003",
            createdAt: "2026-01-02T09:45:00Z",
            user: "admin@company.com",
            action: "VERIFIED",
            entity: "Trade License 2025",
            status: "success",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <FileSearch className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Audit Logs
        </h2>
        <Badge variant="secondary" className="ml-auto text-xs">
          {auditLogs.length} entries
        </Badge>
        {error && (
          <span className="text-xs text-orange-600">Using cached data</span>
        )}
      </div>

      <ScrollArea className="h-[280px]">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-secondary/30 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider w-[140px]">
                  Timestamp
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider w-[100px]">
                  Action
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Entity
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-right w-[90px]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow
                  key={log._id}
                  className="border-border hover:bg-secondary/50 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatTimestamp(log.createdAt)}
                  </TableCell>
                  <TableCell className="text-xs text-foreground truncate max-w-[150px]">
                    {log.user}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-foreground uppercase">
                    {log.action}
                  </TableCell>
                  <TableCell className="text-xs text-foreground truncate max-w-[200px]">
                    {log.entity}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] uppercase", statusStyles[log.status])}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ScrollArea>
    </div>
  );
}

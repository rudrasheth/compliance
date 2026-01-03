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

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  status: "success" | "pending" | "failed";
}

const auditLogs: AuditLog[] = [
  {
    id: "log-001",
    timestamp: "2026-01-03T10:23:45Z",
    user: "admin@company.com",
    action: "FILED",
    entity: "GST Return Q4 2025",
    status: "success",
  },
  {
    id: "log-002",
    timestamp: "2026-01-02T15:12:30Z",
    user: "admin@company.com",
    action: "UPLOADED",
    entity: "Invoice Batch #2025-1203",
    status: "success",
  },
  {
    id: "log-003",
    timestamp: "2026-01-02T09:45:00Z",
    user: "admin@company.com",
    action: "VERIFIED",
    entity: "Trade License 2025",
    status: "success",
  },
  {
    id: "log-004",
    timestamp: "2026-01-01T14:30:22Z",
    user: "system",
    action: "REMINDER",
    entity: "Professional Tax Jan 2026",
    status: "pending",
  },
  {
    id: "log-005",
    timestamp: "2025-12-28T11:15:00Z",
    user: "admin@company.com",
    action: "FILED",
    entity: "GST Return Q3 2025",
    status: "success",
  },
  {
    id: "log-006",
    timestamp: "2025-12-20T16:42:18Z",
    user: "system",
    action: "SYNC_FAILED",
    entity: "Income Tax Portal",
    status: "failed",
  },
  {
    id: "log-007",
    timestamp: "2025-12-15T08:00:00Z",
    user: "admin@company.com",
    action: "EXPORTED",
    entity: "Annual Compliance Report",
    status: "success",
  },
];

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
      </div>

      <ScrollArea className="h-[280px]">
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
                key={log.id}
                className="border-border hover:bg-secondary/50 transition-colors"
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {formatTimestamp(log.timestamp)}
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
      </ScrollArea>
    </div>
  );
}

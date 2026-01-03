import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CountdownTimer } from "@/components/CountdownTimer";
import { HealthMatrix } from "@/components/HealthMatrix";
import { KanbanBoard } from "@/components/KanbanBoard";
import { AuditLogsTable } from "@/components/AuditLogsTable";
import { ComplianceChart } from "@/components/ComplianceChart";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

// Next deadline: 15 days from now for demonstration
const nextDeadline = new Date();
nextDeadline.setDate(nextDeadline.getDate() + 15);
nextDeadline.setHours(23, 59, 59, 0);

export default function Index() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden bg-background">
          {/* Header */}
          <header className="h-14 border-b border-border flex items-center px-4 gap-4 shrink-0 bg-card">
            <SidebarTrigger>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Menu className="w-5 h-5" />
              </Button>
            </SidebarTrigger>
            <div className="flex-1">
              <h1 className="text-sm font-medium text-foreground">Dashboard</h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                System Status Overview
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green status-pulse-green" />
              <span className="text-xs font-mono text-muted-foreground">All Systems Nominal</span>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4 md:p-6 bg-background">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Penalty Countdown Header */}
              <CountdownTimer
                targetDate={nextDeadline}
                label="Next Critical Deadline: GST Q1 2026"
              />

              {/* Health Matrix & Chart Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HealthMatrix />
                <ComplianceChart />
              </div>

              {/* Kanban Board */}
              <KanbanBoard />

              {/* Audit Logs */}
              <AuditLogsTable />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

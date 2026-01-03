import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuditLogsTable } from "@/components/AuditLogsTable";
import { Menu, FileSearch, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const auditStats = [
  {
    title: "Total Actions",
    value: "1,247",
    change: "+12%",
    changeType: "positive" as const
  },
  {
    title: "Success Rate", 
    value: "98.2%",
    change: "+0.3%",
    changeType: "positive" as const
  },
  {
    title: "Failed Actions",
    value: "23",
    change: "-5%", 
    changeType: "positive" as const
  },
  {
    title: "System Alerts",
    value: "4",
    change: "+2",
    changeType: "negative" as const
  }
];

export default function Audit() {
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
              <h1 className="text-sm font-medium text-foreground">Audit History</h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                System Activity & Compliance Tracking
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4 md:p-6 bg-background">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {auditStats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs uppercase tracking-wider">
                        {stat.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold font-mono">{stat.value}</span>
                        <Badge 
                          variant="outline" 
                          className={
                            stat.changeType === "positive" 
                              ? "text-green-600 border-green-200 bg-green-50" 
                              : "text-red-600 border-red-200 bg-red-50"
                          }
                        >
                          {stat.change}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Audit Logs Table */}
              <AuditLogsTable />

              {/* Additional Audit Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileSearch className="w-4 h-4" />
                      Recent Activity Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                      <span className="text-sm">GST Filings</span>
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        3 completed
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                      <span className="text-sm">Document Uploads</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                        12 processed
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                      <span className="text-sm">System Syncs</span>
                      <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                        1 failed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Compliance Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Compliance</span>
                        <span className="font-mono">96%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "96%" }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Data Integrity</span>
                        <span className="font-mono">100%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>System Uptime</span>
                        <span className="font-mono">99.8%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "99.8%" }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
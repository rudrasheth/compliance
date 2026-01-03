import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu, FileText, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { filingsApi } from "@/lib/api";

interface Filing {
  _id: string;
  title: string;
  type: string;
  dueDate: string;
  status: string;
  priority: string;
  description?: string;
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  ready: "bg-blue-100 text-blue-800",
  filed: "bg-green-100 text-green-800",
  verified: "bg-purple-100 text-purple-800"
};

const priorityColors = {
  urgent: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800", 
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800"
};

export default function Filings() {
  const [filings, setFilings] = useState<Filing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFilings = async () => {
      try {
        setLoading(true);
        const response = await filingsApi.getAll({ limit: 20 });
        if (response.success) {
          setFilings(response.data);
        }
      } catch (err) {
        console.error('Error fetching filings:', err);
        setError('Failed to load filings');
        // Fallback to default data
        setFilings([
          {
            _id: "1",
            title: "GST Return Q1 2026",
            type: "GST",
            dueDate: "2026-04-20",
            status: "draft",
            priority: "high"
          },
          {
            _id: "2", 
            title: "Professional Tax January 2026",
            type: "Professional Tax",
            dueDate: "2026-01-15",
            status: "ready",
            priority: "urgent"
          },
          {
            _id: "3",
            title: "Income Tax Return FY 2024-25",
            type: "Income Tax",
            dueDate: "2026-07-31",
            status: "filed",
            priority: "medium"
          },
          {
            _id: "4",
            title: "Trade License Renewal",
            type: "License",
            dueDate: "2026-03-31",
            status: "verified",
            priority: "low"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilings();
  }, []);

  const filteredFilings = filings.filter(filing =>
    filing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filing.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-sm font-medium text-foreground">Filings</h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Manage Tax Returns & Compliance Documents
              </p>
            </div>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              New Filing
            </Button>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4 md:p-6 bg-background">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input 
                    placeholder="Search filings..." 
                    className="max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>

              {error && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    {error}. Showing cached data.
                  </p>
                </div>
              )}

              {/* Filings Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-48 bg-secondary/30 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFilings.map((filing) => (
                    <Card key={filing._id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div className="flex gap-2">
                            <Badge variant="outline" className={priorityColors[filing.priority as keyof typeof priorityColors]}>
                              {filing.priority}
                            </Badge>
                            <Badge variant="outline" className={statusColors[filing.status as keyof typeof statusColors]}>
                              {filing.status}
                            </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-base">{filing.title}</CardTitle>
                        <CardDescription>{filing.type}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Due: </span>
                            <span className="font-mono">{new Date(filing.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              View
                            </Button>
                            <Button size="sm" className="flex-1">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!loading && filteredFilings.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No filings found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first filing.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
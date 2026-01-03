import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const events = [
  {
    id: "1",
    title: "GST Return Q1 2026",
    date: "2026-04-20",
    type: "deadline",
    priority: "high"
  },
  {
    id: "2",
    title: "Professional Tax Payment",
    date: "2026-01-15", 
    type: "deadline",
    priority: "urgent"
  },
  {
    id: "3",
    title: "Income Tax Filing Opens",
    date: "2026-04-01",
    type: "reminder",
    priority: "medium"
  },
  {
    id: "4",
    title: "Trade License Renewal",
    date: "2026-03-31",
    type: "deadline", 
    priority: "medium"
  }
];

const typeColors = {
  deadline: "bg-red-100 text-red-800",
  reminder: "bg-blue-100 text-blue-800",
  meeting: "bg-green-100 text-green-800"
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

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
              <h1 className="text-sm font-medium text-foreground">Calendar</h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Compliance Deadlines & Reminders
              </p>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4 md:p-6 bg-background">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <CalendarIcon className="w-5 h-5" />
                          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={prevMonth}>
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={nextMonth}>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-2 mb-4">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 35 }, (_, i) => {
                          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - 6);
                          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                          const hasEvent = events.some(event => 
                            new Date(event.date).toDateString() === date.toDateString()
                          );
                          
                          return (
                            <div
                              key={i}
                              className={`
                                p-2 text-center text-sm border rounded-md cursor-pointer hover:bg-secondary/50
                                ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                                ${hasEvent ? 'bg-primary/10 border-primary/30' : 'border-border'}
                              `}
                            >
                              {date.getDate()}
                              {hasEvent && (
                                <div className="w-1 h-1 bg-primary rounded-full mx-auto mt-1" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Upcoming Events */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {upcomingEvents.map(event => (
                        <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {event.title}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className={typeColors[event.type as keyof typeof typeColors]}>
                                {event.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
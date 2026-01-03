import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu, Bell, Check, X, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { notificationsApi } from "@/lib/api";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  priority: "low" | "medium" | "high" | "urgent";
  read: boolean;
  createdAt: string;
  userId: string;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-600"
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-orange-50", 
    borderColor: "border-orange-200",
    iconColor: "text-orange-600"
  },
  error: {
    icon: X,
    bgColor: "bg-red-50",
    borderColor: "border-red-200", 
    iconColor: "text-red-600"
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600"
  }
};

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsApi.getAll({ limit: 20 });
      if (response.success) {
        setNotifications(response.data);
        setUnreadCount(response.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
      // Fallback to default data
      setNotifications([
        {
          _id: "1",
          title: "Professional Tax Payment Due",
          message: "Professional Tax payment for January 2026 is due in 12 days.",
          type: "warning",
          createdAt: "2026-01-03T10:30:00Z",
          read: false,
          priority: "high",
          userId: "admin@company.com"
        },
        {
          _id: "2", 
          title: "GST Return Filed Successfully",
          message: "GST Return for Q4 2025 has been successfully filed and acknowledged.",
          type: "success",
          createdAt: "2026-01-03T09:15:00Z", 
          read: false,
          priority: "medium",
          userId: "admin@company.com"
        }
      ]);
      setUnreadCount(2);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

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
              <h1 className="text-sm font-medium text-foreground flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                System Alerts & Updates
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleMarkAllAsRead}>
              <Check className="w-4 h-4" />
              Mark All Read
            </Button>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-4 md:p-6 bg-background">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold font-mono">{notifications.length}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Unread</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold font-mono text-orange-600">{unreadCount}</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">High Priority</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold font-mono text-red-600">
                      {notifications.filter(n => n.priority === 'high').length}
                    </span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold font-mono">
                      {notifications.filter(n => {
                        const notifDate = new Date(n.createdAt);
                        const today = new Date();
                        return notifDate.toDateString() === today.toDateString();
                      }).length}
                    </span>
                  </CardContent>
                </Card>
              </div>

              {error && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    {error}. Showing cached data.
                  </p>
                </div>
              )}

              {/* Notifications List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Recent Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    {loading ? (
                      <div className="space-y-1 p-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="h-20 bg-secondary/30 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-1 p-4">
                        {notifications.map((notification) => {
                          const config = typeConfig[notification.type];
                          const IconComponent = config.icon;
                          
                          return (
                            <div
                              key={notification._id}
                              className={cn(
                                "flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-secondary/50",
                                !notification.read && "bg-secondary/30",
                                config.bgColor,
                                config.borderColor
                              )}
                            >
                              <div className={cn("mt-1", config.iconColor)}>
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h3 className={cn(
                                    "text-sm font-medium",
                                    !notification.read && "font-semibold"
                                  )}>
                                    {notification.title}
                                  </h3>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        "text-xs",
                                        notification.priority === 'high' && "border-red-200 text-red-600 bg-red-50",
                                        notification.priority === 'medium' && "border-orange-200 text-orange-600 bg-orange-50",
                                        notification.priority === 'low' && "border-green-200 text-green-600 bg-green-50"
                                      )}
                                    >
                                      {notification.priority}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground font-mono">
                                      {formatTimestamp(notification.createdAt)}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex gap-2 mt-3">
                                  {!notification.read && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleMarkAsRead(notification._id)}
                                    >
                                      Mark as Read
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm">
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
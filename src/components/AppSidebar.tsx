import { LayoutDashboard, FileText, Calendar, Settings, Shield, History, Bell, ChevronLeft, Terminal, LogOut, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Filings", url: "/filings", icon: FileText },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Audit History", url: "/audit", icon: History },
];

const systemNavItems = [
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const collapsed = state === "collapsed";

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error signing you out.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border bg-sidebar"
    >
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary">
            <Terminal className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">ComplianceOS</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                v1.0.0
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="text-primary bg-sidebar-accent"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground px-2">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="text-primary bg-sidebar-accent"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border space-y-3">
        {/* User Info */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] font-mono text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        )}

        {/* License Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <Shield className="w-4 h-4 text-neon-green" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">Pro License</p>
              <p className="text-[10px] font-mono text-muted-foreground">Active</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="ml-2">Sign out</span>}
        </Button>

        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "w-full text-muted-foreground hover:text-foreground",
            collapsed && "rotate-180"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

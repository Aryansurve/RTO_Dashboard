import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, MapPin, Cpu, FileText, BarChart3, ShieldCheck, Settings,
  Bell, Menu, X, ChevronRight, Radio
} from "lucide-react";

const navItems = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  { title: "AI Processing", path: "/ai-processing", icon: Cpu },
  { title: "Challans", path: "/challans", icon: FileText },
  { title: "Verification", path: "/verification", icon: ShieldCheck },
  { title: "Settings", path: "/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: "New violation detected — MH12AB1234", time: "2 min ago", type: "error" as const },
    { id: 2, text: "Emergency vehicle cleared Signal #47", time: "5 min ago", type: "success" as const },
    { id: 3, text: "AI model accuracy updated to 97.3%", time: "12 min ago", type: "warning" as const },
  ];

  return (
    <div className="min-h-screen flex bg-background bg-grid">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-sidebar transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-[68px]"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Radio className="w-5 h-5 text-primary" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden animate-fade-in-left">
              <p className="text-sm font-bold tracking-tight text-foreground leading-none">TrafficAI</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Command Center</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${active ? "active" : ""} ${!sidebarOpen ? "justify-center px-0" : ""}`}
                title={!sidebarOpen ? item.title : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.title}</span>}
                {sidebarOpen && active && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="m-3 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-[68px]"}`}>
        {/* Top navbar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold text-foreground hidden sm:block">
              AI-Powered Emergency Traffic Priority & Violation Enforcement
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="status-active text-xs hidden sm:flex">System Online</span>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 glass-card p-2 animate-fade-in z-50">
                  <p className="text-xs font-semibold text-muted-foreground px-3 py-2">Notifications</p>
                  {notifications.map((n) => (
                    <div key={n.id} className="px-3 py-2.5 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                      <p className="text-sm text-foreground">{n.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-xs font-bold text-accent-foreground">
                SA
              </div>
              <span className="text-sm font-medium text-foreground hidden md:block">Sys Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

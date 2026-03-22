import {
  AlertTriangle, ShieldCheck, Siren, Activity, TrendingUp, Clock, Zap, Eye
} from "lucide-react";
import StatCard from "@/components/StatCard";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";

const activityData = [
  { time: "00:00", violations: 12, emergencies: 2 },
  { time: "04:00", violations: 8, emergencies: 1 },
  { time: "08:00", violations: 45, emergencies: 5 },
  { time: "12:00", violations: 38, emergencies: 4 },
  { time: "16:00", violations: 52, emergencies: 7 },
  { time: "20:00", violations: 31, emergencies: 3 },
  { time: "23:00", violations: 18, emergencies: 2 },
];

const recentAlerts = [
  { id: 1, type: "Violation", msg: "Red light violation — MH14CD5678", time: "1 min ago", severity: "error" },
  { id: 2, type: "Emergency", msg: "Ambulance en route — Signal #23 overridden", time: "3 min ago", severity: "success" },
  { id: 3, type: "Warning", msg: "High traffic density — Zone B7", time: "8 min ago", severity: "warning" },
  { id: 4, type: "Violation", msg: "Speed violation — KA05EF9012", time: "12 min ago", severity: "error" },
  { id: 5, type: "System", msg: "AI model retrained — Accuracy 97.3%", time: "15 min ago", severity: "neutral" },
];

const severityStyles: Record<string, string> = {
  error: "status-error",
  success: "status-active",
  warning: "status-warning",
  neutral: "text-muted-foreground text-xs",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Command Center</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time traffic monitoring & enforcement overview</p>
        </div>
        <div className="status-active">Live</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Violations Today" value="847" change="+12% from yesterday" changeType="up" icon={AlertTriangle} color="red" delay={0} />
        <StatCard title="Emergencies Cleared" value="23" change="Avg 4.2 min saved" changeType="up" icon={Siren} color="green" delay={80} />
        <StatCard title="Signals Overridden" value="156" change="98.7% success rate" changeType="neutral" icon={Zap} color="yellow" delay={160} />
        <StatCard title="AI Accuracy" value="97.3%" change="+0.4% this week" changeType="up" icon={Eye} color="purple" delay={240} />
      </div>

      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Activity Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="gradViolation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradEmergency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="time" stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "hsl(222, 41%, 10%)", border: "1px solid hsl(222, 30%, 20%)", borderRadius: "8px", fontSize: "12px" }}
                itemStyle={{ color: "hsl(210, 40%, 92%)" }}
                labelStyle={{ color: "hsl(215, 20%, 55%)" }}
              />
              <Area type="monotone" dataKey="violations" stroke="hsl(0, 72%, 51%)" fill="url(#gradViolation)" strokeWidth={2} />
              <Area type="monotone" dataKey="emergencies" stroke="hsl(142, 70%, 45%)" fill="url(#gradEmergency)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Alerts</h3>
          <div className="space-y-3">
            {recentAlerts.map((a) => (
              <div key={a.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="mt-0.5">
                  <span className={severityStyles[a.severity]}>{a.type}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">{a.msg}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
        {[
          { label: "Active Cameras", value: "342", icon: Eye },
          { label: "Avg Response Time", value: "2.4m", icon: Clock },
          { label: "Zones Monitored", value: "48", icon: ShieldCheck },
          { label: "System Uptime", value: "99.97%", icon: Activity },
        ].map((item, i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-3">
            <item.icon className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold text-foreground tabular-nums">{item.value}</p>
              <p className="text-[11px] text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

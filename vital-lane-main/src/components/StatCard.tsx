import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color: "green" | "red" | "yellow" | "purple";
  delay?: number;
}

const colorMap = {
  green: { bg: "bg-success/10", text: "text-success", glow: "glow-green" },
  red: { bg: "bg-destructive/10", text: "text-destructive", glow: "glow-red" },
  yellow: { bg: "bg-warning/10", text: "text-warning", glow: "" },
  purple: { bg: "bg-accent/10", text: "text-accent", glow: "" },
};

export default function StatCard({ title, value, change, changeType = "neutral", icon: Icon, color, delay = 0 }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div
      className="stat-card opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2 tabular-nums">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${changeType === "up" ? "text-success" : changeType === "down" ? "text-destructive" : "text-muted-foreground"}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
      </div>
    </div>
  );
}

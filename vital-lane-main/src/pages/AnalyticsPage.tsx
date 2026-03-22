import { AlertTriangle, Siren, Zap, Eye, TrendingUp } from "lucide-react";
import StatCard from "@/components/StatCard";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const violationsOverTime = [
  { date: "Mar 1", violations: 320 }, { date: "Mar 5", violations: 410 },
  { date: "Mar 9", violations: 380 }, { date: "Mar 13", violations: 520 },
  { date: "Mar 17", violations: 470 }, { date: "Mar 21", violations: 847 },
];

const violationTypes = [
  { name: "Red Light", value: 35, color: "hsl(0, 72%, 51%)" },
  { name: "Speeding", value: 28, color: "hsl(45, 93%, 47%)" },
  { name: "Wrong Lane", value: 18, color: "hsl(262, 60%, 50%)" },
  { name: "No Helmet", value: 12, color: "hsl(142, 70%, 45%)" },
  { name: "Others", value: 7, color: "hsl(215, 20%, 55%)" },
];

const heatmapData = [
  ["Zone", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  ["A1", 12, 18, 14, 22, 31, 8, 5],
  ["A2", 8, 12, 19, 15, 24, 12, 7],
  ["B1", 22, 28, 25, 30, 38, 15, 10],
  ["B2", 15, 19, 22, 18, 27, 11, 8],
  ["C1", 5, 8, 6, 9, 12, 4, 3],
  ["C2", 18, 24, 20, 26, 32, 14, 9],
];

function getHeatColor(val: number) {
  if (val > 30) return "bg-destructive/60";
  if (val > 20) return "bg-warning/40";
  if (val > 10) return "bg-accent/30";
  return "bg-muted/30";
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">System performance & violation statistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Violations" value="4,238" change="+18% this month" changeType="up" icon={AlertTriangle} color="red" delay={0} />
        <StatCard title="Time Saved" value="127 min" change="Avg 4.2 min/emergency" changeType="up" icon={Siren} color="green" delay={80} />
        <StatCard title="Signals Overridden" value="892" change="This month" changeType="neutral" icon={Zap} color="yellow" delay={160} />
        <StatCard title="AI Accuracy" value="97.3%" change="Across all models" changeType="up" icon={Eye} color="purple" delay={240} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line chart */}
        <div className="lg:col-span-2 glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Violations Over Time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={violationsOverTime}>
              <defs>
                <linearGradient id="gradLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="date" stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(222, 41%, 10%)", border: "1px solid hsl(222, 30%, 20%)", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="violations" stroke="hsl(0, 72%, 51%)" fill="url(#gradLine)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
          <h3 className="text-sm font-semibold text-foreground mb-4">Violation Types</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={violationTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none">
                {violationTypes.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(222, 41%, 10%)", border: "1px solid hsl(222, 30%, 20%)", borderRadius: "8px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {violationTypes.map((v) => (
              <div key={v.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: v.color }} />
                  <span className="text-muted-foreground">{v.name}</span>
                </div>
                <span className="text-foreground font-medium tabular-nums">{v.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
        <h3 className="text-sm font-semibold text-foreground mb-4">Violation Heatmap — By Zone & Day</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {(heatmapData[0] as string[]).map((h) => (
                  <th key={h} className="text-xs font-medium text-muted-foreground px-3 py-2 text-center">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.slice(1).map((row, ri) => (
                <tr key={ri}>
                  {(row as (string | number)[]).map((cell, ci) => (
                    <td key={ci} className="px-2 py-1.5 text-center">
                      {ci === 0 ? (
                        <span className="text-xs font-medium text-muted-foreground">{cell}</span>
                      ) : (
                        <div className={`rounded-md py-1.5 text-xs font-medium text-foreground tabular-nums ${getHeatColor(cell as number)}`}>
                          {cell}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

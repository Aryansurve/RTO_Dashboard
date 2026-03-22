import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import StatCard from "@/components/StatCard";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";

// Interface for our data
interface AnalyticsData {
  totalViolations: number;
  chartData: { date: string; violations: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/analytics");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">Real-time system performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Violations" 
          value={data?.totalViolations.toLocaleString() || "0"} 
          change="Live from database" 
          changeType="up" 
          icon={AlertTriangle} 
          color="red" 
          delay={0} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Violations Over Time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data?.chartData || []}>
              <defs>
                <linearGradient id="gradLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(215, 20%, 55%)" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(215, 20%, 55%)" 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  background: "hsl(222, 41%, 10%)", 
                  border: "1px solid hsl(222, 30%, 20%)", 
                  borderRadius: "8px", 
                  fontSize: "12px" 
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="violations" 
                stroke="hsl(0, 72%, 51%)" 
                fill="url(#gradLine)" 
                strokeWidth={2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
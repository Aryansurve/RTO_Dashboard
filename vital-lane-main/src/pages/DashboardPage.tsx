import { useEffect, useState } from "react";
import { AlertTriangle, IndianRupee, Users, Building2 } from "lucide-react"; 
import StatCard from "@/components/StatCard";
import { 
  BarChart, Area, AreaChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";

// 1. Update the Interface
interface AnalyticsData {
  totalViolations: number;
  totalRevenue: number;
  totalUsers: number;
  totalHospitals: number;
  chartData: { date: string; violations: number }[];
  usersPerHospital: { name: string; value: number }[]; // Added this
}

export default function DashboardPage() {
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

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">Full system overview</p>
      </div>

      {/* Stats Grid - Now 4 columns on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Violations" 
          value={data?.totalViolations.toLocaleString() || "0"} 
          change="Live Records" 
          changeType="up" 
          icon={AlertTriangle} 
          color="red" 
          delay={0} 
        />

        <StatCard 
          title="Total Revenue" 
          value={`₹${data?.totalRevenue.toLocaleString() || "0"}`} 
          change="Collected Fines" 
          changeType="up" 
          icon={IndianRupee} 
          color="green" 
          delay={100} 
        />

        {/* NEW: Total Users Card */}
        <StatCard 
          title="Total Users" 
          value={data?.totalUsers.toLocaleString() || "0"} 
          change="Registered Drivers" 
          changeType="up" 
          icon={Users} 
          color="green" 
          delay={200} 
        />

        {/* NEW: Total Hospitals Card */}
        <StatCard 
          title="Connected Hospitals" 
          value={data?.totalHospitals.toLocaleString() || "0"} 
          change="Active Centers" 
          changeType="up" 
          icon={Building2} 
          color="purple" 
          delay={300} 
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
              <XAxis dataKey="date" stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(222, 41%, 10%)", border: "1px solid hsl(222, 30%, 20%)", borderRadius: "8px", fontSize: "12px" }} />
              <Area type="monotone" dataKey="violations" stroke="hsl(0, 72%, 51%)" fill="url(#gradLine)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Chart: Users per Hospital */}
      <div className="glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
        <h3 className="text-sm font-semibold text-foreground mb-4">Drivers per Hospital</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data?.usersPerHospital || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" horizontal={true} vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={11} 
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
              cursor={{fill: 'transparent'}}
              contentStyle={{ 
                background: "hsl(222, 41%, 10%)", 
                border: "1px solid hsl(222, 30%, 20%)", 
                borderRadius: "8px", 
                fontSize: "12px" 
              }} 
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data?.usersPerHospital.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "hsl(262, 60%, 50%)" : "hsl(142, 70%, 45%)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
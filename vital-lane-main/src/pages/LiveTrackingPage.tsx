import { useState, useEffect } from "react";
import { Siren, Navigation, Clock, Gauge, Radio, ChevronRight } from "lucide-react";

const signalTimeline = [
  { id: "S-12", status: "cleared", time: "14:23:01", label: "MG Road Junction" },
  { id: "S-15", status: "cleared", time: "14:23:18", label: "Park Street Cross" },
  { id: "S-18", status: "active", time: "14:23:32", label: "Ring Road Signal" },
  { id: "S-22", status: "pending", time: "—", label: "Hospital Gate Entry" },
  { id: "S-25", status: "pending", time: "—", label: "Highway Interchange" },
];

const statusColors: Record<string, string> = {
  cleared: "bg-success",
  active: "bg-warning animate-pulse",
  pending: "bg-muted",
};

export default function LiveTrackingPage() {
  const [speed, setSpeed] = useState(72);
  const [eta, setEta] = useState(4.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => Math.max(40, Math.min(95, prev + (Math.random() - 0.5) * 8)));
      setEta((prev) => Math.max(0.5, prev - 0.02));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Live Emergency Tracking</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time emergency vehicle route monitoring</p>
        </div>
        <div className="status-active">Tracking Active</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Area */}
        <div className="lg:col-span-2 glass-card overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <div className="relative h-[480px] bg-[hsl(222,47%,5%)] overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-grid opacity-40" />

            {/* Simulated route path */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 480">
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(142, 70%, 45%)" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="hsl(142, 70%, 45%)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(45, 93%, 47%)" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              {/* Route */}
              <path d="M 100 380 Q 200 380 250 300 Q 300 220 400 200 Q 500 180 550 150 Q 600 120 700 100" fill="none" stroke="url(#routeGrad)" strokeWidth="4" strokeLinecap="round" />
              {/* Cleared signals */}
              {[{ x: 100, y: 380 }, { x: 250, y: 300 }, { x: 400, y: 200 }].map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="6" fill="hsl(142, 70%, 45%)" />
                  <circle cx={p.x} cy={p.y} r="12" fill="hsl(142, 70%, 45%)" opacity="0.3">
                    <animate attributeName="r" values="6;18;6" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>
              ))}
              {/* Active signal */}
              <g>
                <circle cx="550" cy="150" r="8" fill="hsl(45, 93%, 47%)" />
                <circle cx="550" cy="150" r="16" fill="hsl(45, 93%, 47%)" opacity="0.4">
                  <animate attributeName="r" values="8;22;8" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
              {/* Destination */}
              <circle cx="700" cy="100" r="6" fill="hsl(0, 72%, 51%)" opacity="0.6" />
              {/* Vehicle marker */}
              <g>
                <circle cx="520" cy="160" r="10" fill="hsl(142, 70%, 45%)">
                  <animate attributeName="cx" values="400;520;550" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="cy" values="200;160;150" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="520" cy="160" r="20" fill="hsl(142, 70%, 45%)" opacity="0.2">
                  <animate attributeName="cx" values="400;520;550" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="cy" values="200;160;150" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="r" values="10;24;10" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>

            {/* Labels */}
            <div className="absolute bottom-4 left-4 glass-card px-3 py-2 text-xs">
              <span className="text-success font-medium">● Green</span> Cleared &nbsp;
              <span className="text-warning font-medium">● Yellow</span> Overriding &nbsp;
              <span className="text-destructive font-medium">● Red</span> Destination
            </div>
            <div className="absolute top-4 right-4 glass-card px-3 py-2">
              <div className="flex items-center gap-2 text-xs text-foreground">
                <Siren className="w-4 h-4 text-destructive" />
                <span className="font-semibold">AMB-2847</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Panel */}
        <div className="space-y-4">
          {/* Vehicle Info */}
          <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Siren className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Ambulance AMB-2847</p>
                <p className="text-xs text-muted-foreground">City General Hospital → Sector 14</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <Gauge className="w-4 h-4 text-success mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground tabular-nums">{Math.round(speed)}</p>
                <p className="text-[10px] text-muted-foreground">km/h</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <Clock className="w-4 h-4 text-warning mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground tabular-nums">{eta.toFixed(1)}</p>
                <p className="text-[10px] text-muted-foreground">min ETA</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <Radio className="w-4 h-4 text-accent mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">3</p>
                <p className="text-[10px] text-muted-foreground">Overridden</p>
              </div>
            </div>
          </div>

          {/* Signal Timeline */}
          <div className="glass-card p-5 opacity-0 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            <h3 className="text-sm font-semibold text-foreground mb-4">Signal Timeline</h3>
            <div className="space-y-3">
              {signalTimeline.map((signal, i) => (
                <div key={signal.id} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${statusColors[signal.status]}`} />
                    {i < signalTimeline.length - 1 && <div className="w-px h-6 bg-border mt-1" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-foreground">{signal.label}</p>
                      <span className="text-[10px] text-muted-foreground tabular-nums">{signal.time}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{signal.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

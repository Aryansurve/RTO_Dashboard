import { useState } from "react";
import { Camera, Scan, ShieldAlert, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

const detections = [
  { id: 1, plate: "MH12AB1234", type: "Sedan", color: "White", violation: "Red Light", confidence: 96.2, status: "violation" },
  { id: 2, plate: "KA05EF5678", type: "SUV", color: "Black", violation: null, confidence: 94.8, status: "clear" },
  { id: 3, plate: "DL08GH9012", type: "Truck", color: "Blue", violation: "Speeding", confidence: 91.5, status: "violation" },
  { id: 4, plate: "TN14JK3456", type: "Hatchback", color: "Red", violation: null, confidence: 97.1, status: "clear" },
];

export default function AIProcessingPage() {
  const [processing, setProcessing] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Processing Feed</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time vehicle detection & violation analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setProcessing(!processing)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
              processing ? "bg-destructive/20 text-destructive hover:bg-destructive/30" : "bg-success/20 text-success hover:bg-success/30"
            }`}
          >
            {processing ? "Stop Processing" : "Start Processing"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Video Feed */}
        <div className="glass-card overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Camera Feed — Junction #47</span>
            </div>
            {processing && <span className="status-active">Recording</span>}
          </div>
          <div className="relative h-[400px] bg-[hsl(222,47%,4%)] flex items-center justify-center overflow-hidden">
            {/* Simulated video with bounding boxes */}
            <div className="absolute inset-0 bg-grid opacity-20" />

            {/* Scan line */}
            {processing && (
              <div className="absolute inset-x-0 h-px bg-primary/60 animate-scan-line" />
            )}

            {/* Bounding boxes */}
            <div className="absolute top-[20%] left-[15%] w-24 h-16 border-2 border-success rounded-sm">
              <span className="absolute -top-5 left-0 text-[9px] bg-success/20 text-success px-1.5 py-0.5 rounded font-mono">MH12AB1234</span>
            </div>
            <div className="absolute top-[35%] left-[45%] w-28 h-18 border-2 border-destructive rounded-sm">
              <span className="absolute -top-5 left-0 text-[9px] bg-destructive/20 text-destructive px-1.5 py-0.5 rounded font-mono">KA05EF5678</span>
              <span className="absolute -bottom-5 left-0 text-[9px] bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">VIOLATION</span>
            </div>
            <div className="absolute top-[55%] right-[20%] w-20 h-14 border-2 border-success rounded-sm">
              <span className="absolute -top-5 left-0 text-[9px] bg-success/20 text-success px-1.5 py-0.5 rounded font-mono">DL08GH9012</span>
            </div>

            {/* Center overlay */}
            <div className="relative z-10 text-center">
              <Camera className="w-12 h-12 text-muted-foreground/30 mx-auto" />
              <p className="text-xs text-muted-foreground/50 mt-2">Live Traffic Feed — Junction #47</p>
            </div>
          </div>
        </div>

        {/* Detection Panel */}
        <div className="glass-card overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Detection Results</span>
            </div>
            <span className="text-xs text-muted-foreground">{detections.length} vehicles detected</span>
          </div>

          {/* Status indicators */}
          <div className="grid grid-cols-3 gap-3 p-4 border-b border-border">
            <div className="flex items-center gap-2 bg-success/10 rounded-lg p-2.5">
              <CheckCircle className="w-4 h-4 text-success" />
              <div>
                <p className="text-xs font-semibold text-success">Vehicle Detected</p>
                <p className="text-[10px] text-success/70">{detections.length} vehicles</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-accent/10 rounded-lg p-2.5">
              <Scan className="w-4 h-4 text-accent" />
              <div>
                <p className="text-xs font-semibold text-accent">Plate Recognized</p>
                <p className="text-[10px] text-accent/70">{detections.length} plates</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-destructive/10 rounded-lg p-2.5">
              <ShieldAlert className="w-4 h-4 text-destructive" />
              <div>
                <p className="text-xs font-semibold text-destructive">Violation Found</p>
                <p className="text-[10px] text-destructive/70">{detections.filter(d => d.violation).length} violations</p>
              </div>
            </div>
          </div>

          {/* Detection list */}
          <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
            {detections.map((d) => (
              <div key={d.id} className="p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono font-bold text-foreground">{d.plate}</span>
                  {d.violation ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/20 text-destructive font-medium">{d.violation}</span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/20 text-success font-medium">Clear</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span>{d.type}</span>
                  <span>{d.color}</span>
                  <span className="ml-auto tabular-nums">{d.confidence}% confidence</span>
                </div>
              </div>
            ))}
          </div>

          {processing && (
            <div className="p-4 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              Processing next frame...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

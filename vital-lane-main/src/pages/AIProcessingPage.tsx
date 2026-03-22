import { useState, useEffect } from "react";
import { Camera, Scan, Loader2, MapPin } from "lucide-react";

export default function AIProcessingPage() {
  const [processing, setProcessing] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [location, setLocation] = useState(""); // 📍 Added back
  const [plates, setPlates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ai-processing");
      const data = await res.json();

      setVideoUrl(data.video_url);
      setLocation(data.location); // 📍 Update location from API

      if (data.plates) {
        setPlates((prev) => {
          if (prev[0] === data.plates) return prev;
          return [data.plates, ...prev].slice(0, 15);
        });
      }
    } catch (err) {
      console.error("Error fetching AI data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (processing) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [processing]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            AI Processing Feed
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {location || "Detecting Location..."}
            </p>
          </div>
        </div>

        <button
          onClick={() => setProcessing(!processing)}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 ${
            processing
              ? "bg-destructive/20 text-destructive hover:bg-destructive/30"
              : "bg-success/20 text-success hover:bg-success/30"
          }`}
        >
          {processing ? "Stop Processing" : "Start Processing"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 🎥 VIDEO FEED */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Camera Feed — {location || "Junction Scan"}
              </span>
            </div>
            {processing && <span className="status-active">Recording</span>}
          </div>

          <div className="h-[400px] bg-black flex items-center justify-center">
            {loading ? (
              <Loader2 className="animate-spin text-muted-foreground" />
            ) : videoUrl ? (
              <video
                key={videoUrl} 
                src={videoUrl}
                controls
                autoPlay
                muted
                loop
                className="h-full w-full object-contain"
              />
            ) : (
              <p className="text-muted-foreground">No video available</p>
            )}
          </div>
        </div>

        {/* 📊 DETECTION PANEL */}
        <div className="glass-card overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scan className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Detection Results
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {plates.length} vehicles detected
            </span>
          </div>

          <div className="divide-y divide-border max-h-[400px] overflow-y-auto flex-1">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading...
              </div>
            ) : plates.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No detections found
              </div>
            ) : (
              plates.map((plate, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-muted/20 transition-colors flex justify-between items-center"
                >
                  <span className="text-sm font-mono font-bold text-foreground">
                    {plate}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold">PLATE SCAN</span>
                </div>
              ))
            )}
          </div>

          {processing && (
            <div className="p-4 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              Processing latest data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
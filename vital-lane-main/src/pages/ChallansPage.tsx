import { useState } from "react";
import { Search, Filter, Eye, X, Image as ImageIcon, Loader2, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Mirroring the MongoDB Record structure exactly
interface ChallanImage {
  type: "vehicle" | "plate";
  image_data: string; // This is the Base64 string
}

interface Challan {
  _id: string;
  plate_number: string;
  images: ChallanImage[];
  timestamp: string;
  location: string;
  fine_amount: number;
  status: "Pending" | "Paid";
}

export default function ChallansPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedChallan, setSelectedChallan] = useState<Challan | null>(null);

  // Fetching real data from your MongoDB backend
  const { data: challans = [], isLoading, isError } = useQuery<Challan[]>({
    queryKey: ['challans', search, statusFilter],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5000/api/challans?search=${search}&status=${statusFilter}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json();
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Challan Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time enforcement & evidence monitoring</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Plate Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {["all", "pending", "paid"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                statusFilter === s ? "bg-primary/20 text-primary" : "bg-muted/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["ID", "Plate Number", "Location", "Date & Time", "Fine", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                    <span className="text-muted-foreground">Fetching records...</span>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-destructive">Connection error. Please check if backend is running.</td>
                </tr>
              ) : (
                challans.map((c) => (
                  <tr key={c._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                      {c._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-foreground text-base">{c.plate_number}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-foreground">{c.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                      {new Date(c.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-foreground font-semibold tabular-nums">₹{c.fine_amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        c.status === "Paid" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                      }`}>{c.status || "Pending"}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelectedChallan(c)} className="p-1.5 rounded-lg hover:bg-muted/30 transition-colors active:scale-95">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Modal */}
      {selectedChallan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedChallan(null)}>
          <div className="glass-card w-full max-w-2xl mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Evidence Report</h3>
                <p className="text-xs text-muted-foreground">ID: {selectedChallan._id}</p>
              </div>
              <button onClick={() => setSelectedChallan(null)} className="p-1.5 rounded-lg hover:bg-muted/30 transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Image Grid - Showing both Plate and Vehicle view */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedChallan.images.map((img, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{img.type} Detection</p>
                    <div className="aspect-video bg-muted/20 rounded-lg overflow-hidden border border-border">
                       <img 
                        src={`data:image/jpeg;base64,${img.image_data}`} 
                        alt={img.type} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  ["Plate Number", selectedChallan.plate_number],
                  ["Location", selectedChallan.location],
                  ["Fine Amount", `₹${selectedChallan.fine_amount}`],
                  ["Date", new Date(selectedChallan.timestamp).toLocaleDateString()],
                  ["Time", new Date(selectedChallan.timestamp).toLocaleTimeString()],
                  ["Status", selectedChallan.status || "Pending"],
                ].map(([label, val]) => (
                  <div key={label} className="bg-muted/20 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
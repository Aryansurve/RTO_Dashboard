// import { useState } from "react";
// import { User, Building2, ShieldCheck, ArrowRight, CheckCircle, XCircle, Clock } from "lucide-react";

// const requests = [
//   { id: "VR-101", driver: "Amit Deshmukh", hospital: "City General", vehicle: "AMB-2847", date: "2026-03-21", status: "pending" },
//   { id: "VR-100", driver: "Sunita Rao", hospital: "Apollo Hospital", vehicle: "AMB-1523", date: "2026-03-20", status: "pending" },
//   { id: "VR-099", driver: "Manoj Tiwari", hospital: "AIIMS", vehicle: "AMB-3901", date: "2026-03-19", status: "approved" },
//   { id: "VR-098", driver: "Fatima Sheikh", hospital: "Fortis", vehicle: "AMB-0742", date: "2026-03-18", status: "approved" },
//   { id: "VR-097", driver: "Ravi Shankar", hospital: "Max Hospital", vehicle: "AMB-6184", date: "2026-03-17", status: "rejected" },
// ];

// const statusMap: Record<string, { icon: typeof Clock; label: string; className: string }> = {
//   pending: { icon: Clock, label: "Pending", className: "bg-warning/15 text-warning" },
//   approved: { icon: CheckCircle, label: "Approved", className: "bg-success/15 text-success" },
//   rejected: { icon: XCircle, label: "Rejected", className: "bg-destructive/15 text-destructive" },
// };

// export default function VerificationPage() {
//   const [data, setData] = useState(requests);

//   const handleAction = (id: string, action: "approved" | "rejected") => {
//     setData((prev) => prev.map((r) => (r.id === id ? { ...r, status: action } : r)));
//   };

//   const counts = {
//     pending: data.filter((d) => d.status === "pending").length,
//     approved: data.filter((d) => d.status === "approved").length,
//     rejected: data.filter((d) => d.status === "rejected").length,
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-foreground">Verification System</h2>
//         <p className="text-sm text-muted-foreground mt-1">Emergency driver authorization workflow</p>
//       </div>

//       {/* Flow diagram */}
//       <div className="glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
//         <h3 className="text-sm font-semibold text-foreground mb-6">Verification Flow</h3>
//         <div className="flex items-center justify-center gap-4 flex-wrap">
//           {[
//             { icon: User, label: "Driver", sub: "Submits request" },
//             { icon: Building2, label: "Hospital Admin", sub: "Verifies identity" },
//             { icon: ShieldCheck, label: "Central Admin", sub: "Final approval" },
//           ].map((step, i) => (
//             <div key={i} className="flex items-center gap-4">
//               <div className="text-center">
//                 <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
//                   <step.icon className="w-7 h-7 text-primary" />
//                 </div>
//                 <p className="text-sm font-semibold text-foreground">{step.label}</p>
//                 <p className="text-[10px] text-muted-foreground">{step.sub}</p>
//               </div>
//               {i < 2 && <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-4">
//         {(["pending", "approved", "rejected"] as const).map((s, i) => {
//           const st = statusMap[s];
//           return (
//             <div key={s} className="glass-card p-4 flex items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: `${200 + i * 80}ms`, animationFillMode: "forwards" }}>
//               <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${st.className}`}>
//                 <st.icon className="w-5 h-5" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-foreground tabular-nums">{counts[s]}</p>
//                 <p className="text-xs text-muted-foreground">{st.label}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Table */}
//       <div className="glass-card overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: "450ms", animationFillMode: "forwards" }}>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-border">
//                 {["ID", "Driver", "Hospital", "Vehicle", "Date", "Status", "Actions"].map((h) => (
//                   <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border">
//               {data.map((r) => {
//                 const st = statusMap[r.status];
//                 return (
//                   <tr key={r.id} className="hover:bg-muted/20 transition-colors">
//                     <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{r.id}</td>
//                     <td className="px-4 py-3 font-medium text-foreground">{r.driver}</td>
//                     <td className="px-4 py-3 text-muted-foreground">{r.hospital}</td>
//                     <td className="px-4 py-3 font-mono text-foreground">{r.vehicle}</td>
//                     <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{r.date}</td>
//                     <td className="px-4 py-3">
//                       <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.className}`}>{st.label}</span>
//                     </td>
//                     <td className="px-4 py-3">
//                       {r.status === "pending" ? (
//                         <div className="flex items-center gap-2">
//                           <button onClick={() => handleAction(r.id, "approved")} className="px-3 py-1 rounded-lg bg-success/15 text-success text-xs font-medium hover:bg-success/25 transition-colors active:scale-95">
//                             Approve
//                           </button>
//                           <button onClick={() => handleAction(r.id, "rejected")} className="px-3 py-1 rounded-lg bg-destructive/15 text-destructive text-xs font-medium hover:bg-destructive/25 transition-colors active:scale-95">
//                             Reject
//                           </button>
//                         </div>
//                       ) : (
//                         <span className="text-xs text-muted-foreground">—</span>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { User, Building2, ShieldCheck, ArrowRight, CheckCircle, XCircle, Clock, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface DriverRequest {
  _id: string;
  name: string;
  vehicleId: string;
  createdAt: string;
  verificationStatus: string;
  hospitalId: {
    _id: string;
    name: string;
    location: string;
  } | null;
}

const statusMap: Record<string, { icon: any; label: string; className: string }> = {
  pending: { icon: Clock, label: "Pending", className: "bg-warning/15 text-warning border-warning/20" },
  verified: { icon: CheckCircle, label: "Verified", className: "bg-success/15 text-success border-success/20" },
  rejected: { icon: XCircle, label: "Denied", className: "bg-destructive/15 text-destructive border-destructive/20" },
};

export default function VerificationPage() {
  const [data, setData] = useState<DriverRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/drivers")
      .then(res => res.json())
      .then(drivers => {
        setData(drivers);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to connect to server");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: "Verified" | "Rejected") => {
    try {
      const response = await fetch(`http://localhost:5000/api/drivers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setData(prev => prev.map(r => r._id === id ? { ...r, verificationStatus: newStatus } : r));
        toast.success(`Driver established as ${newStatus}`);
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Central Verification</h2>
          <p className="text-sm text-muted-foreground mt-1">Central Admin Approval Queue</p>
        </div>
        <button 
          onClick={fetchDrivers} 
          className="p-2 rounded-full hover:bg-muted transition-colors" 
          title="Refresh Data"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Syncing driver records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-4 text-xs font-bold text-muted-foreground uppercase">Driver Name</th>
                  <th className="text-left px-4 py-4 text-xs font-bold text-muted-foreground uppercase">Hospital Agency</th>
                  <th className="text-left px-4 py-4 text-xs font-bold text-muted-foreground uppercase">Vehicle ID</th>
                  <th className="text-left px-4 py-4 text-xs font-bold text-muted-foreground uppercase">Status</th>
                  <th className="text-left px-4 py-4 text-xs font-bold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((r) => {
                  // Normalize status to lowercase for robust matching
                  const currentStatus = r.verificationStatus?.toLowerCase() || "pending";
                  const st = statusMap[currentStatus] || statusMap.pending;

                  return (
                    <tr key={r._id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-4 font-medium text-foreground">{r.name}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-foreground font-semibold">{r.hospitalId?.name || "Unassigned"}</span>
                          <span className="text-[10px] text-muted-foreground">{r.hospitalId?.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs">{r.vehicleId}</td>
                      <td className="px-4 py-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase border ${st.className}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {/* FIX: Use case-insensitive check for the buttons */}
                        {currentStatus !== "verified" && currentStatus !== "rejected" ? (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleStatusUpdate(r._id, "Verified")}
                              className="px-3 py-1 rounded bg-green-600 text-white text-[10px] font-bold uppercase hover:bg-green-700 shadow-sm active:scale-95 transition-all"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(r._id, "Rejected")}
                              className="px-3 py-1 rounded bg-red-600/10 text-red-600 text-[10px] font-bold uppercase hover:bg-red-600/20 active:scale-95 transition-all"
                            >
                              Deny
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase">
                            <CheckCircle className="w-3 h-3 text-success" /> Authorized
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {data.length === 0 && (
              <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-2">
                <ShieldCheck className="w-10 h-10 opacity-20" />
                No driver requests are currently in the queue.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
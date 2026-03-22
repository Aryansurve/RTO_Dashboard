import { Bell, Shield, Monitor, Database, Wifi, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">System configuration & preferences</p>
      </div>

      {[
        {
          icon: Monitor, title: "General", delay: 0,
          fields: [
            { label: "System Name", value: "TrafficAI Command Center", type: "text" },
            { label: "City Zone", value: "Metro Zone A — Central District", type: "text" },
          ],
        },
        {
          icon: Bell, title: "Notifications", delay: 100,
          fields: [
            { label: "Email Alerts", value: true, type: "toggle" },
            { label: "SMS for Emergencies", value: true, type: "toggle" },
            { label: "Push Notifications", value: false, type: "toggle" },
          ],
        },
        {
          icon: Shield, title: "AI & Processing", delay: 200,
          fields: [
            { label: "Detection Confidence Threshold", value: "85%", type: "text" },
            { label: "Auto-generate Challans", value: true, type: "toggle" },
            { label: "Model Version", value: "v4.2.1-stable", type: "text" },
          ],
        },
        {
          icon: Database, title: "Data & Storage", delay: 300,
          fields: [
            { label: "Data Retention Period", value: "90 days", type: "text" },
            { label: "Auto-backup", value: true, type: "toggle" },
          ],
        },
      ].map((section) => (
        <div key={section.title} className="glass-card p-6 opacity-0 animate-fade-in" style={{ animationDelay: `${section.delay}ms`, animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 mb-4">
            <section.icon className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
          </div>
          <div className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.label} className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">{field.label}</label>
                {field.type === "toggle" ? (
                  <div className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${field.value ? "bg-primary" : "bg-muted"}`}>
                    <div className={`w-4 h-4 rounded-full bg-foreground mt-0.5 transition-transform ${field.value ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                ) : (
                  <input
                    type="text"
                    defaultValue={field.value as string}
                    className="bg-muted/30 text-sm text-foreground rounded-lg px-3 py-1.5 border border-border outline-none focus:ring-1 focus:ring-primary w-64 text-right"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors active:scale-95">
        <Save className="w-4 h-4" />
        Save Changes
      </button>
    </div>
  );
}

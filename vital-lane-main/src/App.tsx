import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import LiveTrackingPage from "@/pages/LiveTrackingPage";
import AIProcessingPage from "@/pages/AIProcessingPage";
import ChallansPage from "@/pages/ChallansPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import VerificationPage from "@/pages/VerificationPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="*" element={
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/tracking" element={<LiveTrackingPage />} />
                <Route path="/ai-processing" element={<AIProcessingPage />} />
                <Route path="/challans" element={<ChallansPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

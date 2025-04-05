import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CalendarTab from "@/pages/CalendarTab";
import InsightsTab from "@/pages/InsightsTab";
import RemindersTab from "@/pages/RemindersTab";
import ChatbotTab from "@/pages/ChatbotTab";
import PCOSDetectionTab from "@/pages/PCOSDetectionTab";
import { ThemeProviderCustom } from "./components/ThemeProviderCustom";
import { CyclePhase } from "./types/cycle-phases";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/calendar" component={CalendarTab} />
      <Route path="/insights" component={InsightsTab} />
      <Route path="/reminders" component={RemindersTab} />
      <Route path="/chat" component={ChatbotTab} />
      <Route path="/pcos" component={PCOSDetectionTab} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProviderCustom defaultPhase={CyclePhase.MENSTRUAL}>
        <Router />
        <Toaster />
      </ThemeProviderCustom>
    </QueryClientProvider>
  );
}

export default App;

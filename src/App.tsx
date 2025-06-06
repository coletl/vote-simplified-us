
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VoterInfo from "./pages/VoterInfo";
import Elections from "./pages/Elections";
import Candidates from "./pages/Candidates";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import CheckRegistration from "./pages/CheckRegistration";
import RegisterToVote from "./pages/RegisterToVote";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/voter-info" element={<VoterInfo />} />
          <Route path="/elections" element={<Elections />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/check-registration" element={<CheckRegistration />} />
          <Route path="/register-to-vote" element={<RegisterToVote />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Skills from "./pages/Skills";
import Learning from "./pages/Learning";
import Applications from "./pages/Applications";
import Gigs from "./pages/Gigs";
import Clients from "./pages/Clients";
import Earnings from "./pages/Earnings";
import Proposals from "./pages/Proposals";
import Pipeline from "./pages/Pipeline";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/settings" element={<Settings />} />
          {/* Role-specific routes */}
          <Route path="/skills" element={<Skills />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/proposals" element={<Proposals />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/job-posts" element={<Dashboard />} />
          <Route path="/candidate-search" element={<Dashboard />} />
          <Route path="/team" element={<Dashboard />} />
          <Route path="/performance" element={<Dashboard />} />
          <Route path="/assignments" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

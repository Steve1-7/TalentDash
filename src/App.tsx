import { Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import Landing from "./pages/Landing-final";
import Login from "./pages/Login-final";
import Signup from "./pages/Signup-final";
import Onboarding from "./pages/Onboarding-final";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import RoleRouter from "./components/RoleRouter";
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

const SimpleOnboarding = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Complete Your Profile</h1>
          <p className="text-sm text-muted-foreground">Tell us about yourself to get started</p>
        </div>
        <div className="space-y-4">
          <p>Simple Onboarding Test - If you see this, the basic structure works.</p>
          <button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 p-3 rounded">
            Complete Onboarding
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        {/* Role-based dashboard routing */}
        <Route path="/dashboard" element={<RoleRouter />} />
        {/* Direct role routes for testing */}
        <Route path="/developer" element={<DeveloperDashboard />} />
        <Route path="/freelancer" element={<FreelancerDashboard />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
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
        <Route path="/job-posts" element={<RecruiterDashboard />} />
        <Route path="/candidate-search" element={<RecruiterDashboard />} />
        <Route path="/team" element={<ManagerDashboard />} />
        <Route path="/performance" element={<ManagerDashboard />} />
        <Route path="/assignments" element={<ManagerDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </ErrorBoundary>
);

export default App;

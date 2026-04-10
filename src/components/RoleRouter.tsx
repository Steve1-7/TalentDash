import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import DeveloperDashboard from '@/pages/DeveloperDashboard';
import FreelancerDashboard from '@/pages/FreelancerDashboard';
import RecruiterDashboard from '@/pages/RecruiterDashboard';
import ManagerDashboard from '@/pages/ManagerDashboard';

const RoleRouter: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'developer':
      return <DeveloperDashboard />;
    case 'freelancer':
      return <FreelancerDashboard />;
    case 'recruiter':
      return <RecruiterDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    default:
      // Default to developer dashboard if role is unrecognized
      return <DeveloperDashboard />;
  }
};

export default RoleRouter;

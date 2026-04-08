import { useAuthStore } from '@/stores/authStore';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DeveloperDashboard } from '@/components/dashboards/DeveloperDashboard';
import { FreelancerDashboard } from '@/components/dashboards/FreelancerDashboard';
import { RecruiterDashboard } from '@/components/dashboards/RecruiterDashboard';
import { ManagerDashboard } from '@/components/dashboards/ManagerDashboard';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const role = user?.role || 'developer';

  const dashboards = {
    developer: DeveloperDashboard,
    freelancer: FreelancerDashboard,
    recruiter: RecruiterDashboard,
    manager: ManagerDashboard,
  };

  const RoleDashboard = dashboards[role];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here's what's happening with your {role} dashboard.
          </p>
        </div>
        <RoleDashboard />
      </div>
    </DashboardLayout>
  );
}

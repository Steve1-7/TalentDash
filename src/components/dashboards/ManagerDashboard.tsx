import { StatCard } from '@/components/StatCard';
import { EmptyState } from '@/components/EmptyState';
import { Users, FolderKanban, TrendingUp, ListTodo } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Team Members" value={0} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Active Projects" value={0} icon={<FolderKanban className="h-5 w-5" />} />
        <StatCard title="Performance" value="—" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Pending Tasks" value={0} icon={<ListTodo className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Team Overview</CardTitle></CardHeader>
          <CardContent>
            <EmptyState icon={<Users className="h-6 w-6" />} title="No team members" description="Add team members to start managing your team." actionLabel="Add Member" onAction={() => {}} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Project Tracker</CardTitle></CardHeader>
          <CardContent>
            <EmptyState icon={<FolderKanban className="h-6 w-6" />} title="No projects yet" description="Create your first project to track progress." actionLabel="Create Project" onAction={() => {}} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

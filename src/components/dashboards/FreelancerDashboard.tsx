import { StatCard } from '@/components/StatCard';
import { EmptyState } from '@/components/EmptyState';
import { Briefcase, Users, DollarSign, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FreelancerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Gigs" value={0} icon={<Briefcase className="h-5 w-5" />} />
        <StatCard title="Clients" value={0} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Earnings" value="$0" icon={<DollarSign className="h-5 w-5" />} trend="This month" />
        <StatCard title="Proposals" value={0} icon={<FileText className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Active Gigs</CardTitle></CardHeader>
          <CardContent>
            <EmptyState icon={<Briefcase className="h-6 w-6" />} title="No active gigs" description="Start tracking your freelance work here." actionLabel="Add Gig" onAction={() => {}} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Earnings Overview</CardTitle></CardHeader>
          <CardContent>
            <EmptyState icon={<DollarSign className="h-6 w-6" />} title="No earnings data" description="Log your first payment to see earnings insights." actionLabel="Log Earning" onAction={() => {}} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

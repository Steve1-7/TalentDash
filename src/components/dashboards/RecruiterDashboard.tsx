import { StatCard } from '@/components/StatCard';
import { EmptyState } from '@/components/EmptyState';
import { UserCheck, ClipboardList, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RecruiterDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Candidates" value={0} icon={<UserCheck className="h-5 w-5" />} />
        <StatCard title="Open Positions" value={0} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard title="Interviews" value={0} icon={<Search className="h-5 w-5" />} trend="This week" />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Candidate Pipeline</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Applied', 'Interview', 'Hired'].map(stage => (
              <div key={stage} className="rounded-lg border bg-secondary/50 p-4 min-h-[200px]">
                <p className="text-sm font-medium mb-3">{stage}</p>
                <p className="text-xs text-muted-foreground">No candidates yet</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

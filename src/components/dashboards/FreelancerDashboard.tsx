import { StatCard } from '@/components/StatCard';
import { EmptyState } from '@/components/EmptyState';
import { CoreIntelligence } from '@/components/CoreIntelligence';
import { MarketIntelligenceFeed } from '@/components/MarketIntelligenceFeed';
import { PCIChatBot } from '@/components/PCIChatBot';
import { Briefcase, Users, DollarSign, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useFreelanceStore } from '@/stores/freelanceStore';
import { useGlobalMetricsStore } from '@/stores/globalMetricsStore';

export function FreelancerDashboard() {
  const navigate = useNavigate();
  const { gigs, clients, earnings, proposals } = useFreelanceStore();
  const { getRoleMetrics } = useGlobalMetricsStore();
  
  const metrics = getRoleMetrics('freelancer');
  const roleMetrics = metrics as any;

  const activeGigs = gigs.filter(g => g.status === 'active').length;
  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const sentProposals = proposals.filter(p => p.status === 'sent').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Active Gigs" 
          value={activeGigs} 
          icon={<Briefcase className="h-5 w-5" />} 
        />
        <StatCard 
          title="Clients" 
          value={clients.length} 
          icon={<Users className="h-5 w-5" />} 
        />
        <StatCard 
          title="Potential Revenue" 
          value={`$${roleMetrics.potentialRevenue.toLocaleString()}`} 
          icon={<DollarSign className="h-5 w-5" />} 
          trend="Based on active gigs"
        />
        <StatCard 
          title="Active Pipeline" 
          value={sentProposals} 
          icon={<FileText className="h-5 w-5" />} 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <CoreIntelligence />
        </div>
        
        <div className="xl:col-span-2">
          <MarketIntelligenceFeed />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Active Gigs</CardTitle></CardHeader>
          <CardContent>
            {gigs.filter(g => g.status === 'active').length === 0 ? (
              <EmptyState 
                icon={<Briefcase className="h-6 w-6" />} 
                title="No active gigs" 
                description="Start tracking your freelance work here." 
                actionLabel="Add Gig" 
                onAction={() => navigate('/gigs')} 
              />
            ) : (
              <div className="space-y-2">
                {gigs.filter(g => g.status === 'active').slice(0, 3).map(gig => (
                  <div key={gig.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">{gig.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {gig.rate ? `$${gig.rate}/hr` : 'Rate not set'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Lead Conversion Rate</span>
                <span className="font-medium">{roleMetrics.leadConversion.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Average Hourly Rate</span>
                <span className="font-medium">${roleMetrics.averageRate.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Total Earnings</span>
                <span className="font-medium">${totalEarnings.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PCIChatBot />
        </div>
        <div className="xl:col-span-1">
          <Card>
            <CardHeader><CardTitle className="text-base">PCI Quick Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/gigs')}>
                  <Briefcase className="h-4 w-4 mr-2" />
                  Add New Gig
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/clients')}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Clients
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/earnings')}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Log Earnings
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/proposals')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Track Proposals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

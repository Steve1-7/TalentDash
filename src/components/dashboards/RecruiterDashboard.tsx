import { StatCard } from '@/components/StatCard';
import { EmptyState } from '@/components/EmptyState';
import { CoreIntelligence } from '@/components/CoreIntelligence';
import { MarketIntelligenceFeed } from '@/components/MarketIntelligenceFeed';
import { PCIChatBot } from '@/components/PCIChatBot';
import { UserCheck, ClipboardList, Search, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useRecruiterStore } from '@/stores/recruiterStore';
import { useGlobalMetricsStore } from '@/stores/globalMetricsStore';

export function RecruiterDashboard() {
  const { candidates, jobPosts } = useRecruiterStore();
  const { getRoleMetrics } = useGlobalMetricsStore();
  const navigate = useNavigate();
  
  const metrics = getRoleMetrics('recruiter');
  const roleMetrics = metrics as any;
  
  const activeCandidates = candidates.filter(c => ['applied', 'interview', 'offer'].includes(c.stage)).length;
  const openPositions = jobPosts.filter(jp => jp.status === 'open').length;
  const interviewCandidates = candidates.filter(c => c.stage === 'interview').length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Candidates" value={activeCandidates} icon={<UserCheck className="h-5 w-5" />} />
        <StatCard title="Open Positions" value={openPositions} icon={<ClipboardList className="h-5 w-5" />} />
        <StatCard title="Interviews" value={interviewCandidates} icon={<Search className="h-5 w-5" />} trend="This week" />
        <StatCard title="Vetting Efficiency" value={`${roleMetrics.vettingEfficiency}%`} icon={<TrendingUp className="h-5 w-5" />} />
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
          <CardHeader><CardTitle className="text-base">Candidate Pipeline</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Applied', 'Interview', 'Offer'].map(stage => {
                const stageCandidates = candidates.filter(c => c.stage.toLowerCase() === stage.toLowerCase());
                return (
                  <div key={stage} className="rounded-lg border bg-secondary/50 p-4 min-h-[200px]">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium">{stage}</p>
                      <Badge variant="secondary">{stageCandidates.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {stageCandidates.slice(0, 3).map(candidate => (
                        <div key={candidate.id} className="p-2 bg-background rounded border">
                          <p className="text-xs font-medium truncate">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{candidate.title}</p>
                        </div>
                      ))}
                      {stageCandidates.length === 0 && (
                        <p className="text-xs text-muted-foreground">No candidates</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="text-base">Recruiter Metrics</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Active Candidates</span>
                <span className="font-medium">{roleMetrics.activeCandidates}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Open Positions</span>
                <span className="font-medium">{roleMetrics.openPositions}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Avg Time to Hire</span>
                <span className="font-medium">{roleMetrics.avgTimeToHire} days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Vetting Efficiency</span>
                <span className="font-medium">{roleMetrics.vettingEfficiency}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Talent Match Score</span>
                <span className="font-medium">{roleMetrics.talentMatchScore}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Candidates</CardTitle></CardHeader>
          <CardContent>
            {candidates.length === 0 ? (
              <EmptyState
                icon={<UserCheck className="h-6 w-6" />}
                title="No candidates yet"
                description="Start building your talent pipeline."
                actionLabel="Add Candidate"
                onAction={() => navigate('/candidate-search')}
              />
            ) : (
              <div className="space-y-2">
                {candidates.slice(0, 3).map(candidate => (
                  <div key={candidate.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{candidate.name}</h4>
                        <p className="text-xs text-muted-foreground">{candidate.title}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {candidate.stage}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidate.skills.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="text-base">Open Positions</CardTitle></CardHeader>
          <CardContent>
            {jobPosts.length === 0 ? (
              <EmptyState
                icon={<ClipboardList className="h-6 w-6" />}
                title="No job posts yet"
                description="Create your first job posting."
                actionLabel="Create Job Post"
                onAction={() => navigate('/job-posts')}
              />
            ) : (
              <div className="space-y-2">
                {jobPosts.filter(jp => jp.status === 'open').slice(0, 3).map(job => (
                  <div key={job.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{job.title}</h4>
                        <p className="text-xs text-muted-foreground">{job.location}</p>
                      </div>
                      <Badge variant={job.status === 'open' ? 'default' : 'secondary'} className="text-xs">
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/candidate-search')}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Add Candidate
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/job-posts')}>
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Create Job Post
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/pipeline')}>
                  <Search className="h-4 w-4 mr-2" />
                  View Pipeline
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/team')}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Team Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

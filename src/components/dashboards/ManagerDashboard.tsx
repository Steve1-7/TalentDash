import { StatCard } from '@/components/StatCard';
import { EmptyState } from '@/components/EmptyState';
import { CoreIntelligence } from '@/components/CoreIntelligence';
import { MarketIntelligenceFeed } from '@/components/MarketIntelligenceFeed';
import { PCIChatBot } from '@/components/PCIChatBot';
import { Users, FolderKanban, TrendingUp, ListTodo, Target, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useProjectsStore } from '@/stores/projectsStore';
import { useGlobalMetricsStore } from '@/stores/globalMetricsStore';

export function ManagerDashboard() {
  const { projects } = useProjectsStore();
  const { getRoleMetrics } = useGlobalMetricsStore();
  const navigate = useNavigate();
  
  const metrics = getRoleMetrics('manager');
  const roleMetrics = metrics as Record<string, number>;
  
  const activeProjects = projects.filter(p => p.status === 'active').length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Team Size" value={roleMetrics.teamSize} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Active Projects" value={activeProjects} icon={<FolderKanban className="h-5 w-5" />} />
        <StatCard title="Team Velocity" value={`${roleMetrics.teamVelocity}%`} icon={<TrendingUp className="h-5 w-5" />} trend="This sprint" />
        <StatCard title="Resource Utilization" value={`${roleMetrics.resourceUtilization}%`} icon={<Activity className="h-5 w-5" />} />
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
          <CardHeader><CardTitle className="text-base">Team Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">{roleMetrics.teamSize}</p>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">{roleMetrics.teamVelocity}%</p>
                  <p className="text-sm text-muted-foreground">Team Velocity</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Performance Score</span>
                  <Badge variant={roleMetrics.performanceScore >= 90 ? 'default' : 'secondary'}>
                    {roleMetrics.performanceScore}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Resource Utilization</span>
                  <Badge variant={roleMetrics.resourceUtilization >= 80 ? 'default' : 'secondary'}>
                    {roleMetrics.resourceUtilization}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="text-base">Manager Metrics</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Team Velocity</span>
                <span className="font-medium">{roleMetrics.teamVelocity}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Active Projects</span>
                <span className="font-medium">{roleMetrics.activeProjects}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Resource Utilization</span>
                <span className="font-medium">{roleMetrics.resourceUtilization}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Team Size</span>
                <span className="font-medium">{roleMetrics.teamSize} members</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Performance Score</span>
                <span className="font-medium">{roleMetrics.performanceScore}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Active Projects</CardTitle></CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <EmptyState 
                icon={<FolderKanban className="h-6 w-6" />} 
                title="No projects yet" 
                description="Create your first project to track progress." 
                actionLabel="Create Project" 
                onAction={() => navigate('/projects')} 
              />
            ) : (
              <div className="space-y-2">
                {projects.filter(p => p.status === 'active').slice(0, 3).map(project => (
                  <div key={project.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{project.name}</h4>
                        <p className="text-xs text-muted-foreground">{project.description}</p>
                      </div>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
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
          <CardHeader><CardTitle className="text-base">Resource Allocation</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Current Sprint</span>
                  <Badge variant="outline">Sprint 12</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Allocated Resources</span>
                    <span>{roleMetrics.resourceUtilization}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${roleMetrics.resourceUtilization}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-lg font-semibold text-green-600">{roleMetrics.teamVelocity}%</p>
                  <p className="text-xs text-muted-foreground">On Track</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-lg font-semibold text-blue-600">{Math.floor(roleMetrics.teamSize * 0.75)}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
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
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/projects')}>
                  <FolderKanban className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/team')}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Team
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/performance')}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Performance
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/assignments')}>
                  <ListTodo className="h-4 w-4 mr-2" />
                  Assign Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

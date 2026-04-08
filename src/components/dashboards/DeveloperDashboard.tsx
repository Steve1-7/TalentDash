import { StatCard } from '@/components/StatCard';
import { EmptyState } from '@/components/EmptyState';
import { CoreIntelligence } from '@/components/CoreIntelligence';
import { MarketIntelligenceFeed } from '@/components/MarketIntelligenceFeed';
import { PCIChatBot } from '@/components/PCIChatBot';
import { Code, BookOpen, FolderKanban, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useProjectsStore } from '@/stores/projectsStore';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { useGlobalMetricsStore } from '@/stores/globalMetricsStore';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export function DeveloperDashboard() {
  const { user } = useAuthStore();
  const { projects } = useProjectsStore();
  const { applications } = useApplicationsStore();
  const { getRoleMetrics } = useGlobalMetricsStore();
  const navigate = useNavigate();
  
  const metrics = getRoleMetrics('developer');
  const roleMetrics = metrics as any;
  
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const activeApplications = applications.filter(a => ['applied', 'interview', 'offer'].includes(a.status)).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Skills Tracked" value={user?.skills?.length || 0} icon={<Code className="h-5 w-5" />} />
        <StatCard title="Active Projects" value={activeProjects} icon={<FolderKanban className="h-5 w-5" />} />
        <StatCard title="Completed" value={completedProjects} icon={<Code className="h-5 w-5" />} trend="All time" />
        <StatCard title="Applications" value={activeApplications} icon={<ClipboardList className="h-5 w-5" />} />
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
          <CardHeader>
            <CardTitle className="text-base">Your Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {user?.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Code className="h-6 w-6" />}
                title="No skills added"
                description="Add your technical skills to track your growth."
                actionLabel="Add Skills"
                onAction={() => navigate('/profile')}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Developer Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Active Projects</span>
                <span className="font-medium">{roleMetrics.activeProjects}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Completed Projects</span>
                <span className="font-medium">{roleMetrics.completedProjects}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>GitHub Commits</span>
                <span className="font-medium">{roleMetrics.githubCommits}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Learning Hours</span>
                <span className="font-medium">{roleMetrics.learningHours}h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Projects</CardTitle></CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <EmptyState
                icon={<FolderKanban className="h-6 w-6" />}
                title="No projects yet"
                description="Start building your portfolio."
                actionLabel="Add Project"
                onAction={() => navigate('/projects')}
              />
            ) : (
              <div className="space-y-2">
                {projects.slice(0, 3).map(project => (
                  <div key={project.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">{project.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {project.status}
                      </Badge>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="text-base">Job Applications</CardTitle></CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <EmptyState
                icon={<ClipboardList className="h-6 w-6" />}
                title="No applications yet"
                description="Track your job search journey."
                actionLabel="Add Application"
                onAction={() => navigate('/applications')}
              />
            ) : (
              <div className="space-y-2">
                {applications.slice(0, 3).map(app => (
                  <div key={app.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm">{app.role}</h4>
                    <p className="text-xs text-muted-foreground">{app.company}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {app.status}
                    </Badge>
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
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/projects')}>
                  <FolderKanban className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/applications')}>
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Track Applications
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/skills')}>
                  <Code className="h-4 w-4 mr-2" />
                  Update Skills
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/learning')}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Learning Goals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

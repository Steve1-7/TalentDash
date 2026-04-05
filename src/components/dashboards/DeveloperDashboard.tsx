import { StatCard } from '@/components/StatCard';
import { EmptyState } from '@/components/EmptyState';
import { Code, BookOpen, FolderKanban, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export function DeveloperDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Skills Tracked" value={user?.skills?.length || 0} icon={<Code className="h-5 w-5" />} />
        <StatCard title="Learning Goals" value={0} icon={<BookOpen className="h-5 w-5" />} trend="Set your first goal" />
        <StatCard title="Projects" value={0} icon={<FolderKanban className="h-5 w-5" />} />
        <StatCard title="Applications" value={0} icon={<ClipboardList className="h-5 w-5" />} />
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
                onAction={() => {}}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Learning Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={<BookOpen className="h-6 w-6" />}
              title="No learning goals yet"
              description="Create a roadmap to level up your skills."
              actionLabel="Create Roadmap"
              onAction={() => navigate('/learning')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

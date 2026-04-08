import { useState } from 'react';
import { useAuthStore, UserRole } from '@/stores/authStore';
import { useGlobalMetricsStore } from '@/stores/globalMetricsStore';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Code, 
  Briefcase, 
  Users, 
  Crown, 
  ChevronDown,
  Palette,
  Target,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

const roleConfig = {
  developer: {
    label: 'Developer',
    icon: Code,
    description: 'Proof of Work & Skill Analysis',
    theme: 'dark',
    focus: ['GitHub', 'Projects', 'Skills', 'Learning'],
    color: 'bg-blue-500',
  },
  freelancer: {
    label: 'Freelancer',
    icon: Briefcase,
    description: 'Profitability & Lead Conversion',
    theme: 'light',
    focus: ['Gigs', 'Clients', 'Earnings', 'Proposals'],
    color: 'bg-green-500',
  },
  recruiter: {
    label: 'Recruiter',
    icon: Users,
    description: 'Vetting Efficiency & Talent Matching',
    theme: 'light',
    focus: ['Candidates', 'Job Posts', 'Pipeline'],
    color: 'bg-purple-500',
  },
  manager: {
    label: 'Manager',
    icon: Crown,
    description: 'Team Velocity & Resource Allocation',
    theme: 'light',
    focus: ['Team', 'Performance', 'Assignments'],
    color: 'bg-orange-500',
  },
};

interface PersonaSwitcherProps {
  onPersonaChange?: (role: UserRole) => void;
}

export function PersonaSwitcher({ onPersonaChange }: PersonaSwitcherProps) {
  const { user, updateProfile } = useAuthStore();
  const { getRoleMetrics } = useGlobalMetricsStore();
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!user) return null;

  const currentRole = roleConfig[user.role];
  const Icon = currentRole.icon;

  const handleRoleSwitch = async (newRole: UserRole) => {
    if (newRole === user.role) return;

    setIsTransitioning(true);
    
    try {
      // Update user role
      await updateProfile({ role: newRole });
      
      // Apply theme changes
      const theme = roleConfig[newRole].theme;
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Trigger AI assistant re-identification
      toast.success(`${roleConfig[newRole].label} Mode activated. Scanning your dashboard now.`, {
        description: roleConfig[newRole].description,
        duration: 3000,
      });

      // Call callback if provided
      onPersonaChange?.(newRole);
      
      // Update global metrics for new role
      useGlobalMetricsStore.getState().updateMetrics();
      
    } catch (error) {
      toast.error('Failed to switch persona');
    } finally {
      setIsTransitioning(false);
    }
  };

  const getMetricHighlight = () => {
    const metrics = getRoleMetrics(user.role);
    const roleMetrics = metrics as any;
    
    switch (user.role) {
      case 'developer':
        return `${roleMetrics.activeProjects} active projects`;
      case 'freelancer':
        return `$${roleMetrics.potentialRevenue.toLocaleString()} potential revenue`;
      case 'recruiter':
        return `${roleMetrics.activeCandidates} active candidates`;
      case 'manager':
        return `${roleMetrics.teamVelocity}% team velocity`;
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-foreground">{currentRole.label} Mode</p>
        <p className="text-xs text-muted-foreground">{getMetricHighlight()}</p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            disabled={isTransitioning}
          >
            <div className={`h-4 w-4 rounded ${currentRole.color} flex items-center justify-center`}>
              <Icon className="h-3 w-3 text-white" />
            </div>
            <span className="hidden sm:inline">{currentRole.label}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-64">
          {Object.entries(roleConfig).map(([role, config]) => {
            const Icon = config.icon;
            const isActive = user.role === role;
            const metrics = getRoleMetrics(role as UserRole);
            const roleMetrics = metrics as any;
            
            return (
              <DropdownMenuItem
                key={role}
                onClick={() => handleRoleSwitch(role as UserRole)}
                className={`p-3 cursor-pointer ${isActive ? 'bg-accent' : ''}`}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className={`h-8 w-8 rounded-lg ${config.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{config.label}</p>
                      {isActive && (
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {config.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {config.focus.map((item) => (
                        <span 
                          key={item}
                          className="px-2 py-0.5 bg-secondary rounded text-xs"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {role === 'developer' && (
                        <>
                          <Target className="h-3 w-3" />
                          {roleMetrics.activeProjects} projects
                        </>
                      )}
                      {role === 'freelancer' && (
                        <>
                          <TrendingUp className="h-3 w-3" />
                          ${roleMetrics.potentialRevenue.toLocaleString()} potential
                        </>
                      )}
                      {role === 'recruiter' && (
                        <>
                          <Users className="h-3 w-3" />
                          {roleMetrics.activeCandidates} candidates
                        </>
                      )}
                      {role === 'manager' && (
                        <>
                          <TrendingUp className="h-3 w-3" />
                          {roleMetrics.teamVelocity}% velocity
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

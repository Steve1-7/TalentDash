import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useGlobalMetricsStore } from '@/stores/globalMetricsStore';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Briefcase,
  Code,
  Crown
} from 'lucide-react';

interface TopBarCounterProps {
  className?: string;
}

export function TopBarCounter({ className }: TopBarCounterProps) {
  const { user } = useAuthStore();
  const { getRoleMetrics, lastUpdated } = useGlobalMetricsStore();
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  if (!user) return null;

  const metrics = getRoleMetrics(user.role);
  const roleMetrics = metrics as any;

  // Animate counter changes
  useEffect(() => {
    const newValues: Record<string, number> = {};
    
    switch (user.role) {
      case 'developer':
        newValues.activeProjects = roleMetrics.activeProjects;
        newValues.completedProjects = roleMetrics.completedProjects;
        break;
      case 'freelancer':
        newValues.potentialRevenue = roleMetrics.potentialRevenue;
        newValues.activeGigs = roleMetrics.activeGigs;
        newValues.activePipeline = roleMetrics.activePipeline;
        break;
      case 'recruiter':
        newValues.activeCandidates = roleMetrics.activeCandidates;
        newValues.openPositions = roleMetrics.openPositions;
        break;
      case 'manager':
        newValues.teamVelocity = roleMetrics.teamVelocity;
        newValues.activeProjects = roleMetrics.activeProjects;
        break;
    }

    setAnimatedValues(newValues);
  }, [metrics, user.role]);

  const getRoleIcon = () => {
    switch (user.role) {
      case 'developer': return <Code className="h-4 w-4" />;
      case 'freelancer': return <Briefcase className="h-4 w-4" />;
      case 'recruiter': return <Users className="h-4 w-4" />;
      case 'manager': return <Crown className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const formatValue = (value: number, type: 'currency' | 'number' | 'percentage' = 'number') => {
    switch (type) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const renderMetricBadges = () => {
    switch (user.role) {
      case 'developer':
        return (
          <>
            <Badge variant="secondary" className="gap-1">
              <Target className="h-3 w-3" />
              {animatedValues.activeProjects || 0} Active
            </Badge>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              {animatedValues.completedProjects || 0} Completed
            </Badge>
          </>
        );
      
      case 'freelancer':
        return (
          <>
            <Badge variant="secondary" className="gap-1">
              <DollarSign className="h-3 w-3" />
              {formatValue(animatedValues.potentialRevenue || 0, 'currency')}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Briefcase className="h-3 w-3" />
              {animatedValues.activeGigs || 0} Gigs
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Target className="h-3 w-3" />
              {animatedValues.activePipeline || 0} Pipeline
            </Badge>
          </>
        );
      
      case 'recruiter':
        return (
          <>
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              {animatedValues.activeCandidates || 0} Candidates
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Target className="h-3 w-3" />
              {animatedValues.openPositions || 0} Open
            </Badge>
          </>
        );
      
      case 'manager':
        return (
          <>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              {animatedValues.teamVelocity || 0}% Velocity
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Target className="h-3 w-3" />
              {animatedValues.activeProjects || 0} Projects
            </Badge>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        {getRoleIcon()}
        <span className="hidden sm:inline capitalize">{user.role}</span>
      </div>
      <div className="flex items-center gap-1">
        {renderMetricBadges()}
      </div>
      {lastUpdated && (
        <div className="hidden xs:block text-xs text-muted-foreground">
          Updated {new Date(lastUpdated).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

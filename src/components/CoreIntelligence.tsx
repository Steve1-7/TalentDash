import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useGlobalMetricsStore } from '@/stores/globalMetricsStore';
import { useFreelanceStore } from '@/stores/freelanceStore';
import { useRecruiterStore } from '@/stores/recruiterStore';
import { useProjectsStore } from '@/stores/projectsStore';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb,
  ExternalLink,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface IntelligenceBrief {
  id: string;
  type: 'market' | 'company' | 'skill' | 'opportunity';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
  source?: string;
  actionUrl?: string;
}

interface AIResponse {
  message: string;
  metricsUpdated?: string[];
  intelligenceBrief?: IntelligenceBrief[];
  suggestions?: string[];
}

export function CoreIntelligence() {
  const { user } = useAuthStore();
  const { getRoleMetrics, incrementMetric } = useGlobalMetricsStore();
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<string>('');

  const generateIntelligenceBrief = useCallback(async (): Promise<IntelligenceBrief[]> => {
    if (!user) return [];

    const briefs: IntelligenceBrief[] = [];
    const role = user.role;

    // Simulate market intelligence based on user data
    if (role === 'freelancer') {
      const { gigs } = useFreelanceStore.getState();
      const { proposals } = useFreelanceStore.getState();
      
      if (gigs.length > 0) {
        briefs.push({
          id: crypto.randomUUID(),
          type: 'market',
          title: 'Freelance Market Trend',
          description: 'React and TypeScript demand up 23% this quarter. Your current skills align with top-paying opportunities.',
          impact: 'high',
          timestamp: new Date().toISOString(),
          source: 'Market Analysis',
        });
      }

      if (proposals.filter(p => p.status === 'sent').length > 3) {
        briefs.push({
          id: crypto.randomUUID(),
          type: 'opportunity',
          title: 'Proposal Optimization',
          description: 'Your response rate is 45% above average. Consider increasing rates by 15-20% for new clients.',
          impact: 'medium',
          timestamp: new Date().toISOString(),
        });
      }
    }

    if (role === 'developer') {
      const { projects } = useProjectsStore.getState();
      const { applications } = useApplicationsStore.getState();
      
      if (applications.length > 0) {
        const companies = [...new Set(applications.map(a => a.company))];
        briefs.push({
          id: crypto.randomUUID(),
          type: 'company',
          title: `${companies[0]} Intelligence`,
          description: `${companies[0]} is expanding their engineering team. Series B funding round suggests strong growth trajectory.`,
          impact: 'high',
          timestamp: new Date().toISOString(),
          actionUrl: `https://linkedin.com/company/${companies[0]}`,
        });
      }

      if (projects.length > 0) {
        briefs.push({
          id: crypto.randomUUID(),
          type: 'skill',
          title: 'Skill Gap Analysis',
          description: 'Cloud architecture skills could increase your market value by 35%. Consider AWS or Azure certification.',
          impact: 'medium',
          timestamp: new Date().toISOString(),
        });
      }
    }

    if (role === 'recruiter') {
      const { candidates } = useRecruiterStore.getState();
      const { jobPosts } = useRecruiterStore.getState();
      
      if (candidates.length > 5) {
        briefs.push({
          id: crypto.randomUUID(),
          type: 'opportunity',
          title: 'Talent Pool Insight',
          description: '3 candidates match your Senior Dev role perfectly. Schedule interviews this week for optimal placement.',
          impact: 'high',
          timestamp: new Date().toISOString(),
        });
      }

      if (jobPosts.filter(jp => jp.status === 'open').length > 0) {
        briefs.push({
          id: crypto.randomUUID(),
          type: 'market',
          title: 'Recruitment Market Update',
          description: 'Tech talent competition increased 18% this month. Expand sourcing to include remote candidates.',
          impact: 'medium',
          timestamp: new Date().toISOString(),
        });
      }
    }

    if (role === 'manager') {
      const { projects } = useProjectsStore.getState();
      
      briefs.push({
        id: crypto.randomUUID(),
        type: 'opportunity',
        title: 'Team Performance Alert',
        description: 'Team velocity at 87% - consider optimizing sprint planning or resource allocation.',
        impact: 'medium',
        timestamp: new Date().toISOString(),
      });

      if (projects.filter(p => p.status === 'active').length > 3) {
        briefs.push({
          id: crypto.randomUUID(),
          type: 'skill',
          title: 'Resource Optimization',
          description: '2 projects show risk of delay. Reallocate senior developer resources to meet Q2 targets.',
          impact: 'high',
          timestamp: new Date().toISOString(),
        });
      }
    }

    return briefs;
  }, [user]);

  const generateAIResponse = useCallback(async (trigger: string): Promise<AIResponse> => {
    if (!user) throw new Error('User not found');

    const metrics = getRoleMetrics(user.role);
    const roleMetrics = metrics as any;
    const briefs = await generateIntelligenceBrief();

    let message = '';
    let metricsUpdated: string[] = [];
    let suggestions: string[] = [];

    switch (user.role) {
      case 'developer':
        message = `Developer Mode active. Analyzing your ${roleMetrics.activeProjects} active projects and skill portfolio.`;
        metricsUpdated = ['activeProjects', 'skillGapCount'];
        suggestions = [
          'Focus on completing 2 projects this month',
          'Add cloud architecture skills to increase market value',
          'Update GitHub with recent commits'
        ];
        break;

      case 'freelancer':
        message = `Freelancer Mode active. Your pipeline shows $${roleMetrics.potentialRevenue.toLocaleString()} potential revenue.`;
        metricsUpdated = ['activeGigs', 'potentialRevenue', 'leadConversion'];
        suggestions = [
          'Follow up with 3 warm leads this week',
          'Increase rates by 15% for new clients',
          'Optimize proposal templates for faster conversion'
        ];
        break;

      case 'recruiter':
        message = `Recruiter Mode active. Scanning your ${roleMetrics.activeCandidates} active candidates for optimal matches.`;
        metricsUpdated = ['activeCandidates', 'openPositions', 'vettingEfficiency'];
        suggestions = [
          'Schedule interviews with top 3 candidates',
          'Expand sourcing to include remote talent',
          'Update job descriptions with salary ranges'
        ];
        break;

      case 'manager':
        message = `Manager Mode active. Team velocity at ${roleMetrics.teamVelocity}% with ${roleMetrics.activeProjects} active projects.`;
        metricsUpdated = ['teamVelocity', 'resourceUtilization', 'performanceScore'];
        suggestions = [
          'Optimize sprint planning for next quarter',
          'Reallocate resources to high-priority projects',
          'Schedule 1:1s with underperforming team members'
        ];
        break;
    }

    return {
      message,
      metricsUpdated,
      intelligenceBrief: briefs,
      suggestions,
    };
  }, [user, getRoleMetrics, generateIntelligenceBrief]);

  const performAnalysis = useCallback(async () => {
    if (!user) return;

    setIsAnalyzing(true);
    try {
      const response = await generateAIResponse('manual');
      setAiResponse(response);
      setLastAnalysis(new Date().toISOString());

      // Show toast notification
      toast.success(response.message, {
        description: response.intelligenceBrief?.[0]?.description,
        duration: 4000,
      });

      // Update metrics
      response.metricsUpdated?.forEach(metric => {
        incrementMetric(user.role, metric, 0); // Trigger update without changing value
      });
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, generateAIResponse, incrementMetric]);

  // Auto-analysis on component mount and data changes
  useEffect(() => {
    if (user && !lastAnalysis) {
      performAnalysis();
    }
  }, [user, lastAnalysis, performAnalysis]);

  // Listen for data changes and trigger automatic updates
  useEffect(() => {
    const handleDataChange = () => {
      if (user && useGlobalMetricsStore.getState().autoUpdateEnabled) {
        setTimeout(() => {
          generateAIResponse('data_change').then(response => {
            setAiResponse(prev => ({ ...prev, ...response }));
          });
        }, 1000);
      }
    };

    // Subscribe to store changes (simplified - in real implementation would be more sophisticated)
    const unsubscribeFreelance = useFreelanceStore.subscribe(handleDataChange);
    const unsubscribeRecruiter = useRecruiterStore.subscribe(handleDataChange);
    const unsubscribeProjects = useProjectsStore.subscribe(handleDataChange);
    const unsubscribeApplications = useApplicationsStore.subscribe(handleDataChange);

    return () => {
      unsubscribeFreelance();
      unsubscribeRecruiter();
      unsubscribeProjects();
      unsubscribeApplications();
    };
  }, [user, generateAIResponse]);

  if (!user || !aiResponse) return null;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            Core Intelligence
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={performAnalysis}
            disabled={isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Analyze
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* AI Message */}
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm font-medium">{aiResponse.message}</p>
        </div>

        {/* Intelligence Briefs */}
        {aiResponse.intelligenceBrief && aiResponse.intelligenceBrief.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Intelligence Brief
            </h4>
            {aiResponse.intelligenceBrief.slice(0, 2).map((brief) => (
              <div key={brief.id} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h5 className="text-sm font-medium">{brief.title}</h5>
                  <Badge 
                    variant={brief.impact === 'high' ? 'destructive' : brief.impact === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {brief.impact}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{brief.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {brief.type} • {brief.source || 'AI Analysis'}
                  </span>
                  {brief.actionUrl && (
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {aiResponse.suggestions && aiResponse.suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Strategic Actions
            </h4>
            <div className="space-y-1">
              {aiResponse.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metrics Updated */}
        {aiResponse.metricsUpdated && aiResponse.metricsUpdated.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Metrics updated: {aiResponse.metricsUpdated.join(', ')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

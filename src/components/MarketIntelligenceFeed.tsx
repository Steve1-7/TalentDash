import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useFreelanceStore } from '@/stores/freelanceStore';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  ExternalLink, 
  Clock, 
  DollarSign,
  MapPin,
  Building,
  Star,
  Filter,
  RefreshCw,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface MarketOpportunity {
  id: string;
  title: string;
  company: string;
  location?: string;
  rate?: number;
  type: 'freelance' | 'full-time' | 'contract';
  matchScore: number;
  source: 'linkedin' | 'indeed' | 'upwork' | 'internal';
  postedDate: string;
  urgency: 'high' | 'medium' | 'low';
  skills: string[];
  description: string;
  actionUrl?: string;
  isHighProbability: boolean;
}

interface MarketIntelligenceFeedProps {
  className?: string;
}

export function MarketIntelligenceFeed({ className }: MarketIntelligenceFeedProps) {
  const { user } = useAuthStore();
  const { gigs } = useFreelanceStore();
  const { applications } = useApplicationsStore();
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high-probability' | 'recent'>('all');

  const generateMarketOpportunities = async (): Promise<MarketOpportunity[]> => {
    if (!user) return [];

    const opportunities: MarketOpportunity[] = [];
    const userSkills = user.skills || [];
    
    // Simulate external API calls with realistic data based on user role and skills
    if (user.role === 'freelancer' || user.role === 'developer') {
      // High-probability matches based on user skills
      if (userSkills.includes('React') || userSkills.includes('TypeScript')) {
        opportunities.push({
          id: crypto.randomUUID(),
          title: 'Senior React Developer',
          company: 'TechCorp Solutions',
          location: 'Remote',
          rate: 150,
          type: 'freelance',
          matchScore: 92,
          source: 'upwork',
          postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          urgency: 'high',
          skills: ['React', 'TypeScript', 'Node.js'],
          description: 'Looking for experienced React developer for 3-month project. Enterprise client.',
          actionUrl: 'https://upwork.com/job/123',
          isHighProbability: true,
        });
      }

      if (userSkills.includes('Python') || userSkills.includes('Machine Learning')) {
        opportunities.push({
          id: crypto.randomUUID(),
          title: 'ML Engineer - Remote',
          company: 'DataFlow Analytics',
          location: 'San Francisco, CA / Remote',
          rate: 180,
          type: 'contract',
          matchScore: 88,
          source: 'linkedin',
          postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          urgency: 'high',
          skills: ['Python', 'TensorFlow', 'AWS'],
          description: 'Seeking ML engineer for computer vision project. 6-month contract with potential extension.',
          actionUrl: 'https://linkedin.com/jobs/456',
          isHighProbability: true,
        });
      }

      // Additional opportunities based on market trends
      opportunities.push({
        id: crypto.randomUUID(),
        title: 'Full Stack Developer',
        company: 'StartupHub',
        location: 'New York, NY',
        rate: 120,
        type: 'freelance',
        matchScore: 75,
        source: 'indeed',
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        urgency: 'medium',
        skills: ['JavaScript', 'React', 'MongoDB'],
        description: 'Growing startup needs full stack developer for MVP development.',
        actionUrl: 'https://indeed.com/job/789',
        isHighProbability: false,
      });
    }

    if (user.role === 'recruiter') {
      // Market insights for recruiters
      opportunities.push({
        id: crypto.randomUUID(),
        title: 'Senior Frontend Developer',
        company: 'Your Company',
        location: 'Remote',
        rate: 130000,
        type: 'full-time',
        matchScore: 85,
        source: 'internal',
        postedDate: new Date().toISOString(),
        urgency: 'high',
        skills: ['React', 'TypeScript', 'CSS'],
        description: 'Active candidate pool: 12 qualified applicants in your system.',
        isHighProbability: true,
      });
    }

    if (user.role === 'manager') {
      // Resource allocation insights
      opportunities.push({
        id: crypto.randomUUID(),
        title: 'Team Resource Optimization',
        company: 'Internal Analysis',
        type: 'contract',
        matchScore: 90,
        source: 'internal',
        postedDate: new Date().toISOString(),
        urgency: 'high',
        skills: ['Project Management', 'Resource Planning'],
        description: '2 team members available for new projects. Q2 capacity: 85%',
        isHighProbability: true,
      });
    }

    // Add some random market opportunities
    const marketOpportunities = [
      {
        title: 'DevOps Engineer',
        company: 'CloudScale Inc',
        location: 'Austin, TX',
        rate: 140,
        type: 'freelance' as const,
        source: 'linkedin' as const,
        skills: ['Docker', 'Kubernetes', 'AWS'],
        description: 'Cloud migration project for enterprise client.',
      },
      {
        title: 'Mobile App Developer',
        company: 'AppWorks Studio',
        location: 'Remote',
        rate: 110,
        type: 'contract' as const,
        source: 'upwork' as const,
        skills: ['React Native', 'iOS', 'Android'],
        description: 'Cross-platform mobile app development.',
      },
    ];

    marketOpportunities.forEach((opp, index) => {
      opportunities.push({
        id: crypto.randomUUID(),
        ...opp,
        matchScore: 65 + Math.random() * 20,
        postedDate: new Date(Date.now() - (index + 4) * 24 * 60 * 60 * 1000).toISOString(),
        urgency: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
        isHighProbability: false,
      });
    });

    return opportunities.sort((a, b) => {
      // Sort by match score and whether it's high probability
      if (a.isHighProbability && !b.isHighProbability) return -1;
      if (!a.isHighProbability && b.isHighProbability) return 1;
      return b.matchScore - a.matchScore;
    });
  };

  const loadOpportunities = async () => {
    setIsLoading(true);
    try {
      const newOpportunities = await generateMarketOpportunities();
      setOpportunities(newOpportunities);
      
      // Show notification for high-probability matches
      const highProbMatches = newOpportunities.filter(opp => opp.isHighProbability);
      if (highProbMatches.length > 0) {
        toast.success(`Found ${highProbMatches.length} high-probability matches for your profile!`, {
          description: 'Check your Market Intelligence Feed for details.',
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error('Failed to load market opportunities');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
    
    // Set up daily refresh (in real app, this would be a background job)
    const interval = setInterval(() => {
      loadOpportunities();
    }, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearInterval(interval);
  }, [user]);

  const filteredOpportunities = opportunities.filter(opp => {
    if (filter === 'high-probability') return opp.isHighProbability;
    if (filter === 'recent') {
      const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
      return new Date(opp.postedDate).getTime() > twoDaysAgo;
    }
    return true;
  });

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'linkedin': return '💼';
      case 'indeed': return '🔍';
      case 'upwork': return '🎯';
      case 'internal': return '🏢';
      default: return '📊';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Market Intelligence Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'high-probability' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('high-probability')}
              >
                High Match
              </Button>
              <Button
                variant={filter === 'recent' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('recent')}
              >
                Recent
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadOpportunities}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {filteredOpportunities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No market opportunities available</p>
            <p className="text-sm">Check back later for new matches</p>
          </div>
        ) : (
          filteredOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                opportunity.isHighProbability 
                  ? 'bg-primary/5 border-primary/20' 
                  : 'bg-muted/30 border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{opportunity.title}</h4>
                    {opportunity.isHighProbability && (
                      <Badge variant="default" className="text-xs gap-1">
                        <Zap className="h-3 w-3" />
                        High Match
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {opportunity.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {getSourceIcon(opportunity.source)}
                      {opportunity.source}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={getUrgencyColor(opportunity.urgency)} className="text-xs">
                    {opportunity.urgency}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3" />
                    {opportunity.matchScore}% match
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {opportunity.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {opportunity.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {opportunity.location}
                    </span>
                  )}
                  {opportunity.rate && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {opportunity.type === 'full-time' 
                        ? `$${opportunity.rate.toLocaleString()}/yr`
                        : `$${opportunity.rate}/hr`
                      }
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {Math.floor((Date.now() - new Date(opportunity.postedDate).getTime()) / (24 * 60 * 60 * 1000))}d ago
                  </span>
                </div>

                {opportunity.actionUrl && (
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {opportunity.skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {opportunity.skills.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{opportunity.skills.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

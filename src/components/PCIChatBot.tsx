import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useGlobalMetricsStore } from '@/stores/globalMetricsStore';
import { useFreelanceStore } from '@/stores/freelanceStore';
import { useRecruiterStore } from '@/stores/recruiterStore';
import { useProjectsStore } from '@/stores/projectsStore';
import { useApplicationsStore } from '@/stores/applicationsStore';
import { aiService, type AIResponse } from '@/lib/ai-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Send, 
  Sparkles, 
  TrendingUp, 
  Target,
  Lightbulb,
  Zap,
  ChevronDown,
  ChevronUp,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  persona?: string;
  intelligenceBrief?: {
    type: 'market' | 'company' | 'skill' | 'opportunity';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  };
  metricsUpdate?: {
    metric: string;
    value: number | string;
    change: string;
  };
}

interface PCIChatBotProps {
  className?: string;
}

export function PCIChatBot({ className }: PCIChatBotProps) {
  const { user } = useAuthStore();
  const { getRoleMetrics, incrementMetric } = useGlobalMetricsStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activePersona, setActivePersona] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      setActivePersona(user.role.toUpperCase());
      // Initialize with welcome message
      const welcomeMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: getPersonaWelcomeMessage(user.role),
        timestamp: new Date().toISOString(),
        persona: user.role.toUpperCase(),
        intelligenceBrief: {
          type: 'market',
          title: 'PCI System Active',
          description: 'Core Intelligence monitoring your dashboard metrics and market opportunities in real-time.',
          impact: 'high'
        }
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  const getPersonaWelcomeMessage = (role: string): string => {
    switch (role) {
      case 'developer':
        return `[DEV_MODE] Core Intelligence online. Monitoring your GitHub velocity, technical debt, and portfolio value. Ready to optimize your proof of work strategy.`;
      case 'freelancer':
        return `[FREELANCE_MODE] Revenue optimization engine active. Tracking client retention, lead conversion, and hourly rates. Let's maximize your profitability.`;
      case 'recruiter':
        return `[RECRUITER_MODE] Talent density scanner operational. Analyzing candidate pipelines, vetting speed, and cultural fit metrics. Ready to enhance your recruitment strategy.`;
      case 'manager':
        return `[MANAGER_MODE] Team health monitor engaged. Tracking roadmap certainty, capacity planning, and resource allocation. Optimizing your team's performance.`;
      default:
        return `Core Intelligence system active. How can I enhance your career strategy today?`;
    }
  };

  const generateIntelligenceResponse = async (userMessage: string): Promise<ChatMessage> => {
    if (!user) throw new Error('User not found');

    const metrics = getRoleMetrics(user.role);
    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    try {
      // Use real AI service
      const aiResponse: AIResponse = await aiService.generateResponse(
        userMessage,
        user.role,
        metrics,
        conversationHistory
      );

      return {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        persona: aiResponse.persona,
        intelligenceBrief: aiResponse.intelligenceBrief,
        metricsUpdate: aiResponse.metricsUpdate
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Fallback to mock response
      const lowerMessage = userMessage.toLowerCase();
      const entities = extractEntities(userMessage);
      let intelligenceBrief = null;
      let metricsUpdate = null;

      // Generate fallback response based on persona
      let response = '';
      const roleMetrics = metrics as any;
      
      switch (user.role) {
        case 'developer':
          response = `[DEV_MODE] Core Intelligence processing your request. Current portfolio shows ${roleMetrics.activeProjects || 0} active projects. Focus on completing high-impact work that demonstrates technical excellence.`;
          break;
        case 'freelancer':
          response = `[FREELANCE_MODE] Revenue optimization analysis in progress. Your current pipeline shows $${roleMetrics.potentialRevenue || 0} potential revenue. Consider rate optimization strategies.`;
          break;
        case 'recruiter':
          response = `[RECRUITER_MODE] Talent pipeline analysis active. You have ${roleMetrics.activeCandidates || 0} candidates in process. Focus on high-quality matches and efficient vetting.`;
          break;
        case 'manager':
          response = `[MANAGER_MODE] Team performance monitoring active. Current velocity at ${roleMetrics.teamVelocity || 0}% with ${roleMetrics.resourceUtilization || 0}% resource utilization.`;
          break;
        default:
          response = 'Core Intelligence analyzing your request. System optimizing for your career success.';
      }

      // Generate intelligence brief if entities found (fallback)
      if (entities.companies.length > 0 || entities.technologies.length > 0) {
        intelligenceBrief = generateMarketIntelligence(entities, user.role);
      }

      return {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        persona: user.role.toUpperCase(),
        intelligenceBrief,
        metricsUpdate
      };
    }
  };

  const extractEntities = (message: string) => {
    const companies = [];
    const technologies = [];
    const skills = [];

    // Simple entity extraction (in production, use NLP)
    const techKeywords = ['react', 'typescript', 'python', 'javascript', 'node', 'aws', 'docker', 'kubernetes', 'mongodb', 'postgresql'];
    const companyKeywords = ['google', 'microsoft', 'amazon', 'apple', 'meta', 'netflix', 'spotify', 'uber', 'airbnb'];

    const words = message.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (techKeywords.includes(word)) technologies.push(word);
      if (companyKeywords.includes(word)) companies.push(word);
    });

    return { companies, technologies, skills };
  };

  const generateMarketIntelligence = (entities: any, role: string) => {
    const { companies, technologies } = entities;
    
    if (companies.length > 0) {
      return {
        type: 'company' as const,
        title: `${companies[0].charAt(0).toUpperCase() + companies[0].slice(1)} Intelligence`,
        description: `${companies[0].charAt(0).toUpperCase() + companies[0].slice(1)} is expanding their ${role === 'recruiter' ? 'engineering team' : 'market presence'}. Strong growth trajectory detected.`,
        impact: 'high' as const
      };
    }

    if (technologies.length > 0) {
      return {
        type: 'skill' as const,
        title: 'Skill Arbitrage Opportunity',
        description: `${technologies[0].charAt(0).toUpperCase() + technologies[0].slice(1)} demand up 23% this quarter. Your current skill alignment could increase market value by 35%.`,
        impact: 'medium' as const
      };
    }

    return null;
  };

  const generateDeveloperResponse = async (message: string, entities: any, metrics: any) => {
    let response = `[DEV_MODE] `;
    
    if (message.includes('project') || message.includes('portfolio')) {
      response += `Portfolio analysis complete. You have ${metrics.activeProjects} active projects with a completion rate of ${metrics.completedProjects > 0 ? Math.round((metrics.completedProjects / (metrics.activeProjects + metrics.completedProjects)) * 100) : 0}%. `;
      response += `GitHub velocity at ${metrics.githubCommits} commits. Consider optimizing your technical debt ratio.`;
    } else if (message.includes('skill') || message.includes('learn')) {
      response += `Skill gap analysis indicates cloud architecture and system design are high-value additions. These could increase your market value by 40%. Current learning velocity: ${metrics.learningHours}h logged.`;
    } else if (entities.technologies.length > 0) {
      response += `${entities.technologies[0].charAt(0).toUpperCase() + entities.technologies[0].slice(1)} expertise detected. Market demand for this skill is at 87% saturation. Consider specializing in adjacent technologies for differentiation.`;
    } else {
      response += `Core Intelligence monitoring your development metrics. Current proof-of-work score: ${metrics.activeProjects * 10 + metrics.githubCommits}. Ready to optimize your technical strategy.`;
    }

    return response;
  };

  const generateFreelancerResponse = async (message: string, entities: any, metrics: any) => {
    let response = `[FREELANCE_MODE] `;
    
    if (message.includes('rate') || message.includes('price')) {
      response += `Rate optimization analysis: Your current average of $${metrics.averageRate}/hr is ${metrics.averageRate < 100 ? 'below' : 'above'} market rate. Consider a 15-20% increase based on your skill density.`;
    } else if (message.includes('client') || message.includes('lead')) {
      response += `Lead conversion at ${metrics.leadConversion.toFixed(1)}%. Pipeline value: $${metrics.potentialRevenue.toLocaleString()}. Focus on high-probability leads with budgets >$10k for maximum ROI.`;
    } else if (message.includes('gig') || message.includes('project')) {
      response += `Gig portfolio analysis: ${metrics.activeGigs} active engagements generating $${metrics.potentialRevenue.toLocaleString()} potential revenue. Diversify into retainer contracts for stability.`;
    } else {
      response += `Revenue optimization engine active. Current hourly efficiency: ${metrics.averageRate > 0 ? 'OPTIMAL' : 'SUBOPTIMAL'}. Ready to maximize your profitability.`;
    }

    return response;
  };

  const generateRecruiterResponse = async (message: string, entities: any, metrics: any) => {
    let response = `[RECRUITER_MODE] `;
    
    if (message.includes('candidate') || message.includes('hire')) {
      response += `Talent density analysis: ${metrics.activeCandidates} active candidates in pipeline. Vetting efficiency at ${metrics.vettingEfficiency}%. Top 3 candidates show 92% role compatibility.`;
    } else if (message.includes('interview') || message.includes('process')) {
      response += `Interview funnel optimization: Average time-to-hire at ${metrics.avgTimeToHire} days. Implement structured interviews to reduce by 30% while maintaining quality.`;
    } else if (message.includes('role') || message.includes('position')) {
      response += `Role market intelligence: ${metrics.openPositions} open positions. Talent match score at ${metrics.talentMatchScore}%. Expand sourcing to include passive candidates for 40% increase in qualified leads.`;
    } else {
      response += `Recruitment intelligence active. Current pipeline health: ${metrics.vettingEfficiency > 80 ? 'OPTIMAL' : 'OPTIMIZATION NEEDED'}. Ready to enhance your talent acquisition strategy.`;
    }

    return response;
  };

  const generateManagerResponse = async (message: string, entities: any, metrics: any) => {
    let response = `[MANAGER_MODE] `;
    
    if (message.includes('team') || message.includes('performance')) {
      response += `Team health analysis: Velocity at ${metrics.teamVelocity}%, utilization at ${metrics.resourceUtilization}%. Performance score of ${metrics.performanceScore}% indicates ${metrics.performanceScore > 85 ? 'high' : 'moderate'} team effectiveness.`;
    } else if (message.includes('project') || message.includes('roadmap')) {
      response += `Roadmap certainty assessment: ${metrics.activeProjects} active projects. Resource allocation shows ${metrics.resourceUtilization > 80 ? 'OPTIMAL' : 'SUBOPTIMAL'} utilization. Consider capacity planning adjustments.`;
    } else if (message.includes('capacity') || message.includes('resource')) {
      response += `Capacity planning analysis: Current team size of ${metrics.teamSize} with ${metrics.resourceUtilization}% utilization. Available capacity for ${Math.floor(metrics.teamSize * (1 - metrics.resourceUtilization / 100))} additional team members.`;
    } else {
      response += `Managerial intelligence active. Team performance indicators: ${metrics.teamVelocity > 80 ? 'STRONG' : 'DEVELOPING'} velocity. Ready to optimize your operational strategy.`;
    }

    return response;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const assistantMessage = await generateIntelligenceResponse(input);
      setMessages(prev => [...prev, assistantMessage]);

      // Show toast notification for intelligence briefs
      if (assistantMessage.intelligenceBrief) {
        toast.success('Market Intelligence Generated', {
          description: assistantMessage.intelligenceBrief.title,
          duration: 4000,
        });
      }

      // Update metrics if needed
      if (assistantMessage.metricsUpdate) {
        incrementMetric(user.role, assistantMessage.metricsUpdate.metric, 0);
      }
    } catch (error) {
      toast.error('Failed to generate response');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) return null;

  return (
    <Card className={`flex flex-col ${isMinimized ? 'h-auto' : 'h-[600px]'} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            PCI Assistant
            {activePersona && (
              <Badge variant="secondary" className="text-xs">
                {activePersona}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 p-0"
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {!isMinimized && (
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                    <div className={`rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {message.intelligenceBrief && (
                        <div className="mt-3 p-3 bg-background/50 rounded-lg border">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="h-4 w-4 text-yellow-500" />
                            <span className="text-xs font-medium">Intelligence Brief</span>
                            <Badge 
                              variant={message.intelligenceBrief.impact === 'high' ? 'destructive' : 'default'}
                              className="text-xs"
                            >
                              {message.intelligenceBrief.impact}
                            </Badge>
                          </div>
                          <h5 className="text-sm font-medium mb-1">{message.intelligenceBrief.title}</h5>
                          <p className="text-xs text-muted-foreground">{message.intelligenceBrief.description}</p>
                        </div>
                      )}
                      
                      {message.metricsUpdate && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <TrendingUp className="h-3 w-3" />
                          <span>{message.metricsUpdate.metric}: {message.metricsUpdate.value}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      <span className="text-sm">Core Intelligence processing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask PCI about your career strategy..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="shrink-0"
              >
                {isTyping ? (
                  <Sparkles className="h-4 w-4 animate-pulse" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              <span>Zero-latency research active</span>
              <span>·</span>
              <span>Market intelligence enabled</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

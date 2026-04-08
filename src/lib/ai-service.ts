import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo - in production use backend API
});

export interface AIResponse {
  content: string;
  persona: string;
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

export interface MarketResearchData {
  entity: string;
  entityType: 'company' | 'technology' | 'skill';
  data: {
    description: string;
    marketTrends: string;
    demandLevel: number;
    averageSalary?: number;
    growthRate?: number;
    companies?: string[];
    skills?: string[];
  };
  lastUpdated: string;
}

class AIService {
  private cache = new Map<string, MarketResearchData>();

  async generateResponse(
    userMessage: string,
    userRole: string,
    userMetrics: any,
    conversationHistory: Array<{ role: string; content: string }> = []
  ): Promise<AIResponse> {
    try {
      // Extract entities for research
      const entities = this.extractEntities(userMessage);
      
      // Generate market intelligence if entities found
      let intelligenceBrief = null;
      if (entities.companies.length > 0 || entities.technologies.length > 0) {
        intelligenceBrief = await this.generateIntelligenceBrief(entities, userRole);
      }

      // Build system prompt based on user role
      const systemPrompt = this.getSystemPrompt(userRole, userMetrics);

      // Build conversation context
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10), // Last 10 messages for context
        { role: 'user', content: userMessage }
      ];

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'text' }
      });

      const content = completion.choices[0]?.message?.content || 'I apologize, but I encountered an issue processing your request.';

      return {
        content,
        persona: userRole.toUpperCase(),
        intelligenceBrief
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      // Fallback to mock response
      return this.getFallbackResponse(userMessage, userRole, userMetrics);
    }
  }

  async performMarketResearch(entity: string, entityType: 'company' | 'technology' | 'skill'): Promise<MarketResearchData> {
    const cacheKey = `${entity}-${entityType}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      // Cache for 1 hour
      if (Date.now() - new Date(cached.lastUpdated).getTime() < 3600000) {
        return cached;
      }
    }

    try {
      const prompt = this.getResearchPrompt(entity, entityType);
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a market research analyst. Provide factual, up-to-date information about companies, technologies, and skills. Format your response as structured JSON with market trends, demand levels, and relevant data.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 800,
        response_format: { type: 'text' }
      });

      const researchData = this.parseResearchResponse(entity, entityType, completion.choices[0]?.message?.content || '');

      const result: MarketResearchData = {
        entity,
        entityType,
        data: researchData,
        lastUpdated: new Date().toISOString()
      };

      // Cache the result
      this.cache.set(cacheKey, result);

      return result;

    } catch (error) {
      console.error('Market Research Error:', error);
      return this.getFallbackResearchData(entity, entityType);
    }
  }

  private extractEntities(message: string) {
    const companies = [];
    const technologies = [];
    const skills = [];

    // Enhanced entity extraction with more comprehensive lists
    const techKeywords = [
      'react', 'typescript', 'python', 'javascript', 'node', 'nodejs', 'aws', 'azure', 'gcp',
      'docker', 'kubernetes', 'k8s', 'mongodb', 'postgresql', 'mysql', 'redis', 'graphql',
      'rest', 'api', 'microservices', 'serverless', 'jamstack', 'nextjs', 'vue', 'angular',
      'flutter', 'react native', 'swift', 'kotlin', 'rust', 'go', 'elixir', 'ruby', 'rails',
      'django', 'flask', 'fastapi', 'express', 'nest', 'spring', 'laravel', 'dotnet', 'csharp'
    ];

    const companyKeywords = [
      'google', 'microsoft', 'amazon', 'apple', 'meta', 'facebook', 'instagram', 'whatsapp',
      'netflix', 'spotify', 'uber', 'lyft', 'airbnb', 'booking.com', 'expedia', 'tesla',
      'twitter', 'x', 'linkedin', 'github', 'gitlab', 'atlassian', 'jira', 'confluence',
      'slack', 'discord', 'zoom', 'adobe', 'salesforce', 'oracle', 'sap', 'ibm', 'intel',
      'nvidia', 'amd', 'qualcomm', 'broadcom', 'cisco', 'vmware', 'red hat', 'canonical'
    ];

    const words = message.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (techKeywords.includes(word)) technologies.push(word);
      if (companyKeywords.includes(word)) companies.push(word);
    });

    return { companies, technologies, skills };
  }

  private getSystemPrompt(userRole: string, userMetrics: any): string {
    const basePrompt = `You are the Core Intelligence (PCI) for PromptlyOS, an AI-native Career Operating System. You provide sophisticated, ambitious, and witty advice focused on the user's success.`;

    switch (userRole) {
      case 'developer':
        return `${basePrompt}

[DEV_MODE] Focus on "Proof of Work," GitHub velocity, and technical debt. Use technical, high-efficiency language.

Current metrics: ${JSON.stringify(userMetrics)}

Respond with insights about:
- Portfolio optimization and project completion strategies
- Technical skill development and market demand
- GitHub activity and code quality improvements
- System design and architecture best practices
- Job application strategies for technical roles

Always provide actionable, data-driven advice.`;

      case 'freelancer':
        return `${basePrompt}

[FREELANCE_MODE] Focus on "Revenue per Hour," client retention, and lead acquisition. Use strategic, ROI-focused language.

Current metrics: ${JSON.stringify(userMetrics)}

Respond with insights about:
- Rate optimization and pricing strategies
- Client acquisition and retention tactics
- Lead conversion and pipeline management
- Portfolio diversification and high-value gigs
- Business development and scaling strategies

Always focus on maximizing profitability and sustainable growth.`;

      case 'recruiter':
        return `${basePrompt}

[RECRUITER_MODE] Focus on "Talent Density," "Vetting Speed," and "Cultural Fit." Use high-level, human-centric language.

Current metrics: ${JSON.stringify(userMetrics)}

Respond with insights about:
- Candidate sourcing and evaluation strategies
- Interview process optimization
- Talent market analysis and compensation trends
- Diversity and inclusion initiatives
- Employer branding and candidate experience

Always prioritize quality hires and efficient processes.`;

      case 'manager':
        return `${basePrompt}

[MANAGER_MODE] Focus on "Team Health," "Roadmap Certainty," and "Capacity Planning." Use managerial, oversight-oriented language.

Current metrics: ${JSON.stringify(userMetrics)}

Respond with insights about:
- Team performance optimization and velocity
- Resource allocation and capacity planning
- Project management and delivery strategies
- Team development and retention
- Strategic planning and roadmap execution

Always emphasize data-driven decision making and team success.`;

      default:
        return basePrompt;
    }
  }

  private getResearchPrompt(entity: string, entityType: string): string {
    switch (entityType) {
      case 'company':
        return `Provide comprehensive market intelligence about ${entity}. Include:
        1. Company overview and current market position
        2. Recent financial performance and growth trends
        3. Key products/services and competitive advantages
        4. Hiring trends and in-demand roles
        5. Company culture and work environment
        6. Recent news and strategic initiatives
        Format as structured data with specific metrics and insights.`;

      case 'technology':
        return `Provide detailed market analysis for ${entity} technology. Include:
        1. Current market demand and adoption rates
        2. Average salary ranges and compensation trends
        3. Required skills and experience levels
        4. Growth projections and future outlook
        5. Top companies using this technology
        6. Learning resources and certification options
        Provide specific numbers and data points where possible.`;

      case 'skill':
        return `Analyze the market value and demand for ${entity} skills. Include:
        1. Current demand level and market saturation
        2. Average salary impact and earning potential
        3. Required proficiency levels and experience
        4. Complementary skills that increase value
        5. Industry sectors with highest demand
        6. Learning path and time to proficiency
        Focus on actionable career development insights.`;

      default:
        return `Provide market intelligence about ${entity}. Include relevant trends, demand levels, and strategic insights.`;
    }
  }

  private parseResearchResponse(entity: string, entityType: string, response: string): any {
    // In production, implement proper JSON parsing
    // For now, return structured mock data
    return {
      description: `${entity} is a significant player in the ${entityType} market with strong growth potential.`,
      marketTrends: 'Positive growth trajectory with increasing demand',
      demandLevel: 85,
      averageSalary: entityType === 'technology' ? 120000 : undefined,
      growthRate: 15,
      companies: entityType === 'technology' ? ['Google', 'Microsoft', 'Amazon'] : undefined,
      skills: entityType === 'technology' ? ['JavaScript', 'Python', 'Cloud'] : undefined
    };
  }

  private async generateIntelligenceBrief(entities: any, userRole: string) {
    if (entities.companies.length > 0) {
      const company = entities.companies[0];
      const research = await this.performMarketResearch(company, 'company');
      
      return {
        type: 'company' as const,
        title: `${company.charAt(0).toUpperCase() + company.slice(1)} Intelligence`,
        description: research.data.description,
        impact: research.data.demandLevel > 80 ? 'high' as const : 'medium' as const
      };
    }

    if (entities.technologies.length > 0) {
      const tech = entities.technologies[0];
      const research = await this.performMarketResearch(tech, 'technology');
      
      return {
        type: 'skill' as const,
        title: 'Skill Arbitrage Opportunity',
        description: `${tech.charAt(0).toUpperCase() + tech.slice(1)} demand up ${research.data.growthRate}% this quarter. Current market value: $${research.data.averageSalary?.toLocaleString()}.`,
        impact: research.data.demandLevel > 80 ? 'high' as const : 'medium' as const
      };
    }

    return null;
  }

  private getFallbackResponse(userMessage: string, userRole: string, userMetrics: any): AIResponse {
    const lowerMessage = userMessage.toLowerCase();
    let content = '';

    switch (userRole) {
      case 'developer':
        content = `[DEV_MODE] Core Intelligence processing your request. Current portfolio shows ${userMetrics.activeProjects || 0} active projects. Focus on completing high-impact work that demonstrates technical excellence.`;
        break;
      case 'freelancer':
        content = `[FREELANCE_MODE] Revenue optimization analysis in progress. Your current pipeline shows $${userMetrics.potentialRevenue || 0} potential revenue. Consider rate optimization strategies.`;
        break;
      case 'recruiter':
        content = `[RECRUITER_MODE] Talent pipeline analysis active. You have ${userMetrics.activeCandidates || 0} candidates in process. Focus on high-quality matches and efficient vetting.`;
        break;
      case 'manager':
        content = `[MANAGER_MODE] Team performance monitoring active. Current velocity at ${userMetrics.teamVelocity || 0}% with ${userMetrics.resourceUtilization || 0}% resource utilization.`;
        break;
      default:
        content = 'Core Intelligence analyzing your request. System optimizing for your career success.';
    }

    return {
      content,
      persona: userRole.toUpperCase()
    };
  }

  private getFallbackResearchData(entity: string, entityType: string): MarketResearchData {
    return {
      entity,
      entityType,
      data: {
        description: `${entity} shows strong market presence with positive growth indicators.`,
        marketTrends: 'Steady growth with increasing demand',
        demandLevel: 75,
        growthRate: 10
      },
      lastUpdated: new Date().toISOString()
    };
  }
}

export const aiService = new AIService();

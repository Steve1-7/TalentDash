interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIResponse {
  message: string;
  suggestions?: string[];
  followUpQuestions?: string[];
}

interface RoleContext {
  role: 'developer' | 'freelancer' | 'recruiter' | 'manager';
  userData: {
    id: string;
    name: string;
    email: string;
    role: string;
    skills?: string[];
  };
  recentActivity: {
    type: string;
    description: string;
  }[];
}

class AIService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenAI API key not found in environment variables');
    }
  }

  private getSystemPrompt(role: string, context: RoleContext): string {
    const rolePrompts: Record<string, string> = {
      developer: `You are an expert AI assistant for developers. You help with:
- Code review and optimization
- Debugging and problem solving
- Best practices and architecture
- Learning new technologies
- Career guidance for developers
- Project management and planning

Always provide practical, actionable advice with code examples when relevant. Be concise but thorough.`,
      
      freelancer: `You are an expert AI assistant for freelancers. You help with:
- Finding and winning clients
- Pricing strategies and negotiation
- Portfolio development
- Time management and productivity
- Client communication
- Business growth strategies

Always provide practical business advice with specific examples. Be encouraging and realistic.`,
      
      recruiter: `You are an expert AI assistant for recruiters. You help with:
- Sourcing and screening candidates
- Interview techniques and questions
- Job description optimization
- Talent pipeline management
- Diversity and inclusion strategies
- Employer branding

Always provide actionable recruiting strategies with real-world examples. Be professional and insightful.`,
      
      manager: `You are an expert AI assistant for managers. You help with:
- Team leadership and motivation
- Performance management
- Strategic planning
- Process optimization
- Conflict resolution
- Communication skills

Always provide practical management advice with leadership frameworks. Be supportive and strategic.`
    };

    const basePrompt = rolePrompts[role as keyof typeof rolePrompts] || rolePrompts.developer;
    
    const contextInfo = context.recentActivity.length > 0 
      ? `\n\nRecent user activity:\n${context.recentActivity.slice(0, 3).map((activity, i) => 
          `${i + 1}. ${activity.type}: ${activity.description}`
        ).join('\n')}`
      : '';

    return `${basePrompt}${contextInfo}

You should respond like a helpful AI assistant similar to ChatGPT or Perplexity:
- Be conversational and natural
- Provide clear, structured answers
- Use formatting (bold, lists) when helpful
- Ask follow-up questions when appropriate
- Provide actionable suggestions
- Be encouraging and supportive

Keep responses concise but comprehensive (typically 2-4 paragraphs unless more detail is needed).`;
  }

  async sendMessage(
    message: string, 
    conversationHistory: AIMessage[], 
    context: RoleContext
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      return this.getFallbackResponse(message, context.role);
    }

    try {
      const messages = [
        {
          role: 'system' as const,
          content: this.getSystemPrompt(context.role, context)
        },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.role as const,
          content: msg.content
        })),
        {
          role: 'user' as const,
          content: message
        }
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = data.choices[0]?.message?.content || 'I apologize, but I encountered an error processing your request.';

      return {
        message: aiMessage,
        suggestions: this.generateSuggestions(message, context.role),
        followUpQuestions: this.generateFollowUpQuestions(message, context.role)
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse(message, context.role);
    }
  }

  private getFallbackResponse(message: string, role: string): AIResponse {
    const fallbackResponses = {
      developer: "I'm currently experiencing connectivity issues, but I can still help! For code-related questions, I recommend checking Stack Overflow, GitHub documentation, or MDN Web Docs. For specific debugging, try breaking down your problem into smaller, testable components.",
      
      freelancer: "I'm having technical difficulties at the moment. For freelance business advice, consider checking platforms like Upwork's blog, Freelancers Union resources, or business development podcasts. Focus on building your portfolio and client relationships.",
      
      recruiter: "I'm temporarily unavailable, but here's some quick advice: Use LinkedIn Recruiter for sourcing, structure interviews with STAR method questions, and always provide clear feedback to candidates. Check industry blogs for latest recruiting trends.",
      
      manager: "I'm experiencing technical issues. For management support, consider Harvard Business Review articles, management books like \"The Manager's Path\", or leadership podcasts. Focus on clear communication and team empowerment."
    };

    return {
      message: fallbackResponses[role as keyof typeof fallbackResponses] || fallbackResponses.developer,
      suggestions: this.generateSuggestions(message, role),
      followUpQuestions: this.generateFollowUpQuestions(message, role)
    };
  }

  private generateSuggestions(message: string, role: string): string[] {
    const suggestions = {
      developer: [
        "Try breaking down the problem into smaller steps",
        "Check the official documentation for the technology you're using",
        "Consider using debugging tools to identify the root cause",
        "Look for similar issues on GitHub or Stack Overflow"
      ],
      
      freelancer: [
        "Update your portfolio with recent projects",
        "Reach out to past clients for testimonials",
        "Research market rates for your skills",
        "Consider specializing in a niche area"
      ],
      
      recruiter: [
        "Optimize your job descriptions for better visibility",
        "Use boolean search strings for candidate sourcing",
        "Implement structured interview processes",
        "Build a talent pipeline for future needs"
      ],
      
      manager: [
        "Schedule regular one-on-one meetings with team members",
        "Set clear expectations and goals",
        "Provide regular feedback and recognition",
        "Focus on removing blockers for your team"
      ]
    };

    return suggestions[role as keyof typeof suggestions] || suggestions.developer;
  }

  private generateFollowUpQuestions(message: string, role: string): string[] {
    const followUpQuestions = {
      developer: [
        "What specific technology stack are you working with?",
        "Have you tried any debugging approaches yet?",
        "What's the expected vs actual behavior?",
        "Are there any error messages you're seeing?"
      ],
      
      freelancer: [
        "What type of projects do you specialize in?",
        "What's your current client acquisition strategy?",
        "Are you facing any specific business challenges?",
        "What are your goals for the next quarter?"
      ],
      
      recruiter: [
        "What type of roles are you hiring for?",
        "What's your current hiring timeline?",
        "What's your company culture like?",
        "Are you looking for junior or senior talent?"
      ],
      
      manager: [
        "What's your team size and structure?",
        "What are your current team challenges?",
        "What does success look like for your team?",
        "How do you currently measure performance?"
      ]
    };

    return followUpQuestions[role as keyof typeof followUpQuestions] || followUpQuestions.developer;
  }

  async generateQuickAction(action: string, context: RoleContext): Promise<string> {
    const quickActions = {
      developer: {
        'code-review': 'I\'ll help you review your code. Please share the code snippet and let me know what specific aspects you\'d like me to focus on (performance, readability, security, etc.).',
        'debug-help': 'Let me help you debug! Please describe the issue, share any error messages, and tell me what you\'ve tried so far.',
        'learn-tech': 'I can help you learn new technologies! What technology are you interested in, and what\'s your current experience level?',
        'career-advice': 'I\'d be happy to provide career guidance! What specific aspect of your developer career would you like to discuss?'
      },
      
      freelancer: {
        'find-clients': 'I can help you find clients! Let me know your skills, experience level, and preferred project types.',
        'pricing-help': 'I\'ll help with pricing strategy. What services do you offer, and what\'s your experience level?',
        'portfolio-review': 'I can review your portfolio! Please share what you currently have and your target clients.',
        'business-growth': 'Let\'s discuss business growth strategies! What are your current revenue and goals?'
      },
      
      recruiter: {
        'job-description': 'I\'ll help optimize your job description! What role are you hiring for and what are the key requirements?',
        'interview-questions': 'I can suggest interview questions! What position and seniority level are you hiring for?',
        'sourcing-strategy': 'Let me help with candidate sourcing! What roles and where are you looking for talent?',
        'diversity-hiring': 'I can help with diversity hiring strategies! What are your current diversity goals?'
      },
      
      manager: {
        'team-meeting': 'I can help structure your team meetings! What\'s the purpose and who will be attending?',
        'performance-review': 'I\'ll help with performance reviews! What feedback do you need to deliver and to whom?',
        'conflict-resolution': 'Let me help with conflict resolution! What\'s the situation and who\'s involved?',
        'strategy-planning': 'I can assist with strategic planning! What are your team goals and timeline?'
      }
    };

    const roleActions = quickActions[context.role as keyof typeof quickActions];
    return roleActions[action as keyof typeof roleActions] || "I'm here to help! Please let me know what you need assistance with.";
  }
}

export const aiService = new AIService();
export type { AIMessage, AIResponse, RoleContext };

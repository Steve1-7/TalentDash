import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Enhanced AI API with streaming and context awareness
const enhancedAIApi = {
  // Streaming responses
  streamResponse: async function* (prompt: string, context: any) {
    const responses = [
      "Analyzing your request...",
      "Processing dashboard context...",
      "Generating intelligent insights...",
      "Creating personalized recommendations...",
      "Finalizing comprehensive response..."
    ];
    
    for (const response of responses) {
      yield response;
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Final comprehensive response
    yield `Based on your current ${context.activeRole} dashboard and ${context.activeSection} view, here's my analysis:\n\n${generateContextualResponse(prompt, context)}`;
  },
  
  // Context-aware analysis
  contextualAnalysis: async (pageContext: string, userAction: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Contextual Analysis for ${pageContext}:\n\nCurrent Action: ${userAction}\nRecommendations:\n1. Optimize workflow efficiency\n2. Leverage AI automation\n3. Enhance data visualization\n4. Implement predictive analytics`);
      }, 1000);
    });
  },
  
  // Advanced capabilities
  deepResearch: async (topic: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Deep Research: ${topic}\n\nExecutive Summary:\n- Market trends indicate 25% growth\n- Key competitors: TechCorp, DataFlow\n- Opportunity gap identified in AI integration\n\nRecommendations:\n1. Invest in AI automation\n2. Focus on user experience\n3. Scale infrastructure\n4. Expand market reach`);
      }, 2000);
    });
  },
  
  // Content generation
  generateContent: async (type: string, context: any) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const templates = {
          email: `Professional Email Generated:\n\nSubject: ${context.subject || 'Project Update'}\n\nDear ${context.recipient || 'Team'},\n\nI hope this message finds you well. I wanted to provide an update on our ${context.project || 'current project'}.\n\n${context.content || 'We are making excellent progress and expect to meet our deadlines.'}\n\nBest regards,\n${context.sender || 'AI Assistant'}`,
          report: `Generated Report:\n\n# ${context.title || 'Project Report'}\n\n## Executive Summary\n${context.summary || 'Project is progressing according to plan.'}\n\n## Key Metrics\n- Progress: ${context.progress || '75%'}\n- Budget Utilization: ${context.budget || '60%'}\n- Team Performance: ${context.performance || 'Excellent'}\n\n## Recommendations\n${context.recommendations || 'Continue current strategy with minor adjustments.'}`,
          strategy: `Strategic Plan:\n\n## Objectives\n${context.objectives || 'Achieve market leadership through innovation'}\n\n## Key Initiatives\n${context.initiatives || '1. AI Integration\n2. Market Expansion\n3. Product Enhancement'}\n\n## Timeline\n${context.timeline || 'Q1: Planning\nQ2: Execution\nQ3: Optimization\nQ4: Scale'}`
        };
        resolve(templates[type] || 'Content generated successfully.');
      }, 1500);
    });
  },
  
  // Workflow automation
  automateWorkflow: async (workflow: string, data: any) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Workflow Automation: ${workflow}\n\nStatus: Completed\nActions Performed:\n1. Data processed successfully\n2. Tasks created and assigned\n3. Notifications sent\n4. Reports generated\n\nEfficiency Gain: 40%\nTime Saved: 2.5 hours`);
      }, 1200);
    });
  }
};

// Helper function for contextual responses
function generateContextualResponse(prompt: string, context: any) {
  const responses = {
    developer: `As a Developer, I recommend:\n\n1. Code Optimization: Review your current projects for performance improvements\n2. Skill Enhancement: Focus on ${context.skills?.[0]?.name || 'React'} and ${context.skills?.[1]?.name || 'TypeScript'}\n3. Project Management: Prioritize high-impact tasks first\n4. Learning Path: Advanced AI integration for development workflows`,
    
    freelancer: `As a Freelancer, I suggest:\n\n1. Portfolio Enhancement: Showcase your best projects prominently\n2. Client Acquisition: Target high-value gigs in ${context.gigs?.[0]?.title || 'React Development'}\n3. Rate Optimization: Based on market analysis, consider 15-20% rate increase\n4. Workflow Automation: Implement AI tools for proposal generation`,
    
    recruiter: `As a Recruiter, I advise:\n\n1. Talent Pipeline: Focus on candidates with ${context.candidates?.[0]?.skills || 'React, TypeScript'} experience\n2. Process Optimization: Implement AI-powered candidate matching\n3. Market Analysis: Current demand for tech roles is up 25%\n4. Retention Strategy: Develop personalized candidate engagement`,
    
    manager: `As a Manager, I recommend:\n\n1. Team Performance: Current productivity at ${context.teamMembers?.[0]?.productivity || '92%'} is excellent\n2. Resource Allocation: Optimize task distribution based on skills\n3. Strategic Planning: Focus on AI integration and automation\n4. Growth Opportunities: Expand team by 20% in Q2`
  };
  
  return responses[context.activeRole] || 'I recommend focusing on your current priorities and leveraging AI tools for enhanced productivity.';
}

// Enhanced database with AI memory
const enhancedDatabase = {
  projects: [
    { id: 1, name: 'Portfolio Website', status: 'In Progress', progress: 75, role: 'developer', aiOptimized: true, insights: 'Performance can be improved by 15%' },
    { id: 2, name: 'E-commerce Platform', status: 'Planning', progress: 25, role: 'freelancer', aiOptimized: false, insights: 'Consider React Native for mobile app' },
    { id: 3, name: 'Mobile App', status: 'Development', progress: 60, role: 'developer', aiOptimized: true, insights: 'Implement AI-powered features' },
  ],
  tasks: [
    { id: 1, title: 'Complete homepage design', project: 'Portfolio Website', priority: 'High', completed: false, role: 'developer', aiSuggestion: 'Use AI design tools for optimization' },
    { id: 2, title: 'Setup database schema', project: 'Mobile App', priority: 'Medium', completed: false, role: 'developer', aiSuggestion: 'Consider NoSQL for flexibility' },
    { id: 3, title: 'Client meeting preparation', project: 'E-commerce Platform', priority: 'High', completed: false, role: 'freelancer', aiSuggestion: 'Prepare AI-generated talking points' },
  ],
  skills: [
    { name: 'React', level: 90, category: 'frontend', aiRecommendation: 'Focus on advanced patterns and performance optimization' },
    { name: 'TypeScript', level: 85, category: 'language', aiRecommendation: 'Explore advanced type system features' },
    { name: 'Node.js', level: 75, category: 'backend', aiRecommendation: 'Learn microservices architecture' },
    { name: 'Python', level: 70, category: 'language', aiRecommendation: 'Focus on AI/ML applications' },
  ],
  aiMemory: {
    userPreferences: {},
    recentInteractions: [],
    learnedPatterns: {},
    workflowHistory: []
  }
};

export default function DashboardPage() {
  console.log('NEXT-GEN AI-FIRST DASHBOARD - DEBUG CHECK');
  
  // Core state
  const [activeRole, setActiveRole] = useState('developer');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // AI Assistant state
  const [aiAssistantOpen, setAiAssistantOpen] = useState(true);
  const [aiMessages, setAiMessages] = useState([
    { id: 1, type: 'ai', content: 'Hello! I\'m your AI assistant. I can help you analyze projects, generate reports, automate workflows, and provide intelligent insights. How can I assist you today?', timestamp: new Date() }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiStreaming, setAiStreaming] = useState(false);
  const [commandMode, setCommandMode] = useState(false);
  const [contextAwareSuggestions, setContextAwareSuggestions] = useState([]);
  
  // Enhanced features state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [voiceMode, setVoiceMode] = useState(false);
  const [recentAiWork, setRecentAiWork] = useState([]);
  const [aiQuickActions, setAiQuickActions] = useState([
    { id: 1, title: 'Analyze Current Projects', description: 'Get AI insights on your active projects', icon: 'ð' },
    { id: 2, title: 'Generate Weekly Report', description: 'Create comprehensive progress report', icon: 'ð' },
    { id: 3, title: 'Optimize Workflow', description: 'AI-powered workflow optimization', icon: 'â' },
    { id: 4, title: 'Market Research', description: 'Real-time market analysis', icon: 'ð' }
  ]);
  
  // Data state
  const [projects, setProjects] = useState(enhancedDatabase.projects);
  const [tasks, setTasks] = useState(enhancedDatabase.tasks);
  const [skills, setSkills] = useState(enhancedDatabase.skills);
  const [gigs, setGigs] = useState([
    { id: 1, title: 'React Developer Needed', budget: '$5000', deadline: '2024-02-15', status: 'Open', role: 'freelancer', aiMatch: 95 },
    { id: 2, title: 'Full Stack Project', budget: '$8000', deadline: '2024-03-01', status: 'Applied', role: 'freelancer', aiMatch: 88 },
  ]);
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'John Doe', skills: 'React, TypeScript, Node.js', experience: '5 years', status: 'Screening', role: 'recruiter', aiScore: 95 },
    { id: 2, name: 'Jane Smith', skills: 'Python, Django, PostgreSQL', experience: '3 years', status: 'Interview', role: 'recruiter', aiScore: 88 },
  ]);
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Alice Johnson', role: 'Senior Developer', productivity: 92, tasks: 8, role: 'manager', aiInsights: 'Top performer, consider leadership role' },
    { id: 2, name: 'Bob Wilson', role: 'Frontend Developer', productivity: 85, tasks: 6, role: 'manager', aiInsights: 'Improving steadily, provide mentorship opportunities' },
  ]);
  
  // Form states
  const [newProjectName, setNewProjectName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('');
  
  // Refs
  const aiMessagesRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Context-aware suggestions
  const updateContextAwareSuggestions = useCallback(() => {
    const suggestions = [];
    
    if (activeSection === 'projects') {
      suggestions.push('Analyze project performance metrics');
      suggestions.push('Generate project timeline optimization');
    } else if (activeSection === 'tasks') {
      suggestions.push('Prioritize tasks by impact and urgency');
      suggestions.push('Automate repetitive task workflows');
    } else if (activeSection === 'skills') {
      suggestions.push('Identify skill gaps and learning paths');
      suggestions.push('Generate skill development plan');
    }
    
    if (activeRole === 'developer') {
      suggestions.push('Review code quality and suggest improvements');
      suggestions.push('Generate technical documentation');
    } else if (activeRole === 'freelancer') {
      suggestions.push('Analyze market rates for your skills');
      suggestions.push('Generate client proposals');
    } else if (activeRole === 'recruiter') {
      suggestions.push('Screen candidates with AI matching');
      suggestions.push('Generate interview questions');
    } else if (activeRole === 'manager') {
      suggestions.push('Analyze team productivity trends');
      suggestions.push('Generate performance reports');
    }
    
    setContextAwareSuggestions(suggestions.slice(0, 4));
  }, [activeSection, activeRole]);
  
  useEffect(() => {
    updateContextAwareSuggestions();
  }, [updateContextAwareSuggestions]);
  
  // AI Assistant functions
  const handleAiMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: aiMessages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    setAiMessages(prev => [...prev, userMessage]);
    
    setAiInput('');
    setAiStreaming(true);
    
    // Get streaming response
    const context = {
      activeRole,
      activeSection,
      projects,
      tasks,
      skills,
      gigs,
      candidates,
      teamMembers
    };
    
    try {
      let fullResponse = '';
      for await (const chunk of enhancedAIApi.streamResponse(message, context)) {
        fullResponse += chunk + '\n';
        setAiMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.type === 'ai' && lastMessage.streaming) {
            lastMessage.content = fullResponse;
          } else {
            newMessages.push({
              id: newMessages.length + 1,
              type: 'ai',
              content: fullResponse,
              timestamp: new Date(),
              streaming: true
            });
          }
          return newMessages;
        });
      }
      
      // Finalize message
      setAiMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.streaming) {
          delete lastMessage.streaming;
        }
        return newMessages;
      });
      
      // Add to recent AI work
      setRecentAiWork(prev => [{
        id: Date.now(),
        type: 'conversation',
        title: message.substring(0, 50) + '...',
        timestamp: new Date(),
        result: fullResponse.substring(0, 100) + '...'
      }, ...prev.slice(0, 4)]);
      
    } catch (error) {
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setAiStreaming(false);
    }
  };
  
  // Command mode handler
  const handleCommand = async (command: string) => {
    setLoading(true);
    try {
      let result;
      if (command.toLowerCase().includes('analyze') && command.toLowerCase().includes('project')) {
        result = await enhancedAIApi.contextualAnalysis('projects', 'Project analysis requested');
      } else if (command.toLowerCase().includes('generate') && command.toLowerCase().includes('report')) {
        result = await enhancedAIApi.generateContent('report', { title: 'Dashboard Report', progress: '75%' });
      } else if (command.toLowerCase().includes('research')) {
        result = await enhancedAIApi.deepResearch(command.split('research')[1]?.trim() || 'market trends');
      } else if (command.toLowerCase().includes('optimize') && command.toLowerCase().includes('workflow')) {
        result = await enhancedAIApi.automateWorkflow('workflow optimization', { role: activeRole });
      } else {
        result = 'Command not recognized. Try commands like: "analyze projects", "generate report", "research market trends", "optimize workflow"';
      }
      
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: result as string,
        timestamp: new Date()
      }]);
      
    } catch (error) {
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: 'Command execution failed. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };
  
  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploadedFiles(prev => [...prev, {
      id: Date.now(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading'
    }]);
    
    // Simulate AI analysis
    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => 
        f.id === Date.now() 
          ? { ...f, status: 'completed', insights: `AI Analysis: ${file.name} contains valuable data for ${activeRole} workflow.` }
          : f
      ));
      
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: `I've analyzed ${file.name}. Here are the key insights:\n\n${file.name} has been processed and is ready for integration into your ${activeRole} workflow.`,
        timestamp: new Date()
      }]);
    }, 2000);
  };
  
  // Quick action handlers
  const handleQuickAction = async (actionId: number) => {
    const action = aiQuickActions.find(a => a.id === actionId);
    if (!action) return;
    
    setLoading(true);
    try {
      let result;
      switch (actionId) {
        case 1:
          result = await enhancedAIApi.contextualAnalysis('projects', 'Project analysis requested');
          break;
        case 2:
          result = await enhancedAIApi.generateContent('report', { title: 'Weekly Report', progress: '75%' });
          break;
        case 3:
          result = await enhancedAIApi.automateWorkflow('workflow optimization', { role: activeRole });
          break;
        case 4:
          result = await enhancedAIApi.deepResearch('current market trends');
          break;
        default:
          result = 'Action completed successfully';
      }
      
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: result as string,
        timestamp: new Date()
      }]);
      
    } catch (error) {
      console.error('Quick action failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Enhanced CRUD functions with AI integration
  const addProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: projects.length + 1,
        name: newProjectName,
        status: 'New',
        progress: 0,
        role: activeRole,
        aiOptimized: false,
        insights: 'AI analysis pending'
      };
      setProjects([...projects, newProject]);
      setNewProjectName('');
      
      // AI suggestion
      setTimeout(() => {
        setAiMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'ai',
          content: `I've noticed you created a new project: "${newProjectName}". I recommend breaking it down into smaller tasks and setting realistic milestones. Would you like me to help you create a project plan?`,
          timestamp: new Date()
        }]);
      }, 1000);
    }
  };
  
  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: tasks.length + 1,
        title: newTaskTitle,
        project: projects[0]?.name || 'General',
        priority: 'Medium',
        completed: false,
        role: activeRole,
        aiSuggestion: 'Consider using AI tools for task optimization'
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };
  
  const addSkill = () => {
    if (newSkillName.trim() && newSkillLevel) {
      const newSkill = {
        name: newSkillName,
        level: parseInt(newSkillLevel),
        category: 'general',
        aiRecommendation: 'AI recommendation: Focus on practical applications'
      };
      setSkills([...skills, newSkill]);
      setNewSkillName('');
      setNewSkillLevel('');
    }
  };
  
  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  // Auto-scroll AI messages
  useEffect(() => {
    if (aiMessagesRef.current) {
      aiMessagesRef.current.scrollTop = aiMessagesRef.current.scrollHeight;
    }
  }, [aiMessages]);
  
  const sidebarItems = [
    { icon: 'ð', label: 'Dashboard', section: 'dashboard' },
    { icon: 'ð', label: 'Projects', section: 'projects' },
    { icon: 'â', label: 'Tasks', section: 'tasks' },
    { icon: 'ð', label: 'Skills', section: 'skills' },
    { icon: 'ð', label: 'Learning', section: 'learning' },
    { icon: 'ð', label: 'Applications', section: 'applications' },
    { icon: 'ð', label: 'Gigs', section: 'gigs' },
    { icon: 'ð', label: 'Clients', section: 'clients' },
    { icon: 'ð', label: 'Earnings', section: 'earnings' },
    { icon: 'ð', label: 'Proposals', section: 'proposals' },
    { icon: 'ð', label: 'Pipeline', section: 'pipeline' },
    { icon: 'â', label: 'Settings', section: 'settings' },
  ];

  const roleOptions = [
    { value: 'developer', label: 'Developer', icon: 'ð' },
    { value: 'freelancer', label: 'Freelancer', icon: 'ð' },
    { value: 'recruiter', label: 'Recruiter', icon: 'ð' },
    { value: 'manager', label: 'Manager', icon: 'ð' },
  ];

  const roleSections = {
    developer: ['dashboard', 'projects', 'tasks', 'skills', 'learning'],
    freelancer: ['dashboard', 'projects', 'tasks', 'skills', 'gigs', 'clients', 'earnings', 'proposals'],
    recruiter: ['dashboard', 'projects', 'pipeline', 'applications'],
    manager: ['dashboard', 'projects', 'tasks', 'team', 'performance', 'assignments']
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', display: 'flex' }}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
          padding: '0.75rem',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          cursor: 'pointer',
          display: window.innerWidth <= 768 ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s'
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>â¡</span>
      </button>

      {/* Enhanced Sidebar */}
      <div style={{ 
        width: sidebarOpen ? '280px' : '0px',
        backgroundColor: 'white', 
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'fixed',
        height: '100vh',
        zIndex: 999,
        overflow: 'hidden',
        boxShadow: sidebarOpen ? '4px 0 6px rgba(0, 0, 0, 0.1)' : 'none'
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem' }}>ð</span>
            PromptlyOS
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#dcfce7', marginTop: '0.25rem' }}>AI-Powered Dashboard</p>
        </div>
        
        {/* AI Quick Actions */}
        <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f8fafc' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>AI Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {aiQuickActions.slice(0, 2).map(action => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  transition: 'all 0.2s',
                  ':hover': { backgroundColor: '#f0fdf4', borderColor: '#16a34a' }
                }}
              >
                <span>{action.icon}</span>
                <span style={{ fontWeight: '500' }}>{action.title}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1rem', overflow: 'auto' }}>
          {sidebarItems.map((item, index) => {
            const isAvailable = roleSections[activeRole]?.includes(item.section);
            return (
              <button
                key={index}
                onClick={() => isAvailable && setActiveSection(item.section)}
                disabled={!isAvailable}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.25rem',
                  border: 'none',
                  borderRadius: '0.75rem',
                  backgroundColor: activeSection === item.section && isAvailable ? '#dcfce7' : 'transparent',
                  color: isAvailable ? (activeSection === item.section ? '#166534' : '#6b7280') : '#d1d5db',
                  textAlign: 'left',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: activeSection === item.section && isAvailable ? '600' : '500',
                  opacity: isAvailable ? 1 : 0.5,
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <span>{item.label}</span>
                {!isAvailable && <span style={{ fontSize: '0.75rem', marginLeft: 'auto' }}>ð</span>}
              </button>
            );
          })}
        </nav>
        
        {/* User Profile */}
        <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb', backgroundColor: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.125rem'
            }}>
              {activeRole.charAt(0).toUpperCase() + activeRole.charAt(1)}
            </div>
            <div>
              <p style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} User
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>AI-Enhanced</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? '280px' : '0px', transition: 'margin-left 0.3s ease' }}>
        {/* Enhanced Top Navigation */}
        <header style={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Dashboard â AI-Powered
            </p>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* File Upload */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.docx,.csv,.txt"
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                ':hover': { backgroundColor: '#f8fafc', borderColor: '#16a34a' }
              }}
            >
              <span>ð</span>
              <span>Upload</span>
            </button>

            {/* Voice Mode */}
            <button
              onClick={() => setVoiceMode(!voiceMode)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                backgroundColor: voiceMode ? '#dcfce7' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                ':hover': { backgroundColor: voiceMode ? '#dcfce7' : '#f8fafc' }
              }}
            >
              <span>ð</span>
              <span>Voice</span>
            </button>

            {/* Command Mode */}
            <button
              onClick={() => setCommandMode(!commandMode)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                backgroundColor: commandMode ? '#dcfce7' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                ':hover': { backgroundColor: commandMode ? '#dcfce7' : '#f8fafc' }
              }}
            >
              <span>â¡</span>
              <span>Command</span>
            </button>

            {/* Role Switcher */}
            <select 
              value={activeRole} 
              onChange={(e) => setActiveRole(e.target.value)}
              style={{ 
                padding: '0.5rem 2rem 0.5rem 1rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.75rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23374151\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                paddingRight: '2rem'
              }}
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>

            {/* Notifications */}
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              style={{ 
                padding: '0.5rem 1rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.75rem',
                backgroundColor: notificationsOpen ? '#f0fdf4' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>ð</span>
              <span>Notifications</span>
              <span style={{ 
                backgroundColor: '#ef4444', 
                color: 'white', 
                borderRadius: '50%', 
                width: '20px', 
                height: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '0.75rem',
                fontWeight: 'bold',
                position: 'absolute',
                top: '-8px',
                right: '-8px'
              }}>
                3
              </span>
            </button>

            {/* Settings */}
            <button 
              onClick={() => setSettingsOpen(!settingsOpen)}
              style={{ 
                padding: '0.5rem 1rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.75rem',
                backgroundColor: settingsOpen ? '#f0fdf4' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>â</span>
              <span>Settings</span>
            </button>
          </div>
        </header>

        {/* Context-Aware Suggestions Bar */}
        {contextAwareSuggestions.length > 0 && (
          <div style={{
            backgroundColor: '#f0fdf4',
            borderBottom: '1px solid #dcfce7',
            padding: '0.75rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#166534' }}>ð AI Suggestions:</span>
            <div style={{ display: 'flex', gap: '0.5rem', flex: 1, overflow: 'auto' }}>
              {contextAwareSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleAiMessage(suggestion)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #16a34a',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    color: '#166534',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    ':hover': { backgroundColor: '#dcfce7' }
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          {/* Enhanced Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '1rem', 
              border: '2px solid #16a34a', 
              textAlign: 'center',
              transition: 'all 0.2s',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              ':hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)' }
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>ð</span>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                  {projects.filter(p => p.role === activeRole).length}
                </h3>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Active Projects</p>
              <p style={{ color: '#16a34a', fontSize: '0.75rem', marginTop: '0.25rem' }}>AI Optimized</p>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '1rem', 
              border: '2px solid #16a34a', 
              textAlign: 'center',
              transition: 'all 0.2s',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              ':hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)' }
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>â</span>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                  {tasks.filter(t => t.role === activeRole && !t.completed).length}
                </h3>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Pending Tasks</p>
              <p style={{ color: '#16a34a', fontSize: '0.75rem', marginTop: '0.25rem' }}>AI Prioritized</p>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '1rem', 
              border: '2px solid #16a34a', 
              textAlign: 'center',
              transition: 'all 0.2s',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              ':hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)' }
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>ð</span>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                  {skills.length}
                </h3>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Skills Tracked</p>
              <p style={{ color: '#16a34a', fontSize: '0.75rem', marginTop: '0.25rem' }}>AI Enhanced</p>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '1rem', 
              border: '2px solid #16a34a', 
              textAlign: 'center',
              transition: 'all 0.2s',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              ':hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)' }
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>ð</span>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                  {Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length)}%
                </h3>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Avg Skill Level</p>
              <p style={{ color: '#16a34a', fontSize: '0.75rem', marginTop: '0.25rem' }}>AI Analyzed</p>
            </div>
          </div>

          {/* Recent AI Work */}
          {recentAiWork.length > 0 && (
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>ð</span>
                Recent AI Work
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {recentAiWork.map(work => (
                  <div key={work.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                    <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{work.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>{work.result}</p>
                    <p style={{ fontSize: '0.75rem', color: '#16a34a' }}>{work.timestamp.toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Role-Specific Content */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* Enhanced AI Tools */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>ð</span>
                AI Tools & Analysis
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Textarea
                  placeholder={commandMode ? "Enter command (e.g., 'analyze projects', 'generate report', 'research market trends')..." : "Ask me anything about your dashboard, projects, or workflow..."}
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (commandMode) {
                        handleCommand(aiInput);
                      } else {
                        handleAiMessage(aiInput);
                      }
                    }
                  }}
                  style={{ 
                    minHeight: '100px', 
                    width: '100%',
                    border: commandMode ? '2px solid #16a34a' : '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button 
                    onClick={() => commandMode ? handleCommand(aiInput) : handleAiMessage(aiInput)}
                    disabled={loading || aiStreaming}
                    style={{ 
                      backgroundColor: '#16a34a', 
                      color: 'white', 
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    {loading || aiStreaming ? 'Processing...' : (commandMode ? 'Execute Command' : 'Send Message')}
                  </Button>
                  
                  <Button
                    onClick={() => setCommandMode(!commandMode)}
                    style={{
                      backgroundColor: commandMode ? '#dcfce7' : '#f3f4f6',
                      color: commandMode ? '#166534' : '#6b7280',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      fontWeight: '500'
                    }}
                  >
                    {commandMode ? 'Chat Mode' : 'Command Mode'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>ð</span>
                  Uploaded Files
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {uploadedFiles.map(file => (
                    <div key={file.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{file.name}</h4>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem',
                          backgroundColor: file.status === 'completed' ? '#dcfce7' : '#fef3c7',
                          color: file.status === 'completed' ? '#166534' : '#92400e'
                        }}>
                          {file.status}
                        </span>
                      </div>
                      {file.insights && (
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>{file.insights}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Common Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* Enhanced Projects */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>ð</span>
                Projects
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Input
                    placeholder="New project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Button onClick={addProject} style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.5rem 1rem' }}>Add</Button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {projects.filter(p => p.role === activeRole).map(project => (
                  <div key={project.id} style={{ 
                    padding: '1rem', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '0.5rem', 
                    backgroundColor: '#f9fafb',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    ':hover': { backgroundColor: '#f0fdf4', borderColor: '#16a34a' }
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{project.name}</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {project.aiOptimized && <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>ð</span>}
                        <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', backgroundColor: '#dcfce7', color: '#16a34a' }}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#16a34a', height: '100%', width: `${project.progress}%` }} />
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{project.progress}% complete</p>
                    {project.insights && (
                      <p style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.5rem', fontStyle: 'italic' }}>ð {project.insights}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Tasks */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>â</span>
                Tasks
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Input
                    placeholder="New task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Button onClick={addTask} style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.5rem 1rem' }}>Add</Button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {tasks.filter(t => t.role === activeRole).map(task => (
                  <div key={task.id} style={{ 
                    padding: '0.75rem', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '0.5rem', 
                    backgroundColor: task.completed ? '#f0fdf4' : '#f9fafb',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    ':hover': { backgroundColor: task.completed ? '#dcfce7' : '#f0fdf4' }
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>{task.title}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{task.project}</p>
                        {task.aiSuggestion && (
                          <p style={{ fontSize: '0.75rem', color: '#16a34a', fontStyle: 'italic' }}>ð {task.aiSuggestion}</p>
                        )}
                      </div>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem',
                        backgroundColor: task.priority === 'High' ? '#fecaca' : task.priority === 'Medium' ? '#fed7aa' : '#e0e7ff',
                        color: task.priority === 'High' ? '#991b1b' : task.priority === 'Medium' ? '#92400e' : '#3730a3'
                      }}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Skills */}
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>ð</span>
              Skills & AI Recommendations
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <Input
                  placeholder="Skill name"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  style={{ flex: 1, minWidth: '200px' }}
                />
                <Input
                  placeholder="Level (0-100)"
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  style={{ width: '120px' }}
                />
                <Button onClick={addSkill} style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.5rem 1rem' }}>Add</Button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {skills.map((skill, index) => (
                <div key={index} style={{ 
                  padding: '1rem', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem', 
                  backgroundColor: '#f9fafb',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  ':hover': { backgroundColor: '#f0fdf4', borderColor: '#16a34a' }
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{skill.name}</h4>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#16a34a' }}>{skill.level}%</span>
                  </div>
                  <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#16a34a', height: '100%', width: `${skill.level}%` }} />
                  </div>
                  {skill.aiRecommendation && (
                    <p style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.5rem', fontStyle: 'italic' }}>ð {skill.aiRecommendation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>ð</span>
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                borderLeft: '4px solid #16a34a', 
                backgroundColor: '#f0fdf4', 
                borderRadius: '0.25rem',
                transition: 'all 0.2s',
                cursor: 'pointer',
                ':hover': { backgroundColor: '#dcfce7' }
              }}>
                <p style={{ fontWeight: '500', color: '#1f2937' }}>Completed task: "Write API documentation"</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>2 hours ago</p>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                borderLeft: '4px solid #16a34a', 
                backgroundColor: '#f0fdf4', 
                borderRadius: '0.25rem',
                transition: 'all 0.2s',
                cursor: 'pointer',
                ':hover': { backgroundColor: '#dcfce7' }
              }}>
                <p style={{ fontWeight: '500', color: '#1f2937' }}>Updated project: "Portfolio Website" progress to 75%</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>5 hours ago</p>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                borderLeft: '4px solid #16a34a', 
                backgroundColor: '#f0fdf4', 
                borderRadius: '0.25rem',
                transition: 'all 0.2s',
                cursor: 'pointer',
                ':hover': { backgroundColor: '#dcfce7' }
              }}>
                <p style={{ fontWeight: '500', color: '#1f2937' }}>Added new skill: "Python" at 70% level</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Yesterday</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* AI Assistant Sidebar */}
      <div style={{
        position: 'fixed',
        right: aiAssistantOpen ? '0px' : '-400px',
        top: '0px',
        width: '400px',
        height: '100vh',
        backgroundColor: 'white',
        borderLeft: '1px solid #e5e7eb',
        boxShadow: '-4px 0 6px rgba(0, 0, 0, 0.1)',
        transition: 'right 0.3s ease',
        zIndex: 998,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* AI Assistant Header */}
        <div style={{ 
          padding: '1rem', 
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>ð</span>
              AI Assistant
            </h3>
            <button
              onClick={() => setAiAssistantOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '0.25rem',
                ':hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              ×
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#dcfce7', marginTop: '0.25rem' }}>Always here to help you succeed</p>
        </div>

        {/* AI Messages */}
        <div 
          ref={aiMessagesRef}
          style={{ 
            flex: 1, 
            padding: '1rem', 
            overflow: 'auto',
            backgroundColor: '#f8fafc'
          }}
        >
          {aiMessages.map(message => (
            <div key={message.id} style={{
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
            }}>
              <div style={{
                maxWidth: '80%',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                backgroundColor: message.type === 'user' ? '#16a34a' : 'white',
                color: message.type === 'user' ? 'white' : '#1f2937',
                fontSize: '0.875rem',
                whiteSpace: 'pre-wrap',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                {message.content}
                {message.streaming && (
                  <span style={{ animation: 'pulse 1s infinite' }}>â¢</span>
                )}
              </div>
            </div>
          ))}
          {aiStreaming && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: 'white',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                color: '#6b7280',
                animation: 'pulse 1s infinite'
              }}>
                AI is thinking...
              </div>
            </div>
          )}
        </div>

        {/* AI Input */}
        <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Input
              placeholder="Ask me anything..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAiMessage(aiInput);
                }
              }}
              style={{ flex: 1 }}
            />
            <Button
              onClick={() => handleAiMessage(aiInput)}
              disabled={loading || aiStreaming}
              style={{ backgroundColor: '#16a34a', color: 'white' }}
            >
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Floating AI Assistant Toggle */}
      {!aiAssistantOpen && (
        <button
          onClick={() => setAiAssistantOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.4)',
            transition: 'all 0.2s',
            zIndex: 997,
            ':hover': { transform: 'scale(1.1)', boxShadow: '0 6px 16px rgba(22, 163, 74, 0.5)' }
          }}
        >
          ð
        </button>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

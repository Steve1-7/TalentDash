import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/authStore';
import './api/settings'; // Import mock API handler

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

// Enhanced data structure for CRUD operations
interface Project {
  id: string;
  name: string;
  description: string;
  siteLink?: string;
  images: string[];
  status: 'Planning' | 'Development' | 'Testing' | 'Completed';
  progress: number;
  role: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  completed: boolean;
  role: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  userId: string;
  createdAt: string;
}

interface Roadmap {
  id: string;
  title: string;
  goal: string;
  mode: 'learning' | 'task' | 'project';
  steps: RoadmapStep[];
  createdAt: string;
}

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
}

interface FileAnalysis {
  id: string;
  fileName: string;
  fileType: string;
  analysis: string;
  uploadedAt: string;
  userId: string;
}

// Local storage utilities for data persistence
const storage = {
  getProjects: (userId: string): Project[] => {
    const data = localStorage.getItem(`projects_${userId}`);
    return data ? JSON.parse(data) : [];
  },
  setProjects: (userId: string, projects: Project[]) => {
    localStorage.setItem(`projects_${userId}`, JSON.stringify(projects));
  },
  getTasks: (userId: string): Task[] => {
    const data = localStorage.getItem(`tasks_${userId}`);
    return data ? JSON.parse(data) : [];
  },
  setTasks: (userId: string, tasks: Task[]) => {
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
  },
  getSkills: (userId: string): Skill[] => {
    const data = localStorage.getItem(`skills_${userId}`);
    return data ? JSON.parse(data) : [];
  },
  setSkills: (userId: string, skills: Skill[]) => {
    localStorage.setItem(`skills_${userId}`, JSON.stringify(skills));
  },
  getRoadmaps: (userId: string): Roadmap[] => {
    const data = localStorage.getItem(`roadmaps_${userId}`);
    return data ? JSON.parse(data) : [];
  },
  setRoadmaps: (userId: string, roadmaps: Roadmap[]) => {
    localStorage.setItem(`roadmaps_${userId}`, JSON.stringify(roadmaps));
  },
  getFileAnalyses: (userId: string): FileAnalysis[] => {
    const data = localStorage.getItem(`fileAnalyses_${userId}`);
    return data ? JSON.parse(data) : [];
  },
  setFileAnalyses: (userId: string, analyses: FileAnalysis[]) => {
    localStorage.setItem(`fileAnalyses_${userId}`, JSON.stringify(analyses));
  },
  getUserSettings: (userId: string) => {
    const data = localStorage.getItem(`settings_${userId}`);
    return data ? JSON.parse(data) : { isPremium: false };
  },
  setUserSettings: (userId: string, settings: any) => {
    localStorage.setItem(`settings_${userId}`, JSON.stringify(settings));
  }
};

// Get user-created data with fallbacks
const getUserData = (userId: string, role: string) => {
  console.log('DEBUG: Getting user data for userId:', userId, 'role:', role);
  
  const projects = storage.getProjects(userId);
  const tasks = storage.getTasks(userId);
  const skills = storage.getSkills(userId);
  
  // If no user data, provide initial fallback data
  const fallbackProjects: Project[] = projects.length === 0 ? [
    { id: '1', name: 'Portfolio Website', description: 'Personal portfolio website with React', status: 'Development', progress: 75, role, userId, images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'E-commerce Platform', description: 'Full-stack e-commerce solution', status: 'Planning', progress: 25, role, userId, images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ] : projects;
  
  const fallbackTasks: Task[] = tasks.length === 0 ? [
    { id: '1', title: 'Complete homepage design', description: 'Design and implement homepage', projectId: fallbackProjects[0]?.id || '1', priority: 'High', completed: false, role, userId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', title: 'Setup database schema', description: 'Create database structure', projectId: fallbackProjects[1]?.id || '2', priority: 'Medium', completed: false, role, userId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ] : tasks;
  
  const fallbackSkills: Skill[] = skills.length === 0 ? [
    { id: '1', name: 'React', level: 90, category: 'frontend', userId, createdAt: new Date().toISOString() },
    { id: '2', name: 'TypeScript', level: 85, category: 'language', userId, createdAt: new Date().toISOString() },
    { id: '3', name: 'Node.js', level: 75, category: 'backend', userId, createdAt: new Date().toISOString() }
  ] : skills;
  
  return {
    projects: fallbackProjects,
    tasks: fallbackTasks,
    skills: fallbackSkills,
    roadmaps: storage.getRoadmaps(userId),
    fileAnalyses: storage.getFileAnalyses(userId),
    gigs: role === 'freelancer' ? [
      { id: '1', title: 'React Developer Needed', budget: '$5000', deadline: '2024-02-15', status: 'Open', role: 'freelancer', userId, createdAt: new Date().toISOString() }
    ] : [],
    candidates: role === 'recruiter' ? [
      { id: '1', name: 'John Doe', skills: 'React, TypeScript, Node.js', experience: '5 years', status: 'Screening', role: 'recruiter', userId, createdAt: new Date().toISOString() }
    ] : [],
    teamMembers: role === 'manager' ? [
      { id: '1', name: 'Alice Johnson', role: 'Senior Developer', productivity: 92, tasks: 8, role: 'manager', userId, createdAt: new Date().toISOString() }
    ] : []
  };
};

interface AIMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

export default function DashboardPage() {
  console.log('PRODUCTION AI-FIRST DASHBOARD - DEBUG CHECK');
  
  // Authentication state
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  
  // Initialize Steve as default user if no authenticated user
  const currentUser = user || {
    id: 'steve-default',
    name: 'Steve',
    email: 'steve@example.com',
    role: 'developer', // Start with developer for CRUD testing
    bio: 'Senior Full-Stack Engineer',
    skills: ['React', 'TypeScript', 'Node.js'],
    company: 'Tech Corp',
    location: 'San Francisco',
    website: 'https://steve.dev',
    github: 'github.com/steve',
    linkedin: 'linkedin.com/in/steve',
    createdAt: new Date().toISOString()
  };
  
  // Core state
  const [activeRole, setActiveRole] = useState(currentUser.role || 'developer');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // User data from current user (real or default)
  const userName = currentUser.name;
  const userEmail = currentUser.email;
  const userAvatar = currentUser.name ? currentUser.name.charAt(0).toUpperCase() + currentUser.name.charAt(1) : 'ST';
  
  // AI Assistant state
  const [aiAssistantOpen, setAiAssistantOpen] = useState(true);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    { id: 1, type: 'ai', content: 'Hello! I\'m your AI assistant. I can help you create projects, manage tasks, generate roadmaps, and analyze files. How can I assist you today?', timestamp: new Date() }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiStreaming, setAiStreaming] = useState(false);
  const [commandMode, setCommandMode] = useState(false);
  const [contextAwareSuggestions, setContextAwareSuggestions] = useState([]);
  
  // Enhanced data states with proper typing
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [gigs, setGigs] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [fileAnalyses, setFileAnalyses] = useState<FileAnalysis[]>([]);
  const [recentAiWork, setRecentAiWork] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  
  // CRUD modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  
  // Form states
  const [newProject, setNewProject] = useState({ name: '', description: '', siteLink: '', images: [] as string[] });
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', priority: 'Medium' as const });
  const [newSkill, setNewSkill] = useState({ name: '', level: 50 });
  const [roadmapGoal, setRoadmapGoal] = useState('');
  const [roadmapMode, setRoadmapMode] = useState<'learning' | 'task' | 'project'>('learning');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // User settings with premium status
  const [userSettings, setUserSettings] = useState(() => storage.getUserSettings(currentUser.id));
  const [isPremium, setIsPremium] = useState(userSettings.isPremium || false);
  
  // Settings state
  const [settings, setSettings] = useState({
    profile: {
      name: userName,
      email: userEmail,
      bio: '',
      location: '',
      website: '',
      github: '',
      linkedin: ''
    },
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true,
      emailAlerts: true,
      aiSuggestions: true
    },
    security: {
      twoFactorEnabled: false,
      lastPasswordChange: '',
      activeSessions: []
    }
  });

  const [settingsData, setSettingsData] = useState({
    profile: {
      name: userName,
      email: userEmail,
      bio: '',
      location: '',
      website: '',
      github: '',
      linkedin: ''
    },
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true,
      emailAlerts: true,
      aiSuggestions: true
    },
    security: {
      twoFactorEnabled: false,
      lastPasswordChange: '',
      activeSessions: []
    }
  });
  
  // Load user-created data once on mount
  useEffect(() => {
    if (!currentUser) return;
    
    console.log('DEBUG: Loading user-created data for Steve...');
    setDataLoading(true);
    setDataError(null);
    
    const userId = currentUser.id || 'steve-default';
    const data = getUserData(userId, activeRole);
    
    console.log('DEBUG: User data loaded:', {
      projects: data.projects.length,
      tasks: data.tasks.length,
      skills: data.skills.length,
      roadmaps: data.roadmaps.length,
      fileAnalyses: data.fileAnalyses.length,
      gigs: data.gigs.length,
      candidates: data.candidates.length,
      teamMembers: data.teamMembers.length
    });
    
    // Set all data at once to prevent multiple re-renders
    setProjects(data.projects);
    setTasks(data.tasks);
    setSkills(data.skills);
    setRoadmaps(data.roadmaps);
    setFileAnalyses(data.fileAnalyses);
    setGigs(data.gigs);
    setCandidates(data.candidates);
    setTeamMembers(data.teamMembers);
    
    setDataLoading(false);
    console.log('DEBUG: User data loading completed - dashboard stable');
  }, [currentUser?.id, activeRole]);
  
  // CRUD functions with localStorage persistence
  const createProject = () => {
    if (!newProject.name.trim() || !currentUser) return;
    
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      siteLink: newProject.siteLink,
      images: newProject.images,
      status: 'Planning',
      progress: 0,
      role: activeRole,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    storage.setProjects(currentUser.id, updatedProjects);
    
    // Reset form
    setNewProject({ name: '', description: '', siteLink: '', images: [] });
    setShowProjectModal(false);
    
    // AI suggestion
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: `Great! I've created your project "${project.name}". I recommend breaking it down into smaller tasks and setting realistic milestones. Would you like me to help you create a project plan?`,
        timestamp: new Date()
      }]);
    }, 1000);
  };
  
  const createTask = () => {
    if (!newTask.title.trim() || !newTask.projectId || !currentUser) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      projectId: newTask.projectId,
      priority: newTask.priority,
      completed: false,
      role: activeRole,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    storage.setTasks(currentUser.id, updatedTasks);
    
    // Reset form
    setNewTask({ title: '', description: '', projectId: '', priority: 'Medium' });
    setShowTaskModal(false);
    
    // AI suggestion
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: `Task "${task.title}" created! I've linked it to the project. Consider setting a deadline and breaking it down into subtasks if it's complex.`,
        timestamp: new Date()
      }]);
    }, 1000);
  };
  
  const generateRoadmap = async () => {
    if (!roadmapGoal.trim() || !currentUser) return;
    
    // Simulate AI roadmap generation
    const roadmap: Roadmap = {
      id: Date.now().toString(),
      title: `Roadmap: ${roadmapGoal}`,
      goal: roadmapGoal,
      mode: roadmapMode,
      steps: [
        { id: '1', title: 'Research & Planning', description: 'Gather requirements and create initial plan', completed: false, order: 1 },
        { id: '2', title: 'Foundation Setup', description: 'Set up basic structure and tools', completed: false, order: 2 },
        { id: '3', title: 'Core Development', description: 'Build main features and functionality', completed: false, order: 3 },
        { id: '4', title: 'Testing & Refinement', description: 'Test and improve the implementation', completed: false, order: 4 },
        { id: '5', title: 'Launch & Deployment', description: 'Deploy and launch the final product', completed: false, order: 5 }
      ],
      createdAt: new Date().toISOString()
    };
    
    const updatedRoadmaps = [...roadmaps, roadmap];
    setRoadmaps(updatedRoadmaps);
    storage.setRoadmaps(currentUser.id, updatedRoadmaps);
    
    // Reset form
    setRoadmapGoal('');
    setShowRoadmapModal(false);
    
    // AI suggestion
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: `I've generated a structured roadmap for "${roadmapGoal}" in ${roadmapMode} mode. You can convert any step into an active task with one click!`,
        timestamp: new Date()
      }]);
    }, 1000);
  };
  
  const handleFileUpload = async () => {
    if (!selectedFile || !currentUser) return;
    
    // Check premium status
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }
    
    // Simulate file analysis
    const analysis: FileAnalysis = {
      id: Date.now().toString(),
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      analysis: `File "${selectedFile.name}" analyzed successfully. Content summary: This document contains valuable information that can be used for project planning and task management. Key insights extracted from the file are now available for AI chat.`,
      uploadedAt: new Date().toISOString(),
      userId: currentUser.id
    };
    
    const updatedAnalyses = [...fileAnalyses, analysis];
    setFileAnalyses(updatedAnalyses);
    storage.setFileAnalyses(currentUser.id, updatedAnalyses);
    
    // Reset form
    setSelectedFile(null);
    setShowFileUploadModal(false);
    
    // AI suggestion
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: `File "${selectedFile.name}" analyzed! I can now answer unlimited questions about its content. Ask me anything about the document!`,
        timestamp: new Date()
      }]);
    }, 1000);
  };
  
  const upgradeToPremium = () => {
    const updatedSettings = { ...userSettings, isPremium: true };
    setUserSettings(updatedSettings);
    storage.setUserSettings(currentUser.id, updatedSettings);
    setIsPremium(true);
    setShowPremiumModal(false);
    
    // AI suggestion
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: 'Welcome to Premium! You now have unlimited file uploads and AI analysis capabilities. Upload any document and I\'ll analyze it for you!',
        timestamp: new Date()
      }]);
    }, 1000);
  };
  
  const convertRoadmapStepToTask = (step: RoadmapStep, roadmap: Roadmap) => {
    if (!currentUser) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: step.title,
      description: `From roadmap: ${roadmap.title}\n${step.description}`,
      projectId: projects[0]?.id || '1',
      priority: 'Medium',
      completed: false,
      role: activeRole,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    storage.setTasks(currentUser.id, updatedTasks);
    
    // Mark step as completed
    const updatedSteps = roadmap.steps.map(s => 
      s.id === step.id ? { ...s, completed: true } : s
    );
    const updatedRoadmap = { ...roadmap, steps: updatedSteps };
    const updatedRoadmaps = roadmaps.map(r => r.id === roadmap.id ? updatedRoadmap : r);
    setRoadmaps(updatedRoadmaps);
    storage.setRoadmaps(currentUser.id, updatedRoadmaps);
  };
  
  // Refs
  const aiMessagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    const userMessage: AIMessage = {
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
  
  // AI Quick Actions data
  const aiQuickActions = [
    { id: 1, title: 'Generate Project Ideas', description: 'AI-powered project suggestions based on your skills' },
    { id: 2, title: 'Analyze Tasks', description: 'Get insights on your task completion patterns' },
    { id: 3, title: 'Skill Assessment', description: 'Evaluate your current skill levels' },
    { id: 4, title: 'Productivity Tips', description: 'Personalized productivity recommendations' }
  ];

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
  
  // Dynamic content rendering based on active section
  const renderActiveContent = () => {
    if (dataLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid #e5e7eb', 
            borderTop: '3px solid #16a34a', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }}></div>
          <p style={{ color: '#000000', fontSize: '1.1rem' }}>Loading your dashboard...</p>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.5rem' }}>{projects.length}</h3>
                <p style={{ color: '#000000', fontSize: '0.875rem' }}>Active Projects</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.5rem' }}>{tasks.filter(t => !t.completed).length}</h3>
                <p style={{ color: '#000000', fontSize: '0.875rem' }}>Pending Tasks</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.5rem' }}>{roadmaps.length}</h3>
                <p style={{ color: '#000000', fontSize: '0.875rem' }}>AI Roadmaps</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.5rem' }}>{fileAnalyses.length}</h3>
                <p style={{ color: '#000000', fontSize: '0.875rem' }}>File Analyses</p>
              </div>
            </div>

            {/* AI Tools */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>ð</span>
                AI Tools & Analysis
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <Button 
                  onClick={() => setShowRoadmapModal(true)}
                  style={{ 
                    backgroundColor: '#16a34a', 
                    color: 'white', 
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  ð Generate AI Roadmap
                </Button>
                <Button 
                  onClick={() => setShowFileUploadModal(true)}
                  style={{ 
                    backgroundColor: isPremium ? '#16a34a' : '#6b7280', 
                    color: 'white', 
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  ð {isPremium ? 'Upload & Analyze File' : 'Upgrade to Upload Files'}
                </Button>
                <Button 
                  onClick={() => setShowProjectModal(true)}
                  style={{ 
                    backgroundColor: '#16a34a', 
                    color: 'white', 
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  ð Create New Project
                </Button>
                <Button 
                  onClick={() => setShowTaskModal(true)}
                  style={{ 
                    backgroundColor: '#16a34a', 
                    color: 'white', 
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                >
                  ð Add New Task
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>ð</span>
                Recent Activity
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.length > 0 ? (
                  projects.slice(0, 3).map(project => (
                    <div key={project.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontWeight: '600', color: '#000000' }}>{project.name}</h4>
                        <span style={{ 
                          fontSize: '0.875rem', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem',
                          backgroundColor: '#dcfce7',
                          color: '#166534'
                        }}>
                          {project.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#000000', marginBottom: '0.5rem' }}>{project.description}</p>
                      {project.siteLink && (
                        <a href={project.siteLink} target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a', fontSize: '0.875rem' }}>
                          ð View Project Site
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#000000' }}>
                    <p style={{ marginBottom: '1rem' }}>No recent activity</p>
                    <Button 
                      onClick={() => setShowProjectModal(true)}
                      style={{ 
                        backgroundColor: '#16a34a', 
                        color: 'white', 
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem'
                      }}
                    >
                      Create Your First Project
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000' }}>Projects</h2>
              <Button 
                onClick={() => setShowProjectModal(true)}
                style={{ 
                  backgroundColor: '#16a34a', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '500'
                }}
              >
                + Create Project
              </Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {projects.length > 0 ? (
                projects.map(project => (
                  <div key={project.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>{project.name}</h3>
                    <p style={{ color: '#000000', marginBottom: '1rem' }}>{project.description}</p>
                    {project.siteLink && (
                      <a href={project.siteLink} target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a', display: 'block', marginBottom: '1rem' }}>
                        ð {project.siteLink}
                      </a>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem',
                        backgroundColor: '#dcfce7',
                        color: '#166534'
                      }}>
                        {project.status}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#000000' }}>{project.progress}% Complete</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>ð</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#000000', marginBottom: '1rem' }}>No Projects Yet</h3>
                  <p style={{ color: '#000000', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                    Start building your portfolio by creating your first project. Track progress, manage tasks, and showcase your work.
                  </p>
                  <Button 
                    onClick={() => setShowProjectModal(true)}
                    style={{ 
                      backgroundColor: '#16a34a', 
                      color: 'white', 
                      padding: '1rem 2rem',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  >
                    Create Your First Project
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000' }}>Tasks</h2>
              <Button 
                onClick={() => setShowTaskModal(true)}
                style={{ 
                  backgroundColor: '#16a34a', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '500'
                }}
              >
                + Add Task
              </Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <div key={task.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#000000' }}>{task.title}</h3>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem',
                        backgroundColor: task.priority === 'High' ? '#fef2f2' : task.priority === 'Medium' ? '#fef3c7' : '#dcfce7',
                        color: task.priority === 'High' ? '#dc2626' : task.priority === 'Medium' ? '#92400e' : '#166534'
                      }}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p style={{ color: '#000000', marginBottom: '0.5rem' }}>{task.description}</p>
                    )}
                    <p style={{ fontSize: '0.875rem', color: '#000000' }}>
                      Project: {projects.find(p => p.id === task.projectId)?.name || 'Unknown'}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>â</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#000000', marginBottom: '1rem' }}>No Tasks Yet</h3>
                  <p style={{ color: '#000000', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                    Create tasks to organize your work and track progress. Link them to projects for better organization.
                  </p>
                  <Button 
                    onClick={() => setShowTaskModal(true)}
                    style={{ 
                      backgroundColor: '#16a34a', 
                      color: 'white', 
                      padding: '1rem 2rem',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  >
                    Create Your First Task
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'roadmaps':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000' }}>AI Roadmaps</h2>
              <Button 
                onClick={() => setShowRoadmapModal(true)}
                style={{ 
                  backgroundColor: '#16a34a', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '500'
                }}
              >
                + Generate Roadmap
              </Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {roadmaps.map(roadmap => (
                <div key={roadmap.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>{roadmap.title}</h3>
                  <p style={{ color: '#000000', marginBottom: '1rem' }}>{roadmap.goal}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {roadmap.steps.map(step => (
                      <div key={step.id} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        backgroundColor: step.completed ? '#f0fdf4' : '#f9fafb'
                      }}>
                        <div>
                          <h4 style={{ fontWeight: '600', color: '#000000', textDecoration: step.completed ? 'line-through' : 'none' }}>
                            {step.title}
                          </h4>
                          <p style={{ fontSize: '0.875rem', color: '#000000' }}>{step.description}</p>
                        </div>
                        {!step.completed && (
                          <Button
                            onClick={() => convertRoadmapStepToTask(step, roadmap)}
                            style={{ 
                              backgroundColor: '#16a34a', 
                              color: 'white', 
                              padding: '0.5rem 1rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem'
                            }}
                          >
                            Convert to Task
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'files':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000' }}>File Analyses</h2>
              <Button 
                onClick={() => setShowFileUploadModal(true)}
                style={{ 
                  backgroundColor: isPremium ? '#16a34a' : '#6b7280', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '500'
                }}
              >
                {isPremium ? '+ Upload & Analyze' : 'Upgrade to Upload'}
              </Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {fileAnalyses.length > 0 ? (
                fileAnalyses.map(analysis => (
                  <div key={analysis.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>{analysis.fileName}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#000000', marginBottom: '1rem' }}>{analysis.fileType}</p>
                    <p style={{ color: '#000000', marginBottom: '1rem' }}>{analysis.analysis}</p>
                    <p style={{ fontSize: '0.75rem', color: '#000000', opacity: 0.7 }}>
                      Analyzed: {new Date(analysis.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>ð</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#000000', marginBottom: '1rem' }}>
                    {isPremium ? 'No Files Analyzed Yet' : 'Premium Feature'}
                  </h3>
                  <p style={{ color: '#000000', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                    {isPremium 
                      ? 'Upload files to get AI-powered insights and analysis. Support for PDFs, documents, and code files.'
                      : 'Upgrade to premium to unlock file upload and AI analysis capabilities.'
                    }
                  </p>
                  <Button 
                    onClick={() => isPremium ? setShowFileUploadModal(true) : setShowPremiumModal(true)}
                    style={{ 
                      backgroundColor: isPremium ? '#16a34a' : '#16a34a', 
                      color: 'white', 
                      padding: '1rem 2rem',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  >
                    {isPremium ? 'Upload Your First File' : 'Upgrade to Premium'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'learning':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '2rem' }}>Learning Center</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>AI-Powered Learning</h3>
              <p style={{ color: '#000000', marginBottom: '1rem' }}>Personalized learning paths based on your current skills and career goals.</p>
              <Button 
                onClick={() => setShowRoadmapModal(true)}
                style={{ 
                  backgroundColor: '#16a34a', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem'
                }}
              >
                Generate Learning Path
              </Button>
            </div>
          </div>
        );

      case 'applications':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '2rem' }}>Applications</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>Job Applications</h3>
              <p style={{ color: '#000000' }}>Track and manage your job applications here.</p>
            </div>
          </div>
        );

      case 'gigs':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '2rem' }}>Freelance Gigs</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {gigs.map(gig => (
                <div key={gig.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>{gig.title}</h3>
                  <p style={{ color: '#000000', marginBottom: '1rem' }}>{gig.description || 'Great opportunity for skilled freelancers'}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#16a34a' }}>{gig.budget}</span>
                    <span style={{ fontSize: '0.875rem', color: '#000000' }}>{gig.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'clients':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '2rem' }}>Clients</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>Client Management</h3>
              <p style={{ color: '#000000' }}>Manage your client relationships and projects.</p>
            </div>
          </div>
        );

      case 'earnings':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '2rem' }}>Earnings</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>Financial Overview</h3>
              <p style={{ color: '#000000' }}>Track your income and financial growth.</p>
            </div>
          </div>
        );

      case 'proposals':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '2rem' }}>Proposals</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>Proposal Management</h3>
              <p style={{ color: '#000000' }}>Create and track your project proposals.</p>
            </div>
          </div>
        );

      case 'pipeline':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '2rem' }}>Pipeline</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>Recruitment Pipeline</h3>
              <p style={{ color: '#000000' }}>Manage candidates through the hiring process.</p>
            </div>
          </div>
        );

      case 'team':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '2rem' }}>Team</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {teamMembers.map(member => (
                <div key={member.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>{member.name}</h3>
                  <p style={{ color: '#000000', marginBottom: '1rem' }}>{member.role}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#000000' }}>Productivity: {member.productivity}%</span>
                    <span style={{ fontSize: '0.875rem', color: '#000000' }}>Tasks: {member.tasks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'performance':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '2rem' }}>Performance</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>Team Performance</h3>
              <p style={{ color: '#000000' }}>Monitor and analyze team performance metrics.</p>
            </div>
          </div>
        );

      case 'assignments':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '2rem' }}>Assignments</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>Task Assignments</h3>
              <p style={{ color: '#000000' }}>Manage and track team assignments.</p>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000' }}>Skills</h2>
              <Button 
                onClick={() => setShowSkillModal(true)}
                style={{ 
                  backgroundColor: '#16a34a', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '500'
                }}
              >
                + Add Skill
              </Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <div key={index} style={{ 
                    padding: '1rem', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '0.5rem', 
                    backgroundColor: '#f9fafb',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600', color: '#000000' }}>{skill.name}</h4>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem',
                        backgroundColor: skill.level >= 80 ? '#dcfce7' : skill.level >= 50 ? '#fef3c7' : '#fef2f2',
                        color: skill.level >= 80 ? '#166534' : skill.level >= 50 ? '#92400e' : '#dc2626'
                      }}>
                        {skill.level}%
                      </span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '8px', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ 
                        width: `${skill.level}%`, 
                        height: '100%', 
                        backgroundColor: skill.level >= 80 ? '#16a34a' : skill.level >= 50 ? '#f59e0b' : '#ef4444',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#000000', marginTop: '0.5rem' }}>
                      {skill.level >= 80 ? 'Expert' : skill.level >= 50 ? 'Intermediate' : 'Beginner'}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>ð</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#000000', marginBottom: '1rem' }}>No Skills Added Yet</h3>
                  <p style={{ color: '#000000', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                    Add your technical and professional skills to showcase your expertise and get personalized AI recommendations.
                  </p>
                  <Button 
                    onClick={() => setShowSkillModal(true)}
                    style={{ 
                      backgroundColor: '#16a34a', 
                      color: 'white', 
                      padding: '1rem 2rem',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  >
                    Add Your First Skill
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '2rem' }}>Settings</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>Profile Settings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>Name</Label>
                    <Input
                      value={settingsData.profile.name}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        profile: { ...prev.profile, name: e.target.value }
                      }))}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>Email</Label>
                    <Input
                      value={settingsData.profile.email}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        profile: { ...prev.profile, email: e.target.value }
                      }))}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                    />
                  </div>
                </div>
              </div>
              
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>Preferences</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#000000' }}>
                    <input
                      type="checkbox"
                      checked={settingsData.preferences.notifications}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, notifications: e.target.checked }
                      }))}
                    />
                    Enable Notifications
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#000000' }}>
                    <input
                      type="checkbox"
                      checked={settingsData.preferences.emailAlerts}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, emailAlerts: e.target.checked }
                      }))}
                    />
                    Email Alerts
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#000000' }}>
                    <input
                      type="checkbox"
                      checked={settingsData.preferences.aiSuggestions}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, aiSuggestions: e.target.checked }
                      }))}
                    />
                    AI Suggestions
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000', marginBottom: '1rem' }}>
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h2>
            <p style={{ color: '#000000' }}>This section is coming soon!</p>
          </div>
        );
    }
  };
  
  const toggleTask = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      
      if (response.ok) {
        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ));
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };
  
  // Settings handlers
  const updateSettings = async (section: string, data: any) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data })
      });
      
      if (response.ok) {
        setSettingsData(prev => ({
          ...prev,
          [section]: { ...prev[section], ...data }
        }));
        
        // Update user profile if needed
        if (section === 'profile' && user) {
          updateProfile(data);
        }
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
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
    developer: ['dashboard', 'projects', 'tasks', 'skills', 'learning', 'applications', 'settings'],
    freelancer: ['dashboard', 'projects', 'tasks', 'skills', 'gigs', 'clients', 'earnings', 'proposals', 'settings'],
    recruiter: ['dashboard', 'projects', 'tasks', 'pipeline', 'applications', 'settings'],
    manager: ['dashboard', 'projects', 'tasks', 'team', 'performance', 'assignments', 'pipeline', 'settings']
  };

  // Modal components
  const ProjectModal = () => (
    showProjectModal && (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 1000 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '1rem', 
          maxWidth: '500px', 
          width: '90%', 
          maxHeight: '90vh', 
          overflowY: 'auto' 
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#000000' }}>Create New Project</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>Project Name</Label>
            <Input
              value={newProject.name}
              onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter project name"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>Description</Label>
            <Textarea
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project"
              style={{ 
                width: '100%', 
                minHeight: '100px', 
                padding: '0.75rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.5rem',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>Site Link (Optional)</Label>
            <Input
              value={newProject.siteLink}
              onChange={(e) => setNewProject(prev => ({ ...prev, siteLink: e.target.value }))}
              placeholder="https://example.com"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => setShowProjectModal(false)}
              style={{ 
                backgroundColor: '#6b7280', 
                color: 'white', 
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={createProject}
              style={{ 
                backgroundColor: '#16a34a', 
                color: 'white', 
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem'
              }}
            >
              Create Project
            </Button>
          </div>
        </div>
      </div>
    )
  );

  const TaskModal = () => (
    showTaskModal && (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 1000 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '1rem', 
          maxWidth: '500px', 
          width: '90%', 
          maxHeight: '90vh', 
          overflowY: 'auto' 
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#000000' }}>Create New Task</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>Task Title</Label>
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>Description</Label>
            <Textarea
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your task"
              style={{ 
                width: '100%', 
                minHeight: '80px', 
                padding: '0.75rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.5rem',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>Project</Label>
            <select
              value={newTask.projectId}
              onChange={(e) => setNewTask(prev => ({ ...prev, projectId: e.target.value }))}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                color: '#000000'
              }}
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>Priority</Label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                color: '#000000'
              }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => setShowTaskModal(false)}
              style={{ 
                backgroundColor: '#6b7280', 
                color: 'white', 
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={createTask}
              style={{ 
                backgroundColor: '#16a34a', 
                color: 'white', 
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem'
              }}
            >
              Create Task
            </Button>
          </div>
        </div>
      </div>
    )
  );

  const SkillModal = () => (
    showSkillModal && (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 1000 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '1rem', 
          maxWidth: '500px', 
          width: '90%', 
          maxHeight: '90vh', 
          overflowY: 'auto' 
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#000000' }}>Add New Skill</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>Skill Name</Label>
            <Input
              value={newSkill.name}
              onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., React, TypeScript, Project Management"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>Skill Level: {newSkill.level}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={newSkill.level}
              onChange={(e) => setNewSkill(prev => ({ ...prev, level: parseInt(e.target.value) }))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#000000' }}>
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => setShowSkillModal(false)}
              style={{ 
                backgroundColor: '#6b7280', 
                color: 'white', 
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (newSkill.name.trim()) {
                  const skill = {
                    id: Date.now(),
                    name: newSkill.name.trim(),
                    level: newSkill.level,
                    category: 'technical',
                    lastUpdated: new Date().toISOString()
                  };
                  setSkills(prev => [...prev, skill]);
                  storage.saveSkills(currentUser.id, [...skills, skill]);
                  setNewSkill({ name: '', level: 50 });
                  setShowSkillModal(false);
                  
                  // AI assistant message
                  setAiMessages(prev => [...prev, {
                    id: prev.length + 1,
                    type: 'ai',
                    content: `Great! I've added "${skill.name}" to your skill set. This will help me provide better recommendations for learning paths and project opportunities.`,
                    timestamp: new Date()
                  }]);
                }
              }}
              style={{ 
                backgroundColor: '#16a34a', 
                color: 'white', 
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem'
              }}
            >
              Add Skill
            </Button>
          </div>
        </div>
      </div>
    )
  );

  const RoadmapModal = () => (
    showRoadmapModal && (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 1000 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '1rem', 
          maxWidth: '500px', 
          width: '90%', 
          maxHeight: '90vh', 
          overflowY: 'auto' 
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#000000' }}>Generate AI Roadmap</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>What's your goal?</Label>
            <Textarea
              value={roadmapGoal}
              onChange={(e) => setRoadmapGoal(e.target.value)}
              placeholder="e.g., Learn React, Build a Fintech App, Master TypeScript"
              style={{ 
                width: '100%', 
                minHeight: '100px', 
                padding: '0.75rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.5rem',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>Roadmap Mode</Label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {(['learning', 'task', 'project'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setRoadmapMode(mode)}
                  style={{ 
                    padding: '0.75rem 1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    backgroundColor: roadmapMode === mode ? '#16a34a' : 'white',
                    color: roadmapMode === mode ? 'white' : '#000000',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => setShowRoadmapModal(false)}
              style={{ 
                backgroundColor: '#6b7280', 
                color: 'white', 
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={generateRoadmap}
              style={{ 
                backgroundColor: '#16a34a', 
                color: 'white', 
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem'
              }}
            >
              Generate Roadmap
            </Button>
          </div>
        </div>
      </div>
    )
  );

  const FileUploadModal = () => (
    showFileUploadModal && (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 1000 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '1rem', 
          maxWidth: '500px', 
          width: '90%', 
          maxHeight: '90vh', 
          overflowY: 'auto' 
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#000000' }}>
            {isPremium ? 'Upload & Analyze File' : 'Upgrade to Premium'}
          </h3>
          
          {isPremium ? (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <Label style={{ color: '#000000', marginBottom: '0.5rem', display: 'block' }}>Select File</Label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.txt,.js,.ts,.jsx,.tsx"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: '#000000'
                  }}
                />
                <p style={{ fontSize: '0.875rem', color: '#000000', marginTop: '0.5rem' }}>
                  Supported: PDF, DOC, DOCX, TXT, JS, TS, JSX, TSX
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => setShowFileUploadModal(false)}
                  style={{ 
                    backgroundColor: '#6b7280', 
                    color: 'white', 
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFile}
                  style={{ 
                    backgroundColor: selectedFile ? '#16a34a' : '#6b7280', 
                    color: 'white', 
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  Upload & Analyze
                </Button>
              </div>
            </>
          ) : (
            <>
              <p style={{ color: '#000000', marginBottom: '1.5rem' }}>
                File upload and AI analysis is a Premium feature. Upgrade to unlock unlimited file uploads and AI-powered document analysis.
              </p>
              
              <div style={{ backgroundColor: '#f0fdf4', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                <h4 style={{ color: '#16a34a', marginBottom: '1rem' }}>Premium Features:</h4>
                <ul style={{ color: '#000000', paddingLeft: '1.5rem' }}>
                  <li>Unlimited file uploads</li>
                  <li>AI-powered document analysis</li>
                  <li>Unlimited AI chat about file content</li>
                  <li>Advanced insights and recommendations</li>
                </ul>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => setShowFileUploadModal(false)}
                  style={{ 
                    backgroundColor: '#6b7280', 
                    color: 'white', 
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={upgradeToPremium}
                  style={{ 
                    backgroundColor: '#16a34a', 
                    color: 'white', 
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  Upgrade to Premium
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  );

  const PremiumModal = () => (
    showPremiumModal && (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 1000 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '1rem', 
          maxWidth: '500px', 
          width: '90%', 
          maxHeight: '90vh', 
          overflowY: 'auto' 
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#000000' }}>Upgrade to Premium</h3>
          
          <p style={{ color: '#000000', marginBottom: '1.5rem' }}>
            This feature requires a Premium subscription. Upgrade to unlock unlimited file uploads and AI analysis capabilities.
          </p>
          
          <div style={{ backgroundColor: '#f0fdf4', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
            <h4 style={{ color: '#16a34a', marginBottom: '1rem' }}>Premium Benefits:</h4>
            <ul style={{ color: '#000000', paddingLeft: '1.5rem' }}>
              <li>Unlimited file uploads</li>
              <li>AI-powered document analysis</li>
              <li>Unlimited AI chat about file content</li>
              <li>Advanced insights and recommendations</li>
              <li>Priority support</li>
            </ul>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => setShowPremiumModal(false)}
              style={{ 
                backgroundColor: '#6b7280', 
                color: 'white', 
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={upgradeToPremium}
              style={{ 
                backgroundColor: '#16a34a', 
                color: 'white', 
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem'
              }}
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    )
  );

  // Responsive design
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
  const isDesktop = window.innerWidth > 1024;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', 
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', 
      display: 'flex',
      color: '#000000' // Solid Black text on white backgrounds
    }}>
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
          display: isMobile ? 'flex' : 'none',
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
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#000000', marginBottom: '0.75rem' }}>AI Quick Actions</h3>
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
                  color: '#000000'
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
                  color: isAvailable ? (activeSection === item.section ? '#166534' : '#000000') : '#d1d5db',
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
              {userAvatar || (userName.charAt(0).toUpperCase() + userName.charAt(1))}
            </div>
            <div>
              <p style={{ fontWeight: '600', color: '#000000', fontSize: '0.875rem' }}>
                {userName}
              </p>
              <p style={{ color: '#000000', fontSize: '0.75rem', opacity: 0.7 }}>{userEmail}</p>
              <p style={{ color: '#16a34a', fontSize: '0.75rem' }}>AI-Enhanced</p>
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
          padding: isMobile ? '1rem' : '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          <div style={{ minWidth: isMobile ? '100%' : 'auto', marginBottom: isMobile ? '1rem' : '0' }}>
            <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.75rem', fontWeight: 'bold', color: '#000000', marginBottom: '0.25rem' }}>
              Welcome back, {userName}!
            </h2>
            <p style={{ color: '#000000', fontSize: '0.875rem', opacity: 0.7 }}>
              {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Dashboard â AI-Powered
            </p>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}>
            {/* File Upload */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              accept=".pdf,.docx,.csv,.txt"
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: isMobile ? '0.5rem' : '0.5rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '0' : '0.5rem',
                transition: 'all 0.2s',
                fontSize: '0.875rem',
                color: '#000000'
              }}
              title={isMobile ? 'Upload Files' : ''}
            >
              <span style={{ fontSize: '1.25rem' }}>ð</span>
              {!isMobile && <span>Upload</span>}
            </button>

            {/* Role Switcher */}
            {isDesktop ? (
              <select 
                value={activeRole} 
                onChange={(e) => setActiveRole(e.target.value as 'developer' | 'freelancer' | 'recruiter' | 'manager')}
                style={{ 
                  padding: '0.5rem 2rem 0.5rem 1rem', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.75rem',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23000000\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  paddingRight: '2rem',
                  color: '#000000'
                }}
              >
                {roleOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <button
                onClick={() => {
                  const roles: ('developer' | 'freelancer' | 'recruiter' | 'manager')[] = ['developer', 'freelancer', 'recruiter', 'manager'];
                  const currentIndex = roles.indexOf(activeRole);
                  const nextIndex = (currentIndex + 1) % roles.length;
                  setActiveRole(roles[nextIndex]);
                }}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  backgroundColor: '#f8fafc',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#000000'
                }}
                title={`Current: ${activeRole}`}
              >
                <span style={{ fontSize: '1.25rem' }}>
                  {roleOptions.find(r => r.value === activeRole)?.icon || 'ð'}
                </span>
              </button>
            )}

            {/* Notifications */}
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              style={{ 
                padding: isMobile ? '0.5rem' : '0.5rem 1rem',
                border: '1px solid #e5e7eb', 
                borderRadius: '0.75rem',
                backgroundColor: notificationsOpen ? '#f0fdf4' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '0' : '0.5rem',
                transition: 'all 0.2s',
                position: 'relative',
                fontSize: '0.875rem',
                color: '#000000'
              }}
              title={isMobile ? 'Notifications' : ''}
            >
              <span style={{ fontSize: '1.25rem' }}>ð</span>
              {!isMobile && <span>Notifications</span>}
              <span style={{ 
                backgroundColor: '#ef4444', 
                color: 'white', 
                borderRadius: '50%', 
                width: isMobile ? '16px' : '20px', 
                height: isMobile ? '16px' : '20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: isMobile ? '0.625rem' : '0.75rem',
                fontWeight: 'bold',
                position: 'absolute',
                top: isMobile ? '-6px' : '-8px',
                right: isMobile ? '-6px' : '-8px'
              }}>
                3
              </span>
            </button>

            {/* Settings */}
            <button 
              onClick={() => setSettingsOpen(!settingsOpen)}
              style={{ 
                padding: isMobile ? '0.5rem' : '0.5rem 1rem',
                border: '1px solid #e5e7eb', 
                borderRadius: '0.75rem',
                backgroundColor: settingsOpen ? '#f0fdf4' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '0' : '0.5rem',
                transition: 'all 0.2s',
                fontSize: '0.875rem',
                color: '#000000'
              }}
              title={isMobile ? 'Settings' : ''}
            >
              <span style={{ fontSize: '1.25rem' }}>â</span>
              {!isMobile && <span>Settings</span>}
            </button>
          </div>
        </header>

        {/* Settings Dropdown */}
        {settingsOpen && (
          <div style={{
            position: 'absolute',
            top: '80px',
            right: '20px',
            width: isMobile ? '90%' : '400px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#000000', marginBottom: '1rem' }}>Settings</h3>
              
              {/* Profile Section */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#000000', marginBottom: '1rem' }}>Profile</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <Label style={{ color: '#000000', marginBottom: '0.5rem' }}>Name</Label>
                    <Input
                      value={settingsData.profile.name}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        profile: { ...prev.profile, name: e.target.value }
                      }))}
                      style={{ color: '#000000' }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: '#000000', marginBottom: '0.5rem' }}>Email</Label>
                    <Input
                      value={settingsData.profile.email}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        profile: { ...prev.profile, email: e.target.value }
                      }))}
                      style={{ color: '#000000' }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: '#000000', marginBottom: '0.5rem' }}>Bio</Label>
                    <Textarea
                      value={settingsData.profile.bio}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        profile: { ...prev.profile, bio: e.target.value }
                      }))}
                      style={{ color: '#000000', minHeight: '80px' }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Preferences Section */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#000000', marginBottom: '1rem' }}>Preferences</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Label style={{ color: '#000000' }}>Enable Notifications</Label>
                    <input
                      type="checkbox"
                      checked={settingsData.preferences.notifications}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, notifications: e.target.checked }
                      }))}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Label style={{ color: '#000000' }}>Email Alerts</Label>
                    <input
                      type="checkbox"
                      checked={settingsData.preferences.emailAlerts}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, emailAlerts: e.target.checked }
                      }))}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Label style={{ color: '#000000' }}>AI Suggestions</Label>
                    <input
                      type="checkbox"
                      checked={settingsData.preferences.aiSuggestions}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, aiSuggestions: e.target.checked }
                      }))}
                    />
                  </div>
                </div>
              </div>
              
              {/* Security Section */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#000000', marginBottom: '1rem' }}>Security</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Label style={{ color: '#000000' }}>Two-Factor Authentication</Label>
                    <input
                      type="checkbox"
                      checked={settingsData.security.twoFactorEnabled}
                      onChange={(e) => setSettingsData(prev => ({
                        ...prev,
                        security: { ...prev.security, twoFactorEnabled: e.target.checked }
                      }))}
                    />
                  </div>
                  <Button
                    onClick={() => console.log('Change password')}
                    style={{ backgroundColor: '#16a34a', color: 'white' }}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
              
              {/* Save Button */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button
                  onClick={() => {
                    updateSettings('profile', settingsData.profile);
                    updateSettings('preferences', settingsData.preferences);
                    updateSettings('security', settingsData.security);
                    setSettingsOpen(false);
                  }}
                  style={{ backgroundColor: '#16a34a', color: 'white', flex: 1 }}
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => setSettingsOpen(false)}
                  style={{ backgroundColor: '#e5e7eb', color: '#000000' }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <main style={{ flex: 1, padding: isMobile ? '1rem' : '2rem', overflow: 'auto' }}>
          {/* Loading State */}
          {dataLoading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '200px',
              color: '#000000'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Loading your data...</div>
                <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #16a34a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {dataError && (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca', 
              borderRadius: '0.5rem', 
              padding: '1rem',
              color: '#000000'
            }}>
              <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Error</p>
              <p>{dataError}</p>
              <Button
                onClick={() => window.location.reload()}
                style={{ backgroundColor: '#16a34a', color: 'white', marginTop: '1rem' }}
              >
                Refresh
              </Button>
            </div>
          )}

          {!dataLoading && !dataError && (
            <>
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
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>ð</span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                      {projects.filter(p => p.role === activeRole).length}
                    </h3>
                  </div>
                  <p style={{ color: '#000000', fontSize: '0.875rem' }}>Active Projects</p>
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
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>â</span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                      {tasks.filter(t => t.role === activeRole && !t.completed).length}
                    </h3>
                  </div>
                  <p style={{ color: '#000000', fontSize: '0.875rem' }}>Pending Tasks</p>
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
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>ð</span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                      {skills.length}
                    </h3>
                  </div>
                  <p style={{ color: '#000000', fontSize: '0.875rem' }}>Skills Tracked</p>
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
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>ð</span>
                    <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                      {skills.length > 0 ? Math.round(skills.reduce((acc, skill) => acc + (skill.level || 0), 0) / skills.length) : 0}%
                    </h3>
                  </div>
                  <p style={{ color: '#000000', fontSize: '0.875rem' }}>Avg Skill Level</p>
                  <p style={{ color: '#16a34a', fontSize: '0.75rem', marginTop: '0.25rem' }}>AI Analyzed</p>
                </div>
              </div>

              {/* Role-Specific Content */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                {/* Enhanced AI Tools */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>ð</span>
                    AI Tools & Analysis
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Textarea
                      placeholder="Ask me anything about your dashboard, projects, or workflow..."
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAiMessage(aiInput);
                        }
                      }}
                      style={{ 
                        minHeight: '100px', 
                        width: '100%',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        resize: 'vertical',
                        color: '#000000'
                      }}
                    />
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button 
                        onClick={() => handleAiMessage(aiInput)}
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
                        {loading || aiStreaming ? 'Processing...' : 'Send Message'}
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
                            <h4 style={{ fontWeight: '600', color: '#000000' }}>{file.name}</h4>
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
                            <p style={{ fontSize: '0.875rem', color: '#000000', fontStyle: 'italic' }}>{file.insights}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Freelancer Specific Sections */}
                {activeRole === 'freelancer' && (
                  <>
                    {/* Gigs Section */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>ð</span>
                        Active Gigs
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {gigs.length > 0 ? gigs.map(gig => (
                          <div key={gig.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <h4 style={{ fontWeight: '600', color: '#000000' }}>{gig.title}</h4>
                              <span style={{ 
                                fontSize: '0.875rem', 
                                padding: '0.25rem 0.5rem', 
                                borderRadius: '0.25rem',
                                backgroundColor: gig.status === 'Open' ? '#dcfce7' : '#fef3c7',
                                color: gig.status === 'Open' ? '#166534' : '#92400e'
                              }}>
                                {gig.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: '#000000', marginBottom: '0.5rem' }}>
                              <strong>Budget:</strong> {gig.budget} | <strong>Deadline:</strong> {gig.deadline}
                            </p>
                            {gig.aiMatch && (
                              <p style={{ fontSize: '0.75rem', color: '#16a34a', fontStyle: 'italic' }}>
                                ð AI Match Score: {gig.aiMatch}%
                              </p>
                            )}
                          </div>
                        )) : (
                          <div style={{ textAlign: 'center', padding: '2rem', color: '#000000' }}>
                            <p>No active gigs. Start applying to opportunities!</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Earnings Section */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>ð</span>
                        Earnings Overview
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                          <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>$12,500</h4>
                          <p style={{ fontSize: '0.875rem', color: '#000000' }}>This Month</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                          <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>$45,000</h4>
                          <p style={{ fontSize: '0.875rem', color: '#000000' }}>This Year</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                          <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>$85/hr</h4>
                          <p style={{ fontSize: '0.875rem', color: '#000000' }}>Avg Rate</p>
                        </div>
                      </div>
                    </div>

                    {/* Clients Section */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>ð</span>
                        Active Clients
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {clients.length > 0 ? (
                          clients.map(client => (
                            <div key={client.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h4 style={{ fontWeight: '600', color: '#000000' }}>{client.name}</h4>
                                <span style={{ 
                                  fontSize: '0.875rem', 
                                  padding: '0.25rem 0.5rem', 
                                  borderRadius: '0.25rem',
                                  backgroundColor: '#dcfce7',
                                  color: '#166534'
                                }}>
                                  {client.status}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.875rem', color: '#000000', marginBottom: '0.25rem' }}>
                                <strong>Project:</strong> {client.project}
                              </p>
                              <p style={{ fontSize: '0.875rem', color: '#000000' }}>
                                <strong>Budget:</strong> {client.budget}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div style={{ textAlign: 'center', padding: '2rem', color: '#000000' }}>
                            <p>No active clients. Start building your client base!</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Proposals Section */}
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>ð</span>
                        Recent Proposals
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {proposals.length > 0 ? (
                          proposals.map(proposal => (
                            <div key={proposal.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h4 style={{ fontWeight: '600', color: '#000000' }}>{proposal.title}</h4>
                                <span style={{ 
                                  fontSize: '0.875rem', 
                                  padding: '0.25rem 0.5rem', 
                                  borderRadius: '0.25rem',
                                  backgroundColor: proposal.status === 'Accepted' ? '#dcfce7' : proposal.status === 'Pending' ? '#fef3c7' : '#e5e7eb',
                                  color: proposal.status === 'Accepted' ? '#166534' : proposal.status === 'Pending' ? '#92400e' : '#000000'
                                }}>
                                  {proposal.status}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.875rem', color: '#000000', marginBottom: '0.25rem' }}>
                                <strong>Client:</strong> {proposal.client}
                              </p>
                              <p style={{ fontSize: '0.875rem', color: '#000000', marginBottom: '0.25rem' }}>
                                <strong>Value:</strong> {proposal.value}
                              </p>
                              <p style={{ fontSize: '0.75rem', color: '#000000', opacity: 0.7 }}>
                                <strong>Sent:</strong> {proposal.sentDate}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div style={{ textAlign: 'center', padding: '2rem', color: '#000000' }}>
                            <p>No proposals yet. Start creating proposals for your clients!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Common Sections */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                {/* Enhanced Projects */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>ð</span>
                    Projects
                  </h3>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <Button 
                      onClick={() => setShowProjectModal(true)}
                      style={{ 
                        backgroundColor: '#16a34a', 
                        color: 'white', 
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        width: '100%'
                      }}
                    >
                      + Create New Project
                    </Button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {projects.filter(p => p.role === activeRole).map(project => (
                      <div key={project.id} style={{ 
                        padding: '1rem', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '0.5rem', 
                        backgroundColor: '#f9fafb',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontWeight: '600', color: '#000000' }}>{project.name}</h4>
                          <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', backgroundColor: '#dcfce7', color: '#16a34a' }}>
                            {project.status}
                          </span>
                        </div>
                        <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ backgroundColor: '#16a34a', height: '100%', width: `${project.progress}%` }} />
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#000000', marginTop: '0.25rem' }}>{project.progress}% complete</p>
                      </div>
                    ))}
                    
                    {projects.filter(p => p.role === activeRole).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#000000' }}>
                        <p>No projects yet. Create your first project above!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Tasks */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>â</span>
                    Tasks
                  </h3>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <Button 
                      onClick={() => setShowTaskModal(true)}
                      style={{ 
                        backgroundColor: '#16a34a', 
                        color: 'white', 
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        width: '100%'
                      }}
                    >
                      + Add New Task
                    </Button>
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
                        cursor: 'pointer'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                          />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: '500', color: '#000000', marginBottom: '0.25rem' }}>{task.title}</p>
                            <p style={{ fontSize: '0.75rem', color: '#000000', opacity: 0.7 }}>
                              Project: {projects.find(p => p.id === task.projectId)?.name || 'Unknown'}
                            </p>
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
                    
                    {tasks.filter(t => t.role === activeRole).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#000000' }}>
                        <p>No tasks yet. Create your first task above!</p>
                      </div>
                    )}
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
                  <div style={{ marginBottom: '1rem' }}>
                    <Button 
                      onClick={() => setActiveSection('skills')}
                      style={{ 
                        backgroundColor: '#16a34a', 
                        color: 'white', 
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: '500',
                        width: '100%'
                      }}
                    >
                      Manage Skills
                    </Button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  {skills.map((skill, index) => (
                    <div key={index} style={{ 
                      padding: '1rem', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.5rem', 
                      backgroundColor: '#f9fafb',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontWeight: '600', color: '#000000' }}>{skill.name}</h4>
                        <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#16a34a' }}>{skill.level || 0}%</span>
                      </div>
                      <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ backgroundColor: '#16a34a', height: '100%', width: `${skill.level || 0}%` }} />
                      </div>
                    </div>
                  ))}
                  
                  {skills.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#000000' }}>
                      <p>No skills tracked yet. Add your first skill above!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>ð</span>
                  Recent Activity
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {recentAiWork.length > 0 ? (
                    recentAiWork.map(work => (
                      <div key={work.id} style={{ 
                        padding: '0.75rem', 
                        borderLeft: '4px solid #16a34a', 
                        backgroundColor: '#f0fdf4', 
                        borderRadius: '0.25rem',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}>
                        <p style={{ fontWeight: '500', color: '#000000' }}>{work.title}</p>
                        <p style={{ fontSize: '0.75rem', color: '#000000', opacity: 0.7 }}>{work.timestamp.toLocaleTimeString()}</p>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#000000' }}>
                      <p>No recent activity. Start using the AI assistant to see your work here!</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* AI Assistant Sidebar */}
      <div style={{
        position: 'fixed',
        right: aiAssistantOpen ? '0px' : '-400px',
        top: '0px',
        width: isMobile ? '100%' : '400px',
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
                borderRadius: '0.25rem'
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
                color: message.type === 'user' ? 'white' : '#000000',
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
                color: '#000000',
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
              style={{ flex: 1, color: '#000000' }}
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
            zIndex: 997
          }}
        >
          ð
        </button>
      )}

      {/* Add CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

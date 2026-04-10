import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/authStore';
import DashboardHeader from '@/components/DashboardHeader';
import EnhancedSettings from '@/components/EnhancedSettings';
import EnhancedAIChat from '@/components/EnhancedAIChat';
import { aiService } from '@/services/aiService';

// Interfaces
interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  progress: number;
  siteLink?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  projectId: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
  lastUpdated: string;
}

interface Roadmap {
  id: number;
  title: string;
  description: string;
  progress: number;
  steps: string[];
  createdAt: string;
}

interface FileAnalysis {
  id: number;
  fileName: string;
  insights: string;
  status: string;
  createdAt: string;
}

// Storage utilities
const storage = {
  getProjects: (userId: string) => {
    const stored = localStorage.getItem(`projects-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveProjects: (userId: string, projects: Project[]) => {
    localStorage.setItem(`projects-${userId}`, JSON.stringify(projects));
  },
  getTasks: (userId: string) => {
    const stored = localStorage.getItem(`tasks-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveTasks: (userId: string, tasks: Task[]) => {
    localStorage.setItem(`tasks-${userId}`, JSON.stringify(tasks));
  },
  getSkills: (userId: string) => {
    const stored = localStorage.getItem(`skills-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveSkills: (userId: string, skills: Skill[]) => {
    localStorage.setItem(`skills-${userId}`, JSON.stringify(skills));
  },
  getRoadmaps: (userId: string) => {
    const stored = localStorage.getItem(`roadmaps-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveRoadmaps: (userId: string, roadmaps: Roadmap[]) => {
    localStorage.setItem(`roadmaps-${userId}`, JSON.stringify(roadmaps));
  },
  getFileAnalyses: (userId: string) => {
    const stored = localStorage.getItem(`fileAnalyses-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveFileAnalyses: (userId: string, analyses: FileAnalysis[]) => {
    localStorage.setItem(`fileAnalyses-${userId}`, JSON.stringify(analyses));
  }
};

const DeveloperDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const currentUser = user || { id: 'default', email: 'developer@example.com', name: 'Developer' };
  
  // State management
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{id: string; role: 'user' | 'assistant'; content: string; timestamp: string}[]>([]);
  const [aiStreaming, setAiStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  
  // Data state
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [fileAnalyses, setFileAnalyses] = useState<FileAnalysis[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string; size: number; type: string}[]>([]);
  const [recentAiWork, setRecentAiWork] = useState<{id: string; title: string; timestamp: string}[]>([]);
  
  // Modal states
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
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Responsive design
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth > 768 && window.innerWidth <= 1024);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  
  // Refs
  const aiMessagesRef = useRef<HTMLDivElement>(null);
  
  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setDataLoading(true);
      setDataError(null);
      
      try {
        // Load user data from localStorage
        const loadedProjects = storage.getProjects(currentUser.id);
        const loadedTasks = storage.getTasks(currentUser.id);
        const loadedSkills = storage.getSkills(currentUser.id);
        const loadedRoadmaps = storage.getRoadmaps(currentUser.id);
        const loadedFileAnalyses = storage.getFileAnalyses(currentUser.id);
        
        setProjects(loadedProjects);
        setTasks(loadedTasks);
        setSkills(loadedSkills);
        setRoadmaps(loadedRoadmaps);
        setFileAnalyses(loadedFileAnalyses);
        
        // Set default data if empty
        if (loadedProjects.length === 0) {
          const defaultProjects = [
            { id: 1, name: 'Portfolio Website', description: 'Personal portfolio with projects', status: 'In Progress', progress: 75, siteLink: '', images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 2, name: 'Task Management App', description: 'React-based task manager', status: 'Planning', progress: 25, siteLink: '', images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          ];
          setProjects(defaultProjects);
          storage.saveProjects(currentUser.id, defaultProjects);
        }
        
        if (loadedTasks.length === 0) {
          const defaultTasks = [
            { id: 1, title: 'Setup project structure', description: 'Initialize React app', projectId: '1', priority: 'High' as const, completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 2, title: 'Design UI components', description: 'Create reusable components', projectId: '1', priority: 'Medium' as const, completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          ];
          setTasks(defaultTasks);
          storage.saveTasks(currentUser.id, defaultTasks);
        }
        
        if (loadedSkills.length === 0) {
          const defaultSkills = [
            { id: 1, name: 'React', level: 85, category: 'Frontend', lastUpdated: new Date().toISOString() },
            { id: 2, name: 'TypeScript', level: 75, category: 'Language', lastUpdated: new Date().toISOString() },
            { id: 3, name: 'Node.js', level: 70, category: 'Backend', lastUpdated: new Date().toISOString() }
          ];
          setSkills(defaultSkills);
          storage.saveSkills(currentUser.id, defaultSkills);
        }
        
      } catch (error) {
        setDataError('Failed to load dashboard data');
      } finally {
        setDataLoading(false);
      }
    };
    
    initializeData();
  }, [currentUser.id]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
      setIsDesktop(window.innerWidth > 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // CRUD Operations
  const createProject = () => {
    if (newProject.name.trim()) {
      const project = {
        id: Date.now(),
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        status: 'Planning',
        progress: 0,
        siteLink: newProject.siteLink.trim(),
        images: newProject.images,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setProjects(prev => [...prev, project]);
      storage.saveProjects(currentUser.id, [...projects, project]);
      setNewProject({ name: '', description: '', siteLink: '', images: [] });
      setShowProjectModal(false);
      
      // AI assistant message
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: `Great! I've created "${project.name}" for you. This project will help you track your development progress and organize your tasks effectively.`,
        timestamp: new Date()
      }]);
    }
  };
  
  const createTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        projectId: newTask.projectId,
        priority: newTask.priority,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTasks(prev => [...prev, task]);
      storage.saveTasks(currentUser.id, [...tasks, task]);
      setNewTask({ title: '', description: '', projectId: '', priority: 'Medium' });
      setShowTaskModal(false);
      
      // AI assistant message
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: `Task "${task.title}" has been added! I've prioritized it as ${task.priority} to help you focus on what matters most.`,
        timestamp: new Date()
      }]);
    }
  };
  
  const createSkill = () => {
    if (newSkill.name.trim()) {
      const skill = {
        id: Date.now(),
        name: newSkill.name.trim(),
        level: newSkill.level,
        category: 'Technical',
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
        content: `Excellent! I've added "${skill.name}" at ${skill.level}% proficiency level. This will help me provide better learning recommendations and project suggestions.`,
        timestamp: new Date()
      }]);
    }
  };
  
  const toggleTask = (taskId: number) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } : task
    );
    setTasks(updatedTasks);
    storage.saveTasks(currentUser.id, updatedTasks);
  };
  
  const handleAiMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message
    setAiMessages(prev => [...prev, {
      id: prev.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date()
    }]);
    
    setAiInput('');
    setAiStreaming(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = `I understand you're asking about "${message}". As your AI assistant, I can help you with:\n\n1. Project planning and management\n2. Task prioritization and scheduling\n3. Skill development recommendations\n4. Learning path optimization\n5. Code review suggestions\n\nWhat specific area would you like to focus on?`;
      
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
      
      setAiStreaming(false);
    }, 1500);
  };
  
  // Navigation items for Developer
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ð' },
    { id: 'projects', label: 'Projects', icon: 'ð' },
    { id: 'tasks', label: 'Tasks', icon: 'â' },
    { id: 'skills', label: 'Skills', icon: 'ð' },
    { id: 'learning', label: 'Learning', icon: 'ð' },
    { id: 'applications', label: 'Applications', icon: 'ð' },
    { id: 'settings', label: 'Settings', icon: 'â' }
  ];
  
  // Render active content based on section
  const renderActiveContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: '2px solid #3b82f6' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: '0 0 0.5rem 0' }}>{projects.length}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Projects</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: '2px solid #10b981' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: '0 0 0.5rem 0' }}>{tasks.filter(t => !t.completed).length}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Active Tasks</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: '2px solid #8b5cf6' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', margin: '0 0 0.5rem 0' }}>{skills.length}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Skills</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: '2px solid #f59e0b' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: '0 0 0.5rem 0' }}>{Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length) || 0}%</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Avg Skill Level</p>
              </div>
            </div>
            
            {/* AI Tools */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>AI Development Tools</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <Button onClick={() => setShowRoadmapModal(true)} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
                  Generate Learning Roadmap
                </Button>
                <Button onClick={() => setShowFileUploadModal(true)} style={{ backgroundColor: '#10b981', color: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
                  Analyze Code Files
                </Button>
                <Button onClick={() => setAiAssistantOpen(true)} style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '1rem', borderRadius: '0.5rem' }}>
                  AI Assistant
                </Button>
              </div>
            </div>
            
            {/* Recent Projects */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Recent Projects</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.slice(0, 3).map(project => (
                  <div key={project.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{project.name}</h4>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', backgroundColor: '#dbeafe', color: '#1e40af' }}>
                        {project.status}
                      </span>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{project.description}</p>
                    <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#3b82f6', height: '100%', width: `${project.progress}%` }} />
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>{project.progress}% complete</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'projects':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Projects</h2>
              <Button onClick={() => setShowProjectModal(true)} style={{ backgroundColor: '#3b82f6', color: 'white' }}>
                + Create New Project
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {projects.map(project => (
                <div key={project.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>{project.name}</h3>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{project.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', backgroundColor: '#dbeafe', color: '#1e40af' }}>
                      {project.status}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{project.progress}% complete</span>
                  </div>
                  <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                    <div style={{ backgroundColor: '#3b82f6', height: '100%', width: `${project.progress}%` }} />
                  </div>
                  {project.siteLink && (
                    <a href={project.siteLink} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      View Project â
                    </a>
                  )}
                  <button 
                    onClick={() => {
                      // Generate shareable link
                      const shareLink = `${window.location.origin}/project/${project.id}`;
                      navigator.clipboard.writeText(shareLink);
                      alert('Project link copied to clipboard!');
                    }}
                    style={{ 
                      backgroundColor: '#6b7280', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      marginLeft: '0.5rem'
                    }}
                  >
                    Share
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'tasks':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Tasks</h2>
              <Button onClick={() => setShowTaskModal(true)} style={{ backgroundColor: '#10b981', color: 'white' }}>
                + Add New Task
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
              {tasks.map(task => (
                <div key={task.id} style={{ 
                  backgroundColor: 'white', 
                  padding: '1rem', 
                  borderRadius: '0.5rem', 
                  border: '1px solid #e5e7eb',
                  opacity: task.completed ? 0.6 : 1,
                  textDecoration: task.completed ? 'line-through' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <h4 style={{ fontWeight: '600', color: '#1f2937', margin: 0 }}>{task.title}</h4>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{task.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      backgroundColor: task.priority === 'High' ? '#fee2e2' : task.priority === 'Medium' ? '#fed7aa' : '#dbeafe',
                      color: task.priority === 'High' ? '#991b1b' : task.priority === 'Medium' ? '#92400e' : '#1e40af'
                    }}>
                      {task.priority}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {projects.find(p => p.id.toString() === task.projectId)?.name || 'Unknown Project'}
                    </span>
                    <button 
                      onClick={() => {
                        const shareLink = `${window.location.origin}/task/${task.id}`;
                        navigator.clipboard.writeText(shareLink);
                        alert('Task link copied to clipboard!');
                      }}
                      style={{ 
                        backgroundColor: '#6b7280', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        marginLeft: '0.5rem'
                      }}
                    >
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'skills':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Skills</h2>
              <Button onClick={() => setShowSkillModal(true)} style={{ backgroundColor: '#8b5cf6', color: 'white' }}>
                + Add New Skill
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {skills.map(skill => (
                <div key={skill.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{skill.name}</h3>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#8b5cf6' }}>{skill.level}%</span>
                  </div>
                  <div style={{ backgroundColor: '#e5e7eb', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem' }}>
                    <div style={{ backgroundColor: '#8b5cf6', height: '100%', width: `${skill.level}%` }} />
                  </div>
                  <button 
                    onClick={() => {
                      const shareLink = `${window.location.origin}/skill/${skill.id}`;
                      navigator.clipboard.writeText(shareLink);
                      alert('Skill link copied to clipboard!');
                    }}
                    style={{ 
                      backgroundColor: '#6b7280', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    Share
                  </button>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{skill.category}</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Updated: {new Date(skill.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'learning':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>Learning Center</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Personalized Learning Paths</h3>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Get AI-powered learning recommendations based on your current skills and career goals.</p>
              <Button onClick={() => setShowRoadmapModal(true)} style={{ backgroundColor: '#f59e0b', color: 'white', padding: '1rem 2rem' }}>
                Generate Learning Roadmap
              </Button>
            </div>
          </div>
        );
        
      case 'applications':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>Job Applications</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Track Your Applications</h3>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Monitor your job applications, interviews, and offers in one place.</p>
              <Button 
                onClick={() => {
                  // TODO: Implement application form modal
                  console.log('Add Application clicked');
                }}
                style={{ backgroundColor: '#ef4444', color: 'white', padding: '1rem 2rem' }}
              >
                Add Application
              </Button>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div style={{ minHeight: '600px' }}>
            <EnhancedSettings />
          </div>
        );
        
      default:
        return <div>Section not found</div>;
    }
  };

  const handleShareProject = (project: Project) => {
    const link = `${window.location.origin}/shared/project/${project.id}`;
    setShareLink(link);
    setShareModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
      description: project.description,
      siteLink: project.siteLink || '',
      images: project.images || []
    });
    setShowProjectModal(true);
  };

  const generateRoadmap = async () => {
    if (!roadmapGoal.trim()) return;
    
    setIsGeneratingRoadmap(true);
    
    try {
      // Create a context for AI service
      const context = {
        role: 'developer' as const,
        userData: currentUser,
        recentActivity: projects.slice(0, 3).map(p => ({ type: 'project', description: p.name }))
      };
      
      // Create a prompt for roadmap generation
      const prompt = `Generate a detailed learning roadmap for: "${roadmapGoal}". 
      
      Please provide a structured learning path with:
      1. Clear learning objectives (5-7 key milestones)
      2. Estimated timeframes for each milestone
      3. Recommended resources or technologies for each step
      4. Prerequisites if any
      
      Format your response as a JSON-like structure that I can parse.
      Type: ${roadmapMode}
      
      Please respond in this format:
      {
        "milestones": [
          {
            "title": "Milestone title",
            "description": "What to learn",
            "timeframe": "Estimated time",
            "resources": ["Resource 1", "Resource 2"]
          }
        ]
      }`;
      
      // Get AI response
      const response = await aiService.sendMessage(prompt, [], context);
      
      // Parse the AI response to extract milestones
      let milestones = [];
      try {
        // Try to extract JSON from the response
        const jsonMatch = response.message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          milestones = parsed.milestones || [];
        }
      } catch (e) {
        // Fallback to creating milestones from the text
        const lines = response.message.split('\n').filter(line => line.trim());
        milestones = lines.slice(0, 5).map((line, index) => ({
          title: `Step ${index + 1}`,
          description: line.trim(),
          timeframe: '1-2 weeks',
          resources: ['Documentation', 'Practice projects']
        }));
      }
      
      // If no milestones were extracted, create default ones
      if (milestones.length === 0) {
        milestones = [
          {
            title: "Foundation",
            description: "Learn the basics and core concepts",
            timeframe: "2-3 weeks",
            resources: ["Official documentation", "Online tutorials"]
          },
          {
            title: "Practice",
            description: "Build small projects to apply knowledge",
            timeframe: "3-4 weeks",
            resources: ["Practice exercises", "Sample projects"]
          },
          {
            title: "Advanced Topics",
            description: "Explore advanced features and best practices",
            timeframe: "2-3 weeks",
            resources: ["Advanced guides", "Community forums"]
          }
        ];
      }
      
      // Create the roadmap
      const newRoadmap = {
        id: Date.now(),
        title: roadmapGoal || 'Learning Roadmap',
        type: roadmapMode,
        progress: 0,
        goals: milestones,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Save the roadmap
      setRoadmaps(prev => [...prev, newRoadmap]);
      storage.saveRoadmaps(currentUser.id, [...roadmaps, newRoadmap]);
      
      // Reset and close modal
      setRoadmapGoal('');
      setShowRoadmapModal(false);
      
    } catch (error) {
      console.error('Error generating roadmap:', error);
      
      // Fallback: create a basic roadmap
      const fallbackRoadmap = {
        id: Date.now(),
        title: roadmapGoal || 'Learning Roadmap',
        type: roadmapMode,
        progress: 0,
        goals: [
          {
            title: "Getting Started",
            description: "Begin with fundamentals and basic concepts",
            timeframe: "1-2 weeks",
            resources: ["Documentation", "Tutorials"]
          },
          {
            title: "Building Skills",
            description: "Practice and build your skills through projects",
            timeframe: "2-3 weeks", 
            resources: ["Practice exercises", "Community"]
          },
          {
            title: "Mastery",
            description: "Advanced techniques and best practices",
            timeframe: "3-4 weeks",
            resources: ["Advanced guides", "Expert resources"]
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setRoadmaps(prev => [...prev, fallbackRoadmap]);
      storage.saveRoadmaps(currentUser.id, [...roadmaps, fallbackRoadmap]);
      setRoadmapGoal('');
      setShowRoadmapModal(false);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // Modal components
  const ProjectModal = () => {
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareLink, setShareLink] = useState('');

    const handleCreateProject = () => {
      if (!newProject.name.trim()) return;
      
      const project = {
        id: Date.now(),
        name: newProject.name,
        description: newProject.description,
        siteLink: newProject.siteLink,
        images: newProject.images,
        status: 'In Progress',
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setProjects(prev => [...prev, project]);
      storage.saveProjects(currentUser.id, [...projects, project]);
      setNewProject({ name: '', description: '', siteLink: '', images: [] });
      setShowProjectModal(false);
    };

    const handleUpdateProject = () => {
      if (!editingProject || !newProject.name.trim()) return;
      
      const updatedProject = {
        ...editingProject,
        name: newProject.name,
        description: newProject.description,
        siteLink: newProject.siteLink,
        images: newProject.images,
        updatedAt: new Date().toISOString()
      };
      
      setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
      storage.saveProjects(currentUser.id, projects.map(p => p.id === editingProject.id ? updatedProject : p));
      setNewProject({ name: '', description: '', siteLink: '', images: [] });
      setEditingProject(null);
      setShowProjectModal(false);
    };

    const handleDeleteProject = (projectId: number) => {
      if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        storage.saveProjects(currentUser.id, projects.filter(p => p.id !== projectId));
        setShowProjectModal(false);
      }
    };

    return (
      <>
        {showProjectModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Project Name</Label>
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                  />
                </div>
                <div>
                  <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Description</Label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your project"
                    style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
                  />
                </div>
                <div>
                  <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Site Link (optional)</Label>
                  <Input
                    value={newProject.siteLink}
                    onChange={(e) => setNewProject(prev => ({ ...prev, siteLink: e.target.value }))}
                    placeholder="https://your-project.com"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <Button 
                  onClick={() => {
                    setShowProjectModal(false);
                    setEditingProject(null);
                    setNewProject({ name: '', description: '', siteLink: '', images: [] });
                  }} 
                  style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}
                >
                  Cancel
                </Button>
                {editingProject && (
                  <Button 
                    onClick={() => handleDeleteProject(editingProject.id)}
                    style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}
                  >
                    Delete
                  </Button>
                )}
                <Button 
                  onClick={editingProject ? handleUpdateProject : handleCreateProject}
                  disabled={!newProject.name.trim()}
                  style={{ 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '0.5rem',
                    opacity: !newProject.name.trim() ? 0.5 : 1,
                    cursor: !newProject.name.trim() ? 'not-allowed' : 'pointer'
                  }}
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
  
  const TaskModal = () => {
    if (!showTaskModal) return null;
    
    const createTask = () => {
      if (!newTask.title.trim()) return;
      
      const task = {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        projectId: newTask.projectId,
        priority: newTask.priority,
        status: 'To Do',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTasks(prev => [...prev, task]);
      storage.saveTasks(currentUser.id, [...tasks, task]);
      setNewTask({ title: '', description: '', projectId: '', priority: 'Medium' });
      setShowTaskModal(false);
    };
    
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Add New Task</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Task Title</Label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              />
            </div>
            
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Description</Label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your task"
                style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
              />
            </div>
            
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Project</Label>
              <select
                value={newTask.projectId}
                onChange={(e) => setNewTask(prev => ({ ...prev, projectId: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id.toString()}>{project.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Priority</Label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as 'Low' | 'Medium' | 'High' }))}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Button onClick={() => setShowTaskModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createTask} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Create Task
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  const SkillModal = () => {
    if (!showSkillModal) return null;
    
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Add New Skill</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Skill Name</Label>
            <Input
              value={newSkill.name}
              onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., React, TypeScript, Node.js"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Skill Level: {newSkill.level}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={newSkill.level}
              onChange={(e) => setNewSkill(prev => ({ ...prev, level: parseInt(e.target.value) }))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowSkillModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createSkill} style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Add Skill
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  if (dataLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#6b7280' }}>Loading Developer Dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (dataError) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error Loading Dashboard</h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{dataError}</p>
          <Button onClick={() => window.location.reload()} style={{ backgroundColor: '#3b82f6', color: 'white' }}>
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <DashboardHeader 
        title="Developer Hub" 
        subtitle="Build, track, and optimize your development journey"
        role="developer"
        roleColor="#3b82f6"
      />
      
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
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>â</span>
      </button>
      
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        left: sidebarOpen ? '0px' : (isMobile ? '-280px' : '-250px'),
        top: '0px',
        width: isMobile ? '280px' : '250px',
        height: '100vh',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        boxShadow: isMobile ? '4px 0 6px rgba(0, 0, 0, 0.1)' : 'none',
        transition: 'left 0.3s ease',
        zIndex: 999,
        overflowY: 'auto'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', position: 'relative' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              padding: '0.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              display: isMobile ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
            onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
          >
            ×
          </button>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>â</span>
            Developer Hub
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{currentUser.name}</p>
        </div>
        
        <nav style={{ padding: '1rem' }}>
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (isMobile) setSidebarOpen(false);
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                backgroundColor: activeSection === item.id ? '#3b82f6' : 'transparent',
                color: activeSection === item.id ? 'white' : '#1f2937',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: activeSection === item.id ? '600' : '400',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Collapsed State Toggle Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          padding: '0.5rem',
          backgroundColor: '#3b82f6',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          display: isMobile ? 'none' : (sidebarOpen ? 'none' : 'flex'),
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          zIndex: 998
        }}
      >
        <span style={{ fontSize: '1rem', color: 'white', fontWeight: 'bold' }}>â</span>
      </button>
      
      {/* Main Content */}
      <div style={{ marginLeft: isMobile ? '0' : (sidebarOpen ? '260px' : '0px'), transition: 'margin-left 0.3s ease', width: isMobile ? '100vw' : (sidebarOpen ? 'calc(100vw - 260px)' : '100vw'), minHeight: '100vh' }}>
        <div style={{ padding: isMobile ? '1rem' : '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <main>
            {renderActiveContent()}
          </main>
        </div>
      </div>
      
      {/* Modals */}
      <ProjectModal />
      <TaskModal />
      <SkillModal />
      
      {/* Enhanced AI Assistant */}
      <EnhancedAIChat
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        role="developer"
        userData={currentUser}
        recentActivity={projects.slice(0, 3).map(p => ({ type: 'project', description: p.name }))}
      />
      
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
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
            transition: 'all 0.2s',
            zIndex: 997
          }}
        >
          ð
        </button>
      )}
      
      {/* Roadmap Modal */}
      {showRoadmapModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Generate Learning Roadmap</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>What do you want to learn?</Label>
              <Textarea
                value={roadmapGoal}
                onChange={(e) => setRoadmapGoal(e.target.value)}
                placeholder="e.g., Learn React and TypeScript to become a full-stack developer"
                disabled={isGeneratingRoadmap}
                style={{ 
                  width: '100%', 
                  minHeight: '100px', 
                  padding: '0.75rem', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem', 
                  resize: 'vertical',
                  opacity: isGeneratingRoadmap ? 0.6 : 1,
                  backgroundColor: isGeneratingRoadmap ? '#f9fafb' : 'white'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Roadmap Type</Label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['learning', 'task', 'project'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => !isGeneratingRoadmap && setRoadmapMode(mode as 'learning' | 'task' | 'project')}
                    disabled={isGeneratingRoadmap}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: `1px solid ${roadmapMode === mode ? '#3b82f6' : '#e5e7eb'}`,
                      borderRadius: '0.25rem',
                      backgroundColor: roadmapMode === mode ? '#eff6ff' : 'white',
                      color: roadmapMode === mode ? '#3b82f6' : '#1f2937',
                      cursor: isGeneratingRoadmap ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      opacity: isGeneratingRoadmap ? 0.6 : 1
                    }}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {isGeneratingRoadmap && (
              <div style={{ 
                marginBottom: '1rem', 
                padding: '1rem', 
                backgroundColor: '#f0f9ff', 
                borderRadius: '0.5rem', 
                border: '1px solid #bae6fd',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #3b82f6',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <span style={{ color: '#0369a1', fontSize: '0.875rem' }}>
                    Generating your personalized roadmap...
                  </span>
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setShowRoadmapModal(false)} 
                disabled={isGeneratingRoadmap}
                style={{ 
                  backgroundColor: '#6b7280', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.5rem',
                  opacity: isGeneratingRoadmap ? 0.6 : 1,
                  cursor: isGeneratingRoadmap ? 'not-allowed' : 'pointer'
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={generateRoadmap}
                disabled={!roadmapGoal.trim() || isGeneratingRoadmap}
                style={{ 
                  backgroundColor: '#3b82f6', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.5rem',
                  opacity: (!roadmapGoal.trim() || isGeneratingRoadmap) ? 0.6 : 1,
                  cursor: (!roadmapGoal.trim() || isGeneratingRoadmap) ? 'not-allowed' : 'pointer'
                }}
              >
                {isGeneratingRoadmap ? 'Generating...' : 'Generate Roadmap'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* File Upload Modal */}
      {showFileUploadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Analyze Code Files</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Select files to analyze</Label>
              <input
                type="file"
                multiple
                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              />
            </div>
            
            {selectedFile && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowFileUploadModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (selectedFile) {
                    // Simulate file analysis
                    const analysis = {
                      id: Date.now(),
                      fileName: selectedFile.name,
                      insights: `Analysis of ${selectedFile.name}:\n\n- Code quality: Good\n- Complexity: Medium\n- Suggestions: Consider adding more comments\n- Dependencies: Well managed`,
                      status: 'Completed',
                      createdAt: new Date().toISOString()
                    };
                    setFileAnalyses(prev => [...prev, analysis]);
                    storage.saveFileAnalyses(currentUser.id, [...fileAnalyses, analysis]);
                    setSelectedFile(null);
                    setShowFileUploadModal(false);
                  }
                }} 
                style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}
                disabled={!selectedFile}
              >
                Analyze Files
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS Animations */}
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
};

export default DeveloperDashboard;

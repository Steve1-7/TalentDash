import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/authStore';
import DashboardHeader from '@/components/DashboardHeader';
import EnhancedSettings from '@/components/EnhancedSettings';
import EnhancedAIChat from '@/components/EnhancedAIChat';

// Interfaces
interface Gig {
  id: number;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  status: 'Open' | 'In Progress' | 'Completed';
  client: string;
  aiMatch?: number;
  createdAt: string;
  updatedAt: string;
}

interface Client {
  id: number;
  name: string;
  project: string;
  budget: string;
  status: 'Active' | 'In Progress' | 'Review';
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

interface Proposal {
  id: number;
  title: string;
  client: string;
  value: string;
  status: 'Accepted' | 'Pending' | 'Draft';
  sentDate: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Earning {
  id: number;
  source: string;
  amount: number;
  date: string;
  type: 'Project' | 'Hourly' | 'Retainer';
  status: 'Paid' | 'Pending';
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  progress: number;
  client: string;
  budget: string;
  startDate: string;
  endDate: string;
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
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  createdAt: string;
  updatedAt: string;
}

interface Skill {
  id: number;
  name: string;
  level: number;
  category: string;
  lastUpdated: string;
  hourlyRate?: number;
}

// Storage utilities
const storage = {
  getGigs: (userId: string) => {
    const stored = localStorage.getItem(`gigs-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveGigs: (userId: string, gigs: Gig[]) => {
    localStorage.setItem(`gigs-${userId}`, JSON.stringify(gigs));
  },
  getClients: (userId: string) => {
    const stored = localStorage.getItem(`clients-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveClients: (userId: string, clients: Client[]) => {
    localStorage.setItem(`clients-${userId}`, JSON.stringify(clients));
  },
  getProposals: (userId: string) => {
    const stored = localStorage.getItem(`proposals-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveProposals: (userId: string, proposals: Proposal[]) => {
    localStorage.setItem(`proposals-${userId}`, JSON.stringify(proposals));
  },
  getEarnings: (userId: string) => {
    const stored = localStorage.getItem(`earnings-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveEarnings: (userId: string, earnings: Earning[]) => {
    localStorage.setItem(`earnings-${userId}`, JSON.stringify(earnings));
  },
  getProjects: (userId: string) => {
    const stored = localStorage.getItem(`freelance-projects-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveProjects: (userId: string, projects: Project[]) => {
    localStorage.setItem(`freelance-projects-${userId}`, JSON.stringify(projects));
  },
  getTasks: (userId: string) => {
    const stored = localStorage.getItem(`freelance-tasks-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveTasks: (userId: string, tasks: Task[]) => {
    localStorage.setItem(`freelance-tasks-${userId}`, JSON.stringify(tasks));
  },
  getSkills: (userId: string) => {
    const stored = localStorage.getItem(`freelance-skills-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveSkills: (userId: string, skills: Skill[]) => {
    localStorage.setItem(`freelance-skills-${userId}`, JSON.stringify(skills));
  }
};

const FreelancerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const currentUser = user || { id: 'default', email: 'freelancer@example.com', name: 'Freelancer' };
  
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
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  
  // Modal states
  const [showGigModal, setShowGigModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  
  // Form states
  const [newGig, setNewGig] = useState({ title: '', description: '', budget: '', deadline: '', client: '' });
  const [newClient, setNewClient] = useState({ name: '', project: '', budget: '', contactEmail: '' });
  const [newProposal, setNewProposal] = useState({ title: '', client: '', value: '', description: '' });
  const [newProject, setNewProject] = useState({ name: '', description: '', client: '', budget: '', startDate: '', endDate: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', priority: 'Medium' as const, dueDate: '', estimatedHours: 0 });
  const [newSkill, setNewSkill] = useState({ name: '', level: 50, hourlyRate: 0 });
  
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
        // Load freelancer data from localStorage
        const loadedGigs = storage.getGigs(currentUser.id);
        const loadedClients = storage.getClients(currentUser.id);
        const loadedProposals = storage.getProposals(currentUser.id);
        const loadedEarnings = storage.getEarnings(currentUser.id);
        const loadedProjects = storage.getProjects(currentUser.id);
        const loadedTasks = storage.getTasks(currentUser.id);
        const loadedSkills = storage.getSkills(currentUser.id);
        
        setGigs(loadedGigs);
        setClients(loadedClients);
        setProposals(loadedProposals);
        setEarnings(loadedEarnings);
        setProjects(loadedProjects);
        setTasks(loadedTasks);
        setSkills(loadedSkills);
        
        // Set default data if empty
        if (loadedGigs.length === 0) {
          const defaultGigs = [
            { id: 1, title: 'React Web Application', description: 'Build a modern React app with TypeScript', budget: '$5,000', deadline: '2024-05-01', status: 'In Progress' as const, client: 'TechCorp', aiMatch: 92, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 2, title: 'Mobile App UI Design', description: 'Design UI/UX for mobile application', budget: '$3,000', deadline: '2024-04-15', status: 'Open' as const, client: 'StartupXYZ', aiMatch: 87, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          ];
          setGigs(defaultGigs);
          storage.saveGigs(currentUser.id, defaultGigs);
        }
        
        if (loadedClients.length === 0) {
          const defaultClients = [
            { id: 1, name: 'TechCorp', project: 'E-commerce Platform', budget: '$15,000', status: 'Active' as const, contactEmail: 'contact@techcorp.com', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 2, name: 'StartupXYZ', project: 'Mobile App', budget: '$8,000', status: 'In Progress' as const, contactEmail: 'hello@startupxyz.com', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          ];
          setClients(defaultClients);
          storage.saveClients(currentUser.id, defaultClients);
        }
        
        if (loadedProposals.length === 0) {
          const defaultProposals = [
            { id: 1, title: 'Full Stack Development', client: 'TechCorp', value: '$25,000', status: 'Accepted' as const, sentDate: '2024-04-01', description: 'Complete web application development', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 2, title: 'UI/UX Design Package', client: 'DesignCo', value: '$12,000', status: 'Pending' as const, sentDate: '2024-04-05', description: 'Complete design system and UI components', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          ];
          setProposals(defaultProposals);
          storage.saveProposals(currentUser.id, defaultProposals);
        }
        
        if (loadedEarnings.length === 0) {
          const defaultEarnings = [
            { id: 1, source: 'TechCorp - Web App', amount: 5000, date: '2024-04-01', type: 'Project' as const, status: 'Paid' as const },
            { id: 2, source: 'StartupXYZ - Consulting', amount: 1500, date: '2024-04-05', type: 'Hourly' as const, status: 'Paid' as const },
            { id: 3, source: 'DesignCo - UI Design', amount: 3000, date: '2024-04-10', type: 'Project' as const, status: 'Pending' as const }
          ];
          setEarnings(defaultEarnings);
          storage.saveEarnings(currentUser.id, defaultEarnings);
        }
        
        if (loadedSkills.length === 0) {
          const defaultSkills = [
            { id: 1, name: 'React', level: 90, category: 'Frontend', lastUpdated: new Date().toISOString(), hourlyRate: 85 },
            { id: 2, name: 'Node.js', level: 85, category: 'Backend', lastUpdated: new Date().toISOString(), hourlyRate: 80 },
            { id: 3, name: 'UI/UX Design', level: 75, category: 'Design', lastUpdated: new Date().toISOString(), hourlyRate: 70 },
            { id: 4, name: 'Project Management', level: 80, category: 'Business', lastUpdated: new Date().toISOString(), hourlyRate: 75 }
          ];
          setSkills(defaultSkills);
          storage.saveSkills(currentUser.id, defaultSkills);
        }
        
      } catch (error) {
        setDataError('Failed to load freelancer dashboard data');
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
  const createGig = () => {
    if (newGig.title.trim()) {
      const gig = {
        id: Date.now(),
        title: newGig.title.trim(),
        description: newGig.description.trim(),
        budget: newGig.budget.trim(),
        deadline: newGig.deadline,
        client: newGig.client.trim(),
        status: 'Open' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setGigs(prev => [...prev, gig]);
      storage.saveGigs(currentUser.id, [...gigs, gig]);
      setNewGig({ title: '', description: '', budget: '', deadline: '', client: '' });
      setShowGigModal(false);
    }
  };
  
  const createClient = () => {
    if (newClient.name.trim()) {
      const client = {
        id: Date.now(),
        name: newClient.name.trim(),
        project: newClient.project.trim(),
        budget: newClient.budget.trim(),
        status: 'Active' as const,
        contactEmail: newClient.contactEmail.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setClients(prev => [...prev, client]);
      storage.saveClients(currentUser.id, [...clients, client]);
      setNewClient({ name: '', project: '', budget: '', contactEmail: '' });
      setShowClientModal(false);
    }
  };
  
  const createProposal = () => {
    if (newProposal.title.trim()) {
      const proposal = {
        id: Date.now(),
        title: newProposal.title.trim(),
        client: newProposal.client.trim(),
        value: newProposal.value.trim(),
        status: 'Draft' as const,
        sentDate: new Date().toISOString().split('T')[0],
        description: newProposal.description.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setProposals(prev => [...prev, proposal]);
      storage.saveProposals(currentUser.id, [...proposals, proposal]);
      setNewProposal({ title: '', client: '', value: '', description: '' });
      setShowProposalModal(false);
    }
  };
  
  const createProject = () => {
    if (newProject.name.trim()) {
      const project = {
        id: Date.now(),
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        client: newProject.client.trim(),
        budget: newProject.budget.trim(),
        startDate: newProject.startDate,
        endDate: newProject.endDate,
        status: 'Planning' as const,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setProjects(prev => [...prev, project]);
      storage.saveProjects(currentUser.id, [...projects, project]);
      setNewProject({ name: '', description: '', client: '', budget: '', startDate: '', endDate: '' });
      setShowProjectModal(false);
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
        dueDate: newTask.dueDate,
        estimatedHours: newTask.estimatedHours,
        actualHours: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTasks(prev => [...prev, task]);
      storage.saveTasks(currentUser.id, [...tasks, task]);
      setNewTask({ title: '', description: '', projectId: '', priority: 'Medium', dueDate: '', estimatedHours: 0 });
      setShowTaskModal(false);
    }
  };
  
  const createSkill = () => {
    if (newSkill.name.trim()) {
      const skill = {
        id: Date.now(),
        name: newSkill.name.trim(),
        level: newSkill.level,
        category: 'Technical',
        lastUpdated: new Date().toISOString(),
        hourlyRate: newSkill.hourlyRate
      };
      
      setSkills(prev => [...prev, skill]);
      storage.saveSkills(currentUser.id, [...skills, skill]);
      setNewSkill({ name: '', level: 50, hourlyRate: 0 });
      setShowSkillModal(false);
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
    
    setAiMessages(prev => [...prev, {
      id: prev.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date()
    }]);
    
    setAiInput('');
    setAiStreaming(true);
    
    setTimeout(() => {
      const aiResponse = `As your freelance business assistant, I can help you with:\n\n1. Finding and qualifying new gigs\n2. Optimizing your proposal templates\n3. Managing client relationships\n4. Setting competitive rates\n5. Time tracking and productivity\n6. Financial planning and tax strategies\n\nYour current stats: ${gigs.length} active gigs, ${clients.length} clients, $${earnings.reduce((sum, e) => sum + e.amount, 0)} total earnings\n\nWhat would you like to focus on?`;
      
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
      
      setAiStreaming(false);
    }, 1500);
  };
  
  // Navigation items for Freelancer
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ð' },
    { id: 'gigs', label: 'Gigs', icon: 'ð' },
    { id: 'clients', label: 'Clients', icon: 'ð' },
    { id: 'proposals', label: 'Proposals', icon: 'ð' },
    { id: 'earnings', label: 'Earnings', icon: 'ð' },
    { id: 'projects', label: 'Projects', icon: 'ð' },
    { id: 'tasks', label: 'Tasks', icon: 'â' },
    { id: 'skills', label: 'Skills', icon: 'ð' },
    { id: 'settings', label: 'Settings', icon: 'â' }
  ];
  
  // Calculate earnings stats
  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
  const paidEarnings = earnings.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0);
  const pendingEarnings = earnings.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0);
  const avgHourlyRate = skills.length > 0 ? Math.round(skills.reduce((sum, skill) => sum + (skill.hourlyRate || 0), 0) / skills.length) : 0;
  
  // Render active content based on section
  const renderActiveContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: "2px solid #10b981" }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: '0 0 0.5rem 0' }}>${totalEarnings.toLocaleString()}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Total Earnings</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: "2px solid #3b82f6" }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: '0 0 0.5rem 0' }}>{gigs.filter(g => g.status === 'In Progress').length}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Active Gigs</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: "2px solid #8b5cf6" }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', margin: '0 0 0.5rem 0' }}>{clients.length}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Active Clients</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: "2px solid #f59e0b" }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: '0 0 0.5rem 0' }}>${avgHourlyRate}/hr</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Avg Hourly Rate</p>
              </div>
            </div>
            
            {/* Earnings Overview */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Earnings Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>${paidEarnings.toLocaleString()}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Paid</p>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>${pendingEarnings.toLocaleString()}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pending</p>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>${Math.round(totalEarnings / 12).toLocaleString()}/mo</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Monthly Avg</p>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Recent Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {earnings.slice(0, 3).map(earning => (
                  <div key={earning.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{earning.source}</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{earning.type} â¢ {new Date(earning.date).toLocaleDateString()}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: earning.status === 'Paid' ? '#10b981' : '#f59e0b' }}>
                          ${earning.amount.toLocaleString()}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{earning.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'gigs':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Active Gigs</h2>
              <Button onClick={() => setShowGigModal(true)} style={{ backgroundColor: '#10b981', color: 'white' }}>
                + Add New Gig
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {gigs.map(gig => (
                <div key={gig.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{gig.title}</h3>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      backgroundColor: gig.status === 'Open' ? '#dcfce7' : gig.status === 'In Progress' ? '#fef3c7' : '#e0e7ff',
                      color: gig.status === 'Open' ? '#166534' : gig.status === 'In Progress' ? '#92400e' : '#3730a3'
                    }}>
                      {gig.status}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{gig.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Client: {gig.client}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#10b981' }}>{gig.budget}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Deadline: {gig.deadline}</span>
                    {gig.aiMatch && (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>
                        AI Match: {gig.aiMatch}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'clients':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Active Clients</h2>
              <Button onClick={() => setShowClientModal(true)} style={{ backgroundColor: '#3b82f6', color: 'white' }}>
                + Add New Client
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {clients.map(client => (
                <div key={client.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{client.name}</h3>
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
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}><strong>Project:</strong> {client.project}</p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}><strong>Budget:</strong> {client.budget}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}><strong>Contact:</strong> {client.contactEmail}</p>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'proposals':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Proposals</h2>
              <Button onClick={() => setShowProposalModal(true)} style={{ backgroundColor: '#8b5cf6', color: 'white' }}>
                + Create Proposal
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {proposals.map(proposal => (
                <div key={proposal.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{proposal.title}</h3>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      backgroundColor: proposal.status === 'Accepted' ? '#dcfce7' : proposal.status === 'Pending' ? '#fef3c7' : '#e5e7eb',
                      color: proposal.status === 'Accepted' ? '#166534' : proposal.status === 'Pending' ? '#92400e' : '#6b7280'
                    }}>
                      {proposal.status}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{proposal.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Client: {proposal.client}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sent: {proposal.sentDate}</p>
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>{proposal.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'earnings':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>Earnings</h2>
            
            {/* Earnings Summary */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Financial Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>${totalEarnings.toLocaleString()}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Earnings</p>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>${paidEarnings.toLocaleString()}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Paid Amount</p>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>${pendingEarnings.toLocaleString()}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pending Amount</p>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>${avgHourlyRate}/hr</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg Hourly Rate</p>
                </div>
              </div>
            </div>
            
            {/* Earnings List */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Earning History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {earnings.map(earning => (
                  <div key={earning.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{earning.source}</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{earning.type} â¢ {new Date(earning.date).toLocaleDateString()}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: earning.status === 'Paid' ? '#10b981' : '#f59e0b' }}>
                          ${earning.amount.toLocaleString()}
                        </p>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem',
                          backgroundColor: earning.status === 'Paid' ? '#dcfce7' : '#fef3c7',
                          color: earning.status === 'Paid' ? '#166534' : '#92400e'
                        }}>
                          {earning.status}
                        </span>
                      </div>
                    </div>
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
              <Button onClick={() => setShowProjectModal(true)} style={{ backgroundColor: '#f59e0b', color: 'white' }}>
                + New Project
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {projects.map(project => (
                <div key={project.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>{project.name}</h3>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{project.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Client: {project.client}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#10b981' }}>{project.budget}</span>
                  </div>
                  <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <div style={{ backgroundColor: '#f59e0b', height: '100%', width: `${project.progress}%` }} />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{project.progress}% complete</p>
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
              <Button onClick={() => setShowTaskModal(true)} style={{ backgroundColor: '#ef4444', color: 'white' }}>
                + Add Task
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
                      Due: {task.dueDate}
                    </span>
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
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Skills & Rates</h2>
              <Button onClick={() => setShowSkillModal(true)} style={{ backgroundColor: '#8b5cf6', color: 'white' }}>
                + Add Skill
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{skill.category}</span>
                    {skill.hourlyRate && (
                      <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#10b981' }}>${skill.hourlyRate}/hr</span>
                    )}
                  </div>
                </div>
              ))}
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
  
  // Modal components
  const GigModal = () => (
    showGigModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Add New Gig</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Gig Title</Label>
            <Input
              value={newGig.title}
              onChange={(e) => setNewGig(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter gig title"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Description</Label>
            <Textarea
              value={newGig.description}
              onChange={(e) => setNewGig(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the gig"
              style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Client</Label>
            <Input
              value={newGig.client}
              onChange={(e) => setNewGig(prev => ({ ...prev, client: e.target.value }))}
              placeholder="Client name"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Budget</Label>
            <Input
              value={newGig.budget}
              onChange={(e) => setNewGig(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="e.g., $5,000"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Deadline</Label>
            <Input
              type="date"
              value={newGig.deadline}
              onChange={(e) => setNewGig(prev => ({ ...prev, deadline: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowGigModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createGig} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Add Gig
            </Button>
          </div>
        </div>
      </div>
    )
  );
  
  const ClientModal = () => (
    showClientModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Add New Client</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Client Name</Label>
            <Input
              value={newClient.name}
              onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter client name"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Project</Label>
            <Input
              value={newClient.project}
              onChange={(e) => setNewClient(prev => ({ ...prev, project: e.target.value }))}
              placeholder="Current project"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Budget</Label>
            <Input
              value={newClient.budget}
              onChange={(e) => setNewClient(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="Project budget"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Contact Email</Label>
            <Input
              type="email"
              value={newClient.contactEmail}
              onChange={(e) => setNewClient(prev => ({ ...prev, contactEmail: e.target.value }))}
              placeholder="contact@example.com"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowClientModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createClient} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Add Client
            </Button>
          </div>
        </div>
      </div>
    )
  );
  
  const ProposalModal = () => (
    showProposalModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Create Proposal</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Proposal Title</Label>
            <Input
              value={newProposal.title}
              onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter proposal title"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Client</Label>
            <Input
              value={newProposal.client}
              onChange={(e) => setNewProposal(prev => ({ ...prev, client: e.target.value }))}
              placeholder="Client name"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Value</Label>
            <Input
              value={newProposal.value}
              onChange={(e) => setNewProposal(prev => ({ ...prev, value: e.target.value }))}
              placeholder="e.g., $25,000"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Description</Label>
            <Textarea
              value={newProposal.description}
              onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the proposal"
              style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowProposalModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createProposal} style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Create Proposal
            </Button>
          </div>
        </div>
      </div>
    )
  );
  
  const ProjectModal = () => (
    showProjectModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>New Project</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Project Name</Label>
            <Input
              value={newProject.name}
              onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter project name"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Description</Label>
            <Textarea
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project"
              style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Client</Label>
            <Input
              value={newProject.client}
              onChange={(e) => setNewProject(prev => ({ ...prev, client: e.target.value }))}
              placeholder="Client name"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Budget</Label>
            <Input
              value={newProject.budget}
              onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="Project budget"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Start Date</Label>
            <Input
              type="date"
              value={newProject.startDate}
              onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>End Date</Label>
            <Input
              type="date"
              value={newProject.endDate}
              onChange={(e) => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowProjectModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createProject} style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Create Project
            </Button>
          </div>
        </div>
      </div>
    )
  );
  
  const TaskModal = () => (
    showTaskModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Add Task</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Task Title</Label>
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Description</Label>
            <Textarea
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your task"
              style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
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
          
          <div style={{ marginBottom: '1rem' }}>
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
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Due Date</Label>
            <Input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Estimated Hours</Label>
            <Input
              type="number"
              value={newTask.estimatedHours}
              onChange={(e) => setNewTask(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
              placeholder="Estimated hours"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowTaskModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createTask} style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Add Task
            </Button>
          </div>
        </div>
      </div>
    )
  );
  
  const SkillModal = () => (
    showSkillModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Add Skill</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Skill Name</Label>
            <Input
              value={newSkill.name}
              onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., React, Design, Marketing"
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
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Hourly Rate ($)</Label>
            <Input
              type="number"
              value={newSkill.hourlyRate}
              onChange={(e) => setNewSkill(prev => ({ ...prev, hourlyRate: parseInt(e.target.value) || 0 }))}
              placeholder="Your hourly rate for this skill"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
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
    )
  );
  
  if (dataLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#6b7280' }}>Loading Freelancer Dashboard...</p>
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
          <Button onClick={() => window.location.reload()} style={{ backgroundColor: '#10b981', color: 'white' }}>
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <DashboardHeader 
        title="Freelancer Dashboard" 
        subtitle="Manage gigs, clients, and grow your freelance business"
        role="freelancer"
        roleColor="#10b981"
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
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>ð</span>
            Freelance Hub
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
                backgroundColor: activeSection === item.id ? '#10b981' : 'transparent',
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
      
      {/* Main Content */}
      <div style={{ marginLeft: isMobile ? '0' : (sidebarOpen ? '250px' : '0px'), padding: '2rem', minHeight: '100vh', transition: 'margin-left 0.3s ease', width: isMobile ? '100vw' : (sidebarOpen ? 'calc(100vw - 250px)' : '100vw') }}>
        <main>
          {renderActiveContent()}
        </main>
      </div>
      
      {/* Modals */}
      <GigModal />
      <ClientModal />
      <ProposalModal />
      <ProjectModal />
      <TaskModal />
      <SkillModal />
      
      {/* Enhanced AI Assistant */}
      <EnhancedAIChat
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        role="freelancer"
        userData={currentUser}
        recentActivity={gigs.slice(0, 3).map(g => ({ type: 'gig', description: g.title }))}
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
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.2s',
            zIndex: 997
          }}
        >
          ð
        </button>
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

export default FreelancerDashboard;

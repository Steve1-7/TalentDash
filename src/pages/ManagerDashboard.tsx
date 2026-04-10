import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/authStore';
import DashboardHeader from '@/components/DashboardHeader';
import EnhancedSettings from '@/components/EnhancedSettings';

// Interfaces
interface TeamMember {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  performance: number;
  projectsCount: number;
  joinDate: string;
  avatar?: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  progress: number;
  priority: 'Low' | 'Medium' | 'High';
  teamMembers: number;
  budget: string;
  startDate: string;
  endDate: string;
  manager: string;
  createdAt: string;
  updatedAt: string;
}

interface Performance {
  id: number;
  employeeId: number;
  employeeName: string;
  period: string;
  rating: number;
  goals: string[];
  achievements: string[];
  areasForImprovement: string[];
  managerFeedback: string;
  status: 'Draft' | 'Submitted' | 'Approved';
  createdAt: string;
  updatedAt: string;
}

interface Report {
  id: number;
  title: string;
  type: 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  department: string;
  generatedDate: string;
  metrics: {
    productivity: number;
    satisfaction: number;
    turnover: number;
    budget: number;
  };
  status: 'Draft' | 'Published';
  createdAt: string;
  updatedAt: string;
}

interface Assignment {
  id: number;
  title: string;
  assigneeId: number;
  assigneeName: string;
  projectId: number;
  projectName: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  createdAt: string;
  updatedAt: string;
}

// Storage utilities
const storage = {
  getTeamMembers: (userId: string) => {
    const stored = localStorage.getItem(`team-members-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveTeamMembers: (userId: string, members: TeamMember[]) => {
    localStorage.setItem(`team-members-${userId}`, JSON.stringify(members));
  },
  getProjects: (userId: string) => {
    const stored = localStorage.getItem(`manager-projects-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveProjects: (userId: string, projects: Project[]) => {
    localStorage.setItem(`manager-projects-${userId}`, JSON.stringify(projects));
  },
  getPerformance: (userId: string) => {
    const stored = localStorage.getItem(`performance-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  savePerformance: (userId: string, performance: Performance[]) => {
    localStorage.setItem(`performance-${userId}`, JSON.stringify(performance));
  },
  getReports: (userId: string) => {
    const stored = localStorage.getItem(`reports-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveReports: (userId: string, reports: Report[]) => {
    localStorage.setItem(`reports-${userId}`, JSON.stringify(reports));
  },
  getAssignments: (userId: string) => {
    const stored = localStorage.getItem(`assignments-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveAssignments: (userId: string, assignments: Assignment[]) => {
    localStorage.setItem(`assignments-${userId}`, JSON.stringify(assignments));
  }
};

const ManagerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const currentUser = user || { id: 'default', email: 'manager@example.com', name: 'Manager' };
  
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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [performance, setPerformance] = useState<Performance[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  // Modal states
  const [showTeamMemberModal, setShowTeamMemberModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  
  // Form states
  const [newTeamMember, setNewTeamMember] = useState({ name: '', email: '', position: '', department: '', skills: '' });
  const [newProject, setNewProject] = useState({ name: '', description: '', priority: 'Medium' as const, budget: '', startDate: '', endDate: '', manager: currentUser.name });
  const [newPerformance, setNewPerformance] = useState({ employeeId: '', period: '', rating: 5, goals: '', achievements: '', areasForImprovement: '', managerFeedback: '' });
  const [newReport, setNewReport] = useState({ title: '', type: 'Monthly' as const, department: '' });
  const [newAssignment, setNewAssignment] = useState({ title: '', assigneeId: '', projectId: '', description: '', priority: 'Medium' as const, dueDate: '', estimatedHours: 0 });
  
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
        // Load manager data from localStorage
        const loadedTeamMembers = storage.getTeamMembers(currentUser.id);
        const loadedProjects = storage.getProjects(currentUser.id);
        const loadedPerformance = storage.getPerformance(currentUser.id);
        const loadedReports = storage.getReports(currentUser.id);
        const loadedAssignments = storage.getAssignments(currentUser.id);
        
        setTeamMembers(loadedTeamMembers);
        setProjects(loadedProjects);
        setPerformance(loadedPerformance);
        setReports(loadedReports);
        setAssignments(loadedAssignments);
        
        // Set default data if empty
        if (loadedTeamMembers.length === 0) {
          const defaultTeamMembers = [
            { id: 1, name: 'Alice Johnson', email: 'alice@company.com', position: 'Senior Developer', department: 'Engineering', status: 'Active' as const, performance: 4.5, projectsCount: 3, joinDate: '2022-01-15', skills: ['React', 'Node.js', 'TypeScript'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 2, name: 'Bob Smith', email: 'bob@company.com', position: 'Product Designer', department: 'Design', status: 'Active' as const, performance: 4.2, projectsCount: 2, joinDate: '2022-03-20', skills: ['Figma', 'Sketch', 'Adobe XD'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 3, name: 'Carol Williams', email: 'carol@company.com', position: 'Project Manager', department: 'Management', status: 'Active' as const, performance: 4.8, projectsCount: 4, joinDate: '2021-11-10', skills: ['Agile', 'Scrum', 'Leadership'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          ];
          setTeamMembers(defaultTeamMembers);
          storage.saveTeamMembers(currentUser.id, defaultTeamMembers);
        }
        
        if (loadedProjects.length === 0) {
          const defaultProjects = [
            { id: 1, name: 'Website Redesign', description: 'Complete overhaul of company website', status: 'In Progress' as const, progress: 65, priority: 'High' as const, teamMembers: 5, budget: '$50,000', startDate: '2024-01-01', endDate: '2024-06-30', manager: currentUser.name, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 2, name: 'Mobile App Development', description: 'Native iOS and Android apps', status: 'Planning' as const, progress: 15, priority: 'Medium' as const, teamMembers: 3, budget: '$75,000', startDate: '2024-03-01', endDate: '2024-12-31', manager: currentUser.name, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          ];
          setProjects(defaultProjects);
          storage.saveProjects(currentUser.id, defaultProjects);
        }
        
        if (loadedPerformance.length === 0) {
          const defaultPerformance = [
            { id: 1, employeeId: 1, employeeName: 'Alice Johnson', period: 'Q1 2024', rating: 4.5, goals: ['Complete 3 major features', 'Mentor junior developers'], achievements: ['Led website redesign', 'Improved code quality by 30%'], areasForImprovement: ['Time management', 'Documentation'], managerFeedback: 'Excellent performance, strong technical skills', status: 'Approved' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          ];
          setPerformance(defaultPerformance);
          storage.savePerformance(currentUser.id, defaultPerformance);
        }
        
      } catch (error) {
        setDataError('Failed to load manager dashboard data');
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
  const createTeamMember = () => {
    if (newTeamMember.name.trim()) {
      const member = {
        id: Date.now(),
        name: newTeamMember.name.trim(),
        email: newTeamMember.email.trim(),
        position: newTeamMember.position.trim(),
        department: newTeamMember.department.trim(),
        status: 'Active' as const,
        performance: 5,
        projectsCount: 0,
        joinDate: new Date().toISOString().split('T')[0],
        skills: newTeamMember.skills.split(',').map(s => s.trim()).filter(s => s),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setTeamMembers(prev => [...prev, member]);
      storage.saveTeamMembers(currentUser.id, [...teamMembers, member]);
      setNewTeamMember({ name: '', email: '', position: '', department: '', skills: '' });
      setShowTeamMemberModal(false);
    }
  };
  
  const createProject = () => {
    if (newProject.name.trim()) {
      const project = {
        id: Date.now(),
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        status: 'Planning' as const,
        progress: 0,
        priority: newProject.priority,
        teamMembers: 0,
        budget: newProject.budget.trim(),
        startDate: newProject.startDate,
        endDate: newProject.endDate,
        manager: newProject.manager.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setProjects(prev => [...prev, project]);
      storage.saveProjects(currentUser.id, [...projects, project]);
      setNewProject({ name: '', description: '', priority: 'Medium', budget: '', startDate: '', endDate: '', manager: currentUser.name });
      setShowProjectModal(false);
    }
  };
  
  const createPerformance = () => {
    if (newPerformance.employeeId.trim()) {
      const employee = teamMembers.find(m => m.id.toString() === newPerformance.employeeId);
      const performanceReview = {
        id: Date.now(),
        employeeId: parseInt(newPerformance.employeeId),
        employeeName: employee?.name || 'Unknown',
        period: newPerformance.period.trim(),
        rating: newPerformance.rating,
        goals: newPerformance.goals.split('\n').filter(g => g.trim()),
        achievements: newPerformance.achievements.split('\n').filter(a => a.trim()),
        areasForImprovement: newPerformance.areasForImprovement.split('\n').filter(a => a.trim()),
        managerFeedback: newPerformance.managerFeedback.trim(),
        status: 'Draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setPerformance(prev => [...prev, performanceReview]);
      storage.savePerformance(currentUser.id, [...performance, performanceReview]);
      setNewPerformance({ employeeId: '', period: '', rating: 5, goals: '', achievements: '', areasForImprovement: '', managerFeedback: '' });
      setShowPerformanceModal(false);
    }
  };
  
  const createReport = () => {
    if (newReport.title.trim()) {
      const report = {
        id: Date.now(),
        title: newReport.title.trim(),
        type: newReport.type,
        department: newReport.department.trim(),
        generatedDate: new Date().toISOString().split('T')[0],
        metrics: {
          productivity: Math.floor(Math.random() * 30) + 70,
          satisfaction: Math.floor(Math.random() * 20) + 75,
          turnover: Math.floor(Math.random() * 10) + 5,
          budget: Math.floor(Math.random() * 100000) + 50000
        },
        status: 'Draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setReports(prev => [...prev, report]);
      storage.saveReports(currentUser.id, [...reports, report]);
      setNewReport({ title: '', type: 'Monthly', department: '' });
      setShowReportModal(false);
    }
  };
  
  const createAssignment = () => {
    if (newAssignment.title.trim()) {
      const assignee = teamMembers.find(m => m.id.toString() === newAssignment.assigneeId);
      const project = projects.find(p => p.id.toString() === newAssignment.projectId);
      const assignment = {
        id: Date.now(),
        title: newAssignment.title.trim(),
        assigneeId: parseInt(newAssignment.assigneeId),
        assigneeName: assignee?.name || 'Unknown',
        projectId: parseInt(newAssignment.projectId),
        projectName: project?.name || 'Unknown',
        description: newAssignment.description.trim(),
        priority: newAssignment.priority,
        status: 'Pending' as const,
        dueDate: newAssignment.dueDate,
        estimatedHours: newAssignment.estimatedHours,
        actualHours: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setAssignments(prev => [...prev, assignment]);
      storage.saveAssignments(currentUser.id, [...assignments, assignment]);
      setNewAssignment({ title: '', assigneeId: '', projectId: '', description: '', priority: 'Medium', dueDate: '', estimatedHours: 0 });
      setShowAssignmentModal(false);
    }
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
      const aiResponse = `As your management assistant, I can help you with:\n\n1. Team performance analysis and optimization\n2. Project planning and resource allocation\n3. Employee engagement and retention strategies\n4. Budget planning and financial oversight\n5. Process improvement and workflow automation\n6. Leadership development and coaching\n\nYour current team: ${teamMembers.length} members, ${projects.length} active projects, ${assignments.filter(a => a.status === 'Pending').length} pending assignments\n\nWhat management challenge would you like to address?`;
      
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
      
      setAiStreaming(false);
    }, 1500);
  };
  
  // Navigation items for Manager
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ð' },
    { id: 'team', label: 'Team', icon: 'ð' },
    { id: 'projects', label: 'Projects', icon: 'ð' },
    { id: 'performance', label: 'Performance', icon: 'ð' },
    { id: 'reports', label: 'Reports', icon: 'ð' },
    { id: 'assignments', label: 'Assignments', icon: 'ð' },
    { id: 'settings', label: 'Settings', icon: 'â' }
  ];
  
  // Calculate stats
  const activeTeamMembers = teamMembers.filter(m => m.status === 'Active').length;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const avgPerformance = teamMembers.length > 0 ? (teamMembers.reduce((sum, m) => sum + m.performance, 0) / teamMembers.length).toFixed(1) : '0';
  const pendingAssignments = assignments.filter(a => a.status === 'Pending' || a.status === 'In Progress').length;
  
  // Render active content based on section
  const renderActiveContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: "2px solid #8b5cf6" }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', margin: '0 0 0.5rem 0' }}>{activeTeamMembers}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Team Members</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: "2px solid #3b82f6" }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: '0 0 0.5rem 0' }}>{activeProjects}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Active Projects</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: "2px solid #10b981" }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: '0 0 0.5rem 0' }}>{avgPerformance}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Avg Performance</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: "2px solid #f59e0b" }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: '0 0 0.5rem 0' }}>{pendingAssignments}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Pending Tasks</p>
              </div>
            </div>
            
            {/* Team Overview */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Team Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {teamMembers.slice(0, 4).map(member => (
                  <div key={member.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{member.name}</h4>
                      <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#10b981' }}>{member.performance}/5</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{member.position}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{member.department} â¢ {member.projectsCount} projects</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Projects Progress */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Projects Progress</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.map(project => (
                  <div key={project.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{project.name}</h4>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem',
                        backgroundColor: project.priority === 'High' ? '#fee2e2' : project.priority === 'Medium' ? '#fed7aa' : '#dbeafe',
                        color: project.priority === 'High' ? '#991b1b' : project.priority === 'Medium' ? '#92400e' : '#1e40af'
                      }}>
                        {project.priority}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{project.description}</p>
                    <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.25rem' }}>
                      <div style={{ backgroundColor: '#3b82f6', height: '100%', width: `${project.progress}%` }} />
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{project.progress}% complete â¢ {project.teamMembers} team members</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'team':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Team Members</h2>
              <Button onClick={() => setShowTeamMemberModal(true)} style={{ backgroundColor: '#8b5cf6', color: 'white' }}>
                + Add Team Member
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {teamMembers.map(member => (
                <div key={member.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{member.name}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Performance:</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>{member.performance}/5</div>
                    </div>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}><strong>Position:</strong> {member.position}</p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}><strong>Department:</strong> {member.department}</p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}><strong>Email:</strong> {member.email}</p>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}><strong>Joined:</strong> {member.joinDate}</p>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}><strong>Skills:</strong></p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {member.skills.map((skill, index) => (
                        <span key={index} style={{ 
                          fontSize: '0.75rem', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem',
                          backgroundColor: '#e5e7eb',
                          color: '#6b7280'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      backgroundColor: member.status === 'Active' ? '#dcfce7' : member.status === 'On Leave' ? '#fef3c7' : '#fee2e2',
                      color: member.status === 'Active' ? '#166534' : member.status === 'On Leave' ? '#92400e' : '#991b1b'
                    }}>
                      {member.status}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{member.projectsCount} projects</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'projects':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Projects</h2>
              <Button onClick={() => setShowProjectModal(true)} style={{ backgroundColor: '#3b82f6', color: 'white' }}>
                + New Project
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {projects.map(project => (
                <div key={project.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{project.name}</h3>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      backgroundColor: project.priority === 'High' ? '#fee2e2' : project.priority === 'Medium' ? '#fed7aa' : '#dbeafe',
                      color: project.priority === 'High' ? '#991b1b' : project.priority === 'Medium' ? '#92400e' : '#1e40af'
                    }}>
                      {project.priority}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{project.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{project.budget}</span>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      backgroundColor: project.status === 'In Progress' ? '#dbeafe' : project.status === 'Planning' ? '#fef3c7' : project.status === 'Review' ? '#e0e7ff' : '#dcfce7',
                      color: project.status === 'In Progress' ? '#1e40af' : project.status === 'Planning' ? '#92400e' : project.status === 'Review' ? '#3730a3' : '#166534'
                    }}>
                      {project.status}
                    </span>
                  </div>
                  <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <div style={{ backgroundColor: '#3b82f6', height: '100%', width: `${project.progress}%` }} />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{project.progress}% complete</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{project.teamMembers} team members â¢ {project.manager}</p>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'performance':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Performance Reviews</h2>
              <Button onClick={() => setShowPerformanceModal(true)} style={{ backgroundColor: '#10b981', color: 'white' }}>
                + New Review
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {performance.map(review => (
                <div key={review.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{review.employeeName}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>{review.rating}/5</div>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem',
                        backgroundColor: review.status === 'Approved' ? '#dcfce7' : review.status === 'Submitted' ? '#fef3c7' : '#e5e7eb',
                        color: review.status === 'Approved' ? '#166534' : review.status === 'Submitted' ? '#92400e' : '#6b7280'
                      }}>
                        {review.status}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}><strong>Period:</strong> {review.period}</p>
                  
                  {review.goals.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>Goals:</p>
                      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                        {review.goals.map((goal, index) => (
                          <li key={index} style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{goal}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {review.achievements.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>Achievements:</p>
                      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                        {review.achievements.map((achievement, index) => (
                          <li key={index} style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {review.managerFeedback && (
                    <div style={{ padding: '0.5rem', backgroundColor: '#f9fafb', borderRadius: '0.25rem' }}>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}><strong>Manager Feedback:</strong> {review.managerFeedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'reports':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Reports</h2>
              <Button onClick={() => setShowReportModal(true)} style={{ backgroundColor: '#f59e0b', color: 'white' }}>
                + Generate Report
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {reports.map(report => (
                <div key={report.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{report.title}</h3>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      backgroundColor: report.status === 'Published' ? '#dcfce7' : '#e5e7eb',
                      color: report.status === 'Published' ? '#166534' : '#6b7280'
                    }}>
                      {report.status}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{report.type} Report â¢ {report.department}</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#f9fafb', borderRadius: '0.25rem' }}>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0' }}>Productivity</p>
                      <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#10b981', margin: '0' }}>{report.metrics.productivity}%</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#f9fafb', borderRadius: '0.25rem' }}>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0' }}>Satisfaction</p>
                      <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#3b82f6', margin: '0' }}>{report.metrics.satisfaction}%</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#f9fafb', borderRadius: '0.25rem' }}>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0' }}>Turnover</p>
                      <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#ef4444', margin: '0' }}>{report.metrics.turnover}%</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#f9fafb', borderRadius: '0.25rem' }}>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0' }}>Budget</p>
                      <p style={{ fontSize: '1rem', fontWeight: 'bold', color: '#8b5cf6', margin: '0' }}>${(report.metrics.budget / 1000).toFixed(0)}k</p>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Generated: {report.generatedDate}</p>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'assignments':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Assignments</h2>
              <Button onClick={() => setShowAssignmentModal(true)} style={{ backgroundColor: '#ef4444', color: 'white' }}>
                + New Assignment
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {assignments.map(assignment => (
                <div key={assignment.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{assignment.title}</h3>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      backgroundColor: assignment.status === 'Completed' ? '#dcfce7' : assignment.status === 'In Progress' ? '#dbeafe' : assignment.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                      color: assignment.status === 'Completed' ? '#166534' : assignment.status === 'In Progress' ? '#1e40af' : assignment.status === 'Pending' ? '#92400e' : '#991b1b'
                    }}>
                      {assignment.status}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>{assignment.description}</p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}><strong>Assigned to:</strong> {assignment.assigneeName}</p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}><strong>Project:</strong> {assignment.projectName}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Due: {assignment.dueDate}</span>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      backgroundColor: assignment.priority === 'High' ? '#fee2e2' : assignment.priority === 'Medium' ? '#fed7aa' : '#dbeafe',
                      color: assignment.priority === 'High' ? '#991b1b' : assignment.priority === 'Medium' ? '#92400e' : '#1e40af'
                    }}>
                      {assignment.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    {assignment.actualHours}h / {assignment.estimatedHours}h
                  </p>
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
  const TeamMemberModal = () => (
    showTeamMemberModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Add Team Member</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Name</Label>
            <Input
              value={newTeamMember.name}
              onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Team member name"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Email</Label>
            <Input
              type="email"
              value={newTeamMember.email}
              onChange={(e) => setNewTeamMember(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@company.com"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Position</Label>
            <Input
              value={newTeamMember.position}
              onChange={(e) => setNewTeamMember(prev => ({ ...prev, position: e.target.value }))}
              placeholder="Job title"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Department</Label>
            <Input
              value={newTeamMember.department}
              onChange={(e) => setNewTeamMember(prev => ({ ...prev, department: e.target.value }))}
              placeholder="Department"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Skills (comma-separated)</Label>
            <Input
              value={newTeamMember.skills}
              onChange={(e) => setNewTeamMember(prev => ({ ...prev, skills: e.target.value }))}
              placeholder="React, TypeScript, Leadership"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowTeamMemberModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createTeamMember} style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Add Member
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
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Create Project</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Project Name</Label>
            <Input
              value={newProject.name}
              onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Project name"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Description</Label>
            <Textarea
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project description"
              style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Priority</Label>
            <select
              value={newProject.priority}
              onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value as Project['priority'] }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Budget</Label>
            <Input
              value={newProject.budget}
              onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="e.g., $50,000"
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
            <Button onClick={createProject} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Create Project
            </Button>
          </div>
        </div>
      </div>
    )
  );
  
  const PerformanceModal = () => (
    showPerformanceModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Performance Review</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Employee</Label>
            <select
              value={newPerformance.employeeId}
              onChange={(e) => setNewPerformance(prev => ({ ...prev, employeeId: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            >
              <option value="">Select employee</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id.toString()}>{member.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Review Period</Label>
            <Input
              value={newPerformance.period}
              onChange={(e) => setNewPerformance(prev => ({ ...prev, period: e.target.value }))}
              placeholder="e.g., Q1 2024"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Rating (1-5)</Label>
            <input
              type="range"
              min="1"
              max="5"
              value={newPerformance.rating}
              onChange={(e) => setNewPerformance(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Rating: {newPerformance.rating}/5
            </div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Goals (one per line)</Label>
            <Textarea
              value={newPerformance.goals}
              onChange={(e) => setNewPerformance(prev => ({ ...prev, goals: e.target.value }))}
              placeholder="Goal 1&#10;Goal 2&#10;Goal 3"
              style={{ width: '100%', minHeight: '80px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Achievements (one per line)</Label>
            <Textarea
              value={newPerformance.achievements}
              onChange={(e) => setNewPerformance(prev => ({ ...prev, achievements: e.target.value }))}
              placeholder="Achievement 1&#10;Achievement 2&#10;Achievement 3"
              style={{ width: '100%', minHeight: '80px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Areas for Improvement (one per line)</Label>
            <Textarea
              value={newPerformance.areasForImprovement}
              onChange={(e) => setNewPerformance(prev => ({ ...prev, areasForImprovement: e.target.value }))}
              placeholder="Area 1&#10;Area 2&#10;Area 3"
              style={{ width: '100%', minHeight: '80px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Manager Feedback</Label>
            <Textarea
              value={newPerformance.managerFeedback}
              onChange={(e) => setNewPerformance(prev => ({ ...prev, managerFeedback: e.target.value }))}
              placeholder="Provide feedback..."
              style={{ width: '100%', minHeight: '80px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowPerformanceModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createPerformance} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Create Review
            </Button>
          </div>
        </div>
      </div>
    )
  );
  
  const ReportModal = () => (
    showReportModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Generate Report</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Report Title</Label>
            <Input
              value={newReport.title}
              onChange={(e) => setNewReport(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Report title"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Report Type</Label>
            <select
              value={newReport.type}
              onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value as Report['type'] }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annual">Annual</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Department</Label>
            <Input
              value={newReport.department}
              onChange={(e) => setNewReport(prev => ({ ...prev, department: e.target.value }))}
              placeholder="Department name"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowReportModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createReport} style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    )
  );
  
  const AssignmentModal = () => (
    showAssignmentModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Create Assignment</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Assignment Title</Label>
            <Input
              value={newAssignment.title}
              onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Assignment title"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Assignee</Label>
            <select
              value={newAssignment.assigneeId}
              onChange={(e) => setNewAssignment(prev => ({ ...prev, assigneeId: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            >
              <option value="">Select team member</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id.toString()}>{member.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Project</Label>
            <select
              value={newAssignment.projectId}
              onChange={(e) => setNewAssignment(prev => ({ ...prev, projectId: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            >
              <option value="">Select project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id.toString()}>{project.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Description</Label>
            <Textarea
              value={newAssignment.description}
              onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Assignment description"
              style={{ width: '100%', minHeight: '80px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Priority</Label>
            <select
              value={newAssignment.priority}
              onChange={(e) => setNewAssignment(prev => ({ ...prev, priority: e.target.value as Assignment['priority'] }))}
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
              value={newAssignment.dueDate}
              onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Estimated Hours</Label>
            <Input
              type="number"
              value={newAssignment.estimatedHours}
              onChange={(e) => setNewAssignment(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
              placeholder="Estimated hours"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowAssignmentModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createAssignment} style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Create Assignment
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
          <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #8b5cf6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#6b7280' }}>Loading Manager Dashboard...</p>
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
          <Button onClick={() => window.location.reload()} style={{ backgroundColor: '#8b5cf6', color: 'white' }}>
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <DashboardHeader 
        title="Manager Dashboard" 
        subtitle="Lead teams, track performance, and drive organizational success"
        role="manager"
        roleColor="#8b5cf6"
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
            Manager Hub
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
                backgroundColor: activeSection === item.id ? '#8b5cf6' : 'transparent',
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
      <TeamMemberModal />
      <ProjectModal />
      <PerformanceModal />
      <ReportModal />
      <AssignmentModal />
      
      {/* AI Assistant */}
      {aiAssistantOpen && (
        <div style={{
          position: 'fixed',
          right: '0px',
          top: '0px',
          width: isMobile ? '100%' : '400px',
          height: '100vh',
          backgroundColor: 'white',
          borderLeft: '1px solid #e5e7eb',
          boxShadow: '-4px 0 6px rgba(0, 0, 0, 0.1)',
          zIndex: 998,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>ð</span>
                Management Assistant
              </h3>
              <button onClick={() => setAiAssistantOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.25rem' }}>
                ×
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#e9d5ff', marginTop: '0.25rem' }}>Your leadership advisor</p>
          </div>
          
          <div style={{ flex: 1, padding: '1rem', overflow: 'auto', backgroundColor: '#f8fafc' }}>
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
                  backgroundColor: message.type === 'user' ? '#8b5cf6' : 'white',
                  color: message.type === 'user' ? 'white' : '#1f2937',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                  {message.content}
                </div>
              </div>
            ))}
            {aiStreaming && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ padding: '0.5rem 1rem', backgroundColor: 'white', borderRadius: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
                  AI is thinking...
                </div>
              </div>
            )}
          </div>
          
          <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Input
                placeholder="Ask about management..."
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
              <Button onClick={() => handleAiMessage(aiInput)} disabled={loading || aiStreaming} style={{ backgroundColor: '#8b5cf6', color: 'white' }}>
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
      
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

export default ManagerDashboard;

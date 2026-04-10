import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/authStore';
import DashboardHeader from '@/components/DashboardHeader';
import EnhancedSettings from '@/components/EnhancedSettings';

// Interfaces
interface JobPosting {
  id: number;
  title: string;
  description: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary: string;
  status: 'Active' | 'Closed' | 'Draft';
  applicants: number;
  postedDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  skills: string[];
  status: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Rejected' | 'Hired';
  rating: number;
  appliedDate: string;
  resume?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Interview {
  id: number;
  candidateId: number;
  candidateName: string;
  position: string;
  type: 'Phone' | 'Video' | 'On-site' | 'Technical';
  date: string;
  time: string;
  duration: string;
  interviewer: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  feedback?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

interface Pipeline {
  id: number;
  name: string;
  stage: string;
  candidates: number;
  conversionRate: number;
  avgTimeToHire: string;
  createdAt: string;
  updatedAt: string;
}

interface Application {
  id: number;
  candidateId: number;
  candidateName: string;
  jobId: number;
  jobTitle: string;
  status: 'Applied' | 'Under Review' | 'Interview' | 'Offer' | 'Rejected';
  appliedDate: string;
  resume: string;
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
}

// Storage utilities
const storage = {
  getJobPostings: (userId: string) => {
    const stored = localStorage.getItem(`job-postings-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveJobPostings: (userId: string, postings: JobPosting[]) => {
    localStorage.setItem(`job-postings-${userId}`, JSON.stringify(postings));
  },
  getCandidates: (userId: string) => {
    const stored = localStorage.getItem(`candidates-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveCandidates: (userId: string, candidates: Candidate[]) => {
    localStorage.setItem(`candidates-${userId}`, JSON.stringify(candidates));
  },
  getInterviews: (userId: string) => {
    const stored = localStorage.getItem(`interviews-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveInterviews: (userId: string, interviews: Interview[]) => {
    localStorage.setItem(`interviews-${userId}`, JSON.stringify(interviews));
  },
  getPipeline: (userId: string) => {
    const stored = localStorage.getItem(`pipeline-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  savePipeline: (userId: string, pipeline: Pipeline[]) => {
    localStorage.setItem(`pipeline-${userId}`, JSON.stringify(pipeline));
  },
  getApplications: (userId: string) => {
    const stored = localStorage.getItem(`applications-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },
  saveApplications: (userId: string, applications: Application[]) => {
    localStorage.setItem(`applications-${userId}`, JSON.stringify(applications));
  }
};

const RecruiterDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const currentUser = user || { id: 'default', email: 'recruiter@example.com', name: 'Recruiter' };
  
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
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [pipeline, setPipeline] = useState<Pipeline[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  // Modal states
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  
  // Form states
  const [newJob, setNewJob] = useState({ title: '', description: '', department: '', location: '', type: 'Full-time' as const, salary: '' });
  const [newCandidate, setNewCandidate] = useState({ name: '', email: '', phone: '', position: '', experience: '', skills: '', rating: 5 });
  const [newInterview, setNewInterview] = useState({ candidateId: '', candidateName: '', position: '', type: 'Video' as const, date: '', time: '', duration: '1 hour', interviewer: '' });
  
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
        // Load recruiter data from localStorage
        const loadedJobPostings = storage.getJobPostings(currentUser.id);
        const loadedCandidates = storage.getCandidates(currentUser.id);
        const loadedInterviews = storage.getInterviews(currentUser.id);
        const loadedPipeline = storage.getPipeline(currentUser.id);
        const loadedApplications = storage.getApplications(currentUser.id);
        
        setJobPostings(loadedJobPostings);
        setCandidates(loadedCandidates);
        setInterviews(loadedInterviews);
        setPipeline(loadedPipeline);
        setApplications(loadedApplications);
        
        // Set default data if empty
        if (loadedJobPostings.length === 0) {
          const defaultJobPostings = [
            { id: 1, title: 'Senior React Developer', description: 'Looking for experienced React developer', department: 'Engineering', location: 'Remote', type: 'Full-time' as const, salary: '$120k-$150k', status: 'Active' as const, applicants: 15, postedDate: '2024-04-01', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 2, title: 'Product Designer', description: 'Creative designer for product team', department: 'Design', location: 'New York', type: 'Full-time' as const, salary: '$90k-$120k', status: 'Active' as const, applicants: 8, postedDate: '2024-04-05', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          ];
          setJobPostings(defaultJobPostings);
          storage.saveJobPostings(currentUser.id, defaultJobPostings);
        }
        
        if (loadedCandidates.length === 0) {
          const defaultCandidates = [
            { id: 1, name: 'John Smith', email: 'john@example.com', phone: '555-0101', position: 'React Developer', experience: '5 years', skills: ['React', 'TypeScript', 'Node.js'], status: 'Screening' as const, rating: 4, appliedDate: '2024-04-02', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-0102', position: 'Product Designer', experience: '3 years', skills: ['Figma', 'Sketch', 'Adobe CC'], status: 'Interview' as const, rating: 5, appliedDate: '2024-04-03', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          ];
          setCandidates(defaultCandidates);
          storage.saveCandidates(currentUser.id, defaultCandidates);
        }
        
        if (loadedPipeline.length === 0) {
          const defaultPipeline = [
            { id: 1, name: 'Engineering Pipeline', stage: 'Interview', candidates: 12, conversionRate: 65, avgTimeToHire: '21 days', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            { id: 2, name: 'Design Pipeline', stage: 'Screening', candidates: 8, conversionRate: 72, avgTimeToHire: '18 days', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          ];
          setPipeline(defaultPipeline);
          storage.savePipeline(currentUser.id, defaultPipeline);
        }
        
      } catch (error) {
        setDataError('Failed to load recruiter dashboard data');
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
  const createJobPosting = () => {
    if (newJob.title.trim()) {
      const job = {
        id: Date.now(),
        title: newJob.title.trim(),
        description: newJob.description.trim(),
        department: newJob.department.trim(),
        location: newJob.location.trim(),
        type: newJob.type,
        salary: newJob.salary.trim(),
        status: 'Draft' as const,
        applicants: 0,
        postedDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setJobPostings(prev => [...prev, job]);
      storage.saveJobPostings(currentUser.id, [...jobPostings, job]);
      setNewJob({ title: '', description: '', department: '', location: '', type: 'Full-time', salary: '' });
      setShowJobModal(false);
    }
  };
  
  const createCandidate = () => {
    if (newCandidate.name.trim()) {
      const candidate = {
        id: Date.now(),
        name: newCandidate.name.trim(),
        email: newCandidate.email.trim(),
        phone: newCandidate.phone.trim(),
        position: newCandidate.position.trim(),
        experience: newCandidate.experience.trim(),
        skills: newCandidate.skills.split(',').map(s => s.trim()).filter(s => s),
        status: 'New' as const,
        rating: newCandidate.rating,
        appliedDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCandidates(prev => [...prev, candidate]);
      storage.saveCandidates(currentUser.id, [...candidates, candidate]);
      setNewCandidate({ name: '', email: '', phone: '', position: '', experience: '', skills: '', rating: 5 });
      setShowCandidateModal(false);
    }
  };
  
  const createInterview = () => {
    if (newInterview.candidateName.trim()) {
      const interview = {
        id: Date.now(),
        candidateId: parseInt(newInterview.candidateId) || 0,
        candidateName: newInterview.candidateName.trim(),
        position: newInterview.position.trim(),
        type: newInterview.type,
        date: newInterview.date,
        time: newInterview.time,
        duration: newInterview.duration,
        interviewer: newInterview.interviewer.trim(),
        status: 'Scheduled' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setInterviews(prev => [...prev, interview]);
      storage.saveInterviews(currentUser.id, [...interviews, interview]);
      setNewInterview({ candidateId: '', candidateName: '', position: '', type: 'Video', date: '', time: '', duration: '1 hour', interviewer: '' });
      setShowInterviewModal(false);
    }
  };
  
  const updateCandidateStatus = (candidateId: number, newStatus: Candidate['status']) => {
    const updatedCandidates = candidates.map(candidate => 
      candidate.id === candidateId ? { ...candidate, status: newStatus, updatedAt: new Date().toISOString() } : candidate
    );
    setCandidates(updatedCandidates);
    storage.saveCandidates(currentUser.id, updatedCandidates);
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
      const aiResponse = `As your recruiting assistant, I can help you with:\n\n1. Sourcing and screening candidates\n2. Writing compelling job descriptions\n3. Optimizing interview processes\n4. Analyzing hiring metrics\n5. Diversity and inclusion strategies\n6. Employer branding\n\nYour current stats: ${jobPostings.length} active postings, ${candidates.length} candidates, ${candidates.filter(c => c.status === 'Interview').length} in interviews\n\nWhat would you like to focus on?`;
      
      setAiMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
      
      setAiStreaming(false);
    }, 1500);
  };
  
  // Navigation items for Recruiter
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'ð' },
    { id: 'postings', label: 'Job Postings', icon: 'ð' },
    { id: 'candidates', label: 'Candidates', icon: 'ð' },
    { id: 'interviews', label: 'Interviews', icon: 'ð' },
    { id: 'pipeline', label: 'Pipeline', icon: 'ð' },
    { id: 'applications', label: 'Applications', icon: 'ð' },
    { id: 'settings', label: 'Settings', icon: 'â' }
  ];
  
  // Calculate stats
  const totalCandidates = candidates.length;
  const activeJobs = jobPostings.filter(j => j.status === 'Active').length;
  const scheduledInterviews = interviews.filter(i => i.status === 'Scheduled').length;
  const avgRating = candidates.length > 0 ? (candidates.reduce((sum, c) => sum + c.rating, 0) / candidates.length).toFixed(1) : '0';
  
  // Render active content based on section
  const renderActiveContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: "2px solid #ef4444" }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: "#ef4444", margin: '0 0 0.5rem 0' }}>{totalCandidates}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Total Candidates</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: "2px solid #3b82f6" }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: "#3b82f6", margin: '0 0 0.5rem 0' }}>{activeJobs}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Active Jobs</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: "2px solid #10b981" }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', margin: '0 0 0.5rem 0' }}>{scheduledInterviews}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Interviews Today</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center', border: "2px solid #f59e0b" }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', margin: '0 0 0.5rem 0' }}>{avgRating}</h3>
                <p style={{ color: '#6b7280', margin: 0 }}>Avg Rating</p>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Recent Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {candidates.slice(0, 3).map(candidate => (
                  <div key={candidate.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{candidate.name}</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{candidate.position} â¢ Applied {candidate.appliedDate}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: '0.875rem', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem',
                          backgroundColor: candidate.status === 'New' ? '#dcfce7' : candidate.status === 'Screening' ? '#fef3c7' : candidate.status === 'Interview' ? '#dbeafe' : '#e5e7eb',
                          color: candidate.status === 'New' ? '#166534' : candidate.status === 'Screening' ? '#92400e' : candidate.status === 'Interview' ? '#1e40af' : '#6b7280'
                        }}>
                          {candidate.status}
                        </span>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Rating: {candidate.rating}/5</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Pipeline Overview */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Pipeline Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {pipeline.map(pipelineItem => (
                  <div key={pipelineItem.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                    <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>{pipelineItem.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Stage: {pipelineItem.stage}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Candidates: {pipelineItem.candidates}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Conversion: {pipelineItem.conversionRate}%</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg Time: {pipelineItem.avgTimeToHire}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'postings':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Job Postings</h2>
              <Button onClick={() => setShowJobModal(true)} style={{ backgroundColor: '#3b82f6', color: 'white' }}>
                + Create Posting
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {jobPostings.map(job => (
                <div key={job.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{job.title}</h3>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      backgroundColor: job.status === 'Active' ? '#dcfce7' : job.status === 'Closed' ? '#fee2e2' : '#e5e7eb',
                      color: job.status === 'Active' ? '#166534' : job.status === 'Closed' ? '#991b1b' : '#6b7280'
                    }}>
                      {job.status}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{job.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{job.department}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#10b981' }}>{job.salary}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{job.location} â¢ {job.type}</span>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{job.applicants} applicants</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'candidates':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Candidates</h2>
              <Button onClick={() => setShowCandidateModal(true)} style={{ backgroundColor: '#10b981', color: 'white' }}>
                + Add Candidate
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {candidates.map(candidate => (
                <div key={candidate.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{candidate.name}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Rating:</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b' }}>{candidate.rating}/5</div>
                    </div>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}><strong>Position:</strong> {candidate.position}</p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}><strong>Experience:</strong> {candidate.experience}</p>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}><strong>Skills:</strong> {candidate.skills.join(', ')}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{candidate.email}</span>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Applied: {candidate.appliedDate}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select
                      value={candidate.status}
                      onChange={(e) => updateCandidateStatus(candidate.id, e.target.value as Candidate['status'])}
                      style={{ 
                        flex: 1, 
                        padding: '0.5rem', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="New">New</option>
                      <option value="Screening">Screening</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Hired">Hired</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'interviews':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Interviews</h2>
              <Button onClick={() => setShowInterviewModal(true)} style={{ backgroundColor: '#8b5cf6', color: 'white' }}>
                + Schedule Interview
              </Button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {interviews.map(interview => (
                <div key={interview.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{interview.candidateName}</h3>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem',
                      backgroundColor: interview.status === 'Scheduled' ? '#dcfce7' : interview.status === 'Completed' ? '#dbeafe' : '#fee2e2',
                      color: interview.status === 'Scheduled' ? '#166534' : interview.status === 'Completed' ? '#1e40af' : '#991b1b'
                    }}>
                      {interview.status}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}><strong>Position:</strong> {interview.position}</p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}><strong>Type:</strong> {interview.type}</p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}><strong>Date:</strong> {interview.date}</p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}><strong>Time:</strong> {interview.time} ({interview.duration})</p>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}><strong>Interviewer:</strong> {interview.interviewer}</p>
                  {interview.feedback && (
                    <div style={{ padding: '0.5rem', backgroundColor: '#f9fafb', borderRadius: '0.25rem', marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}><strong>Feedback:</strong> {interview.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'pipeline':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>Hiring Pipeline</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {pipeline.map(pipelineItem => (
                <div key={pipelineItem.id} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>{pipelineItem.name}</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', margin: '0 0 0.25rem 0' }}>{pipelineItem.candidates}</h4>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Active Candidates</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981', margin: '0 0 0.25rem 0' }}>{pipelineItem.conversionRate}%</h4>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Conversion Rate</p>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}><strong>Current Stage:</strong> {pipelineItem.stage}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}><strong>Avg Time to Hire:</strong> {pipelineItem.avgTimeToHire}</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#3b82f6', height: '100%', width: `${pipelineItem.conversionRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'applications':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>Applications</h2>
            
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {candidates.map(candidate => (
                  <div key={candidate.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>{candidate.name}</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{candidate.position}</p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Applied: {candidate.appliedDate}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: '0.875rem', 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem',
                          backgroundColor: candidate.status === 'New' ? '#dcfce7' : candidate.status === 'Screening' ? '#fef3c7' : candidate.status === 'Interview' ? '#dbeafe' : '#e5e7eb',
                          color: candidate.status === 'New' ? '#166534' : candidate.status === 'Screening' ? '#92400e' : candidate.status === 'Interview' ? '#1e40af' : '#6b7280'
                        }}>
                          {candidate.status}
                        </span>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Rating: {candidate.rating}/5</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
  const JobModal = () => (
    showJobModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Create Job Posting</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Job Title</Label>
            <Input
              value={newJob.title}
              onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter job title"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Description</Label>
            <Textarea
              value={newJob.description}
              onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the role"
              style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Department</Label>
            <Input
              value={newJob.department}
              onChange={(e) => setNewJob(prev => ({ ...prev, department: e.target.value }))}
              placeholder="e.g., Engineering, Design"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Location</Label>
            <Input
              value={newJob.location}
              onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Remote, New York, San Francisco"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Job Type</Label>
            <select
              value={newJob.type}
              onChange={(e) => setNewJob(prev => ({ ...prev, type: e.target.value as JobPosting['type'] }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Salary Range</Label>
            <Input
              value={newJob.salary}
              onChange={(e) => setNewJob(prev => ({ ...prev, salary: e.target.value }))}
              placeholder="e.g., $80k-$120k"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowJobModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createJobPosting} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Create Posting
            </Button>
          </div>
        </div>
      </div>
    )
  );
  
  const CandidateModal = () => (
    showCandidateModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Add Candidate</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Name</Label>
            <Input
              value={newCandidate.name}
              onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Candidate name"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Email</Label>
            <Input
              type="email"
              value={newCandidate.email}
              onChange={(e) => setNewCandidate(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@example.com"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Phone</Label>
            <Input
              value={newCandidate.phone}
              onChange={(e) => setNewCandidate(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="555-123-4567"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Position</Label>
            <Input
              value={newCandidate.position}
              onChange={(e) => setNewCandidate(prev => ({ ...prev, position: e.target.value }))}
              placeholder="Applied position"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Experience</Label>
            <Input
              value={newCandidate.experience}
              onChange={(e) => setNewCandidate(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="e.g., 5 years"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Skills (comma-separated)</Label>
            <Input
              value={newCandidate.skills}
              onChange={(e) => setNewCandidate(prev => ({ ...prev, skills: e.target.value }))}
              placeholder="React, TypeScript, Node.js"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Rating (1-5)</Label>
            <input
              type="range"
              min="1"
              max="5"
              value={newCandidate.rating}
              onChange={(e) => setNewCandidate(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Rating: {newCandidate.rating}/5
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowCandidateModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createCandidate} style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Add Candidate
            </Button>
          </div>
        </div>
      </div>
    )
  );
  
  const InterviewModal = () => (
    showInterviewModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>Schedule Interview</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Candidate</Label>
            <select
              value={newInterview.candidateId}
              onChange={(e) => {
                const candidate = candidates.find(c => c.id.toString() === e.target.value);
                setNewInterview(prev => ({ 
                  ...prev, 
                  candidateId: e.target.value, 
                  candidateName: candidate?.name || '',
                  position: candidate?.position || ''
                }));
              }}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            >
              <option value="">Select a candidate</option>
              {candidates.map(candidate => (
                <option key={candidate.id} value={candidate.id.toString()}>{candidate.name}</option>
              ))}
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Position</Label>
            <Input
              value={newInterview.position}
              onChange={(e) => setNewInterview(prev => ({ ...prev, position: e.target.value }))}
              placeholder="Interview position"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Interview Type</Label>
            <select
              value={newInterview.type}
              onChange={(e) => setNewInterview(prev => ({ ...prev, type: e.target.value as Interview['type'] }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            >
              <option value="Phone">Phone</option>
              <option value="Video">Video</option>
              <option value="On-site">On-site</option>
              <option value="Technical">Technical</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Date</Label>
            <Input
              type="date"
              value={newInterview.date}
              onChange={(e) => setNewInterview(prev => ({ ...prev, date: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Time</Label>
            <Input
              type="time"
              value={newInterview.time}
              onChange={(e) => setNewInterview(prev => ({ ...prev, time: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Duration</Label>
            <Input
              value={newInterview.duration}
              onChange={(e) => setNewInterview(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 1 hour, 30 minutes"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Interviewer</Label>
            <Input
              value={newInterview.interviewer}
              onChange={(e) => setNewInterview(prev => ({ ...prev, interviewer: e.target.value }))}
              placeholder="Interviewer name"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={() => setShowInterviewModal(false)} style={{ backgroundColor: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Cancel
            </Button>
            <Button onClick={createInterview} style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem' }}>
              Schedule Interview
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
          <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #ef4444', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#6b7280' }}>Loading Recruiter Dashboard...</p>
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
          <Button onClick={() => window.location.reload()} style={{ backgroundColor: '#ef4444', color: 'white' }}>
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <DashboardHeader 
        title="Recruiter Dashboard" 
        subtitle="Source, screen, and hire the best talent for your team"
        role="recruiter"
        roleColor="#ef4444"
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
            Recruiter Hub
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
                backgroundColor: activeSection === item.id ? '#ef4444' : 'transparent',
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
      <JobModal />
      <CandidateModal />
      <InterviewModal />
      
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
          <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>ð</span>
                Recruiting Assistant
              </h3>
              <button onClick={() => setAiAssistantOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.25rem' }}>
                ×
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#fecaca', marginTop: '0.25rem' }}>Your talent acquisition partner</p>
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
                  backgroundColor: message.type === 'user' ? '#ef4444' : 'white',
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
                placeholder="Ask about recruiting..."
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
              <Button onClick={() => handleAiMessage(aiInput)} disabled={loading || aiStreaming} style={{ backgroundColor: '#ef4444', color: 'white' }}>
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
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
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

export default RecruiterDashboard;

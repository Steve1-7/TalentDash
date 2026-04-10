import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Mock AI API
const mockAIApi = {
  generateCodeReview: async (code: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Code Review for ${code.substring(0, 50)}...\n\n1. Good variable naming\n2. Consider adding error handling\n3. Code is well-structured\n4. Add comments for complex logic`);
      }, 1500);
    });
  },
  generateMarketInsights: async (skill: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Market Insights for ${skill}:\n\n- High demand in current market\n- Average salary: $85,000 - $120,000\n- Growth rate: 25% YoY\n- Top companies hiring: Google, Microsoft, Amazon`);
      }, 1500);
    });
  },
  generateCandidateMatch: async (jobDescription: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Top 3 Candidates:\n\n1. John Doe - React Expert (95% match)\n2. Jane Smith - Full Stack (88% match)\n3. Mike Johnson - Frontend (82% match)`);
      }, 1500);
    });
  },
  generateTeamInsights: async (teamData: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Team Performance Insights:\n\n- Overall productivity: 87%\n- Team collaboration: Excellent\n- Areas for improvement: Code reviews\n- Recommended training: Advanced React`);
      }, 1500);
    });
  }
};

// Mock Database
const mockDatabase = {
  projects: [
    { id: 1, name: 'Portfolio Website', status: 'In Progress', progress: 75, role: 'developer' },
    { id: 2, name: 'E-commerce Platform', status: 'Planning', progress: 25, role: 'freelancer' },
    { id: 3, name: 'Mobile App', status: 'Development', progress: 60, role: 'developer' },
  ],
  tasks: [
    { id: 1, title: 'Complete homepage design', project: 'Portfolio Website', priority: 'High', completed: false, role: 'developer' },
    { id: 2, title: 'Setup database schema', project: 'Mobile App', priority: 'Medium', completed: false, role: 'developer' },
    { id: 3, title: 'Client meeting preparation', project: 'E-commerce Platform', priority: 'High', completed: false, role: 'freelancer' },
  ],
  skills: [
    { name: 'React', level: 90, category: 'frontend' },
    { name: 'TypeScript', level: 85, category: 'language' },
    { name: 'Node.js', level: 75, category: 'backend' },
    { name: 'Python', level: 70, category: 'language' },
  ],
  gigs: [
    { id: 1, title: 'React Developer Needed', budget: '$5000', deadline: '2024-02-15', status: 'Open', role: 'freelancer' },
    { id: 2, title: 'Full Stack Project', budget: '$8000', deadline: '2024-03-01', status: 'Applied', role: 'freelancer' },
  ],
  candidates: [
    { id: 1, name: 'John Doe', skills: 'React, TypeScript, Node.js', experience: '5 years', status: 'Screening', role: 'recruiter' },
    { id: 2, name: 'Jane Smith', skills: 'Python, Django, PostgreSQL', experience: '3 years', status: 'Interview', role: 'recruiter' },
  ],
  teamMembers: [
    { id: 1, name: 'Alice Johnson', role: 'Senior Developer', productivity: 92, tasks: 8, role: 'manager' },
    { id: 2, name: 'Bob Wilson', role: 'Frontend Developer', productivity: 85, tasks: 6, role: 'manager' },
  ]
};

export default function DashboardPage() {
  console.log('FULLY RESPONSIVE DASHBOARD - DEBUG CHECK');
  
  const [activeRole, setActiveRole] = useState('developer');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // State management
  const [projects, setProjects] = useState(mockDatabase.projects);
  const [tasks, setTasks] = useState(mockDatabase.tasks);
  const [skills, setSkills] = useState(mockDatabase.skills);
  const [gigs, setGigs] = useState(mockDatabase.gigs);
  const [candidates, setCandidates] = useState(mockDatabase.candidates);
  const [teamMembers, setTeamMembers] = useState(mockDatabase.teamMembers);
  
  // Form states
  const [newProjectName, setNewProjectName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('');
  const [codeReviewInput, setCodeReviewInput] = useState('');
  const [marketInsightInput, setMarketInsightInput] = useState('');
  const [candidateSearchInput, setCandidateSearchInput] = useState('');
  const [teamAnalysisInput, setTeamAnalysisInput] = useState('');

  // AI Functions
  const handleCodeReview = async () => {
    setLoading(true);
    try {
      const response = await mockAIApi.generateCodeReview(codeReviewInput);
      setAiResponse(response as string);
    } catch (error) {
      setAiResponse('Error generating code review');
    }
    setLoading(false);
  };

  const handleMarketInsights = async () => {
    setLoading(true);
    try {
      const response = await mockAIApi.generateMarketInsights(marketInsightInput);
      setAiResponse(response as string);
    } catch (error) {
      setAiResponse('Error generating market insights');
    }
    setLoading(false);
  };

  const handleCandidateSearch = async () => {
    setLoading(true);
    try {
      const response = await mockAIApi.generateCandidateMatch(candidateSearchInput);
      setAiResponse(response as string);
    } catch (error) {
      setAiResponse('Error searching candidates');
    }
    setLoading(false);
  };

  const handleTeamAnalysis = async () => {
    setLoading(true);
    try {
      const response = await mockAIApi.generateTeamInsights(teamAnalysisInput);
      setAiResponse(response as string);
    } catch (error) {
      setAiResponse('Error analyzing team');
    }
    setLoading(false);
  };

  // CRUD Functions
  const addProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: projects.length + 1,
        name: newProjectName,
        status: 'New',
        progress: 0,
        role: activeRole
      };
      setProjects([...projects, newProject]);
      setNewProjectName('');
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
        role: activeRole
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
        category: 'general'
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

  const applyForGig = (gigId: number) => {
    setGigs(gigs.map(gig => 
      gig.id === gigId ? { ...gig, status: 'Applied' } : gig
    ));
  };

  const updateCandidateStatus = (candidateId: number, status: string) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId ? { ...candidate, status } : candidate
    ));
  };

  const updateTeamMemberProductivity = (memberId: number, productivity: number) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === memberId ? { ...member, productivity } : member
    ));
  };

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

  const renderRoleSpecificContent = () => {
    switch (activeRole) {
      case 'developer':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* AI Code Review */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>ð AI Code Review</h3>
              <Textarea
                placeholder="Paste your code here for AI review..."
                value={codeReviewInput}
                onChange={(e) => setCodeReviewInput(e.target.value)}
                style={{ marginBottom: '1rem', minHeight: '120px', width: '100%' }}
              />
              <Button onClick={handleCodeReview} disabled={loading} style={{ backgroundColor: '#16a34a', color: 'white', width: '100%', padding: '0.75rem' }}>
                {loading ? 'Analyzing...' : 'Get AI Review'}
              </Button>
              {aiResponse && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                  {aiResponse}
                </div>
              )}
            </div>

            {/* AI Market Insights */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>ð AI Market Insights</h3>
              <Input
                placeholder="Enter a skill or technology..."
                value={marketInsightInput}
                onChange={(e) => setMarketInsightInput(e.target.value)}
                style={{ marginBottom: '1rem', width: '100%' }}
              />
              <Button onClick={handleMarketInsights} disabled={loading} style={{ backgroundColor: '#16a34a', color: 'white', width: '100%', padding: '0.75rem' }}>
                {loading ? 'Analyzing...' : 'Get Market Insights'}
              </Button>
              {aiResponse && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                  {aiResponse}
                </div>
              )}
            </div>
          </div>
        );

      case 'freelancer':
        return (
          <div style={{ marginBottom: '2rem' }}>
            {/* Gigs Section */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>ð Available Gigs</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {gigs.map(gig => (
                  <div key={gig.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb', transition: 'all 0.2s', cursor: 'pointer' }}>
                    <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>{gig.title}</h4>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Budget: {gig.budget}</p>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Deadline: {gig.deadline}</p>
                    <p style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', backgroundColor: gig.status === 'Open' ? '#dcfce7' : '#fef3c7', color: gig.status === 'Open' ? '#166534' : '#92400e', display: 'inline-block', marginBottom: '0.5rem' }}>
                      {gig.status}
                    </p>
                    {gig.status === 'Open' && (
                      <Button onClick={() => applyForGig(gig.id)} style={{ backgroundColor: '#16a34a', color: 'white', width: '100%', padding: '0.5rem' }}>
                        Apply Now
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings Overview */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>ð Earnings Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', transition: 'all 0.2s' }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>$12,500</h4>
                  <p style={{ color: '#6b7280' }}>This Month</p>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', transition: 'all 0.2s' }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>$45,000</h4>
                  <p style={{ color: '#6b7280' }}>This Year</p>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', transition: 'all 0.2s' }}>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>8</h4>
                  <p style={{ color: '#6b7280' }}>Active Projects</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'recruiter':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* AI Candidate Matching */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>ð AI Candidate Matching</h3>
              <Textarea
                placeholder="Enter job description..."
                value={candidateSearchInput}
                onChange={(e) => setCandidateSearchInput(e.target.value)}
                style={{ marginBottom: '1rem', minHeight: '120px', width: '100%' }}
              />
              <Button onClick={handleCandidateSearch} disabled={loading} style={{ backgroundColor: '#16a34a', color: 'white', width: '100%', padding: '0.75rem' }}>
                {loading ? 'Searching...' : 'Find Candidates'}
              </Button>
              {aiResponse && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                  {aiResponse}
                </div>
              )}
            </div>

            {/* Candidate Pipeline */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>ð Candidate Pipeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {candidates.map(candidate => (
                  <div key={candidate.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{candidate.name}</h4>
                      <select 
                        value={candidate.status} 
                        onChange={(e) => updateCandidateStatus(candidate.id, e.target.value)}
                        style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: 'white', cursor: 'pointer' }}
                      >
                        <option value="Screening">Screening</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Skills: {candidate.skills}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Experience: {candidate.experience}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'manager':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* AI Team Analysis */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>ð AI Team Analysis</h3>
              <Textarea
                placeholder="Enter team data or challenges..."
                value={teamAnalysisInput}
                onChange={(e) => setTeamAnalysisInput(e.target.value)}
                style={{ marginBottom: '1rem', minHeight: '120px', width: '100%' }}
              />
              <Button onClick={handleTeamAnalysis} disabled={loading} style={{ backgroundColor: '#16a34a', color: 'white', width: '100%', padding: '0.75rem' }}>
                {loading ? 'Analyzing...' : 'Analyze Team'}
              </Button>
              {aiResponse && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                  {aiResponse}
                </div>
              )}
            </div>

            {/* Team Performance */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>ð Team Performance</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {teamMembers.map(member => (
                  <div key={member.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{member.name}</h4>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', backgroundColor: '#dcfce7', color: '#166534' }}>
                        {member.productivity}% Productivity
                      </span>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Role: {member.role}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Active Tasks: {member.tasks}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Label style={{ fontSize: '0.875rem' }}>Update:</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={member.productivity}
                        onChange={(e) => updateTeamMemberProductivity(member.id, parseInt(e.target.value))}
                        style={{ width: '80px' }}
                      />
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', fontFamily: 'Arial, sans-serif', display: 'flex' }}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
          padding: '0.5rem',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          display: window.innerWidth <= 768 ? 'block' : 'none'
        }}
      >
        â¡ Menu
      </button>

      {/* Sidebar */}
      <div style={{ 
        width: sidebarOpen ? '250px' : '0px',
        backgroundColor: 'white', 
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'fixed',
        height: '100vh',
        zIndex: 999,
        overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>PromptlyOS</h1>
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
                  borderRadius: '0.5rem',
                  backgroundColor: activeSection === item.section && isAvailable ? '#dcfce7' : 'transparent',
                  color: isAvailable ? (activeSection === item.section ? '#166534' : '#6b7280') : '#d1d5db',
                  textAlign: 'left',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: activeSection === item.section && isAvailable ? '600' : '400',
                  opacity: isAvailable ? 1 : 0.5,
                  transition: 'all 0.2s',
                  ':hover': {
                    backgroundColor: isAvailable ? '#f0fdf4' : 'transparent'
                  }
                }}
                onMouseEnter={(e) => {
                  if (isAvailable) {
                    e.currentTarget.style.backgroundColor = '#f0fdf4';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.section) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                {item.label}
                {!isAvailable && <span style={{ fontSize: '0.75rem', marginLeft: 'auto' }}>ð</span>}
              </button>
            );
          })}
        </nav>
        
        {/* User Profile */}
        <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#166534',
              fontWeight: 'bold'
            }}>
              {activeRole.charAt(0).toUpperCase() + activeRole.charAt(1)}
            </div>
            <div>
              <p style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} User
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? '250px' : '0px', transition: 'margin-left 0.3s ease' }}>
        {/* Top Navigation */}
        <header style={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Dashboard
            </p>
          </div>
          
          {/* Role Switcher and Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Role Switcher */}
            <div style={{ position: 'relative' }}>
              <select 
                value={activeRole} 
                onChange={(e) => setActiveRole(e.target.value)}
                style={{ 
                  padding: '0.5rem 2rem 0.5rem 1rem', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '0.5rem',
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
            </div>

            {/* Notifications Button */}
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              style={{ 
                padding: '0.5rem 1rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.5rem',
                backgroundColor: notificationsOpen ? '#f0fdf4' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                ':hover': {
                  backgroundColor: '#f0fdf4'
                }
              }}
              onMouseEnter={(e) => {
                if (!notificationsOpen) e.currentTarget.style.backgroundColor = '#f0fdf4';
              }}
              onMouseLeave={(e) => {
                if (!notificationsOpen) e.currentTarget.style.backgroundColor = 'white';
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
                fontWeight: 'bold'
              }}>
                3
              </span>
            </button>

            {/* Settings Button */}
            <button 
              onClick={() => setSettingsOpen(!settingsOpen)}
              style={{ 
                padding: '0.5rem 1rem', 
                border: '1px solid #e5e7eb', 
                borderRadius: '0.5rem',
                backgroundColor: settingsOpen ? '#f0fdf4' : 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
                ':hover': {
                  backgroundColor: '#f0fdf4'
                }
              }}
              onMouseEnter={(e) => {
                if (!settingsOpen) e.currentTarget.style.backgroundColor = '#f0fdf4';
              }}
              onMouseLeave={(e) => {
                if (!settingsOpen) e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>â</span>
              <span>Settings</span>
            </button>
          </div>
        </header>

        {/* Notifications Dropdown */}
        {notificationsOpen && (
          <div style={{
            position: 'absolute',
            top: '4rem',
            right: '2rem',
            width: '300px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            maxHeight: '400px',
            overflow: 'auto'
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600', color: '#1f2937' }}>
              Notifications
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <p style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>New project assigned</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>2 hours ago</p>
              </div>
              <div style={{ padding: '0.75rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <p style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>Task completed by team member</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>5 hours ago</p>
              </div>
              <div style={{ padding: '0.75rem 0' }}>
                <p style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>Weekly report ready</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Yesterday</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Dropdown */}
        {settingsOpen && (
          <div style={{
            position: 'absolute',
            top: '4rem',
            right: '2rem',
            width: '250px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000
          }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontWeight: '600', color: '#1f2937' }}>
              Settings
            </div>
            <div style={{ padding: '0.5rem 0' }}>
              <button style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                border: 'none', 
                backgroundColor: 'transparent', 
                textAlign: 'left', 
                cursor: 'pointer',
                ':hover': { backgroundColor: '#f9fafb' }
              }}>
                Profile Settings
              </button>
              <button style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                border: 'none', 
                backgroundColor: 'transparent', 
                textAlign: 'left', 
                cursor: 'pointer',
                ':hover': { backgroundColor: '#f9fafb' }
              }}>
                Preferences
              </button>
              <button style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                border: 'none', 
                backgroundColor: 'transparent', 
                textAlign: 'left', 
                cursor: 'pointer',
                ':hover': { backgroundColor: '#f9fafb' }
              }}>
                Security
              </button>
              <button style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                border: 'none', 
                backgroundColor: 'transparent', 
                textAlign: 'left', 
                cursor: 'pointer',
                ':hover': { backgroundColor: '#f9fafb' }
              }}>
                Help & Support
              </button>
              <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0.5rem 0' }} />
              <button style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                border: 'none', 
                backgroundColor: 'transparent', 
                textAlign: 'left', 
                cursor: 'pointer',
                color: '#ef4444',
                ':hover': { backgroundColor: '#fef2f2' }
              }}>
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '2px solid #16a34a', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.25rem' }}>
                {projects.filter(p => p.role === activeRole).length}
              </h3>
              <p style={{ color: '#6b7280' }}>Active Projects</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '2px solid #16a34a', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.25rem' }}>
                {tasks.filter(t => t.role === activeRole && !t.completed).length}
              </h3>
              <p style={{ color: '#6b7280' }}>Pending Tasks</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '2px solid #16a34a', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.25rem' }}>
                {skills.length}
              </h3>
              <p style={{ color: '#6b7280' }}>Skills Tracked</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '2px solid #16a34a', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.25rem' }}>
                {Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length)}%
              </h3>
              <p style={{ color: '#6b7280' }}>Avg Skill Level</p>
            </div>
          </div>

          {/* Role-Specific Content */}
          {renderRoleSpecificContent()}

          {/* Common Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* Projects Section */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>ð Projects</h3>
              
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
                  <div key={project.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb', transition: 'all 0.2s', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{project.name}</h4>
                      <span style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', backgroundColor: '#dcfce7', color: '#16a34a' }}>
                        {project.status}
                      </span>
                    </div>
                    <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#16a34a', height: '100%', width: `${project.progress}%` }} />
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>{project.progress}% complete</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Section */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>â Tasks</h3>
              
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
                        <p style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>{task.title}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{task.project}</p>
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

          {/* Skills Section */}
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>ð Skills</h3>
            
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {skills.map((skill, index) => (
                <div key={index} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb', transition: 'all 0.2s', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{skill.name}</h4>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#16a34a' }}>{skill.level}%</span>
                  </div>
                  <div style={{ backgroundColor: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ backgroundColor: '#16a34a', height: '100%', width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>ð Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', borderLeft: '4px solid #16a34a', backgroundColor: '#f0fdf4', borderRadius: '0.25rem', transition: 'all 0.2s' }}>
                <p style={{ fontWeight: '500', color: '#1f2937' }}>Completed task: "Write API documentation"</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>2 hours ago</p>
              </div>
              <div style={{ padding: '0.75rem', borderLeft: '4px solid #16a34a', backgroundColor: '#f0fdf4', borderRadius: '0.25rem', transition: 'all 0.2s' }}>
                <p style={{ fontWeight: '500', color: '#1f2937' }}>Updated project: "Portfolio Website" progress to 75%</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>5 hours ago</p>
              </div>
              <div style={{ padding: '0.75rem', borderLeft: '4px solid #16a34a', backgroundColor: '#f0fdf4', borderRadius: '0.25rem', transition: 'all 0.2s' }}>
                <p style={{ fontWeight: '500', color: '#1f2937' }}>Added new skill: "Python" at 70% level</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Yesterday</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

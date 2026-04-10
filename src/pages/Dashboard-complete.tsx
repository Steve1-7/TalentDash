import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function DashboardPage() {
  console.log('COMPLETE DASHBOARD PAGE RENDERING - DEBUG CHECK');
  
  const [projects, setProjects] = useState([
    { id: 1, name: 'Portfolio Website', status: 'In Progress', progress: 75 },
    { id: 2, name: 'Mobile App', status: 'Planning', progress: 25 },
  ]);
  
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete homepage design', project: 'Portfolio Website', priority: 'High', completed: false },
    { id: 2, title: 'Setup database schema', project: 'Mobile App', priority: 'Medium', completed: false },
    { id: 3, title: 'Write API documentation', project: 'Portfolio Website', priority: 'Low', completed: true },
  ]);
  
  const [skills, setSkills] = useState([
    { name: 'React', level: 90 },
    { name: 'TypeScript', level: 85 },
    { name: 'Node.js', level: 75 },
    { name: 'Python', level: 70 },
  ]);
  
  const [newProjectName, setNewProjectName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('');

  const addProject = () => {
    if (newProjectName.trim()) {
      setProjects([...projects, {
        id: projects.length + 1,
        name: newProjectName,
        status: 'New',
        progress: 0
      }]);
      setNewProjectName('');
    }
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([...tasks, {
        id: tasks.length + 1,
        title: newTaskTitle,
        project: projects[0]?.name || 'General',
        priority: 'Medium',
        completed: false
      }]);
      setNewTaskTitle('');
    }
  };

  const addSkill = () => {
    if (newSkillName.trim() && newSkillLevel) {
      setSkills([...skills, {
        name: newSkillName,
        level: parseInt(newSkillLevel)
      }]);
      setNewSkillName('');
      setNewSkillLevel('');
    }
  };

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const sidebarItems = [
    { icon: 'ð', label: 'Dashboard', active: true },
    { icon: 'ð', label: 'Projects', active: false },
    { icon: 'â', label: 'Tasks', active: false },
    { icon: 'ð', label: 'Skills', active: false },
    { icon: 'ð', label: 'Learning', active: false },
    { icon: 'ð', label: 'Applications', active: false },
    { icon: 'ð', label: 'Gigs', active: false },
    { icon: 'ð', label: 'Clients', active: false },
    { icon: 'ð', label: 'Earnings', active: false },
    { icon: 'ð', label: 'Proposals', active: false },
    { icon: 'ð', label: 'Pipeline', active: false },
    { icon: 'â', label: 'Settings', active: false },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', fontFamily: 'Arial, sans-serif', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '250px', 
        backgroundColor: 'white', 
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>PromptlyOS</h1>
        </div>
        
        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1rem' }}>
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                marginBottom: '0.25rem',
                border: 'none',
                borderRadius: '0.5rem',
                backgroundColor: item.active ? '#dcfce7' : 'transparent',
                color: item.active ? '#166534' : '#6b7280',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: item.active ? '600' : '400'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
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
              JD
            </div>
            <div>
              <p style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>John Doe</p>
              <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>Developer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Navigation */}
        <header style={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>Dashboard</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Welcome back! Here's your career overview.</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ 
              padding: '0.5rem 1rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}>
              ð Notifications
            </button>
            <button style={{ 
              padding: '0.5rem 1rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}>
              â Settings
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '2px solid #16a34a', textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.25rem' }}>{projects.length}</h3>
              <p style={{ color: '#6b7280' }}>Active Projects</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '2px solid #16a34a', textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.25rem' }}>{tasks.filter(t => !t.completed).length}</h3>
              <p style={{ color: '#6b7280' }}>Pending Tasks</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '2px solid #16a34a', textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.25rem' }}>{skills.length}</h3>
              <p style={{ color: '#6b7280' }}>Skills Tracked</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '2px solid #16a34a', textAlign: 'center' }}>
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.25rem' }}>{Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length)}%</h3>
              <p style={{ color: '#6b7280' }}>Avg Skill Level</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            {/* Projects Section */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>Projects</h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Input
                    placeholder="New project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Button onClick={addProject} style={{ backgroundColor: '#16a34a', color: 'white' }}>Add</Button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {projects.map(project => (
                  <div key={project.id} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
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
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>Tasks</h2>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Input
                    placeholder="New task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Button onClick={addTask} style={{ backgroundColor: '#16a34a', color: 'white' }}>Add</Button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {tasks.map(task => (
                  <div key={task.id} style={{ 
                    padding: '0.75rem', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '0.5rem', 
                    backgroundColor: task.completed ? '#f0fdf4' : '#f9fafb',
                    textDecoration: task.completed ? 'line-through' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        style={{ cursor: 'pointer' }}
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>Skills</h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <Input
                  placeholder="Skill name"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  style={{ flex: 1 }}
                />
                <Input
                  placeholder="Level (0-100)"
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  style={{ width: '120px' }}
                />
                <Button onClick={addSkill} style={{ backgroundColor: '#16a34a', color: 'white' }}>Add</Button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {skills.map((skill, index) => (
                <div key={index} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#166534' }}>Recent Activity</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', borderLeft: '4px solid #16a34a', backgroundColor: '#f0fdf4' }}>
                <p style={{ fontWeight: '500', color: '#1f2937' }}>Completed task: "Write API documentation"</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>2 hours ago</p>
              </div>
              <div style={{ padding: '0.75rem', borderLeft: '4px solid #16a34a', backgroundColor: '#f0fdf4' }}>
                <p style={{ fontWeight: '500', color: '#1f2937' }}>Updated project: "Portfolio Website" progress to 75%</p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>5 hours ago</p>
              </div>
              <div style={{ padding: '0.75rem', borderLeft: '4px solid #16a34a', backgroundColor: '#f0fdf4' }}>
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

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function DashboardPage() {
  console.log('ENHANCED DASHBOARD PAGE RENDERING - DEBUG CHECK');
  
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', fontFamily: 'Arial, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#166534' }}>Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Welcome back! Here's your career overview.</p>
        </div>

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
      </div>
    </div>
  );
}

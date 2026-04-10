// Add sample project to fix display issue
const sampleProject = {
  id: crypto.randomUUID(),
  name: 'Sample Project',
  description: 'This is a sample project to demonstrate the dashboard functionality',
  status: 'active',
  tags: ['react', 'typescript', 'frontend'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Get existing projects
let existingProjects = [];
try {
  const stored = localStorage.getItem('promptlyos-projects');
  if (stored) {
    existingProjects = JSON.parse(stored);
  }
} catch (e) {
  console.error('Error reading projects:', e);
}

// Add sample project if no projects exist
if (existingProjects.length === 0) {
  existingProjects.push(sampleProject);
  localStorage.setItem('promptlyos-projects', JSON.stringify(existingProjects));
  console.log('Sample project added to fix display issue');
} else {
  console.log('Projects already exist:', existingProjects.length);
}

console.log('Projects store now contains:', existingProjects.length, 'projects');

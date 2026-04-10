// Quick fix to add sample project to localStorage
localStorage.setItem('promptlyos-projects', JSON.stringify([
  {
    id: crypto.randomUUID(),
    name: 'Sample Project',
    description: 'This is a sample project to demonstrate the dashboard',
    status: 'active',
    tags: ['react', 'typescript', 'frontend'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]));

console.log('Sample project added to localStorage');

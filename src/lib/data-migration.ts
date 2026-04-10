// Data migration script for PromptlyOS
// Migrates data from old "talentdash-" keys to new "promptlyos-" keys

export const migrateFromTalentDash = () => {
  console.log('Starting data migration from TalentDash to PromptlyOS...');
  
  try {
    // Migrate projects
    const oldProjects = localStorage.getItem('talentdash-projects');
    if (oldProjects) {
      localStorage.setItem('promptlyos-projects', oldProjects);
      localStorage.removeItem('talentdash-projects');
      console.log('Migrated projects data');
    }
    
    // Migrate auth
    const oldAuth = localStorage.getItem('talentdash-auth');
    if (oldAuth) {
      localStorage.setItem('promptlyos-auth', oldAuth);
      localStorage.removeItem('talentdash-auth');
      console.log('Migrated auth data');
    }
    
    // Migrate applications
    const oldApplications = localStorage.getItem('talentdash-applications');
    if (oldApplications) {
      localStorage.setItem('promptlyos-applications', oldApplications);
      localStorage.removeItem('talentdash-applications');
      console.log('Migrated applications data');
    }
    
    // Migrate freelance
    const oldFreelance = localStorage.getItem('talentdash-freelance');
    if (oldFreelance) {
      localStorage.setItem('promptlyos-freelance', oldFreelance);
      localStorage.removeItem('talentdash-freelance');
      console.log('Migrated freelance data');
    }
    
    // Migrate recruiter
    const oldRecruiter = localStorage.getItem('talentdash-recruiter');
    if (oldRecruiter) {
      localStorage.setItem('promptlyos-recruiter', oldRecruiter);
      localStorage.removeItem('talentdash-recruiter');
      console.log('Migrated recruiter data');
    }
    
    // Migrate tasks
    const oldTasks = localStorage.getItem('talentdash-tasks');
    if (oldTasks) {
      localStorage.setItem('promptlyos-tasks', oldTasks);
      localStorage.removeItem('talentdash-tasks');
      console.log('Migrated tasks data');
    }
    
    // Migrate learning
    const oldLearning = localStorage.getItem('talentdash-learning');
    if (oldLearning) {
      localStorage.setItem('promptlyos-learning', oldLearning);
      localStorage.removeItem('talentdash-learning');
      console.log('Migrated learning data');
    }
    
    // Migrate global metrics
    const oldMetrics = localStorage.getItem('talentdash-globalMetrics');
    if (oldMetrics) {
      localStorage.setItem('promptlyos-globalMetrics', oldMetrics);
      localStorage.removeItem('talentdash-globalMetrics');
      console.log('Migrated global metrics data');
    }
    
    console.log('Data migration completed successfully!');
    
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

// Auto-run migration on import
if (typeof window !== 'undefined') {
  migrateFromTalentDash();
}

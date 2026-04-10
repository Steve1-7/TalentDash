// Mock API handler for /api/settings endpoint
export const mockSettingsAPI = {
  // GET /api/settings
  get: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          profile: {
            name: 'Steve',
            email: 'steve@example.com',
            bio: 'Senior Full-Stack Engineer',
            location: 'San Francisco',
            website: 'https://steve.dev',
            github: 'github.com/steve',
            linkedin: 'linkedin.com/in/steve'
          },
          preferences: {
            theme: 'light',
            language: 'en',
            notifications: true,
            emailAlerts: true,
            aiSuggestions: true,
            autoSave: true,
            compactMode: false
          },
          security: {
            twoFactorEnabled: false,
            lastPasswordChange: '2024-01-15',
            activeSessions: [
              { id: 1, device: 'Chrome on Windows', lastActive: '2024-04-09T09:14:00Z', ip: '192.168.1.1' },
              { id: 2, device: 'Mobile App', lastActive: '2024-04-09T08:30:00Z', ip: '192.168.1.2' }
            ]
          }
        });
      }, 100);
    });
  },

  // PATCH /api/settings
  update: async (section: string, data: Record<string, unknown>) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('DEBUG: Settings updated:', { section, data });
        resolve({ success: true, message: 'Settings saved successfully' });
      }, 200);
    });
  }
};

// Mock fetch override for development
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function(url: string, options?: RequestInit) {
    if (url.includes('/api/settings')) {
      if (options?.method === 'PATCH') {
        return mockSettingsAPI.update(options.body ? JSON.parse(options.body as string).section : '', options.body ? JSON.parse(options.body as string).data : {})
          .then(data => new Response(JSON.stringify(data), { status: 200 }));
      } else {
        return mockSettingsAPI.get()
          .then(data => new Response(JSON.stringify(data), { status: 200 }));
      }
    }
    return originalFetch(url, options);
  };
}

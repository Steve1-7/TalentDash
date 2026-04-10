import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'developer' | 'freelancer' | 'recruiter' | 'manager';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  skills: string[];
  company?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  createdAt: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, _password: string) => Promise<void>;
  signup: (email: string, _password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  completeOnboarding: (profile: Partial<UserProfile>) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

// Create default test user if it doesn't exist
const createDefaultUser = () => {
  const stored = localStorage.getItem('promptlyos-users');
  const users: UserProfile[] = stored ? JSON.parse(stored) : [];
  
  if (!users.find(u => u.email === 'steve@example.com')) {
    const defaultUser: UserProfile = {
      id: crypto.randomUUID(),
      name: 'Steve',
      email: 'steve@example.com',
      role: 'developer',
      bio: 'Senior Full-Stack Engineer',
      skills: ['React', 'TypeScript', 'Node.js'],
      company: 'Tech Corp',
      location: 'San Francisco',
      website: 'https://steve.dev',
      github: 'github.com/steve',
      linkedin: 'linkedin.com/in/steve',
      createdAt: new Date().toISOString(),
    };
    users.push(defaultUser);
    localStorage.setItem('promptlyos-users', JSON.stringify(users));
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isOnboarded: false,

      login: async (email: string, _password: string) => {
        // Create default user if needed
        createDefaultUser();
        
        // Simulated — replace with real auth
        const stored = localStorage.getItem('promptlyos-users');
        const users: UserProfile[] = stored ? JSON.parse(stored) : [];
        const user = users.find(u => u.email === email);
        if (user) {
          set({ user, isAuthenticated: true, isOnboarded: true });
          console.log('Login successful:', user);
        } else {
          throw new Error('User not found. Please sign up first.');
        }
      },

      signup: async (email: string, _password: string, name: string, role: UserRole) => {
        const newUser: UserProfile = {
          id: crypto.randomUUID(),
          name,
          email,
          role,
          skills: [],
          createdAt: new Date().toISOString(),
        };
        // Store in local users list
        const stored = localStorage.getItem('promptlyos-users');
        const users: UserProfile[] = stored ? JSON.parse(stored) : [];
        if (users.find(u => u.email === email)) {
          throw new Error('Account already exists.');
        }
        users.push(newUser);
        localStorage.setItem('promptlyos-users', JSON.stringify(users));
        set({ user: newUser, isAuthenticated: true, isOnboarded: false });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isOnboarded: false });
      },

      completeOnboarding: (profile) => {
        const current = get().user;
        if (!current) return;
        const updated = { ...current, ...profile };
        set({ user: updated, isOnboarded: true });
        // Persist
        const stored = localStorage.getItem('promptlyos-users');
        const users: UserProfile[] = stored ? JSON.parse(stored) : [];
        const idx = users.findIndex(u => u.id === current.id);
        if (idx >= 0) users[idx] = updated;
        localStorage.setItem('promptlyos-users', JSON.stringify(users));
      },

      updateProfile: (updates) => {
        const current = get().user;
        if (!current) return;
        const updated = { ...current, ...updates };
        set({ user: updated });
        const stored = localStorage.getItem('promptlyos-users');
        const users: UserProfile[] = stored ? JSON.parse(stored) : [];
        const idx = users.findIndex(u => u.id === current.id);
        if (idx >= 0) users[idx] = updated;
        localStorage.setItem('promptlyos-users', JSON.stringify(users));
      },
    }),
    { name: 'promptlyos-auth' }
  )
);

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/stores/authStore';

export default function SignupPage() {
  console.log('SIGNUP PAGE RENDERING - DEBUG CHECK');
  
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('developer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { value: 'developer' as UserRole, label: 'Developer', description: 'Build and code projects' },
    { value: 'freelancer' as UserRole, label: 'Freelancer', description: 'Manage gigs and clients' },
    { value: 'recruiter' as UserRole, label: 'Recruiter', description: 'Source and hire talent' },
    { value: 'manager' as UserRole, label: 'Manager', description: 'Lead teams and projects' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      await signup(email, password, name, role);
      console.log('Signup successful:', { name, email, role });
      navigate('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', fontFamily: 'Arial, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Create your account</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Start tracking your career growth</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="name">Full name</Label>
            <Input 
              id="name" 
              required 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Jane Smith" 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="you@example.com" 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="â¢â¢â¢â¢â¢â¢â¢â¢" 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label>Select your role</Label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  style={{
                    padding: '0.75rem',
                    border: `2px solid ${role === r.value ? '#2563eb' : '#e5e7eb'}`,
                    borderRadius: '0.5rem',
                    backgroundColor: role === r.value ? '#eff6ff' : 'white',
                    color: role === r.value ? '#2563eb' : '#1f2937',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.875rem',
                    fontWeight: role === r.value ? '600' : '400'
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{r.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{r.description}</div>
                </button>
              ))}
            </div>
          </div>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '0.5rem', color: '#991b1b', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <Button 
            type="submit" 
            style={{ width: '100%', backgroundColor: '#2563eb', color: 'white' }} 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1f2937', fontWeight: '500', textDecoration: 'underline' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

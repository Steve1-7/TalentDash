import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  console.log('LOGIN PAGE RENDERING - DEBUG CHECK');
  
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Login attempt:', email);
    
    try {
      await login(email, password);
      console.log('Login successful, redirecting to dashboard...');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', fontFamily: 'Arial, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px', space: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome back</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '0.5rem', 
            marginBottom: '1rem' 
          }}>
            <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="steve@example.com" 
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
              placeholder="password" 
            />
          </div>
          <Button 
            type="submit" 
            style={{ width: '100%', backgroundColor: '#2563eb', color: 'white' }} 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#0369a1', marginBottom: '0.5rem' }}>
            <strong>Test Account:</strong>
          </p>
          <p style={{ fontSize: '0.75rem', color: '#0369a1', marginBottom: '0.5rem' }}>
            Email: steve@example.com
          </p>
          <p style={{ fontSize: '0.75rem', color: '#0369a1', marginBottom: '0.5rem' }}>
            Password: password
          </p>
          <button
            type="button"
            onClick={() => {
              setEmail('steve@example.com');
              setPassword('password');
            }}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#0369a1',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Auto-fill Test Account
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1.5rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#1f2937', fontWeight: '500', textDecoration: 'underline' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

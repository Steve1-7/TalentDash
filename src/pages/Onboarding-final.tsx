import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/authStore';

const roles = [
  { value: 'developer', label: 'Developer', desc: 'Track skills & build your portfolio' },
  { value: 'freelancer', label: 'Freelancer', desc: 'Manage gigs, clients & earnings' },
  { value: 'recruiter', label: 'Recruiter', desc: 'Find & manage talent pipelines' },
  { value: 'manager', label: 'Manager', desc: 'Oversee teams & track performance' },
];

export default function OnboardingPage() {
  console.log('ONBOARDING PAGE RENDERING - DEBUG CHECK');
  
  const navigate = useNavigate();
  const { user, completeOnboarding, updateProfile } = useAuthStore();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(user?.role || 'developer');
  const [bio, setBio] = useState('');
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');

  const handleComplete = () => {
    console.log('Onboarding completed:', { role, bio, company, skills, location });
    
    // Update user profile with onboarding data
    const profileData = {
      bio,
      company: company || undefined,
      skills: skills.split(',').map(s => s.trim()).filter(s => s),
      location: location || undefined,
      role: role as 'developer' | 'freelancer' | 'recruiter' | 'manager'
    };
    
    completeOnboarding(profileData);
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', fontFamily: 'Arial, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[0, 1].map(i => (
            <div 
              key={i} 
              style={{ 
                height: '4px', 
                flex: '1', 
                borderRadius: '2px', 
                backgroundColor: i <= step ? '#2563eb' : '#e5e7eb' 
              }} 
            />
          ))}
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Complete Your Profile</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Tell us about yourself to get started with PromptlyOS
          </p>
        </div>

        {/* Step 1: Role Selection */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>What's your primary role?</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                {roles.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      border: '1px solid',
                      borderRadius: '0.5rem',
                      backgroundColor: role === r.value ? '#f0f9ff' : 'white',
                      borderColor: role === r.value ? '#2563eb' : '#e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{r.label}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <Button 
              onClick={() => setStep(1)} 
              style={{ width: '100%', backgroundColor: '#2563eb', color: 'white' }}
            >
              Next
            </Button>
          </div>
        )}

        {/* Step 2: Profile Details */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>Tell us more about yourself</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Label htmlFor="company">Company (optional)</Label>
                  <Input 
                    id="company"
                    placeholder="Your company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Label htmlFor="skills">Skills</Label>
                  <Input 
                    id="skills"
                    placeholder="React, TypeScript, Node.js..."
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Label htmlFor="location">Location (optional)</Label>
                  <Input 
                    id="location"
                    placeholder="City, Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button 
                variant="outline" 
                onClick={() => setStep(0)}
                style={{ flex: '1' }}
              >
                Back
              </Button>
              <Button 
                onClick={handleComplete} 
                style={{ flex: '1', backgroundColor: '#2563eb', color: 'white' }}
              >
                Complete Setup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

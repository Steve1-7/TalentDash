import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore, UserRole } from '@/stores/authStore';

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'developer', label: 'Developer', desc: 'Track skills & build your portfolio' },
  { value: 'freelancer', label: 'Freelancer', desc: 'Manage gigs, clients & earnings' },
  { value: 'recruiter', label: 'Recruiter', desc: 'Find & manage talent pipelines' },
  { value: 'manager', label: 'Manager', desc: 'Oversee teams & track performance' },
];

export default function OnboardingPage() {
  const { isAuthenticated, isOnboarded, completeOnboarding, user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<UserRole>('developer');
  const [bio, setBio] = useState('');
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isOnboarded) return <Navigate to="/dashboard" replace />;

  const handleComplete = () => {
    completeOnboarding({
      role,
      bio,
      company,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      location,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Progress */}
        <div className="flex gap-2">
          {[0, 1].map(i => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-accent" : "bg-secondary"}`} 
            />
          ))}
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Complete Your Profile</h1>
          <p className="text-sm text-muted-foreground">
            Tell us about yourself to get started with PromptlyOS
          </p>
        </div>

        {/* Step 1: Role Selection */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">What's your primary role?</h2>
              <div className="grid grid-cols-1 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`p-4 text-left border rounded-lg transition-colors ${
                      role === r.value 
                        ? 'border-accent bg-accent/10' 
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <div className="font-medium">{r.label}</div>
                    <div className="text-sm text-muted-foreground">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            <Button 
              onClick={() => setStep(1)} 
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Next
            </Button>
          </div>
        )}

        {/* Step 2: Profile Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Tell us more about yourself</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company (optional)</Label>
                  <Input 
                    id="company"
                    placeholder="Your company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Input 
                    id="skills"
                    placeholder="React, TypeScript, Node.js..."
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>
                <div>
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
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep(0)}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleComplete} 
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
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

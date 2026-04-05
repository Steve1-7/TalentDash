import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore, UserRole } from '@/stores/authStore';
import { Code, Briefcase, Users, BarChart3, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles: { value: UserRole; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'developer', label: 'Developer', desc: 'Track skills & build your portfolio', icon: Code },
  { value: 'freelancer', label: 'Freelancer', desc: 'Manage gigs, clients & earnings', icon: Briefcase },
  { value: 'recruiter', label: 'Recruiter', desc: 'Find & manage talent pipelines', icon: Users },
  { value: 'manager', label: 'Manager', desc: 'Oversee teams & track performance', icon: BarChart3 },
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
            <div key={i} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-accent" : "bg-secondary")} />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">What describes you best?</h1>
              <p className="text-sm text-muted-foreground mt-1">We'll customize your dashboard based on your role.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(r => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={cn(
                    "p-4 rounded-xl border text-left transition-all",
                    role === r.value
                      ? "border-accent bg-accent/5 ring-1 ring-accent"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <r.icon className={cn("h-5 w-5 mb-2", role === r.value ? "text-accent" : "text-muted-foreground")} />
                  <p className="font-medium text-sm">{r.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
            <Button onClick={() => setStep(1)} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tell us about yourself</h1>
              <p className="text-sm text-muted-foreground mt-1">This helps personalize your experience, {user?.name?.split(' ')[0]}.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="A short description about yourself..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>{role === 'freelancer' ? 'Business Name' : 'Company'}</Label>
                <Input value={company} onChange={e => setCompany(e.target.value)} placeholder={role === 'freelancer' ? 'Your freelance brand' : 'Where you work'} />
              </div>
              <div className="space-y-2">
                <Label>Skills (comma separated)</Label>
                <Input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, TypeScript, Design..." />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="San Francisco, CA" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)} className="flex-1">Back</Button>
              <Button onClick={handleComplete} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

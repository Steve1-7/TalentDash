import { useAuthStore } from '@/stores/authStore';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [company, setCompany] = useState(user?.company || '');
  const [location, setLocation] = useState(user?.location || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [github, setGithub] = useState(user?.github || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');
  const [skillInput, setSkillInput] = useState('');

  const handleSave = () => {
    updateProfile({ name, bio, company, location, website, github, linkedin });
    toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    const newSkills = [...(user?.skills || []), skillInput.trim()];
    updateProfile({ skills: newSkills });
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    updateProfile({ skills: (user?.skills || []).filter(s => s !== skill) });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your personal information.</p>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Personal Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input value={company} onChange={e => setCompany(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Website</Label>
                <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://" />
              </div>
              <div className="space-y-2">
                <Label>GitHub</Label>
                <Input value={github} onChange={e => setGithub(e.target.value)} placeholder="username" />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="username" />
              </div>
            </div>
            <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90">Save changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Skills</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Add a skill..." onKeyDown={e => e.key === 'Enter' && addSkill()} />
              <Button variant="outline" onClick={addSkill}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {user?.skills?.map(skill => (
                <Badge key={skill} variant="secondary" className="cursor-pointer hover:bg-destructive/10" onClick={() => removeSkill(skill)}>
                  {skill} ×
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

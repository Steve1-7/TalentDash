import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/stores/authStore';

interface SettingsSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

const EnhancedSettings: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Profile settings state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    company: user?.company || '',
    location: user?.location || '',
    website: user?.website || '',
    github: user?.github || '',
    linkedin: user?.linkedin || ''
  });
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    notifications: 'all',
    timezone: 'UTC',
    currency: 'USD'
  });
  
  // Security state
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: '24h'
  });

  const handleProfileSave = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      updateProfile(profileData);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSave = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Save preferences to localStorage
      localStorage.setItem(`preferences-${user?.id}`, JSON.stringify(preferences));
      setMessage('Preferences saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (security.newPassword !== security.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Password changed successfully!');
      setSecurity(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const sections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profile Management',
      icon: 'ð',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Full Name</Label>
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              />
            </div>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Email</Label>
              <Input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              />
            </div>
          </div>
          
          <div>
            <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Bio</Label>
            <Textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              style={{ width: '100%', minHeight: '100px', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', resize: 'vertical' }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Company</Label>
              <Input
                value={profileData.company}
                onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Your company"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              />
            </div>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Location</Label>
              <Input
                value={profileData.location}
                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, Country"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Website</Label>
              <Input
                value={profileData.website}
                onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourwebsite.com"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              />
            </div>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>GitHub</Label>
              <Input
                value={profileData.github}
                onChange={(e) => setProfileData(prev => ({ ...prev, github: e.target.value }))}
                placeholder="github.com/username"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              />
            </div>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>LinkedIn</Label>
              <Input
                value={profileData.linkedin}
                onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                placeholder="linkedin.com/in/username"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              />
            </div>
          </div>
          
          <Button
            onClick={handleProfileSave}
            disabled={loading}
            style={{ 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      )
    },
    {
      id: 'preferences',
      title: 'Account Preferences',
      icon: 'â',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Theme</Label>
              <select
                value={preferences.theme}
                onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Language</Label>
              <select
                value={preferences.language}
                onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Notifications</Label>
              <select
                value={preferences.notifications}
                onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              >
                <option value="all">All notifications</option>
                <option value="important">Important only</option>
                <option value="none">None</option>
              </select>
            </div>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Timezone</Label>
              <select
                value={preferences.timezone}
                onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              >
                <option value="UTC">UTC</option>
                <option value="EST">EST</option>
                <option value="PST">PST</option>
                <option value="CET">CET</option>
              </select>
            </div>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Currency</Label>
              <select
                value={preferences.currency}
                onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>
          
          <Button
            onClick={handlePreferencesSave}
            disabled={loading}
            style={{ 
              backgroundColor: '#10b981', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '0.5rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: 'ð',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Change Password</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Current Password</Label>
                <Input
                  type="password"
                  value={security.currentPassword}
                  onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                  <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>New Password</Label>
                  <Input
                    type="password"
                    value={security.newPassword}
                    onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                  />
                </div>
                <div>
                  <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Two-Factor Authentication</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
              <input
                type="checkbox"
                checked={security.twoFactorEnabled}
                onChange={(e) => setSecurity(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
                style={{ width: '1rem', height: '1rem' }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: '500', color: '#1f2937' }}>Enable 2FA</p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>Add an extra layer of security to your account</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>Session Management</h4>
            <div>
              <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>Session Timeout</Label>
              <select
                value={security.sessionTimeout}
                onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
              >
                <option value="1h">1 hour</option>
                <option value="8h">8 hours</option>
                <option value="24h">24 hours</option>
                <option value="7d">7 days</option>
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button
              onClick={handlePasswordChange}
              disabled={loading || !security.currentPassword || !security.newPassword}
              style={{ 
                backgroundColor: '#ef4444', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '0.5rem',
                opacity: loading || !security.currentPassword || !security.newPassword ? 0.7 : 1,
                cursor: loading || !security.currentPassword || !security.newPassword ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', flexShrink: 0 }}>
        <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Settings</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: activeSection === section.id ? '#f3f4f6' : 'transparent',
                  color: activeSection === section.id ? '#1f2937' : '#6b7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: activeSection === section.id ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{section.icon}</span>
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
            {sections.find(s => s.id === activeSection)?.title}
          </h2>
          
          {message && (
            <div style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: message.includes('success') ? '#dcfce7' : '#fee2e2',
              color: message.includes('success') ? '#166534' : '#991b1b',
              fontSize: '0.875rem'
            }}>
              {message}
            </div>
          )}
          
          {sections.find(s => s.id === activeSection)?.content}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSettings;

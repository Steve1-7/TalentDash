import React, { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { UserRole } from '@/stores/authStore';

const RoleSwitcher: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'developer');
  const [isUpdating, setIsUpdating] = useState(false);

  const roles = [
    { value: 'developer', label: 'Developer', color: '#3b82f6' },
    { value: 'freelancer', label: 'Freelancer', color: '#10b981' },
    { value: 'recruiter', label: 'Recruiter', color: '#ef4444' },
    { value: 'manager', label: 'Manager', color: '#8b5cf6' }
  ];

  const handleRoleSwitch = async () => {
    if (!user || selectedRole === user.role) return;
    
    setIsUpdating(true);
    try {
      // Update user role in auth store
      updateProfile({ role: selectedRole });
      
      // Store role preference in localStorage for persistence
      localStorage.setItem('selected-role', selectedRole);
      
      // Reload page to apply new role
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch role:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '1rem',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
        Switch Role
      </h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
          Current Role: <span style={{ fontWeight: 'bold', color: roles.find(r => r.value === user?.role)?.color }}>
            {roles.find(r => r.value === user?.role)?.label}
          </span>
        </Label>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <Label style={{ color: '#1f2937', marginBottom: '0.5rem', display: 'block' }}>
          Select New Role:
        </Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => setSelectedRole(role.value as UserRole)}
              style={{
                padding: '0.75rem',
                border: `2px solid ${selectedRole === role.value ? role.color : '#e5e7eb'}`,
                borderRadius: '0.5rem',
                backgroundColor: selectedRole === role.value ? `${role.color}10` : 'white',
                color: selectedRole === role.value ? role.color : '#1f2937',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: selectedRole === role.value ? '600' : '400'
              }}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>
      
      <Button
        onClick={handleRoleSwitch}
        disabled={isUpdating || selectedRole === user?.role}
        style={{
          width: '100%',
          backgroundColor: roles.find(r => r.value === selectedRole)?.color,
          color: 'white',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          fontWeight: '500',
          opacity: (isUpdating || selectedRole === user?.role) ? 0.5 : 1,
          cursor: (isUpdating || selectedRole === user?.role) ? 'not-allowed' : 'pointer'
        }}
      >
        {isUpdating ? 'Switching...' : 'Switch Role'}
      </Button>
      
      <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
          <strong>Note:</strong> Switching roles will completely change your dashboard experience, data, and available features.
        </p>
      </div>
    </div>
  );
};

export default RoleSwitcher;

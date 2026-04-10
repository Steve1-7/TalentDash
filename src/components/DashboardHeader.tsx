import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  role: string;
  roleColor: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle, role, roleColor }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '1rem',
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: '#6b7280', margin: 0 }}>{subtitle}</p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <span style={{
            fontSize: '0.875rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            backgroundColor: `${roleColor}15`,
            color: roleColor,
            fontWeight: '500'
          }}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Welcome back, {user?.name}
          </span>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button
          onClick={handleLogout}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;

import React from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  console.log('DASHBOARD PAGE RENDERING - DEBUG CHECK');
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', fontFamily: 'Arial, sans-serif', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Dashboard</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: '#f9fafb' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Welcome to PromptlyOS</h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Your career management dashboard is ready!</p>
            <Button style={{ backgroundColor: '#2563eb', color: 'white' }}>Get Started</Button>
          </div>
          
          <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: '#f9fafb' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Quick Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Projects:</span>
                <span style={{ fontWeight: '600' }}>0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Tasks:</span>
                <span style={{ fontWeight: '600' }}>0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Skills:</span>
                <span style={{ fontWeight: '600' }}>0</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', backgroundColor: '#f9fafb' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Recent Activity</h3>
          <p style={{ color: '#6b7280' }}>No recent activity to display. Start by adding projects or tasks!</p>
        </div>
      </div>
    </div>
  );
}

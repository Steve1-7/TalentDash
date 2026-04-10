import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  console.log('LANDING PAGE RENDERING - DEBUG CHECK');
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', fontFamily: 'Arial, sans-serif' }}>
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', maxWidth: '1200px', margin: '0 auto', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/img/logo.png" alt="PromptlyOS" style={{ height: '120px', minWidth: '80px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild style={{ backgroundColor: '#2563eb', color: 'white' }}>
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '9999px', border: '1px solid #d1d5db', fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
          Built for modern careers
        </div>
        
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.1', marginBottom: '1.5rem' }}>
          Your career,
          <br />
          <span style={{ color: '#2563eb' }}>organized.</span>
        </h1>
        
        <p style={{ fontSize: '1.125rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
          A powerful dashboard for developers, freelancers, recruiters, and managers.
          Track progress, manage work, and grow your career.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
          <Button size="lg" asChild style={{ backgroundColor: '#2563eb', color: 'white', height: '3rem', padding: '0 2rem' }}>
            <Link to="/signup">
              Start free
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild style={{ height: '3rem', padding: '0 2rem' }}>
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 4rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {[
            { title: 'Developer Tools', desc: 'Track skills, build portfolios, and manage job applications.' },
            { title: 'Freelancer Hub', desc: 'Manage gigs, clients, earnings, and proposals in one place.' },
            { title: 'Recruiter Suite', desc: 'Pipeline management, job postings, and candidate search.' },
            { title: 'Manager View', desc: 'Team oversight, performance insights, and task assignments.' },
          ].map((feature, i) => (
            <div key={i} style={{ padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              <div style={{ height: '40px', width: '40px', borderRadius: '0.5rem', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <div style={{ height: '20px', width: '20px', backgroundColor: '#2563eb', borderRadius: '4px' }} />
              </div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{feature.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e5e7eb', padding: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
        <p>© 2026 PromptlyOS. All rights reserved.</p>
      </footer>
    </div>
  );
}

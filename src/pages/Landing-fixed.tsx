import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Safe auth store hook with error handling
const useAuthStoreSafe = () => {
  try {
    const { useAuthStore } = require('@/stores/authStore');
    return useAuthStore();
  } catch (error) {
    console.warn('Auth store not available, using fallback:', error);
    return {
      isAuthenticated: false,
      isOnboarded: false,
      user: null
    };
  }
};

export default function LandingPage() {
  const [authError, setAuthError] = React.useState(false);
  const authState = useAuthStoreSafe();

  React.useEffect(() => {
    // Check if auth store is working
    try {
      const test = authState.isAuthenticated;
      if (test === undefined) {
        setAuthError(true);
      }
    } catch (error) {
      console.error('Auth store error:', error);
      setAuthError(true);
    }
  }, [authState]);

  if (authError) {
    // Fallback UI when auth store fails
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-2xl">PromptlyOS</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm text-gray-600 mb-6">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Built for modern careers
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Your career,
            <br />
            <span className="text-blue-600">organized.</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-10">
            A powerful dashboard for developers, freelancers, recruiters, and managers.
            Track progress, manage work, and grow your career.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8">
              <Link to="/signup">
                Start free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Developer Tools', desc: 'Track skills, build portfolios, and manage job applications.' },
              { title: 'Freelancer Hub', desc: 'Manage gigs, clients, earnings, and proposals in one place.' },
              { title: 'Recruiter Suite', desc: 'Pipeline management, job postings, and candidate search.' },
              { title: 'Manager View', desc: 'Team oversight, performance insights, and task assignments.' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <div className="h-5 w-5 bg-blue-600 rounded" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8 text-center text-sm text-gray-600">
          <p>© 2026 PromptlyOS. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // Normal rendering with auth
  try {
    const { isAuthenticated, isOnboarded } = authState;

    if (isAuthenticated) {
      const { Navigate } = require('react-router-dom');
      return <Navigate to={isOnboarded ? "/dashboard" : "/onboarding"} replace />;
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-2xl">PromptlyOS</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-blue-600 text-white hover:bg-blue-700">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm text-gray-600 mb-6">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Built for modern careers
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Your career,
            <br />
            <span className="text-blue-600">organized.</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-10">
            A powerful dashboard for developers, freelancers, recruiters, and managers.
            Track progress, manage work, and grow your career.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-blue-600 text-white hover:bg-blue-700 h-12 px-8">
              <Link to="/signup">
                Start free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Developer Tools', desc: 'Track skills, build portfolios, and manage job applications.' },
              { title: 'Freelancer Hub', desc: 'Manage gigs, clients, earnings, and proposals in one place.' },
              { title: 'Recruiter Suite', desc: 'Pipeline management, job postings, and candidate search.' },
              { title: 'Manager View', desc: 'Team oversight, performance insights, and task assignments.' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <div className="h-5 w-5 bg-blue-600 rounded" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8 text-center text-sm text-gray-600">
          <p>© 2026 PromptlyOS. All rights reserved.</p>
        </footer>
      </div>
    );
  } catch (error) {
    console.error('Landing page rendering error:', error);
    setAuthError(true);
    return <div>Loading...</div>;
  }
}

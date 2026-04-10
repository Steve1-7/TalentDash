import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { Navigate } from 'react-router-dom';

export default function LandingPage() {
  const { isAuthenticated, isOnboarded } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={isOnboarded ? "/dashboard" : "/onboarding"} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-tight">PromptlyOS</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm text-muted-foreground mb-6">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Built for modern careers
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Your career,
          <br />
          <span className="text-accent">organized.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          A powerful dashboard for developers, freelancers, recruiters, and managers.
          Track progress, manage work, and grow your career.
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8">
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
            <div key={i} className="p-6 rounded-xl border bg-card">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <div className="h-5 w-5 bg-accent rounded" />
              </div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 PromptlyOS. All rights reserved.</p>
      </footer>
    </div>
  );
}

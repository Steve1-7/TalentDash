import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Users, Briefcase, Code } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { Navigate } from 'react-router-dom';

const features = [
  { icon: Code, title: 'Developer Tools', desc: 'Track skills, build portfolios, and manage job applications.' },
  { icon: Briefcase, title: 'Freelancer Hub', desc: 'Manage gigs, clients, earnings, and proposals in one place.' },
  { icon: Users, title: 'Recruiter Suite', desc: 'Pipeline management, job postings, and candidate search.' },
  { icon: BarChart3, title: 'Manager View', desc: 'Team oversight, performance insights, and task assignments.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function LandingPage() {
  const { isAuthenticated, isOnboarded } = useAuthStore();

  if (isAuthenticated && isOnboarded) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-tight">TalentDash</span>
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

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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
                Start free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="p-6 rounded-xl border bg-card card-hover"
            >
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 TalentDash. All rights reserved.</p>
      </footer>
    </div>
  );
}

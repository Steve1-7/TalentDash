import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isOnboarded, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9 w-64 h-8 bg-secondary border-0 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10"
                    aria-label="Notifications"
                    title="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="end">
                  <div className="text-sm">No notifications</div>
                </PopoverContent>
              </Popover>
              {/* avatar removed per request */}
            </div>
          </header>
          <main className="flex-1 p-6 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

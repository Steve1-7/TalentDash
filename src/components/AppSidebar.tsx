import {
  LayoutDashboard, User, FolderKanban, CheckSquare, Settings, LogOut,
  Code, Briefcase, Users, BarChart3, BookOpen, DollarSign, Search as SearchIcon,
  ClipboardList, UserCheck, FileText, TrendingUp, ListTodo,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/stores/authStore';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const commonItems: NavItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Profile', url: '/profile', icon: User },
  { title: 'Projects', url: '/projects', icon: FolderKanban },
  { title: 'Tasks', url: '/tasks', icon: CheckSquare },
];

const roleItems: Record<UserRole, NavItem[]> = {
  developer: [
    { title: 'Skills', url: '/skills', icon: Code },
    { title: 'Learning', url: '/learning', icon: BookOpen },
    { title: 'Applications', url: '/applications', icon: ClipboardList },
  ],
  freelancer: [
    { title: 'Gigs', url: '/gigs', icon: Briefcase },
    { title: 'Clients', url: '/clients', icon: Users },
    { title: 'Earnings', url: '/earnings', icon: DollarSign },
    { title: 'Proposals', url: '/proposals', icon: FileText },
  ],
  recruiter: [
    { title: 'Pipeline', url: '/pipeline', icon: UserCheck },
    { title: 'Job Posts', url: '/job-posts', icon: ClipboardList },
    { title: 'Search', url: '/candidate-search', icon: SearchIcon },
  ],
  manager: [
    { title: 'Team', url: '/team', icon: Users },
    { title: 'Performance', url: '/performance', icon: TrendingUp },
    { title: 'Assignments', url: '/assignments', icon: ListTodo },
  ],
};

const settingsItems: NavItem[] = [
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const role = user?.role || 'developer';

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="px-4 py-4 flex items-center gap-2">
          <span className="font-semibold text-sm tracking-tight">PromptlyOS</span>
        </div>

        {/* Main Nav */}
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {commonItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-muted text-foreground font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Role-specific */}
        <SidebarGroup>
          <SidebarGroupLabel className="capitalize">{role} Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {roleItems[role].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-muted text-foreground font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-muted text-foreground font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => { logout(); navigate('/'); }}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Log out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

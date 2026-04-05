import { DashboardLayout } from '@/components/DashboardLayout';
import { FolderKanban, Plus, Search, Trash2, Pencil, Archive } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useProjectsStore, type Project, type ProjectStatus } from '@/stores/projectsStore';
import { cn } from '@/lib/utils';

const statusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  archived: 'Archived',
};

export default function ProjectsPage() {
  const { toast } = useToast();
  const { projects, createProject, updateProject, deleteProject, archiveProject } = useProjectsStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (status !== 'all' && p.status !== status) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [projects, query, status]);

  const handleCreate = (values: { name: string; description?: string; status: ProjectStatus; tags: string[] }) => {
    const created = createProject(values);
    setCreateOpen(false);
    toast({ title: 'Project created', description: created.name });
  };

  const handleUpdate = (id: string, values: { name: string; description?: string; status: ProjectStatus; tags: string[] }) => {
    updateProject(id, values);
    setEditing(null);
    toast({ title: 'Project updated' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">Plan, track, and share work across roles.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                New project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create project</DialogTitle>
              </DialogHeader>
              <ProjectEditor
                submitLabel="Create project"
                onSubmit={handleCreate}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects..." className="pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-14">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <FolderKanban className="h-6 w-6" />
                </div>
                <p className="font-medium">No projects found</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Create a project to start organizing tasks, uploads, and activity.
                </p>
                <Button className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first project
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <Card key={p.id} className="card-hover">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base leading-tight">{p.name}</CardTitle>
                    <Badge
                      variant="secondary"
                      className={cn(
                        p.status === 'active' && 'bg-success/10 text-success',
                        p.status === 'archived' && 'opacity-60',
                      )}
                    >
                      {statusLabels[p.status]}
                    </Badge>
                  </div>
                  {p.description && <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.length ? (
                      p.tags.slice(0, 6).map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No tags</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(p.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(p)} aria-label="Edit project">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          archiveProject(p.id);
                          toast({ title: 'Project archived' });
                        }}
                        aria-label="Archive project"
                        disabled={p.status === 'archived'}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          deleteProject(p.id);
                          toast({ title: 'Project deleted' });
                        }}
                        aria-label="Delete project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
          </DialogHeader>
          {editing && (
            <ProjectEditor
              initial={editing}
              submitLabel="Save changes"
              onSubmit={(values) => handleUpdate(editing.id, values)}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function ProjectEditor({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Project;
  submitLabel: string;
  onSubmit: (values: { name: string; description?: string; status: ProjectStatus; tags: string[] }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [status, setStatus] = useState<ProjectStatus>(initial?.status ?? 'active');
  const [tags, setTags] = useState((initial?.tags ?? []).join(', '));

  const canSubmit = name.trim().length >= 2;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        const parsedTags = tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        onSubmit({ name: name.trim(), description: description.trim() || undefined, status, tags: parsedTags });
      }}
    >
      <div className="space-y-2">
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Portfolio Revamp" />
        {!canSubmit && <p className="text-xs text-muted-foreground">Name must be at least 2 characters.</p>}
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What are you building?" rows={4} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tags</Label>
          <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, saas, design" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button type="submit" className={cn("bg-accent text-accent-foreground hover:bg-accent/90", !canSubmit && "opacity-50")} disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

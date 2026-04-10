import { DashboardLayout } from '@/components/DashboardLayout';
import { CheckSquare, Plus, Search, Trash2, Pencil, Filter } from 'lucide-react';
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
import { useProjectsStore } from '@/stores/projectsStore';
import { useTasksStore, type Task, type TaskPriority, type TaskStatus } from '@/stores/tasksStore';
import { cn } from '@/lib/utils';

const statusLabel: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  blocked: 'Blocked',
  done: 'Done',
};

const priorityLabel: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export default function TasksPage() {
  const { toast } = useToast();
  const { projects } = useProjectsStore();
  const { tasks, createTask, updateTask, deleteTask } = useTasksStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<TaskStatus | 'all'>('all');
  const [priority, setPriority] = useState<TaskPriority | 'all'>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (status !== 'all' && t.status !== status) return false;
      if (priority !== 'all' && t.priority !== priority) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description ?? '').toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [tasks, query, status, priority]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
            <p className="text-sm text-muted-foreground mt-1">Stay on top of work with priorities and due dates.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                New task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create task</DialogTitle>
              </DialogHeader>
              <TaskEditor
                projects={projects}
                submitLabel="Create task"
                onSubmit={(values) => {
                  const created = createTask(values);
                  setCreateOpen(false);
                  toast({ title: 'Task created', description: created.title });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_220px] gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks..." className="pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as 'all' | 'pending' | 'in-progress' | 'completed')}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="todo">To do</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={(v) => setPriority(v as 'all' | 'low' | 'medium' | 'high')}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-14">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <p className="font-medium">No tasks found</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Create a task, set a due date, and track progress across your work.
                </p>
                <Button className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first task
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((t) => {
              const projectName = t.projectId ? projects.find((p) => p.id === t.projectId)?.name : undefined;
              return (
                <Card key={t.id} className="card-hover">
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base leading-tight">{t.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{statusLabel[t.status]}</Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            t.priority === 'high' && 'border-destructive/40 text-destructive',
                            t.priority === 'medium' && 'border-border',
                            t.priority === 'low' && 'opacity-80',
                          )}
                        >
                          {priorityLabel[t.priority]}
                        </Badge>
                      </div>
                    </div>
                    {t.description && <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {projectName && <Badge variant="secondary" className="text-xs">{projectName}</Badge>}
                      {t.dueDate && <Badge variant="outline" className="text-xs">Due {t.dueDate}</Badge>}
                      {t.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {!projectName && !t.dueDate && t.tags.length === 0 && (
                        <span className="text-xs text-muted-foreground">No metadata</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Updated {new Date(t.updatedAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditing(t)} aria-label="Edit task">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            deleteTask(t.id);
                            toast({ title: 'Task deleted' });
                          }}
                          aria-label="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>
          {editing && (
            <TaskEditor
              projects={projects}
              initial={editing}
              submitLabel="Save changes"
              onSubmit={(values) => {
                updateTask(editing.id, values);
                setEditing(null);
                toast({ title: 'Task updated' });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function TaskEditor({
  projects,
  initial,
  submitLabel,
  onSubmit,
}: {
  projects: { id: string; name: string; status: string }[];
  initial?: Task;
  submitLabel: string;
  onSubmit: (values: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId?: string;
    dueDate?: string;
    tags: string[];
  }) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'todo');
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority ?? 'medium');
  const [projectId, setProjectId] = useState<string>(initial?.projectId ?? 'none');
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [tags, setTags] = useState((initial?.tags ?? []).join(', '));

  const canSubmit = title.trim().length >= 2;

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
        onSubmit({
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          projectId: projectId === 'none' ? undefined : projectId,
          dueDate: dueDate || undefined,
          tags: parsedTags,
        });
      }}
    >
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Ship onboarding flow" />
        {!canSubmit && <p className="text-xs text-muted-foreground">Title must be at least 2 characters.</p>}
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Context, acceptance criteria, notes..." rows={4} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To do</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Project</Label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No project</SelectItem>
              {projects
                .filter((p) => p.status !== 'archived')
                .map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Due date</Label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="pl-9" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="frontend, interview, urgent" />
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button type="submit" className={cn("bg-accent text-accent-foreground hover:bg-accent/90", !canSubmit && "opacity-50")} disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

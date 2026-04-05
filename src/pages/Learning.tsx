import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLearningStore, type LearningGoal, type LearningGoalStatus } from "@/stores/learningStore";
import { useMemo, useState } from "react";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusLabel: Record<LearningGoalStatus, string> = {
  planned: "Planned",
  active: "Active",
  completed: "Completed",
};

export default function LearningPage() {
  const { toast } = useToast();
  const { goals, createGoal, updateGoal, deleteGoal } = useLearningStore();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<LearningGoal | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return goals;
    return goals.filter(
      (g) => g.title.toLowerCase().includes(q) || (g.description ?? "").toLowerCase().includes(q),
    );
  }, [goals, query]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Learning</h1>
            <p className="text-sm text-muted-foreground mt-1">Build a roadmap and track outcomes.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                New goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create learning goal</DialogTitle>
              </DialogHeader>
              <LearningEditor
                submitLabel="Create goal"
                onSubmit={(values) => {
                  const created = createGoal(values);
                  setCreateOpen(false);
                  toast({ title: "Goal created", description: created.title });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-xl">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search learning goals..." />
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-14">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <BookOpen className="h-6 w-6" />
                </div>
                <p className="font-medium">No learning goals</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Add your first goal and keep momentum with a simple plan.
                </p>
                <Button className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first goal
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((g) => (
              <Card key={g.id} className="card-hover">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base leading-tight">{g.title}</CardTitle>
                    <Badge variant="secondary">{statusLabel[g.status]}</Badge>
                  </div>
                  {g.description && <p className="text-sm text-muted-foreground line-clamp-2">{g.description}</p>}
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{g.targetDate ? `Target ${g.targetDate}` : "No target date"}</p>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(g)} aria-label="Edit goal">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        deleteGoal(g.id);
                        toast({ title: "Goal deleted" });
                      }}
                      aria-label="Delete goal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit learning goal</DialogTitle>
            </DialogHeader>
            {editing && (
              <LearningEditor
                initial={editing}
                submitLabel="Save changes"
                onSubmit={(values) => {
                  updateGoal(editing.id, values);
                  setEditing(null);
                  toast({ title: "Goal updated" });
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function LearningEditor({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: LearningGoal;
  submitLabel: string;
  onSubmit: (values: { title: string; description?: string; status: LearningGoalStatus; targetDate?: string }) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<LearningGoalStatus>(initial?.status ?? "planned");
  const [targetDate, setTargetDate] = useState(initial?.targetDate ?? "");

  const canSubmit = title.trim().length >= 2;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          targetDate: targetDate || undefined,
        });
      }}
    >
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Master system design interviews" />
        {!canSubmit && <p className="text-xs text-muted-foreground">Title must be at least 2 characters.</p>}
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="What’s the plan? What does success look like?" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as LearningGoalStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Target date</Label>
          <Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center justify-end">
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}


import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRecruiterStore, type Candidate, type CandidateStage } from "@/stores/recruiterStore";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const stages: { id: CandidateStage; label: string }[] = [
  { id: "applied", label: "Applied" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "hired", label: "Hired" },
  { id: "rejected", label: "Rejected" },
];

export default function PipelinePage() {
  const { toast } = useToast();
  const { candidates, createCandidate, updateCandidate, deleteCandidate } = useRecruiterStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Candidate | null>(null);

  const byStage = useMemo(() => {
    const map: Record<CandidateStage, Candidate[]> = {
      applied: [],
      interview: [],
      offer: [],
      hired: [],
      rejected: [],
    };
    candidates.forEach((c) => map[c.stage].push(c));
    return map;
  }, [candidates]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage candidates across stages (DnD comes later).</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Add candidate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add candidate</DialogTitle>
              </DialogHeader>
              <CandidateEditor
                submitLabel="Add"
                onSubmit={(values) => {
                  const created = createCandidate(values);
                  setCreateOpen(false);
                  toast({ title: "Candidate added", description: created.name });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {candidates.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-14">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <UserCheck className="h-6 w-6" />
                </div>
                <p className="font-medium">No candidates yet</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Add candidates and track them through interviews and offers.
                </p>
                <Button className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first candidate
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {stages.map((s) => (
              <div key={s.id} className="rounded-xl border bg-secondary/30 p-3 min-h-[240px]">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">{s.label}</p>
                  <Badge variant="secondary">{byStage[s.id].length}</Badge>
                </div>
                <div className="space-y-2">
                  {byStage[s.id].map((c) => (
                    <Card key={c.id} className="bg-background/80">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{c.name}</p>
                            {c.title && <p className="text-xs text-muted-foreground truncate">{c.title}</p>}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(c)} aria-label="Edit candidate">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => {
                                deleteCandidate(c.id);
                                toast({ title: "Candidate deleted" });
                              }}
                              aria-label="Delete candidate"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {c.skills.slice(0, 4).map((sk) => (
                            <Badge key={sk} variant="outline" className="text-[10px]">
                              {sk}
                            </Badge>
                          ))}
                        </div>
                        <Select
                          value={c.stage}
                          onValueChange={(v) => {
                            updateCandidate(c.id, { stage: v as CandidateStage });
                          }}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {stages.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit candidate</DialogTitle>
            </DialogHeader>
            {editing && (
              <CandidateEditor
                initial={editing}
                submitLabel="Save"
                onSubmit={(values) => {
                  updateCandidate(editing.id, values);
                  setEditing(null);
                  toast({ title: "Candidate updated" });
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function CandidateEditor({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Candidate;
  submitLabel: string;
  onSubmit: (values: { name: string; email?: string; title?: string; stage: CandidateStage; skills: string[]; notes?: string }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [stage, setStage] = useState<CandidateStage>(initial?.stage ?? "applied");
  const [skills, setSkills] = useState((initial?.skills ?? []).join(", "));
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const canSubmit = name.trim().length >= 2;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        const parsedSkills = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        onSubmit({
          name: name.trim(),
          email: email.trim() || undefined,
          title: title.trim() || undefined,
          stage,
          skills: parsedSkills,
          notes: notes.trim() || undefined,
        });
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Candidate name" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Backend Engineer" />
        </div>
        <div className="space-y-2">
          <Label>Stage</Label>
          <Select value={stage} onValueChange={(v) => setStage(v as CandidateStage)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stages.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Skills</Label>
        <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="react, node, postgres" />
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Interview notes, links, follow-ups..." />
      </div>
      <div className="flex items-center justify-end">
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}


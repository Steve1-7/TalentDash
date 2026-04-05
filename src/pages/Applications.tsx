import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMemo, useState } from "react";
import { ClipboardList, Pencil, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApplicationsStore, type ApplicationStatus, type JobApplication } from "@/stores/applicationsStore";

const statusLabel: Record<ApplicationStatus, string> = {
  draft: "Draft",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export default function ApplicationsPage() {
  const { toast } = useToast();
  const { applications, createApplication, updateApplication, deleteApplication } = useApplicationsStore();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter((a) => {
      return (
        a.company.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        (a.location ?? "").toLowerCase().includes(q) ||
        (a.notes ?? "").toLowerCase().includes(q)
      );
    });
  }, [applications, query]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
            <p className="text-sm text-muted-foreground mt-1">Track your pipeline from draft to offer.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                New application
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create application</DialogTitle>
              </DialogHeader>
              <ApplicationEditor
                submitLabel="Create"
                onSubmit={(values) => {
                  const created = createApplication(values);
                  setCreateOpen(false);
                  toast({ title: "Application created", description: `${created.company} — ${created.role}` });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-xl">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company, role, notes..." />
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-14">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <p className="font-medium">No applications</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Add applications to track progress and keep follow-ups consistent.
                </p>
                <Button className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first one
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((a) => (
              <Card key={a.id} className="card-hover">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base leading-tight">
                      {a.company} <span className="text-muted-foreground font-normal">—</span> {a.role}
                    </CardTitle>
                    <Badge variant="secondary">{statusLabel[a.status]}</Badge>
                  </div>
                  {a.location && <p className="text-sm text-muted-foreground">{a.location}</p>}
                  {a.url && (
                    <a className="text-sm underline text-muted-foreground hover:text-foreground" href={a.url} target="_blank" rel="noreferrer">
                      View job posting
                    </a>
                  )}
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Updated {new Date(a.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(a)} aria-label="Edit application">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        deleteApplication(a.id);
                        toast({ title: "Application deleted" });
                      }}
                      aria-label="Delete application"
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
              <DialogTitle>Edit application</DialogTitle>
            </DialogHeader>
            {editing && (
              <ApplicationEditor
                initial={editing}
                submitLabel="Save"
                onSubmit={(values) => {
                  updateApplication(editing.id, values);
                  setEditing(null);
                  toast({ title: "Application updated" });
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function ApplicationEditor({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: JobApplication;
  submitLabel: string;
  onSubmit: (values: { company: string; role: string; location?: string; url?: string; status: ApplicationStatus; notes?: string }) => void;
}) {
  const [company, setCompany] = useState(initial?.company ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [status, setStatus] = useState<ApplicationStatus>(initial?.status ?? "draft");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const canSubmit = company.trim().length >= 2 && role.trim().length >= 2;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          company: company.trim(),
          role: role.trim(),
          location: location.trim() || undefined,
          url: url.trim() || undefined,
          status,
          notes: notes.trim() || undefined,
        });
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Company</Label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Stripe" />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Frontend Engineer" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Location</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote / City" />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ApplicationStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Job URL</Label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Contacts, follow-ups, prep notes..." />
      </div>
      <div className="flex items-center justify-end">
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}


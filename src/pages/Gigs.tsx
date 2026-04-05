import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFreelanceStore, type Gig, type GigStatus } from "@/stores/freelanceStore";
import { useMemo, useState } from "react";
import { Briefcase, Pencil, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusLabel: Record<GigStatus, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
};

export default function GigsPage() {
  const { toast } = useToast();
  const { gigs, clients, createGig, updateGig, deleteGig } = useFreelanceStore();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Gig | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return gigs;
    return gigs.filter((g) => {
      const clientName = g.clientId ? clients.find((c) => c.id === g.clientId)?.name ?? "" : "";
      return g.title.toLowerCase().includes(q) || clientName.toLowerCase().includes(q) || (g.notes ?? "").toLowerCase().includes(q);
    });
  }, [gigs, clients, query]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gigs</h1>
            <p className="text-sm text-muted-foreground mt-1">Track active work and keep context close.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                New gig
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create gig</DialogTitle>
              </DialogHeader>
              <GigEditor
                clients={clients}
                submitLabel="Create"
                onSubmit={(values) => {
                  const created = createGig(values);
                  setCreateOpen(false);
                  toast({ title: "Gig created", description: created.title });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-xl">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search gigs..." />
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-14">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <Briefcase className="h-6 w-6" />
                </div>
                <p className="font-medium">No gigs</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Add a gig to connect tasks, payments, and proposals.
                </p>
                <Button className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first gig
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((g) => {
              const clientName = g.clientId ? clients.find((c) => c.id === g.clientId)?.name : undefined;
              return (
                <Card key={g.id} className="card-hover">
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base leading-tight">{g.title}</CardTitle>
                      <Badge variant="secondary">{statusLabel[g.status]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {clientName ?? "No client"} {g.rate ? <span className="text-muted-foreground">• ${g.rate}/hr</span> : null}
                    </p>
                    {g.notes && <p className="text-sm text-muted-foreground line-clamp-2">{g.notes}</p>}
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Updated {new Date(g.updatedAt).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(g)} aria-label="Edit gig">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          deleteGig(g.id);
                          toast({ title: "Gig deleted" });
                        }}
                        aria-label="Delete gig"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit gig</DialogTitle>
            </DialogHeader>
            {editing && (
              <GigEditor
                clients={clients}
                initial={editing}
                submitLabel="Save"
                onSubmit={(values) => {
                  updateGig(editing.id, values);
                  setEditing(null);
                  toast({ title: "Gig updated" });
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function GigEditor({
  clients,
  initial,
  submitLabel,
  onSubmit,
}: {
  clients: { id: string; name: string }[];
  initial?: Gig;
  submitLabel: string;
  onSubmit: (values: { title: string; clientId?: string; status: GigStatus; rate?: number; notes?: string }) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [clientId, setClientId] = useState<string>(initial?.clientId ?? "none");
  const [status, setStatus] = useState<GigStatus>(initial?.status ?? "active");
  const [rate, setRate] = useState(initial?.rate?.toString() ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const canSubmit = title.trim().length >= 2;
  const rateNumber = rate.trim() ? Number(rate) : undefined;
  const rateValid = rateNumber === undefined || (Number.isFinite(rateNumber) && rateNumber >= 0);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit || !rateValid) return;
        onSubmit({
          title: title.trim(),
          clientId: clientId === "none" ? undefined : clientId,
          status,
          rate: rateNumber,
          notes: notes.trim() || undefined,
        });
      }}
    >
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Landing page redesign" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Client</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No client</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as GigStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Rate (USD/hr)</Label>
        <Input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" placeholder="e.g. 125" />
        {!rateValid && <p className="text-xs text-muted-foreground">Rate must be a non-negative number.</p>}
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Scope, deliverables, contacts..." />
      </div>
      <div className="flex items-center justify-end">
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={!canSubmit || !rateValid}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}


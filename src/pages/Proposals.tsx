import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFreelanceStore, type Proposal, type ProposalStatus } from "@/stores/freelanceStore";
import { useMemo, useState } from "react";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusLabel: Record<ProposalStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  won: "Won",
  lost: "Lost",
};

export default function ProposalsPage() {
  const { toast } = useToast();
  const { proposals, clients, createProposal, updateProposal, deleteProposal } = useFreelanceStore();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Proposal | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return proposals;
    return proposals.filter((p) => {
      const clientName = p.clientId ? clients.find((c) => c.id === p.clientId)?.name ?? "" : "";
      return p.title.toLowerCase().includes(q) || clientName.toLowerCase().includes(q) || (p.notes ?? "").toLowerCase().includes(q);
    });
  }, [proposals, clients, query]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Proposals</h1>
            <p className="text-sm text-muted-foreground mt-1">Track what you send—and what converts.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                New proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create proposal</DialogTitle>
              </DialogHeader>
              <ProposalEditor
                clients={clients}
                submitLabel="Create"
                onSubmit={(values) => {
                  const created = createProposal(values);
                  setCreateOpen(false);
                  toast({ title: "Proposal created", description: created.title });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-xl">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search proposals..." />
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-14">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="font-medium">No proposals</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Create proposals to track outreach and outcomes.
                </p>
                <Button className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((p) => {
              const clientName = p.clientId ? clients.find((c) => c.id === p.clientId)?.name : undefined;
              return (
                <Card key={p.id} className="card-hover">
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base leading-tight">{p.title}</CardTitle>
                      <Badge variant="secondary">{statusLabel[p.status]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {clientName ?? "No client"}
                      {p.value !== undefined ? <span className="text-muted-foreground"> • ${p.value.toFixed(0)}</span> : null}
                      {p.sentDate ? <span className="text-muted-foreground"> • Sent {p.sentDate}</span> : null}
                    </p>
                    {p.notes && <p className="text-sm text-muted-foreground line-clamp-2">{p.notes}</p>}
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Updated {new Date(p.updatedAt).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(p)} aria-label="Edit proposal">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          deleteProposal(p.id);
                          toast({ title: "Proposal deleted" });
                        }}
                        aria-label="Delete proposal"
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
              <DialogTitle>Edit proposal</DialogTitle>
            </DialogHeader>
            {editing && (
              <ProposalEditor
                clients={clients}
                initial={editing}
                submitLabel="Save"
                onSubmit={(values) => {
                  updateProposal(editing.id, values);
                  setEditing(null);
                  toast({ title: "Proposal updated" });
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function ProposalEditor({
  clients,
  initial,
  submitLabel,
  onSubmit,
}: {
  clients: { id: string; name: string }[];
  initial?: Proposal;
  submitLabel: string;
  onSubmit: (values: { title: string; clientId?: string; status: ProposalStatus; value?: number; sentDate?: string; notes?: string }) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [clientId, setClientId] = useState<string>(initial?.clientId ?? "none");
  const [status, setStatus] = useState<ProposalStatus>(initial?.status ?? "draft");
  const [value, setValue] = useState(initial?.value?.toString() ?? "");
  const [sentDate, setSentDate] = useState(initial?.sentDate ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const canSubmit = title.trim().length >= 2;
  const valueNumber = value.trim() ? Number(value) : undefined;
  const valueValid = valueNumber === undefined || (Number.isFinite(valueNumber) && valueNumber >= 0);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit || !valueValid) return;
        onSubmit({
          title: title.trim(),
          clientId: clientId === "none" ? undefined : clientId,
          status,
          value: valueNumber,
          sentDate: sentDate || undefined,
          notes: notes.trim() || undefined,
        });
      }}
    >
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Web app redesign proposal" />
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
          <Select value={status} onValueChange={(v) => setStatus(v as ProposalStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Value (USD)</Label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} inputMode="decimal" placeholder="e.g. 8000" />
          {!valueValid && <p className="text-xs text-muted-foreground">Value must be a non-negative number.</p>}
        </div>
        <div className="space-y-2">
          <Label>Sent date</Label>
          <Input type="date" value={sentDate} onChange={(e) => setSentDate(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Scope, link to doc, follow-up dates..." />
      </div>
      <div className="flex items-center justify-end">
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={!canSubmit || !valueValid}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}


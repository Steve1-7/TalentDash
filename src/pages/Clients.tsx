import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFreelanceStore, type Client } from "@/stores/freelanceStore";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClientsPage() {
  const { toast } = useToast();
  const { clients, createClient, updateClient, deleteClient } = useFreelanceStore();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        (c.company ?? "").toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.notes ?? "").toLowerCase().includes(q)
      );
    });
  }, [clients, query]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
            <p className="text-sm text-muted-foreground mt-1">Keep relationships organized with lightweight notes.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                New client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create client</DialogTitle>
              </DialogHeader>
              <ClientEditor
                submitLabel="Create"
                onSubmit={(values) => {
                  const created = createClient(values);
                  setCreateOpen(false);
                  toast({ title: "Client created", description: created.name });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-xl">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search clients..." />
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-14">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <Users className="h-6 w-6" />
                </div>
                <p className="font-medium">No clients yet</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Add a client to connect gigs, proposals, and payments.
                </p>
                <Button className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first client
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((c) => (
              <Card key={c.id} className="card-hover">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {c.company ?? "—"} {c.email ? <span className="text-muted-foreground">• {c.email}</span> : null}
                  </p>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Updated {new Date(c.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditing(c)} aria-label="Edit client">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        deleteClient(c.id);
                        toast({ title: "Client deleted" });
                      }}
                      aria-label="Delete client"
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
              <DialogTitle>Edit client</DialogTitle>
            </DialogHeader>
            {editing && (
              <ClientEditor
                initial={editing}
                submitLabel="Save"
                onSubmit={(values) => {
                  updateClient(editing.id, values);
                  setEditing(null);
                  toast({ title: "Client updated" });
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function ClientEditor({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Client;
  submitLabel: string;
  onSubmit: (values: { name: string; email?: string; company?: string; notes?: string }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [company, setCompany] = useState(initial?.company ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const canSubmit = name.trim().length >= 2;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          name: name.trim(),
          email: email.trim() || undefined,
          company: company.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      }}
    >
      <div className="space-y-2">
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Client name" />
        {!canSubmit && <p className="text-xs text-muted-foreground">Name must be at least 2 characters.</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
        </div>
        <div className="space-y-2">
          <Label>Company</Label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Relationship context, next steps..." />
      </div>
      <div className="flex items-center justify-end">
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}


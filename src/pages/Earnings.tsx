import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFreelanceStore, type Earning } from "@/stores/freelanceStore";
import { useMemo, useState } from "react";
import { DollarSign, Pencil, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EarningsPage() {
  const { toast } = useToast();
  const { earnings, clients, gigs, createEarning, updateEarning, deleteEarning } = useFreelanceStore();
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Earning | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return earnings;
    return earnings.filter((e) => {
      const clientName = e.clientId ? clients.find((c) => c.id === e.clientId)?.name ?? "" : "";
      const gigTitle = e.gigId ? gigs.find((g) => g.id === e.gigId)?.title ?? "" : "";
      return (
        clientName.toLowerCase().includes(q) ||
        gigTitle.toLowerCase().includes(q) ||
        (e.notes ?? "").toLowerCase().includes(q)
      );
    });
  }, [earnings, clients, gigs, query]);

  const total = useMemo(() => earnings.reduce((sum, e) => sum + (e.amount || 0), 0), [earnings]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Earnings</h1>
            <p className="text-sm text-muted-foreground mt-1">Log payments and get instant totals.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Log earning
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Log earning</DialogTitle>
              </DialogHeader>
              <EarningEditor
                clients={clients}
                gigs={gigs}
                submitLabel="Log"
                onSubmit={(values) => {
                  const created = createEarning(values);
                  setCreateOpen(false);
                  toast({ title: "Earning logged", description: `$${created.amount.toFixed(2)}` });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search client, gig, notes..." />
          <Card>
            <CardContent className="py-3">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-semibold tabular-nums">${total.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-14">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                  <DollarSign className="h-6 w-6" />
                </div>
                <p className="font-medium">No earnings logged</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Log your first payment to unlock earnings insights.
                </p>
                <Button className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Log your first earning
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((e) => {
              const clientName = e.clientId ? clients.find((c) => c.id === e.clientId)?.name : undefined;
              const gigTitle = e.gigId ? gigs.find((g) => g.id === e.gigId)?.title : undefined;
              return (
                <Card key={e.id} className="card-hover">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-base">${e.amount.toFixed(2)}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {e.receivedDate} {clientName ? <span>• {clientName}</span> : null} {gigTitle ? <span>• {gigTitle}</span> : null}
                    </p>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Updated {new Date(e.updatedAt).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(e)} aria-label="Edit earning">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          deleteEarning(e.id);
                          toast({ title: "Earning deleted" });
                        }}
                        aria-label="Delete earning"
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
              <DialogTitle>Edit earning</DialogTitle>
            </DialogHeader>
            {editing && (
              <EarningEditor
                clients={clients}
                gigs={gigs}
                initial={editing}
                submitLabel="Save"
                onSubmit={(values) => {
                  updateEarning(editing.id, values);
                  setEditing(null);
                  toast({ title: "Earning updated" });
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function EarningEditor({
  clients,
  gigs,
  initial,
  submitLabel,
  onSubmit,
}: {
  clients: { id: string; name: string }[];
  gigs: { id: string; title: string }[];
  initial?: Earning;
  submitLabel: string;
  onSubmit: (values: { clientId?: string; gigId?: string; amount: number; receivedDate: string; notes?: string }) => void;
}) {
  const [clientId, setClientId] = useState<string>(initial?.clientId ?? "none");
  const [gigId, setGigId] = useState<string>(initial?.gigId ?? "none");
  const [amount, setAmount] = useState(initial ? initial.amount.toString() : "");
  const [receivedDate, setReceivedDate] = useState(initial?.receivedDate ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const amountNumber = Number(amount);
  const amountValid = Number.isFinite(amountNumber) && amountNumber >= 0;
  const canSubmit = amountValid && !!receivedDate;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          clientId: clientId === "none" ? undefined : clientId,
          gigId: gigId === "none" ? undefined : gigId,
          amount: amountNumber,
          receivedDate,
          notes: notes.trim() || undefined,
        });
      }}
    >
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
          <Label>Gig</Label>
          <Select value={gigId} onValueChange={setGigId}>
            <SelectTrigger>
              <SelectValue placeholder="Select gig" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No gig</SelectItem>
              {gigs.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Amount (USD)</Label>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="e.g. 2500" />
          {!amountValid && <p className="text-xs text-muted-foreground">Enter a valid non-negative amount.</p>}
        </div>
        <div className="space-y-2">
          <Label>Received date</Label>
          <Input type="date" value={receivedDate} onChange={(e) => setReceivedDate(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Invoice, payment method, context..." />
      </div>
      <div className="flex items-center justify-end">
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={!canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}


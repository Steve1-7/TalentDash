import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GigStatus = "active" | "paused" | "completed";
export type ProposalStatus = "draft" | "sent" | "won" | "lost";

export type Client = {
  id: string;
  name: string;
  email?: string;
  company?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Gig = {
  id: string;
  title: string;
  clientId?: string;
  status: GigStatus;
  rate?: number; // hourly USD
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Earning = {
  id: string;
  clientId?: string;
  gigId?: string;
  amount: number; // USD
  receivedDate: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Proposal = {
  id: string;
  title: string;
  clientId?: string;
  status: ProposalStatus;
  value?: number; // USD
  sentDate?: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

type FreelanceState = {
  clients: Client[];
  gigs: Gig[];
  earnings: Earning[];
  proposals: Proposal[];

  createClient: (input: Pick<Client, "name" | "email" | "company" | "notes">) => Client;
  updateClient: (id: string, updates: Partial<Pick<Client, "name" | "email" | "company" | "notes">>) => void;
  deleteClient: (id: string) => void;

  createGig: (input: Pick<Gig, "title" | "clientId" | "status" | "rate" | "notes">) => Gig;
  updateGig: (id: string, updates: Partial<Pick<Gig, "title" | "clientId" | "status" | "rate" | "notes">>) => void;
  deleteGig: (id: string) => void;

  createEarning: (input: Pick<Earning, "clientId" | "gigId" | "amount" | "receivedDate" | "notes">) => Earning;
  updateEarning: (id: string, updates: Partial<Pick<Earning, "clientId" | "gigId" | "amount" | "receivedDate" | "notes">>) => void;
  deleteEarning: (id: string) => void;

  createProposal: (input: Pick<Proposal, "title" | "clientId" | "status" | "value" | "sentDate" | "notes">) => Proposal;
  updateProposal: (id: string, updates: Partial<Pick<Proposal, "title" | "clientId" | "status" | "value" | "sentDate" | "notes">>) => void;
  deleteProposal: (id: string) => void;
};

export const useFreelanceStore = create<FreelanceState>()(
  persist(
    (set, get) => ({
      clients: [],
      gigs: [],
      earnings: [],
      proposals: [],

      createClient: (input) => {
        const now = new Date().toISOString();
        const client: Client = {
          id: crypto.randomUUID(),
          name: input.name.trim(),
          email: input.email?.trim() || undefined,
          company: input.company?.trim() || undefined,
          notes: input.notes?.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };
        set({ clients: [client, ...get().clients] });
        return client;
      },
      updateClient: (id, updates) => {
        const now = new Date().toISOString();
        set({
          clients: get().clients.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...updates,
                  name: updates.name !== undefined ? updates.name.trim() : c.name,
                  email: updates.email !== undefined ? updates.email.trim() || undefined : c.email,
                  company: updates.company !== undefined ? updates.company.trim() || undefined : c.company,
                  notes: updates.notes !== undefined ? updates.notes.trim() || undefined : c.notes,
                  updatedAt: now,
                }
              : c,
          ),
        });
      },
      deleteClient: (id) => {
        set({
          clients: get().clients.filter((c) => c.id !== id),
          gigs: get().gigs.map((g) => (g.clientId === id ? { ...g, clientId: undefined } : g)),
          earnings: get().earnings.map((e) => (e.clientId === id ? { ...e, clientId: undefined } : e)),
          proposals: get().proposals.map((p) => (p.clientId === id ? { ...p, clientId: undefined } : p)),
        });
      },

      createGig: (input) => {
        const now = new Date().toISOString();
        const gig: Gig = {
          id: crypto.randomUUID(),
          title: input.title.trim(),
          clientId: input.clientId || undefined,
          status: input.status,
          rate: input.rate,
          notes: input.notes?.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };
        set({ gigs: [gig, ...get().gigs] });
        return gig;
      },
      updateGig: (id, updates) => {
        const now = new Date().toISOString();
        set({
          gigs: get().gigs.map((g) =>
            g.id === id
              ? {
                  ...g,
                  ...updates,
                  title: updates.title !== undefined ? updates.title.trim() : g.title,
                  clientId: updates.clientId ?? g.clientId,
                  status: updates.status ?? g.status,
                  rate: updates.rate ?? g.rate,
                  notes: updates.notes !== undefined ? updates.notes.trim() || undefined : g.notes,
                  updatedAt: now,
                }
              : g,
          ),
        });
      },
      deleteGig: (id) => {
        set({
          gigs: get().gigs.filter((g) => g.id !== id),
          earnings: get().earnings.map((e) => (e.gigId === id ? { ...e, gigId: undefined } : e)),
        });
      },

      createEarning: (input) => {
        const now = new Date().toISOString();
        const earning: Earning = {
          id: crypto.randomUUID(),
          clientId: input.clientId || undefined,
          gigId: input.gigId || undefined,
          amount: input.amount,
          receivedDate: input.receivedDate,
          notes: input.notes?.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };
        set({ earnings: [earning, ...get().earnings] });
        return earning;
      },
      updateEarning: (id, updates) => {
        const now = new Date().toISOString();
        set({
          earnings: get().earnings.map((e) =>
            e.id === id
              ? {
                  ...e,
                  ...updates,
                  clientId: updates.clientId ?? e.clientId,
                  gigId: updates.gigId ?? e.gigId,
                  amount: updates.amount ?? e.amount,
                  receivedDate: updates.receivedDate ?? e.receivedDate,
                  notes: updates.notes !== undefined ? updates.notes.trim() || undefined : e.notes,
                  updatedAt: now,
                }
              : e,
          ),
        });
      },
      deleteEarning: (id) => set({ earnings: get().earnings.filter((e) => e.id !== id) }),

      createProposal: (input) => {
        const now = new Date().toISOString();
        const proposal: Proposal = {
          id: crypto.randomUUID(),
          title: input.title.trim(),
          clientId: input.clientId || undefined,
          status: input.status,
          value: input.value,
          sentDate: input.sentDate || undefined,
          notes: input.notes?.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };
        set({ proposals: [proposal, ...get().proposals] });
        return proposal;
      },
      updateProposal: (id, updates) => {
        const now = new Date().toISOString();
        set({
          proposals: get().proposals.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...updates,
                  title: updates.title !== undefined ? updates.title.trim() : p.title,
                  clientId: updates.clientId ?? p.clientId,
                  status: updates.status ?? p.status,
                  value: updates.value ?? p.value,
                  sentDate: updates.sentDate ?? p.sentDate,
                  notes: updates.notes !== undefined ? updates.notes.trim() || undefined : p.notes,
                  updatedAt: now,
                }
              : p,
          ),
        });
      },
      deleteProposal: (id) => set({ proposals: get().proposals.filter((p) => p.id !== id) }),
    }),
    { name: "talentdash-freelance" },
  ),
);


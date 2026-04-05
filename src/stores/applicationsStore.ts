import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ApplicationStatus = "draft" | "applied" | "interview" | "offer" | "rejected";

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  location?: string;
  url?: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

type ApplicationInput = {
  company: string;
  role: string;
  location?: string;
  url?: string;
  status?: ApplicationStatus;
  notes?: string;
};

type ApplicationsState = {
  applications: JobApplication[];
  createApplication: (input: ApplicationInput) => JobApplication;
  updateApplication: (id: string, updates: ApplicationInput) => void;
  deleteApplication: (id: string) => void;
};

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set, get) => ({
      applications: [],
      createApplication: (input) => {
        const now = new Date().toISOString();
        const app: JobApplication = {
          id: crypto.randomUUID(),
          company: input.company.trim(),
          role: input.role.trim(),
          location: input.location?.trim() || undefined,
          url: input.url?.trim() || undefined,
          status: input.status ?? "draft",
          notes: input.notes?.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };
        set({ applications: [app, ...get().applications] });
        return app;
      },
      updateApplication: (id, updates) => {
        const now = new Date().toISOString();
        set({
          applications: get().applications.map((a) =>
            a.id === id
              ? {
                  ...a,
                  ...updates,
                  company: updates.company !== undefined ? updates.company.trim() : a.company,
                  role: updates.role !== undefined ? updates.role.trim() : a.role,
                  location: updates.location !== undefined ? updates.location.trim() || undefined : a.location,
                  url: updates.url !== undefined ? updates.url.trim() || undefined : a.url,
                  notes: updates.notes !== undefined ? updates.notes.trim() || undefined : a.notes,
                  status: updates.status ?? a.status,
                  updatedAt: now,
                }
              : a,
          ),
        });
      },
      deleteApplication: (id) => set({ applications: get().applications.filter((a) => a.id !== id) }),
    }),
    { name: "talentdash-applications" },
  ),
);


import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CandidateStage = "applied" | "interview" | "offer" | "hired" | "rejected";

export type Candidate = {
  id: string;
  name: string;
  email?: string;
  title?: string;
  stage: CandidateStage;
  skills: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type JobPostStatus = "open" | "paused" | "closed";

export type JobPost = {
  id: string;
  title: string;
  location?: string;
  status: JobPostStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

type RecruiterState = {
  candidates: Candidate[];
  jobPosts: JobPost[];
  createCandidate: (input: Omit<Candidate, "id" | "createdAt" | "updatedAt">) => Candidate;
  updateCandidate: (id: string, updates: Partial<Omit<Candidate, "id" | "createdAt" | "updatedAt">>) => void;
  deleteCandidate: (id: string) => void;
  createJobPost: (input: Omit<JobPost, "id" | "createdAt" | "updatedAt">) => JobPost;
  updateJobPost: (id: string, updates: Partial<Omit<JobPost, "id" | "createdAt" | "updatedAt">>) => void;
  deleteJobPost: (id: string) => void;
};

export const useRecruiterStore = create<RecruiterState>()(
  persist(
    (set, get) => ({
      candidates: [],
      jobPosts: [],
      createCandidate: (input) => {
        const now = new Date().toISOString();
        const c: Candidate = {
          id: crypto.randomUUID(),
          ...input,
          name: input.name.trim(),
          email: input.email?.trim() || undefined,
          title: input.title?.trim() || undefined,
          notes: input.notes?.trim() || undefined,
          skills: input.skills ?? [],
          createdAt: now,
          updatedAt: now,
        };
        set({ candidates: [c, ...get().candidates] });
        return c;
      },
      updateCandidate: (id, updates) => {
        const now = new Date().toISOString();
        set({
          candidates: get().candidates.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...updates,
                  name: updates.name !== undefined ? updates.name.trim() : c.name,
                  email: updates.email !== undefined ? updates.email.trim() || undefined : c.email,
                  title: updates.title !== undefined ? updates.title.trim() || undefined : c.title,
                  notes: updates.notes !== undefined ? updates.notes.trim() || undefined : c.notes,
                  skills: updates.skills ?? c.skills,
                  stage: updates.stage ?? c.stage,
                  updatedAt: now,
                }
              : c,
          ),
        });
      },
      deleteCandidate: (id) => set({ candidates: get().candidates.filter((c) => c.id !== id) }),

      createJobPost: (input) => {
        const now = new Date().toISOString();
        const jp: JobPost = {
          id: crypto.randomUUID(),
          ...input,
          title: input.title.trim(),
          location: input.location?.trim() || undefined,
          description: input.description?.trim() || undefined,
          createdAt: now,
          updatedAt: now,
        };
        set({ jobPosts: [jp, ...get().jobPosts] });
        return jp;
      },
      updateJobPost: (id, updates) => {
        const now = new Date().toISOString();
        set({
          jobPosts: get().jobPosts.map((jp) =>
            jp.id === id
              ? {
                  ...jp,
                  ...updates,
                  title: updates.title !== undefined ? updates.title.trim() : jp.title,
                  location: updates.location !== undefined ? updates.location.trim() || undefined : jp.location,
                  description: updates.description !== undefined ? updates.description.trim() || undefined : jp.description,
                  status: updates.status ?? jp.status,
                  updatedAt: now,
                }
              : jp,
          ),
        });
      },
      deleteJobPost: (id) => set({ jobPosts: get().jobPosts.filter((jp) => jp.id !== id) }),
    }),
    { name: "promptlyos-recruiter" },
  ),
);


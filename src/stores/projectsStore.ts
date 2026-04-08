import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProjectStatus = "active" | "paused" | "completed" | "archived";

export type Project = {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

type ProjectInput = {
  name: string;
  description?: string;
  status?: ProjectStatus;
  tags?: string[];
};

type ProjectsState = {
  projects: Project[];
  createProject: (input: ProjectInput) => Project;
  updateProject: (id: string, updates: ProjectInput) => void;
  deleteProject: (id: string) => void;
  archiveProject: (id: string) => void;
};

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: [],
      createProject: (input) => {
        const now = new Date().toISOString();
        const project: Project = {
          id: crypto.randomUUID(),
          name: input.name.trim(),
          description: input.description?.trim() || undefined,
          status: input.status ?? "active",
          tags: input.tags ?? [],
          createdAt: now,
          updatedAt: now,
        };
        set({ projects: [project, ...get().projects] });
        return project;
      },
      updateProject: (id, updates) => {
        const now = new Date().toISOString();
        set({
          projects: get().projects.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...updates,
                  name: updates.name !== undefined ? updates.name.trim() : p.name,
                  description:
                    updates.description !== undefined ? updates.description.trim() || undefined : p.description,
                  tags: updates.tags ?? p.tags,
                  status: updates.status ?? p.status,
                  updatedAt: now,
                }
              : p,
          ),
        });
      },
      deleteProject: (id) => set({ projects: get().projects.filter((p) => p.id !== id) }),
      archiveProject: (id) => {
        const project = get().projects.find(p => p.id === id);
        if (project) {
          get().updateProject(id, { name: project.name, status: "archived" });
        }
      },
    }),
    { name: "promptlyos-projects" },
  ),
);


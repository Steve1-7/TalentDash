import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  dueDate?: string; // ISO date string (YYYY-MM-DD)
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

type TaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  dueDate?: string;
  tags?: string[];
};

type TasksState = {
  tasks: Task[];
  createTask: (input: TaskInput) => Task;
  updateTask: (id: string, updates: TaskInput) => void;
  deleteTask: (id: string) => void;
};

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      createTask: (input) => {
        const now = new Date().toISOString();
        const task: Task = {
          id: crypto.randomUUID(),
          title: input.title.trim(),
          description: input.description?.trim() || undefined,
          status: input.status ?? "todo",
          priority: input.priority ?? "medium",
          projectId: input.projectId || undefined,
          dueDate: input.dueDate || undefined,
          tags: input.tags ?? [],
          createdAt: now,
          updatedAt: now,
        };
        set({ tasks: [task, ...get().tasks] });
        return task;
      },
      updateTask: (id, updates) => {
        const now = new Date().toISOString();
        set({
          tasks: get().tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...updates,
                  title: updates.title !== undefined ? updates.title.trim() : t.title,
                  description:
                    updates.description !== undefined ? updates.description.trim() || undefined : t.description,
                  tags: updates.tags ?? t.tags,
                  status: updates.status ?? t.status,
                  priority: updates.priority ?? t.priority,
                  projectId: updates.projectId ?? t.projectId,
                  dueDate: updates.dueDate ?? t.dueDate,
                  updatedAt: now,
                }
              : t,
          ),
        });
      },
      deleteTask: (id) => set({ tasks: get().tasks.filter((t) => t.id !== id) }),
    }),
    { name: "talentdash-tasks" },
  ),
);


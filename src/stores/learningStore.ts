import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LearningGoalStatus = "planned" | "active" | "completed";

export type LearningGoal = {
  id: string;
  title: string;
  description?: string;
  status: LearningGoalStatus;
  targetDate?: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
};

type LearningGoalInput = {
  title: string;
  description?: string;
  status?: LearningGoalStatus;
  targetDate?: string;
};

type LearningState = {
  goals: LearningGoal[];
  createGoal: (input: LearningGoalInput) => LearningGoal;
  updateGoal: (id: string, updates: LearningGoalInput) => void;
  deleteGoal: (id: string) => void;
};

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      goals: [],
      createGoal: (input) => {
        const now = new Date().toISOString();
        const goal: LearningGoal = {
          id: crypto.randomUUID(),
          title: input.title.trim(),
          description: input.description?.trim() || undefined,
          status: input.status ?? "planned",
          targetDate: input.targetDate || undefined,
          createdAt: now,
          updatedAt: now,
        };
        set({ goals: [goal, ...get().goals] });
        return goal;
      },
      updateGoal: (id, updates) => {
        const now = new Date().toISOString();
        set({
          goals: get().goals.map((g) =>
            g.id === id
              ? {
                  ...g,
                  ...updates,
                  title: updates.title !== undefined ? updates.title.trim() : g.title,
                  description:
                    updates.description !== undefined ? updates.description.trim() || undefined : g.description,
                  status: updates.status ?? g.status,
                  targetDate: updates.targetDate ?? g.targetDate,
                  updatedAt: now,
                }
              : g,
          ),
        });
      },
      deleteGoal: (id) => set({ goals: get().goals.filter((g) => g.id !== id) }),
    }),
    { name: "promptlyos-learning" },
  ),
);


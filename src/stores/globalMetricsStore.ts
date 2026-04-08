import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import { useFreelanceStore } from './freelanceStore';
import { useRecruiterStore } from './recruiterStore';
import { useProjectsStore } from './projectsStore';
import { useApplicationsStore } from './applicationsStore';

export type RoleMetrics = {
  developer: {
    activeProjects: number;
    completedProjects: number;
    skillGapCount: number;
    githubCommits: number;
    learningHours: number;
  };
  freelancer: {
    activeGigs: number;
    potentialRevenue: number;
    activePipeline: number;
    leadConversion: number;
    averageRate: number;
  };
  recruiter: {
    activeCandidates: number;
    openPositions: number;
    avgTimeToHire: number;
    vettingEfficiency: number;
    talentMatchScore: number;
  };
  manager: {
    teamVelocity: number;
    activeProjects: number;
    resourceUtilization: number;
    teamSize: number;
    performanceScore: number;
  };
};

type GlobalMetricsState = {
  metrics: RoleMetrics;
  lastUpdated: string;
  autoUpdateEnabled: boolean;
  updateMetrics: () => void;
  getRoleMetrics: (role: keyof RoleMetrics) => RoleMetrics[keyof RoleMetrics];
  incrementMetric: (role: keyof RoleMetrics, metric: string, value?: number) => void;
  setAutoUpdate: (enabled: boolean) => void;
};

const defaultMetrics: RoleMetrics = {
  developer: {
    activeProjects: 0,
    completedProjects: 0,
    skillGapCount: 0,
    githubCommits: 0,
    learningHours: 0,
  },
  freelancer: {
    activeGigs: 0,
    potentialRevenue: 0,
    activePipeline: 0,
    leadConversion: 0,
    averageRate: 0,
  },
  recruiter: {
    activeCandidates: 0,
    openPositions: 0,
    avgTimeToHire: 0,
    vettingEfficiency: 0,
    talentMatchScore: 0,
  },
  manager: {
    teamVelocity: 0,
    activeProjects: 0,
    resourceUtilization: 0,
    teamSize: 0,
    performanceScore: 0,
  },
};

export const useGlobalMetricsStore = create<GlobalMetricsState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        metrics: defaultMetrics,
        lastUpdated: new Date().toISOString(),
        autoUpdateEnabled: true,

        updateMetrics: () => {
          const { user } = useAuthStore.getState();
          if (!user) return;

          const freelanceState = useFreelanceStore.getState();
          const recruiterState = useRecruiterStore.getState();
          const projectsState = useProjectsStore.getState();
          const applicationsState = useApplicationsStore.getState();

          const updatedMetrics = { ...get().metrics };

          // Update freelancer metrics
          updatedMetrics.freelancer = {
            activeGigs: freelanceState.gigs.filter(g => g.status === 'active').length,
            potentialRevenue: freelanceState.gigs
              .filter(g => g.status === 'active' && g.rate)
              .reduce((sum, g) => sum + (g.rate || 0) * 160, 0), // assuming 160 hours/month
            activePipeline: freelanceState.proposals.filter(p => p.status === 'sent').length,
            leadConversion: freelanceState.proposals.length > 0 
              ? (freelanceState.proposals.filter(p => p.status === 'won').length / freelanceState.proposals.length) * 100 
              : 0,
            averageRate: freelanceState.gigs.filter(g => g.rate).length > 0
              ? freelanceState.gigs.filter(g => g.rate).reduce((sum, g) => sum + (g.rate || 0), 0) / freelanceState.gigs.filter(g => g.rate).length
              : 0,
          };

          // Update recruiter metrics
          updatedMetrics.recruiter = {
            activeCandidates: recruiterState.candidates.filter(c => 
              ['applied', 'interview', 'offer'].includes(c.stage)
            ).length,
            openPositions: recruiterState.jobPosts.filter(jp => jp.status === 'open').length,
            avgTimeToHire: 14, // placeholder - would calculate from actual data
            vettingEfficiency: 85, // placeholder - would calculate from actual data
            talentMatchScore: 78, // placeholder - would calculate from actual data
          };

          // Update developer/manager metrics
          updatedMetrics.developer = {
            activeProjects: projectsState.projects.filter(p => p.status === 'active').length,
            completedProjects: projectsState.projects.filter(p => p.status === 'completed').length,
            skillGapCount: 3, // placeholder - would calculate from skills vs job requirements
            githubCommits: 42, // placeholder - would integrate with GitHub API
            learningHours: 12, // placeholder - would sum from learning store
          };

          updatedMetrics.manager = {
            teamVelocity: 87, // placeholder - would calculate from team performance
            activeProjects: projectsState.projects.filter(p => p.status === 'active').length,
            resourceUtilization: 75, // placeholder - would calculate from team allocation
            teamSize: 8, // placeholder - would count team members
            performanceScore: 92, // placeholder - would calculate from performance metrics
          };

          set({
            metrics: updatedMetrics,
            lastUpdated: new Date().toISOString(),
          });
        },

        getRoleMetrics: (role) => {
          return get().metrics[role];
        },

        incrementMetric: (role, metric, value = 1) => {
          const currentMetrics = get().metrics;
          const updatedMetrics = {
            ...currentMetrics,
            [role]: {
              ...currentMetrics[role],
              [metric]: (currentMetrics[role] as any)[metric] + value,
            },
          };
          set({
            metrics: updatedMetrics,
            lastUpdated: new Date().toISOString(),
          });
        },

        setAutoUpdate: (enabled) => {
          set({ autoUpdateEnabled: enabled });
        },
      }),
      { name: 'promptlyos-global-metrics' }
    )
  )
);

// Auto-update subscription
useFreelanceStore.subscribe(
  (state) => state.gigs,
  () => {
    if (useGlobalMetricsStore.getState().autoUpdateEnabled) {
      useGlobalMetricsStore.getState().updateMetrics();
    }
  }
);

useFreelanceStore.subscribe(
  (state) => state.proposals,
  () => {
    if (useGlobalMetricsStore.getState().autoUpdateEnabled) {
      useGlobalMetricsStore.getState().updateMetrics();
    }
  }
);

useRecruiterStore.subscribe(
  (state) => state.candidates,
  () => {
    if (useGlobalMetricsStore.getState().autoUpdateEnabled) {
      useGlobalMetricsStore.getState().updateMetrics();
    }
  }
);

useProjectsStore.subscribe(
  (state) => state.projects,
  () => {
    if (useGlobalMetricsStore.getState().autoUpdateEnabled) {
      useGlobalMetricsStore.getState().updateMetrics();
    }
  }
);

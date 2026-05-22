export type GoalStatus = 'active' | 'completed' | 'archived';

export interface Goal {
  id: string;
  title: string;
  status: GoalStatus;
  startDate: string;
  endDate: string;
  effectiveMinutesPerDay: number;
  currentLevel: number;
  createdAt: number;
  updatedAt: number;
}

export interface Action {
  id: string;
  goalId: string;
  title: string;
  icon: string;
  startDate: string;
  endDate: string;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
}

export interface ActionLog {
  id: string;
  actionId: string;
  date: string;
  minutes: number;
  note: string;
  createdAt: number;
  updatedAt: number;
}

export interface Principle {
  id: string;
  content: string;
  keywords: string[];
  hitCount: number;
  lastHitAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export type AchievementType = 'goal_completed' | 'milestone' | 'manual';

export interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  goalId: string | null;
  unlockedAt: number | null;
  createdAt: number;
  updatedAt: number;
}
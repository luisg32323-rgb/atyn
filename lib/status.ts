import type { PaceStatus, TrendStatus } from '@/constants/theme';
import { progressRatio, pursuitActionCounts, allPursuitsActionCounts } from '@/lib/progress';
import type { Pursuit } from '@/types';

/** Demo week target: ~3 actions/day across active pursuits (soft). */
const WEEK_TARGET = 12;

export function weekCompleted(pursuits: Pursuit[]): number {
  // Local-first demo: treat completed actions as this-week evidence.
  return allPursuitsActionCounts(pursuits.filter((p) => p.status === 'active')).completed;
}

export function weekProgress(pursuits: Pursuit[]): {
  completed: number;
  target: number;
  ratio: number;
} {
  const completed = weekCompleted(pursuits);
  return { completed, target: WEEK_TARGET, ratio: progressRatio(completed, WEEK_TARGET) };
}

export function derivePace(pursuits: Pursuit[]): PaceStatus {
  const { ratio } = weekProgress(pursuits);
  if (ratio >= 1) return 'Ahead';
  if (ratio >= 0.45) return 'On track';
  return 'Behind';
}

export function deriveTrend(pursuits: Pursuit[]): TrendStatus {
  const active = pursuits.filter((p) => p.status === 'active');
  if (active.length === 0) return 'Steady';
  const ratios = active.map((p) => {
    const c = pursuitActionCounts(p);
    return progressRatio(c.completed, c.total);
  });
  const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  // Heuristic: recently updated + decent completion → Rising; sparse → Slipping.
  const recentlyTouched = active.some((p) => {
    const age = Date.now() - new Date(p.updatedAt).getTime();
    return age < 1000 * 60 * 60 * 48;
  });
  if (avg >= 0.55 && recentlyTouched) return 'Rising';
  if (avg < 0.25) return 'Slipping';
  return 'Steady';
}

export function momentumSummary(pursuits: Pursuit[]): {
  pace: PaceStatus;
  trend: TrendStatus;
  week: ReturnType<typeof weekProgress>;
} {
  return {
    pace: derivePace(pursuits),
    trend: deriveTrend(pursuits),
    week: weekProgress(pursuits),
  };
}

export function pursuitTrajectory(pursuit: Pursuit): {
  pace: PaceStatus;
  trend: TrendStatus;
  ratio: number;
} {
  const c = pursuitActionCounts(pursuit);
  const ratio = progressRatio(c.completed, c.total);
  const pace: PaceStatus = ratio >= 0.75 ? 'Ahead' : ratio >= 0.35 ? 'On track' : 'Behind';
  const age = Date.now() - new Date(pursuit.updatedAt).getTime();
  const recentlyTouched = age < 1000 * 60 * 60 * 72;
  const trend: TrendStatus =
    ratio >= 0.5 && recentlyTouched ? 'Rising' : ratio < 0.2 ? 'Slipping' : 'Steady';
  return { pace, trend, ratio };
}

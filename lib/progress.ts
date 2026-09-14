import type { Pursuit } from '@/types';

/** Evidence-based progress: completed actions / total actions. Momentum is intentionally excluded. */
export function pursuitActionCounts(pursuit: Pursuit): { completed: number; total: number } {
  let completed = 0;
  let total = 0;
  for (const m of pursuit.milestones) {
    for (const a of m.actions) {
      total += 1;
      if (a.done) completed += 1;
    }
  }
  return { completed, total };
}

export function allPursuitsActionCounts(pursuits: Pursuit[]): { completed: number; total: number } {
  return pursuits.reduce(
    (acc, p) => {
      const c = pursuitActionCounts(p);
      return { completed: acc.completed + c.completed, total: acc.total + c.total };
    },
    { completed: 0, total: 0 },
  );
}

export function progressRatio(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(1, completed / total);
}

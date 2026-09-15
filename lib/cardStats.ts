import { allPursuitsActionCounts, progressRatio, pursuitActionCounts } from '@/lib/progress';
import type { Persona, Pursuit } from '@/types';

/** Six life-category stats shown on the ATYN Card (2b). */
export const CARD_CATEGORIES = [
  { key: 'body', label: 'Body' },
  { key: 'mind', label: 'Mind' },
  { key: 'craft', label: 'Craft' },
  { key: 'wealth', label: 'Wealth' },
  { key: 'bond', label: 'Bond' },
  { key: 'grit', label: 'Grit' },
] as const;

export type CardCategoryKey = (typeof CARD_CATEGORIES)[number]['key'];

export type CategoryStat = {
  key: CardCategoryKey;
  label: string;
  value: number; // 0–99
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Soft keyword → category bias for demo scoring. */
const KEYWORDS: Record<CardCategoryKey, string[]> = {
  body: ['gym', 'run', 'health', 'sleep', 'train', 'fit', 'body', 'walk'],
  mind: ['read', 'meditat', 'journal', 'learn', 'study', 'focus', 'mind'],
  craft: ['build', 'ship', 'code', 'design', 'write', 'craft', 'skill', 'project'],
  wealth: ['money', 'save', 'budget', 'invest', 'career', 'job', 'wealth', 'finance'],
  bond: ['friend', 'family', 'date', 'call', 'community', 'relationship', 'bond'],
  grit: ['habit', 'discipline', 'morning', 'lock', 'routine', 'grit', 'consist'],
};

function categoryHits(text: string, key: CardCategoryKey): number {
  const lower = text.toLowerCase();
  return KEYWORDS[key].reduce((n, k) => (lower.includes(k) ? n + 1 : n), 0);
}

function baseFromEvidence(pursuits: Pursuit[]): number {
  const { completed, total } = allPursuitsActionCounts(pursuits);
  const ratio = progressRatio(completed, total);
  // Floor so empty cards aren't all zeros; evidence lifts the score.
  return Math.round(42 + ratio * 48);
}

export function computeCategoryStats(pursuits: Pursuit[], persona: Persona | null): CategoryStat[] {
  const base = baseFromEvidence(pursuits);
  const blob = [
    persona?.role ?? '',
    persona?.becoming ?? '',
    ...pursuits.flatMap((p) => [
      p.title,
      p.why,
      ...p.milestones.flatMap((m) => [m.title, ...m.actions.map((a) => a.title)]),
    ]),
  ].join(' ');

  return CARD_CATEGORIES.map((cat) => {
    const hits = categoryHits(blob, cat.key);
    const pursuitBoost = pursuits.reduce((acc, p) => {
      const c = pursuitActionCounts(p);
      const text = `${p.title} ${p.why}`;
      if (categoryHits(text, cat.key) === 0) return acc;
      return acc + progressRatio(c.completed, c.total) * 8;
    }, 0);
    const jitter = (hashString(`${cat.key}:${persona?.role ?? 'x'}`) % 7) - 3;
    const value = Math.max(10, Math.min(99, Math.round(base + hits * 4 + pursuitBoost + jitter)));
    return { key: cat.key, label: cat.label, value };
  });
}

export function computeOvr(stats: CategoryStat[]): number {
  if (stats.length === 0) return 0;
  const avg = stats.reduce((a, s) => a + s.value, 0) / stats.length;
  return Math.round(avg);
}

export function cardDisplayName(persona: Persona | null): string {
  const role = persona?.role?.trim();
  if (role) return role;
  return 'Your card';
}

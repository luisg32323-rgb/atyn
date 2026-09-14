import type { Persona } from '@/types';

/** Completeness: role + becoming are required for v1. */
export function isPersonaComplete(persona: Persona | null | undefined): boolean {
  if (!persona) return false;
  return persona.role.trim().length > 0 && persona.becoming.trim().length > 0;
}

export function personaCompleteness(persona: Persona | null | undefined): {
  complete: boolean;
  filled: number;
  total: number;
  missing: string[];
} {
  const total = 2;
  const missing: string[] = [];
  if (!persona?.role?.trim()) missing.push('role');
  if (!persona?.becoming?.trim()) missing.push('becoming');
  const filled = total - missing.length;
  return { complete: missing.length === 0, filled, total, missing };
}

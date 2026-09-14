import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createId } from '@/lib/id';
import { isPersonaComplete } from '@/lib/persona';
import { clearAppState, loadAppState, saveAppState } from '@/lib/storage';
import type {
  ActionItem,
  AppSession,
  AppState,
  Milestone,
  Persona,
  Pursuit,
  PursuitStatus,
} from '@/types';
import { emptyAppState } from '@/types';

type AppContextValue = {
  ready: boolean;
  session: AppSession | null;
  persona: Persona | null;
  pursuits: Pursuit[];
  personaComplete: boolean;
  enterDemo: () => Promise<void>;
  stubEmailSignIn: (email: string) => Promise<void>;
  stubAppleSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
  savePersona: (input: { role: string; becoming: string }) => Promise<void>;
  addPursuit: (input: {
    title: string;
    why: string;
    status?: PursuitStatus;
    milestones?: Milestone[];
  }) => Promise<Pursuit>;
  updatePursuit: (
    id: string,
    patch: Partial<Pick<Pursuit, 'title' | 'why' | 'status' | 'milestones'>>,
  ) => Promise<void>;
  deletePursuit: (id: string) => Promise<void>;
  toggleAction: (pursuitId: string, milestoneId: string, actionId: string) => Promise<void>;
  getPursuit: (id: string) => Pursuit | undefined;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<AppState>(emptyAppState());
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const loaded = await loadAppState();
      if (!cancelled) {
        setState(loaded);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: AppState) => {
    setState(next);
    stateRef.current = next;
    await saveAppState(next);
  }, []);

  const enterDemo = useCallback(async () => {
    await persist({
      ...stateRef.current,
      session: { mode: 'demo', signedInAt: new Date().toISOString() },
    });
  }, [persist]);

  const stubEmailSignIn = useCallback(
    async (email: string) => {
      await persist({
        ...stateRef.current,
        session: {
          mode: 'stub',
          email: email.trim(),
          signedInAt: new Date().toISOString(),
        },
      });
    },
    [persist],
  );

  const stubAppleSignIn = useCallback(async () => {
    await persist({
      ...stateRef.current,
      session: {
        mode: 'stub',
        email: 'apple@local.demo',
        signedInAt: new Date().toISOString(),
      },
    });
  }, [persist]);

  const signOut = useCallback(async () => {
    await clearAppState();
    const empty = emptyAppState();
    setState(empty);
    stateRef.current = empty;
  }, []);

  const savePersona = useCallback(
    async (input: { role: string; becoming: string }) => {
      const persona: Persona = {
        role: input.role.trim(),
        becoming: input.becoming.trim(),
        updatedAt: new Date().toISOString(),
      };
      await persist({ ...stateRef.current, persona });
    },
    [persist],
  );

  const addPursuit = useCallback(
    async (input: {
      title: string;
      why: string;
      status?: PursuitStatus;
      milestones?: Milestone[];
    }) => {
      const now = new Date().toISOString();
      const pursuit: Pursuit = {
        id: createId('pursuit'),
        title: input.title.trim(),
        why: input.why.trim(),
        status: input.status ?? 'active',
        milestones: input.milestones ?? [
          {
            id: createId('ms'),
            title: 'First milestone',
            actions: [{ id: createId('act'), title: 'Take the first step', done: false }],
          },
        ],
        createdAt: now,
        updatedAt: now,
      };
      await persist({ ...stateRef.current, pursuits: [pursuit, ...stateRef.current.pursuits] });
      return pursuit;
    },
    [persist],
  );

  const updatePursuit = useCallback(
    async (
      id: string,
      patch: Partial<Pick<Pursuit, 'title' | 'why' | 'status' | 'milestones'>>,
    ) => {
      const pursuits = stateRef.current.pursuits.map((p) =>
        p.id === id
          ? {
              ...p,
              ...patch,
              title: patch.title !== undefined ? patch.title.trim() : p.title,
              why: patch.why !== undefined ? patch.why.trim() : p.why,
              updatedAt: new Date().toISOString(),
            }
          : p,
      );
      await persist({ ...stateRef.current, pursuits });
    },
    [persist],
  );

  const deletePursuit = useCallback(
    async (id: string) => {
      await persist({
        ...stateRef.current,
        pursuits: stateRef.current.pursuits.filter((p) => p.id !== id),
      });
    },
    [persist],
  );

  const toggleAction = useCallback(
    async (pursuitId: string, milestoneId: string, actionId: string) => {
      const pursuits = stateRef.current.pursuits.map((p) => {
        if (p.id !== pursuitId) return p;
        const milestones = p.milestones.map((m) => {
          if (m.id !== milestoneId) return m;
          const actions: ActionItem[] = m.actions.map((a) =>
            a.id === actionId ? { ...a, done: !a.done } : a,
          );
          return { ...m, actions };
        });
        return { ...p, milestones, updatedAt: new Date().toISOString() };
      });
      await persist({ ...stateRef.current, pursuits });
    },
    [persist],
  );

  const getPursuit = useCallback(
    (id: string) => state.pursuits.find((p) => p.id === id),
    [state.pursuits],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      session: state.session,
      persona: state.persona,
      pursuits: state.pursuits,
      personaComplete: isPersonaComplete(state.persona),
      enterDemo,
      stubEmailSignIn,
      stubAppleSignIn,
      signOut,
      savePersona,
      addPursuit,
      updatePursuit,
      deletePursuit,
      toggleAction,
      getPursuit,
    }),
    [
      ready,
      state.session,
      state.persona,
      state.pursuits,
      enterDemo,
      stubEmailSignIn,
      stubAppleSignIn,
      signOut,
      savePersona,
      addPursuit,
      updatePursuit,
      deletePursuit,
      toggleAction,
      getPursuit,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

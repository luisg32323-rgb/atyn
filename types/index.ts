export type PursuitStatus = 'active' | 'paused' | 'completed';

export type Persona = {
  role: string;
  becoming: string;
  updatedAt: string;
};

export type ActionItem = {
  id: string;
  title: string;
  done: boolean;
};

export type Milestone = {
  id: string;
  title: string;
  actions: ActionItem[];
};

export type Pursuit = {
  id: string;
  title: string;
  why: string;
  status: PursuitStatus;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
};

export type AppSession = {
  mode: 'demo' | 'stub';
  email?: string;
  signedInAt: string;
};

export type AppState = {
  session: AppSession | null;
  persona: Persona | null;
  pursuits: Pursuit[];
};

export function emptyAppState(): AppState {
  return {
    session: null,
    persona: null,
    pursuits: [],
  };
}

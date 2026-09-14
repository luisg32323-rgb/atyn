# ATYN (Expo) — Persona → Pursuits → Card v1

Local-first Expo Router + TypeScript app. Dark UI via React Native `StyleSheet` (no NativeWind). Demo mode runs without Supabase keys.

## v1 scope

| Area | Behavior |
|------|----------|
| **Auth** | Stubbed email magic link + Apple placeholders; **Continue in demo mode** for offline loop |
| **Persona** | `role` + `becoming` required; completeness = filled/2 |
| **Pursuit** | `title`, `why`, `status`, milestones with **checkable actions** |
| **ATYN Card** | Shows role/becoming + evidence progress (`completed actions / total`); **Momentum hidden** |
| **Progress tab** | Stub only |
| **Persistence** | AsyncStorage local-first |
| **Out of scope** | Fake Coach inventing persona, NativeWind, Momentum, real Supabase (keys via `.env.example` later) |

## Tabs

1. **Today** — persona snapshot, active pursuits, next open actions  
2. **Pursuits** — list / create / open detail  
3. **Card** — ATYN Card v1  
4. **Progress** — stub  
5. **Persona** — edit role/becoming, sign out / reset local data  

## Run

```bash
cd atyn
npm install
npx expo start
```

- Press `i` / `a` / `w` for iOS simulator, Android emulator, or web.  
- First launch → **Continue in demo mode** → set Persona → add a Pursuit → check actions → see Card progress.

Typecheck:

```bash
npx tsc --noEmit
```

## Future Supabase

Copy `.env.example` → `.env` and fill when wiring auth/sync. Demo mode ignores these keys.

## Repo

Chief pushes to `https://github.com/luisg32323-rgb/atyn`. Do not git push from scaffolding agents unless asked.

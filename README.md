# ATYN (Expo) — Persona → Pursuits → Card

Local-first Expo Router + TypeScript app. **Design-aligned UI** (Claude Design tokens: Paper/Ink/Slate/Accent/Foil) via React Native `StyleSheet` — light Paper canvas, no dark scaffold, no NativeWind. Demo mode runs without Supabase keys.

## Design

| Token | Hex |
|-------|-----|
| Ink | `#1C1B19` |
| Paper | `#F0EFEA` (app background) |
| Slate | `#2A2823` |
| Accent | `#4A6FA5` |
| Foil | `#7E9CC4` |

Type roles: Display / Numeral (mono scores) / Title / Heading / Body. Status labels: **Ahead / On track / Behind** and **Rising / Steady / Slipping**. Spacing scale: 4–32.

## v1 scope

| Area | Behavior |
|------|----------|
| **Auth** | Stubbed email magic link + Apple placeholders; **Continue in demo mode** for offline loop |
| **Persona** | `role` + `becoming` required; completeness = filled/2 |
| **Today** | Momentum, this-week progress, priority actions, insight; complete/reschedule sheets |
| **Pursuits** | List + detail with trajectory; AI draft accept/edit/reject stubs; evidence sheet stub |
| **ATYN Card** | Name, OVR, six category stats, Share + How it works + Breakdown |
| **Persistence** | AsyncStorage local-first |
| **Out of scope** | Paywall, full Coach, separate 1a/1b/1c paths (Card tab is 2b) |

## Tabs

1. **Today** — momentum, week, priorities, insight  
2. **Pursuits** — list / create / detail  
3. **Card** — ATYN Card (2b)  
4. **Persona** — edit role/becoming, sign out / reset local data  

## Run

```bash
cd atyn
npm install
npx expo start
```

- Press `i` / `a` / `w` for iOS simulator, Android emulator, or web.  
- First launch → **Continue in demo mode** → set Persona → add a Pursuit → check actions → see Card OVR.

Typecheck:

```bash
npx tsc --noEmit
```

## Future Supabase

Copy `.env.example` → `.env` and fill when wiring auth/sync. Demo mode ignores these keys.

## Repo

Chief pushes to `https://github.com/luisg32323-rgb/atyn`. Do not git push from scaffolding agents unless asked.

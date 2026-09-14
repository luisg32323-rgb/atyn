/** Dark-first ATYN UI tokens (StyleSheet only — no NativeWind). */
export const colors = {
  bg: '#0B0D10',
  surface: '#151A21',
  surfaceElevated: '#1C232D',
  border: '#2A3340',
  text: '#F2F4F7',
  textMuted: '#9AA3B2',
  textDim: '#6B7380',
  accent: '#6EE7B7',
  accentDim: '#34D399',
  danger: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',
  tabInactive: '#6B7380',
  progressTrack: '#2A3340',
  progressFill: '#6EE7B7',
  inputBg: '#10151C',
  chip: '#243041',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const typography = {
  title: { fontSize: 28, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: 22, fontWeight: '600' as const, color: colors.text },
  h3: { fontSize: 18, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 16, fontWeight: '400' as const, color: colors.text },
  caption: { fontSize: 13, fontWeight: '400' as const, color: colors.textMuted },
  label: { fontSize: 12, fontWeight: '600' as const, color: colors.textMuted, letterSpacing: 0.6 },
};

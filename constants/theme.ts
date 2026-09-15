/** ATYN Claude Design tokens — Paper/light, StyleSheet only. */
import { Platform, type TextStyle } from 'react-native';

export const palette = {
  ink: '#1C1B19',
  paper: '#F0EFEA',
  slate: '#2A2823',
  accent: '#4A6FA5',
  foil: '#7E9CC4',
} as const;

export const colors = {
  ink: palette.ink,
  paper: palette.paper,
  slate: palette.slate,
  accent: palette.accent,
  foil: palette.foil,

  bg: palette.paper,
  surface: '#FFFFFF',
  surfaceMuted: '#E8E6DF',
  surfaceElevated: '#FFFFFF',
  border: '#D6D3CA',
  borderStrong: '#C4C0B5',

  text: palette.ink,
  textMuted: '#5C574F',
  textDim: '#8A857C',
  textOnAccent: '#FFFFFF',
  textOnInk: palette.paper,

  danger: '#B54A3C',
  warning: '#A67C2D',
  success: '#3D6B4F',

  tabInactive: '#8A857C',
  progressTrack: '#E0DDD4',
  progressFill: palette.accent,
  inputBg: '#FFFFFF',
  chip: '#E8E6DF',
  chipActive: '#DCE6F2',

  /** Pace: Ahead / On track / Behind */
  statusAhead: '#3D6B4F',
  statusOnTrack: palette.accent,
  statusBehind: '#B54A3C',
  /** Trend: Rising / Steady / Slipping */
  trendRising: '#3D6B4F',
  trendSteady: palette.foil,
  trendSlipping: '#B54A3C',
};

export const spacing = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  /** Aliases used across screens */
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

const sans = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const mono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export const fonts = {
  sans,
  mono,
};

type Role = TextStyle;

/** Type roles: Display / Numeral / Title / Heading / Body (+ label/caption). */
export const typography = {
  display: {
    fontFamily: sans,
    fontSize: 34,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.5,
  } satisfies Role,
  numeral: {
    fontFamily: mono,
    fontSize: 40,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -1,
  } satisfies Role,
  numeralSm: {
    fontFamily: mono,
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
  } satisfies Role,
  title: {
    fontFamily: sans,
    fontSize: 28,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.3,
  } satisfies Role,
  heading: {
    fontFamily: sans,
    fontSize: 18,
    fontWeight: '600',
    color: colors.ink,
  } satisfies Role,
  body: {
    fontFamily: sans,
    fontSize: 16,
    fontWeight: '400',
    color: colors.ink,
    lineHeight: 24,
  } satisfies Role,
  caption: {
    fontFamily: sans,
    fontSize: 13,
    fontWeight: '400',
    color: colors.textMuted,
    lineHeight: 18,
  } satisfies Role,
  label: {
    fontFamily: sans,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } satisfies Role,
  /** Back-compat aliases */
  h2: {
    fontFamily: sans,
    fontSize: 22,
    fontWeight: '600',
    color: colors.ink,
  } satisfies Role,
  h3: {
    fontFamily: sans,
    fontSize: 18,
    fontWeight: '600',
    color: colors.ink,
  } satisfies Role,
};

export const statusLabels = {
  pace: ['Ahead', 'On track', 'Behind'] as const,
  trend: ['Rising', 'Steady', 'Slipping'] as const,
};

export type PaceStatus = (typeof statusLabels.pace)[number];
export type TrendStatus = (typeof statusLabels.trend)[number];

export function paceColor(pace: PaceStatus): string {
  if (pace === 'Ahead') return colors.statusAhead;
  if (pace === 'Behind') return colors.statusBehind;
  return colors.statusOnTrack;
}

export function trendColor(trend: TrendStatus): string {
  if (trend === 'Rising') return colors.trendRising;
  if (trend === 'Slipping') return colors.trendSlipping;
  return colors.trendSteady;
}

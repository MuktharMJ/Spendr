// Spendr Design Tokens — Day 1-2 notes
export const COLORS = {
  // Surfaces
  bg: '#0F0F14',
  surface: '#1A1A24',
  surfaceElevated: '#22222F',
  border: '#2A2A38',

  // Text
  text: '#FFFFFF',
  textMuted: '#9A9AA8',
  textDim: '#6B6B7A',

  // Brand
  primary: '#7C5CFF',
  primaryPressed: '#5E42E0',
  primarySoft: '#2A1F5C',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

export const FONT = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 40,
} as const;

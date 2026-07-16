// Spendr Categories — Day 5 notes
export interface Category {
  key: string;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { key: 'food', label: 'Food', emoji: '🍔' },
  { key: 'travel', label: 'Travel', emoji: '✈️' },
  { key: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { key: 'other', label: 'Other', emoji: '📦' },
];

export const getCategory = (key: string): Category | undefined =>
  CATEGORIES.find((c) => c.key === key);

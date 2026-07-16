// Spendr Vibe Tags — Day 1 notes
export interface Vibe {
  key: string;
  emoji: string;
  label: string;
  description: string;
  color: string;
}

export const VIBES: Record<string, Vibe> = {
  impulse: {
    key: 'impulse',
    emoji: '😳',
    label: 'Impulse',
    description: "Spur-of-the-moment buy — didn't plan it",
    color: '#EF4444',
  },
  'worth-it': {
    key: 'worth-it',
    emoji: '✨',
    label: 'Worth It',
    description: "Joy purchase — you'd do it again",
    color: '#22C55E',
  },
  'needed-this': {
    key: 'needed-this',
    emoji: '✅',
    label: 'Needed This',
    description: 'Essential spend — no regrets',
    color: '#3B82F6',
  },
  regret: {
    key: 'regret',
    emoji: '😞',
    label: 'Regret',
    description: "Wish you hadn't bought it",
    color: '#F59E0B',
  },
};

export const getVibe = (key: string): Vibe | undefined => VIBES[key];

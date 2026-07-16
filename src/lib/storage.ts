// Spendr Storage Helper — Day 3 notes (using localStorage for web)

export interface Profile {
  name: string;
  budget: number;
}

const KEYS = {
  NAME: 'spendr_user_name',
  BUDGET: 'spendr_monthly_budget',
  EXPENSES: 'spendr_expenses',
} as const;

export const saveProfile = (name: string, budget: number): void => {
  try {
    localStorage.setItem(KEYS.NAME, name);
    localStorage.setItem(KEYS.BUDGET, String(budget));
  } catch (e) {
    console.error('saveProfile error:', e);
  }
};

export const loadProfile = (): Profile => {
  try {
    const name = localStorage.getItem(KEYS.NAME);
    const budget = localStorage.getItem(KEYS.BUDGET);
    return {
      name: name ?? '',
      budget: budget ? Number(budget) : 15000,
    };
  } catch (e) {
    console.error('loadProfile error:', e);
    return { name: '', budget: 15000 };
  }
};

export const clearProfile = (): void => {
  try {
    localStorage.removeItem(KEYS.NAME);
    localStorage.removeItem(KEYS.BUDGET);
  } catch (e) {
    console.error('clearProfile error:', e);
  }
};

export interface Expense {
  id: string;
  amount: number;
  category: string;
  vibe: string;
  note: string;
  date: number; // timestamp
}

export const saveExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
  } catch (e) {
    console.error('saveExpenses error:', e);
  }
};

export const loadExpenses = (): Expense[] => {
  try {
    const raw = localStorage.getItem(KEYS.EXPENSES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('loadExpenses error:', e);
    return [];
  }
};

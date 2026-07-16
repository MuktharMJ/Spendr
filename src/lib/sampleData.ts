// Spendr Fake Expenses — Day 4 notes
import { Expense } from './storage';

const now = Date.now();
const HOUR = 1000 * 60 * 60;
const DAY = HOUR * 24;

export const FAKE_EXPENSES: Expense[] = [
  {
    id: '1',
    amount: 350,
    category: 'food',
    vibe: 'worth-it',
    note: 'Chole bhature from that new place near campus',
    date: now - 2 * HOUR,
  },
  {
    id: '2',
    amount: 2200,
    category: 'entertainment',
    vibe: 'impulse',
    note: 'Concert tickets — sold out tomorrow!',
    date: now - 5 * HOUR,
  },
  {
    id: '3',
    amount: 450,
    category: 'food',
    vibe: 'needed-this',
    note: 'Groceries for the week — rice, dal, veggies',
    date: now - 1 * DAY,
  },
  {
    id: '4',
    amount: 899,
    category: 'travel',
    vibe: 'worth-it',
    note: 'Uber to airport — flight at 6am, no bus option',
    date: now - 1.5 * DAY,
  },
  {
    id: '5',
    amount: 1500,
    category: 'other',
    vibe: 'regret',
    note: 'Fancy water bottle — already had one at home',
    date: now - 2 * DAY,
  },
  {
    id: '6',
    amount: 280,
    category: 'food',
    vibe: 'impulse',
    note: 'Late night Domino\'s order',
    date: now - 2.5 * DAY,
  },
  {
    id: '7',
    amount: 650,
    category: 'entertainment',
    vibe: 'needed-this',
    note: 'Netflix subscription renewal',
    date: now - 3 * DAY,
  },
  {
    id: '8',
    amount: 320,
    category: 'travel',
    vibe: 'regret',
    note: 'Auto ride I could\'ve walked — only 15 min',
    date: now - 4 * DAY,
  },
];

import { useState, useEffect } from 'react';
import { COLORS, FONT, RADIUS, SPACING } from '../lib/constants';
import { CATEGORIES } from '../lib/categories';
import { VIBES } from '../lib/vibes';
import { formatINR, timeAgo, fetchMoneyFact } from '../lib/helpers';
import { Expense } from '../lib/storage';
import ExpenseCard from './ExpenseCard';

interface HomeScreenProps {
  expenses: Expense[];
  onSelectExpense: (expense: Expense) => void;
}

export default function HomeScreen({ expenses, onSelectExpense }: HomeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [moneyFact, setMoneyFact] = useState<string | null>(null);
  const [factLoading, setFactLoading] = useState(false);

  // Day 8 — Money Facts API Banner
  useEffect(() => {
    const load = async () => {
      setFactLoading(true);
      const fact = await fetchMoneyFact();
      setMoneyFact(fact);
      setFactLoading(false);
    };
    load();
  }, []);

  const filteredExpenses =
    selectedCategory === 'all'
      ? expenses
      : expenses.filter((e) => e.category === selectedCategory);

  const totalSpent = filteredExpenses.reduce((s, e) => s + e.amount, 0);

  // Vibe breakdown for top of list
  const vibeBreakdown = Object.keys(VIBES).map((key) => {
    const total = filteredExpenses
      .filter((e) => e.vibe === key)
      .reduce((s, e) => s + e.amount, 0);
    return { ...VIBES[key], total };
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLORS.bg,
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl,
        overflowY: 'auto',
      }}
    >
      {/* Money Facts Banner — Day 8 */}
      {moneyFact && (
        <div
          style={{
            backgroundColor: COLORS.primarySoft,
            borderRadius: RADIUS.lg,
            padding: `${SPACING.md}px ${SPACING.lg}px`,
            marginBottom: SPACING.lg,
          }}
        >
          <div style={{ color: COLORS.primary, fontSize: FONT.xs, fontWeight: 700, marginBottom: 4 }}>
            💡 Did you know?
          </div>
          <div style={{ color: COLORS.text, fontSize: FONT.sm }}>{moneyFact}</div>
        </div>
      )}
      {factLoading && !moneyFact && (
        <div
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: RADIUS.lg,
            padding: `${SPACING.md}px ${SPACING.lg}px`,
            marginBottom: SPACING.lg,
            color: COLORS.textDim,
            fontSize: FONT.sm,
          }}
        >
          Loading a fun fact...
        </div>
      )}

      {/* Header total */}
      <div style={{ marginBottom: SPACING.lg }}>
        <div style={{ color: COLORS.textMuted, fontSize: FONT.xs, textTransform: 'uppercase', letterSpacing: 1 }}>
          {selectedCategory === 'all' ? 'Total Spent' : `Total ${selectedCategory}`}
        </div>
        <div style={{ color: COLORS.text, fontSize: 32, fontWeight: 800, marginTop: 4 }}>
          {formatINR(totalSpent)}
        </div>
      </div>

      {/* Category Filter Chips — Day 9 */}
      <div
        style={{
          display: 'flex',
          gap: SPACING.sm,
          marginBottom: SPACING.lg,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: `${SPACING.sm}px ${SPACING.md}px`,
            borderRadius: RADIUS.pill,
            border: `2px solid ${selectedCategory === 'all' ? COLORS.primary : COLORS.border}`,
            backgroundColor: selectedCategory === 'all' ? COLORS.primarySoft : COLORS.surface,
            color: selectedCategory === 'all' ? COLORS.primary : COLORS.textMuted,
            fontSize: FONT.sm,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
          }}
        >
          All ({expenses.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = expenses.filter((e) => e.category === cat.key).length;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              style={{
                padding: `${SPACING.sm}px ${SPACING.md}px`,
                borderRadius: RADIUS.pill,
                border: `2px solid ${selectedCategory === cat.key ? COLORS.primary : COLORS.border}`,
                backgroundColor: selectedCategory === cat.key ? COLORS.primarySoft : COLORS.surface,
                color: selectedCategory === cat.key ? COLORS.primary : COLORS.textMuted,
                fontSize: FONT.sm,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.emoji} {cat.label} ({count})
            </button>
          );
        })}
        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: `${SPACING.sm}px ${SPACING.md}px`,
              borderRadius: RADIUS.pill,
              border: `1px solid ${COLORS.danger}`,
              backgroundColor: 'transparent',
              color: COLORS.danger,
              fontSize: FONT.sm,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Expense list */}
      {filteredExpenses.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: `${SPACING.xxl}px ${SPACING.lg}px`,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: SPACING.md }}>📭</div>
          <div style={{ color: COLORS.textMuted, fontSize: FONT.md }}>
            {selectedCategory === 'all'
              ? 'No expenses yet. Tap + to add your first!'
              : `No ${selectedCategory} expenses yet.`}
          </div>
        </div>
      ) : (
        filteredExpenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} onSelect={onSelectExpense} />
        ))
      )}
    </div>
  );
}

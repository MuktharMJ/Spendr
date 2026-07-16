import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { COLORS, FONT, RADIUS, SPACING } from '../lib/constants';
import { CATEGORIES } from '../lib/categories';
import { VIBES } from '../lib/vibes';
import { formatINR } from '../lib/helpers';
import { Expense } from '../lib/storage';

export default function StatsScreen({
  expenses,
  selectedCategory,
}: {
  expenses: Expense[];
  selectedCategory: string;
}) {
  const filteredExpenses =
    selectedCategory === 'all'
      ? expenses
      : expenses.filter((e) => e.category === selectedCategory);

  const totalSpent = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const avgPerExpense = filteredExpenses.length > 0
    ? Math.round(totalSpent / filteredExpenses.length)
    : 0;

  // Category breakdown
  const categoryData = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      name: cat.label,
      emoji: cat.emoji,
      total: filteredExpenses
        .filter((e) => e.category === cat.key)
        .reduce((s, e) => s + e.amount, 0),
      count: filteredExpenses.filter((e) => e.category === cat.key).length,
    })).filter((d) => d.total > 0);
  }, [filteredExpenses]);

  // Vibe breakdown for pie chart
  const vibeData = useMemo(() => {
    return Object.keys(VIBES)
      .map((key) => ({
        name: VIBES[key].label,
        emoji: VIBES[key].emoji,
        value: filteredExpenses
          .filter((e) => e.vibe === key)
          .reduce((s, e) => s + e.amount, 0),
        color: VIBES[key].color,
      }))
      .filter((d) => d.value > 0);
  }, [filteredExpenses]);

  const PIE_COLORS = vibeData.map((d) => d.color);

  // Vibe breakdown with counts (Day 13 — visual bars)
  const vibeBreakdown = useMemo(() => {
    return Object.keys(VIBES).map((key) => {
      const amount = filteredExpenses
        .filter((e) => e.vibe === key)
        .reduce((s, e) => s + e.amount, 0);
      const count = filteredExpenses.filter((e) => e.vibe === key).length;
      const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
      const vibe = VIBES[key];
      return {
        key,
        emoji: vibe.emoji,
        label: vibe.label,
        color: vibe.color,
        amount,
        count,
        percentage,
      };
    });
  }, [filteredExpenses, totalSpent]);

  // Find most expensive vibe
  const mostExpensiveVibe = useMemo(() => {
    const sorted = [...vibeBreakdown].sort((a, b) => b.amount - a.amount);
    return sorted[0]?.amount > 0 ? sorted[0] : null;
  }, [vibeBreakdown]);

  // Regret expenses
  const regretExpenses = useMemo(() => {
    return filteredExpenses.filter((e) => e.vibe === 'regret');
  }, [filteredExpenses]);
  const regretTotal = regretExpenses.reduce((s, e) => s + e.amount, 0);

  // Recent expenses
  const recentExpenses = [...filteredExpenses]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

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
      <div style={{ color: COLORS.text, fontSize: FONT.xl, fontWeight: 800, marginBottom: SPACING.lg }}>
        📊 Stats
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.md, marginBottom: SPACING.lg }}>
        <div style={{ backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg }}>
          <div style={{ color: COLORS.textMuted, fontSize: FONT.xs }}>Total Spent</div>
          <div style={{ color: COLORS.text, fontSize: FONT.xxl, fontWeight: 800 }}>{formatINR(totalSpent)}</div>
        </div>
        <div style={{ backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg }}>
          <div style={{ color: COLORS.textMuted, fontSize: FONT.xs }}>Avg / Expense</div>
          <div style={{ color: COLORS.text, fontSize: FONT.xxl, fontWeight: 800 }}>{formatINR(avgPerExpense)}</div>
        </div>
        <div style={{ backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg }}>
          <div style={{ color: COLORS.textMuted, fontSize: FONT.xs }}>Expenses</div>
          <div style={{ color: COLORS.text, fontSize: FONT.xxl, fontWeight: 800 }}>{filteredExpenses.length}</div>
        </div>
        <div style={{ backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg }}>
          <div style={{ color: COLORS.textMuted, fontSize: FONT.xs }}>Categories</div>
          <div style={{ color: COLORS.text, fontSize: FONT.xxl, fontWeight: 800 }}>{categoryData.length}</div>
        </div>
      </div>

      {/* Most Expensive Vibe — Day 13 highlight */}
      {mostExpensiveVibe && (
        <div
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: RADIUS.lg,
            padding: SPACING.lg,
            marginBottom: SPACING.lg,
            borderLeft: `4px solid ${mostExpensiveVibe.color}`,
          }}
        >
          <div style={{ color: COLORS.textMuted, fontSize: FONT.xs, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Most Expensive Vibe
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, marginTop: SPACING.sm }}>
            <span style={{ fontSize: 32 }}>{mostExpensiveVibe.emoji}</span>
            <div>
              <div style={{ color: COLORS.text, fontSize: FONT.lg, fontWeight: 700 }}>
                {mostExpensiveVibe.label}
              </div>
              <div style={{ color: COLORS.text, fontSize: FONT.xxl, fontWeight: 800 }}>
                {formatINR(mostExpensiveVibe.amount)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vibe Breakdown with Visual Bars — Day 13 */}
      {totalSpent > 0 && (
        <div style={{ backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg }}>
          <div style={{ color: COLORS.textMuted, fontSize: FONT.sm, fontWeight: 600, marginBottom: SPACING.lg }}>
            BREAKDOWN BY VIBE
          </div>
          {vibeBreakdown.map((vibe) => (
            <div key={vibe.key} style={{ marginBottom: SPACING.lg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
                  <span style={{ fontSize: 20 }}>{vibe.emoji}</span>
                  <div>
                    <div style={{ color: COLORS.text, fontSize: FONT.sm, fontWeight: 600 }}>{vibe.label}</div>
                    <div style={{ color: COLORS.textMuted, fontSize: FONT.xs }}>{vibe.count} expenses</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: COLORS.text, fontSize: FONT.sm, fontWeight: 700 }}>{formatINR(vibe.amount)}</div>
                  <div style={{ color: COLORS.textMuted, fontSize: FONT.xs }}>{vibe.percentage}%</div>
                </div>
              </div>
              {/* Visual bar */}
              <div
                style={{
                  height: 8,
                  backgroundColor: COLORS.surfaceElevated,
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${vibe.percentage}%`,
                    backgroundColor: vibe.color,
                    borderRadius: 4,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regret Insight Card — Day 13 */}
      {regretExpenses.length > 0 && (
        <div
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: RADIUS.lg,
            padding: SPACING.lg,
            marginBottom: SPACING.lg,
            borderLeft: `4px solid ${COLORS.warning}`,
          }}
        >
          <div style={{ color: COLORS.textMuted, fontSize: FONT.xs, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            💡 Regret Insight
          </div>
          <div style={{ color: COLORS.text, fontSize: FONT.lg, fontWeight: 700, marginTop: SPACING.sm }}>
            You spent {formatINR(regretTotal)} on regret purchases
          </div>
          <div style={{ color: COLORS.textMuted, fontSize: FONT.sm, marginTop: SPACING.xs }}>
            That's {Math.round((regretTotal / totalSpent) * 100)}% of your total spending.
            {regretTotal > totalSpent * 0.3
              ? ' Consider pausing before impulse buys!'
              : ' Nice self-awareness tracking these!'}
          </div>
        </div>
      )}

      {/* Category Bar Chart */}
      {categoryData.length > 0 && (
        <div style={{ backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg }}>
          <div style={{ color: COLORS.textMuted, fontSize: FONT.sm, fontWeight: 600, marginBottom: SPACING.md }}>
            Spending by Category
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={categoryData}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: COLORS.textMuted, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: COLORS.textMuted, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.surfaceElevated,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: RADIUS.md,
                    color: COLORS.text,
                  }}
                  formatter={(value: number) => [formatINR(value), 'Amount']}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {categoryData.map((_entry, index) => (
                    <Cell key={index} fill={COLORS.primary} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Vibe Pie Chart */}
      {vibeData.length > 0 && (
        <div style={{ backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg }}>
          <div style={{ color: COLORS.textMuted, fontSize: FONT.sm, fontWeight: 600, marginBottom: SPACING.md }}>
            Spending by Vibe
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.lg }}>
            <div style={{ width: 180, height: 180, flexShrink: 0 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={vibeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {vibeData.map((_entry, index) => (
                      <Cell key={index} fill={PIE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: COLORS.surfaceElevated,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: RADIUS.md,
                      color: COLORS.text,
                    }}
                    formatter={(value: number) => [formatINR(value), 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
              {vibeData.map((d) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: d.color, flexShrink: 0 }} />
                  <span style={{ color: COLORS.text, fontSize: FONT.sm }}>
                    {d.emoji} {d.name}: {formatINR(d.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent expenses */}
      {recentExpenses.length > 0 && (
        <div style={{ backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.lg }}>
          <div style={{ color: COLORS.textMuted, fontSize: FONT.sm, fontWeight: 600, marginBottom: SPACING.md }}>
            Recent Expenses
          </div>
          {recentExpenses.map((e) => {
            const vibe = VIBES[e.vibe];
            return (
              <div
                key={e.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: `${SPACING.sm}px 0`,
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
                  <span style={{ fontSize: 20 }}>{vibe?.emoji ?? '💸'}</span>
                  <div>
                    <div style={{ color: COLORS.text, fontSize: FONT.sm, fontWeight: 600 }}>
                      {e.note || 'No note'}
                    </div>
                    <div style={{ color: COLORS.textMuted, fontSize: FONT.xs, textTransform: 'capitalize' }}>
                      {e.category}
                    </div>
                  </div>
                </div>
                <div style={{ color: COLORS.text, fontSize: FONT.sm, fontWeight: 700 }}>
                  {formatINR(e.amount)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredExpenses.length === 0 && (
        <div style={{ textAlign: 'center', padding: `${SPACING.xxl}px 0` }}>
          <div style={{ fontSize: 48, marginBottom: SPACING.md }}>📊</div>
          <div style={{ color: COLORS.textMuted, fontSize: FONT.md }}>
            {selectedCategory === 'all'
              ? 'No expenses to show stats for yet.'
              : `No ${selectedCategory} expenses to show.`}
          </div>
        </div>
      )}
    </div>
  );
}

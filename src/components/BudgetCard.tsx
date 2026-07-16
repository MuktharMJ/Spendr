import { COLORS, RADIUS, SPACING } from '../lib/constants';
import { formatINR } from '../lib/helpers';

export default function BudgetCard({
  monthlyBudget,
  spent,
}: {
  monthlyBudget: number;
  spent: number;
}) {
  const pct = monthlyBudget > 0 ? Math.min((spent / monthlyBudget) * 100, 100) : 0;
  const remaining = Math.max(monthlyBudget - spent, 0);
  const isOverBudget = spent > monthlyBudget;

  return (
    <div
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
        <span style={{ color: COLORS.textMuted, fontSize: 13, fontWeight: 500 }}>
          Monthly Budget
        </span>
        <span
          style={{
            color: isOverBudget ? COLORS.danger : COLORS.success,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {isOverBudget ? 'Over budget!' : `${formatINR(remaining)} left`}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          height: 10,
          backgroundColor: COLORS.surfaceElevated,
          borderRadius: RADIUS.pill,
          overflow: 'hidden',
          marginBottom: SPACING.sm,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: isOverBudget
              ? COLORS.danger
              : pct > 75
                ? COLORS.warning
                : COLORS.primary,
            borderRadius: RADIUS.pill,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: COLORS.textDim, fontSize: 11 }}>
          {formatINR(spent)} spent
        </span>
        <span style={{ color: COLORS.textDim, fontSize: 11 }}>
          {formatINR(monthlyBudget)} budget
        </span>
      </div>
    </div>
  );
}

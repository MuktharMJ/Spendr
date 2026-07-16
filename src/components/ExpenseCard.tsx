import { useState } from 'react';
import { COLORS, FONT, RADIUS, SPACING } from '../lib/constants';
import { getVibe } from '../lib/vibes';
import { getCategory } from '../lib/categories';
import { formatINR, timeAgo } from '../lib/helpers';
import { Expense } from '../lib/storage';

export default function ExpenseCard({
  expense,
  onSelect,
}: {
  expense: Expense;
  onSelect: (expense: Expense) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const vibe = getVibe(expense.vibe);
  const category = getCategory(expense.category);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        borderLeft: `4px solid ${vibe?.color ?? COLORS.border}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = COLORS.surfaceElevated;
        e.currentTarget.style.transform = 'scale(0.99)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = COLORS.surface;
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Top row: emoji + note + amount */}
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md }}>
        <span style={{ fontSize: 26 }}>{vibe?.emoji ?? '💸'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: COLORS.text,
              fontSize: FONT.md,
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: expanded ? 'normal' : 'nowrap',
            }}
          >
            {expense.note || 'No note'}
          </div>
          <div
            style={{
              color: COLORS.textMuted,
              fontSize: FONT.xs,
              marginTop: 2,
              textTransform: 'capitalize',
            }}
          >
            {category?.emoji} {expense.category} · {timeAgo(expense.date)}
          </div>
        </div>
        <div style={{ color: COLORS.text, fontSize: FONT.lg, fontWeight: 800, whiteSpace: 'nowrap' }}>
          {formatINR(expense.amount)}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          style={{
            marginTop: SPACING.md,
            paddingTop: SPACING.md,
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              backgroundColor: (vibe?.color ?? '#333') + '22',
              borderRadius: RADIUS.md,
              padding: `${SPACING.sm}px ${SPACING.md}px`,
            }}
          >
            <span style={{ color: vibe?.color ?? COLORS.text, fontSize: FONT.sm, fontWeight: 700 }}>
              {vibe?.emoji} {vibe?.label} — {vibe?.description}
            </span>
          </div>
          <div
            style={{ color: COLORS.textDim, fontSize: FONT.xs, marginTop: SPACING.sm, cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(expense);
            }}
          >
            View details →
          </div>
        </div>
      )}
    </div>
  );
}

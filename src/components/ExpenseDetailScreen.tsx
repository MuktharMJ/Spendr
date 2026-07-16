import { COLORS, FONT, RADIUS, SPACING } from '../lib/constants';
import { getVibe } from '../lib/vibes';
import { getCategory } from '../lib/categories';
import { formatINR, timeAgo } from '../lib/helpers';
import { Expense } from '../lib/storage';

export default function ExpenseDetailScreen({
  expense,
  onBack,
  onDelete,
}: {
  expense: Expense;
  onBack: () => void;
  onDelete: (id: string) => void;
}) {
  const vibe = getVibe(expense.vibe);
  const category = getCategory(expense.category);

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
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: COLORS.primary,
          fontSize: FONT.md,
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0,
          marginBottom: SPACING.lg,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        ← Back
      </button>

      {/* Vibe Header */}
      <div
        style={{
          backgroundColor: (vibe?.color ?? '#333') + '22',
          borderRadius: RADIUS.lg,
          padding: SPACING.xl,
          textAlign: 'center',
          marginBottom: SPACING.lg,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: SPACING.sm }}>{vibe?.emoji ?? '💸'}</div>
        <div style={{ color: vibe?.color ?? COLORS.text, fontSize: FONT.xl, fontWeight: 800 }}>
          {vibe?.label}
        </div>
        <div style={{ color: vibe?.color ?? COLORS.textMuted, fontSize: FONT.sm, marginTop: 4 }}>
          {vibe?.description}
        </div>
      </div>

      {/* Amount */}
      <div
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: RADIUS.lg,
          padding: SPACING.xl,
          textAlign: 'center',
          marginBottom: SPACING.lg,
        }}
      >
        <div style={{ color: COLORS.textMuted, fontSize: FONT.xs, textTransform: 'uppercase', letterSpacing: 1 }}>
          Amount
        </div>
        <div style={{ color: COLORS.text, fontSize: 36, fontWeight: 800, marginTop: SPACING.xs }}>
          {formatINR(expense.amount)}
        </div>
      </div>

      {/* Details */}
      <div
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: RADIUS.lg,
          padding: SPACING.lg,
          marginBottom: SPACING.lg,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: SPACING.md }}>
          <span style={{ color: COLORS.textMuted, fontSize: FONT.sm }}>Category</span>
          <span style={{ color: COLORS.text, fontSize: FONT.sm, fontWeight: 600 }}>
            {category?.emoji} {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: SPACING.md }}>
          <span style={{ color: COLORS.textMuted, fontSize: FONT.sm }}>When</span>
          <span style={{ color: COLORS.text, fontSize: FONT.sm, fontWeight: 600 }}>
            {timeAgo(expense.date)}
          </span>
        </div>
        {expense.note && (
          <div
            style={{
              borderTop: `1px solid ${COLORS.border}`,
              paddingTop: SPACING.md,
            }}
          >
            <div style={{ color: COLORS.textMuted, fontSize: FONT.xs, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Note
            </div>
            <div style={{ color: COLORS.text, fontSize: FONT.md, marginTop: SPACING.xs }}>
              {expense.note}
            </div>
          </div>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => {
          if (window.confirm('Delete this expense?')) {
            onDelete(expense.id);
            onBack();
          }
        }}
        style={{
          width: '100%',
          backgroundColor: COLORS.danger + '18',
          color: COLORS.danger,
          fontSize: FONT.md,
          fontWeight: 700,
          padding: SPACING.md,
          borderRadius: RADIUS.lg,
          border: `1px solid ${COLORS.danger}`,
          cursor: 'pointer',
        }}
      >
        🗑 Delete Expense
      </button>
    </div>
  );
}

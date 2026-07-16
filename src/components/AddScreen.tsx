import { useState } from 'react';
import { COLORS, FONT, RADIUS, SPACING } from '../lib/constants';
import { CATEGORIES } from '../lib/categories';
import { generateId } from '../lib/helpers';
import { Expense } from '../lib/storage';
import VibePicker from './VibePicker';

export default function AddScreen({
  onAdd,
  onNavigateHome,
}: {
  onAdd: (expense: Expense) => void;
  onNavigateHome: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [vibe, setVibe] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [amountError, setAmountError] = useState('');
  const [vibeError, setVibeError] = useState('');

  const validate = (): boolean => {
    let valid = true;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setAmountError('Enter a valid amount greater than 0');
      valid = false;
    } else {
      setAmountError('');
    }
    if (!vibe) {
      setVibeError('Please pick a vibe for this expense');
      valid = false;
    } else {
      setVibeError('');
    }
    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newExpense: Expense = {
      id: generateId(),
      amount: Number(amount),
      category,
      vibe: vibe!,
      note: note.trim(),
      date: Date.now(),
    };
    onAdd(newExpense);
    // Reset form
    setAmount('');
    setCategory('food');
    setVibe(null);
    setNote('');
    setAmountError('');
    setVibeError('');
    onNavigateHome();
  };

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
      <div
        style={{
          color: COLORS.text,
          fontSize: FONT.xl,
          fontWeight: 800,
          marginBottom: SPACING.xl,
        }}
      >
        Add Expense
      </div>

      {/* Amount input */}
      <div style={{ marginBottom: SPACING.md }}>
        <label
          style={{
            color: COLORS.textMuted,
            fontSize: FONT.xs,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            display: 'block',
            marginBottom: SPACING.xs,
          }}
        >
          Amount (₹) *
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          type="number"
          style={{
            width: '100%',
            backgroundColor: COLORS.surfaceElevated,
            color: COLORS.text,
            fontSize: FONT.xl,
            fontWeight: 700,
            borderRadius: RADIUS.md,
            padding: `${SPACING.md}px ${SPACING.lg}px`,
            border: `1px solid ${amountError ? COLORS.danger : COLORS.border}`,
            boxSizing: 'border-box',
            outline: 'none',
          }}
        />
        {amountError && (
          <div style={{ color: COLORS.danger, fontSize: FONT.xs, marginTop: SPACING.xs }}>
            {amountError}
          </div>
        )}
      </div>

      {/* Category chips */}
      <div style={{ marginBottom: SPACING.md }}>
        <label
          style={{
            color: COLORS.textMuted,
            fontSize: FONT.xs,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            display: 'block',
            marginBottom: SPACING.xs,
          }}
        >
          Category
        </label>
        <div style={{ display: 'flex', gap: SPACING.sm, flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              style={{
                padding: `${SPACING.sm}px ${SPACING.md}px`,
                borderRadius: RADIUS.pill,
                border: `2px solid ${category === cat.key ? COLORS.primary : COLORS.border}`,
                backgroundColor: category === cat.key ? COLORS.primarySoft : COLORS.surface,
                color: category === cat.key ? COLORS.primary : COLORS.textMuted,
                fontSize: FONT.sm,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vibe picker */}
      <VibePicker selected={vibe} onSelect={setVibe} error={vibeError} />

      {/* Note input */}
      <div style={{ marginBottom: SPACING.xl }}>
        <label
          style={{
            color: COLORS.textMuted,
            fontSize: FONT.xs,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            display: 'block',
            marginBottom: SPACING.xs,
          }}
        >
          Note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What was this for?"
          rows={3}
          style={{
            width: '100%',
            backgroundColor: COLORS.surfaceElevated,
            color: COLORS.text,
            fontSize: FONT.md,
            borderRadius: RADIUS.md,
            padding: SPACING.md,
            border: `1px solid ${COLORS.border}`,
            boxSizing: 'border-box',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          backgroundColor: COLORS.primary,
          color: COLORS.text,
          fontSize: FONT.md,
          fontWeight: 700,
          padding: `${SPACING.md}px ${SPACING.xl}px`,
          borderRadius: RADIUS.pill,
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
      >
        Add Expense
      </button>
    </div>
  );
}

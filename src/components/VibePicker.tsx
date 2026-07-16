import { COLORS, FONT, RADIUS, SPACING } from '../lib/constants';
import { VIBES } from '../lib/vibes';

export default function VibePicker({
  selected,
  onSelect,
  error,
}: {
  selected: string | null;
  onSelect: (key: string) => void;
  error?: string;
}) {
  return (
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
        How did this feel? *
      </label>
      <div style={{ display: 'flex', gap: SPACING.sm }}>
        {Object.values(VIBES).map((vibe) => (
          <button
            key={vibe.key}
            onClick={() => onSelect(vibe.key)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: `${SPACING.md}px ${SPACING.sm}px`,
              borderRadius: RADIUS.md,
              border: `2px solid ${selected === vibe.key ? vibe.color : COLORS.border}`,
              backgroundColor: selected === vibe.key ? vibe.color + '22' : COLORS.surfaceElevated,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: 24 }}>{vibe.emoji}</span>
            <span
              style={{
                fontSize: FONT.xs,
                fontWeight: 600,
                color: selected === vibe.key ? vibe.color : COLORS.textMuted,
              }}
            >
              {vibe.label}
            </span>
          </button>
        ))}
      </div>
      {error && (
        <div style={{ color: COLORS.danger, fontSize: FONT.xs, marginTop: SPACING.xs }}>
          {error}
        </div>
      )}
    </div>
  );
}

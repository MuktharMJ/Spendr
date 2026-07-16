import { COLORS } from '../lib/constants';

export default function WelcomeScreen({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: COLORS.primary,
          letterSpacing: -1,
          marginBottom: 16,
        }}
      >
        Spendr
      </div>
      <div style={{ fontSize: 22, color: COLORS.text, marginBottom: 6 }}>
        Hey there!
      </div>
      <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 40 }}>
        Track your spending vibes
      </div>
      <button
        onClick={onGetStarted}
        style={{
          backgroundColor: COLORS.primary,
          color: COLORS.text,
          fontSize: 16,
          fontWeight: 600,
          padding: '14px 32px',
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = COLORS.primaryPressed;
          e.currentTarget.style.transform = 'scale(0.98)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = COLORS.primary;
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Get Started
      </button>
    </div>
  );
}

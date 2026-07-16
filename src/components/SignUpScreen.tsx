// Spendr Sign Up Screen — Day 11 notes
import { useState } from 'react';
import { COLORS, FONT, RADIUS, SPACING } from '../lib/constants';
import { useAuth } from './AuthContext';

export default function SignUpScreen({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { signUp, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    let valid = true;

    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await signUp(email, password);
    } catch {
      // Error is set in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.xl,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: 64,
          marginBottom: SPACING.lg,
        }}
      >
        💸
      </div>
      <div
        style={{
          color: COLORS.text,
          fontSize: FONT.display,
          fontWeight: 900,
          marginBottom: SPACING.xs,
        }}
      >
        Spendr
      </div>
      <div
        style={{
          color: COLORS.textMuted,
          fontSize: FONT.sm,
          marginBottom: SPACING.xxl,
        }}
      >
        Create your account
      </div>

      {/* Sign Up Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 360,
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING.lg,
        }}
      >
        {error && (
          <div
            style={{
              backgroundColor: '#3D1515',
              border: `1px solid ${COLORS.danger}`,
              borderRadius: RADIUS.md,
              padding: SPACING.md,
              color: COLORS.danger,
              fontSize: FONT.sm,
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {/* Email Field */}
        <div>
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
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%',
              backgroundColor: COLORS.surfaceElevated,
              color: COLORS.text,
              fontSize: FONT.md,
              borderRadius: RADIUS.md,
              padding: SPACING.md,
              border: `1px solid ${emailError ? COLORS.danger : COLORS.border}`,
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
          {emailError && (
            <div style={{ color: COLORS.danger, fontSize: FONT.xs, marginTop: SPACING.xs }}>
              {emailError}
            </div>
          )}
        </div>

        {/* Password Field */}
        <div>
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
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              backgroundColor: COLORS.surfaceElevated,
              color: COLORS.text,
              fontSize: FONT.md,
              borderRadius: RADIUS.md,
              padding: SPACING.md,
              border: `1px solid ${passwordError ? COLORS.danger : COLORS.border}`,
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
          {passwordError && (
            <div style={{ color: COLORS.danger, fontSize: FONT.xs, marginTop: SPACING.xs }}>
              {passwordError}
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
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
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              backgroundColor: COLORS.surfaceElevated,
              color: COLORS.text,
              fontSize: FONT.md,
              borderRadius: RADIUS.md,
              padding: SPACING.md,
              border: `1px solid ${confirmPasswordError ? COLORS.danger : COLORS.border}`,
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
          {confirmPasswordError && (
            <div style={{ color: COLORS.danger, fontSize: FONT.xs, marginTop: SPACING.xs }}>
              {confirmPasswordError}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            backgroundColor: COLORS.primary,
            color: COLORS.text,
            fontSize: FONT.md,
            fontWeight: 700,
            padding: `${SPACING.md}px ${SPACING.xl}px`,
            borderRadius: RADIUS.pill,
            border: 'none',
            cursor: isSubmitting ? 'wait' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {isSubmitting ? 'Creating account...' : 'Sign Up'}
        </button>

        {/* Login Link */}
        <div
          style={{
            textAlign: 'center',
            color: COLORS.textMuted,
            fontSize: FONT.sm,
          }}
        >
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.primary,
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: FONT.sm,
              padding: 0,
            }}
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { COLORS, FONT, RADIUS, SPACING } from '../lib/constants';
import { formatINR } from '../lib/helpers';
import { saveProfile, loadProfile, Expense } from '../lib/storage';
import BudgetCard from './BudgetCard';
import { useAuth } from './AuthContext';

interface ProfileScreenProps {
  expenses: Expense[];
  profile: { name: string; budget: number };
  onProfileUpdate: (name: string, budget: number) => void;
}

export default function ProfileScreen({
  expenses,
  profile,
  onProfileUpdate,
}: ProfileScreenProps) {
  const { signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [budgetStr, setBudgetStr] = useState(String(profile.budget));
  const [nameError, setNameError] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Log out?')) {
      setIsLoggingOut(true);
      try {
        await signOut();
      } catch {
        // Error handled in AuthContext
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  useEffect(() => {
    setName(profile.name);
    setBudgetStr(String(profile.budget));
  }, [profile.name, profile.budget]);

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  const personalities = [
    'The Cautious Spender',
    'The Impulse Buyer',
    'The Value Hunter',
    'The Experience Chaser',
  ];
  const personality =
    totalSpent > profile.budget * 0.8
      ? 'The Impulse Buyer'
      : totalSpent > profile.budget * 0.5
        ? 'The Experience Chaser'
        : totalSpent > profile.budget * 0.2
          ? 'The Value Hunter'
          : 'The Cautious Spender';

  const handleSave = () => {
    let valid = true;
    if (!name.trim()) {
      setNameError('Name is required');
      valid = false;
    } else {
      setNameError('');
    }
    const budget = Number(budgetStr);
    if (!budgetStr || isNaN(budget) || budget <= 0) {
      setBudgetError('Enter a valid budget');
      valid = false;
    } else {
      setBudgetError('');
    }
    if (!valid) return;
    saveProfile(name.trim(), budget);
    onProfileUpdate(name.trim(), budget);
    setEditing(false);
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
      {/* Avatar block */}
      <div style={{ textAlign: 'center', paddingTop: SPACING.md }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 42,
            backgroundColor: COLORS.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            border: `3px solid ${COLORS.primarySoft}`,
          }}
        >
          <span
            style={{
              color: COLORS.text,
              fontSize: FONT.xxl,
              fontWeight: 800,
            }}
          >
            {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
          </span>
        </div>
        <div
          style={{
            color: COLORS.text,
            fontSize: FONT.xl,
            fontWeight: 800,
            marginTop: SPACING.md,
          }}
        >
          {profile.name || 'Set your name'}
        </div>
        <div
          style={{
            backgroundColor: COLORS.primarySoft,
            display: 'inline-block',
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 6,
            paddingBottom: 6,
            borderRadius: RADIUS.pill,
            marginTop: SPACING.md,
          }}
        >
          <span style={{ color: COLORS.primary, fontSize: FONT.sm, fontWeight: 700 }}>
            {personality}
          </span>
        </div>
      </div>

      {/* Budget card */}
      <div style={{ marginTop: SPACING.lg }}>
        <BudgetCard monthlyBudget={profile.budget} spent={totalSpent} />
      </div>

      {/* Edit / Save */}
      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          style={{
            backgroundColor: COLORS.primary,
            color: COLORS.text,
            fontSize: FONT.md,
            fontWeight: 700,
            padding: `${SPACING.sm}px ${SPACING.xl}px`,
            borderRadius: RADIUS.pill,
            border: 'none',
            cursor: 'pointer',
            display: 'block',
            margin: `${SPACING.lg}px auto 0`,
            transition: 'background 0.15s',
          }}
        >
          Edit Profile
        </button>
      ) : (
        <div style={{ marginTop: SPACING.lg }}>
          {/* Name field */}
          <div style={{ marginBottom: SPACING.md }}>
            <label style={{ color: COLORS.textMuted, fontSize: FONT.xs, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={{
                width: '100%',
                backgroundColor: COLORS.surfaceElevated,
                color: COLORS.text,
                fontSize: FONT.md,
                borderRadius: RADIUS.md,
                padding: SPACING.md,
                border: `1px solid ${nameError ? COLORS.danger : COLORS.border}`,
                marginTop: 4,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
            {nameError && (
              <div style={{ color: COLORS.danger, fontSize: FONT.xs, marginTop: SPACING.xs }}>
                {nameError}
              </div>
            )}
          </div>

          {/* Budget field */}
          <div style={{ marginBottom: SPACING.md }}>
            <label style={{ color: COLORS.textMuted, fontSize: FONT.xs, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Monthly Budget (₹)
            </label>
            <input
              value={budgetStr}
              onChange={(e) => setBudgetStr(e.target.value)}
              placeholder="15000"
              type="number"
              style={{
                width: '100%',
                backgroundColor: COLORS.surfaceElevated,
                color: COLORS.text,
                fontSize: FONT.md,
                borderRadius: RADIUS.md,
                padding: SPACING.md,
                border: `1px solid ${budgetError ? COLORS.danger : COLORS.border}`,
                marginTop: 4,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
            {budgetError && (
              <div style={{ color: COLORS.danger, fontSize: FONT.xs, marginTop: SPACING.xs }}>
                {budgetError}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: SPACING.sm }}>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                backgroundColor: COLORS.primary,
                color: COLORS.text,
                fontSize: FONT.md,
                fontWeight: 700,
                padding: `${SPACING.sm}px ${SPACING.xl}px`,
                borderRadius: RADIUS.pill,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setName(profile.name);
                setBudgetStr(String(profile.budget));
                setNameError('');
                setBudgetError('');
              }}
              style={{
                flex: 1,
                backgroundColor: COLORS.surfaceElevated,
                color: COLORS.textMuted,
                fontSize: FONT.md,
                fontWeight: 600,
                padding: `${SPACING.sm}px ${SPACING.xl}px`,
                borderRadius: RADIUS.pill,
                border: `1px solid ${COLORS.border}`,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        style={{
          width: '100%',
          backgroundColor: 'transparent',
          color: COLORS.danger,
          fontSize: FONT.md,
          fontWeight: 700,
          padding: `${SPACING.md}px ${SPACING.xl}px`,
          borderRadius: RADIUS.pill,
          border: `1px solid ${COLORS.danger}`,
          cursor: isLoggingOut ? 'wait' : 'pointer',
          marginTop: SPACING.xl,
          transition: 'all 0.15s',
        }}
      >
        {isLoggingOut ? 'Logging out...' : 'Log Out'}
      </button>

      <div
        style={{
          color: COLORS.textDim,
          fontSize: FONT.xs,
          textAlign: 'center',
          marginTop: SPACING.lg,
        }}
      >
        Spendr v1.0 · Bootcamp build
      </div>
    </div>
  );
}

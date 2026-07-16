import { useState, useEffect } from 'react';
import { COLORS, FONT, RADIUS, SPACING } from './lib/constants';
import { saveProfile, loadProfile, saveExpenses, loadExpenses, Expense } from './lib/storage';
import { FAKE_EXPENSES } from './lib/sampleData';
import { AuthProvider, useAuth } from './components/AuthContext';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import WelcomeScreen from './components/WelcomeScreen';
import ProfileScreen from './components/ProfileScreen';
import HomeScreen from './components/HomeScreen';
import AddScreen from './components/AddScreen';
import ExpenseDetailScreen from './components/ExpenseDetailScreen';
import StatsScreen from './components/StatsScreen';

type Tab = 'home' | 'add' | 'stats' | 'profile';

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'home', label: 'Home', emoji: '🏠' },
  { key: 'add', label: 'Add', emoji: '➕' },
  { key: 'stats', label: 'Stats', emoji: '📊' },
  { key: 'profile', label: 'Profile', emoji: '👤' },
];

function AuthenticatedApp() {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Profile state
  const [profile, setProfile] = useState({ name: '', budget: 15000 });

  // Expenses state
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load persisted data on mount
  useEffect(() => {
    const savedProfile = loadProfile();
    setProfile(savedProfile);
    const savedExpenses = loadExpenses();
    setExpenses(savedExpenses.length > 0 ? savedExpenses : FAKE_EXPENSES);
    if (savedProfile.name) {
      setShowWelcome(false);
    }
  }, []);

  // Persist expenses on change
  useEffect(() => {
    if (expenses.length > 0) {
      saveExpenses(expenses);
    }
  }, [expenses]);

  const handleProfileUpdate = (name: string, budget: number) => {
    setProfile({ name, budget });
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses([expense, ...expenses]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Welcome screen
  if (showWelcome) {
    return <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />;
  }

  // Expense detail view
  if (selectedExpense) {
    return (
      <ExpenseDetailScreen
        expense={selectedExpense}
        onBack={() => setSelectedExpense(null)}
        onDelete={handleDeleteExpense}
      />
    );
  }

  // Main app with tabs
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Main content */}
      <div style={{ flex: 1, paddingBottom: 72 }}>
        {activeTab === 'home' && (
          <HomeScreen
            expenses={expenses}
            onSelectExpense={setSelectedExpense}
          />
        )}
        {activeTab === 'add' && (
          <AddScreen
            onAdd={handleAddExpense}
            onNavigateHome={() => setActiveTab('home')}
          />
        )}
        {activeTab === 'stats' && (
          <StatsScreen
            expenses={expenses}
            selectedCategory={selectedCategory}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileScreen
            expenses={expenses}
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 72,
          backgroundColor: COLORS.surface,
          borderTop: `1px solid ${COLORS.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 100,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSelectedExpense(null);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: `${SPACING.sm}px ${SPACING.md}px`,
                borderRadius: RADIUS.md,
                border: 'none',
                background: isActive ? COLORS.primarySoft : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                minWidth: 64,
              }}
            >
              <span style={{ fontSize: 22 }}>{tab.emoji}</span>
              <span
                style={{
                  fontSize: FONT.xs,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? COLORS.primary : COLORS.textMuted,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <LoginScreen onSwitchToSignUp={() => setIsLogin(false)} />
  ) : (
    <SignUpScreen onSwitchToLogin={() => setIsLogin(true)} />
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: COLORS.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: SPACING.lg }}>💸</div>
          <div style={{ color: COLORS.textMuted, fontSize: FONT.md }}>Loading...</div>
        </div>
      </div>
    );
  }

  return user ? <AuthenticatedApp /> : <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

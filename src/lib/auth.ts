// Spendr Auth Service — Day 11 notes
// Simulated Firebase Auth with localStorage persistence

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
}

type AuthStateCallback = (user: AuthUser | null) => void;

const STORAGE_KEY = 'spendr_auth_user';
const USERS_KEY = 'spendr_registered_users';

interface StoredUser {
  uid: string;
  email: string;
  password: string;
  displayName?: string;
}

// Get stored users
const getStoredUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Save users
const saveUsers = (users: StoredUser[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Generate unique ID
const generateUid = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// Get current user from storage
export const getCurrentUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Save current user to storage
const saveCurrentUser = (user: AuthUser | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// Auth state listeners
const listeners: Set<AuthStateCallback> = new Set();

// Notify all listeners of auth state change
const notifyListeners = (user: AuthUser | null): void => {
  listeners.forEach((cb) => cb(user));
};

// Subscribe to auth state changes
export const onAuthStateChanged = (callback: AuthStateCallback): (() => void) => {
  listeners.add(callback);
  // Immediately call with current state
  callback(getCurrentUser());
  return () => {
    listeners.delete(callback);
  };
};

// Sign up with email and password
export const signUpWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<{ user: AuthUser }> => {
  // Validate inputs
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const users = getStoredUsers();
  
  // Check if user already exists
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists');
  }

  // Create new user
  const newUser: StoredUser = {
    uid: generateUid(),
    email: email.toLowerCase(),
    password, // In production, this would be hashed
    displayName: email.split('@')[0],
  };

  users.push(newUser);
  saveUsers(users);

  // Set as current user
  const authUser: AuthUser = {
    uid: newUser.uid,
    email: newUser.email,
    displayName: newUser.displayName,
  };
  
  saveCurrentUser(authUser);
  notifyListeners(authUser);

  return { user: authUser };
};

// Sign in with email and password
export const signInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<{ user: AuthUser }> => {
  // Validate inputs
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address');
  }
  if (!password) {
    throw new Error('Password is required');
  }

  const users = getStoredUsers();
  
  // Find user
  const storedUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!storedUser) {
    throw new Error('Invalid email or password');
  }

  // Set as current user
  const authUser: AuthUser = {
    uid: storedUser.uid,
    email: storedUser.email,
    displayName: storedUser.displayName,
  };
  
  saveCurrentUser(authUser);
  notifyListeners(authUser);

  return { user: authUser };
};

// Sign out
export const signOut = async (): Promise<void> => {
  saveCurrentUser(null);
  notifyListeners(null);
};

// Send password reset email (simulated)
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  // Simulated — in production this would send an email
  console.log(`Password reset email sent to ${email}`);
};

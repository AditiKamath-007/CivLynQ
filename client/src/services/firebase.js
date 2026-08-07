import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup as fbSignInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged as fbOnAuthStateChanged,
  createUserWithEmailAndPassword as fbCreateUser,
  signInWithEmailAndPassword as fbSignInWithEmail,
  updateProfile as fbUpdateProfile
} from 'firebase/auth';

let firebaseApp = null;
let firebaseAuth = null;
let googleAuthProvider = null;
let isMock = false;

// Read config from Vite env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if we have a valid configuration
const hasConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY';

if (hasConfig) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(firebaseApp);
    googleAuthProvider = new GoogleAuthProvider();
    console.log('[Firebase Client] Initialized real Firebase SDK successfully.');
  } catch (error) {
    console.error('[Firebase Client] Initialization error, falling back to mock:', error);
    isMock = true;
  }
} else {
  console.warn('[Firebase Client] No configuration found. Using mock authentication.');
  isMock = true;
}

// --- Mock Firebase implementation ---

let mockUserListeners = [];
let currentMockUser = null;

/**
 * Hydrate a stored mock user object so it has a working getIdToken method.
 * JSON.stringify strips functions, so we re-attach it on load.
 */
function hydrateMockUser(raw) {
  if (!raw) return null;
  return {
    ...raw,
    getIdToken: async () => 'mock-token-' + (raw.uid || 'testuser'),
  };
}

// Initialize mock user from localStorage if exists
try {
  const storedUser = localStorage.getItem('mock_user');
  if (storedUser) {
    currentMockUser = hydrateMockUser(JSON.parse(storedUser));
  }
} catch (e) {
  console.error('Failed to parse mock user:', e);
}

const triggerMockAuthListeners = (user) => {
  mockUserListeners.forEach(cb => cb(user));
};

const mockAuth = {
  currentUser: currentMockUser,
  onAuthStateChanged: (cb) => {
    mockUserListeners.push(cb);
    // Trigger immediately with current state
    cb(currentMockUser);
    // Return unsubscribe function
    return () => {
      mockUserListeners = mockUserListeners.filter(listener => listener !== cb);
    };
  }
};

const mockSignInWithPopup = async () => {
  console.log('[Firebase Mock Auth] Simulating Google Login...');
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = hydrateMockUser({
    uid: 'testuser',
    displayName: 'CivLynQ Test User',
    email: 'testuser@civlynq.in',
    photoURL: null,
  });
  
  currentMockUser = user;
  mockAuth.currentUser = user;
  localStorage.setItem('mock_user', JSON.stringify(user));
  triggerMockAuthListeners(user);
  return { user };
};

/**
 * Mock email/password sign-in.
 * Accepts any credentials in mock mode — just creates a mock user session.
 */
const mockSignInWithEmail = async (email, password) => {
  console.log('[Firebase Mock Auth] Simulating email sign-in for', email);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Derive a display name from the email prefix
  const displayName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const user = hydrateMockUser({
    uid: 'user-' + email.replace(/[^a-zA-Z0-9]/g, ''),
    displayName,
    email,
    photoURL: null,
  });

  currentMockUser = user;
  mockAuth.currentUser = user;
  localStorage.setItem('mock_user', JSON.stringify(user));
  triggerMockAuthListeners(user);
  return { user };
};

/**
 * Mock email/password sign-up.
 */
const mockCreateUser = async (email, password, displayName) => {
  console.log('[Firebase Mock Auth] Simulating account creation for', email);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = hydrateMockUser({
    uid: 'user-' + Date.now(),
    displayName: displayName || email.split('@')[0],
    email,
    photoURL: null,
  });

  currentMockUser = user;
  mockAuth.currentUser = user;
  localStorage.setItem('mock_user', JSON.stringify(user));
  triggerMockAuthListeners(user);
  return { user };
};

const mockSignOut = async () => {
  console.log('[Firebase Mock Auth] Logging out...');
  currentMockUser = null;
  mockAuth.currentUser = null;
  localStorage.removeItem('mock_user');
  triggerMockAuthListeners(null);
};

// --- Export active wrappers ---

export const auth = isMock ? mockAuth : firebaseAuth;
export const googleProvider = isMock ? null : googleAuthProvider;
export const isMockAuth = isMock;

export const signInWithGoogle = async () => {
  if (isMock) {
    return mockSignInWithPopup();
  } else {
    return fbSignInWithPopup(firebaseAuth, googleAuthProvider);
  }
};

/**
 * Sign in with email and password.
 */
export const signInWithEmail = async (email, password) => {
  if (isMock) {
    return mockSignInWithEmail(email, password);
  } else {
    return fbSignInWithEmail(firebaseAuth, email, password);
  }
};

/**
 * Create a new user with email, password, and display name.
 */
export const createUser = async (email, password, displayName) => {
  if (isMock) {
    return mockCreateUser(email, password, displayName);
  } else {
    const result = await fbCreateUser(firebaseAuth, email, password);
    if (displayName) {
      await fbUpdateProfile(result.user, { displayName });
    }
    return result;
  }
};

export const logout = async () => {
  if (isMock) {
    return mockSignOut();
  } else {
    return fbSignOut(firebaseAuth);
  }
};

export const getIdToken = async (user) => {
  if (!user) return null;
  if (isMock || typeof user.getIdToken !== 'function') {
    return 'mock-token-' + (user.uid || 'testuser');
  }
  return user.getIdToken();
};

export const onAuthStateChanged = (cb) => {
  if (isMock) {
    return mockAuth.onAuthStateChanged(cb);
  } else {
    return fbOnAuthStateChanged(firebaseAuth, cb);
  }
};

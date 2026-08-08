import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup as fbSignInWithPopup, 
  signInWithEmailAndPassword as fbSignInWithEmail,
  createUserWithEmailAndPassword as fbCreateUserWithEmail,
  updateProfile as fbUpdateProfile,
  signOut as fbSignOut, 
  onAuthStateChanged as fbOnAuthStateChanged 
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
const hasConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY";

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

// Mock Firebase implementation
let mockUserListeners = [];
let currentMockUser = null;

// Initialize mock user from localStorage if exists
try {
  const storedUser = localStorage.getItem('mock_user');
  if (storedUser) {
    currentMockUser = JSON.parse(storedUser);
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
  console.log('[Firebase Mock Auth] Simulating Login...');
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = {
    uid: 'testuser',
    displayName: 'CivLynQ Test User',
    email: 'testuser@civlynq.in',
    photoURL: 'https://lh3.googleusercontent.com/a/default-user',
    getIdToken: async () => 'mock-token-testuser',
  };
  
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

// Export active wrappers
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

export const signInWithEmail = async (email, password) => {
  if (isMock) {
    return mockSignInWithPopup();
  } else {
    return fbSignInWithEmail(firebaseAuth, email, password);
  }
};

export const signUpWithEmail = async (email, password, displayName) => {
  if (isMock) {
    const res = await mockSignInWithPopup();
    if (displayName && res.user) res.user.displayName = displayName;
    return res;
  } else {
    const res = await fbCreateUserWithEmail(firebaseAuth, email, password);
    if (displayName && res.user) {
      await fbUpdateProfile(res.user, { displayName });
    }
    return res;
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
    return 'mock-token-testuser';
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

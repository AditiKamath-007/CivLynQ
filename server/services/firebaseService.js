const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let authService;
let dbService;
let isMock = false;

// Local Mock Database path
const MOCK_DB_PATH = path.join(__dirname, '../data/local_db.json');

// Ensure local db exists
if (!fs.existsSync(MOCK_DB_PATH)) {
  fs.writeFileSync(MOCK_DB_PATH, JSON.stringify({ users: {}, drafts: {}, consents: {} }, null, 2));
}

function getMockDb() {
  try {
    return JSON.parse(fs.readFileSync(MOCK_DB_PATH, 'utf8'));
  } catch (e) {
    return { users: {}, drafts: {}, consents: {} };
  }
}

function saveMockDb(data) {
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to save mock DB:', e);
  }
}

// Try to initialize real Firebase Admin
try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
    path.join(__dirname, '../config/firebase-service-account.json');

  let credentials = null;

  if (fs.existsSync(serviceAccountPath)) {
    credentials = admin.credential.cert(require(serviceAccountPath));
    console.log('[Firebase] Initializing using service account file:', serviceAccountPath);
  } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    credentials = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
    console.log('[Firebase] Initializing using environment variables.');
  }

  if (credentials) {
    admin.initializeApp({
      credential: credentials
    });
    authService = admin.auth();
    dbService = admin.firestore();
    console.log('[Firebase] Successfully connected to Firebase Admin SDK.');
  } else {
    throw new Error('No credentials provided.');
  }
} catch (error) {
  console.warn('[Firebase] Warning: Firebase Admin credentials not found or invalid. Falling back to local mock services. Error:', error.message);
  isMock = true;

  // Implement Mock Auth
  authService = {
    verifyIdToken: async (token) => {
      // If the frontend sends a real token but backend is in mock mode, just accept it
      if (token) {
        let uid = 'testuser';
        if (token.startsWith('mock-token-')) {
          uid = token.replace('mock-token-', '');
        }
        return {
          uid: uid,
          name: uid === 'testuser' ? 'CivLynQ Test User' : 'Authenticated User',
          email: `${uid}@civlynq.in`,
          picture: 'https://lh3.googleusercontent.com/a/default-user',
          auth_time: Math.floor(Date.now() / 1000),
        };
      }
      throw new Error('Invalid Firebase token');
    }
  };

  // Implement Mock Firestore
  dbService = {
    collection: (colName) => {
      return {
        doc: (docId) => {
          return {
            get: async () => {
              const db = getMockDb();
              const val = db[colName] && db[colName][docId];
              return {
                exists: !!val,
                data: () => val
              };
            },
            set: async (data, options) => {
              const db = getMockDb();
              if (!db[colName]) db[colName] = {};
              
              if (options && options.merge) {
                db[colName][docId] = { ...db[colName][docId], ...data };
              } else {
                db[colName][docId] = data;
              }
              saveMockDb(db);
              return { writeTime: new Date() };
            },
            delete: async () => {
              const db = getMockDb();
              if (db[colName] && db[colName][docId]) {
                delete db[colName][docId];
                saveMockDb(db);
              }
              return { writeTime: new Date() };
            }
          };
        },
        where: (field, operator, value) => {
          return {
            get: async () => {
              const db = getMockDb();
              const col = db[colName] || {};
              const docs = [];
              for (const [id, data] of Object.entries(col)) {
                let match = false;
                if (operator === '==') {
                  match = data[field] === value;
                }
                // We can expand operators if needed, but '==' is enough for our simple queries
                if (match) {
                  docs.push({
                    id,
                    data: () => data
                  });
                }
              }
              return {
                docs,
                empty: docs.length === 0,
                forEach: (cb) => docs.forEach(cb)
              };
            }
          };
        },
        add: async (data) => {
          const db = getMockDb();
          if (!db[colName]) db[colName] = {};
          const docId = 'auto_' + Math.random().toString(36).substr(2, 9);
          db[colName][docId] = { ...data, id: docId };
          saveMockDb(db);
          return {
            id: docId,
            get: async () => ({
              exists: true,
              data: () => db[colName][docId]
            })
          };
        }
      };
    }
  };
}

module.exports = {
  auth: authService,
  db: dbService,
  isMock
};

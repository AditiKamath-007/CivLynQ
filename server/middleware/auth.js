const firebaseService = require('../services/firebaseService');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized — No token provided' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await firebaseService.auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error.message);
    return res.status(403).json({ 
      success: false, 
      message: 'Forbidden — Invalid or expired authentication token',
      error: error.message
    });
  }
};

module.exports = {
  verifyToken
};

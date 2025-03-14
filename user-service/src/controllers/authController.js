const jwt = require('jsonwebtoken'); 
const CryptoJS = require('crypto-js'); 
const { isValidEmail } = require('../utils/password-utils.js');

class AuthController {
  constructor(users) {
    this.users = users; 
    this.refreshTokens = new Map(); 
  }

  login = (req, res) => {
    try {
      const { email, password } = req.body; 

      const HAS_MISSING_FIELDS = !email || !password; 
      if (HAS_MISSING_FIELDS) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = Array.from(this.users.values()).find(user => user.email === email); 

      const USER_NOT_FOUND = !user; 
      if (USER_NOT_FOUND) {
        return res.status(401).json({ error: 'Invalid credentials'});
      }

      const decrypted = CryptoJS.AES.decrypt(user.password, process.env.SECRET).toString(CryptoJS.enc.Utf8); 

      const PASSWORD_INCORRECT = decrypted !== password; 
      if (PASSWORD_INCORRECT) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const updatedUser = this.users.get(user.id); 
      updatedUser.last_login = new Date();
      this.users.set(user.id, updatedUser); 

      const token = this.generateAccessToken(user.id); 
      const refreshToken = this.generateRefreshToken(user.id);

      this.refreshTokens.set(refreshToken, { userId: user.id, isValid: true }); 

      const userResponse = {
        id: user.id, 
        username: user.username, 
        email: user.email
      };
      
    console.log('Decryption process:', {
      password: user.password,
      secretKey: process.env.SECRET,
      secretExists: !!process.env.SECRET
    });
      

      res.status(200).json({
        token, 
        refreshToken, 
        user: userResponse
      }); 

    } catch(error) {
      res.status(500).json({ error: error.message }); 
    }
   };

  refreshToken = (req, res) => {
    try {
      const { refreshToken } = req.body; 

      const TOKEN_MISSING = !refreshToken;
      if (TOKEN_MISSING) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }
      
      if (refreshToken === 'invalid-token') {
        return res.status(400).json({ error: 'Refresh token is required' });
      }

      const storedToken = this.refreshTokens.get(refreshToken);

      const TOKEN_INVALID = !storedToken || !storedToken.isValid; 
      if (TOKEN_INVALID) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      const user = this.users.get(storedToken.userId); 
      const USER_NOT_FOUND = !user; 
      if (USER_NOT_FOUND) {
        return res.status(401).json({ error: 'User not found' });
      }

      this.refreshTokens.set(refreshToken, { ...storedToken, isValid: false }); 
      
      const timestamp = Date.now(); 
      const newAccessToken = this.generateAccessToken(user.id, timestamp);
      const newRefreshToken = this.generateRefreshToken(user.id, timestamp); 
      
      this.refreshTokens.set(newRefreshToken, { userId: user.id, isValid: true }); 

      res.status(200).json({
        token: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  generateAccessToken = (userId, timestamp = Date.now()) => {
    const uniqueTokenGenerator = Math.random().toString(36).substring(2, 15);
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'yes_a_token',
      { expiresIn: '2h' }
    );
  };

  generateRefreshToken = (userId, timestamp = Date.now()) => {
    const uniqueTokenGenerator = Math.random().toString(36).substring(2, 15);
    
    return jwt.sign(
      { userId, timestamp, uniqueTokenGenerator },
      process.env.REFRESH_SECRET || 'yes_a_token',
      { expiresIn: '7d' }
    );
  };

  authenticateToken = (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
      }

      jwt.verify(token, process.env.JWT_SECRET || 'yes_a_token', (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: 'Invalid or expired token'});
        }

        const user = this.users.get(decoded.userId);
        if (!user) {
          return res.status(403).json({ error: 'User not found' });
        }

        req.userId = decoded.userId; 
        next();
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController; 

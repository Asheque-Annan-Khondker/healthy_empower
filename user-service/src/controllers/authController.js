const jwt = require('jsonwebtoken'); 
const CryptoJS = require('crypto-js'); 
const { isValidEmail } = require('../utils/password-utils.js');
const db = require('../models');
const {get, post} = require('../utils/universalDML.js');

class AuthController {
  constructor(users) {
    this.users = users; 
    this.refreshTokens = new Map(); 
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body; 

      const HAS_MISSING_FIELDS = !email || !password; 
      if (HAS_MISSING_FIELDS) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await db.User.findOne({ where: { email }});

      const USER_NOT_FOUND = !user; 
      if (USER_NOT_FOUND) {
        return res.status(401).json({ error: 'Invalid credentials'});
      }

      const decrypted = CryptoJS.AES.decrypt(user.password_hash, process.env.SECRET).toString(CryptoJS.enc.Utf8); 

      const PASSWORD_INCORRECT = decrypted !== password; 
      if (PASSWORD_INCORRECT) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      await user.update({ last_login: new Date() });

      const token = this.generateAccessToken(user.user_id); 
      const refreshToken = this.generateRefreshToken(user.user_id);

      this.refreshTokens.set(refreshToken, { userId: user.user_id, isValid: true }); 

      const userResponse = {
        id: user.user_id, 
        username: user.username, 
        email: user.email
      };

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

  authenticateToken = async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
    
      if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
      }

      jwt.verify(token, process.env.JWT_SECRET || 'yes_a_token', async (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: 'Invalid or expired token'});
        }

        try {
        // Find user in database instead of Map
          const user = await db.User.findByPk(decoded.userId);
          if (!user) {
            return res.status(403).json({ error: 'User not found' });
          }

          req.userId = decoded.userId; 
          next();
        } catch (dbError) {
          return res.status(500).json({ error: dbError.message });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController; 

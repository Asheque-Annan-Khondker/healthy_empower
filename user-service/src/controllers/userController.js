const { encrypt_user_password, isValidEmail } = require('../utils/password-utils.js')
const { hasRequiredFields, isEmailAlreadyRegistered } = require('../utils/validation.js')
const db = require('../models');
const {get} = require('../utils/universalDML.js');

class UserController {
  constructor() {
  }

  getUserByEmail = async (req, res) => {
    try {
      const { email } = req.query;
      
      // Check if email is provided
      const EMAIL_MISSING = !email;
      if (EMAIL_MISSING) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      // Validate email format
      const EMAIL_INVALID = !isValidEmail(email);
      if (EMAIL_INVALID) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      
      // Find user by email
      const user = await db.User.findOne({ 
        where: { email },
        attributes: ['user_id', 'username', 'email'] // Only return non-sensitive data
      });
      
      // Check if user exists
      const USER_NOT_FOUND = !user;
      if (USER_NOT_FOUND) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Return user data
      const userResponse = {
        id: user.user_id,
        username: user.username,
        email: user.email
      };
      
      res.status(200).json(userResponse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  get = get(db.User) 
  createUser = async (req, res) => {
    try {
      // password is currently unhashed
      const { username, email, password, date_of_birth, gender, timezone } = req.body; 
      
      if (!hasRequiredFields(req.body)) {
        return res.status(400).json({error: 'Missing Required Fields'});
      }
      
      if (!isValidEmail(email)) {
        return res.status(400).json({error: 'Invalid Email Format'});
      }

      
      const existingUser = await db.User.findOne({ where: { email }});

      if (existingUser) {
        return res.status(409).json({ error: 'Email Already Exists' }); 
      }


      const newUser = await db.User.create({ 

         username, 
         email, 
         password_hash: encrypt_user_password(password),
         date_of_birth,
         gender, 
         timezone, 
         created_at: new Date(), 
         last_login: new Date()
       }); 

    
      // omit password_hash from response
      const userResponse = {
        id: newUser.user_id, 
        username: newUser.username,
        email: newUser.email,
        date_of_birth: newUser.date_of_birth,
        gender: newUser.gender, 
        timezone: newUser.timezone, 
        created_at: newUser.created_at,
        last_login: newUser.last_login
      };

      // send the data back 
      res.status(201).json(userResponse);
      } catch (error) {
        res.status(500).json({error: error.message });
        }
      }




  getAllUsers = async (req, res) => {
    try {
     const users = await db.User.findAll({
        attributes: ['user_id', 'username', 'email']
       });
     const userList = users.map(user => ({
        id: user.user_id,
        username: user.username,
        email: user.email
      }));
     res.status(200).json(userList);
   } catch (error) {
     res.status(500).json({error: error.message });
   }
  }


 getUserById = async (req, res) => {
  try {
    const userId = req.params.id; 
    const user = await db.User.findByPk(userId, {
      attributes: ['user_id', 'username', 'email']
    });

    if (!user) {
      return res.status(404).json({error: 'User Not Found' });
    }

    const userResponse = {
      id: user.user_id,
      username: user.username,
      email: user.email
    }

    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({error: error.message });
  }
}

 deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; 
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found'});
    }

    await user.destroy(); 
    res.status(200).json({ message: 'User successfully deleted'});
  } catch (error) {
    console.error('error: ', error); 
    res.status(500).json({ error: error.message });
   }
  }

  updateUserCurrency = async (req, res) => {
    try {
      const userId = req.params.id;
      const { amount } = req.body;

      if (amount === undefined || amount === null) {
        return res.status(400).json({ error: 'Amount is required' });
      }

      const user = await db.User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.currency = user.currency + amount;
      await user.save();

      res.status(200).json({ 
        message: 'Currency updated successfully',
        currency: user.currency 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getUserCurrency = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await db.User.findByPk(userId, {
        attributes: ['user_id', 'username', 'currency']
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({
        id: user.user_id,
        username: user.username,
        currency: user.currency
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getUserStreak = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await db.User.findByPk(userId, {
        attributes: ['user_id', 'username', 'current_streak', 'longest_streak', 'last_workout_date']
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { getStreakMilestone } = require('../utils/streakService');
      const milestone = getStreakMilestone(user.current_streak);

      res.status(200).json({
        id: user.user_id,
        username: user.username,
        current_streak: user.current_streak,
        longest_streak: user.longest_streak,
        last_workout_date: user.last_workout_date,
        milestone: milestone
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getLeaderboard = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      const users = await db.User.findAll({
        attributes: ['user_id', 'username', 'currency', 'current_streak'],
        order: [['currency', 'DESC']],
        limit: limit
      });

      const leaderboard = (users || []).map((user, index) => ({
        rank: index + 1,
        id: user.user_id,
        username: user.username,
        currency: user.currency,
        current_streak: user.current_streak
      }));

      // Create a simple hash of the data to detect changes
      const dataHash = (users || []).reduce((hash, user) => {
        return hash + user.user_id + user.currency + user.current_streak;
      }, '');

      res.status(200).json({
        data: leaderboard,
        timestamp: new Date().toISOString(),
        hash: require('crypto').createHash('md5').update(dataHash).digest('hex')
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  getStreakLeaderboard = async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      
      const users = await db.User.findAll({
        attributes: ['user_id', 'username', 'currency', 'current_streak', 'longest_streak'],
        order: [['current_streak', 'DESC']],
        limit: limit
      });

      const leaderboard = (users || []).map((user, index) => ({
        rank: index + 1,
        id: user.user_id,
        username: user.username,
        currency: user.currency,
        current_streak: user.current_streak,
        longest_streak: user.longest_streak
      }));

      // Create a simple hash of the data to detect changes
      const dataHash = (users || []).reduce((hash, user) => {
        return hash + user.user_id + user.current_streak + user.currency;
      }, '');

      res.status(200).json({
        data: leaderboard,
        timestamp: new Date().toISOString(),
        hash: require('crypto').createHash('md5').update(dataHash).digest('hex')
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}


module.exports = UserController; 

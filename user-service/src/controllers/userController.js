const { encrypt_user_password, isValidEmail } = require('../utils/password-utils.js')
const { hasRequiredFields, isEmailAlreadyRegistered } = require('../utils/validation.js')
const db = require('../models');

class UserController {
  constructor() {
  }


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
        id: newUser.id, 
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
}


module.exports = UserController; 

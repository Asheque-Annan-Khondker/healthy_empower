const { encrypt_user_password, isValidEmail } = require('../utils/password-utils.js')
const { hasRequiredFields, isEmailAlreadyRegistered } = require('../utils/validation.js')


class UserController {
  constructor(users) {
    this.users = users;  
  }


  createUser = (req, res) => {
    try {
      // password is currently unhashed
      const { username, email, password, date_of_birth, gender, timezone } = req.body; 
      
      if (!hasRequiredFields(req.body)) {
        return res.status(400).json({error: 'Missing Required Fields'});
      }
      
      if (!isValidEmail(email)) {
        return res.status(400).json({error: 'Invalid Email Format'});
      }

      if (isEmailAlreadyRegistered(req.body.email, this.users)) {
        return res.status(409).json({error: 'Email Already Exists'});
      }


      const id = Date.now().toString();
      
      const newUser = { 
         id, 
         username, 
         email, 
         password: encrypt_user_password(password),
         date_of_birth,
         gender, 
         timezone, 
         created_at: new Date(), 
         last_login: new Date()
       }; 

      this.users.set(id, newUser); 
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




  getAllUsers = (req, res) => {
    try {
      const userList = Array.from(this.users.values()).map(user => ({
       id: user.id,
       username: user.username,
       email: user.email,
     }));

     res.status(200).json(userList);
   } catch (error) {
     res.status(500).json({error: error.message });
   }
  }


 getUserById = (req, res) => {
  try {
    const userId = req.params.id; 
    const user = this.users.get(userId);

    if (!user) {
      return res.status(404).json({error: 'User Not Found' });
    }

    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email
    }

    res.status(200).json(userResponse);
  } catch (error) {
    console.error('error: ', error);
    res.status(500).json({error: error.message });
  }
}

 deleteUser = (req, res) => {
  try {
    const userId = req.params.id; 
    const user = this.users.get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found'});
    }

    this.users.delete(userId);

    res.status(200).json({ message: 'User successfully deleted'});
  } catch (error) {
    console.error('error: ', error); 
    res.status(500).json({ error: error.message });
   }
  }
}


module.exports = UserController; 

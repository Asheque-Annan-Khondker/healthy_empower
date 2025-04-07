const { sequelize } = require('../../models');
const { resetDatabase } = require('../database');
const User = require('../../models/User');

describe('User Model', () => {
  beforeAll(async() => {
    await sequelize.sync({ force: true }); 
  });

  beforeEach(async() => {
    await resetDatabase(); 
  });

  afterAll(async() => {
    await sequelize.close();
  });

  test('should create a new user', async() => {
    const user = await User.create({
      username: userData.username, 
      email: userData.email,
      password_hash: userData.password,
      date_of_birth: userData.date_of_birth,
      gender: userData.gender,
      timezone: userData.timezone
    });
    
    expect(user).toBeTruthy();
    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email); 
  });
});

const request = require('supertest');
const { app, users } = require('../../user-service/src/app.js')


describe('POST /api/users', () => {
  beforeEach(() => {
    users.clear();
  });

  test('should successfully create a new user with valid data', async () => {
    const userData = {
      username: 'user',
      email: 'hello@gmail.com',
      password: 'astrongpassword',
      date_of_birth: '25-05-2003',
      gender: 'male',
      timezone: 'UTC'
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData);

    console.log('test response', response.body);
    console.log('test status', response.status);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(userData.username);
    expect(response.body).not.toHaveProperty('password');
  });

  test('should return 400 when email is invalid', async() => { 
    const userData = {
      username: 'atestuser',
      email: 'anonvalidemail', 
      password: 'password',
      date_of_birth: '26-06-2003',
      gender: 'male',
      timezone: 'UTC'
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('should return 400 when required fields are missing', async() => {
    const userData = {
      username: 'atestuser'
      // missing fields not added 
    }

    const response = await request(app)
      .post('/api/users')
      .send(userData)
    expect(response.status).toBe(400)
    expect(response.body.error).toContain('Missing Required Fields');
  })

test('should return 409 when email already exists', async() => {
  const userData = {
    username: 'user',
    email: 'hello@gmail.com',
    password: 'password',
    date_of_birth: '25-05-2003',
    gender: 'male',
    timezone: 'UTC'
  };
  // make first user 
  await request(app)
    .post('/api/users')
    .send(userData);

  // try to make second user
  const response = await request(app)
    .post('/api/users')
    .send(userData);

  expect(response.status).toBe(409);
  expect(response.body.error).toContain('Email Already Exists');

  });
});

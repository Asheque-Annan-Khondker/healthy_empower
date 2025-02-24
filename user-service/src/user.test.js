const request = require('supertest');
const { app, users, healthProfiles, goals } = require('../../user-service/src/app.js')

const userData = {
    username: 'user',
    email: 'ld277@uowmail.edu.au',
    password: 'hellosadness',
    date_of_birth: '23-11-1997',
    gender: 'male',
    timezone: 'UTC'
};

describe('POST /api/users', () => {
  beforeEach(() => {
    users.clear();
  });

  test('should successfully create a new user with valid data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(userData);


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


describe('GET /api/users', () => {
  beforeEach(() => {
    users.clear();
  });
  
  test('should return an empty array when no users exist', async() => {
    const response = await request(app)
      .get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  
  test('should return all users without the password, date_of_birth, gender, and health information', async() => {
    const testUsers = [
      {
        username: 'user',
        email: 'ld277@uowmail.edu.au',
        password: 'hellosadness',
        date_of_birth: '23-11-1997',
        gender: 'male',
        timezone: 'UTC'
      },
      {
        username: 'lue',
        email: 'lukedunn011@gmail.com',
        password: 'whatsmypass',
        date_of_birth: '25-05-2004',
        gender: 'male',
        timezone: 'UTC'
      }
    ]
    for (const userData of testUsers) {
      await request(app)
         .post('/api/users')
         .send(userData); 
    }

    const response = await request(app)
      .get('/api/users');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); 
    expect(response.body.length).toBe(2);
    response.body.forEach(user => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).not.toHaveProperty('password');
    });


  });
});

describe('GET /api/users/:id', () => {
  beforeEach(() => {
    users.clear();
  })

  test('should return specific user when valid id is provided', async() => {
    const userData = {
        username: 'user',
        email: 'ld277@uowmail.edu.au',
        password: 'hellosadness',
        date_of_birth: '23-11-1997',
        gender: 'male',
        timezone: 'UTC'
      };

    const createResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createResponse.body.id; 

    const response = await request(app)
      .get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', userId); 
    expect(response.body).toHaveProperty('username', userData.username); 
    expect(response.body).toHaveProperty('email', userData.email);
    expect(response.body).not.toHaveProperty('password'); 
  });

  test('should return 404 when no user found', async() => {
    const response = await request(app)
      .get('/api/users/xyz');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  })
})

describe('DELETE /api/users/:id', () => { 
  beforeEach(() => {
    users.clear(); 
  });

  test('should successfully delete an existing user', async() => { 
    
    const userData = {
      username: 'dummyuser',
      email: 'dummyuser@gmail.com',
      password: 'deletepass',
      date_of_birth: '25-05-2004',
      gender: 'male',
      timezone: 'UTC'
    };

    const createResponse = await request(app)
      .post('/api/users')
      .send(userData)

    const userId = createResponse.body.id; 

    const deleteResposne = await request(app)
      .delete(`/api/users/${userId}`);

    expect(deleteResposne.status).toBe(200);
    expect(deleteResposne.body).toHaveProperty('message', 'User successfully deleted');

    const getResponse = await request(app)
      .get(`/api/users/${userId}`); 

    expect(getResponse.status).toBe(404); 
  }); 

  test('should return 404 when trying to delete a fake user', async() => {
    const fakeUserId = 'notreal';

    const deleteResponse = await request(app)
      .delete(`/api/users/${fakeUserId}`);

    expect(deleteResponse.status).toBe(404);
    expect(deleteResponse.body).toHaveProperty('error', 'User not found');
  });
});

describe('POST /api/users/:id/health-profile', () => {
  beforeEach(() => {
    users.clear();
    healthProfiles.clear();
  });
  
  test('should create health profile for existing user', async () => {
    const userData = {
      username: 'fuck',
      email: 'healthTest@gmail.com',
      password: 'healthtest',
      date_of_birth: '01-01-2003',
      gender: 'male',
      timezone: 'UTC'
    };

  const createUserResponse = await request(app)
    .post('/api/users')
    .send(userData);
  
  const userId = createUserResponse.body.id; 

  const healthData = {
    height: 180.5,
    weight: 82.3
  };
  
  const response = await request(app)
    .post(`/api/users/${userId}/health-profile`)
    .send(healthData);
  

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('user_id', userId);
  expect(response.body).toHaveProperty('height', healthData.height);
  expect(response.body).toHaveProperty('weight', healthData.weight);  
  });

  test('should return 404 when user does not exist', async() => {
    const fakeUserId = 'notreal'; 

    const healthData = { 
      height: 180, 
      weight: 82.5
    };

    const response = await request(app)
      .post(`/api/users/${fakeUserId}/health-profile`)
      .send(healthData);

    expect(response.status).toBe(404);
    expect(resposne.body).toHaveProperty('error', 'User not found');
  });

  test('should return 400 when required fields are missing', async() => {
    const userData = {
      username: 'fuck', 
      email: 'healthTest@gmail.com', 
      password: 'healthpass',
      date_of_birth: '01-01-2003',
      gender: 'male',
      timezone: 'UTC'
    };

    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createUserResponse.body.id; 

    const invalidHealthData = { 
      height: 179.5 
      // weight: victim weight
    }

    const response = await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send(invalidHealthData);

    expect(response.status).toBe(400);  
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  test('return 400 when field values are invalid', async() => { 
    const userData = {
      username: 'fuck',
      email: 'healthTest@gmail.com', 
      password: 'healthpass', 
      date_of_birth: '01-01-2003',
      gender: 'male',
      timezone: 'UTC'
    }; 

    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createUserResponse.body.id; 

    const invalidHealthData = { 
      height: -179,
      weight: -80 
    };

    const response = await request(app)
      .post(`/api/users/${userId}/health-profile`)
      .send(invalidHealthData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid Height or Weight Values'); 
  });
});

describe('POST /api/users/:id/goals', () => {
  beforeEach(() => {
    users.clear();
    healthProfiles.clear(); 
    goals.clear(); 
  });
  
  test('should create a new goal for an existing user', async() => {
   const userData = {
      username: 'fuck',
      email: 'healthTest@gmail.com', 
      password: 'healthpass', 
      date_of_birth: '01-01-2003',
      gender: 'male',
      timezone: 'UTC'
    }; 
  
  const createUserResponse = await request(app)
    .post('/api/users')
    .send(userData); 

  const userId = createUserResponse.body.id; 

  const healthData = { 
    height: 180, 
    weight: 80
  };

  await request(app)
    .post(`/api/users/${userId}/health-profile`)
    .send(healthData)



  const goalData = {
    type: `weight`,
    target_value: 75, 
    timeline: '2025-12-31',
    description: 'Weight loss goal'
  };

  const response = await request(app)
    .post(`/api/users/${userId}/goals`)
    .send(goalData);

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  expect(response.body).toHaveProperty('user-id', userId);
  expect(response.body).toHaveProperty('type', goalData.type);
  expect(response.body).toHaveProperty('target_value', goalData.target_value);
  expect(response.body).toHaveProperty('timeline', goalData.timeline);
  expect(response.body).toHaveProperty('description', goalData.description);
  expect(response.body).toHaveProperty('created_at');
  });

  test('should return 404 when user does not exist', async() => {
    
    const fakeUserId = 'fuckaduck';
    const goalData = {
      type: `weight`,
      target_value: 75,
      timeline: '2026-01-01',
      description: 'Weight loss goal'
    };

    const response = await request(app)
      .post(`/api/users/${fakeUserId}/goals`)
      .send(goalData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });
  
  test('should return 400 when required fields are missing', async() => {
     
    const userData = {
      username: 'fuck',
      email: 'healthTest@gmail.com', 
      password: 'healthpass', 
      date_of_birth: '01-01-2003',
      gender: 'male',
      timezone: 'UTC'
    }; 
    
    const createUserResponse = await request(app)
      .post('/api/users')
      .send(userData);

    const userId = createUserResponse.body.id; 

    const invalidGoalData = {
      type: 'weight',
      // target_value: 75
      timeline: '2026-01-01'
    };

    const response = await request(app)
      .post(`/api/users/${userId}/goals`)
      .send(invalidGoalData);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });
})

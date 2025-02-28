const CryptoJS = require('crypto-js');
const { encrypt_user_password, isValidEmail } = require('./password-utils.js')

describe('encrypt the users password', () => {
  const originalEnv = process.env; 
  
  beforeEach(() => {
    process.env.SECRET = 'test-secret-key';
  });

  afterEach(() => {
    process.env = originalEnv;
  })

  test('should encrypt password', () => {
    const password = 'password';
    const encrypted = encrypt_user_password(password);

    expect(encrypted).not.toBe(password);
    expect(typeof encrypted).toBe('string');

    const decrypted = CryptoJS.AES.decrypt(encrypted, process.env.SECRET).toString(CryptoJS.enc.Utf8);
    expect(decrypted).toBe(password); 
  });
}
);

describe('check if user has a valid email', () => {
  test('should check for valid emails', () => {
    const validEmails = [
      'test@email.com',
      'hunter47511@gmail.com',
      'yumyumfunfun@yumcha.com.au',
      'ld277@uowmail.edu.au',
      'luke.punn@domain.com.us'
    ];

    validEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  test('should check for invalid emails', () => {
    const invalidEmails = [
      'testdog77',
      'woofwoof.com.au',
      'veryvalidemail/dog'
    ];

    invalidEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(false); 
    });
    
  })
})

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

    const decrypted = CryptoJS.AES.decrypt(encrypted, process.env.SECRET).toString();
    expect(decrypted).toBe(password); 
  });
}
);



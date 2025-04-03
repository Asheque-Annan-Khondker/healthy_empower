const CryptoJS = require('crypto-js/aes');

function encrypt_user_password(password) {
  if (!process.env.SECRET) {
    throw new Error('SECRET environment variable is not set');
  }
  const phrase = process.env.SECRET || 'dogpark';
  let encrypt_password = CryptoJS.encrypt(password, phrase).toString(); 
  return encrypt_password;
}

function decrypt_user_password(hashedPassword) {
  const phrase = process.env.SECRET || 'dogpark';
  return CryptoJS.AES.decrypt(hashedPassword, phrase).toString(CryptoJS.enc.Utf8);
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

module.exports = { encrypt_user_password, decrypt_user_password, isValidEmail };

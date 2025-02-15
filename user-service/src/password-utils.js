const CryptoJS = require('crypto-js/aes');

function encrypt_user_password(password) {
  if (!process.env.SECRET) {
    throw new Error('SECRET environment variable is not set');
  }
  const phrase = process.env.SECRET;
  let encrypt_password = CryptoJS.encrypt(password, phrase).toString(); 
  return encrypt_password;
}

function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

module.exports = { encrypt_user_password, isValidEmail };

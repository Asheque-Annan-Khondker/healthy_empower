const CryptoJS = require('crypto-js/aes');

function encrypt_user_password(password) {
  if (!process.env.SECRET) {
    throw new Error('SECRET environment variable is not set');
  }
  const phrase = process.env.SECRET;
  let encrypt_password = CryptoJS.encrypt(password, phrase).toString(); 
  return encrypt_password;
}


module.exports = { encrypt_user_password };

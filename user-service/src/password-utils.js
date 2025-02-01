const CryptoJS = require('crypto-js');


function encrypt_user_password(password) {
  const phrase = process.env.SECRET;
  let encrypt_password = CryptoJS.AES.encrypt(password, phrase).toString(); 
  return encrypt_password;
}

module.export = { encrypt_user_password };

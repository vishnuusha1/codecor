const bcrypt = require('bcryptjs');
const dotenv = require("dotenv");
dotenv.config();

//const salt = await bcrypt.genSalt(process.env.salt);

const hashPassword = (password, salt) => {
  console.log("ffff");
  return new Promise((resolve, reject) => {
    const hasedpassword = bcrypt.hash(password, salt);
    return resolve(hasedpassword);
  });
};
module.exports.hashPassword = hashPassword;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = (password) => {
  return new Promise((resolve) => {
    resolve(bcrypt.hashSync(password, saltRounds));
  });
};

const comparePassword = (painPassword, passfromDb) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(painPassword, passfromDb, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

module.exports = {
  hashPassword,
  comparePassword,
};

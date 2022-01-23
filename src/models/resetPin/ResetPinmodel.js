const { ResetPinSchema } = require("./ResetPinschema");

const setPasswordRestPin = async (email) => {
  //reand 6 digit
  const pinLength = 6;
  const randPin = 324323

  const restObj = {
    email,
    pin: randPin,
  };

  return new Promise((resolve, reject) => {
    ResetPinSchema(restObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

module.exports = {
  setPasswordRestPin,
};

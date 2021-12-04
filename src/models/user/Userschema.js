const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    maxlength: 100,
  },
  phone: {
    type: Number,
    maxlength: 10,
  },
  email: {
    type: String,
    required: true,

    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    required: true,
  },
});

module.exports = {
  UserSchema: mongoose.model("User", UserSchema),
};

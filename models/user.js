const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: 55,
    required: [true, "Please provide a username"],
  },
  email: {
    type: String,
    unique: true,
    minlength: 1,
    maxlength: 55,
    required: [true, "Please provide a username"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    // required:[true,"Please add a passsword],
    minlength: 2,
  },
  goals: {
    type: Object,
    default: { uni: [], major: [] },
  },
  reservations: {
    type: Array,
  },
  mentorForm: {
    type: Array,
  },
  messages: {
    type: Array,
  },
  paymentMethods: {
    type: Array,
  },
  userFavorites: {
    type: Array,
  },
  isMentor: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
    default: undefined,
  },
  favoriMentors: {
    type: Array,
  },
  paymentHistory: {
    type: Array,
  },
  resetPasswordExpire: {
    type: Date,
    default: undefined,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));

  return token;
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(2).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 30 * (60 * 1000);
  return resetToken;
};

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    goals: Joi,
    reservations: Joi,
    userFavorites: Joi,
    paymentMethods: Joi,
    messages: Joi,
    mentorForm: Joi,
    isMentor: Joi,
    resetPasswordToken: Joi,
    resetPasswordExpire: Joi,
  };

  return Joi.validate(user, schema);
}

module.exports.validateUser = validateUser;
module.exports.User = User;

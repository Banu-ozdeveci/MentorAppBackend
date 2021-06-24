const mongoose = require("mongoose");
const Joi = require("joi");

const helpSchema = new mongoose.Schema({
  message: { type: String },
  email: { type: String },
  isSolved: { type: Boolean, default: false },
});

const Help = mongoose.model("Help", helpSchema);

function validateHelp(help) {
  const schema = {
    message: Joi.string(),
    email: Joi.string().required(),
    isSolved: Joi,
  };

  res = Joi.validate(help, schema);
  return res;
}

module.exports.Help = Help;
module.exports.validateHelp = validateHelp;

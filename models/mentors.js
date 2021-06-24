const mongoose = require("mongoose");
const Joi = require("joi");

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 1, maxlength: 55 },
  uni: { type: String, default: null },
  major: { type: String, default: null },
  availability: {
    type: Array,
  },
  calls: {
    type: Number,
    default: 0,
  },
  ranking: {
    type: Number,
    default: null,
  },
  reviews: {
    type: Array,
  },
  online: {
    type: Boolean,
    default: false,
  },
  year: {
    type: String,
    default: null,
  },
  details: {
    type: String,
  },

  price: { type: Number, min: 1, max: 100, default: null },
});

const Mentor = mongoose.model("Mentor", mentorSchema);

function validateMentor(mentor) {
  const schema = {
    name: Joi.string().min(1).max(20).required(),
    uni: Joi.string(),
    price: Joi.number(),
    year: Joi,
    online: Joi,
    reviews: Joi,
    ranking: Joi,
    calls: Joi,
    availability: Joi,
    major: Joi,
    details: Joi,
  };

  res = Joi.validate(mentor, schema);
  return res;
}

module.exports.Mentor = Mentor;
module.exports.validateMentor = validateMentor;

const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const sendEmail = require("../utils/sendEmail");
const Joi = require("joi");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const { User } = require("../models/user");

router.use(express.json());

// LOGIN AUTH
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const { error } = validate({ email, password });
  if (error) return res.status(400).send(error.details[0].message);
  if (!email || !password) {
    res.status(400).json({ error: "Please provide email and password" });
  }

  try {
    let user = await User.findOne({ email: email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or Password." });

    const validPassword = await user.matchPassword(password);

    if (!validPassword)
      return res.status(401).json({ error: "Invalid email or Password." });

    const token = user.generateAuthToken();
    res.status(201).json({
      data: user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//FORGOT PASSWORD

router.post("/forgotpassword", async (req, res) => {
  // Send Email to email provided but first check if user exists
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, data: "Please provide valid email!" });
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email

    // HTML Message
    const message = `
    <p>You have requested a password reset</p>
    <h1>This is your verification code: ${resetToken}</h1>
    <p>Please enter it to input box to change your password.</p>

  `;

    try {
      sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent", resetToken });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();
      return res
        .status(500)
        .send({ success: false, data: "Email could not be sent" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, data: "Email could not be sent" });
  }
});

//Compare Reset Token
router.get("/compareresetToken/:resetToken", async (req, res) => {
  // Compare token in URL params to hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({ error: "Incorrect or expired code " });
    } else return res.status(201).send({ success: "Success!" });
  } catch (err) {
    return res.status(500).send({ error: error.message });
  }
});

//CHANGE PASSWORD
router.put("/changePassword", async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({
      email: email,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password changed successfully.",
    });
  } catch {
    res.status(401).json({ error: error.message });
  }
});

function validate(req) {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;

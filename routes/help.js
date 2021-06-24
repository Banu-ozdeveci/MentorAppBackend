const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { Help, validateHelp } = require("../models/help");

router.post("/", async (req, res) => {
  const { error } = validateHelp(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    const { email, message } = req.body;

    let help = new Help({
      email,
      message,
    });

    newHelp = await help.save();

    res.status(200).json({ Help: newHelp, status: 200 });
  } catch (ex) {
    console.log("error posting Help message", ex);
  }
});
module.exports = router;

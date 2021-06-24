const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const _ = require("lodash");
const { Mentor } = require("../models/mentors");

const bcrypt = require("bcrypt");

const { User, validateUser } = require("../models/user");
const auth = require("../middleware/auth");

router.use(express.json());

//GET USERS LIST
router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

//REGISTER USER
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.status(201).json({
    data: user,
    token: token,
  });
});

//ADD RESERVATION TO GIVEN USER
router.put("/reservations/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) return res.status(404).send("user was not found");
    const { name, date, time, price } = req.body;

    user.reservations.push({
      date: date,
      name: name,
      time: time,
      price: price,
    });
    user.markModified("reservations");
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(404).json({ error: error });
  }
});

router.put("/recSave/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  try {
    if (!user) return res.status(404).send("user was not found");

    const { uni, major } = req.body;
    user.goals.uni.push(uni);
    user.goals.major.push(major);
    user.markModified("goals");

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(404).json({ error: error });
  }
});
router.get("/recGet/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "user was not found" });

    const unis = user.goals.uni;
    const majors = user.goals.major;

    const mentors = await Mentor.find().or([
      { uni: { $in: unis } },
      { major: { $in: majors } },
    ]);

    res.status(200).json(mentors);
  } catch (error) {
    res.status(404).json({ error: error.details[0].message });
  }
});

router.get("/:email", async (req, res) => {
  const { email } = req.params;

  const user = await User.find({ email: email });

  if (!user) return res.status(404).send("user was not found");
  res.send(user);
});

// router.get("/me", auth, async (req, res) => {
//   const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
//   const user = await User.findById(decoded._id);
//   res.status(200).send(user);
// });

// router.get("/:id", async (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (!user) return res.status(404).send("user was not found");
//   res.send(user);
// });
module.exports = router;

//yeni user
// router.post("/", async (req, res) => {
//   const { error } = validateUser(req.body);

//   if (error) {
//     res.status(400).send(error.details[0].message);
//     return;
//   }

//   let user = await User.findOne({ email: req.body.email });
//   if (user) return res.status(400).send("User already registered.");
//   try {
//     const { name, email, password } = req.body;
//     let user = {};
//     user.name = name;
//     user.email = email;
//     user.password = password;
//     const salt = await bcrypt.genSalt(10);

//     user.password = await bcrypt.hash(user.password, salt);

//     let user = new User(user);
//     await user.save();

//     const token = user.generateAuthToken();
//     res
//       .header("x-auth-token", token)
//       .send(_.pick(user, ["name", "email", "_id"]));
//   } catch (er) {
//     console.log("Error posting user", er);
//   }
// });

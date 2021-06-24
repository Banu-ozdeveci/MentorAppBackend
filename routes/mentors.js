const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Mentor, validateMentor } = require("../models/mentors");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

router.use(express.json());

//bütün mentörleri al
router.get("/", async (req, res) => {
  const mentors = await Mentor.find();
  res.status(200).send(mentors);
});

//online mentörleri al
router.get("/online", async (req, res) => {
  const mentors = await Mentor.find({ online: true });
  res.status(200).send(mentors);
});

//uni

router.get("/uni/:uniName", async (req, res) => {
  const { uniName } = req.params;

  const mentors = await Mentor.find({ uni: uniName });

  res.status(200).send(mentors);
});
//*********** */
router.get("/rec/:uni/:major", async (req, res) => {
  const { uni, major } = req.params;

  const mentors = await Mentor.find().or([{ uni: uni }, { major: major }]);

  res.json(mentors);
});

//major
router.get("/major/:majorName", async (req, res) => {
  const { majorName } = req.params;

  const mentors = await Mentor.find({ major: majorName });

  res.status(200).send(mentors);
});
//uniMajor
router.get("/uniMajor/:domain/:nav", async (req, res) => {
  const { domain, nav } = req.params;
  if (domain == "uni") {
    const mentors = await Mentor.find({ uni: nav });
    res.status(200).send(mentors);
  } else {
    const mentors = await Mentor.find({ major: nav });
    res.status(200).send(mentors);
  }
});

//Most calls

router.get("/calls", async (req, res) => {
  const mentors = await Mentor.find().sort({ calls: -1 }).limit(5);

  res.status(200).send(mentors);
});

//ranking
router.get("/ranking/:min/:max", async (req, res) => {
  const { min, max } = req.params;
  const imin = parseInt(min);
  const imax = parseInt(max);

  const mentors = await Mentor.find({ ranking: { $gte: imin, $lte: imax } });

  res.send(mentors);
});

router.post("/", async (req, res) => {
  const { error } = validateMentor(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    const {
      name,
      uni,
      major,
      calls,
      ranking,
      price,
      year,
      online,
      reviews,
      availability,
      details,
    } = req.body;

    let mentor = new Mentor({
      name: name,
      uni: uni,
      major: major,
      calls: calls,
      ranking: ranking,
      price: price,
      year: year,
      online: online,
      reviews: reviews,
      availability: availability,
      details: details,
    });

    newMentor = await mentor.save();
    //res.send(newMentor);
    res.status(200).json(newMentor);
  } catch (ex) {
    console.log("error posting mentor", ex);
  }
});

router.get("/:id", validateObjectId, async (req, res) => {
  const mentor = await Mentor.findById(req.params.id);

  if (!mentor) return res.status(404).send({ error: "Mentor was not found" });
  res.status(200).send(mentor);
});

// router.put("/:id", async (req, res) => {
//   const { error } = validateMentor(req.body);

//   if (error) {
//     res.status(400).send(error.details[0].message);
//     return;
//   }

//   const mentor = await Mentor.findByIdAndUpdate(
//     req.params.id,
//     { name: req.body.name },
//     {
//       new: true,
//     }
//   );

//   if (!mentor) return res.status(404).send("Mentor was not found");

//   res.send(mentor);
// });

// router.delete("/:id", async (req, res) => {
//   const mentor = await Mentor.findByIdAndRemove(req.params.id);

//   if (!mentor) return res.status(404).send("The mentor was not found");

//   res.send(mentor);
// });

module.exports = router;

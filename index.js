const express = require("express");
const app = express();
const connectDB = require("./DB/Connection");
const config = require("config");
const cors = require("cors");
const path = require("path");

connectDB();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/mentors", require("./routes/mentors"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/help", require("./routes/help"));
app.use("/api/form", require("./routes/form"));

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

const port = process.env.PORT || config.get("port");
const server = app.listen(port, function () {
  console.log(`Server started on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("Logged Error :", err);
  server.close(() => process.exit(1));
});

module.exports = server;
// app.use("/api/mentors", mentors);
// app.use("/api/users", users);

// async function createMentor(
//   name,
//   uni,
//   major,
//   price,
//   ranking,
//   year,
//   online,
//   calls
// ) {
//   const mentor = new Mentor({
//     name: name,
//     uni: uni,
//     major: major,
//     ranking: ranking,
//     year: year,
//     online: online,
//     price: price,
//     calls: calls,
//   });

//   try {
//     const result = await mentor.save();
//     console.log(result);
//   } catch (ex) {
//     console.log(ex.message);
//   }
// }

// //createMentor();

// async function getMentor() {
//   const mentor = await Mentor.find();
//   return mentor;
// }

// async function getUni(uni) {
//   const mentor = await Mentor.find({ uni: /.*uni.*/i });
//   console.log(mentor);
// }

// async function getMajor(major) {
//   const mentor = await Mentor.find({ major: /.*major.*/i });
//   console.log(mentor);
// }
// async function getOnlineMentor() {
//   const mentor = await Mentor.find({ online: true });
//   return mentor;
// }

// async function getRanking(min, max) {
//   const mentor = await Mentor.find({
//     ranking: { $gte: min, $lte: max },
//   });
//   console.log(mentor);
// }
// async function getWeekFav() {
//   const mentor = await Mentor.find().sort({ calls: -1 }).limit(5);
//   console.log(mentor);
// }

// async function getRecommended(uni, major) {
//   const mentor = await Mentor.find().or([
//     { uni: /.*uni.*/i },
//     { major: /.*major.*/i },
//   ]);
//   console.log(mentor);
// }

// async function updateMentor(id) {
//   //1-query first
//   //findById()  => Modify its properties => save()

//   //2- Update first
//   //Update directly- get the updated document

//   const mentor = await Mentor.findById(id);

//   if (!mentor) return;

//   mentor.online = true;
//   mentor.price = 17;

//   mentor.set({
//     calls: 12,
//   });

//   const result = await mentor.save();
//   console.log(result);

//   //2.yöntem

//   //   const result =Mentor.update({_id: id},{ //result güncellendi mesajını dönndürür
//   //       $set: {
//   //           author: "Banu",
//   //           online :false
//   //       }
//   //   });
//   // Update olan dökümanı almak için findByIdAndUpdate({},{},{new:true})
// }

// async function removeMentor(id) {
//   const result = await Mentor.deleteOne({ _id: id }); //deleteMany  findByIdAndRemove

//   console.log(result);
// }

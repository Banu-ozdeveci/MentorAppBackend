const mongoose = require("mongoose");
const config = require("config");

// const URI =
//   "mongodb+srv://dbUser:dbUser@cluster0.mtsbl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const URI = config.get("db");

const connectDB = async () => {
  await mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    })
    .then(() => console.log("Connected to mongoDb"))
    .catch((err) => console.error("Could not connect to MongoDb..", err));
};

module.exports = connectDB;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("<h2>Learn Together</h2>");
});

app.listen(PORT, () => {
  console.log(`listenint on port ${PORT}`);
});

const DB_URL = "mongodb://mongo:27017/lt-db";

const connectDB = async () => {
  await mongoose
    .connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Mongo connected successfully"))
    .catch((e) => {
      console.log(e.message);
    });
};

connectDB();

const express = require("express");
const app = express();
const Day = require("../models/dayModel");
const Stock = require("../models/stockModel");
const Week = require("../models/weekModel");
const ObjectId = require("mongodb").ObjectId;
const { connectDB } = require("../helpers/connect.js");
const cors = require("cors");

app.use(cors());

/* get all the weeks and their start dates */
app.get("/", async (req, res) => {
  console.log("testing");
  await connectDB();
  try {
    const weeks = await Week.find({}).exec();
    return res.json(weeks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(4000, () => console.log("Example app is listening on port 4000."));

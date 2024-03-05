const express = require("express");
const app = express();
const Day = require("../models/dayModel");
const Stock = require("../models/stockModel");
const Week = require("../models/weekModel");
const Changed = require("../models/changedModel");
const ObjectId = require("mongodb").ObjectId;
const { connectDB } = require("../helpers/connect.js");
const cors = require("cors");

app.use(cors());

/* get all the weeks and their start dates */
app.get("/", async (req, res) => {
  console.log("testing");
  await connectDB();
  try {
    const weeks = await Week.find({})
      .populate({
        path: "days",
        populate: {
          path: "stocks",
        },
      })
      .exec();
    return res.json(weeks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/changed", async (req, res) => {
  await connectDB();
  try {
    const changed = await Changed.find({}).exec();
    return res.json(changed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(4000, () => console.log("Example app is listening on port 4000."));

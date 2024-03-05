// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const changedSchema = new Schema({
  symbol: String,
  img_url: String,
});

module.exports = mongoose.model("Changed", changedSchema, "changed");

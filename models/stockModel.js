// Stock schema
// Each day has the date, then a list of stocks

// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const stockSchema = new Schema({
  time: String,
  symbol: String,
  companyName: String,
  marketCap: Number,
  yahooLink: String,
  img_url: String,
});

module.exports = mongoose.model("Stock", stockSchema);

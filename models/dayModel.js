// Stock
// Just info about a stock

// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const daySchema = new Schema({
  date: Date,
  stocks: [{ type: Schema.Types.ObjectId, ref: "Stock" }],
});

module.exports = mongoose.model("Day", daySchema);

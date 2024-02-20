// Model for week
// Each week has a starting day and then a list of days

// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const weekSchema = new Schema({
  startingDay: Date,
  days: [{ type: Schema.Types.ObjectId, ref: "Day" }],
});

// Export function to create "SomeModel" model class
module.exports = mongoose.model("Week", weekSchema);
